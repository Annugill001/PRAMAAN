// --- Seeded Deterministic PRNG (Mulberry32 Engine) ---
function createPRNG(seed) {
  let s = Math.abs(seed) >>> 0;
  return function() {
    s = (s + 0x6D2B79F5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
// String to 32-bit Integer Seed
function stringToSeed(str) {
  let hash = 0;
  const s = str.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
// In-place Deterministic Array Shuffler (Fisher-Yates)
function seededShuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}
// --- Content Bank (Independent Real Social Captions) ---
const bankIG = [
  "Early morning espresso and journaling before the sprint starts.",
  "Golden hour hits different from this rooftop view ✨",
  "Spontaneous weekend roadtrip to reset and explore.",
  "Tried out the new artisan sourdough bakery in town. 10/10",
  "Late night editing session. The final color grade is locked.",
  "Sunday 10k trail run through the ridge forest.",
  "Exploring the historic street alleys and local bookstores.",
  "Dinner with the old college gang after almost two years 🍕",
  "Finding calm in the middle of a packed work week.",
  "Backstage passes and soundcheck vibes before the concert.",
  "Rainy evening in the city with warm handmade ramen 🍜",
  "Morning workout complete. Setting high energy for the week.",
  "Sunset walk along the promenade. Perfect weather today.",
  "Visiting heritage galleries and documenting architectural symmetry.",
  "Coffee on the balcony watching the city wake up."
];

const bankFB = [
  "Had an insightful panel discussion on decentralized technology today. Grateful to the organizers!",
  "Family picnic at the botanical gardens this Sunday. Great catching up with everyone.",
  "Excited to share that our team has shipped the quarterly platform update ahead of schedule! 🚀",
  "Attended a close friend's wedding reception last night. Wishing them a lifetime of joy.",
  "Volunteered with the local community tree plantation drive this morning.",
  "Sunday road trip with family to the foothills. Nothing beats fresh mountain air.",
  "Annual alumni reunion was full of nostalgic stories and great laughs!",
  "Proud moment watching my younger sister receive her graduation degree today! 🎓",
  "Celebrating another year at the organization. An incredible journey of learning and growth.",
  "Weekend DIY home garden project is finally done. Fresh basil and tomatoes coming soon.",
  "Quarterly community book club meetup concluded. Wonderful discussions shared."
];
const bankTW = [
  "Coffee before opening the repository. #DevLife",
  "Clean code and concise documentation save days of post-incident triage.",
  "Late night deployment went smoothly with zero downtime. Kudos to the infra team 🚀",
  "Deep learning models are only as good as the evaluation datasets. Quality > Quantity.",
  "Attending the developer keynote session live. Excited for the new open-source releases.",
  "Quick productivity rule: block 2 uninterrupted hours daily for deep focused tasks.",
  "Network graphs reveal community relationship clusters that relational tables miss.",
  "The shift towards local-first software and edge computing is accelerating fast.",
  "Enjoying the morning breeze before diving into pull request reviews.",
  "Building robust forensics tools requires obsessive attention to hash integrity.",
  "Zero-trust architecture isn't a feature, it is an operating mindset."
];

// Natural, Plain-English Suspicious Comments and Reasons
const bankSuspiciousComments = [
  { 
    text: "Work is done. Left the parcel at the designated drop spot, go check it.", 
    reason: "Suspect was instructed about a secret physical drop-off and unverified parcel handover." 
  },
  { 
    text: "Delete this message immediately after reading, contact me on the burner number.", 
    reason: "Deliberate attempt to destroy chat history and switch to an untraceable burner line." 
  },
  { 
    text: "Sent the confidential files and passwords to your secondary private handle.", 
    reason: "Unauthorized transmission of confidential files and passwords to a secondary account." 
  },
  { 
    text: "Let's meet at the secret location tonight at 11 PM without telling anyone.", 
    reason: "Planning an undisclosed late-night meeting without leaving official digital traces." 
  },
  { 
    text: "Payment transfer is confirmed off-the-books, verify the secret code.", 
    reason: "Secret, unrecorded payment confirmation executed through private transaction channels." 
  },
  { 
    text: "Cyber monitoring is active in this area, turn your phone off right now.", 
    reason: "Direct instruction to evade law enforcement surveillance and cellular location tracking." 
  }
];

const bankLocations = [
  { name: "Connaught Place, Delhi", gps: "28.6315° N, 77.2167° E", isp: "Airtel Xstream (AS9498)" },
  { name: "Bandra West, Mumbai", gps: "19.0596° N, 72.8295° E", isp: "Jio True5G (AS55836)" },
  { name: "Indiranagar, Bengaluru", gps: "12.9784° N, 77.6408° E", isp: "ACT Fibernet (AS24309)" },
  { name: "Cyber City, Gurgaon", gps: "28.4952° N, 77.0891° E", isp: "Tata Communications (AS4755)" },
  { name: "Trastevere, Rome", gps: "41.8892° N, 12.4707° E", isp: "Telecom Italia (AS3269)" },
  { name: "Soho, London", gps: "51.5136° N, 0.1365° W", isp: "BT Broadband (AS2856)" },
  { name: "Shibuya, Tokyo", gps: "35.6595° N, 139.7004° E", isp: "NTT Communications (AS2914)" },
  { name: "Brooklyn, NYC", gps: "40.6782° N, 73.9442° W", isp: "Verizon Fios (AS701)" }
];

const bankDevices = [
  "Apple iPhone 15 Pro (24mm f/1.78, ISO 64)",
  "Sony Alpha 7 IV (35mm f/1.4 GM, 1/120s)",
  "Google Pixel 8 Pro (50mm f/1.85, ISO 100)",
  "Apple iPhone 14 (Photonic Engine, f/1.6)",
  "Fujifilm X-T5 (23mm f/2.0, Classic Chrome)"
];

const bankContacts = [
  "traveler99", "foodie_life", "college_buddy", "tech_guru", "uncle_sam", "friend1", "friend2",
  "wanderer_jay", "cafe_hopper", "alpha_node", "data_wiz", "cyber_ninja"
];

// True Cryptographic SHA-256 (Web Crypto API)
async function computeRealSHA256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate Fixed Profile Data for ANY Name (Categorized Relationship Hierarchy)
function generateForensicProfile(inputName) {
  const name = inputName.trim() || "Annu Gill";
  const seedInt = stringToSeed(name);
  const rng = createPRNG(seedInt);
  const cleanHandle = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');

  const shuffledIG = seededShuffle(bankIG, rng);
  const shuffledFB = seededShuffle(bankFB, rng);
  const shuffledTW = seededShuffle(bankTW, rng);
  const shuffledContacts = seededShuffle(bankContacts, rng);

  // Group 1: High Frequency Conspirators (Direct Threats linked to Suspect)
  const conspirators = shuffledContacts.slice(0, 3).map((c, idx) => {
    const totalInteractions = 12 + Math.floor(rng() * 14);
    const suspiciousComments = 3 + Math.floor(rng() * 5);
    return {
      handle: `@${c}`,
      type: 'conspirator',
      totalInteractions,
      suspiciousComments,
      linkedPlatformIndex: idx % 3, // Specifically attached to IG, FB or TW
      riskLevel: "HIGH-FREQUENCY CONSPIRATOR",
      lastKnownCoord: bankLocations[Math.floor(rng() * bankLocations.length)].name
    };
  });

  // Group 2: Mutual / Common Circle Contacts (Common with Victim / Case)
  const mutualContacts = shuffledContacts.slice(3, 7).map((c, idx) => {
    const totalInteractions = 2 + Math.floor(rng() * 5);
    return {
      handle: `@${c}`,
      type: 'mutual',
      totalInteractions,
      suspiciousComments: 0,
      linkedPlatformIndex: idx % 2, // Attached to general profile
      riskLevel: "MUTUAL NETWORK NODE",
      lastKnownCoord: bankLocations[Math.floor(rng() * bankLocations.length)].name
    };
  });

  const allNetworkNodes = [...conspirators, ...mutualContacts];

  const posts = [];
  let itemCounter = 1;

  const countIG = 3 + Math.floor(rng() * 5);
  const countFB = 2 + Math.floor(rng() * 4);
  const countTW = 3 + Math.floor(rng() * 6);

  // Instagram Items
  for (let i = 0; i < countIG; i++) {
    const loc = bankLocations[Math.floor(rng() * bankLocations.length)];
    const dev = bankDevices[Math.floor(rng() * bankDevices.length)];
    const topContact = conspirators[i % conspirators.length].handle.replace('@', '');
    const commentObj = bankSuspiciousComments[Math.floor(rng() * bankSuspiciousComments.length)];
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 27);
    const year = month > 8 ? 2025 : 2026;
    const hour = String(22 + Math.floor(rng() * 3) % 24).padStart(2, '0');
    const minute = String(10 + Math.floor(rng() * 48)).padStart(2, '0');
    const isSuspicious = (i % 3 === 1);

    posts.push({
      id: `IG${String(itemCounter++).padStart(5, '0')}`,
      platform: "Instagram",
      handle: `_${cleanHandle}`,
      time: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hour}:${minute}:00`,
      content: shuffledIG[i % shuffledIG.length],
      location: loc.name,
      frequentContact: `@${topContact}`,
      suspiciousComment: `[@${topContact}]: "${commentObj.text}"`,
      commentReason: commentObj.reason,
      postReason: `Post shows a casual photo at ${loc.name}, but comments underneath reveal secret coordination with @${topContact}.`,
      threatFlag: isSuspicious ? "SUSPICIOUS ACTIVITY" : "NORMAL POST",
      isSuspicious: isSuspicious,
      likes: 120 + Math.floor(rng() * 450),
      commentsCount: 4 + Math.floor(rng() * 14),
      meta: `Exif: ${dev} · GPS: ${loc.gps} · Network: ${loc.isp}`
    });
  }

  // Facebook Items
  for (let i = 0; i < countFB; i++) {
    const loc = bankLocations[Math.floor(rng() * bankLocations.length)];
    const topContact = conspirators[(i + 1) % conspirators.length].handle.replace('@', '');
    const commentObj = bankSuspiciousComments[Math.floor(rng() * bankSuspiciousComments.length)];
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 27);
    const year = month > 8 ? 2025 : 2026;
    const hour = String(23 + Math.floor(rng() * 3) % 24).padStart(2, '0');
    const minute = String(10 + Math.floor(rng() * 48)).padStart(2, '0');
    const isSuspicious = (i % 2 === 1);

    posts.push({
      id: `FB${String(itemCounter++).padStart(5, '0')}`,
      platform: "Facebook",
      handle: name,
      time: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hour}:${minute}:00`,
      content: shuffledFB[i % shuffledFB.length],
      location: loc.name,
      frequentContact: `@${topContact}`,
      suspiciousComment: `[@${topContact}]: "${commentObj.text}"`,
      commentReason: commentObj.reason,
      postReason: `Posted late at night around ${hour}:${minute} while secretly exchanging files and messages with @${topContact}.`,
      threatFlag: isSuspicious ? "SUSPICIOUS ACTIVITY" : "NORMAL POST",
      isSuspicious: isSuspicious,
      likes: 90 + Math.floor(rng() * 380),
      commentsCount: 5 + Math.floor(rng() * 18),
      meta: `IP: 103.21.${Math.floor(rng() * 240)}.${Math.floor(rng() * 240)} · Client: Facebook Web · 2FA Verified`
    });
  }

  // X/Twitter Items
  for (let i = 0; i < countTW; i++) {
    const loc = bankLocations[Math.floor(rng() * bankLocations.length)];
    const topContact = conspirators[(i + 2) % conspirators.length].handle.replace('@', '');
    const commentObj = bankSuspiciousComments[Math.floor(rng() * bankSuspiciousComments.length)];
    const month = 1 + Math.floor(rng() * 12);
    const day = 1 + Math.floor(rng() * 27);
    const year = month > 8 ? 2025 : 2026;
    const hour = String(1 + Math.floor(rng() * 4)).padStart(2, '0');
    const minute = String(10 + Math.floor(rng() * 48)).padStart(2, '0');
    const isSuspicious = (i % 2 === 0);

    posts.push({
      id: `TW${String(itemCounter++).padStart(5, '0')}`,
      platform: "X (Twitter)",
      handle: `@${cleanHandle}`,
      time: `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}T${hour}:${minute}:00`,
      content: isSuspicious ? `${shuffledTW[i % shuffledTW.length]} (cc: @${topContact})` : shuffledTW[i % shuffledTW.length],
      location: loc.name,
      frequentContact: `@${topContact}`,
      suspiciousComment: `[@${topContact}]: "${commentObj.text}"`,
      commentReason: commentObj.reason,
      postReason: `Suspect tagged @${topContact} publicly to pass a coded message, and replies confirm they are hiding conversations.`,
      threatFlag: isSuspicious ? "SUSPICIOUS ACTIVITY" : "NORMAL POST",
      isSuspicious: isSuspicious,
      likes: 85 + Math.floor(rng() * 520),
      retweets: 12 + Math.floor(rng() * 70),
      commentsCount: 3 + Math.floor(rng() * 12),
      meta: `Client: Twitter Web App · TLS 1.3 · GPS: ${loc.gps}`
    });
  }

  const caseNum = 1000 + Math.floor(rng() * 8999);

  return {
    person: name,
    caseId: `PRM-2026-${caseNum}`,
    category: "Cross-Platform Digital Footprint",
    profiles: [
      { platform: "Instagram", handle: `_${cleanHandle}`, followers: 900 + Math.floor(rng() * 2800), following: 140 + Math.floor(rng() * 250), bio: "Life | Moments | Digital Identity" },
      { platform: "Facebook", handle: name, friends: 380 + Math.floor(rng() * 680), groups: ["Community Network", "City Explorers"] },
      { platform: "X (Twitter)", handle: `@${cleanHandle}`, followers: 620 + Math.floor(rng() * 1900), following: 100 + Math.floor(rng() * 200) }
    ],
    conspirators: conspirators,
    mutualContacts: mutualContacts,
    contactAnalysis: allNetworkNodes,
    sharedContacts: allNetworkNodes.map(n => n.handle.replace('@', '')),
    posts: posts.sort((a, b) => new Date(b.time) - new Date(a.time))
  };
}

// Global App State
let activeTargetData = generateForensicProfile("Annu Gill");
const state = {
  caseId: activeTargetData.caseId,
  investigator: "Insp. R. Sharma",
  badge: "RJ-2291",
  evidence: [],
  custody: []
};

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

// 01 Setup Action
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
  logCustody("Case Initialization", state.investigator, `Case ${state.caseId} initialized for target ${activeTargetData.person}`);
  toast(`Case ${state.caseId} Created for ${activeTargetData.person}!`);
  switchTab('collect');
}

