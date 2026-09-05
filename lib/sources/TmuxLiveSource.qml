import QtQuick
import Quickshell.Io
import "ExternalPackValidation.js" as ExternalPack

// Optional live tmux table. Failure is not an error: the shipped pack is the
// fallback, and in particular no server is ever started just to collect keys.
Item {
  id: root

  readonly property string interpreterPath: "/usr/bin/python3"
  readonly property string relayPath: String(Qt.resolvedUrl("../../bin/bounded-relay")).replace("file://", "")
  readonly property string helperPath: String(Qt.resolvedUrl("../../bin/tmux-keys-json")).replace("file://", "")
  readonly property int maxBindings: 512
  readonly property int maxCategories: 32
  readonly property int maxSteps: 8
  readonly property int maxAlternates: 4
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

  // The helper's limits are not inherited by this process boundary. Rebuild a
  // fixed-schema pack and retain none of JSON.parse's original objects.
  function acceptedPack(record) {
    return ExternalPack.acceptedTmuxPack(record)
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
          var pack = root.acceptedPack(record)
          if (pack) {
            root.options = ExternalPack.acceptedTmuxOptions(record.options)
            root.pack = pack
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
