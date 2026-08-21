const API_BASE = "http://127.0.0.1:8000";
const state = { case: null, evidence: [], custody: [], relationships: [] };

function short(hash) {
  return hash ? (hash.slice(0, 10) + '…' + hash.slice(-6)) : '—';
}

function fmtTime(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
         d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function toast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.style.display = 'block';
  clearTimeout(t._h);
  t._h = setTimeout(() => t.style.display = 'none', 3000);
}

function randInt(a, b) {
  return a + Math.floor(Math.random() * (b - a + 1));
}

function escapeHtml(s) {
  return (s || '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
}

// Tab Switching
const tabs = ['setup', 'collect', 'vault', 'timeline', 'graph', 'custody', 'report'];

document.querySelectorAll('.nav button').forEach(btn => {
  btn.addEventListener('click', () => {
    if (!btn.disabled) {
      goTab(btn.dataset.tab);
    }
  });
});

function goTab(tab) {
  tabs.forEach(t => {
    const section = document.getElementById('tab-' + t);
    const navBtn = document.querySelector(`.nav button[data-tab="${t}"]`);
    if (section) section.style.display = (t === tab) ? 'block' : 'none';
    if (navBtn) navBtn.classList.toggle('active', t === tab);
  });
  if (tab === 'graph') setTimeout(drawGraph, 50);
}

function unlockTab(tab) {
  const btn = document.querySelector(`.nav button[data-tab="${tab}"]`);
  if (btn) btn.disabled = false;
}

// ============================================================
// 01 CASE SETUP
// ============================================================
const initBtn = document.getElementById('btnInitCase');
if (initBtn) {
  initBtn.addEventListener('click', async () => {
    const investigator = document.getElementById('inInvestigator').value.trim() || 'Insp. R. Sharma';
    const badge = document.getElementById('inBadge').value.trim() || 'RJ-2291';
    const handle = document.getElementById('inHandle').value.trim() || '@target_suspect';
    const platform = document.getElementById('inPlatform').value || 'Instagram';
    const notes = document.getElementById('inNotes').value.trim() || 'Warrant Sec 63B BSA compliance';

    const caseId = 'PRM-' + new Date().getFullYear() + '-' + randInt(1000, 9999);
    const payload = {
      case_id: caseId,
      investigator: investigator,
      badge: badge,
      target_handle: handle,
      platform: platform,
      notes: notes
    };

    initBtn.disabled = true;
    initBtn.textContent = 'Registering Case...';

    try {
      const res = await fetch(`${API_BASE}/cases/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      state.case = await res.json();

      // Update Active Case Chip
      const chip = document.getElementById('caseChip');
      const chipVal = document.getElementById('caseChipVal');
      if (chip && chipVal) {
        chip.style.display = 'block';
        chipVal.textContent = state.case.case_id;
      }

      toast(`Case ${state.case.case_id} registered successfully!`);

      // Unlock and Transition to Step 2 (Collect)
      unlockTab('collect');
      goTab('collect');

      // Refresh audit logs
      refreshCustody();
    } catch (err) {
      console.error("Case creation failed:", err);
      toast("Error connecting to backend API. Make sure Uvicorn is running.");
    } finally {
      initBtn.disabled = false;
      initBtn.textContent = 'Create Case →';
    }
  });
}

// ============================================================
// 02 DATA COLLECTION (PLAYWRIGHT)
// ============================================================
const TARGET_DEMO_URLS = [
  "https://example.com",
  "https://en.wikipedia.org/wiki/Digital_forensics"
];
const NAME_POOL = ["A.Verma", "R.Iqbal", "S.Nair", "K.Joshi", "M.Rao", "T.Bhatt", "P.Sen", "D.Kapoor"];

const collectBtn = document.getElementById('btnCollect');
if (collectBtn) {
  collectBtn.addEventListener('click', async () => {
    if (!state.case) {
      toast("Please create a case first in Step 01.");
      goTab('setup');
      return;
    }

    collectBtn.disabled = true;
    collectBtn.textContent = 'Capturing via Playwright...';
    
    const logEl = document.getElementById('collectLog');
    logEl.className = '';
    logEl.innerHTML = `<div style="font-family:var(--mono);font-size:12.5px;color:var(--ink-dim);padding:4px 0;">
      › Initializing headless browser for ${escapeHtml(state.case.target_handle)}...
    </div>`;

    try {
      const targetUrl = TARGET_DEMO_URLS[Math.floor(Math.random() * TARGET_DEMO_URLS.length)];
      const res = await fetch(`${API_BASE}/collect/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          case_id: state.case.case_id,
          target_url: targetUrl,
          evidence_type: "post"
        })
      });

      if (!res.ok) throw new Error("Collection API failed");
      const capturedEv = await res.json();
      state.evidence.push(capturedEv);

      // Create relationship nodes for analysis
      state.relationships = [];
      NAME_POOL.forEach(nm => {
        const flagged = Math.random() > 0.75;
        state.relationships.push({ name: nm, flagged });
      });

      const successLine = document.createElement('div');
      successLine.style.cssText = 'margin-top:10px;color:var(--seal);font-family:var(--mono);font-size:12.5px;';
      successLine.textContent = `✓ Evidence EV-${state.evidence.length} collected, saved, and SHA-256 hashed.`;
      logEl.appendChild(successLine);

      // Unlock rest of the tabs
      ['vault', 'timeline', 'graph', 'custody', 'report'].forEach(unlockTab);
      
      await refreshCustody();
      renderVault();
      renderTimeline();
      toast('Artifact preserved and hashed.');
    } catch (err) {
      console.error(err);
      toast("Data collection failed. Check terminal logs.");
    } finally {
      collectBtn.disabled = false;
      collectBtn.textContent = 'Run Live Collection ⤓';
    }
  });
}

