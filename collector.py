import asyncio
import hashlib
import os
from datetime import datetime, timezone
from playwright.async_api import async_playwright

EVIDENCE_DIR = "./evidence_store"
os.makedirs(EVIDENCE_DIR, exist_ok=True)

def hash_bytes(data: bytes) -> str:
    """Compute SHA-256 directly on raw binary data."""
    return hashlib.sha256(data).hexdigest()

def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()

async def capture_target_evidence(case_id: str, target_url: str, selector: str = "body"):
    timestamp = now_iso()
    clean_ts = timestamp.replace(":", "-").replace(".", "-")
    
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            viewport={"width": 1280, "height": 800},
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        await page.goto(target_url, wait_until="networkidle")
        
        target_element = page.locator(selector)
        text_content = await target_element.inner_text() if await target_element.count() > 0 else ""
        
        screenshot_bytes = await page.screenshot(full_page=True)
        await browser.close()
        
    screenshot_hash = hash_bytes(screenshot_bytes)
    content_hash = hash_bytes(text_content.encode("utf-8"))
    
    file_path = os.path.join(EVIDENCE_DIR, f"{case_id}_{clean_ts}.png")
    with open(file_path, "wb") as f:
        f.write(screenshot_bytes)
        
    return {
        "case_id": case_id,
        "source_url": target_url,
        "captured_at": timestamp,
        "content_preview": text_content[:250],
        "content_hash": content_hash,
        "screenshot_path": file_path,
        "screenshot_sha256": screenshot_hash
    }

if __name__ == "__main__":
    result = asyncio.run(capture_target_evidence("PRM-2026-001", "https://example.com"))
    print("Evidence Captured Successfully:")
    for k, v in result.items():
        print(f"  {k}: {v}")
