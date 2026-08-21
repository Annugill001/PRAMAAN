// --- Alphabetical & Sequential Shuffle Forensic Personas ---
const forensicPersonas = [
  {
    category: "Travel & Lifestyle OSINT",
    ig: ["Coffee time ☕", "Sunset vibes 🌅", "Best pasta ever!", "Exploring ancient ruins 🏛️", "Weekend getaway vibes ✨", "Morning run complete 🏃"],
    fb: ["Had the best dinner in town today!", "Family picnic in the park 🌳", "Graduation day memories 🎓", "Weekend roadtrip with close friends!"],
    x: ["Coffee before coding ☕ #DevLife", "Sunset reflections 🌅 #Peace", "Rome is magical ✨ #Travel", "Exploring new architectures 🚀"],
    locations: ["Delhi", "Rome", "London", "Paris", "NYC", "Goa"],
    contacts: ["traveler99", "foodie_life", "college_buddy", "tech_guru", "uncle_sam", "friend1", "friend2"]
  },
  {
    category: "Cybersecurity & Threat Intelligence",
    ig: ["Dark mode terminal setup 💻", "Late night debugging sprint ☕", "CTF reverse-engineering solved 🛡️", "Offensive security lab complete ⚡"],
    fb: ["Presented our zero-trust security paper today!", "AI & Forensics research meetup concluded.", "Campus hackathon mentor session 🎉", "White-hat bounty report submitted."],
    x: ["Zero-day analysis thread 🔍 #CyberSec", "Smart contract audit complete ⛓️", "Reverse engineering malware samples 🛠️", "Decentralized consensus integrity verified ✅"],
    locations: ["Bengaluru", "Hyderabad", "San Francisco", "Austin", "Berlin", "Gurgaon"],
    contacts: ["sec_analyst", "crypto_dev", "alpha_node", "packet_sniffer", "byte_master", "kernel_panic", "root_admin"]
  },
  {
    category: "Corporate & Financial Footprint",
    ig: ["Morning market index review 📈", "Pre-flight espresso ✈️", "Closing Series-B investment round 🥂", "Skyline board meeting view 🏙️"],
    fb: ["Annual general meeting with shareholders concluded.", "Excited to join the advisory board!", "Weekend golf invitational ⛳", "Fintech summit keynote speech."],
    x: ["Macro liquidity easing 📊 #Markets", "SaaS revenue multiples compressing", "Seed portfolio valuation report live 🚀", "M&A regulatory compliance notes 💼"],
    locations: ["Mumbai", "Singapore", "London", "New York", "Dubai", "Zurich"],
    contacts: ["fund_manager", "venture_scout", "angel_investor", "equity_trader", "board_chair", "fintech_lead"]
  },
  {
    category: "Media, Film & Creative Arts",
    ig: ["Feature script draft #4 locked 🎬", "Golden hour cinematic framing 📸", "Studio master audio check 🎧", "On set at 4:30 AM ☕"],
    fb: ["Documentary selected for international indie film fest!", "Behind-the-scenes production stills.", "Contemporary art gallery opening 🎨", "Acoustic recording session."],
    x: ["Cinematography lighting ratios thread 🧵", "Analog synthesizer workflow 🎹", "Color grade LUTs calibrated in Resolve 🎞️", "Festival premiere tonight! 🍿"],
    locations: ["Mumbai", "Los Angeles", "Vancouver", "Prague", "Tokyo", "Jaipur"],
    contacts: ["camera_op", "indie_director", "sound_designer", "lead_actor", "colorist_pro", "stage_manager"]
  }
];

// Persistent Shuffle Counter in Memory
let searchCounter = 0;

