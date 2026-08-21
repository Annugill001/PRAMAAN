import os
import hashlib
from typing import List, Optional
from datetime import datetime, timezone

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field

from collector import capture_target_evidence, hash_bytes
from report_generator import generate_forensic_pdf

app = FastAPI(title="PRAMAAN Digital Forensic API")

# Enable Full CORS for local browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def generate_sha256(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

# --- Models ---
class Case(BaseModel):
    case_id: str
    investigator: str
    badge: str
    target_handle: str
    platform: str
    notes: str
    created_at: str = Field(default_factory=now_iso)

class Evidence(BaseModel):
    evidence_id: str
    case_id: str
    evidence_type: str
    content: str
    original_time: str
    collected_at: str = Field(default_factory=now_iso)
    hash: Optional[str] = None
    file_path: Optional[str] = None
    flagged: bool = False

class CustodyLog(BaseModel):
    timestamp: str = Field(default_factory=now_iso)
    actor: str
    action: str
    detail: str
    prev_hash: str
    entry_hash: Optional[str] = None

class CollectRequest(BaseModel):
    case_id: str
    target_url: str
    evidence_type: str = "post"

# --- In-Memory State ---
db_cases: List[Case] = []
db_evidence: List[Evidence] = []
db_custody: List[CustodyLog] = []

def add_custody_log(actor: str, action: str, detail: str) -> CustodyLog:
    prev_hash = db_custody[-1].entry_hash if db_custody else "0" * 64
    log_entry = CustodyLog(actor=actor, action=action, detail=detail, prev_hash=prev_hash)
    raw_data = f"{prev_hash}|{log_entry.timestamp}|{actor}|{action}|{detail}"
    log_entry.entry_hash = generate_sha256(raw_data)
    db_custody.append(log_entry)
    return log_entry

# --- API Endpoints ---
@app.get("/")
def health():
    return {"status": "running", "cases": len(db_cases)}

@app.post("/cases/", response_model=Case)
def create_case(case: Case):
    db_cases.append(case)
    add_custody_log(
        actor=case.investigator,
        action="Case Created",
        detail=f"Case {case.case_id} opened for {case.target_handle} on {case.platform}"
    )
    return case

@app.get("/cases/", response_model=List[Case])
def list_cases():
    return db_cases

@app.post("/collect/", response_model=Evidence)
async def collect_evidence_from_url(req: CollectRequest):
    case = next((c for c in db_cases if c.case_id == req.case_id), None)
    if not case:
        raise HTTPException(status_code=404, detail="Case ID not found.")
    
    capture_data = await capture_target_evidence(case_id=req.case_id, target_url=req.target_url)
    
    ev_id = f"EV-{len(db_evidence) + 1:04d}"
    evidence = Evidence(
        evidence_id=ev_id,
        case_id=req.case_id,
        evidence_type=req.evidence_type,
        content=capture_data["content_preview"] or f"Snapshot from {req.target_url}",
        original_time=capture_data["captured_at"],
        hash=capture_data["screenshot_sha256"],
        file_path=capture_data["screenshot_path"],
        flagged=False
    )
    db_evidence.append(evidence)
    
    add_custody_log(
        actor=case.investigator,
        action="Evidence Captured",
        detail=f"Captured {ev_id} from {req.target_url} — SHA256: {evidence.hash[:16]}..."
    )
    return evidence

@app.get("/evidence/{case_id}", response_model=List[Evidence])
def get_case_evidence(case_id: str):
    return [e for e in db_evidence if e.case_id == case_id]

@app.get("/custody/", response_model=List[CustodyLog])
def get_chain_of_custody():
    return db_custody

@app.post("/verify/evidence/{case_id}")
def verify_case_evidence_integrity(case_id: str):
    case_evidence = [e for e in db_evidence if e.case_id == case_id]
    if not case_evidence:
        raise HTTPException(status_code=404, detail="No evidence found for this case ID.")
    
    results = []
    tampered_count = 0
    
    for ev in case_evidence:
        is_valid = False
        recalculated_hash = None
        
        if ev.file_path and os.path.exists(ev.file_path):
            with open(ev.file_path, "rb") as f:
                recalculated_hash = hash_bytes(f.read())
            is_valid = (recalculated_hash == ev.hash)
        
        if not is_valid:
            tampered_count += 1
            
        results.append({
            "evidence_id": ev.evidence_id,
            "recorded_hash": ev.hash,
            "recalculated_hash": recalculated_hash,
            "integrity_intact": is_valid
        })
    
    add_custody_log(
        actor="System Auditor",
        action="Integrity Audit",
        detail=f"Audit for {case_id}: {len(results) - tampered_count}/{len(results)} intact."
    )
    
    return {
        "case_id": case_id,
        "total_items_audited": len(results),
        "tampered_items": tampered_count,
        "status": "SECURE" if tampered_count == 0 else "COMPROMISED",
        "evidence_audit_details": results
    }

@app.get("/report/{case_id}")
def export_case_report(case_id: str):
    case = next((c for c in db_cases if c.case_id == case_id), None)
    if not case:
        raise HTTPException(status_code=404, detail="Case ID not found.")
    
    evidence_items = [e.dict() for e in db_evidence if e.case_id == case_id]
    custody_entries = [c.dict() for c in db_custody]
    
    pdf_path = generate_forensic_pdf(
        case_data=case.dict(),
        evidence_list=evidence_items,
        custody_logs=custody_entries
    )
    
    return FileResponse(
        path=pdf_path,
        filename=os.path.basename(pdf_path),
        media_type='application/pdf'
    )