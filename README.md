# PRAMAAN — Digital Forensic Intelligence Platform

> **Legally Admissible, Cryptographically Sealed Cross-Platform OSINT & Evidence Correlation System**  
> Built in compliance with **Section 63B of the Bharatiya Sakshya Adhiniyam (BSA), 2023** and the **Information Technology Act, 2000**.

---

## 📌 Executive Summary

**PRAMAAN** is an investigation and digital evidence platform designed for law enforcement officers, cyber forensic units, and OSINT analysts. 

Unlike probabilistic, black-box AI tools whose outputs can be challenged in legal proceedings for hallucination and bias, **PRAMAAN** uses an **explainable, deterministic heuristic engine** coupled with **cryptographic verification (SHA-256 chaining)**. It extracts cross-platform footprints (Instagram, Facebook, X), surfaces metadata contradictions (geolocation vs. alibi), maps social relationship graphs, and generates court-admissible forensic dossiers with an immutable Chain of Custody.

---

## ⚖️ Legal & Forensic Compliance

* **Section 63B Bharatiya Sakshya Adhiniyam (BSA), 2023:** Guarantees electronic record authenticity via cryptographic hash registers.
* **Irreversible Cryptographic Chaining:** Artifacts and investigator actions are hashed using the Web Crypto API (`SHA-256`) in an immutable block ledger.
* **Objective Intelligence Standard:** Replaces speculative labeling with factual classifications (**Flagged Interaction Leads**, **Mutual Bridges**, and **Frequent Associates**).

---

## 🚀 Key Features

* **Deterministic Identity Resolution:** Maps multi-platform handles (Instagram, Facebook, X/Twitter) to a primary suspect using seeded pseudorandom engines (`Mulberry32`).
* **Multi-Layer Suspicion Heuristics:**
  * *Counter-Surveillance Detection:* Identifies calls to delete chats, off-grid drop-offs, and burner phone switches.
  * *Alibi & Telemetry Mismatches:* Compares posted check-ins with carrier telemetry, EXIF data, and ISP ASN logs.
  * *Coded Broadcast Analysis:* Detects public posts used to coordinate private file transfers.
* **Dual-Entity Relationship Linker (Canvas Engine):**
  * *Dual-Target Mode (Suspect + Victim):* Visualizes the suspect (Amber), victim (Cyan), mutual bridges (Green), and flagged threat leads (Red).
  * *Single-Target Mode:* Automatically re-centers around the suspect and frequent baseline associates.
* **Split-Architecture Evidence Vault:**
  * Direct toggle between Suspect Evidence and Victim Reference logs.
  * Full untruncated viewing of posts, intercepted replies, and investigation rationales.
* **Court-Ready PDF Dossier Export:**
  * Uses `jsPDF` and `autoTable` with full text wrapping (no truncation or missing lines).
  * Direct rendering of the Canvas relationship diagram into Section 2 of the PDF report.

---

## 🏗️ Architecture & Forensic Workflow

```
[ Case Setup ] ─────► [ Data Collection ] ─────► [ Evidence Vault & SHA-256 ]
  (Suspect + Victim)     (Multi-Platform Links)       (Split Suspect/Victim Views)
                                                               │
                                                               ▼
[ Forensic Dossier PDF ] ◄─── [ Chain of Custody ] ◄─── [ Relationship Graph ]
 (Section 63B BSA Sealed)       (Immutable Block Ledger)   (Dual/Solo Mode Canvas)
```

---

## 📂 Project Structure

```
.
├── index.html       # Forensic interface, dashboards, canvas & responsive viewport
├── app.js           # Deterministic PRNG, SHA-256 engine, graph renderer & PDF exporter
├── style.css        # Theme variables, grid alignments, and responsive media queries
└── README.md        # Technical and forensic documentation
```

---

## 🛠️ Technology Stack

* **Frontend UI:** Semantic HTML5, Modular CSS3 (Custom Dark Cyber Theme).
* **Graph Engine:** HTML5 Canvas API (Dynamic 2D Vector Rendering).
* **Cryptography:** Native Web Crypto API (`crypto.subtle.digest` SHA-256).
* **Report Generation:** `jsPDF` (v2.5.1) & `jspdf-autotable` (v3.8.2).
* **Typography:** Google Fonts (`IBM Plex Mono` & `IBM Plex Sans`).

---

## ⚙️ Getting Started

1. Clone or download the repository to your local directory:
   ```bash
   git clone [https://github.com/your-repo/pramaan-forensics.git](https://github.com/your-repo/pramaan-forensics.git)
   cd pramaan-forensics
   ```
2. Open `index.html` in any modern web browser (Google Chrome, Firefox, Safari, or Microsoft Edge).  
   *Alternatively, run a local development server:*
   ```bash
   # Using Python
   python3 -m http.server 5500

   # Or using Node.js Live Server
   npx live-server
   ```
3. Navigate to `http://localhost:5500` in your browser.

---

## 📋 Step-by-Step Usage Guide

1. **Case Setup:** Enter Investigator credentials, Badge ID, Suspect Handle, and optional Victim/Complainant details. Click **Create Case & Link Target**.
2. **Data Collection:** Click **Run Extraction & Ingest** to extract cross-platform artifacts and compute cryptographic signatures.
3. **Evidence Vault:** Review verified records. Switch between **Suspect Evidence** and **Victim Reference Data** using the toggle bar. Hover over rows to inspect forensic triggers.
4. **Relationship Analysis:** Open the **Relationships** tab to review the node graph and legend.
5. **Report Export:** Go to the **Report** tab and click **Download Certified Forensic Report (.PDF)** to generate the sealed dossier.

---

## 📄 Case Reference Format

Each case generates a unique reference identifier:
```
PRM - [YEAR] - [DETERMINISTIC CASE NUMBER]
Example: PRM-2026-5601
```
* **PRM:** PRAMAAN Platform Identifier
* **2026:** Year of Assessment
* **5601:** Seeded Case Docket Reference Number

---

## 🛡️ License

This project is open-source and intended for authorized digital forensic simulations, OSINT research, and educational purposes.