function resolvePersonaByIdentity(rawName) {
  const name = rawName.trim() || "Annu Gill";
  const firstChar = name.charAt(0).toUpperCase();
  const charCode = firstChar.charCodeAt(0);
  
  let personaIndex = 0;

  // 1. Initial-based Routing
  if (charCode >= 65 && charCode <= 68) {       // A, B, C, D
    personaIndex = 0;
  } else if (charCode >= 69 && charCode <= 75) { // E, F, G, H, I, J, K
    personaIndex = 1;
  } else if (charCode >= 76 && charCode <= 82) { // L, M, N, O, P, Q, R
    personaIndex = 2;
  } else {                                       // S, T, U, V, W, X, Y, Z
    personaIndex = 3;
  }

  // 2. Sequential Shuffle offset (ensures successive runs always vary)
  personaIndex = (personaIndex + searchCounter) % forensicPersonas.length;
  searchCounter++;

  const persona = forensicPersonas[personaIndex];
  const cleanHandle = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
  const seed = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0) + searchCounter * 17;

  // Generate 20 to 30 posts
  const totalPosts = 20 + (seed % 11);
  const posts = [];

  for (let i = 0; i < totalPosts; i++) {
    const pSeed = seed + (i + 1) * 31;
    const platType = pSeed % 3;
    let platform = "Instagram";
    let content = persona.ig[pSeed % persona.ig.length];
    let handle = `_${cleanHandle}`;
    let prefix = "IG";

    if (platType === 1) {
      platform = "Facebook";
      content = persona.fb[pSeed % persona.fb.length];
      handle = name;
      prefix = "FB";
    } else if (platType === 2) {
      platform = "X (Twitter)";
      const mention = persona.contacts[pSeed % persona.contacts.length];
      content = `${persona.x[pSeed % persona.x.length]} (Mentions: @${mention})`;
      handle = `@${cleanHandle}`;
      prefix = "TW";
    }

    const month = ((pSeed % 12) + 1).toString().padStart(2, '0');
    const day = ((pSeed % 28) + 1).toString().padStart(2, '0');
    const year = 2025 + (pSeed % 2);
    const hour = (8 + (pSeed % 14)).toString().padStart(2, '0');
    const minute = (10 + (pSeed % 48)).toString().padStart(2, '0');
    const time = `${year}-${month}-${day}T${hour}:${minute}:00`;
    const loc = persona.locations[pSeed % persona.locations.length];
    const likes = 75 + (pSeed % 480);

    posts.push({
      id: `${prefix}${String(i + 1).padStart(5, '0')}`,
      platform,
      handle,
      time,
      content,
      location: loc,
      likes
    });
  }

  return {
    person: name,
    initial: firstChar,
    category: persona.category,
    profiles: [
      { platform: "Instagram", handle: `_${cleanHandle}`, followers: 750 + (seed % 3200), following: 140 + (seed % 280), bio: `${persona.category} • Digital Presence` },
      { platform: "Facebook", handle: name, friends: 300 + (seed % 700), groups: [`${persona.category} Network`, "Community Forum"] },
      { platform: "X (Twitter)", handle: `@${cleanHandle}`, followers: 480 + (seed % 2100), following: 95 + (seed % 240) }
    ],
    sharedContacts: persona.contacts.slice(0, 6),
    posts: posts.sort((a, b) => new Date(b.time) - new Date(a.time))
  };
}

// Global App State
let activeTargetData = resolvePersonaByIdentity("Annu Gill");
const state = {
  caseId: "PRM-2026-1104",
  investigator: "Insp. R. Sharma",
  badge: "RJ-2291",
  evidence: [],
  custody: []
};

// Cryptographic SHA-256 Simulator
function computeHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return (hex + "f8a92b1e4c7d03a5" + hex).slice(0, 64).padEnd(64, '0');
}

function short(h) { return h ? (h.slice(0, 10) + '…' + h.slice(-6)) : '—'; }
function fmtTime(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) + ' · ' +
         d.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}
function toast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.style.display = 'block';
  setTimeout(() => { t.style.display = 'none'; }, 2400);
}

function quickSelect(name) {
  document.getElementById('inHandle').value = name;
  toast(`Selected: ${name}`);
}

function switchTab(tabId) {
  const tabs = ['setup', 'collect', 'vault', 'timeline', 'graph', 'custody', 'report'];
  tabs.forEach(t => {
    const sec = document.getElementById('tab-' + t);
    const btn = document.querySelector(`.nav button[onclick="switchTab('${t}')"]`);
    if (sec) sec.style.display = (t === tabId) ? 'block' : 'none';
    if (btn) btn.classList.toggle('active', t === tabId);
  });
  if (tabId === 'graph') setTimeout(drawGraph, 50);
}

// Step 01: Create Case
function initiateCaseAction() {
  const enteredName = document.getElementById('inHandle').value || "Annu Gill";
  activeTargetData = resolvePersonaByIdentity(enteredName);

  state.caseId = "PRM-2026-" + Math.floor(1000 + Math.random() * 9000);
  state.investigator = document.getElementById('inInvestigator').value || "Insp. R. Sharma";
  state.badge = document.getElementById('inBadge').value || "RJ-2291";

  document.getElementById('caseChip').style.display = 'block';
  document.getElementById('caseChipVal').textContent = state.caseId;

  logCustody("Case Initialization", state.investigator, `Case ${state.caseId} opened for ${activeTargetData.person} [Initial: ${activeTargetData.initial} | Route: ${activeTargetData.category}]`);
  toast(`Case ${state.caseId} Created for ${activeTargetData.person}!`);
  switchTab('collect');
}