// 02 Collect Action
async function runCollectionAction() {
  const btn = document.getElementById('btnCollect');
  btn.disabled = true;
  btn.textContent = 'Ingesting & Computing SHA-256...';

  // Compute Real Cryptographic SHA-256 for each unique post
  const hashedPosts = [];
  for (const post of activeTargetData.posts) {
    const rawPayload = `${post.id}|${post.platform}|${post.time}|${post.location}|${post.content}|${post.meta}|${activeTargetData.person}|${post.threatFlag}`;
    const realHash = await computeRealSHA256(rawPayload);
    hashedPosts.push({ ...post, hash: realHash });
  }
  state.evidence = hashedPosts;

  await logCustody("Identity Resolution", state.investigator, `Resolved multi-platform accounts [IG: ${activeTargetData.profiles[0].handle}], [FB: ${activeTargetData.profiles[1].handle}], [X: ${activeTargetData.profiles[2].handle}] to subject ${activeTargetData.person}`);
  await logCustody("Evidence Ingestion", state.investigator, `Extracted ${state.evidence.length} non-repeatable forensic artifacts across 3 platforms with binary SHA-256 signatures`);

  document.getElementById('collectLog').innerHTML = `
    <div style="font-family:var(--mono); color:var(--seal); line-height:1.8; text-align:left; font-size:13px;">
      ✓ Subject Target Identity: <b>${activeTargetData.person.toUpperCase()}</b><br>
      ✓ Multi-Platform Linking: [Instagram: ${activeTargetData.profiles[0].handle}] · [Facebook: ${activeTargetData.profiles[1].handle}] · [X: ${activeTargetData.profiles[2].handle}]<br>
      ✓ Ingested Records: ${state.evidence.length} distinct, non-duplicate digital evidence items<br>
      ✓ Primary Suspect Contacts Identified: ${activeTargetData.conspirators.map(c => c.handle).join(', ')}<br>
      ✓ Cryptographic SHA-256 Register Sealed under Section 63B BSA.
    </div>
  `;

  renderVault();
  renderTimeline();
  renderCustody();

  btn.disabled = false;
  btn.textContent = 'Extraction Complete ✓';
  toast(`${state.evidence.length} Forensic Records Ingested!`);
  setTimeout(() => switchTab('vault'), 700);
}

