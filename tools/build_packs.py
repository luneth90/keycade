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
SHIFT = 1
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
PREFIX_MARK = "\ue002"


class Rejected(Exception):
    """The notation names something no pack entry may carry."""


# A pack ships the upstream's own words. They are English, and the trainer is
# not: the description is the prompt a card asks you to recall the keys for.
# So each entry carries a key derived from that English text, and the language
# packs answer it. Deriving the key from the text rather than from the entry's
# id is deliberate - when upstream rewrites a description the key changes with
# it, and the card falls back to the new English rather than showing a
# translation of the old wording.
def description_key(profile: str, desc: str) -> str:
    """The key a language pack answers, namespaced by ground.

    Not global: the slug drops punctuation, so LazyVim's "Next" and Neovim's
    ":next" collided and one silently overwrote the other's translation. They
    are also different sentences - the same English word does not have to mean
    the same thing in two applications - so the ground belongs in the key.
    """
    slug = re.sub(r"_+", "_", re.sub(r"[^a-z0-9]+", "_", desc.lower())).strip("_")
    if not slug:
        raise Rejected(f"description has no key: {desc!r}")
    return "packdesc_" + profile + "_" + slug


def parse_step(token: str) -> dict:
    """One <...> group, or one bare character, as a TextKey step."""
    if token == LEADER_MARK:
        return {"option": "leader"}
    if token == LOCALLEADER_MARK:
        return {"option": "localleader"}
    if token == PREFIX_MARK:
        return {"option": "prefix"}
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
            # A named key has no character for Shift to fold into, so it is a
            # modifier here. Tab is the exception: Qt reports Backtab and Tab
            # as one key, so <S-Tab> and <Tab> would judge the same.
            if NAMED_KEYS[upper] == "TAB":
                raise Rejected("Shift on Tab cannot be told from Tab")
            mods |= SHIFT
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
    # The opt-in bundles bring their own prefixes, and which-key groups them
    # the same way: capital G is gh.nvim, R is the REST client, r is
    # refactoring, o is the task runner, m is Metals, and localleader is
    # whatever the language extra put there.
    ("<leader>G", "git"),
    ("<leader>R", "http"),
    ("<leader>r", "code"),
    ("<leader>o", "task"),
    ("<leader>m", "code"),
    ("<leader>h", "navigation"),
    ("<localleader>", "code"),
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

# A ground's own category table, declared by its pack. Not a shared list: the
# second ground's categories are panes and layouts, which mean nothing here.
LAZYVIM_CATEGORIES = [
    "find", "search", "git", "buffer", "tab", "code", "lsp", "debug", "test",
    "task", "diagnostics", "window", "session", "ui", "terminal", "ai", "http",
    "edit", "navigation", "misc",
]

