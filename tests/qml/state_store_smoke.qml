import QtQuick
import Quickshell
import "lib"

ShellRoot {
  id: root
  property bool writeRequested: false

  StateStore {
    id: store
    onReadyChanged: {
      if (!ready || root.writeRequested) return
      root.writeRequested = true
      store.settings.locale = "zh-CN"
      // The palette this one replaced must carry over, not reset to default.
      store.settings.theme = "gruvbox"
      // Junk alongside one good entry: the sanitizer must keep exactly one.
      store.settings.excludedBindings = [
        "hyprland:64|LEFT|movefocus|l",
        "hyprland:__proto__",
        "hyprland:64|LEFT|movefocus|l",
        "no-profile-prefix",
        42
      ]
      store.saveSettings()
      store.saveStats()
      completionPoll.start()
    }
    onFailed: function(message) {
      console.error("STATE_STORE_SMOKE_FAILED: " + message)
      Qt.quit()
    }
  }

  Timer {
    id: completionPoll
    interval: 20
    repeat: true
    onTriggered: {
      if (store.currentOperation || store.operations.length) return
      console.log("STATE_STORE_SMOKE_OK")
      Qt.quit()
    }
  }

  Timer {
    interval: 6000
    running: true
    repeat: false
    onTriggered: {
      console.error("STATE_STORE_SMOKE_FAILED: timeout")
      Qt.quit()
    }
  }
}
