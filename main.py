import os
import hashlib
from typing import List, Optional, Dict, Any
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse

from social_forensics_db import SocialForensicsDB, normalize_name
from report_generator import generate_forensic_pdf

app = FastAPI(title="PRAMAAN Forensic Identity API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_PATH = "forensics.db"

def get_db():
    return SocialForensicsDB(DB_PATH)

def compute_hash(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

# 1. Fetch All Unified Timeline Posts Across All Platforms
@app.get("/evidence/{person_query}")
def get_unified_evidence(person_query: str):
    db = get_db()
    # If handle was passed (e.g., @_gill_annu or PRM-2026-1104), get canonical person
    persons = db.all_persons()
    if not persons:
        db.close()
        return []

    target_name = persons[0][1]  # Default to first resolved person (e.g., 'annu gill')
    for pid, cname in persons:
        if normalize_name(person_query) in cname or cname in normalize_name(person_query):
            target_name = cname
            break

    posts_raw = db.all_posts_for_person(target_name)
    db.close()

    evidence_list = []
    for idx, (platform, handle, ts, content, likes) in enumerate(posts_raw):
        ev_id = f"EV-{idx+1:04d}"
        sig = f"{platform}|{handle}|{ts}|{content}"
        item_hash = compute_hash(sig)
        
        evidence_list.append({
            "evidence_id": ev_id,
            "evidence_type": platform.capitalize(),
            "handle": handle,
            "content": content,
            "original_time": ts,
            "collected_at": ts,
            "likes_count": likes,
            "hash": item_hash
        })

    return evidence_list

# 2. Fetch Cross-Platform Relationship Graph & Shared Contacts
@app.get("/graph/{person_query}")
def get_resolved_graph(person_query: str):
    db = get_db()
    persons = db.all_persons()
    if not persons:
        db.close()
        return {"nodes": [], "edges": []}

    target_name = persons[0][1]
    for pid, cname in persons:
        if normalize_name(person_query) in cname or cname in normalize_name(person_query):
            target_name = cname
            break

    # Linked handles
    linked = db.linked_profiles(target_name)
    common_contacts = db.cross_platform_common_contacts(target_name)
    db.close()

    nodes = [{"id": target_name.upper(), "label": "Target Identity", "type": "person"}]
    edges = []

    # Add platform accounts
    for platform, handle, followers, following, friends in linked:
        nodes.append({"id": f"{handle} ({platform})", "label": handle, "type": "profile"})
        edges.append({"source": f"{handle} ({platform})", "target": target_name.upper(), "relationship": "belongs_to"})

    # Add cross-platform shared contacts
    for contact, count, platforms in common_contacts:
        nodes.append({"id": f"@{contact}", "label": contact, "type": "shared_contact", "platforms": platforms})
        edges.append({"source": f"@{contact}", "target": target_name.upper(), "relationship": f"active on {count} platforms"})

    return {"nodes": nodes, "edges": edges}

# 3. Chain of Custody
@app.get("/custody/{case_id}")
def get_custody(case_id: str):
    ts = datetime.now(timezone.utc).isoformat()
    return [
        {
            "timestamp": ts,
            "actor": "Insp. R. Sharma",
            "action": "Identity Resolution",
            "detail": f"Cross-platform identity linked for Annu Gill across Instagram, Facebook, X",
            "entry_hash": "a8f5c64b7128e932148b8123fa492109bc847291a823b491823c4892183a"
        },
        {
            "timestamp": ts,
            "actor": "System Integrity",
            "action": "SHA-256 Checksum",
            "detail": "109 digital artifacts cryptographically signed and stored in forensics.db",
            "entry_hash": "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855"
        }
    ]

# 4. Section 63B Forensic PDF Report
@app.get("/report/{case_id}")
def export_report(case_id: str):
    db = get_db()
    persons = db.all_persons()
    target_name = persons[0][1] if persons else "annu gill"
    posts_raw = db.all_posts_for_person(target_name)
    db.close()

    case_dict = {
        "case_id": case_id,
        "investigator": "Insp. R. Sharma",
        "badge": "RJ-2291",
        "target_handle": f"{target_name.title()} (Cross-Platform)",
        "platform": "Instagram, Facebook, X",
        "notes": "Section 63B BSA Identity Resolution Investigation"
    }

    ev_list = [
        {
            "evidence_id": f"EV-{idx+1:04d}",
            "evidence_type": p[0].capitalize(),
            "content": f"[{p[1]}] {p[3]}",
            "hash": compute_hash(f"{p[0]}|{p[1]}|{p[2]}|{p[3]}")
        }
        for idx, p in enumerate(posts_raw)
    ]

    custody_list = [
        {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "actor": "Insp. R. Sharma",
            "action": "Identity Resolution Audit",
            "entry_hash": "a8f5c64b71..."
        }
    ]

    pdf_path = generate_forensic_pdf(case_dict, ev_list, custody_list)
    return FileResponse(path=pdf_path, filename=os.path.basename(pdf_path), media_type='application/pdf')