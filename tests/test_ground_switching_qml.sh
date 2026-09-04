#!/usr/bin/env bash

# Picking a training ground is asynchronous now: a pack ground reads the
# machine's own configuration through a subprocess before its table can be
# built. Switching cabinets faster than that answered counted the ground
# before it - LazyVim showed tmux's total under LazyVim's name - and nothing
# recomputed it afterwards, so the wrong number stayed.
#
# Nothing in the offscreen suite can see that: it is the overlay's own wiring
# between three asynchronous sources. This drives the real component against
# the real compositor, clicks through the cabinets faster than they can load,
# and checks that each one ends up counting itself.

set -euo pipefail

repo_root=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd -P)
test_root=$(mktemp -d)

cleanup() {
  if [[ $test_root == /tmp/* && -d $test_root ]]; then
    rm -rf -- "$test_root"
  fi
}
trap cleanup EXIT

if [[ -z ${WAYLAND_DISPLAY:-} ]]; then
  printf 'ground-switching test skipped: no Wayland display\n'
  exit 0
fi

mkdir -p -- "$test_root/config" "$test_root/state"
cp -r -- "$repo_root" "$test_root/config/keycade"
rm -rf -- "$test_root/config/keycade/.git"

# The counts each ground is expected to reach are read from the shipped tables
# rather than written here, so a table that grows does not fail this.
counts=$(python3 - "$test_root/config/keycade" <<'PY'
import json, subprocess, sys
from pathlib import Path
root = Path(sys.argv[1])
sys.path.insert(0, str(root / "tools"))
import build_packs
packs = {name: json.loads((root / "assets/packs" / f"{name}.json").read_text("utf-8"))
         for name in ("lazyvim", "tmux", "vim", "neovim")}
lazy_config = json.loads(subprocess.run(
    [str(root / "bin/app-config-json"), "--profile", "lazyvim"],
    capture_output=True, text=True).stdout)
# Mirror the source-ordered overlay used by PackSource. This keeps the
# integration check valid on a maintainer machine that has extras or literal
# keymap overrides of its own.
lazy_records = [dict(entry) for entry in packs["lazyvim"]["bindings"]]
lazy_by_id = {entry["localId"]: index for index, entry in enumerate(lazy_records)}
lazy_deleted = set()
for change in lazy_config.get("bindings", []):
    try:
        build_packs.parse_notation(change["lhs"])
    except (KeyError, build_packs.Rejected):
        continue
    for context in change.get("contexts", []):
        local_id = f"{context}/{change['lhs']}"
        position = lazy_by_id.get(local_id)
        if change.get("op") == "del":
            if position is not None:
                lazy_deleted.add(local_id)
            continue
        replacement = {
            "localId": local_id, "context": context, "extras": [],
        }
        if position is None:
            lazy_by_id[local_id] = len(lazy_records)
            lazy_records.append(replacement)
        else:
            lazy_records[position] = {**lazy_records[position], **replacement}
        lazy_deleted.discard(local_id)
enabled_extras = set(lazy_config.get("extras", []))
lazyvim = sum(1 for entry in lazy_records
              if entry["localId"] not in lazy_deleted
              and (not entry.get("extras")
                   or enabled_extras.intersection(entry["extras"])))
herdr = json.loads(subprocess.run([str(root / "bin/herdr-keys-json")],
                                  capture_output=True, text=True).stdout)
tmux_live = json.loads(subprocess.run([str(root / "bin/tmux-keys-json")],
                                     capture_output=True, text=True).stdout)
tmux_count = (len(tmux_live.get("bindings", [])) if tmux_live.get("available")
              else len(packs["tmux"]["bindings"]))
print(lazyvim, tmux_count, len(packs["vim"]["bindings"]),
      len(packs["neovim"]["bindings"]), len(herdr.get("bindings", [])))
PY
)
read -r expect_lazyvim expect_tmux expect_vim expect_neovim expect_herdr <<<"$counts"
if [[ $expect_herdr == 0 ]]; then
  printf 'ground-switching test skipped: herdr keybindings are not readable here\n'
  exit 0
fi

cat > "$test_root/config/shell.qml" <<EOF
import QtQuick
import Quickshell
import "keycade" as Keycade

ShellRoot {
  Keycade.Keycade { id: overlay }
  readonly property var expected: ({
    "lazyvim": $expect_lazyvim, "tmux": $expect_tmux,
    "vim": $expect_vim, "neovim": $expect_neovim, "herdr": $expect_herdr
  })
  // Picked faster than any of them can load, which is the whole point.
  readonly property var rush: ["lazyvim", "vim", "tmux", "neovim", "herdr",
                               "lazyvim", "herdr", "vim", "tmux", "lazyvim"]
  readonly property var settled: ["tmux", "herdr", "vim", "neovim", "lazyvim"]
  property int rushStep: 0
  property int settledStep: 0
  property int failures: 0

  function check(id) {
    var actual = overlay.eligibleBindings.length
    if (actual !== expected[id]) {
      failures += 1
      console.error("GROUND_SWITCH_WRONG " + id + " counted " + actual
                    + " instead of " + expected[id])
    }
  }

  Timer {
    interval: 250; running: true; repeat: true
    onTriggered: {
      if (rushStep >= rush.length) { running = false; afterRush.start(); return }
      overlay.selectProfile(rush[rushStep]); rushStep += 1
    }
  }
  Timer {
    id: afterRush; interval: 3000; repeat: false
    onTriggered: { check(rush[rush.length - 1]); slow.start() }
  }
  // Then one at a time, with room to land, so a ground that only ever counts
  // itself under pressure is not mistaken for one that always does.
  Timer {
    id: slow; interval: 3000; repeat: true
    onTriggered: {
      if (settledStep > 0) check(settled[settledStep - 1])
      if (settledStep >= settled.length) {
        running = false
        console.log(failures ? "GROUND_SWITCH_FAILED" : "GROUND_SWITCH_OK")
        Qt.quit()
        return
      }
      overlay.selectProfile(settled[settledStep]); settledStep += 1
    }
  }
  Timer {
    interval: 55000; running: true; repeat: false
    onTriggered: { console.error("GROUND_SWITCH_FAILED: timeout"); Qt.quit() }
  }
}
EOF

output=$(
  XDG_STATE_HOME="$test_root/state" \
  QT_QPA_PLATFORMTHEME= \
  QT_STYLE_OVERRIDE=Fusion \
  timeout 70s quickshell --no-color --path "$test_root/config/shell.qml" 2>&1
)

if ! grep -Fq -- "GROUND_SWITCH_OK" <<<"$output"; then
  grep -E "GROUND_SWITCH" <<<"$output" >&2 || printf '%s\n' "$output" >&2
  exit 1
fi

printf 'ground-switching QML integration test passed\n'