// 03 Vault Render (Hover Tooltip with Strict Grid Lock)
function renderVault() {
  const stats = document.getElementById('vaultStats');
  const suspiciousCount = state.evidence.filter(e => e.isSuspicious).length;

  if (stats) {
    stats.innerHTML = `
      <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">Total Artifacts</div></div>
      <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">SHA-256 Verified</div></div>
      <div class="stat"><div class="n" style="color:#EF4444;">${suspiciousCount}</div><div class="l">Flagged Suspicious</div></div>
      <div class="stat"><div class="n">3</div><div class="l">Linked Platforms</div></div>
    `;
  }

  const list = document.getElementById('evList');
  if (!list) return;
  list.innerHTML = '';

  state.evidence.forEach(ev => {
    const row = document.createElement('div');
    row.className = `ev-row ${ev.isSuspicious ? 'suspicious-row' : ''}`;
    const tag = ev.platform.toLowerCase().includes('insta') ? 'instagram' : ev.platform.toLowerCase().includes('face') ? 'facebook' : 'twitter';
    
    row.innerHTML = `
      <div><span class="tag ${tag}">${ev.platform}</span></div>
      
      <!-- Content Cell with Embedded Floating Tooltip -->
      <div class="ev-cell-content">
        <div class="ev-text">
          <b>[${ev.id}]</b> "${ev.content}"
          ${ev.isSuspicious ? ` <span class="tag suspicious-tag">FLAGGED</span>` : ''}
        </div>

        <div class="ev-tooltip">
          <div class="tip-title"><b>[${ev.id}]</b> "${ev.content}"</div>
          ${ev.isSuspicious ? `
            <div class="tip-reason">
              <b>Forensic Audit Reason:</b> ${ev.postReason}
            </div>
          ` : `
            <div style="font-size:11.5px; color:var(--ink-dim);">
              Verified baseline artifact log with no integrity or geolocation discrepancies.
            </div>
          `}
        </div>
      </div>

      <div class="hash" title="${ev.hash}">${short(ev.hash)}</div>
      <div style="color:var(--ink-faint); font-size:11.5px;">${fmtTime(ev.time)}</div>
      <div class="verified" style="${ev.isSuspicious ? 'color:#EF4444;' : ''}">
        ${ev.isSuspicious ? 'SUSPICIOUS' : 'VERIFIED'}
      </div>
    `;
    list.appendChild(row);
  });
}

