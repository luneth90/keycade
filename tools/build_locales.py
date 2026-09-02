#!/usr/bin/env python3
"""Compile assets/locales/*.json into lib/Locales.js.

The catalogue is static data that ships with the plugin, so it is embedded in
a QML JavaScript library instead of being read from disk at runtime. That
removes the last pathname-following file read from the QML side.

Run after editing any locale file:  python3 tools/build_locales.py
tests/test_assets.py fails if the generated file drifts from the JSON sources.
"""

from __future__ import annotations

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
LOCALES = ROOT / "assets" / "locales"
TARGET = ROOT / "lib" / "Locales.js"
ORDER = ["en", "zh-CN"]

HEADER = """.pragma library

// Generated from assets/locales/*.json by tools/build_locales.py.
// Do not edit by hand; edit the JSON sources and regenerate.

var catalog = """

FOOTER = """
function supported() {
  return %s
}

function messages(locale) {
  return Object.prototype.hasOwnProperty.call(catalog, locale) ? catalog[locale] : catalog["en"]
}
"""


def render() -> str:
    catalog = {name: json.loads((LOCALES / f"{name}.json").read_text(encoding="utf-8")) for name in ORDER}
    body = json.dumps(catalog, ensure_ascii=False, indent=2, sort_keys=True)
    return HEADER + body + "\n" + FOOTER % json.dumps(ORDER)


if __name__ == "__main__":
    TARGET.write_text(render(), encoding="utf-8")
    print(f"wrote {TARGET.relative_to(ROOT)}")
