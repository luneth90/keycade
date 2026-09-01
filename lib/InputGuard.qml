import QtQuick
import Quickshell.Io
import Quickshell.Wayland._ShortcutsInhibitor

Item {
  id: root

  required property var window
  property string phase: "closed"
  property bool keyboardFocused: false
  property int modifiers: 0
  property bool requested: false
  property string error: ""

  readonly property bool active: inhibitor.active
  readonly property bool wantsFocus: phase !== "closed" && phase !== "blocked"
  readonly property bool acceptsGameInput: phase === "playing"

  signal ready()
  signal closed()
  signal blocked(string message)

  function begin() {
    root.error = ""
    root.modifiers = 0
    root.phase = "preflight"
    preflightOutput.value = ""
    preflight.running = true
  }

  function acquire() {
    root.phase = "acquiring"
    root.requested = true
    acquireTimeout.restart()
    evaluateReady()
  }

  function evaluateReady() {
    if (!root.requested || !root.active || !root.keyboardFocused || root.modifiers !== 0) {
      readyDelay.stop()
      return
    }
    root.phase = "ready"
    readyDelay.restart()
  }

  function updateInput(modMask) {
    root.modifiers = Number(modMask || 0)
    if (root.phase === "acquiring" || root.phase === "ready") root.evaluateReady()
    if (root.phase === "closing" && root.modifiers === 0) finishClose()
  }

  function play() {
    if (root.phase === "ready" && root.active && root.keyboardFocused && root.modifiers === 0) root.phase = "playing"
  }

  function requestClose() {
    if (root.phase === "closed") return
    readyDelay.stop()
    acquireTimeout.stop()
    root.phase = "closing"
    if (root.modifiers === 0) finishClose()
  }

  function finishClose() {
    root.requested = false
    root.phase = "closed"
    root.closed()
  }

  function fail(message) {
    readyDelay.stop()
    acquireTimeout.stop()
    root.requested = false
    root.error = message
    root.phase = "blocked"
    root.blocked(message)
  }

  QtObject { id: preflightOutput; property string value: "" }

  Process {
    id: preflight
    command: ["hyprctl", "-j", "getoption", "binds:disable_keybind_grabbing"]
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: preflightOutput.value = text
    }
    onExited: function(exitCode) {
      if (root.phase !== "preflight") return
      if (exitCode !== 0) {
        root.fail("Cannot verify Hyprland shortcut grabbing.")
        return
      }
      try {
        var option = JSON.parse(preflightOutput.value)
        var disabled = option.bool === true || Number(option.int || 0) !== 0 || String(option.str || "").toLowerCase() === "true"
        if (disabled) root.fail("Hyprland has binds:disable_keybind_grabbing enabled.")
        else root.acquire()
      } catch (error) {
        root.fail("Hyprland preflight returned invalid data.")
      }
    }
  }

  ShortcutInhibitor {
    id: inhibitor
    window: root.window
    enabled: root.requested
    onActiveChanged: {
      if (active) root.evaluateReady()
      else if (root.phase === "playing" || root.phase === "ready") root.fail("Shortcut inhibition was lost.")
    }
    onCancelled: {
      if (root.requested && root.phase !== "closing") root.fail("Hyprland cancelled shortcut inhibition.")
    }
  }

  Timer {
    id: acquireTimeout
    interval: 1500
    repeat: false
    onTriggered: {
      if (!root.active) root.fail("Shortcut inhibition did not activate within 1.5 seconds.")
      else if (!root.keyboardFocused) root.fail("The overlay could not obtain keyboard focus.")
    }
  }

  Timer {
    id: readyDelay
    interval: 500
    repeat: false
    onTriggered: {
      if (root.active && root.keyboardFocused && root.modifiers === 0) root.ready()
      else root.evaluateReady()
    }
  }
}