# The prefix says what a key belongs to for most of the table; for the rest,
# what it does says it. Same shape as the Hyprland ground's categoriser, and
# for the same reason: a category nobody recognises is worse than none.
DESCRIPTION_CATEGORIES = [
    (r"prompt|sidekick|copilot|avante|\bchat\b|\bai\b", "ai"),
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
    """The generated keymaps page, with each row told where it comes from.

    A section carrying a "Part of [...]" line belongs to an extra: an opt-in
    bundle LazyVim ships but does not enable. Its keys are real on a machine
    that turned it on and absent on one that did not, so they are collected
    with the module name that provides them rather than dropped.
    """
    text = (site / "docs" / "keymaps.md").read_text(encoding="utf-8")
    start = text.index("<!-- keymaps:start -->")
    block = text[start : text.index("<!-- keymaps:end -->")]
    rows: list[dict] = []
    section, extra = "", ""
    for line in block.splitlines():
        if line.startswith("## "):
            section, extra = line[3:].strip(), ""
            continue
        match = re.match(r"^Part of \[(.*?)\]", line)
        if match:
            extra = match.group(1)
            continue
        match = re.match(r"^\| <code>(.*?)</code> \| (.*?) \| (.*?) \|$", line)
        if not match:
            continue
        rows.append({
            "lhs": html.unescape(match.group(1)).replace("&vert;", "|"),
            "desc": match.group(2).strip(),
            "modes": re.findall(r"\*\*([a-z])\*\*", match.group(3)),
            "section": re.sub(r"\[(.*?)\]\(.*?\)", r"\1", section),
            "extra": extra,
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


def collect_lazyvim(site: Path, lazyvim: Path, leader: str, localleader: str,
                    with_extras: bool = False) -> dict:
    rows = read_doc_table(site)
    if not with_extras:
        rows = [row for row in rows if not row["extra"]]
    repo_keys = read_repo_keys(lazyvim)

    bindings: list[dict] = []
    dropped: dict[str, int] = {}
    seen: dict[str, dict] = {}

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
        existing = seen.get(local_id)
        if existing is not None:
            # The same key can be provided by the core and by an extra that
            # replaces it - Telescope's <leader>ff for Snacks', say. It is one
            # key either way, so it stays one entry and one row of progress,
            # and it records every source that would put it on the machine.
            # An entry the core provides is dealt unconditionally, which an
            # empty list of providers is what says.
            if existing["extras"] and row["extra"]:
                if row["extra"] not in existing["extras"]:
                    existing["extras"].append(row["extra"])
            else:
                existing["extras"] = []
            drop("merged-with-an-existing-key")
            continue
        entry = {
            "localId": local_id,
            "context": context,
            "notation": lhs,
            "steps": steps,
            "category": category,
            "descKey": description_key("lazyvim", row["desc"]),
            "desc": row["desc"],
            # Empty means the core provides it, so it is always dealt. Anything
            # here is an opt-in bundle, and the entry is dealt only on a machine
            # whose lazyvim.json turned one of them on.
            "extras": [row["extra"]] if row["extra"] else [],
        }
        seen[local_id] = entry
        bindings.append(entry)

    doc_keys = {row["lhs"] for row in rows}
    return {
        "schemaVersion": 1,
        "profile": "lazyvim",
        "judgeMode": "text",
        # The modes this ground's cards can pose. Declared by the pack and
        # checked against the profile registry, because the second pack turned
        # out not to share the first one's.
        "contexts": sorted({entry["context"] for entry in bindings}),
        "categories": [name for name in LAZYVIM_CATEGORIES
                       if any(entry["category"] == name for entry in bindings)],
        # Every opt-in bundle this table carries keys for. A machine's
        # lazyvim.json names the ones it turned on, and only those are dealt.
        "extras": sorted({name for entry in bindings for name in entry["extras"]}),
        "provenance": {
            "upstream": "LazyVim",
            "authority": "LazyVim.github.io docs/keymaps.md (generated by its lua/build.lua)",
            "source": {"url": "https://github.com/LazyVim/LazyVim.github.io", **git_head(site),
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


# --- tmux collection --------------------------------------------------------

# tmux writes its own notation: C-b, M-Right, S-Up. Different from Vim's, and
# translated here rather than in the runtime - each upstream publishes its
# table its own way, and that is exactly what a collector is for.
TMUX_MODIFIERS = {"C": CTRL, "M": ALT, "S": "shift"}

TMUX_NAMED = {
    "SPACE": "SPACE", "ENTER": "CR", "TAB": "TAB", "ESCAPE": "ESC", "BSPACE": "BS",
    "UP": "UP", "DOWN": "DOWN", "LEFT": "LEFT", "RIGHT": "RIGHT",
    "HOME": "HOME", "END": "END", "PPAGE": "PAGEUP", "NPAGE": "PAGEDOWN",
    "IC": "INSERT", "DC": "DEL",
}

TMUX_CATEGORY_NAMES = ["pane", "window", "session", "layout", "copy", "misc"]

TMUX_CATEGORIES = [
    (r"\bpane\b", "pane"),
    (r"\bwindow\b", "window"),
    (r"\bsession\b|\bclient\b", "session"),
    (r"\blayout\b", "layout"),
    (r"paste|buffer|\bcopy\b", "copy"),
]


def parse_tmux_key(token: str) -> dict:
    """One tmux key name as a step."""
    mods = 0
    shifted = False
    while len(token) > 2 and token[1] == "-" and token[0].upper() in TMUX_MODIFIERS:
        value = TMUX_MODIFIERS[token[0].upper()]
        if value == "shift":
            # The same rule as everywhere else in this model: Shift is folded
            # into the character it shifts, and a named key has none to fold
            # it into.
            shifted = True
        else:
            mods |= value
        token = token[2:]
    if not token:
        raise Rejected("key name is empty")
    upper = token.upper()
    if upper in TMUX_NAMED:
        if shifted:
            # A named key carries Shift as a modifier; only Tab cannot, since
            # Qt reports Backtab and Tab as one key. See lib/TextKey.js.
            if TMUX_NAMED[upper] == "TAB":
                raise Rejected("Shift on Tab cannot be told from Tab")
            mods |= SHIFT
        return {"mods": mods, "named": TMUX_NAMED[upper]}
    if len(token) == 1:
        if shifted:
            raise Rejected("Shift beside a tmux key name is ambiguous")
        return {"mods": mods, "text": token.lower() if mods else token}
    raise Rejected(f"unknown tmux key {token!r}")


def tmux_version(text: str) -> str:
    match = re.search(r"^# tmux (\S+)$", text, re.MULTILINE)
    return match.group(1) if match else ""


def collect_tmux(listing: Path) -> dict:
    """A saved `tmux -f /dev/null list-keys -N -T prefix`.

    Read from a file rather than run from here, for two reasons. This tool
    starts no processes; and `list-keys` without -f starts a server that
    sources the maintainer's own tmux.conf, which would collect their keys
    instead of the defaults every user has. Save the listing yourself:

        printf '# tmux %s\\n' "$(tmux -V | awk '{print $2}')" > tmux-keys.txt
        tmux -L keycade-build -f /dev/null list-keys -N -T prefix >> tmux-keys.txt
        tmux -L keycade-build kill-server
    """
    text = listing.read_text(encoding="utf-8")
    bindings: list[dict] = []
    dropped: dict[str, int] = {}
    seen: set[str] = set()

    def drop(reason: str) -> None:
        dropped[reason] = dropped.get(reason, 0) + 1

    for line in text.splitlines():
        if line.startswith("#") or not line.strip():
            continue
        # The listing is column-aligned, so a long key name leaves a single
        # space before its description rather than a run of them.
        match = re.match(r"^(\S+)\s+(\S+)\s+(.+)$", line)
        if not match:
            drop("unreadable-line")
            continue
        prefix, key, desc = match.group(1), match.group(2), match.group(3).strip()
        try:
            # The listing prints the prefix the server was running with. It is
            # a setting - Omarchy's own tmux.conf moves it to C-Space - so the
            # pack stores a placeholder and the runtime resolves it.
            parse_tmux_key(prefix)
            # "Send the prefix key" is the prefix twice over, so its second key
            # has to follow the setting as well or it teaches the old one.
            second = {"option": "prefix"} if key == prefix else parse_tmux_key(key)
            steps = [{"option": "prefix"}, second]
        except Rejected:
            drop("unreadable-notation")
            continue
        if any(step.get("named") == "ESC" for step in steps):
            drop("escape-in-answer")
            continue
        if any(step.get("named") in DEVICE_SPECIAL for step in steps):
            drop("device-special-key")
            continue
        # Named by the key alone: the prefix is a setting, and an entry keeps
        # its identity - and its progress - when that setting changes.
        local_id = "prefix/" + ("prefix" if key == prefix else key)
        if local_id in seen:
            drop("duplicate")
            continue
        seen.add(local_id)
        lowered = desc.lower()
        category = "misc"
        for pattern, name in TMUX_CATEGORIES:
            if re.search(pattern, lowered):
                category = name
                break
        bindings.append({
            "localId": local_id,
            "context": "prefix",
            "notation": "prefix " + ("prefix" if key == prefix else key),
            "steps": steps,
            "category": category,
            "descKey": description_key("tmux", desc),
            "desc": desc,
            # tmux ships no opt-in bundles; an empty list is what says every
            # entry is dealt unconditionally, in the shape every pack uses.
            "extras": [],
        })

    return {
        "schemaVersion": 1,
        "profile": "tmux",
        "judgeMode": "text",
        "contexts": ["prefix"],
        "extras": [],
        "categories": [name for name in TMUX_CATEGORY_NAMES
                       if any(entry["category"] == name for entry in bindings)],
        "provenance": {
            "upstream": "tmux",
            "authority": "tmux -f /dev/null list-keys -N -T prefix"
                         " (the vendor's own read-only listing, with no configuration sourced)",
            "source": {
                "url": "https://github.com/tmux/tmux",
                # A listing has no commit to name; its version and its checksum
                # are what say which listing this was.
                "commit": "",
                "tag": tmux_version(text),
                "date": date.today().isoformat(),
                "checksum": hashlib.sha256(listing.read_bytes()).hexdigest(),
            },
            "generatedAt": date.today().isoformat(),
            "generator": f"tools/build_packs.py@{GENERATOR_VERSION}",
        },
        "dropped": dict(sorted(dropped.items())),
        "bindings": bindings,
    }


# --- Neovim collection ------------------------------------------------------

# Neovim's own built-in mappings - not vim's grammar, which is a language and
# belongs in a ground of its own. These are fixed mappings the editor ships,
# most of them recent enough that a long-time vim user has never met them:
# grn / gra / grr for LSP, [d / ]d for diagnostics, [n / ]n / an / in for
# syntax nodes.
#
# Collected with `nvim --clean`, which by definition loads no user
# configuration - the same move as tmux's -f /dev/null and herdr's
# --default-config. The version matters: the gr* mappings arrived in 0.11.

NVIM_CATEGORIES = ["lsp", "diagnostics", "node", "navigation", "edit", "window", "misc"]

NVIM_CATEGORY_WORDS = [
    (r"vim\.lsp\.|signature|document_symbol|codelens", "lsp"),
    (r"diagnostic", "diagnostics"),
    (r"\bnode\b|sibling|parent \(outer\)|child \(inner\)", "node"),
    (r"comment", "edit"),
    (r"empty line|\bopens\b|filepath|uri", "edit"),
    (r"window", "window"),
]

# Descriptions Neovim gives as a documentation pointer rather than a sentence.
# The mappings are worth teaching but their prompts would have to be written
# here, which is a different provenance from "the editor said so".
NVIM_HELP_POINTER = re.compile(r"^:help\b")


def nvim_category(desc: str) -> str:
    lowered = desc.lower()
    for pattern, name in NVIM_CATEGORY_WORDS:
        if re.search(pattern, lowered):
            return name
    if lowered.startswith(":") or re.match(r"^[\[\]]", lowered):
        return "navigation"
    return "misc"


NVIM_MODES = {"n": "normal", "x": "visual", "v": "visual", "o": "operator", "i": "insert"}


def collect_neovim(listing: Path) -> dict:
    """A saved `nvim --clean` keymap dump.

    Read from a file rather than run from here, for the same reason the tmux
    collector is: this tool starts no processes. Save it yourself:

        nvim --clean --headless -c 'lua local o={}
          for _,m in ipairs({"n","x","o","i","v"}) do
            for _,k in ipairs(vim.api.nvim_get_keymap(m)) do
              o[#o+1]={mode=m,lhs=k.lhs,desc=k.desc or ""} end end
          io.write(vim.json.encode({version=vim.version().major.."."..
            vim.version().minor.."."..vim.version().patch, maps=o}))' -c 'qa!' > nvim-keys.json
    """
    record = json.loads(listing.read_text(encoding="utf-8"))
    version = str(record.get("version") or "")
    bindings: list[dict] = []
    dropped: dict[str, int] = {}
    seen: set[str] = set()

    def drop(reason: str) -> None:
        dropped[reason] = dropped.get(reason, 0) + 1

    for entry in record.get("maps", []):
        lhs = str(entry.get("lhs") or "")
        desc = str(entry.get("desc") or "").strip()
        mode = str(entry.get("mode") or "")
        if lhs.startswith("<Plug>"):
            drop("plug-target")
            continue
        if not desc:
            drop("missing-description")
            continue
        if NVIM_HELP_POINTER.match(desc):
            # ":help Y-default" is where to read about it, not what it does.
            drop("description-is-a-help-pointer")
            continue
        if mode not in NVIM_MODES:
            drop("untrained-mode")
            continue
        if lhs in WELL_KNOWN:
            drop("well-known")
            continue
        try:
            steps = parse_notation(lhs)
        except Rejected:
            drop("unreadable-notation")
            continue
        if len(steps) > 8:
            drop("too-many-steps")
            continue
        if any(step.get("named") == "ESC" for step in steps):
            drop("escape-in-answer")
            continue
        if any(step.get("named") in DEVICE_SPECIAL for step in steps):
            drop("device-special-key")
            continue
        # The same key is registered once per mode; one card is enough.
        if lhs in seen:
            drop("same-key-in-another-mode")
            continue
        seen.add(lhs)
        context = NVIM_MODES[mode]
        bindings.append({
            "localId": context + "/" + lhs,
            "context": context,
            "notation": lhs,
            "steps": steps,
            "category": nvim_category(desc),
            "descKey": description_key("neovim", desc),
            "desc": desc,
            "extras": [],
        })

    return {
        "schemaVersion": 1,
        "profile": "neovim",
        "judgeMode": "text",
        "contexts": sorted({entry["context"] for entry in bindings}),
        "categories": [name for name in NVIM_CATEGORIES
                       if any(entry["category"] == name for entry in bindings)],
        "extras": [],
        "provenance": {
            "upstream": "Neovim",
            "authority": "nvim --clean (the editor's own defaults, with no user configuration loaded)",
            "source": {
                "url": "https://github.com/neovim/neovim",
                "commit": "",
                "tag": version,
                "date": date.today().isoformat(),
                "checksum": hashlib.sha256(listing.read_bytes()).hexdigest(),
            },
            "generatedAt": date.today().isoformat(),
            "generator": f"tools/build_packs.py@{GENERATOR_VERSION}",
        },
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
    parser.add_argument("--collect", choices=["lazyvim", "tmux", "neovim"],
                        help="regenerate a pack from a local upstream source")
    parser.add_argument("--site", type=Path, help="path to a LazyVim.github.io checkout")
    parser.add_argument("--lazyvim", type=Path, help="path to a LazyVim checkout at a tag")
    parser.add_argument("--listing", type=Path,
                        help="tmux: a saved `tmux -f /dev/null list-keys -N -T prefix`")
    parser.add_argument("--extras", action="store_true",
                        help="lazyvim: collect the opt-in bundles too")
    parser.add_argument("--leader", default=" ")
    parser.add_argument("--localleader", default="\\")
    args = parser.parse_args()

    if args.collect == "neovim":
        if not args.listing:
            parser.error("--collect neovim needs --listing")
        pack = collect_neovim(args.listing)
    elif args.collect == "tmux":
        if not args.listing:
            parser.error("--collect tmux needs --listing")
        pack = collect_tmux(args.listing)
    elif args.collect:
        if not args.site or not args.lazyvim:
            parser.error("--collect lazyvim needs --site and --lazyvim")
        pack = collect_lazyvim(args.site, args.lazyvim, args.leader, args.localleader,
                               args.extras)

    if args.collect:
        path = PACKS / f"{args.collect}.json"
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(json.dumps(pack, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
        print(f"wrote {path.relative_to(ROOT)}: {len(pack['bindings'])} bindings, "
              f"dropped {pack['dropped']}")

    TARGET.write_text(render(), encoding="utf-8")
    print(f"wrote {TARGET.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
