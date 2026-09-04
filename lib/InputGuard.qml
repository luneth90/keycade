import QtQuick
import Quickshell
import Quickshell.Io
import Quickshell.Wayland._ShortcutsInhibitor

Item {
  id: root

  required property var window
  readonly property string interpreterPath: "/usr/bin/python3"
  // A relay spawned by this consumer caps what can reach the parser.
  // Quickshell exposes no parser buffer limit, so a child that never
  // emits the split marker would otherwise be retained in full before
  // any budget here could run. The limit is chosen and enforced
  // outside the process that produces the data.
  readonly property string relayPath: String(Qt.resolvedUrl("../bin/bounded-relay")).replace("file://", "")
  readonly property int relayMaxBytes: 64 * 1024
  readonly property real relayDeadline: 2.5
  readonly property string helperPath: String(Qt.resolvedUrl("../bin/keybinds-json")).replace("file://", "")
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
    preflightTimeout.restart()
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

  // Back to ready without giving up the inhibitor. Leaving a run is not
  // leaving the overlay: the protection stays up and the next run starts from
  // the same place the first one did.
  function pause() {
    if (root.phase === "playing") root.phase = "ready"
  }

  function requestClose() {
    if (root.phase === "closed") return
    readyDelay.stop()
    acquireTimeout.stop()
    preflightTimeout.stop()
    if (preflight.running) preflight.signal(9)
    root.phase = "closing"
    if (root.modifiers === 0) finishClose()
  }

  function finishClose() {
    root.requested = false
    root.phase = "closed"
    root.closed()
  }

  // Only what the helper needs; nothing else is inherited.
  function childEnvironment() {
    return {
      "PATH": "/usr/bin",
      "HYPRLAND_INSTANCE_SIGNATURE": Quickshell.env("HYPRLAND_INSTANCE_SIGNATURE") || "",
      "XDG_RUNTIME_DIR": Quickshell.env("XDG_RUNTIME_DIR") || ""
    }
  }

  function fail(message) {
    readyDelay.stop()
    acquireTimeout.stop()
    root.requested = false
    root.error = message
    root.phase = "blocked"
    root.blocked(message)
  }

  QtObject { id: preflightOutput; property string value: ""; property bool overflowed: false }

  Process {
    id: preflight
    // Absolute interpreter path and a rebuilt environment: nothing here is
    // resolved through the ambient PATH of the host shell process.
    command: [
      root.interpreterPath, root.relayPath,
      "--max-bytes", String(root.relayMaxBytes),
      "--deadline", String(root.relayDeadline),
      "--", root.interpreterPath, root.helperPath, "--guard-status"
    ]
    clearEnvironment: true
    Component.onCompleted: preflight.environment = root.childEnvironment()
    stdout: SplitParser {
      splitMarker: "\n"
      onRead: function(line) {
        // A single small record; cap it while reading rather than after.
        if (preflightOutput.value.length + String(line).length > 4096) {
          preflightOutput.value = ""
          preflightOutput.overflowed = true
          return
        }
        preflightOutput.value += String(line)
      }
    }
    onExited: function(exitCode) {
      preflightTimeout.stop()
      if (root.phase !== "preflight") return
      if (exitCode !== 0) {
        root.fail("Cannot verify Hyprland shortcut grabbing.")
        return
      }
      try {
        if (preflightOutput.overflowed) throw new Error("oversized preflight")
        var option = JSON.parse(preflightOutput.value)
        if (!option || option.schemaVersion !== 1 || typeof option.disabled !== "boolean")
          throw new Error("invalid preflight schema")
        if (option.disabled) root.fail("Hyprland has binds:disable_keybind_grabbing enabled.")
        else root.acquire()
      } catch (error) {
        root.fail("Hyprland preflight returned invalid data.")
      }
    }
  }

  Timer {
    id: preflightTimeout
    interval: 5000
    repeat: false
    onTriggered: {
      if (preflight.running) preflight.signal(9)
      if (root.phase === "preflight") root.fail("Hyprland preflight exceeded its deadline.")
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

  Component.onDestruction: {
    preflightTimeout.stop()
    if (preflight.running) preflight.signal(9)
  }
}
