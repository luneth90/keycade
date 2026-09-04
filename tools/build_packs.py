#!/usr/bin/env python3
"""Compile assets/packs/*.json into lib/Packs.js, and collect the sources.

A pack is the key table of an application-level training ground - LazyVim
today. It is static data that ships with the plugin: the runtime never reads a
file, never runs a subprocess, never touches the user's configuration and never
reaches the network. That is the whole reason a pack exists rather than a
reader for the application's own config.

This tool is a development-time tool. It is not listed in manifest.json and it
never runs on a user's machine.

Two jobs:

  python3 tools/build_packs.py
      Compile assets/packs/*.json into lib/Packs.js. tests/test_assets.py
      fails if the generated file drifts from the JSON sources.

  python3 tools/build_packs.py --collect lazyvim \\
      --site ../LazyVim.github.io --lazyvim ../LazyVim
      Regenerate assets/packs/lazyvim.json from two local checkouts. This is
      the maintainer's step, on the maintainer's machine; the product is
      committed, and its git diff is the review material when upstream moves.
      No network access happens here either: clone the two repositories
      yourself and pass their paths.

Where the LazyVim table comes from, and why:

  The authority is the generated keymaps page in LazyVim.github.io
  (docs/keymaps.md, between the keymaps:start/end markers). It is produced by
  that repository's own lua/build.lua, which loads LazyVim and records every
  mapping it registers - including the ones built at runtime by the picker
  helpers, which no static reading of the Lua sources can see. Reading the
  LazyVim repository directly finds about three quarters of them.

  The LazyVim repository at a pinned tag is the cross-check, not the source.
  --collect parses it too and reports every key one side has and the other
  does not; that difference is written into the pack's provenance, so a
  reviewer sees it rather than having to go looking.

  Sections carrying a "Part of [...]" line are extras: opt-in plugins a user
  must enable. They are not defaults and are never collected.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import subprocess
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PACKS = ROOT / "assets" / "packs"
TARGET = ROOT / "lib" / "Packs.js"

GENERATOR_VERSION = "1"

# Mirrors lib/TextKey.js. Both are held to tests/fixtures/text-keys.js.
CTRL = 4
ALT = 8
SUPER = 64

NAMED_KEYS = {
    "BS": "BS",
    "TAB": "TAB",
    "CR": "CR",
    "RETURN": "CR",
    "ENTER": "CR",
    "ESC": "ESC",
    "SPACE": "SPACE",
    "DEL": "DEL",
    "UP": "UP",
    "DOWN": "DOWN",
    "LEFT": "LEFT",
    "RIGHT": "RIGHT",
    "HOME": "HOME",
    "END": "END",
    "PAGEUP": "PAGEUP",
    "PAGEDOWN": "PAGEDOWN",
    "INSERT": "INSERT",
}

# Characters `:help key-notation` spells out because the notation would
# otherwise swallow them.
NAMED_CHARACTERS = {"LT": "<", "BSLASH": "\\", "BAR": "|"}

MODIFIERS = {"C": CTRL, "A": ALT, "M": ALT, "S": "shift", "D": "command"}

# <leader> and <localleader> are settings, not keys. A pack stores a
# placeholder and the runtime resolves it, so someone who moved their leader
# still trains the mapping rather than a key they never press. These two
# private-use characters stand in while the notation is being tokenised; they
# never appear in a pack or on a card.
LEADER_MARK = "\ue000"
LOCALLEADER_MARK = "\ue001"


class Rejected(Exception):
    """The notation names something no pack entry may carry."""


def parse_step(token: str) -> dict:
    """One <...> group, or one bare character, as a TextKey step."""
    if token == LEADER_MARK:
        return {"leader": True}
    if token == LOCALLEADER_MARK:
        return {"localleader": True}
    if not token.startswith("<"):
        if len(token) != 1 or ord(token) < 0x20 or ord(token) == 0x7F:
            raise Rejected(f"unreadable character {token!r}")
        # Space is a named key on the consuming side: with a modifier held the
        # character never arrives. Both sides have to write it the same way.
        if token == " ":
            return {"mods": 0, "named": "SPACE"}
        return {"mods": 0, "text": token}

    if not token.endswith(">") or len(token) < 3:
        raise Rejected(f"unterminated notation {token!r}")
    body = token[1:-1]

    mods = 0
    shifted = False
    while len(body) > 2 and body[1] == "-" and body[0].upper() in MODIFIERS:
        value = MODIFIERS[body[0].upper()]
        if value == "command":
            raise Rejected("Command is not a key any Linux keyboard has")
        if value == "shift":
            # Shift is folded into the character it shifts, everywhere else in
            # this model. It cannot be folded into a modifier combination, and
            # keeping it would make <C-S-w> and <C-w> judge the same.
            if shifted or mods:
                raise Rejected("Shift beside another modifier is ambiguous")
            shifted = True
        else:
            if shifted:
                raise Rejected("Shift beside another modifier is ambiguous")
            mods |= value
        body = body[2:]

    if not body:
        raise Rejected("notation names no key")

    upper = body.upper()
    if upper in NAMED_CHARACTERS:
        if shifted:
            raise Rejected("Shift on a spelled-out character is ambiguous")
        return {"mods": mods, "text": NAMED_CHARACTERS[upper]}
    if upper in NAMED_KEYS:
        if shifted:
            # Qt reports Backtab and Tab as one key, so <S-Tab> and <Tab>
            # would judge the same. Refuse rather than teach a key press the
            # trainer cannot tell apart.
            raise Rejected("Shift on a named key is ambiguous")
        return {"mods": mods, "named": NAMED_KEYS[upper]}
    if len(body) == 1:
        if shifted:
            if body.upper() == body.lower():
                raise Rejected("Shift on a character that does not shift")
            return {"mods": 0, "text": body.upper()}
        # With a modifier held Vim reads <C-w> and <C-W> as one mapping.
        return {"mods": mods, "text": body.lower() if mods else body}
    raise Rejected(f"unknown key name {body!r}")


def parse_notation(lhs: str) -> list[dict]:
    """A Neovim key notation string as the steps that answer it.

    <leader> and <localleader> arrive already replaced by their marks; they
    become placeholder steps the runtime resolves against its own settings.
    """
    steps: list[dict] = []
    index = 0
    while index < len(lhs):
        if lhs[index] == "<":
            end = lhs.find(">", index)
            if end == -1:
                raise Rejected(f"unterminated notation in {lhs!r}")
            steps.append(parse_step(lhs[index : end + 1]))
            index = end + 1
        else:
            steps.append(parse_step(lhs[index]))
            index += 1
    if not steps:
        raise Rejected("empty notation")
    return steps


# --- LazyVim collection -----------------------------------------------------

# Modes a card can pose. Terminal, command-line and select mode mappings are
# not dealt: they are reached from a state the trainer cannot put on a card.
TRAINED_MODES = {"n": "normal", "x": "visual", "v": "visual", "o": "operator", "i": "insert"}

# What LazyVim only re-implements. A trainer that deals `j` has stopped being
# about LazyVim; the ruler for a pack entry is "could not recall it without
# the documentation", not "upstream defined it".
WELL_KNOWN = {"j", "k", "n", "N", "<Down>", "<Up>", "<esc>", "<Esc>", "gg", "G", "dd", "yy", "p", "P", "y"}

# Descriptions upstream writes for which-key rather than for a reader: a "+"
# prefix marks a group of further keys, and which_key_ignore hides an alias.
SENTINEL_DESCRIPTIONS = re.compile(r"^\+|^which_key_ignore$")

# A compact keyboard is not guaranteed to carry these - the same rule the
# Hyprland ground applies, for the same reason.
DEVICE_SPECIAL = {"HOME", "END", "PAGEUP", "PAGEDOWN", "INSERT", "DEL"}

# LazyVim's own which-key groups, which are how a user already thinks about
# these. The first match wins, so the longer prefixes come first.
CATEGORY_PREFIXES = [
    ("<leader><tab>", "tab"),
    ("<leader>gh", "git"),
    ("<leader>a", "ai"),
    ("<leader>b", "buffer"),
    ("<leader>c", "code"),
    ("<leader>d", "debug"),
    ("<leader>f", "find"),
    ("<leader>g", "git"),
    ("<leader>q", "session"),
    ("<leader>s", "search"),
    ("<leader>t", "test"),
    ("<leader>u", "ui"),
    ("<leader>w", "window"),
    ("<leader>x", "diagnostics"),
]

CATEGORIES = [
    "find", "search", "git", "buffer", "tab", "code", "lsp", "debug", "test",
    "diagnostics", "window", "session", "ui", "terminal", "edit", "navigation", "misc",
]

# The prefix says what a key belongs to for most of the table; for the rest,
# what it does says it. Same shape as the Hyprland ground's categoriser, and
# for the same reason: a category nobody recognises is worse than none.
DESCRIPTION_CATEGORIES = [
    (r"terminal", "terminal"),
    (r"\btab\b", "tab"),
    (r"window|split", "window"),
    (r"buffer", "buffer"),
    (r"explorer|find files|file", "find"),
    (r"grep|search|history|symbols|picker", "search"),
    (r"scroll|flash|jump|goto|next|prev|forward|backward", "navigation"),
    (r"comment|indent|move|yank|put|selection|increment|decrement|surround", "edit"),
    (r"notification|scratch|zen|toggle|dim|zoom", "ui"),
    (r"diagnostic|quickfix|loclist|location list", "diagnostics"),
    (r"lazygit|\bgit\b|blame|commit", "git"),
    (r"session|quit|restore", "session"),
]


def category_for(lhs: str, section: str) -> str:
    for prefix, name in CATEGORY_PREFIXES:
        if lhs.startswith(prefix):
            return name
    if section == "LSP" or lhs in {"K", "gd", "gr", "gI", "gy", "gD", "gK"}:
        return "lsp"
    if lhs.startswith("<C-") and lhs[3:4] in "hjkl" or lhs.startswith("<C-Up") \
            or lhs.startswith("<C-Down") or lhs.startswith("<C-Left") or lhs.startswith("<C-Right"):
        return "window"
    if lhs.startswith("[") or lhs.startswith("]"):
        return "navigation"
    if lhs.startswith("<S-") or lhs.startswith("<A-") or lhs.startswith("g"):
        return "edit"
    return "misc"


def category_from_description(desc: str) -> str:
    lowered = desc.lower()
    for pattern, name in DESCRIPTION_CATEGORIES:
        if re.search(pattern, lowered):
            return name
    return "misc"


def read_doc_table(site: Path) -> list[dict]:
    """The generated keymaps page, minus every extras section."""
    text = (site / "docs" / "keymaps.md").read_text(encoding="utf-8")
    start = text.index("<!-- keymaps:start -->")
    block = text[start : text.index("<!-- keymaps:end -->")]
    rows: list[dict] = []
    section, extras = "", False
    for line in block.splitlines():
        if line.startswith("## "):
            section, extras = line[3:].strip(), False
            continue
        if line.startswith("Part of ["):
            extras = True
            continue
        match = re.match(r"^\| <code>(.*?)</code> \| (.*?) \| (.*?) \|$", line)
        if not match or extras:
            continue
        rows.append({
            "lhs": html.unescape(match.group(1)).replace("&vert;", "|"),
            "desc": match.group(2).strip(),
            "modes": re.findall(r"\*\*([a-z])\*\*", match.group(3)),
            "section": re.sub(r"\[(.*?)\]\(.*?\)", r"\1", section),
        })
    return rows


def read_repo_keys(lazyvim: Path) -> set[str]:
    """Every lhs the pinned LazyVim checkout names outside extras.

    This is the cross-check, not the source: reading the Lua statically cannot
    see the mappings the picker helpers build at runtime. Its only job is to
    report what the two sides disagree about.
    """
    keys: set[str] = set()
    keymaps = (lazyvim / "lua/lazyvim/config/keymaps.lua").read_text(encoding="utf-8")
    for match in re.finditer(r"^\s*map\(\s*(\{[^}]*\}|\"[^\"]*\"|'[^']*')\s*,\s*(\"|')(.*?)\2",
                             keymaps, re.MULTILINE):
        keys.add(match.group(3))
    for path in sorted((lazyvim / "lua/lazyvim").rglob("*.lua")):
        if "/extras/" in str(path):
            continue
        text = path.read_text(encoding="utf-8")
        for match in re.finditer(r"\{\s*(\"|')(.*?)\1\s*,", text):
            candidate = match.group(2)
            if candidate.startswith("<leader>") or candidate.startswith("<localleader>") \
                    or re.match(r"^[\[\]g]", candidate) or candidate.startswith("<"):
                keys.add(candidate)
    return keys


def release_tag(path: Path) -> str:
    """The version tag on HEAD. `stable` moves; a v-tag is what to record."""
    tags = subprocess.run(["git", "-C", str(path), "tag", "--points-at", "HEAD"],
                          capture_output=True, text=True).stdout.split()
    versions = sorted(tag for tag in tags if re.fullmatch(r"v\d+\.\d+\.\d+", tag))
    return versions[-1] if versions else (tags[0] if tags else "")


def git_head(path: Path) -> dict:
    def run(*args: str) -> str:
        return subprocess.run(["git", "-C", str(path), *args], check=True,
                              capture_output=True, text=True).stdout.strip()
    return {"commit": run("rev-parse", "HEAD"), "date": run("log", "-1", "--format=%cs")}


def collect_lazyvim(site: Path, lazyvim: Path, leader: str, localleader: str) -> dict:
    rows = read_doc_table(site)
    repo_keys = read_repo_keys(lazyvim)

    bindings: list[dict] = []
    dropped: dict[str, int] = {}
    seen: set[str] = set()

    def drop(reason: str) -> None:
        dropped[reason] = dropped.get(reason, 0) + 1

    for row in rows:
        lhs = row["lhs"]
        if lhs in WELL_KNOWN:
            drop("well-known")
            continue
        modes = [m for m in row["modes"] if m in TRAINED_MODES]
        if not modes:
            drop("untrained-mode")
            continue
        resolved = lhs.replace("<leader>", LEADER_MARK).replace("<localleader>", LOCALLEADER_MARK)
        try:
            steps = parse_notation(resolved)
        except Rejected:
            drop("unreadable-notation")
            continue
        if len(steps) > 8:
            drop("too-many-steps")
            continue
        if any(step.get("named") == "ESC" for step in steps):  # noqa: E501 - see escape-in-answer
            drop("escape-in-answer")
            continue
        if any(step.get("named") in DEVICE_SPECIAL for step in steps):
            drop("device-special-key")
            continue
        if not row["desc"] or SENTINEL_DESCRIPTIONS.search(row["desc"]):
            drop("missing-description")
            continue
        category = category_for(lhs, row["section"])
        if category == "misc":
            category = category_from_description(row["desc"])
        context = TRAINED_MODES[modes[0]]
        local_id = context + "/" + lhs
        if local_id in seen:
            drop("duplicate")
            continue
        seen.add(local_id)
        bindings.append({
            "localId": local_id,
            "context": context,
            "notation": lhs,
            "steps": steps,
            "category": category,
            "desc": row["desc"],
        })

    doc_keys = {row["lhs"] for row in rows}
    return {
        "schemaVersion": 1,
        "profile": "lazyvim",
        "judgeMode": "text",
        "provenance": {
            "upstream": "LazyVim",
            "authority": "LazyVim.github.io docs/keymaps.md (generated by its lua/build.lua)",
            "site": {"url": "https://github.com/LazyVim/LazyVim.github.io", **git_head(site),
                     "checksum": hashlib.sha256(
                         (site / "docs" / "keymaps.md").read_bytes()).hexdigest()},
            "crossCheck": {
                "url": "https://github.com/LazyVim/LazyVim",
                **git_head(lazyvim),
                "tag": release_tag(lazyvim),
                # Recorded rather than resolved: the page is regenerated on the
                # upstream's own schedule, so the two can be days apart. A
                # reviewer sees exactly which keys that costs.
                # A which-key group label is a key prefix with a name, not a
                # mapping, so it is not drift; the leader plus one character is
                # always one of those.
                "inCheckoutOnly": sorted(
                    k for k in repo_keys - doc_keys
                    if not re.fullmatch(r"<leader>(<\w+>|.)", k)
                    and (k.startswith("<leader>") or k.startswith("<C-"))),
                "inPageOnly": len(doc_keys - repo_keys),
            },
            "generatedAt": date.today().isoformat(),
            "generator": f"tools/build_packs.py@{GENERATOR_VERSION}",
        },
        "leader": leader,
        "localleader": localleader,
        "dropped": dict(sorted(dropped.items())),
        "bindings": bindings,
    }


# --- compilation ------------------------------------------------------------

HEADER = """.pragma library

