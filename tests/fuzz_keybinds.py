"""Atheris fuzz harness for Keycade input and keybinding parsers.

This harness verifies robustness against unexpected, malformed, or hostile
inputs in parser and sanitization routines.
"""

from __future__ import annotations

import sys
from importlib.machinery import SourceFileLoader
from pathlib import Path

try:
    import atheris
except ImportError:
    atheris = None


ROOT = Path(__file__).resolve().parent.parent


def load_helper(name: str, filename: str):
    """Load one extensionless helper without running its CLI entry point."""
    return SourceFileLoader(name, str(ROOT / "bin" / filename)).load_module()


KEYBINDS = load_helper("fuzz_keybinds_json", "keybinds-json")
APP_CONFIG = load_helper("fuzz_app_config_json", "app-config-json")
TMUX_KEYS = load_helper("fuzz_tmux_keys_json", "tmux-keys-json")
HERDR_KEYS = load_helper("fuzz_herdr_keys_json", "herdr-keys-json")


def test_one_input(data: bytes) -> None:
    """Fuzz parser routines with raw byte streams."""
    if not data:
        return

    try:
        raw_str = data.decode("utf-8", errors="replace")
    except Exception:
        return

    try:
        blocks = KEYBINDS.split_blocks(raw_str)
        for block in blocks[:20]:
            for _key, value in block.items():
                KEYBINDS.sanitize_text(value, 512)
    except (ValueError, TypeError, KeyError):
        pass

    # These are the four externally defined text grammars. Keep the calls
    # bounded so the fuzzer tests parser behavior rather than memory pressure.
    sample = raw_str[:65536]
    APP_CONFIG.without_lua_comments(sample)
    APP_CONFIG.split_lua_args(sample[:4096])
    APP_CONFIG.tmux_logical_lines(sample)
    APP_CONFIG.tmux_assignment(sample[:4096])

    try:
        TMUX_KEYS.parse_key(sample[:128])
    except TMUX_KEYS.Refused:
        pass
    TMUX_KEYS.collect(sample, {"prefix": "C-b"})

    try:
        HERDR_KEYS.parse_chord(sample[:128])
    except HERDR_KEYS.Rejected:
        pass
    HERDR_KEYS.snapshot(sample)


if __name__ == "__main__":
    if atheris is None:
        raise SystemExit("Atheris is required; install the pinned development dependency")
    atheris.instrument_all()
    atheris.Setup(sys.argv, test_one_input)
    atheris.Fuzz()
