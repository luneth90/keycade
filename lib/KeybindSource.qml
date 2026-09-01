import QtQuick
import Quickshell.Io

Item {
  id: root

  readonly property string helperPath: String(Qt.resolvedUrl("../bin/keybinds-json")).replace("file://", "")
  property var bindings: []
  property string fingerprint: ""
  property bool appleKeyboard: false
  property bool loading: false
  property string error: ""

  signal loaded()
  signal failed(string message)

  function refresh() {
    if (loader.running) return
    root.error = ""
    root.loading = true
    loader.running = true
  }

  function consume(raw) {
    root.loading = false
    try {
      var payload = JSON.parse(String(raw || ""))
      if (payload.schemaVersion !== 1) throw new Error("Unsupported keybind schema")
      if (payload.error) throw new Error(payload.error)
      if (!Array.isArray(payload.bindings)) throw new Error("Missing bindings array")
      root.bindings = payload.bindings
      root.fingerprint = String(payload.keymapFingerprint || "")
      root.appleKeyboard = payload.appleKeyboard === true
      root.loaded()
    } catch (error) {
      root.error = String(error)
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
    stderr: StdioCollector { waitForEnd: true }
    onExited: function(exitCode) {
      root.loading = false
      if (exitCode !== 0 && !root.error) {
        root.error = "keybinds-json exited with code " + exitCode
        root.failed(root.error)
      }
    }
  }
}