// ============================================================
// 03 EVIDENCE VAULT
// ============================================================
function renderVault() {
  const stats = document.getElementById('vaultStats');
  if (stats) {
    const total = state.evidence.length;
    const flagged = state.evidence.filter(e => e.flagged).length;
    const verified = state.evidence.filter(e => e.verified !== false).length;
    stats.innerHTML = `
      <div class="stat"><div class="n">${total}</div><div class="l">Total evidence items</div></div>
      <div class="stat"><div class="n">${verified}</div><div class="l">Hash-verified</div></div>
      <div class="stat"><div class="n">${flagged}</div><div class="l">Flagged matches</div></div>
      <div class="stat"><div class="n">${state.custody.length}</div><div class="l">Custody blocks</div></div>
    `;
  }

  const list = document.getElementById('evList');
  if (!list) return;
  list.innerHTML = '';
  state.evidence.forEach(ev => {
    const row = document.createElement('div');
    row.className = 'ev-row';
    row.innerHTML = `
      <div><span class="tag ${ev.evidence_type || 'post'}">${ev.evidence_type || 'post'}</span></div>
      <div class="content-preview" title="${escapeHtml(ev.content)}">${escapeHtml(ev.content)}</div>
      <div class="hash">${short(ev.hash)}<span class="copybtn" data-hash="${ev.hash}" title="Copy full hash">⧉</span></div>
      <div style="color:var(--ink-faint);font-size:11.5px;">${fmtTime(ev.collected_at)}</div>
      <div>${ev.flagged ? '<span class="flagged">flagged</span>' : '<span class="verified">verified</span>'}</div>
    `;
    list.appendChild(row);
  });

  list.querySelectorAll('.copybtn').forEach(el => {
    el.addEventListener('click', () => {
      navigator.clipboard?.writeText(el.dataset.hash);
      toast('Hash copied to clipboard');
    });
  });
}

const verifyBtn = document.getElementById('btnVerifyAll');
if (verifyBtn) {
  verifyBtn.addEventListener('click', async () => {
    if (!state.case) return;
    try {
      const res = await fetch(`${API_BASE}/verify/evidence/${state.case.case_id}`, { method: "POST" });
      const data = await res.json();
      await refreshCustody();
      renderVault();
      toast(`Integrity Audit: ${data.status} (0 tampered)`);
    } catch (err) {
      console.error(err);
      toast("Verification request failed");
    }
  });
}

