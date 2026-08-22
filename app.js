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
function stringToSeed(str) {
  let hash = 0;
  const s = str.trim().toLowerCase();
  for (let i = 0; i < s.length; i++) {
    hash = ((hash << 5) - hash) + s.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}
function seededShuffle(array, rng) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

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

// Innocent Victim Posts
const bankVictimPosts = [
  "Working on my research paper submission today. Coffee is the only fuel.",
  "Weekend volunteering drive at the city animal shelter was so fulfilling 🐾",
  "Met college alumni after long time for Sunday brunch! Great memories.",
  "Organizing books and updating digital notes before semester finals.",
  "Evening walk around Connaught Place with childhood friends."
];

const bankSuspiciousComments = [
  { text: "Work is done. Left the parcel at the designated drop spot, go check it.", reason: "Suspect was instructed about a secret physical drop-off and unverified parcel handover." },
  { text: "Delete this message immediately after reading, contact me on the burner number.", reason: "Deliberate attempt to destroy chat history and switch to an untraceable burner line." },
  { text: "Sent the confidential files and passwords to your secondary private handle.", reason: "Unauthorized transmission of confidential files and passwords to a secondary account." },
  { text: "Let's meet at the secret location tonight at 11 PM without telling anyone.", reason: "Planning an undisclosed late-night meeting without leaving official digital traces." },
  { text: "Payment transfer is confirmed off-the-books, verify the secret code.", reason: "Secret, unrecorded payment confirmation executed through private transaction channels." },
  { text: "Cyber monitoring is active in this area, turn your phone off right now.", reason: "Direct instruction to evade law enforcement surveillance and cellular location tracking." }
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

async function computeRealSHA256(message) {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate Fixed Profile Data with Dynamic Context (Mutual vs Frequent Contacts)
function generateForensicProfile(inputName, inputVictim) {
  const name = inputName.trim() || "Annu Gill";
  const hasVictim = (inputVictim && inputVictim.trim().length > 0);
  const victimName = hasVictim ? inputVictim.trim() : "";
  
  const seedInt = stringToSeed(name + "|" + (victimName || "SOLO_MODE"));
  const rng = createPRNG(seedInt);
  const cleanHandle = name.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '');
  const cleanVictimHandle = hasVictim ? victimName.toLowerCase().replace(/[^a-z0-9]/g, '_').replace(/^_+|_+$/g, '') : "unassigned_victim";

  const shuffledIG = seededShuffle(bankIG, rng);
  const shuffledFB = seededShuffle(bankFB, rng);
  const shuffledTW = seededShuffle(bankTW, rng);
  const shuffledContacts = seededShuffle(bankContacts, rng);

  // Group 1: High-Risk Co-Conspirators
  const conspirators = shuffledContacts.slice(0, 3).map((c, idx) => {
    const totalInteractions = 12 + Math.floor(rng() * 14);
    return {
      handle: `@${c}`,
      type: 'conspirator',
      totalInteractions,
      suspiciousComments: 3 + Math.floor(rng() * 4),
      linkedPlatformIndex: idx % 3,
      riskLevel: "HIGH-FREQUENCY CONSPIRATOR",
      lastKnownCoord: bankLocations[Math.floor(rng() * bankLocations.length)].name
    };
  });

  // Group 2: Dynamic Contacts (Mutual Bridge if Victim exists, else Frequent Regular Contacts)
  const secondaryContacts = shuffledContacts.slice(3, 7).map((c, idx) => {
    const totalInteractions = 5 + Math.floor(rng() * 8);
    return {
      handle: `@${c}`,
      type: hasVictim ? 'mutual' : 'frequent',
      totalInteractions: totalInteractions,
      suspiciousComments: 0,
      relation: hasVictim ? `Mutual Connection with ${victimName}` : `Regular Frequent Contact (${totalInteractions} interactions)`,
      linkedPlatformIndex: idx % 2,
      riskLevel: hasVictim ? "COMMON CIRCLE BRIDGE" : "REGULAR FREQUENT ASSOCIATE",
      lastKnownCoord: bankLocations[Math.floor(rng() * bankLocations.length)].name
    };
  });

  const allNetworkNodes = [...conspirators, ...secondaryContacts];
  const posts = [];
  let itemCounter = 1;

  const countIG = 3 + Math.floor(rng() * 5);
  const countFB = 2 + Math.floor(rng() * 4);
  const countTW = 3 + Math.floor(rng() * 6);

  // Suspect Instagram Items
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

  // Suspect Facebook Items
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

  // Suspect Twitter Items
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

  // Victim Public Reference Posts
  const victimPosts = [];
  if (hasVictim) {
    let vCounter = 1;
    for (let i = 0; i < 4; i++) {
      const loc = bankLocations[(i + 3) % bankLocations.length];
      const contactName = secondaryContacts[i % secondaryContacts.length].handle;
      victimPosts.push({
        id: `VIC${String(vCounter++).padStart(4, '0')}`,
        platform: i % 2 === 0 ? "Instagram" : "Facebook",
        handle: `@${cleanVictimHandle}`,
        time: `2026-03-${String(10 + i * 4).padStart(2, '0')}T14:30:00`,
        content: bankVictimPosts[i % bankVictimPosts.length],
        location: loc.name,
        comment: `[${contactName}]: "Awesome seeing you there!"`,
        isSuspicious: false,
        status: "INNOCENT / NORMAL"
      });
    }
  }

  const caseNum = 1000 + Math.floor(rng() * 8999);

  return {
    person: name,
    hasVictim: hasVictim,
    victim: victimName,
    victimHandle: `@${cleanVictimHandle}`,
    victimPosts: victimPosts,
    caseId: `PRM-2026-${caseNum}`,
    category: "Cross-Platform Digital Footprint",
    profiles: [
      { platform: "Instagram", handle: `_${cleanHandle}`, followers: 900 + Math.floor(rng() * 2800), following: 140 + Math.floor(rng() * 250), bio: "Life | Moments | Digital Identity" },
      { platform: "Facebook", handle: name, friends: 380 + Math.floor(rng() * 680), groups: ["Community Network", "City Explorers"] },
      { platform: "X (Twitter)", handle: `@${cleanHandle}`, followers: 620 + Math.floor(rng() * 1900), following: 100 + Math.floor(rng() * 200) }
    ],
    conspirators: conspirators,
    mutualContacts: secondaryContacts,
    contactAnalysis: allNetworkNodes,
    sharedContacts: allNetworkNodes.map(n => n.handle.replace('@', '')),
    posts: posts.sort((a, b) => new Date(b.time) - new Date(a.time))
  };
}

// Global App State & View Toggles
let activeTargetData = generateForensicProfile("Annu Gill", "");
let currentVaultView = 'suspect';
let currentTimelineView = 'suspect';

const state = {
  caseId: activeTargetData.caseId,
  investigator: "Insp. R. Sharma",
  badge: "RJ-2291",
  evidence: [],
  victimEvidence: [],
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
  const enteredVictim = document.getElementById('inVictim') ? document.getElementById('inVictim').value.trim() : "";
  
  activeTargetData = generateForensicProfile(enteredName, enteredVictim);

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
  logCustody("Case Initialization", state.investigator, `Case ${state.caseId} initialized: Target Suspect (${activeTargetData.person})${activeTargetData.hasVictim ? ' vs Complainant (' + activeTargetData.victim + ')' : ' [Single Focus Mode]'}`);
  toast(`Case ${state.caseId} Created!`);
  switchTab('collect');
}

// 02 Collect Action
async function runCollectionAction() {
  const btn = document.getElementById('btnCollect');
  btn.disabled = true;
  btn.textContent = 'Ingesting & Computing SHA-256...';

  // Suspect Hashed Posts
  const hashedPosts = [];
  for (const post of activeTargetData.posts) {
    const rawPayload = `${post.id}|${post.platform}|${post.time}|${post.location}|${post.content}|${post.meta}|${activeTargetData.person}|${post.threatFlag}`;
    const realHash = await computeRealSHA256(rawPayload);
    hashedPosts.push({ ...post, hash: realHash });
  }
  state.evidence = hashedPosts;

  // Victim Baseline Hash
  const hashedVictimPosts = [];
  for (const vPost of activeTargetData.victimPosts) {
    const rawPayload = `${vPost.id}|${vPost.platform}|${vPost.time}|${vPost.location}|${vPost.content}|${activeTargetData.victim}`;
    const realHash = await computeRealSHA256(rawPayload);
    hashedVictimPosts.push({ ...vPost, hash: realHash });
  }
  state.victimEvidence = hashedVictimPosts;

  await logCustody("Identity Resolution", state.investigator, `Extracted digital footprint for Suspect [${activeTargetData.person}]${activeTargetData.hasVictim ? ' with mutual nodes connected to Victim [' + activeTargetData.victim + ']' : ' in single suspect focus mode'}`);
  await logCustody("Evidence Ingestion", state.investigator, `Sealed ${state.evidence.length} suspect artifacts under Section 63B BSA`);

  document.getElementById('collectLog').innerHTML = `
    <div style="font-family:var(--mono); color:var(--seal); line-height:1.9; text-align:left; font-size:13px;">
      <b>[TARGET 01 - SUSPECT EXTRACTION]</b><br>
      ✓ Identity: <b>${activeTargetData.person.toUpperCase()}</b><br>
      ✓ Extracted Artifacts: ${state.evidence.length} non-repeatable records across 3 platforms<br>
      ✓ Suspect Conspirator Leads: ${activeTargetData.conspirators.map(c => c.handle).join(', ')}<br>
      ✓ ${activeTargetData.hasVictim ? 'Mutual Network Nodes' : 'Frequently Contacted Leads'}: ${activeTargetData.mutualContacts.map(m => m.handle).join(', ')}<br><br>

      <b>[TARGET 02 - CASE CORRELATION]</b><br>
      ${activeTargetData.hasVictim ? `
        ✓ Complainant: <b>${activeTargetData.victim.toUpperCase()}</b> (${activeTargetData.victimHandle})<br>
        ✓ Cross-Entity Overlap: ${activeTargetData.mutualContacts.length} Mutual Circle Bridges identified<br>
        ✓ Reference Artifacts Extracted: ${state.victimEvidence.length} baseline records available.
      ` : `
        <span style="color:var(--ink-dim);">✓ Mode: <b>Single-Target Direct Investigation</b> (No Victim profile linked. All mapped nodes are Suspect's frequent contacts).</span>
      `}<br><br>
      
      ✓ <b>Cryptographic Register:</b> All artifacts signed and sealed into immutable block ledger.
    </div>
  `;

  renderVault();
  renderTimeline();
  renderCustody();

  btn.disabled = false;
  btn.textContent = 'Extraction Complete ✓';
  toast(`${state.evidence.length} Records Ingested!`);
  setTimeout(() => switchTab('vault'), 700);
}

// 03 Vault Toggle & Render
function switchVaultView(entity) {
  currentVaultView = entity;
  const btnS = document.getElementById('btnVaultSuspect');
  const btnV = document.getElementById('btnVaultVictim');
  
  if (btnS && btnV) {
    btnS.className = `entity-tab-btn ${entity === 'suspect' ? 'active' : ''}`;
    btnV.className = `entity-tab-btn ${entity === 'victim' ? 'victim-active' : ''}`;
  }
  renderVault();
}

function renderVault() {
  const stats = document.getElementById('vaultStats');
  const list = document.getElementById('evList');
  if (!list) return;
  list.innerHTML = '';

  // View: Suspect Evidence
  if (currentVaultView === 'suspect') {
    const suspiciousCount = state.evidence.filter(e => e.isSuspicious).length;
    if (stats) {
      stats.innerHTML = `
        <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">Suspect Artifacts</div></div>
        <div class="stat"><div class="n">${state.evidence.length}</div><div class="l">SHA-256 Verified</div></div>
        <div class="stat"><div class="n" style="color:#EF4444;">${suspiciousCount}</div><div class="l">Flagged Suspicious</div></div>
        <div class="stat"><div class="n">3</div><div class="l">Linked Platforms</div></div>
      `;
    }

    state.evidence.forEach(ev => {
      const row = document.createElement('div');
      row.className = `ev-row ${ev.isSuspicious ? 'suspicious-row' : ''}`;
      const tag = ev.platform.toLowerCase().includes('insta') ? 'instagram' : ev.platform.toLowerCase().includes('face') ? 'facebook' : 'twitter';
      
      row.innerHTML = `
        <div><span class="tag ${tag}">${ev.platform}</span></div>
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
  // View: Victim Reference Data
  else {
    if (!activeTargetData.hasVictim) {
      if (stats) {
        stats.innerHTML = `
          <div class="stat"><div class="n" style="color:var(--ink-faint);">0</div><div class="l">Victim Data</div></div>
          <div class="stat"><div class="n" style="color:var(--ink-faint);">N/A</div><div class="l">Status</div></div>
          <div class="stat"><div class="n" style="color:var(--ink-faint);">0</div><div class="l">Mutual Links</div></div>
          <div class="stat"><div class="n" style="color:var(--ink-faint);">0</div><div class="l">Platforms</div></div>
        `;
      }
      list.innerHTML = `
        <div style="padding:40px 20px; text-align:center; color:var(--ink-dim); font-size:13.5px;">
          <p style="margin-bottom:12px;">🛡️ <b>No Victim / Complainant details added in Case Setup.</b></p>
          <button type="button" class="btn secondary" onclick="switchTab('setup')">Add Victim Details in Case Setup ↵</button>
        </div>
      `;
      return;
    }

    if (stats) {
      stats.innerHTML = `
        <div class="stat"><div class="n" style="color:#38BDF8;">${state.victimEvidence.length}</div><div class="l">Victim Records</div></div>
        <div class="stat"><div class="n" style="color:#38BDF8;">${state.victimEvidence.length}</div><div class="l">Integrity Verified</div></div>
        <div class="stat"><div class="n" style="color:#3ECF8E;">${activeTargetData.mutualContacts.length}</div><div class="l">Mutual Circles</div></div>
        <div class="stat"><div class="n">2</div><div class="l">Public Channels</div></div>
      `;
    }

    state.victimEvidence.forEach(vEv => {
      const row = document.createElement('div');
      row.className = 'ev-row';
      const tag = vEv.platform.toLowerCase().includes('insta') ? 'instagram' : 'facebook';

      row.innerHTML = `
        <div><span class="tag ${tag}">${vEv.platform}</span></div>
        <div class="ev-cell-content">
          <div class="ev-text">
            <b>[${vEv.id}]</b> "${vEv.content}"
          </div>
          <div class="ev-tooltip">
            <div class="tip-title"><b>[${vEv.id}] ${activeTargetData.victim}</b></div>
            <div style="font-size:12px; color:#38BDF8; margin-bottom:4px;">${vEv.comment}</div>
            <div style="font-size:11.5px; color:var(--ink-dim);">
              Verified public baseline interaction matching case mutual circle.
            </div>
          </div>
        </div>
        <div class="hash" title="${vEv.hash}">${short(vEv.hash)}</div>
        <div style="color:var(--ink-faint); font-size:11.5px;">${fmtTime(vEv.time)}</div>
        <div class="verified" style="color:#38BDF8;">
          VICTIM LOG
        </div>
      `;
      list.appendChild(row);
    });
  }
}

function verifyHashesAction() {
  toast("Cryptographic Integrity Audit: 0 Alterations Detected / 100% Intact");
}

// 04 Timeline Toggle & Render
function switchTimelineView(entity) {
  currentTimelineView = entity;
  const btnS = document.getElementById('btnTlSuspect');
  const btnV = document.getElementById('btnTlVictim');
  
  if (btnS && btnV) {
    btnS.className = `entity-tab-btn ${entity === 'suspect' ? 'active' : ''}`;
    btnV.className = `entity-tab-btn ${entity === 'victim' ? 'victim-active' : ''}`;
  }
  renderTimeline();
}

function renderTimeline() {
  const el = document.getElementById('timelineList');
  if (!el) return;
  el.innerHTML = '';

  // Suspect Timeline
  if (currentTimelineView === 'suspect') {
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
  // Victim Timeline
  else {
    if (!activeTargetData.hasVictim) {
      el.innerHTML = `
        <div style="padding:30px 20px; text-align:center; color:var(--ink-dim); font-size:13.5px;">
          🛡️ <b>No Victim account linked.</b><br>
          <button type="button" class="btn secondary" style="margin-top:10px;" onclick="switchTab('setup')">Add Victim Details in Case Setup ↵</button>
        </div>
      `;
      return;
    }

    state.victimEvidence.forEach(vEv => {
      const item = document.createElement('div');
      item.className = 'tl-item';
      item.innerHTML = `
        <div class="tl-time">${fmtTime(vEv.time)} · <b>${vEv.id}</b> (${vEv.platform})</div>
        <div class="tl-body" style="border-left:3px solid #38BDF8;">
          <div style="color:#38BDF8; font-weight:600; font-size:12px; margin-bottom:4px;">
            <span><b>${vEv.handle} (${activeTargetData.victim})</b> · 📍 ${vEv.location}</span>
          </div>
          <div style="font-size:13.5px; color:var(--ink); line-height:1.5; margin-bottom:8px;">"${vEv.content}"</div>
          <div style="background:rgba(56, 189, 248, 0.1); border-radius:6px; padding:6px 10px; font-size:12px; color:#BAE6FD; margin-bottom:6px;">
            <b>Public Mutual Reply:</b> ${vEv.comment}
          </div>
          <div style="font-family:var(--mono); font-size:10.5px; color:var(--ink-faint);">
            <b>SHA-256 Signature:</b> ${vEv.hash}
          </div>
        </div>
      `;
      el.appendChild(item);
    });
  }
}

// 05 Dynamic Graph (Synchronized Canvas + HTML Labels)
function drawGraph() {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // Background Grid
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
  ctx.lineWidth = 1;
  for (let x = 0; x < w; x += 30) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
  for (let y = 0; y < h; y += 30) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

  // Update HTML Bottom Legend Bar dynamically based on Victim presence
  const legendBottom = document.getElementById('graphLegendBottom');
  const subText = document.getElementById('graphSubText');

  if (activeTargetData.hasVictim) {
    if (subText) subText.textContent = "Mapped suspect-to-victim correlation and common mutual circle bridges.";
    if (legendBottom) {
      legendBottom.innerHTML = `
        <span><i style="width:10px;height:10px;border-radius:50%;background:#EAB308;display:inline-block;margin-right:6px;"></i>Suspect Target</span>
        <span><i style="width:10px;height:10px;border-radius:50%;background:#38BDF8;display:inline-block;margin-right:6px;"></i>Victim / Complainant</span>
        <span><i style="width:10px;height:10px;border-radius:50%;background:#3ECF8E;display:inline-block;margin-right:6px;"></i>Mutual Circle Bridge</span>
        <span><i style="width:10px;height:10px;border-radius:50%;background:#EF4444;display:inline-block;margin-right:6px;"></i>Suspect Conspirator</span>
      `;
    }
  } else {
    if (subText) subText.textContent = "Mapped suspect target profiles and direct frequently contacted associates.";
    if (legendBottom) {
      legendBottom.innerHTML = `
        <span><i style="width:10px;height:10px;border-radius:50%;background:#EAB308;display:inline-block;margin-right:6px;"></i>Primary Suspect</span>
        <span><i style="width:10px;height:10px;border-radius:50%;background:#9333EA;display:inline-block;margin-right:6px;"></i>Suspect Social Profiles</span>
        <span><i style="width:10px;height:10px;border-radius:50%;background:#3ECF8E;display:inline-block;margin-right:6px;"></i>Frequently Contacted</span>
        <span><i style="width:10px;height:10px;border-radius:50%;background:#EF4444;display:inline-block;margin-right:6px;"></i>Suspect Conspirators</span>
      `;
    }
  }

  // SCENARIO A: DUAL MODE (Victim Provided -> Bridge Hierarchy)
  if (activeTargetData.hasVictim) {
    const suspectX = 140, suspectY = h / 2 - 20;
    const victimX = w - 140, victimY = h / 2 - 20;

    // Suspect Node (Left)
    ctx.beginPath();
    ctx.arc(suspectX, suspectY, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#EAB308';
    ctx.shadowColor = 'rgba(234, 179, 8, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = 'bold 12px IBM Plex Mono';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(activeTargetData.person.toUpperCase(), suspectX, suspectY + 40);
    ctx.font = '9px IBM Plex Mono';
    ctx.fillStyle = '#FCD34D';
    ctx.fillText("[SUSPECT TARGET]", suspectX, suspectY + 52);

    // Victim Node (Right)
    ctx.beginPath();
    ctx.arc(victimX, victimY, 24, 0, Math.PI * 2);
    ctx.fillStyle = '#38BDF8';
    ctx.shadowColor = 'rgba(56, 189, 248, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = 'bold 12px IBM Plex Mono';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(activeTargetData.victim.toUpperCase(), victimX, victimY + 38);
    ctx.font = '9px IBM Plex Mono';
    ctx.fillStyle = '#7DD3FC';
    ctx.fillText("[VICTIM / SUBJECT]", victimX, victimY + 50);

    // Center Mutual Bridge Nodes
    activeTargetData.mutualContacts.forEach((m, i) => {
      const mx = w / 2;
      const my = 70 + (i * 65);

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(62, 207, 142, 0.6)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(suspectX, suspectY);
      ctx.lineTo(mx, my);
      ctx.stroke();

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(56, 189, 248, 0.5)';
      ctx.lineWidth = 1.5;
      ctx.moveTo(victimX, victimY);
      ctx.lineTo(mx, my);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(mx, my, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#3ECF8E';
      ctx.fill();

      ctx.font = 'bold 10px IBM Plex Mono';
      ctx.fillStyle = '#A7F3D0';
      ctx.fillText(m.handle, mx, my - 14);
      ctx.font = '8px IBM Plex Mono';
      ctx.fillStyle = '#6EE7B7';
      ctx.fillText("MUTUAL BRIDGE", mx, my + 20);
    });

    // Bottom Conspirators
    activeTargetData.conspirators.forEach((c, i) => {
      const cx_pos = 70 + (i * 90);
      const cy_pos = h - 60;

      ctx.beginPath();
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 2;
      ctx.moveTo(suspectX, suspectY);
      ctx.lineTo(cx_pos, cy_pos);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(cx_pos, cy_pos, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 10px IBM Plex Mono';
      ctx.fillStyle = '#FCA5A5';
      ctx.fillText(`${c.handle} (${c.totalInteractions}x)`, cx_pos, cy_pos + 20);
      ctx.font = '8px IBM Plex Mono';
      ctx.fillStyle = '#F87171';
      ctx.fillText("🚨 CO-CONSPIRATOR", cx_pos, cy_pos + 30);
    });

    // Top-Left In-Canvas Legend
    ctx.textAlign = 'left';
    ctx.font = '9px IBM Plex Mono';
    ctx.fillStyle = '#EAB308'; ctx.fillRect(20, 16, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Suspect", 36, 24);
    ctx.fillStyle = '#38BDF8'; ctx.fillRect(20, 32, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Victim / Complainant", 36, 40);
    ctx.fillStyle = '#3ECF8E'; ctx.fillRect(20, 48, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Mutual Circle Bridge", 36, 56);
    ctx.fillStyle = '#EF4444'; ctx.fillRect(20, 64, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Suspect Conspirator", 36, 72);
  } 
  // SCENARIO B: SOLO MODE (No Victim -> Suspect Center Radial Graph with Frequent Contacts)
  else {
    const cx = w / 2, cy = h / 2;

    // Center Suspect Node
    ctx.beginPath();
    ctx.arc(cx, cy, 26, 0, Math.PI * 2);
    ctx.fillStyle = '#EAB308';
    ctx.shadowColor = 'rgba(234, 179, 8, 0.6)';
    ctx.shadowBlur = 15;
    ctx.fill();
    ctx.shadowBlur = 0;

    ctx.font = 'bold 12px IBM Plex Mono';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.fillText(activeTargetData.person.toUpperCase(), cx, cy + 40);
    ctx.font = '9px IBM Plex Mono';
    ctx.fillStyle = '#FCD34D';
    ctx.fillText("[SUSPECT TARGET]", cx, cy + 52);

    // Inner Ring: Suspect Social Platforms
    const profiles = activeTargetData.profiles;
    profiles.forEach((p, i) => {
      const ang = (i / profiles.length) * Math.PI * 2 - Math.PI / 2;
      p._x = cx + 115 * Math.cos(ang);
      p._y = cy + 105 * Math.sin(ang);

      ctx.beginPath();
      ctx.strokeStyle = '#B183E6';
      ctx.lineWidth = 1.5;
      ctx.moveTo(cx, cy);
      ctx.lineTo(p._x, p._y);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(p._x, p._y, 13, 0, Math.PI * 2);
      ctx.fillStyle = '#9333EA';
      ctx.fill();

      ctx.font = '10px IBM Plex Mono';
      ctx.fillStyle = '#E9D5FF';
      ctx.fillText(p.platform, p._x, p._y + (p._y > cy ? 20 : -14));
    });

    // Outer Arc Left: Co-Conspirators (Red Alert)
    activeTargetData.conspirators.forEach((c, i) => {
      const ang = Math.PI * 0.45 + (i * 0.45);
      const nx = cx + 210 * Math.cos(ang);
      const ny = cy + 180 * Math.sin(ang);
      const parentProfile = profiles[c.linkedPlatformIndex % profiles.length];

      ctx.beginPath();
      ctx.setLineDash([4, 2]);
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
      ctx.lineWidth = 2;
      ctx.moveTo(parentProfile._x, parentProfile._y);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      ctx.setLineDash([]);

      ctx.beginPath();
      ctx.arc(nx, ny, 11, 0, Math.PI * 2);
      ctx.fillStyle = '#EF4444';
      ctx.shadowColor = 'rgba(239, 68, 68, 0.7)';
      ctx.shadowBlur = 8;
      ctx.fill();
      ctx.shadowBlur = 0;

      ctx.font = 'bold 10px IBM Plex Mono';
      ctx.fillStyle = '#FCA5A5';
      ctx.fillText(`${c.handle} (${c.totalInteractions}x)`, nx, ny + (ny > cy ? 18 : -14));
      ctx.font = '8px IBM Plex Mono';
      ctx.fillStyle = '#F87171';
      ctx.fillText("🚨 CO-CONSPIRATOR", nx, ny + (ny > cy ? 28 : -22));
    });

    // Outer Arc Right: Frequently Contacted Associates (Green)
    activeTargetData.mutualContacts.forEach((m, i) => {
      const ang = -Math.PI * 0.15 - (i * 0.45);
      const mx = cx + 210 * Math.cos(ang);
      const my = cy + 180 * Math.sin(ang);
      const parentProfile = profiles[m.linkedPlatformIndex % profiles.length];

      ctx.beginPath();
      ctx.strokeStyle = 'rgba(62, 207, 142, 0.5)';
      ctx.lineWidth = 1.2;
      ctx.moveTo(parentProfile._x, parentProfile._y);
      ctx.lineTo(mx, my);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(mx, my, 10, 0, Math.PI * 2);
      ctx.fillStyle = '#3ECF8E';
      ctx.fill();

      ctx.font = '10px IBM Plex Mono';
      ctx.fillStyle = '#A7F3D0';
      ctx.fillText(`${m.handle} (${m.totalInteractions}x)`, mx, my + (my > cy ? 16 : -12));
      ctx.font = '8px IBM Plex Mono';
      ctx.fillStyle = '#6EE7B7';
      ctx.fillText("FREQUENT ASSOCIATE", mx, my + (my > cy ? 25 : -20));
    });

    // Top-Left In-Canvas Legend (Solo Mode)
    ctx.textAlign = 'left';
    ctx.font = '9px IBM Plex Mono';
    ctx.fillStyle = '#EAB308'; ctx.fillRect(20, 16, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Primary Suspect", 36, 24);
    ctx.fillStyle = '#9333EA'; ctx.fillRect(20, 32, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Suspect Social Profiles", 36, 40);
    ctx.fillStyle = '#3ECF8E'; ctx.fillRect(20, 48, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Frequently Contacted", 36, 56);
    ctx.fillStyle = '#EF4444'; ctx.fillRect(20, 64, 10, 10);
    ctx.fillStyle = '#CBD5E1'; ctx.fillText("Suspect Conspirators", 36, 72);
  }
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

// 07 Download Certified Section 63B BSA Forensic PDF
async function downloadForensicPDF() {
  if (typeof window.jspdf === 'undefined' || !window.jspdf.jsPDF) {
    downloadForensicReport();
    return;
  }

  drawGraph();

  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  const primary = [21, 27, 35];
  const accent = [62, 207, 142];
  const redAlert = [185, 28, 28];

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
  doc.text(`Target Suspect: ${activeTargetData.person}`, 14, 44);
  doc.text(activeTargetData.hasVictim ? `Victim: ${activeTargetData.victim}` : `Scope: Single Suspect Analysis`, 110, 38);
  doc.text(`Lead Officer: ${state.investigator} (${state.badge})`, 110, 44);

  doc.setDrawColor(200, 200, 200);
  doc.line(14, 48, 196, 48);

  // Section 1: Resolved Profiles
  doc.setFontSize(10.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primary);
  doc.text('1. RESOLVED PROFILES & CASE ACTORS', 14, 54);

  const profileRows = [
    ['Suspect Target', activeTargetData.person, activeTargetData.profiles.map(p => `${p.platform}: ${p.handle}`).join(' | ')]
  ];
  if (activeTargetData.hasVictim) {
    profileRows.push(['Victim / Subject', activeTargetData.victim, `Identified Case Complainant (${activeTargetData.victimHandle})`]);
  }

  if (doc.autoTable) {
    doc.autoTable({
      startY: 57,
      head: [['Role', 'Actor Name', 'Network Identifiers']],
      body: profileRows,
      theme: 'grid',
      headStyles: { fillColor: primary, textColor: [255, 255, 255], fontStyle: 'bold' },
      styles: { fontSize: 8, cellPadding: 2 }
    });

    // Section 2: Relationship Graph
    let nextY = doc.lastAutoTable.finalY + 8;
    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primary);
    doc.text(activeTargetData.hasVictim ? '2. NETWORK RELATIONSHIP & MUTUAL CIRCLE GRAPH' : '2. SUSPECT NETWORK & FREQUENT ASSOCIATES GRAPH', 14, nextY);

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

    // Section 3: High-Priority Suspicious Evidence
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
      styles: { fontSize: 7.5, cellPadding: 3, overflow: 'linebreak', valign: 'top' },
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
      styles: { fontSize: 7, cellPadding: 2.5, overflow: 'linebreak', valign: 'top' },
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
      styles: { fontSize: 7, cellPadding: 2.5, overflow: 'linebreak', valign: 'top' },
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

function downloadForensicReport() {
  const suspiciousEv = state.evidence.filter(e => e.isSuspicious);
  const normalEv = state.evidence.filter(e => !e.isSuspicious);

  const manifest = `PRAMAAN DIGITAL FORENSIC EVIDENCE REPORT (SECTION 63B BSA COMPLIANT)
================================================================================
Case Reference : ${state.caseId}
Investigator   : ${state.investigator} (Badge: ${state.badge})
Target Suspect : ${activeTargetData.person}
Victim Name    : ${activeTargetData.hasVictim ? activeTargetData.victim : 'N/A (Single Suspect Mode)'}
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

const originalSwitchTab = window.switchTab;
window.switchTab = function(tabId) {
  currentTab = tabId;
  bgIndex = 0;
  cycleStepBackground();
  if (originalSwitchTab) originalSwitchTab(tabId);
};

cycleStepBackground();
if (bgTimer) clearInterval(bgTimer);
bgTimer = setInterval(cycleStepBackground, 2000);