"""Regenerate the file index in docs/README.md (between the DOCS-INDEX markers).

Usage:  python scripts/generate_docs_index.py
Lists every markdown file in docs/ with its H1 title.
"""

import re

from _common import ROOT, replace_between

DOCS = ROOT / "docs"
INDEX = DOCS / "README.md"


def title_of(path) -> str:
    for line in path.read_text(encoding="utf-8").splitlines():
        if line.startswith("# "):
            return line[2:].strip()
    return path.stem


def main() -> None:
    rows = ["| File | Title |", "|:-----|:------|"]
    for path in sorted(DOCS.glob("*.md")):
        if path.name == "README.md":
            continue
        rows.append(f"| [{path.name}]({path.name}) | {title_of(path)} |")
    changed = replace_between(INDEX, "<!-- DOCS-INDEX:START -->",
                              "<!-- DOCS-INDEX:END -->", "\n".join(rows))
    print(f"docs index: {len(rows) - 2} files ({'updated' if changed else 'unchanged'})")


if __name__ == "__main__":
    main()