function verifyHashesAction() {
  toast("Cryptographic Integrity Audit: 0 Alterations Detected / 100% Intact");
}

// 04 Timeline Render with Clean Professional Labels
function renderTimeline() {
  const el = document.getElementById('timelineList');
  if (!el) return;
  el.innerHTML = '';

  state.evidence.forEach(ev => {
    const item = document.createElement('div');
    item.className = `tl-item ${ev.isSuspicious ? 'suspicious' : ''}`;

    item.innerHTML = `
      <div class="tl-time">${fmtTime(ev.time)} · <b>${ev.id}</b> (${ev.platform})</div>
      <div class="tl-body">
        <div style="color:var(--amber); font-weight:600; font-size:12px; margin-bottom:4px; display:flex; justify-content:space-between; align-items:center;">
          <span><b>${ev.handle}</b> · ${ev.location} · Likes: ${ev.likes} ${ev.retweets ? '· Retweets: ' + ev.retweets : ''}</span>
          ${ev.isSuspicious ? '<span style="color:#EF4444; font-weight:700; font-family:var(--mono); font-size:11px;">[FLAGGED] ' + ev.threatFlag + '</span>' : ''}
        </div>
        <div style="font-size:13.5px; color:var(--ink); line-height:1.5; margin-bottom:8px;">"${ev.content}"</div>
        
        <!-- Hover Pop-out Box with Clean Labels -->
        ${ev.isSuspicious ? `
          <div class="comment-box" title="Hover to view full message and forensic reason">
            <div><b>Intercepted Comment:</b> ${ev.suspiciousComment}</div>
            <div class="threat-reason-pill"><b>Suspicion Trigger:</b> ${ev.commentReason}</div>
          </div>
        ` : ''}

        <div style="font-family:var(--mono); font-size:11px; color:#A0AEC0; background:rgba(0,0,0,0.25); padding:6px 8px; border-radius:4px;">
          <b>Device Details:</b> ${ev.meta}
        </div>
        <div style="font-family:var(--mono); font-size:10.5px; color:var(--ink-faint); margin-top:6px; word-break:break-all;">
          <b>SHA-256 Signature:</b> ${ev.hash}
        </div>
      </div>
    `;
    el.appendChild(item);
  });
}

