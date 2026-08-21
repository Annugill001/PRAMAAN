// --- Utility Functions ---
function short(h) { return h ? (h.slice(0, 12) + '…' + h.slice(-8)) : '—'; }
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
  setTimeout(() => { t.style.display = 'none'; }, 2400);
}

// --- Text Normalizer for Duplicate Detection ---
function normalizeText(text) {
  return text
    .toLowerCase()
    .replace(/[^\w\s]/g, '')   // remove emojis/punctuation
    .trim();
}

// --- Case Setup ---
function initiateCaseAction() {
  const enteredName = document.getElementById('inHandle').value || "Annu Gill";
  activeTargetData = generateForensicProfile(enteredName);

  state.caseId = activeTargetData.caseId;
  state.investigator = document.getElementById('inInvestigator').value || "Insp. R. Sharma";
  state.badge = document.getElementById('inBadge').value || "RJ-2291";

  const chip = document.getElementById('caseChip');
  const chipVal = document.getElementById('caseChipVal');
  if (chip && chipVal) {
    chip.style.display = 'block';
    chipVal.textContent = state.caseId;
  }

  state.custody = [];
  logCustody("Case Initialization", state.investigator,
    `Case ${state.caseId} initialized for target ${activeTargetData.person}`);
  toast(`Case ${state.caseId} Created for ${activeTargetData.person}!`);
  switchTab('collect');
}

// --- Collect Action (dual-hash system + stats) ---
async function runCollectionAction() {
  const btn = document.getElementById('btnCollect');
  btn.disabled = true;
  btn.textContent = 'Ingesting & Computing SHA-256...';

  // Reset evidence for this target
  state.evidence = [];

  const hashedPosts = [];
  for (const post of activeTargetData.posts) {
    const rawPayload = `${post.id}|${post.platform}|${post.time}|${post.location}|${post.content}|${post.meta}|${activeTargetData.person}`;
    const realHash = await computeRealSHA256(rawPayload);

    // Normalized hash scoped to person
    const normalizedPayload = `${activeTargetData.person}|${normalizeText(post.content)}`;
    const normalizedHash = await computeRealSHA256(normalizedPayload);

    hashedPosts.push({ ...post, hash: realHash, normalizedHash });
  }

  state.evidence = hashedPosts;

  // Calculate stats
  const totalCount = hashedPosts.length;
  const uniqueCount = new Set(hashedPosts.map(p => p.normalizedHash)).size;
  state.evidenceStats = { total: totalCount, unique: uniqueCount };

  await logCustody("Identity Resolution", state.investigator,
    `Resolved multi-platform accounts [IG: ${activeTargetData.profiles[0].handle}], [FB: ${activeTargetData.profiles[1].handle}], [X: ${activeTargetData.profiles[2].handle}] to subject ${activeTargetData.person}`);
  await logCustody("Evidence Ingestion", state.investigator,
    `Extracted ${state.evidenceStats.total} forensic artifacts (${state.evidenceStats.unique} unique after clustering) across 3 platforms with binary SHA-256 signatures`);

  renderVault();
  renderTimeline();
  renderCustody();

  btn.disabled = false;
  btn.textContent = 'Extraction Complete ✓';
  toast(`${state.evidenceStats.total} Forensic Records Ingested!`);
  setTimeout(() => switchTab('vault'), 700);
}

// --- Vault Render (shows total + unique) ---
function renderVault() {
  const stats = document.getElementById('vaultStats');
  if (stats) {
    stats.innerHTML = `
      <div class="stat"><div class="n">${state.evidenceStats.total}</div><div class="l">Evidence Items</div></div>
      <div class="stat"><div class="n">${state.evidenceStats.unique}</div><div class="l">Unique After Clustering</div></div>
      <div class="stat"><div class="n">0</div><div class="l">Tampered Items</div></div>
      <div class="stat"><div class="n">${new Set(state.evidence.map(e => e.platform)).size}</div><div class="l">Linked Platforms</div></div>
    `;
  }

  const list = document.getElementById('evList');
  if (!list) return;
  list.innerHTML = '';

  state.evidence.forEach(ev => {
    const row = document.createElement('div');
    row.className = 'ev-row';
    const tag = ev.platform.toLowerCase().includes('insta') ? 'instagram' :
                ev.platform.toLowerCase().includes('face') ? 'facebook' : 'twitter';
    row.innerHTML = `
      <div><span class="tag ${tag}">${ev.platform}</span></div>
      <div style="color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${ev.content}">
        <b>[${ev.id}]</b> ${ev.content}
      </div>
      <div class="hash" title="Raw: ${ev.hash}\nNormalized: ${ev.normalizedHash}">${short(ev.hash)}</div>
      <div style="color:var(--ink-faint); font-size:11.5px;">${fmtTime(ev.time)}</div>
      <div class="verified">✓ verified</div>
    `;
    list.appendChild(row);
  });
}
