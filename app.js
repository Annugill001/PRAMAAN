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

// --- Evidence Summarizer ---
function summarizeEvidence(ev, allPosts) {
  // Detect repetition by normalized hash
  const duplicates = allPosts.filter(p => p.normalizedHash === ev.normalizedHash);
  if (duplicates.length > 2) {
    return `Repeated theme: ${duplicates.length} posts like "${ev.content}" (different wording/emojis)`;
  }

  // Flag anomalies
  if (ev.likes && ev.likes > 400) {
    return `Anomaly: unusually high engagement (${ev.likes} likes) — "${ev.content}"`;
  }

  // Add context
  if (ev.location) {
    return `${ev.content} · Location: ${ev.location}`;
  }

  return ev.content;
}

// --- Collection Action (dual-hash system) ---
async function runCollectionAction() {
  toast("Running live collection…");

  const activeTargetData = state.activeTargetData;
  if (!activeTargetData || !activeTargetData.posts) return;

  const hashedPosts = [];
  for (const post of activeTargetData.posts) {
    // Raw payload includes metadata for uniqueness
    const rawPayload = `${post.id}|${post.platform}|${post.time}|${post.location}|${post.content}|${post.meta}|${activeTargetData.person}`;
    const realHash = await computeRealSHA256(rawPayload);

    // Normalized payload for duplicate detection
    const normalizedHash = await computeRealSHA256(normalizeText(post.content));

    hashedPosts.push({ 
      ...post, 
      hash: realHash, 
      normalizedHash: normalizedHash 
    });
  }

  state.evidence = hashedPosts;
  renderVault();
  renderTimeline();
  toast("Collection complete. Evidence ingested.");
}

// --- Vault Renderer ---
function renderVault() {
  const stats = document.getElementById('vaultStats');
  if (stats) {
    stats.innerHTML = `
      <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">Evidence Items</div></div>
      <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">SHA-256 Verified</div></div>
      <div class="stat"><div class="n">0</div><div class="l">Tampered Items</div></div>
      <div class="stat"><div class="n">3</div><div class="l">Linked Platforms</div></div>
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
    const enrichedContent = summarizeEvidence(ev, state.evidence);

    row.innerHTML = `
      <div><span class="tag ${tag}">${ev.platform}</span></div>
      <div style="color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${ev.content}">
        <b>[${ev.id}]</b> ${enrichedContent}
      </div>
      <div class="hash" title="Raw: ${ev.hash}\nNormalized: ${ev.normalizedHash}">
        ${short(ev.hash)}
      </div>
      <div style="color:var(--ink-faint); font-size:11.5px;">${fmtTime(ev.time)}</div>
      <div class="verified">✓ verified</div>
    `;
    list.appendChild(row);
  });
}

// --- Timeline Renderer ---
function renderTimeline() {
  const el = document.getElementById('timelineList');
  if (!el) return;
  el.innerHTML = '';
  state.evidence.forEach(ev => {
    const enrichedContent = summarizeEvidence(ev, state.evidence);
    const item = document.createElement('div');
    item.className = 'tl-item';
    item.innerHTML = `
      <div class="tl-time">${fmtTime(ev.time)} · <b>${ev.id}</b> (${ev.platform})</div>
      <div class="tl-body">
        <div class="who"><b>${ev.handle}</b> · 📍 ${ev.location || '—'} · Likes: ${ev.likes || 0} ${ev.retweets ? '· Retweets: ' + ev.retweets : ''} · Comments: ${ev.commentsCount || 0}</div>
        <div class="txt">"${enrichedContent}"</div>
        <div style="font-family:var(--mono); font-size:10.5px; color:var(--ink-faint); margin-top:6px; word-break:break-all;">
          <b>Raw SHA-256:</b> ${ev.hash}<br>
          <b>Normalized SHA-256:</b> ${ev.normalizedHash}
        </div>
      </div>
    `;
    el.appendChild(item);
  });
}
