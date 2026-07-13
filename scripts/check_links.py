"""Check every external URL referenced in README.md and write docs/LINK-HEALTH.md.

Usage:  python scripts/check_links.py
Exit code is always 0 — CI decides what to do by grepping the report for FAIL.
Each URL gets two attempts (some badge services are slow or briefly flaky).
"""

import re
import time
import urllib.request
from datetime import date, timezone, datetime

from _common import ROOT, UA

README = ROOT / "README.md"
REPORT = ROOT / "docs" / "LINK-HEALTH.md"


def extract_urls() -> list[str]:
    text = README.read_text(encoding="utf-8")
    urls = re.findall(r'(?:src|href)="(https?://[^"]+)"', text)
    urls += re.findall(r"\]\((https?://[^)\s]+)\)", text)
    seen, out = set(), []
    for u in urls:
        # github.com HTML pages rate-limit bots (false positives) and are
        # first-party links that can't rot — raw.githubusercontent IS checked
        if u.startswith("https://github.com/"):
            continue
        if u not in seen:
            seen.add(u)
            out.append(u)
    return out


def check(url: str, timeout: int = 45) -> tuple[bool, str, float]:
    start = time.time()
    try:
        req = urllib.request.Request(url, headers={"User-Agent": UA})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            return 200 <= resp.status < 400, str(resp.status), time.time() - start
    except Exception as exc:  # noqa: BLE001 — any failure is a broken link
        return False, type(exc).__name__, time.time() - start


def main() -> None:
    rows, failures = [], 0
    for url in extract_urls():
        ok, status, elapsed = check(url)
        if not ok:  # one retry — badge hosts are often briefly flaky
            time.sleep(2)
            ok, status, elapsed = check(url)
        if not ok:
            failures += 1
        icon = "✅" if ok else "❌ FAIL"
        rows.append(f"| {icon} | `{status}` | {elapsed:.1f}s | {url} |")
        print(f"{'OK  ' if ok else 'FAIL'} {status} {url}")

    now = datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M UTC")
    summary = (f"**{failures} broken** out of {len(rows)} URLs"
               if failures else f"All {len(rows)} URLs healthy")
    REPORT.write_text(
        "# Link Health\n\n"
        "External URLs referenced by the README, checked daily by the\n"
        "[Docs Automation workflow](../.github/workflows/docs-automation.yml).\n\n"
        f"**Last check:** {now} — {summary}\n\n"
        "| Status | Code | Time | URL |\n|:------:|:----:|:----:|:----|\n"
        + "\n".join(rows) + "\n",
        encoding="utf-8",
    )
    print(f"wrote docs/LINK-HEALTH.md — {summary}")


if __name__ == "__main__":
    main()