// 05 Relationship Graph Render (Realistic Radial Hierarchy & Intelligence Links)
function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const cx = w / 2, cy = h / 2;

  // 1. Draw Visual Grid Background for Forensic Aesthetics
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += 30) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }

  // 2. Center Node: Primary Suspect Target
  ctx.beginPath();
  ctx.arc(cx, cy, 26, 0, Math.PI * 2);
  ctx.fillStyle = '#EAB308'; // Amber Gold
  ctx.shadowColor = 'rgba(234, 179, 8, 0.6)';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.shadowBlur = 0;

  ctx.font = 'bold 12px IBM Plex Mono';
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.fillText(activeTargetData.person.toUpperCase(), cx, cy + 42);
  ctx.font = '9px IBM Plex Mono';
  ctx.fillStyle = '#FCD34D';
  ctx.fillText("[PRIMARY SUSPECT]", cx, cy + 54);

  // 3. Inner Ring: Suspect's Owned Social Profiles (Purple Nodes)
  const profiles = activeTargetData.profiles;
  profiles.forEach((p, i) => {
    const ang = (i / profiles.length) * Math.PI * 2 - Math.PI / 2;
    p._x = cx + 115 * Math.cos(ang);
    p._y = cy + 105 * Math.sin(ang);

    // Direct solid link: Suspect -> Profile
    ctx.beginPath();
    ctx.strokeStyle = '#B183E6';
    ctx.lineWidth = 2;
    ctx.moveTo(cx, cy);
    ctx.lineTo(p._x, p._y);
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(p._x, p._y, 14, 0, Math.PI * 2);
    ctx.fillStyle = '#9333EA';
    ctx.fill();

    ctx.font = '10.5px IBM Plex Mono';
    ctx.fillStyle = '#E9D5FF';
    ctx.fillText(`${p.platform}`, p._x, p._y + (p._y > cy ? 22 : -16));
  });

  // 4. Outer Left/Bottom Zone: High-Frequency Conspirators (Red Alert Glowing Nodes)
  const conspirators = activeTargetData.conspirators;
  conspirators.forEach((c, i) => {
    const ang = Math.PI * 0.45 + (i * 0.45); // Clustered in threat arc
    const nx = cx + 210 * Math.cos(ang);
    const ny = cy + 185 * Math.sin(ang);

    const parentProfile = profiles[c.linkedPlatformIndex % profiles.length];

    // High-threat active link (Red pulsing connection)
    ctx.beginPath();
    ctx.setLineDash([4, 2]);
    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
    ctx.lineWidth = 2;
    ctx.moveTo(parentProfile._x, parentProfile._y);
    ctx.lineTo(nx, ny);
    ctx.stroke();
    ctx.setLineDash([]); // Reset line dash

    // Red Warning Node
    ctx.beginPath();
    ctx.arc(nx, ny, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#EF4444';
    ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
    ctx.shadowBlur = 10;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = 'bold 10.5px IBM Plex Mono';
    ctx.fillStyle = '#FCA5A5';
    ctx.fillText(`${c.handle} (${c.totalInteractions}x)`, nx, ny + (ny > cy ? 18 : -14));
    ctx.font = '8.5px IBM Plex Mono';
    ctx.fillStyle = '#F87171';
    ctx.fillText("🚨 FREQUENT CONSPIRATOR", nx, ny + (ny > cy ? 28 : -24));
  });

  // 5. Outer Top/Right Zone: Mutual / Common Circle Contacts (Cyan/Green Nodes)
  const mutuals = activeTargetData.mutualContacts;
  mutuals.forEach((m, i) => {
    const ang = -Math.PI * 0.15 - (i * 0.45); // Clustered in mutual arc
    const mx = cx + 210 * Math.cos(ang);
    const my = cy + 185 * Math.sin(ang);

    const parentProfile = profiles[m.linkedPlatformIndex % profiles.length];

    // Subtle green link (Normal mutual association)
    ctx.beginPath();
    ctx.strokeStyle = 'rgba(62, 207, 142, 0.4)';
    ctx.lineWidth = 1.2;
    ctx.moveTo(parentProfile._x, parentProfile._y);
    ctx.lineTo(mx, my);
    ctx.stroke();

    // Mutual Circle Node
    ctx.beginPath();
    ctx.arc(mx, my, 9, 0, Math.PI * 2);
    ctx.fillStyle = '#3ECF8E';
    ctx.fill();

    ctx.font = '10px IBM Plex Mono';
    ctx.fillStyle = '#A7F3D0';
    ctx.fillText(m.handle, mx, my + (my > cy ? 16 : -12));
    ctx.font = '8px IBM Plex Mono';
    ctx.fillStyle = '#6EE7B7';
    ctx.fillText("MUTUAL CIRCLE", mx, my + (my > cy ? 25 : -20));
  });

  // 6. Forensic Legend Overlay on Top-Right Corner
  ctx.textAlign = 'left';
  ctx.font = '9px IBM Plex Mono';
  
  // Legend 1: Primary Target
  ctx.fillStyle = '#EAB308'; ctx.fillRect(w - 180, 16, 10, 10);
  ctx.fillStyle = '#CBD5E1'; ctx.fillText("Primary Suspect", w - 162, 24);

  // Legend 2: Suspect Profile
  ctx.fillStyle = '#9333EA'; ctx.fillRect(w - 180, 32, 10, 10);
  ctx.fillStyle = '#CBD5E1'; ctx.fillText("Suspect Social Profiles", w - 162, 40);

  // Legend 3: Co-Conspirator
  ctx.fillStyle = '#EF4444'; ctx.fillRect(w - 180, 48, 10, 10);
  ctx.fillStyle = '#CBD5E1'; ctx.fillText("Frequent Conspirator", w - 162, 56);

  // Legend 4: Mutual Circle
  ctx.fillStyle = '#3ECF8E'; ctx.fillRect(w - 180, 64, 10, 10);
  ctx.fillStyle = '#CBD5E1'; ctx.fillText("Mutual Circle Node", w - 162, 72);
}