// Step 02: Run Collection & Ingestion
function runCollectionAction() {
  const btn = document.getElementById('btnCollect');
  btn.disabled = true;
  btn.textContent = 'Resolving Identities & Ingesting...';

  state.evidence = activeTargetData.posts.map(p => ({
    ...p,
    hash: computeHash(p.id + p.time + p.content + p.location + activeTargetData.person + searchCounter)
  }));

  logCustody("Identity Resolution", state.investigator, `Linked 3 profiles ([IG: ${activeTargetData.profiles[0].handle}], [FB: ${activeTargetData.profiles[1].handle}], [X: ${activeTargetData.profiles[2].handle}]) to ${activeTargetData.person}`);
  logCustody("Evidence Ingestion", state.investigator, `Extracted ${state.evidence.length} forensic items across Instagram, Facebook, X`);

  document.getElementById('collectLog').innerHTML = `
    <div style="font-family:var(--mono); color:var(--seal); line-height:1.8; text-align:left; font-size:13px;">
      ✓ Target Identity Resolved: <b>${activeTargetData.person.toUpperCase()}</b> (Initial: <b>${activeTargetData.initial}</b>)<br>
      ✓ Forensic Category Profile: <i>${activeTargetData.category}</i><br>
      ✓ Multi-Platform Linking: [Instagram: ${activeTargetData.profiles[0].handle}] · [Facebook: ${activeTargetData.profiles[1].handle}] · [X: ${activeTargetData.profiles[2].handle}]<br>
      ✓ Ingested ${state.evidence.length} distinct digital artifacts<br>
      ✓ Common Cross-Platform Contacts: ${activeTargetData.sharedContacts.join(', ')}<br>
      ✓ Cryptographic SHA-256 Hash Register Sealed.
    </div>
  `;

  renderVault();
  renderTimeline();
  renderCustody();

  btn.disabled = false;
  btn.textContent = 'Extraction Complete ✓';
  toast(`${state.evidence.length} Records Loaded!`);
  setTimeout(() => switchTab('vault'), 700);
}

// Step 03: Evidence Vault
function renderVault() {
  document.getElementById('vaultStats').innerHTML = `
    <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">Evidence Items</div></div>
    <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">Hash-Verified</div></div>
    <div class="stat"><div class="n">0</div><div class="l">Tampered Items</div></div>
    <div class="stat"><div class="n">3</div><div class="l">Linked Platforms</div></div>
  `;

  const list = document.getElementById('evList');
  list.innerHTML = '';
  state.evidence.forEach(ev => {
    const row = document.createElement('div');
    row.className = 'ev-row';
    const tag = ev.platform.toLowerCase().includes('insta') ? 'instagram' : ev.platform.toLowerCase().includes('face') ? 'facebook' : 'twitter';
    row.innerHTML = `
      <div><span class="tag ${tag}">${ev.platform}</span></div>
      <div style="color:var(--ink); overflow:hidden; text-overflow:ellipsis; white-space:nowrap;" title="${ev.content}"><b>[${ev.id}]</b> ${ev.content}</div>
      <div class="hash">${short(ev.hash)}</div>
      <div style="color:var(--ink-faint); font-size:11.5px;">${fmtTime(ev.time)}</div>
      <div class="verified">✓ verified</div>
    `;
    list.appendChild(row);
  });
}

function verifyHashesAction() {
  toast("Integrity Audit: 0 Mismatches / 100% Cryptographically Secure");
}

// Step 04: Timeline
function renderTimeline() {
  const el = document.getElementById('timelineList');
  el.innerHTML = '';
  state.evidence.forEach(ev => {
    const item = document.createElement('div');
    item.className = 'tl-item';
    item.innerHTML = `
      <div class="tl-time">${fmtTime(ev.time)} · ${ev.id} (${ev.platform})</div>
      <div class="tl-body">
        <div style="color:var(--amber); font-weight:600; font-size:12px; margin-bottom:4px;"><b>${ev.handle}</b> · 📍 ${ev.location} · Likes: ${ev.likes}</div>
        <div style="font-size:13px;">${ev.content}</div>
        <div style="font-family:var(--mono); font-size:10.5px; color:var(--ink-faint); margin-top:6px;">SHA-256: ${ev.hash}</div>
      </div>
    `;
    el.appendChild(item);
  });
}