// Generated from assets/packs/*.json by tools/build_packs.py.
// Do not edit by hand; edit the JSON sources and regenerate.
//
// Packs are static data compiled into a QML JavaScript library rather than
// read from disk: an application-level training ground touches nothing on the
// machine it runs on.

var packs = """

FOOTER = """
function ids() {
  return %s
}

function pack(id) {
  return Object.prototype.hasOwnProperty.call(packs, id) ? packs[id] : null
}
"""


def sources() -> dict:
    return {path.stem: json.loads(path.read_text(encoding="utf-8"))
            for path in sorted(PACKS.glob("*.json"))}


def render() -> str:
    loaded = sources()
    body = json.dumps(loaded, ensure_ascii=False, indent=2, sort_keys=True)
    return HEADER + body + "\n" + FOOTER % json.dumps(sorted(loaded))


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--collect", choices=["lazyvim"],
                        help="regenerate a pack from local upstream checkouts")
    parser.add_argument("--site", type=Path, help="path to a LazyVim.github.io checkout")
    parser.add_argument("--lazyvim", type=Path, help="path to a LazyVim checkout at a tag")
    parser.add_argument("--leader", default=" ")
    parser.add_argument("--localleader", default="\\")
    args = parser.parse_args()

    if args.collect:
        if not args.site or not args.lazyvim:
            parser.error("--collect needs --site and --lazyvim")
        pack = collect_lazyvim(args.site, args.lazyvim, args.leader, args.localleader)
        path = PACKS / f"{args.collect}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(pack, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"wrote {path.relative_to(ROOT)}: {len(pack['bindings'])} bindings, "
              f"dropped {pack['dropped']}")

    TARGET.write_text(render(), encoding="utf-8")
    print(f"wrote {TARGET.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
