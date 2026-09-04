#!/usr/bin/env bash

# Every number Keycade shows belongs to one training ground, and the ones a run
# produces belong to one run inside it. Both kinds are drawn on the home screen
# - the header row and the counters beside the deck are not hidden between runs
# - which is where the defect showed: leaving a tmux run and picking another
# cabinet left tmux's run number, targets, accuracy and "new learned" sitting
# under that cabinet's name until the next run overwrote them.
#
# Nothing offscreen can see this. The tallies live on the overlay root, the
# session and statistics that seed them are read from disk by a real store, and
# the ground is picked through the same asynchronous path the user clicks. So
# this drives the real component against the real compositor.

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
  printf 'run-counters test skipped: no Wayland display\n'
  exit 0
fi

mkdir -p -- "$test_root/config" "$test_root/state"
cp -r -- "$repo_root" "$test_root/config/keycade"
rm -rf -- "$test_root/config/keycade/.git"

# A resumable tmux run, and progress that exists only under tmux: real card and
# binding ids from the shipped table, so neither is discarded as stale.
python3 - "$test_root/config/keycade" "$test_root" <<'PY'
import json, sys
from pathlib import Path
root, out = Path(sys.argv[1]), Path(sys.argv[2])
pack = json.loads((root / "assets/packs/tmux.json").read_text("utf-8"))
ids = ["tmux/" + entry["localId"] for entry in pack["bindings"]]

(out / "session.json").write_text(json.dumps({
    "schemaVersion": 1, "profileId": "tmux", "runId": 3, "offset": 5,
    "cards": [{"bindingId": binding, "tier": "learning", "queue": "weak",
               "remedial": False} for binding in ids[:6]],
    "correct": 5, "attempts": 7, "newLearned": 3, "masteredGained": 2,
    "runReviewTarget": 4, "runNewTarget": 6,
    "pendingReinforcements": ids[:2], "reactions": [900, 1200],
}) + "\n", "utf-8")

# Stats promotes a learning entry that already meets the mastery rule, so the
# two shapes have to differ in the evidence, not only in the state field.
def mastered():
    return {"state": "mastered", "guidedCompleted": True,
            "dueAt": 4102444800000, "dueRun": 0, "intervalStep": 3,
            "firstTryAttempts": 3, "firstTryCorrect": 3,
            "recentFirstTry": [True, True], "reactions": [800],
            "successfulRuns": [1, 2], "lastSuccessfulRun": 2,
            "lastSeenAt": 1, "lapseCount": 0}

def due():
    return {"state": "learning", "guidedCompleted": True, "dueAt": 1, "dueRun": 0,
            "intervalStep": 1, "firstTryAttempts": 2, "firstTryCorrect": 1,
            "recentFirstTry": [False, True], "reactions": [900],
            "successfulRuns": [2], "lastSuccessfulRun": 2,
            "lastSeenAt": 1, "lapseCount": 1}

bindings = {}
for binding in ids[:7]:
    bindings[binding] = mastered()
for binding in ids[7:11]:
    bindings[binding] = due()
(out / "stats.json").write_text(json.dumps({
    "schemaVersion": 4, "bindings": bindings,
    "profiles": {"tmux": {"runs": 2, "totalTrainingMs": 60000,
                          "firstMasteryAt": 0, "firstMasteryCelebrated": False}},
}) + "\n", "utf-8")
PY

for kind in session stats; do
  XDG_STATE_HOME="$test_root/state" "$repo_root/bin/state-store" write "$kind" \
    < "$test_root/$kind.json" > /dev/null
done
# Start somewhere else, so picking tmux is a real switch rather than a no-op.
printf '%s\n' '{"schemaVersion":3,"locale":"en","activeProfile":"hyprland"}' \
  | XDG_STATE_HOME="$test_root/state" "$repo_root/bin/state-store" write settings > /dev/null

cat > "$test_root/config/shell.qml" <<'EOF'
import QtQuick
import Quickshell
import "keycade" as Keycade