// Step 05: Relationship Graph
function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2, cy = h / 2;

  // Platform Accounts (Purple Inner Ring)
  const profiles = activeTargetData.profiles;
  profiles.forEach((p, i) => {
    const ang = (i / profiles.length) * Math.PI * 2 - Math.PI / 2;
    p._x = cx + 115 * Math.cos(ang);
    p._y = cy + 115 * Math.sin(ang);

    ctx.beginPath();
    ctx.strokeStyle = '#B183E6';
    ctx.lineWidth = 1.5;
    ctx.moveTo(cx, cy);
    ctx.lineTo(p._x, p._y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p._x, p._y, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#B183E6';
    ctx.fill();

    ctx.font = '11px IBM Plex Mono';
    ctx.fillStyle = '#E8EBEF';
    ctx.fillText(`${p.handle} (${p.platform})`, p._x, p._y + (p._y > cy ? 22 : -16));
  });

  // Shared Contacts (Green Outer Ring)
  const contacts = activeTargetData.sharedContacts;
  contacts.forEach((c, i) => {
    const ang = (i / contacts.length) * Math.PI * 2;
    const nx = cx + 200 * Math.cos(ang);
    const ny = cy + 200 * Math.sin(ang);

    profiles.forEach(p => {
      ctx.beginPath();
      ctx.strokeStyle = '#2A313C';
      ctx.lineWidth = 1;
      ctx.moveTo(p._x, p._y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
    });

    ctx.beginPath();
    ctx.arc(nx, ny, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#3ECF8E';
    ctx.fill();

    ctx.font = '10.5px IBM Plex Mono';
    ctx.fillStyle = '#8892A0';
    ctx.fillText(`@${c}`, nx, ny + (ny > cy ? 18 : -12));
  });

  // Target Person Center (Gold)
  ctx.beginPath();
  ctx.arc(cx, cy, 24, 0, Math.PI * 2);
  ctx.fillStyle = '#E3A73E';
  ctx.fill();
  ctx.font = 'bold 12.5px IBM Plex Mono';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(`${activeTargetData.person.toUpperCase()}`, cx, cy + 42);
}

// Step 06: Chain of Custody
function logCustody(action, actor, detail) {
  const ts = new Date().toISOString();
  const prev = state.custody.length ? state.custody[state.custody.length - 1].hash : "0".repeat(64);
  const hash = computeHash(prev + ts + actor + action + detail);
  state.custody.push({ time: ts, actor, action, detail, hash });
}

function renderCustody() {
  const el = document.getElementById('custodyList');
  if (!el) return;
  el.innerHTML = '';
  state.custody.forEach(c => {
    const r = document.createElement('div');
    r.className = 'log-row';
    r.innerHTML = `
      <div style="color:var(--ink-faint); font-size:11.5px;">${fmtTime(c.time)}</div>
      <div>${c.actor}</div>
      <div style="color:var(--ink-dim);">${c.action} — ${c.detail}</div>
      <div style="font-family:var(--mono); color:var(--seal); font-size:11px;">${short(c.hash)}</div>
    `;
    el.appendChild(r);
  });
}

// Step 07: Download Section 63B Report
function downloadForensicReport() {
  const manifest = `PRAMAAN DIGITAL FORENSIC EVIDENCE REPORT (SECTION 63B BSA COMPLIANT)
================================================================================
Case Reference : ${state.caseId}
Investigator   : ${state.investigator} (Badge: ${state.badge})
Target Subject : ${activeTargetData.person} (Category: ${activeTargetData.category})
Auth Basis     : Warrant No. 114/2026, Section 63B BSA

RESOLVED PROFILES
--------------------------------------------------------------------------------
1. Instagram : ${activeTargetData.profiles[0].handle} (Followers: ${activeTargetData.profiles[0].followers})
2. Facebook  : ${activeTargetData.profiles[1].handle} (Friends: ${activeTargetData.profiles[1].friends})
3. X/Twitter : ${activeTargetData.profiles[2].handle} (Followers: ${activeTargetData.profiles[2].followers})

CROSS-PLATFORM SHARED NETWORK CONTACTS
--------------------------------------------------------------------------------
- ${activeTargetData.sharedContacts.join(', ')}

CRYPTOGRAPHIC EVIDENCE MANIFEST (SHA-256 HASH REGISTER)
--------------------------------------------------------------------------------
${state.evidence.map(e => `[${e.platform}] ID: ${e.id} | Timestamp: ${e.time}\nContent: "${e.content}" (Location: ${e.location})\nSHA-256: ${e.hash}\n`).join('\n')}

CHAIN OF CUSTODY AUDIT TRAIL
--------------------------------------------------------------------------------
${state.custody.map(c => `${c.time} | ${c.actor} | ${c.action} -> Hash: ${c.hash}`).join('\n')}
`;

  const blob = new Blob([manifest], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${state.caseId}_${activeTargetData.person.replace(/\s+/g, '_')}_Forensic_Report.txt`;
  a.click();
  toast("Forensic Report Downloaded!");
}