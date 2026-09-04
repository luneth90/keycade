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
packs = {name: json.loads((root / "assets/packs" / f"{name}.json").read_text("utf-8"))
         for name in ("lazyvim", "tmux")}
# No extras are enabled in this run's home, so only the core is dealt.
lazyvim = sum(1 for entry in packs["lazyvim"]["bindings"] if not entry["extras"])
herdr = json.loads(subprocess.run([str(root / "bin/herdr-keys-json")],
                                  capture_output=True, text=True).stdout)
print(lazyvim, len(packs["tmux"]["bindings"]), len(herdr.get("bindings", [])))
PY
)
read -r expect_lazyvim expect_tmux expect_herdr <<<"$counts"
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
    "lazyvim": $expect_lazyvim, "tmux": $expect_tmux, "herdr": $expect_herdr
  })
  // Picked faster than any of them can load, which is the whole point.
  readonly property var rush: ["lazyvim", "tmux", "herdr", "lazyvim", "herdr", "tmux", "lazyvim"]
  readonly property var settled: ["tmux", "herdr", "lazyvim"]
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
    interval: 45000; running: true; repeat: false
    onTriggered: { console.error("GROUND_SWITCH_FAILED: timeout"); Qt.quit() }
  }
}
EOF

output=$(
  XDG_STATE_HOME="$test_root/state" \
  QT_QPA_PLATFORMTHEME= \
  QT_STYLE_OVERRIDE=Fusion \
  timeout 60s quickshell --no-color --path "$test_root/config/shell.qml" 2>&1
)

if ! grep -Fq -- "GROUND_SWITCH_OK" <<<"$output"; then
  grep -E "GROUND_SWITCH" <<<"$output" >&2 || printf '%s\n' "$output" >&2
  exit 1
fi

printf 'ground-switching QML integration test passed\n'
