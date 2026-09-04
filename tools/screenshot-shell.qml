import QtQuick
import Quickshell
import "keycade" as Keycade

ShellRoot {
  Keycade.Keycade { id: overlay }

  readonly property string wantTheme: Quickshell.env("SHOT_THEME") || "gruvbox"
  readonly property string wantLocale: Quickshell.env("SHOT_LOCALE") || "en"
  readonly property string wantGround: Quickshell.env("SHOT_GROUND") || "hyprland"
  readonly property string wantBinding: Quickshell.env("SHOT_BINDING") || ""
  readonly property string wantView: Quickshell.env("SHOT_VIEW") || "playing"

  property int tries: 0

  // selectProfile refuses until the store has loaded, so asking repeatedly is
  // the wait: the first call that takes is the one that had settings.
  Timer {
    id: boot; interval: 300; running: true; repeat: true
    onTriggered: {
      tries += 1
      if (tries > 80) { console.log("SHOT_FAILED store never loaded"); Qt.quit(); return }
      overlay.selectProfile(wantGround)
      if (overlay.profileId !== wantGround) return
      running = false
      overlay.selectLocale(wantLocale)
      overlay.selectTheme(wantTheme)
      settle.start()
    }
  }

  Timer {
    id: settle; interval: 300; repeat: true
    onTriggered: {
      tries += 1
      if (tries > 160) { console.log("SHOT_FAILED ground never loaded"); Qt.quit(); return }
      if (overlay.groundLoading || !overlay.eligibleBindings.length) return
      running = false
      compose()
      show.start()
    }
  }

  // A guided card - the tier that shows the sequence, which is the one worth
  // photographing - built by hand rather than played, so the capture never
  // activates the input guard. An overlay that took the keyboard would take it
  // from whoever is running this.
  function compose() {
    overlay.selectTheme(wantTheme)
    if (wantView === "home") {
      overlay.view = "home"
      overlay.opened = true
      console.log("SHOT_CARD home " + overlay.profileId)
      return
    }
    var bindings = overlay.eligibleBindings
    var chosen = bindings[0]
    for (var index = 0; index < bindings.length; index++) {
      var item = bindings[index]
      var name = String(overlay.actionName(item) || "")
      if (wantBinding && (String(item.localId) === wantBinding
                          || name.toLowerCase().indexOf(wantBinding.toLowerCase()) !== -1)) {
        chosen = item
        break
      }
    }
    overlay.deck = [{ binding: chosen, tier: "guided", queue: "unseen", remedial: false }]
    overlay.cardIndex = 0
    overlay.runNumber = Number(Quickshell.env("SHOT_RUN") || 15)
    overlay.runOffset = Number(Quickshell.env("SHOT_OFFSET") || 5)
    overlay.runReviewTarget = 13
    overlay.runNewTarget = 6
    overlay.correct = 5
    overlay.attempts = 6
    overlay.newLearned = 1
    overlay.revealChord = true
    overlay.answerStep = 0
    overlay.view = "playing"
    overlay.opened = true
    console.log("SHOT_CARD " + chosen.localId + " | " + overlay.answerDisplay(chosen))
  }

  Timer { id: show; interval: 1100; repeat: false
    onTriggered: { console.log("SHOT_READY"); hold.start() } }
  Timer { id: hold; interval: 8000; repeat: false
    onTriggered: { overlay.opened = false; Qt.quit() } }
}