ShellRoot {
  Keycade.Keycade { id: overlay }
  property int failures: 0

  function check(label, actual, expected) {
    if (actual !== expected) {
      failures += 1
      console.error("RUN_COUNTERS_WRONG " + label + " was " + actual
                    + " instead of " + expected)
    }
  }

  // tmux is the ground with a saved run and with progress, so the screen shows
  // that run and that progress.
  function checkTmux(round) {
    check(round + " resumeAvailable", overlay.resumeAvailable, true)
    check(round + " runNumber", overlay.runNumber, 3)
    check(round + " progress", overlay.completedCardCount(), 5)
    check(round + " runReviewTarget", overlay.runReviewTarget, 4)
    check(round + " runNewTarget", overlay.runNewTarget, 6)
    check(round + " reinforcements", overlay.pendingReinforcementCount(), 2)
    check(round + " accuracy", overlay.accuracyPercent(), 71)
    check(round + " newLearned", overlay.newLearned, 3)
    check(round + " masteredGained", overlay.masteredGained, 2)
    check(round + " mastered", overlay.progressCounts.mastered, 7)
    check(round + " due", overlay.progressCounts.due, 4)
    check(round + " total", overlay.progressCounts.total, 86)
  }

  Timer {
    interval: 2500; running: true; repeat: false
    onTriggered: { overlay.selectProfile("tmux"); onTmux.start() }
  }
  Timer {
    id: onTmux; interval: 4000; repeat: false
    onTriggered: {
      checkTmux("tmux")
      // What a run that was just played leaves behind on the root. Written
      // here rather than played out, so the switch below is tested against
      // numbers that certainly exist rather than ones that happen to be zero.
      overlay.newLearned = 9
      overlay.masteredGained = 8
      overlay.correct = 20
      overlay.attempts = 24
      overlay.runNumber = 7
      overlay.runReviewTarget = 11
      overlay.runNewTarget = 13
      overlay.runOffset = 17
      overlay.selectProfile("vim")
      onVim.start()
    }
  }
  // VIM has neither a saved run nor a single answered card. Not one of tmux's
  // numbers may survive the switch, and the header has to read as the run that
  // pressing START would begin - VIM's first, not tmux's fourth.
  Timer {
    id: onVim; interval: 4000; repeat: false
    onTriggered: {
      check("vim resumeAvailable", overlay.resumeAvailable, false)
      check("vim runNumber", overlay.runNumber, 1)
      check("vim progress", overlay.completedCardCount(), 0)
      check("vim runReviewTarget", overlay.runReviewTarget, 0)
      check("vim runNewTarget", overlay.runNewTarget, 0)
      check("vim reinforcements", overlay.pendingReinforcementCount(), 0)
      check("vim accuracy", overlay.accuracyPercent(), 0)
      check("vim newLearned", overlay.newLearned, 0)
      check("vim masteredGained", overlay.masteredGained, 0)
      check("vim mastered", overlay.progressCounts.mastered, 0)
      check("vim due", overlay.progressCounts.due, 0)
      check("vim total", overlay.progressCounts.total, 109)
      overlay.selectProfile("tmux")
      backAgain.start()
    }
  }
  // And picking tmux again gets all of them back: they were never this
  // overlay's to forget - they are on disk, under that ground's name.
  Timer {
    id: backAgain; interval: 4000; repeat: false
    onTriggered: {
      checkTmux("tmux again")
      console.log(failures ? "RUN_COUNTERS_FAILED" : "RUN_COUNTERS_OK")
      Qt.quit()
    }
  }
  Timer {
    interval: 45000; running: true; repeat: false
    onTriggered: { console.error("RUN_COUNTERS_FAILED: timeout"); Qt.quit() }
  }
}
EOF

output=$(
  XDG_STATE_HOME="$test_root/state" \
  QT_QPA_PLATFORMTHEME= \
  QT_STYLE_OVERRIDE=Fusion \
  timeout 60s quickshell --no-color --path "$test_root/config/shell.qml" 2>&1
)

if ! grep -Fq -- "RUN_COUNTERS_OK" <<<"$output"; then
  grep -E "RUN_COUNTERS" <<<"$output" >&2 || printf '%s\n' "$output" >&2
  exit 1
fi

printf 'run-counters QML integration test passed\n'