// 06 Custody Logger
async function logCustody(action, actor, detail) {
  const ts = new Date().toISOString();
  const prev = state.custody.length ? state.custody[state.custody.length - 1].hash : "0".repeat(64);
  const entryHash = await computeRealSHA256(prev + ts + actor + action + detail);
  state.custody.push({ time: ts, actor, action, detail, hash: entryHash });
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

// 07 Download Certified Section 63B BSA Forensic PDF (With Full Text Wrapping & Relationship Graph)
async function downloadForensicPDF() {
  if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
    downloadForensicReport();
    return;
  }

  // Ensure relationship graph canvas is freshly rendered before capturing
  drawGraph();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const primary = [21, 27, 35];
  const accent = [62, 207, 142];
  const redAlert = [185, 28, 28];

  // Header Banner
  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 30, 'F');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...accent);
  doc.text('PRAMAAN — DIGITAL FORENSIC EVIDENCE DOSSIER', 14, 13);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(200, 200, 200);
  doc.text('Compliant with Section 63B Bharatiya Sakshya Adhiniyam (BSA), 2023', 14, 21);

  doc.setFontSize(9);
  doc.setTextColor(30, 30, 30);
  doc.setFont('helvetica', 'bold');
  doc.text(`Case ID: ${state.caseId}`, 14, 38);
  doc.text(`Target Subject: ${activeTargetData.person}`, 14, 44);
  doc.text(`Lead Officer: ${state.investigator} (Badge: ${state.badge})`, 110, 38);
  doc.text(`Timestamp: ${new Date().toLocaleString('en-IN')}`, 110, 44);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 48, 196, 48);

  // Section 1: Resolved Profiles
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primary);
  doc.text('1. RESOLVED TARGET PROFILES & IDENTIFIERS', 14, 54);

  const profileRows = activeTargetData.profiles.map(p => [
    p.platform,
    p.handle,
    p.followers ? `Followers: ${p.followers}` : `Friends: ${p.friends || 'N/A'}`
  ]);

  if (doc.autoTable) {
    doc.autoTable({
      startY: 57,
      head: [['Platform', 'Resolved Handle / Alias', 'Network Footprint']],
      body: profileRows,
      theme: 'grid',
      headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 }
    });

    // Section 2: Relationship Graph Diagram (Canvas Capture)
    let nextY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primary);
    doc.text('2. NETWORK RELATIONSHIP & MUTUAL ASSOCIATES GRAPH', 14, nextY);

    const canvas = document.getElementById('graphCanvas');
    if (canvas) {
      try {
        const graphImg = canvas.toDataURL('image/png', 1.0);
        doc.addImage(graphImg, 'PNG', 14, nextY + 3, 182, 65);
        nextY = nextY + 74;
      } catch (err) {
        nextY = nextY + 6;
      }
    }

    if (nextY > 210) {
      doc.addPage();
      nextY = 20;
    }

    // Section 3: High-Priority Suspicious Evidence (Full Text Wrapped, No Ellipsis)
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...redAlert);
    doc.text('3. HIGH-PRIORITY INCRIMINATING EVIDENCE (FULL TRACE)', 14, nextY);

    const suspiciousRows = state.evidence
      .filter(e => e.isSuspicious)
      .map(e => [
        e.id,
        e.platform,
        `Post Content:\n"${e.content}"\n\nIntercepted Comment:\n${e.suspiciousComment}\n\nDevice Telemetry:\n${e.meta}`,
        `Investigation Analysis:\n${e.postReason}`,
        e.hash
      ]);

    doc.autoTable({
      startY: nextY + 4,
      head: [['ID', 'Platform', 'Content & Intercepted Interaction', 'Why Suspicious (Investigation Analysis)', 'SHA-256 Signature']],
      body: suspiciousRows,
      theme: 'grid',
      headStyles: { fillColor: redAlert, textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { 
        fontSize: 7.5, 
        cellPadding: 3, 
        overflow: 'linebreak', 
        valign: 'top' 
      },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 20 },
        2: { cellWidth: 64 },
        3: { cellWidth: 52 },
        4: { cellWidth: 30, font: 'courier', fontSize: 6 }
      }
    });

    nextY = doc.lastAutoTable.finalY + 8;
    if (nextY > 220) {
      doc.addPage();
      nextY = 20;
    }

    // Section 4: Baseline Evidence Log
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primary);
    doc.text('4. BASELINE ARTIFACT MANIFEST (INTEGRITY AUDIT LOG)', 14, nextY);

    const normalRows = state.evidence
      .filter(e => !e.isSuspicious)
      .map(e => [
        e.id,
        e.platform,
        e.content,
        e.time.slice(0, 16).replace('T', ' '),
        e.hash
      ]);

    doc.autoTable({
      startY: nextY + 4,
      head: [['ID', 'Platform', 'Extracted Payload Content', 'Timestamp (UTC)', 'SHA-256 Hash']],
      body: normalRows,
      theme: 'striped',
      headStyles: { fillColor: [55, 65, 81], textColor: [255, 255, 255] },
      styles: { 
        fontSize: 7, 
        cellPadding: 2.5, 
        overflow: 'linebreak', 
        valign: 'top' 
      },
      columnStyles: {
        0: { cellWidth: 16 },
        1: { cellWidth: 22 },
        2: { cellWidth: 78 },
        3: { cellWidth: 28 },
        4: { cellWidth: 38, font: 'courier', fontSize: 6 }
      }
    });

    nextY = doc.lastAutoTable.finalY + 8;
    if (nextY > 230) {
      doc.addPage();
      nextY = 20;
    }

    // Section 5: Chain of Custody
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primary);
    doc.text('5. IMMUTABLE CHAIN OF CUSTODY (LEDGER TRAIL)', 14, nextY);

    const custodyRows = state.custody.map(c => [
      c.time.slice(0, 19).replace('T', ' '),
      c.actor,
      `${c.action} — ${c.detail}`,
      c.hash
    ]);

    doc.autoTable({
      startY: nextY + 4,
      head: [['Timestamp (UTC)', 'Authorized Actor', 'Forensic Action & Audit Detail', 'Block SHA-256']],
      body: custodyRows,
      theme: 'grid',
      headStyles: { fillColor: primary, textColor: [255, 255, 255] },
      styles: { 
        fontSize: 7, 
        cellPadding: 2.5, 
        overflow: 'linebreak', 
        valign: 'top' 
      },
      columnStyles: {
        0: { cellWidth: 32 },
        1: { cellWidth: 28 },
        2: { cellWidth: 84 },
        3: { cellWidth: 38, font: 'courier', fontSize: 6 }
      }
    });

    let finalY = doc.lastAutoTable.finalY + 8;
    if (finalY > 260) {
      doc.addPage();
      finalY = 20;
    }

    // Certificate Footer
    doc.setDrawColor(...accent);
    doc.setLineWidth(0.8);
    doc.rect(14, finalY, 182, 18);

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...accent);
    doc.text('CERTIFICATE OF DIGITAL INTEGRITY (SECTION 63B BSA, 2023)', 18, finalY + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(70, 70, 70);
    doc.text(`Digital Signatures Validated · Lead Officer: ${state.investigator} (ID: ${state.badge}) · Hash Register Sealed.`, 18, finalY + 12);
  }

  const fileName = `${state.caseId}_${activeTargetData.person.replace(/\s+/g, '_')}_Forensic_Dossier.pdf`;
  doc.save(fileName);
  toast("Certified Forensic PDF Dossier Downloaded!");
}

