import QtQuick
import Quickshell
import Quickshell.Io
import "../Profiles.js" as Profiles

// What a training ground's own configuration says about itself: which key
// every other binding hangs off, which opt-in bundles are on, which upstream
// version is installed.
//
// The shipped table stays the authority for *what* the bindings are. This only
// says how they were *changed*, and only from shapes that can be read without
// interpreting anything - see bin/app-config-json for the contract and the
// list of files, which is written out there in full.
//
// Reading nothing is a normal outcome, not a failure: no configuration, an
// unreadable one, or a value set in a shape the helper will not guess at all
// end here with the shipped defaults and a note saying so.
Item {
  id: root

  // Absolute interpreter and helper paths plus a rebuilt child environment
  // keep this long-lived component from resolving anything through PATH.
  readonly property string interpreterPath: "/usr/bin/python3"
  readonly property string relayPath: String(Qt.resolvedUrl("../../bin/bounded-relay")).replace("file://", "")
  readonly property string helperPath: String(Qt.resolvedUrl("../../bin/app-config-json")).replace("file://", "")
  readonly property int relayMaxBytes: 512 * 1024
  readonly property real relayDeadline: 3.0
  readonly property int maxRecordChars: 256 * 1024
  readonly property int maxExtras: 128
  readonly property int maxBindings: 128
  readonly property int maxOptionChars: 32

  property string profileId: ""

  // What the machine said. Empty until a read succeeds, and empty again if it
  // fails - a stale answer from another ground would be worse than none.
  property var options: ({})
  property var extras: []
  // Literal top-level vim.keymap.set/del calls, still in source order. The
  // pack loader applies them over the shipped LazyVim table.
  property var bindings: []
  property int bindingSkipped: 0
  // Why a value is missing, by name: "never assigned" means the upstream
  // default applies and nothing needs attention, anything else means the
  // reader should look.
  property var skipped: ({})
  property bool loading: false
  property bool settled: false
  // A second ground picked while the first is still being read must not be
  // dropped: the request is remembered and run once the reader is down.
  property bool pending: false

  signal finished()

  function reset() {
    root.options = ({})
    root.extras = []
    root.bindings = []
    root.bindingSkipped = 0
    root.skipped = ({})
    root.settled = false
  }

  // A ground with nothing to read is answered immediately: only the ones whose
  // configuration this helper knows the shape of are asked.
  function readable() {
    return root.profileId === "lazyvim" || root.profileId === "tmux"
  }

  function refresh() {
    root.reset()
    if (!root.readable()) {
      root.settled = true
      root.finished()
      return
    }
    if (reader.running) {
      root.pending = true
      reader.signal(15)
      return
    }
    root.loading = true
    readTimeout.restart()
    reader.running = true
  }

  function safeOption(value) {
    var text = String(value === undefined || value === null ? "" : value)
    if (!text.length || text.length > root.maxOptionChars) return ""
    return /[\u0000-\u001f\u007f]/.test(text) ? "" : text
  }

  // Bounded again on this side. The helper checks its own output; that it did
  // is not something this side can verify.
  function accept(record) {
    var declared = Object.keys(Profiles.options(root.profileId))
    var options = ({})
    var source = record.options && typeof record.options === "object"
        && !Array.isArray(record.options) ? record.options : ({})
    for (var index = 0; index < declared.length; index++) {
      var value = root.safeOption(source[declared[index]])
      if (value) options[declared[index]] = value
    }

    var extras = []
    if (Array.isArray(record.extras)) {
      for (var extra = 0; extra < record.extras.length && extras.length < root.maxExtras; extra++) {
        var name = String(record.extras[extra] || "")
        if (/^[A-Za-z0-9_.\-]{1,128}$/.test(name) && extras.indexOf(name) === -1)
          extras.push(name)
      }
    }

    var skipped = ({})
    var reasons = record.skipped && typeof record.skipped === "object"
        && !Array.isArray(record.skipped) ? record.skipped : ({})
    Object.keys(reasons).slice(0, 16).forEach(function(name) {
      if (/^[A-Za-z0-9_\-]{1,32}$/.test(name))
        skipped[name] = String(reasons[name] || "").slice(0, 128)
    })

    root.options = options
    root.extras = extras
    var bindings = []
    var rejectedBindings = 0
    if (root.profileId === "lazyvim" && Array.isArray(record.bindings)) {
      var bindingLimit = Math.min(record.bindings.length, root.maxBindings)
      for (var binding = 0; binding < bindingLimit; binding++) {
        var item = record.bindings[binding]
        if (!item || typeof item !== "object" || Array.isArray(item)) {
          rejectedBindings += 1
          continue
        }
        var op = String(item.op || "")
        var lhs = String(item.lhs || "")
        var desc = String(item.desc || "")
        if ((op !== "set" && op !== "del") || !lhs.length || lhs.length > 128) {
          rejectedBindings += 1
          continue
        }
        if (op === "set" && (!desc.length || desc.length > 512)) {
          rejectedBindings += 1
          continue
        }
        if (!Array.isArray(item.contexts) || !item.contexts.length || item.contexts.length > 4) {
          rejectedBindings += 1
          continue
        }
        var contexts = []
        for (var context = 0; context < item.contexts.length; context++) {
          var name = String(item.contexts[context] || "")
          if (Profiles.contexts(root.profileId).indexOf(name) !== -1
              && contexts.indexOf(name) === -1) contexts.push(name)
        }
        if (contexts.length)
          bindings.push({ op: op, lhs: lhs, desc: desc, contexts: contexts })
        else rejectedBindings += 1
      }
      rejectedBindings += Math.max(0, record.bindings.length - bindingLimit)
    }
    var bindingSkipped = 0
    var bindingReasons = record.bindingSkipped && typeof record.bindingSkipped === "object"
        && !Array.isArray(record.bindingSkipped) ? record.bindingSkipped : ({})
    Object.keys(bindingReasons).slice(0, 16).forEach(function(reason) {
      var count = Number(bindingReasons[reason] || 0)
      if (isFinite(count)) bindingSkipped += Math.max(0, Math.min(100000, Math.floor(count)))
    })
    root.bindings = bindings
    root.bindingSkipped = bindingSkipped + rejectedBindings
    root.skipped = skipped
  }

  function settle() {
    if (root.settled) return
    root.settled = true
    root.loading = false
    readTimeout.stop()
    root.finished()
  }

  Process {
    id: reader
    command: [
      root.interpreterPath, root.relayPath,
      "--max-bytes", String(root.relayMaxBytes),
      "--deadline", String(root.relayDeadline),
      "--", root.interpreterPath, root.helperPath, "--profile", root.profileId
    ]
    clearEnvironment: true
    // Only what the helper needs to find the home it reads under.
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
          if (record.schemaVersion !== 1 || record.type === "error") return
          if (record.profile !== root.profileId) return
          root.accept(record)
        } catch (error) {
          // Reading nothing is a normal outcome; the defaults cover it.
          console.warn("Keycade could not read the ground's configuration: " + error)
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
    id: readTimeout
    interval: 4000
    repeat: false
    onTriggered: {
      if (reader.running) reader.signal(15)
      root.settle()
    }
  }

  Component.onDestruction: if (reader.running) { reader.signal(15); reader.signal(9) }
}
