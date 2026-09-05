#!/usr/bin/bash

# The first 100% is a terminal result, not something the player has to carry
# through the rest of a 24-card deal. Drive one learning entry over the mastery
# threshold while another card is still in the deck and verify that the real
# overlay immediately ends the run on the final mastery screen.

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
  printf 'mastery-transition test skipped: no Wayland display\n'
  exit 0
fi

mkdir -p -- "$test_root/config" "$test_root/state"
cp -r -- "$repo_root" "$test_root/config/keycade"
rm -rf -- "$test_root/config/keycade/.git"

cat > "$test_root/stats.json" <<'JSON'
{"schemaVersion":4,"bindings":{"neovim/test":{"state":"learning","guidedCompleted":true,"dueAt":0,"dueRun":2,"intervalStep":2,"firstTryAttempts":1,"firstTryCorrect":1,"recentFirstTry":[true],"reactions":[900],"successfulRuns":[1],"lastSuccessfulRun":1,"lastSeenAt":1,"lapseCount":0}},"profiles":{"neovim":{"runs":1,"coverageCursor":0,"totalTrainingMs":1000,"firstMasteryAt":0,"firstMasteryRun":0,"firstMasteryCelebrated":false,"knownTotal":1,"knownMastered":0}}}
JSON
cat > "$test_root/settings.json" <<'JSON'
{"schemaVersion":3,"locale":"en","activeProfile":"neovim"}
JSON
cat > "$test_root/session.json" <<'JSON'
{"schemaVersion":1,"profileId":"neovim","runId":2,"offset":0,"cards":[{"bindingId":"neovim/test","tier":"learning","queue":"due","remedial":false}],"correct":0,"attempts":0,"newLearned":0,"masteredGained":0,"runReviewTarget":1,"runNewTarget":0,"pendingReinforcements":[],"reactions":[],"runResults":{},"correctionRequired":false,"savedAt":1}
JSON

for kind in stats settings session; do
  XDG_STATE_HOME="$test_root/state" "$repo_root/bin/state-store" write "$kind" \
    < "$test_root/$kind.json" > /dev/null
done

cat > "$test_root/config/shell.qml" <<'EOF'
import QtQuick
import Quickshell
import "keycade" as Keycade

ShellRoot {
  Keycade.Keycade { id: overlay }

  property int failures: 0
  property int attempts: 0
  readonly property var finalBinding: ({
    id: "neovim/test",
    localId: "test",
    answer: {
      judgeMode: "text",
      steps: [{ mods: 0, text: "x" }],
      alternates: []
    }
  })
  readonly property var incompleteBinding: ({
    id: "neovim/incomplete",
    localId: "incomplete",
    answer: {
      judgeMode: "text",
      steps: [{ mods: 0, text: "y" }],
      alternates: []
    }
  })

  function check(label, actual, expected) {
    if (actual !== expected) {
      failures += 1
      console.error("MASTERY_TRANSITION_WRONG " + label + " was " + actual
                    + " instead of " + expected)
    }
  }

  Timer {
    interval: 200; running: true; repeat: true
    onTriggered: {
      attempts += 1
      if (overlay.profileId !== "neovim" || overlay.profileCounters().runs !== 1) {
        if (attempts < 30) return
        failures += 1
        console.error("MASTERY_TRANSITION_WRONG state did not load")
        running = false
        done.start()
        return
      }

      running = false
      check("oversized launch payload refused",
            Object.keys(overlay.acceptedOpenPayload("x".repeat(
                overlay.maxOpenPayloadChars + 1))).length, 0)
      check("array launch payload refused",
            Object.keys(overlay.acceptedOpenPayload("[]")).length, 0)
      check("bounded launch payload accepted",
            overlay.acceptedOpenPayload('{"locale":"zh-CN"}').locale, "zh-CN")
      // A crash may leave a not-yet-celebrated timestamp behind. If the
      // eligible set later grows, that stale milestone must not end a run
      // whose current model is below 100%.
      var pendingCounters = overlay.profileCounters()
      pendingCounters.firstMasteryAt = 1
      pendingCounters.firstMasteryRun = 1
      pendingCounters.firstMasteryCelebrated = false
      overlay.eligibleBindings = [finalBinding, incompleteBinding]
      overlay.view = "playing"
      overlay.refreshProgressCounts()
      check("incomplete total", overlay.progressCounts.total, 2)
      check("incomplete mastered", overlay.progressCounts.mastered, 0)
      check("stale milestone refused", overlay.finishAtFirstMastery(), false)
      check("incomplete run remains active", overlay.view, "playing")
      if (failures) {
        done.start()
        return
      }
      pendingCounters.firstMasteryAt = 0
      pendingCounters.firstMasteryRun = 0

      overlay.eligibleBindings = [finalBinding]
      // A second card proves that the transition is not the old end-of-deck
      // path: the current answer is only card 1 of 2.
      overlay.deck = [
        { binding: finalBinding, tier: "learning", queue: "due", remedial: false },
        { binding: finalBinding, tier: "maintenance", queue: "maintenance", remedial: false }
      ]
      overlay.cardIndex = 0
      overlay.runNumber = overlay.activeRunId
      overlay.cardStartedAt = Date.now() - 500
      overlay.activeSegmentStartedAt = Date.now() - 1000
      overlay.view = "playing"
      overlay.refreshProgressCounts()
      check("mastered before hit", overlay.progressCounts.mastered, 0)

      overlay.hitCurrent()

      var counters = overlay.profileCounters()
      check("view", overlay.view, "mastery")
      check("cards remain", overlay.deck.length, 2)
      check("card index", overlay.cardIndex, 0)
      check("mastered after hit", overlay.progressCounts.mastered, 1)
      check("run completed", counters.runs, 2)
      check("mastery run", counters.firstMasteryRun, 2)
      check("celebration consumed", counters.firstMasteryCelebrated, true)
      check("final attempts", overlay.masterySnapshot.attempts, 2)
      check("final accuracy", overlay.masterySnapshot.accuracy, 100)
      done.start()
    }
  }

  Timer {
    id: done; interval: 1000; repeat: false
    onTriggered: {
      console.log(failures ? "MASTERY_TRANSITION_FAILED" : "MASTERY_TRANSITION_OK")
      Qt.quit()
    }
  }
  Timer {
    interval: 15000; running: true; repeat: false
    onTriggered: { console.error("MASTERY_TRANSITION_FAILED: timeout"); Qt.quit() }
  }
}
EOF

output=$(
  XDG_STATE_HOME="$test_root/state" \
  QT_QPA_PLATFORMTHEME= \
  QT_STYLE_OVERRIDE=Fusion \
  timeout 20s quickshell --no-color --path "$test_root/config/shell.qml" 2>&1
)

if ! grep -Fq -- "MASTERY_TRANSITION_OK" <<<"$output"; then
  grep -E "MASTERY_TRANSITION" <<<"$output" >&2 || printf '%s\n' "$output" >&2
  exit 1
fi

if [[ -e $test_root/state/omarchy/keycade/session.json ]]; then
  printf 'MASTERY_TRANSITION_FAILED: resumable session survived 100%%\n' >&2
  exit 1
fi

printf 'mastery-transition QML integration test passed\n'