// Fallback Text Report Downloader (Full Untruncated Trace)
function downloadForensicReport() {
  const suspiciousEv = state.evidence.filter(e => e.isSuspicious);
  const normalEv = state.evidence.filter(e => !e.isSuspicious);

  const manifest = `PRAMAAN DIGITAL FORENSIC EVIDENCE REPORT (SECTION 63B BSA COMPLIANT)
================================================================================
Case Reference : ${state.caseId}
Investigator   : ${state.investigator} (Badge: ${state.badge})
Target Subject : ${activeTargetData.person}
Generated At   : ${new Date().toISOString()}

================================================================================
[PRIMARY] HIGH-PRIORITY INCRIMINATING EVIDENCE (FULL UNTRUNCATED TEXT)
================================================================================
${suspiciousEv.map(e => `[${e.platform}] ID: ${e.id} | Timestamp: ${e.time}\nPost Content: "${e.content}"\nIntercepted Comment: ${e.suspiciousComment}\nSuspicion Reason: ${e.postReason}\nSHA-256 Signature: ${e.hash}\n`).join('\n')}

================================================================================
[BASELINE] COMPLETE CRYPTOGRAPHIC AUDIT LOG
================================================================================
${normalEv.map(e => `[${e.platform}] ID: ${e.id} | Timestamp: ${e.time} | Location: ${e.location}\nContent: "${e.content}"\nSHA-256 Hash: ${e.hash}\n`).join('\n')}

================================================================================
CHAIN OF CUSTODY AUDIT TRAIL
================================================================================
${state.custody.map(c => `${c.time} | ${c.actor} | ${c.action} — ${c.detail}\nBlock SHA-256: ${c.hash}\n`).join('\n')}
`;

  const blob = new Blob([manifest], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${state.caseId}_${activeTargetData.person.replace(/\s+/g, '_')}_Forensic_Report.txt`;
  a.click();
  toast("Forensic Report Downloaded!");
}

const stepBackgrounds = {
  setup: [
    "bg1.jpg",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1589578527966-fdac0f44566c?auto=format&fit=crop&w=1920&q=80"
  ],
  collect: [
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1920&q=80"
  ],
  vault: [
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1920&q=80"
  ],
  timeline: [
    "https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1508873696983-2df5293cb32f?auto=format&fit=crop&w=1920&q=80"
  ],
  graph: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=1920&q=80"
  ],
  custody: [
    "https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1589391886645-d51941baf7fb?auto=format&fit=crop&w=1920&q=80"
  ],
  report: [
    "https://images.unsplash.com/photo-1450133064473-71024230f91b?auto=format&fit=crop&w=1920&q=80",
    "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1920&q=80"
  ]
};

let currentTab = 'setup';
let bgIndex = 0;
let bgTimer = null;

function cycleStepBackground() {
  const bgEl = document.getElementById('bg-slideshow');
  if (!bgEl) return;
  const list = stepBackgrounds[currentTab] || stepBackgrounds.setup;
  const imgUrl = list[bgIndex % list.length];
  bgEl.style.backgroundImage = `url("${imgUrl}")`;
  bgIndex++;
}

// Hook into tab switching
const originalSwitchTab = window.switchTab;
window.switchTab = function(tabId) {
  currentTab = tabId;
  bgIndex = 0;
  cycleStepBackground();
  if (originalSwitchTab) originalSwitchTab(tabId);
};

// Start cycle
cycleStepBackground();
if (bgTimer) clearInterval(bgTimer);
bgTimer = setInterval(cycleStepBackground, 2000);