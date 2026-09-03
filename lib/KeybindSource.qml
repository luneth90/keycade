import QtQuick
import Quickshell
import Quickshell.Io

Item {
  id: root

  // The interpreter and the helper are addressed by absolute path, and the
  // child environment is rebuilt from scratch, so nothing this long-lived
  // component executes is resolved through the ambient PATH.
  readonly property string interpreterPath: "/usr/bin/python3"
  // A relay spawned by this consumer caps what can reach the parser.
  // Quickshell exposes no parser buffer limit, so a child that never
  // emits the split marker would otherwise be retained in full before
  // any budget here could run. The limit is chosen and enforced
  // outside the process that produces the data.
  readonly property string relayPath: String(Qt.resolvedUrl("../bin/bounded-relay")).replace("file://", "")
  readonly property int relayMaxBytes: 8 * 1024 * 1024
  readonly property real relayDeadline: 4.0
  readonly property string helperPath: String(Qt.resolvedUrl("../bin/keybinds-json")).replace("file://", "")
  readonly property int maxPayloadChars: 8 * 1024 * 1024
  readonly property int maxRecordChars: 8 * 1024
  readonly property int maxBindings: 2000
  readonly property int maxKeycodeMapEntries: 256
  readonly property int maxKeycodesPerEntry: 16
  readonly property var allowedFlags: [
    "locked", "release", "click", "drag", "long-press", "repeat",
    "non-consuming", "mouse", "transparent", "ignore-mods", "separate",
    "description", "dont-inhibit", "catch-all"
  ]
  property var bindings: []
  property string fingerprint: ""
  property bool appleKeyboard: false
  // Keycodes accepted for each canonical key name, reproduced from the keymap
  // Hyprland resolves binds against. Empty whenever the helper could not
  // confirm that keymap, in which case judging stays character based.
  property var keycodeMap: ({})
  property string keymapSource: "none"
  readonly property bool keymapAuthoritative: root.keymapSource !== "none"
  property bool loading: false
  property string error: ""
  // Bindings the helper dropped for breaking a schema limit. Surfaced so a
  // malformed binding is observable instead of silently missing from training.
  property int rejected: 0

  // Incremental stream state. The budget is enforced while reading, so an
  // oversized stream is abandoned before it can be retained in full.
  property var pendingBindings: []
  property var pendingHeader: null
  property int streamChars: 0
  property int streamRecords: 0
  property bool streamSettled: false

  signal loaded()
  signal failed(string message)

  function refresh() {
    if (loader.running) return
    root.error = ""
    root.loading = true
    root.pendingBindings = []
    root.pendingHeader = null
    root.streamChars = 0
    root.streamRecords = 0
    root.streamSettled = false
    root.keycodeMap = ({})
    root.keymapSource = "none"
    loadTimeout.restart()
    loader.running = true
  }

  // The helper runs with a rebuilt environment, so it cannot see whether the
  // session Hyprland was started in names an XKB source of its own. Report it
  // as a flag rather than forwarding the variables: an overridden search path
  // means the helper cannot reproduce the compositor's keymap.
  function xkbEnvironmentOverridden() {
    if (Quickshell.env("XKB_CONFIG_ROOT") || Quickshell.env("XKB_CONFIG_EXTRA_PATH")) return true
    var home = String(Quickshell.env("HOME") || "")
    var configHome = String(Quickshell.env("XDG_CONFIG_HOME") || "")
    if (!configHome) return false
    return !home || configHome !== home + "/.config"
  }

  // Only what the helper needs to reach the compositor socket.
  function childEnvironment() {
    return {
      "PATH": "/usr/bin",
      "HYPRLAND_INSTANCE_SIGNATURE": Quickshell.env("HYPRLAND_INSTANCE_SIGNATURE") || "",
      "XDG_RUNTIME_DIR": Quickshell.env("XDG_RUNTIME_DIR") || ""
    }
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

  function fail(message) {
    if (root.streamSettled) return
    root.streamSettled = true
    root.loading = false
    root.pendingBindings = []
    root.pendingHeader = null
    root.error = String(message || "Invalid keybind data")
        .replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
        .slice(0, 512)
    root.stop()
    root.failed(root.error)
  }

  function validatedBinding(record) {
    if (["logical", "physical"].indexOf(record.matchMode) === -1)
      throw new Error("Invalid keybinding match mode")
    if (!Array.isArray(record.flags) || record.flags.length > 16)
      throw new Error("Invalid keybinding flags")
    var seenFlags = ({})
    var flags = record.flags.map(function(flag) {
      var safeFlag = root.safeText(flag, 32, "flag")
      if (root.allowedFlags.indexOf(safeFlag) === -1 || seenFlags[safeFlag])
        throw new Error("Invalid keybinding flag")
      seenFlags[safeFlag] = true
      return safeFlag
    })
    if (typeof record.dontInhibit !== "boolean" || typeof record.allowInputCapture !== "boolean")
      throw new Error("Invalid keybinding safety flags")
    return {
      modMask: root.safeInteger(record.modMask, 0, 2147483647, "modifier mask"),
      key: root.safeText(record.key, 128, "key"),
      keycode: root.safeInteger(record.keycode, 0, 65535, "keycode"),
      matchMode: record.matchMode,
      flags: flags,
      dontInhibit: record.dontInhibit === true,
      allowInputCapture: record.allowInputCapture === true,
      dispatcher: root.safeText(record.dispatcher, 128, "dispatcher"),
      arg: root.safeText(record.arg, 2048, "argument"),
      description: root.safeText(record.description, 512, "description"),
      submap: root.safeText(record.submap, 128, "submap")
    }
  }

  // A malformed map degrades judging to the character comparison instead of
  // failing the snapshot: a keybind trainer with no keybinds is worse than one
  // that judges the way it did before.
  function acceptedKeycodeMap(record) {
    if (record.keymapSource !== "global-rmlvo") return null
    try {
      return root.validatedKeycodeMap(record.keycodeMap)
    } catch (error) {
      console.warn("Keycade ignored an invalid keycode map: " + error)
      return null
    }
  }

  function validatedKeycodeMap(value) {
    if (!value || typeof value !== "object" || Array.isArray(value))
      throw new Error("Invalid keycode map")
    var names = Object.keys(value)
    // Empty is a legitimate answer when no binding named a keysym at all.
    if (names.length > root.maxKeycodeMapEntries)
      throw new Error("Invalid keycode map size")
    var result = Object.create(null)
    for (var i = 0; i < names.length; i++) {
      var name = names[i]
      if (name === "__proto__" || name === "constructor" || name === "prototype")
        throw new Error("Unsafe keycode map key")
      var codes = value[name]
      if (!Array.isArray(codes) || !codes.length || codes.length > root.maxKeycodesPerEntry)
        throw new Error("Invalid keycode map entry")
      var accepted = []
      for (var j = 0; j < codes.length; j++)
        accepted.push(root.safeInteger(codes[j], 0, 65535, "keycode"))
      result[root.safeText(name, 128, "keycode map key")] = accepted
    }
    return result
  }

  // Called once per newline-delimited record while the helper is still
  // running, so the budget below is a pre-allocation bound rather than a
  // check performed after the whole stream has been retained.
  function acceptLine(line) {
    if (root.streamSettled) return
    try {
      var text = String(line || "")
      if (text.length > root.maxRecordChars) throw new Error("Keybind record exceeded its limit")
      root.streamChars += text.length + 1
      if (root.streamChars > root.maxPayloadChars)
        throw new Error("Keybind payload exceeded its limit")
      root.streamRecords += 1
      if (root.streamRecords > root.maxBindings + 1)
        throw new Error("Too many keybind records")
      if (!text.trim().length) return

      var record = JSON.parse(text)
      if (!record || typeof record !== "object" || Array.isArray(record))
        throw new Error("Invalid keybind record")
      if (record.schemaVersion !== undefined && record.schemaVersion !== 1)
        throw new Error("Unsupported keybind schema")

      if (record.type === "error") throw new Error(root.safeText(record.error, 512, "error"))

      if (record.type === "header") {
        if (root.pendingHeader) throw new Error("Duplicate keybind header")
        if (typeof record.keymapFingerprint !== "string"
            || !/^[0-9a-f]{64}$/.test(record.keymapFingerprint))
          throw new Error("Invalid keymap fingerprint")
        if (typeof record.appleKeyboard !== "boolean")
          throw new Error("Invalid Apple keyboard flag")
        var count = root.safeInteger(record.count, 0, root.maxBindings, "binding count")
        var rejected = root.safeInteger(record.rejected, 0, root.maxBindings, "rejected count")
        if (count + rejected > root.maxBindings)
          throw new Error("Invalid total keybinding count")
        root.pendingHeader = {
          count: count,
          rejected: rejected,
          fingerprint: record.keymapFingerprint,
          appleKeyboard: record.appleKeyboard,
          keycodeMap: root.acceptedKeycodeMap(record)
        }
        if (count === 0) root.settle()
        return
      }

      if (record.type !== "binding") throw new Error("Unknown keybind record type")
      if (!root.pendingHeader) throw new Error("Keybind record before header")
      if (root.pendingBindings.length >= root.pendingHeader.count)
        throw new Error("More keybind records than the header declared")
      root.pendingBindings.push(root.validatedBinding(record))
      if (root.pendingBindings.length === root.pendingHeader.count) root.settle()
    } catch (error) {
      root.fail(error)
    }
  }

  // Adopt the complete, fully validated model and its metadata together.
  function settle() {
    if (root.streamSettled || !root.pendingHeader) return
    root.streamSettled = true
    root.loading = false
    root.bindings = root.pendingBindings
    root.rejected = root.pendingHeader.rejected
    root.fingerprint = root.pendingHeader.fingerprint
    root.appleKeyboard = root.pendingHeader.appleKeyboard === true
    root.keycodeMap = root.pendingHeader.keycodeMap || ({})
    root.keymapSource = root.pendingHeader.keycodeMap ? "global-rmlvo" : "none"
    root.pendingBindings = []
    root.pendingHeader = null
    loadTimeout.stop()
    if (root.rejected > 0)
      console.warn("Keycade skipped " + root.rejected + " invalid keybinding record(s)")
    root.loaded()
  }

  // Ask the helper to clean up its own child process group before forcing it
  // down. The helper also arms a kernel death signal on each child, so an
  // immediate SIGKILL cannot leave a hyprctl behind either.
  function stop() {
    if (!loader.running) return
    loader.signal(15)
    forceStop.restart()
  }

  Process {
    id: loader
    command: [
      root.interpreterPath, root.relayPath,
      "--max-bytes", String(root.relayMaxBytes),
      "--deadline", String(root.relayDeadline),
      "--", root.interpreterPath, root.helperPath
    ].concat(root.xkbEnvironmentOverridden() ? ["--xkb-environment-overridden"] : [])
    clearEnvironment: true
    Component.onCompleted: loader.environment = root.childEnvironment()
    stdout: SplitParser {
      splitMarker: "\n"
      onRead: function(line) { root.acceptLine(line) }
    }
    onExited: function(exitCode) {
      loadTimeout.stop()
      forceStop.stop()
      root.loading = false
      if (root.streamSettled) return
      root.fail(exitCode !== 0
                ? "keybinds-json exited with code " + exitCode
                : "keybinds-json ended before its records were complete")
    }
  }

  Timer {
    id: loadTimeout
    interval: 5000
    repeat: false
    onTriggered: {
      if (!loader.running) return
      root.fail("Keybind collection exceeded its deadline")
    }
  }

  Timer {
    id: forceStop
    interval: 500
    repeat: false
    onTriggered: if (loader.running) loader.signal(9)
  }

  Component.onDestruction: {
    loadTimeout.stop()
    forceStop.stop()
    if (loader.running) {
      loader.signal(15)
      loader.signal(9)
    }
  }
}
