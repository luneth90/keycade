import QtQuick
import Quickshell.Io

Item {
  id: root

  readonly property string helperPath: String(Qt.resolvedUrl("../bin/keybinds-json")).replace("file://", "")
  readonly property int maxPayloadChars: 8 * 1024 * 1024
  readonly property int maxBindings: 2000
  readonly property var allowedFlags: [
    "locked", "release", "click", "drag", "long-press", "repeat",
    "non-consuming", "mouse", "transparent", "ignore-mods", "separate",
    "description", "dont-inhibit", "catch-all"
  ]
  property var bindings: []
  property string fingerprint: ""
  property bool appleKeyboard: false
  property bool loading: false
  property string error: ""
  // Bindings the helper dropped for breaking a schema limit. Surfaced so a
  // malformed binding is observable instead of silently missing from training.
  property int rejected: 0

  signal loaded()
  signal failed(string message)

  function refresh() {
    if (loader.running) return
    root.error = ""
    root.loading = true
    loadTimeout.restart()
    loader.running = true
  }

  function safeText(value, limit, field) {
    if (typeof value !== "string" || value.length > limit)
      throw new Error("Invalid " + field)
    return value.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
  }

  function safeInteger(value, minimum, maximum, field) {
    if (typeof value !== "number" || !isFinite(value) || Math.floor(value) !== value
        || value < minimum || value > maximum)
      throw new Error("Invalid " + field)
    return value
  }

  function consume(raw) {
    root.loading = false
    try {
      var source = String(raw || "")
      if (source.length > root.maxPayloadChars) throw new Error("Keybind payload exceeded its limit")
      var payload = JSON.parse(source)
      if (!payload || typeof payload !== "object" || Array.isArray(payload))
        throw new Error("Invalid keybind payload")
      if (payload.schemaVersion !== 1) throw new Error("Unsupported keybind schema")
      if (payload.error) throw new Error(root.safeText(payload.error, 512, "error"))
      if (!Array.isArray(payload.bindings)) throw new Error("Missing bindings array")
      if (payload.bindings.length > root.maxBindings) throw new Error("Too many keybindings")
      var bindings = []
      var aggregateCharacters = 0
      for (var index = 0; index < payload.bindings.length; index++) {
        var sourceBinding = payload.bindings[index]
        if (!sourceBinding || typeof sourceBinding !== "object" || Array.isArray(sourceBinding))
          throw new Error("Invalid keybinding record")
        if (["logical", "physical"].indexOf(sourceBinding.matchMode) === -1)
          throw new Error("Invalid keybinding match mode")
        if (!Array.isArray(sourceBinding.flags) || sourceBinding.flags.length > 16)
          throw new Error("Invalid keybinding flags")
        var seenFlags = ({})
        var flags = sourceBinding.flags.map(function(flag) {
          var safeFlag = root.safeText(flag, 32, "flag")
          if (root.allowedFlags.indexOf(safeFlag) === -1 || seenFlags[safeFlag])
            throw new Error("Invalid keybinding flag")
          seenFlags[safeFlag] = true
          return safeFlag
        })
        if (typeof sourceBinding.dontInhibit !== "boolean"
            || typeof sourceBinding.allowInputCapture !== "boolean")
          throw new Error("Invalid keybinding safety flags")
        var binding = {
          modMask: root.safeInteger(sourceBinding.modMask, 0, 2147483647, "modifier mask"),
          key: root.safeText(sourceBinding.key, 128, "key"),
          keycode: root.safeInteger(sourceBinding.keycode, 0, 65535, "keycode"),
          matchMode: sourceBinding.matchMode,
          flags: flags,
          dontInhibit: sourceBinding.dontInhibit === true,
          allowInputCapture: sourceBinding.allowInputCapture === true,
          dispatcher: root.safeText(sourceBinding.dispatcher, 128, "dispatcher"),
          arg: root.safeText(sourceBinding.arg, 2048, "argument"),
          description: root.safeText(sourceBinding.description, 512, "description"),
          submap: root.safeText(sourceBinding.submap, 128, "submap")
        }
        aggregateCharacters += binding.key.length + binding.dispatcher.length + binding.arg.length
            + binding.description.length + binding.submap.length + flags.join("").length
        if (aggregateCharacters > 4 * 1024 * 1024)
          throw new Error("Keybinding model exceeded its aggregate limit")
        bindings.push(binding)
      }
      var rejected = payload.rejected === undefined
          ? 0 : root.safeInteger(payload.rejected, 0, root.maxBindings, "rejected count")
      if (bindings.length + rejected > root.maxBindings)
        throw new Error("Invalid total keybinding count")
      if (typeof payload.keymapFingerprint !== "string"
          || !/^[0-9a-f]{64}$/.test(payload.keymapFingerprint))
        throw new Error("Invalid keymap fingerprint")
      if (typeof payload.appleKeyboard !== "boolean")
        throw new Error("Invalid Apple keyboard flag")

      // Adopt the fully validated model and metadata together.
      root.bindings = bindings
      root.rejected = rejected
      root.fingerprint = payload.keymapFingerprint
      root.appleKeyboard = payload.appleKeyboard === true
      if (root.rejected > 0)
        console.warn("Keycade skipped " + root.rejected + " invalid keybinding record(s)")
      root.loaded()
    } catch (error) {
      root.error = String(error || "Invalid keybind data")
          .replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
          .slice(0, 512)
      root.failed(root.error)
    }
  }

  Process {
    id: loader
    command: [root.helperPath]
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: root.consume(text)
    }
    onExited: function(exitCode) {
      loadTimeout.stop()
      root.loading = false
      if (exitCode !== 0 && !root.error) {
        root.error = "keybinds-json exited with code " + exitCode
        root.failed(root.error)
      }
    }
  }

  Timer {
    id: loadTimeout
    interval: 5000
    repeat: false
    onTriggered: {
      if (!loader.running) return
      loader.signal(9)
      root.loading = false
      root.error = "Keybind collection exceeded its deadline"
      root.failed(root.error)
    }
  }

  Component.onDestruction: {
    loadTimeout.stop()
    if (loader.running) loader.signal(9)
  }
}
