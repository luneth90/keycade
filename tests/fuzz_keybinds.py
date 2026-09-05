"""Atheris fuzz harness for Keycade input and keybinding parsers.

This harness verifies robustness against unexpected, malformed, or hostile
inputs in parser and sanitization routines.
"""

from __future__ import annotations

import sys
from pathlib import Path

try:
    import atheris
except ImportError:
    atheris = None


def test_one_input(data: bytes) -> None:
    """Fuzz parser routines with raw byte streams."""
    if not data:
        return

    try:
        raw_str = data.decode("utf-8", errors="replace")
    except Exception:
        return

    try:
        from importlib.machinery import SourceFileLoader

        keybinds_mod = SourceFileLoader(
            "keybinds_json",
            str(Path(__file__).resolve().parent.parent / "bin" / "keybinds-json"),
        ).load_module()

        blocks = keybinds_mod.split_blocks(raw_str)
        for block in blocks[:20]:
            for k, v in block.items():
                keybinds_mod.sanitize_text(v, 512)
    except (ValueError, TypeError, KeyError):
        pass


if __name__ == "__main__" and atheris is not None:
    atheris.instrument_all()
    atheris.Setup(sys.argv, test_one_input)
    atheris.Fuzz()
