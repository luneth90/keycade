import QtQuick
import Quickshell
import Quickshell.Io
import "../Profiles.js" as Profiles
import "../TextKey.js" as TextKey

// The herdr training ground's source. Unlike LazyVim and tmux this one ships
// no table: Omarchy provides a tool that already resolves herdr's bindings
// from its own defaults and this machine's config.toml, with the prefix
// substituted, so there is a read-only listing to consume - the same
// arrangement that lets the Hyprland ground read the machine.
//
// There is therefore no packaged fallback and no prefix setting. If the
// listing cannot be read this ground has nothing to teach and says so, because
// a guessed prefix would make every card wrong in a way nobody could see.
Item {
  id: root

  readonly property string interpreterPath: "/usr/bin/python3"
  readonly property string relayPath: String(Qt.resolvedUrl("../../bin/bounded-relay")).replace("file://", "")
  readonly property string helperPath: String(Qt.resolvedUrl("../../bin/herdr-keys-json")).replace("file://", "")
  readonly property int relayMaxBytes: 1024 * 1024
  readonly property real relayDeadline: 6.0
  readonly property int maxRecordChars: 512 * 1024
  readonly property int maxBindings: 512
  readonly property int maxSteps: 8
  readonly property int maxLocalIdChars: 128
  readonly property int maxDescriptionChars: 512

  readonly property string profileId: "herdr"

  property var bindings: []
  property string fingerprint: ""
  property string sourceLabel: ""
  property bool loading: false
  property string error: ""
  property int rejected: 0
  property bool settled: false

  signal loaded()
  signal failed(string message)

  function refresh() {
    if (reader.running) return
    root.error = ""
    root.rejected = 0
    root.settled = false
    root.loading = true
    readTimeout.restart()
    reader.running = true
  }

  function safeText(value, limit) {
    var text = String(value === undefined || value === null ? "" : value)
    if (!text.length || text.length > limit) return ""
    return text.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
  }

  function acceptedBinding(record, contexts, categories) {
    if (!record || typeof record !== "object" || Array.isArray(record)) return null
    var localId = root.safeText(record.localId, root.maxLocalIdChars)
    var description = root.safeText(record.desc, root.maxDescriptionChars)
    var category = root.safeText(record.category, 32)
    var context = root.safeText(record.context, 32)
    if (!localId || !description) return null
    if (contexts.indexOf(context) === -1 || categories.indexOf(category) === -1) return null
    if (!Array.isArray(record.steps) || !record.steps.length
        || record.steps.length > root.maxSteps) return null
    var steps = []
    for (var index = 0; index < record.steps.length; index++) {
      var step = TextKey.normalizedStep(record.steps[index])
      if (!step) return null
      // Esc saves the run and leaves; no ground answers with it.
      if (step.named === "ESC") return null
      steps.push(step)
    }
    return {
      localId: localId,
      id: Profiles.qualify(root.profileId, localId),
      category: category,
      actionName: description,
      descKey: root.safeText(record.descKey, 128),
      extras: [],
      notation: root.safeText(record.notation, root.maxLocalIdChars),
      answer: { judgeMode: "text", context: context, steps: steps }
    }
  }

  function fail(message) {
    if (root.settled) return
    root.settled = true
    root.loading = false
    root.bindings = []
    root.error = String(message || "Invalid herdr listing").slice(0, 512)
    readTimeout.stop()
    root.failed(root.error)
  }

  function accept(record) {
    if (record.schemaVersion !== 1 || record.profile !== root.profileId
        || record.judgeMode !== "text" || !Array.isArray(record.bindings)) {
      root.fail("Unsupported herdr listing")
      return
    }
    if (record.bindings.length > root.maxBindings) {
      root.fail("herdr listing exceeded its entry limit")
      return
    }
    var contexts = Profiles.contexts(root.profileId)
    var categories = Array.isArray(record.categories) ? record.categories : []
    var accepted = []
    var refused = 0
    var seen = ({})
    for (var index = 0; index < record.bindings.length; index++) {
      var item = root.acceptedBinding(record.bindings[index], contexts, categories)
      if (!item || !item.id || seen[item.id]) { refused += 1; continue }
      seen[item.id] = true
      accepted.push(item)
    }
    if (!accepted.length) {
      root.fail("herdr listing named no trainable binding")
      return
    }
    root.settled = true
    root.loading = false
    root.bindings = accepted
    root.rejected = refused
    // What the prefix resolved to on this machine, so the card's provenance
    // line can say the ground was read rather than shipped.
    var prefix = TextKey.normalizedStep(record.prefix)
    root.sourceLabel = prefix ? TextKey.labels(prefix).join(" + ") : ""
    root.fingerprint = String(accepted.length) + ":" + root.sourceLabel
    readTimeout.stop()
    if (refused > 0) console.warn("Keycade skipped " + refused + " invalid herdr entr(ies)")
    root.loaded()
  }

  Process {
    id: reader
    command: [
      root.interpreterPath, root.relayPath,
      "--max-bytes", String(root.relayMaxBytes),
      "--deadline", String(root.relayDeadline),
      "--", root.interpreterPath, root.helperPath
    ]
    clearEnvironment: true
    Component.onCompleted: reader.environment = ({ "PATH": "/usr/bin", "HOME": Quickshell.env("HOME") || "" })
    stdout: SplitParser {
      splitMarker: "\n"
      onRead: function(line) {
        if (root.settled) return
        try {
          var text = String(line || "")
          if (!text.trim().length || text.length > root.maxRecordChars) return
          var record = JSON.parse(text)
          if (!record || typeof record !== "object" || Array.isArray(record)) return
          if (record.type === "error") {
            root.fail("herdr keybindings could not be read")
            return
          }
          root.accept(record)
        } catch (error) {
          root.fail(String(error))
        }
      }
    }
    onExited: function(exitCode) {
      readTimeout.stop()
      root.loading = false
      if (root.settled) return
      root.fail("herdr-keys-json exited with code " + exitCode)
    }
  }

  Timer {
    id: readTimeout
    interval: 8000
    repeat: false
    onTriggered: {
      if (reader.running) reader.signal(15)
      root.fail("herdr keybinding collection exceeded its deadline")
    }
  }

  Component.onDestruction: if (reader.running) { reader.signal(15); reader.signal(9) }
}