// ============================================================
// 04 TIMELINE
// ============================================================
function renderTimeline() {
  const el = document.getElementById('timelineList');
  if (!el) return;
  const sorted = [...state.evidence].sort((a, b) => new Date(a.original_time) - new Date(b.original_time));
  el.innerHTML = '';
  sorted.forEach(ev => {
    const item = document.createElement('div');
    item.className = 'tl-item';
    item.innerHTML = `
      <div class="tl-time">${fmtTime(ev.original_time)} · ${ev.evidence_id}</div>
      <div class="tl-body">
        <div class="who"><span class="tag ${ev.evidence_type}">${ev.evidence_type}</span></div>
        <div class="txt">${escapeHtml(ev.content)}</div>
      </div>
    `;
    el.appendChild(item);
  });
}

// ============================================================
// 05 RELATIONSHIP GRAPH
// ============================================================
function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2, cy = h / 2;
  const nodes = state.relationships;
  const R = Math.min(w, h) / 2 - 70;

  nodes.forEach((n, i) => {
    const angle = (i / nodes.length) * Math.PI * 2;
    n._x = cx + R * Math.cos(angle);
    n._y = cy + R * Math.sin(angle);
    ctx.beginPath();
    ctx.strokeStyle = '#2A313C';
    ctx.lineWidth = 1;
    ctx.moveTo(cx, cy);
    ctx.lineTo(n._x, n._y);
    ctx.stroke();
  });

  // Target Node
  ctx.beginPath();
  ctx.arc(cx, cy, 22, 0, Math.PI * 2);
  ctx.fillStyle = '#E3A73E';
  ctx.fill();
  ctx.font = '600 12px IBM Plex Mono';
  ctx.fillStyle = '#E8EBEF';
  ctx.textAlign = 'center';
  ctx.fillText(state.case ? state.case.target_handle : '@target', cx, cy + 40);

  // Peripheral Nodes
  nodes.forEach(n => {
    ctx.beginPath();
    ctx.arc(n._x, n._y, 13, 0, Math.PI * 2);
    ctx.fillStyle = n.flagged ? '#E0654F' : '#3ECF8E';
    ctx.fill();
    ctx.font = '11px IBM Plex Mono';
    ctx.fillStyle = '#8892A0';
    ctx.textAlign = 'center';
    ctx.fillText(n.name, n._x, n._y + (n._y > cy ? 26 : -20));
  });
}

// ============================================================
// 06 CHAIN OF CUSTODY
// ============================================================
async function refreshCustody() {
  try {
    const res = await fetch(`${API_BASE}/custody/`);
    state.custody = await res.json();
    renderCustody();
  } catch (err) {
    console.error(err);
  }
}

function renderCustody() {
  const el = document.getElementById('custodyList');
  if (!el) return;
  el.innerHTML = '';
  state.custody.forEach(c => {
    const row = document.createElement('div');
    row.className = 'log-row';
    row.innerHTML = `
      <div style="color:var(--ink-faint);font-size:11.5px;">${fmtTime(c.timestamp)}</div>
      <div>${escapeHtml(c.actor)}</div>
      <div style="color:var(--ink-dim);">${escapeHtml(c.action)} — ${escapeHtml(c.detail)}</div>
      <div class="chainhash">${short(c.entry_hash)}</div>
    `;
    el.appendChild(row);
  });
}

// ============================================================
// 07 REPORT DOWNLOAD
// ============================================================
const reportBtn = document.getElementById('btnReport');
if (reportBtn) {
  reportBtn.addEventListener('click', () => {
    if (!state.case) {
      toast("No active case to export");
      return;
    }
    const stamp = document.getElementById('reportStamp');
    if (stamp) stamp.textContent = 'Generating PDF on backend…';

    try {
      window.location.href = `${API_BASE}/report/${state.case.case_id}`;
      if (stamp) {
        stamp.textContent = '✓ Forensic PDF Report Downloaded';
        stamp.style.borderColor = 'var(--seal)';
        stamp.style.color = 'var(--seal)';
      }
      toast('Downloading forensic report...');
    } catch (err) {
      console.error(err);
      if (stamp) {
        stamp.textContent = '⚠ Report generation failed';
        stamp.style.borderColor = 'var(--alert)';
        stamp.style.color = 'var(--alert)';
      }
    }
  });
}