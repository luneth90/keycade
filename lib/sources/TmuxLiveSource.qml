import QtQuick
import Quickshell.Io
import "../TextKey.js" as TextKey

// Optional live tmux table. Failure is not an error: the shipped pack is the
// fallback, and in particular no server is ever started just to collect keys.
Item {
  id: root

  readonly property string interpreterPath: "/usr/bin/python3"
  readonly property string relayPath: String(Qt.resolvedUrl("../../bin/bounded-relay")).replace("file://", "")
  readonly property string helperPath: String(Qt.resolvedUrl("../../bin/tmux-keys-json")).replace("file://", "")
  property var pack: null
  property var options: ({})
  property bool loading: false
  property bool settled: false
  property bool pending: false
  signal finished()

  function refresh() {
    root.pack = null
    root.options = ({})
    root.settled = false
    if (reader.running) {
      root.pending = true
      reader.signal(15)
      return
    }
    root.loading = true
    timeout.restart()
    reader.running = true
  }

  function settle() {
    if (root.settled) return
    root.settled = true
    root.loading = false
    timeout.stop()
    root.finished()
  }

  function acceptedOptions(value) {
    if (!value || typeof value !== "object" || Array.isArray(value)) return null
    var prefix = String(value.prefix || "")
    var prefix2 = String(value.prefix2 || "")
    if (!prefix.length || prefix.length > 32 || /[\u0000-\u001f\u007f]/.test(prefix)) return null
    if (prefix2.length > 32 || /[\u0000-\u001f\u007f]/.test(prefix2)) return null
    if (!TextKey.parseKeySpec(prefix) || (prefix2 && !TextKey.parseKeySpec(prefix2))) return null
    var result = ({ prefix: prefix })
    if (prefix2 && prefix2 !== prefix) result.prefix2 = prefix2
    return result
  }

  Process {
    id: reader
    command: [root.interpreterPath, root.relayPath,
              "--max-bytes", String(768 * 1024), "--deadline", "6",
              "--", root.interpreterPath, root.helperPath]
    clearEnvironment: true
    Component.onCompleted: reader.environment = ({ "PATH": "/usr/bin" })
    stdout: SplitParser {
      splitMarker: "\n"
      onRead: function(line) {
        if (root.settled) return
        try {
          var text = String(line || "")
          if (!text.length || text.length > 512 * 1024) return
          var record = JSON.parse(text)
          var options = root.acceptedOptions(record ? record.options : null)
          if (record && record.schemaVersion === 1 && record.profile === "tmux"
              && record.available === true && Array.isArray(record.bindings) && options) {
            root.options = options
            root.pack = record
          }
        } catch (error) {
          root.pack = null
          root.options = ({})
        }
      }
    }
    onExited: {
      if (root.pending) {
        root.pending = false
        root.refresh()
        return
      }
      root.settle()
    }
  }

  Timer {
    id: timeout
    interval: 7000
    repeat: false
    onTriggered: {
      if (reader.running) reader.signal(15)
      root.settle()
    }
  }

  Component.onDestruction: if (reader.running) { reader.signal(15); reader.signal(9) }
}
