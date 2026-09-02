import QtQuick
import Quickshell
import "lib"

ShellRoot {
  id: root

  function binding(overrides) {
    var result = {
      modMask: 64,
      key: "K",
      keycode: 0,
      matchMode: "logical",
      flags: [],
      dontInhibit: false,
      allowInputCapture: false,
      dispatcher: "exec",
      arg: "terminal",
      description: "Open terminal",
      submap: ""
    }
    Object.keys(overrides || {}).forEach(function(key) { result[key] = overrides[key] })
    return result
  }

  function payload(bindings, rejected) {
    return JSON.stringify({
      schemaVersion: 1,
      keymapFingerprint: "a".repeat(64),
      appleKeyboard: false,
      rejected: rejected,
      bindings: bindings
    })
  }

  function require(condition, message) {
    if (!condition) throw new Error(message)
  }

  function runChecks() {
    try {
      source.consume(root.payload([], 2))
      root.require(source.error === "" && source.bindings.length === 0
                   && source.rejected === 2, "bounded rejected count was not accepted")

      source.consume(root.payload([root.binding({})], 0))
      root.require(source.bindings.length === 1 && source.bindings[0].key === "K",
                   "valid model was not adopted")
      source.consume(root.payload([], 1.5))
      root.require(source.error.length > 0 && source.bindings.length === 1
                   && source.bindings[0].key === "K" && source.rejected === 0,
                   "malformed metadata partially replaced the valid model")

      source.bindings = []
      source.error = ""
      source.consume(root.payload([root.binding({ flags: ["future-flag"] })], 0))
      root.require(source.error.length > 0 && source.bindings.length === 0,
                   "unknown flag was accepted")

      source.error = ""
      source.consume(root.payload([
        root.binding({ dontInhibit: "false", allowInputCapture: false })
      ], 0))
      root.require(source.error.length > 0 && source.bindings.length === 0,
                   "non-boolean safety flag was accepted")

      console.log("KEYBIND_SOURCE_SMOKE_OK")
    } catch (error) {
      console.error("KEYBIND_SOURCE_SMOKE_FAILED: " + error)
    }
    Qt.quit()
  }

  KeybindSource { id: source }

  Timer {
    interval: 50
    running: true
    repeat: false
    onTriggered: root.runChecks()
  }

  Timer {
    interval: 5000
    running: true
    repeat: false
    onTriggered: {
      console.error("KEYBIND_SOURCE_SMOKE_FAILED: timeout")
      Qt.quit()
    }
  }
}
