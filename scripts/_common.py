"""Shared helpers for the docs-automation scripts."""

import re
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
UA = ("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
      "(KHTML, like Gecko) Chrome/126.0 Safari/537.36 (profile-repo-bot)")


def fetch(url: str, timeout: int = 40) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return resp.read().decode("utf-8", errors="replace")


def replace_between(path: Path, start: str, end: str, new_body: str) -> bool:
    """Replace the text between two marker comments. Returns True if changed."""
    text = path.read_text(encoding="utf-8")
    pattern = re.compile(re.escape(start) + r".*?" + re.escape(end), re.S)
    if not pattern.search(text):
        raise SystemExit(f"markers {start} / {end} not found in {path}")
    updated = pattern.sub(start + "\n" + new_body.strip("\n") + "\n" + end, text)
    if updated != text:
        path.write_text(updated, encoding="utf-8")
        return True
    return False
