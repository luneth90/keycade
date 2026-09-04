import QtQuick
import Quickshell
import Quickshell.Io
import "Stats.js" as Stats
import "Session.js" as Session
import "Palettes.js" as Palettes
import "Profiles.js" as Profiles

Item {
  id: root

  // Absolute interpreter and helper paths plus a rebuilt child environment
  // keep this long-lived component from resolving anything through PATH.
  readonly property string interpreterPath: "/usr/bin/python3"
  // A relay spawned by this consumer caps what can reach the parser.
  // Quickshell exposes no parser buffer limit, so a child that never
  // emits the split marker would otherwise be retained in full before
  // any budget here could run. The limit is chosen and enforced
  // outside the process that produces the data.
  readonly property string relayPath: String(Qt.resolvedUrl("../bin/bounded-relay")).replace("file://", "")
  readonly property int relayMaxBytes: 6 * 1024 * 1024
  readonly property real relayDeadline: 4.0
  readonly property string helperPath: String(Qt.resolvedUrl("../bin/state-store")).replace("file://", "")
  readonly property int maxResponseChars: 6 * 1024 * 1024
  readonly property int maxRecordChars: 128 * 1024
  readonly property int maxRecords: 4096
  readonly property int maxQueuedOperations: 16
  readonly property var fileLimits: ({ stats: 2 * 1024 * 1024, settings: 64 * 1024, session: 512 * 1024 })

  // Incremental load state; the budget is enforced per record while reading.
  property var loadFiles: null
  property string loadKind: ""
  property int loadChunksLeft: 0
  property int streamChars: 0
  property int streamRecords: 0
  property bool streamComplete: false

  property var stats: Stats.defaults()
  property var settings: defaultSettings()
  property var session: null
  property bool ready: false
  property bool statsLoaded: false
  property bool settingsLoaded: false
  property bool sessionLoaded: false
  property bool statsCorrupt: false
  property bool settingsCorrupt: false
  property bool sessionCorrupt: false
  property string error: ""
  property var operations: []
  property var currentOperation: null
  property string operationOutput: ""
  property bool operationTimedOut: false

  signal failed(string message)

  function defaultSettings() {
    return {
      schemaVersion: 3,
      locale: "en",
      theme: Palettes.defaultName(),
      reducedMotion: false,
      feedbackSound: true,
      countdownSound: true,
      soundVolume: 0.4,
      excludedBindings: [],
      // The ground a run is played on, and the settings of the application
      // each pack ground trains. An upgrade lands on Hyprland, so nothing a
      // user already had changes until they pick another cabinet.
      activeProfile: Profiles.defaultId(),
      profileOptions: root.defaultProfileOptions()
    }
  }

  readonly property int maxOptionChars: 32

  // Only what was chosen by hand is stored. An option nobody overrode is
  // absent, so the overlay can tell "the reader picked this" from "this is
  // what the machine or the upstream says" - and clearing an override is
  // removing the entry rather than writing the default back over it.
  function defaultProfileOptions() {
    var result = Object.create(null)
    var ids = Profiles.ids()
    for (var index = 0; index < ids.length; index++) {
      if (!Object.keys(Profiles.options(ids[index])).length) continue
      result[ids[index]] = Object.create(null)
    }
    return result
  }

  // Dynamic keys on both levels, so both maps are built on a null prototype
  // and every name is checked before it is used: the ground against the
  // profile id character set, the option against what that ground declares.
  function normalizedProfileOptions(value) {
    var result = root.defaultProfileOptions()
    if (!value || typeof value !== "object" || Array.isArray(value)) return result
    var ids = Object.keys(value).slice(0, 16)
    for (var index = 0; index < ids.length; index++) {
      var id = ids[index]
      if (!Profiles.valid(id) || !Object.prototype.hasOwnProperty.call(result, id)) continue
      var stored = value[id]
      if (!stored || typeof stored !== "object" || Array.isArray(stored)) continue
      var names = Object.keys(Profiles.options(id))
      for (var name = 0; name < names.length; name++) {
        // Not `value`: that is this function's parameter, and `var` is scoped
        // to the function, so assigning it here replaced the map being read
        // and every ground after the first was silently dropped.
        var chosen = root.optionValue(stored[names[name]], "")
        if (chosen) result[id][names[name]] = chosen
      }
    }
    return result
  }

  // One key press worth of text as a person writes it - " ", "C-b", "ctrl+a" -
  // never a control character, never long enough to be something else.
  function optionValue(value, fallback) {
    if (typeof value !== "string" || !value.length || value.length > root.maxOptionChars)
      return fallback
    return /[\u0000-\u001f\u007f]/.test(value) ? fallback : value
  }

  function finiteNumber(value, fallback, minimum, maximum) {
    var number = typeof value === "number" && isFinite(value) ? value : fallback
    return Math.max(minimum, Math.min(maximum, number))
  }

  function normalizedSettings(value) {
    var source = value && typeof value === "object" && !Array.isArray(value) ? value : {}
    var result = root.defaultSettings()
    result.locale = ["en", "zh-CN"].indexOf(String(source.locale || "")) !== -1
        ? String(source.locale) : "en"
    result.theme = Palettes.supported(source.theme) ? String(source.theme) : Palettes.defaultName()
    result.reducedMotion = source.reducedMotion === true
    result.feedbackSound = source.feedbackSound === undefined
        ? (source.soundEnabled === undefined ? true : source.soundEnabled === true)
        : source.feedbackSound === true
    result.countdownSound = source.countdownSound === undefined ? true : source.countdownSound === true
    result.soundVolume = root.finiteNumber(source.soundVolume, 0.4, 0, 1)
    // The field is new in this schema version but the version stays at 3: a
    // bump would make an older Keycade reject the whole file and quarantine
    // every setting, while staying put only costs it the exclusions.
    result.excludedBindings = Session.excludedList(source.excludedBindings)
    result.activeProfile = Profiles.known(source.activeProfile)
        ? String(source.activeProfile) : Profiles.defaultId()
    result.profileOptions = root.normalizedProfileOptions(source.profileOptions)
    if (Number(source.schemaVersion) === 2 && Math.abs(result.soundVolume - 0.3) < 0.001)
      result.soundVolume = 0.4
    return result
  }

  function updateReady() {
    root.ready = root.statsLoaded && root.settingsLoaded && root.sessionLoaded && !root.error
  }

  function loadStats(raw) {
    var text = String(raw || "").trim()
    if (!text) {
      root.stats = Stats.defaults()
      root.statsCorrupt = false
    } else {
      try {
        var value = JSON.parse(text)
        if (!Stats.valid(value)) throw new Error("unsupported stats schema")
        var previousSchema = Number(value.schemaVersion || 0)
        root.stats = Stats.migrate(value)
        root.statsCorrupt = false
        if (previousSchema !== root.stats.schemaVersion)
          Qt.callLater(function() { root.saveStats() })
      } catch (loadError) {
        root.stats = Stats.defaults()
        root.statsCorrupt = true
        root.enqueue({ action: "quarantine", kind: "stats" })
        console.warn("Keycade stats were rejected and queued for quarantine")
      }
    }
    root.statsLoaded = true
    root.updateReady()
  }

  function loadSettings(raw) {
    var text = String(raw || "").trim()
    if (!text) {
      root.settings = root.defaultSettings()
      root.settingsCorrupt = false
    } else {
      try {
        var value = JSON.parse(text)
        if (!value || typeof value !== "object" || Array.isArray(value)
            || [1, 2, 3].indexOf(value.schemaVersion) === -1)
          throw new Error("unsupported settings schema")
        var previousSchema = Number(value.schemaVersion)
        root.settings = root.normalizedSettings(value)
        root.settingsCorrupt = false
        if (previousSchema !== root.settings.schemaVersion)
          Qt.callLater(function() { root.saveSettings() })
      } catch (loadError) {
        root.settings = root.defaultSettings()
        root.settingsCorrupt = true
        root.enqueue({ action: "quarantine", kind: "settings" })
        console.warn("Keycade settings were rejected and queued for quarantine")
      }
    }
    root.settingsLoaded = true
    root.updateReady()
  }

  function loadSession(raw) {
    var text = String(raw || "").trim()
    root.session = null
    root.sessionCorrupt = false
    if (text) {
      try {
        var value = Session.sanitize(JSON.parse(text))
        if (!value) throw new Error("unsupported session schema")
        root.session = value
      } catch (loadError) {
        root.sessionCorrupt = true
        root.enqueue({ action: "quarantine", kind: "session" })
        console.warn("Keycade session was rejected and queued for quarantine")
      }
    }
    root.sessionLoaded = true
    root.updateReady()
  }

  // Only what the helper needs; nothing else is inherited.
  function childEnvironment() {
    return {
      "PATH": "/usr/bin",
      "HOME": Quickshell.env("HOME") || "",
      "XDG_STATE_HOME": Quickshell.env("XDG_STATE_HOME") || ""
    }
  }

  function fail(message) {
    if (root.error) return
    root.error = String(message || "State storage failed").slice(0, 512)
    root.ready = false
    root.failed(root.error)
  }

  function enqueue(operation) {
    if (root.error) return
    var queue = root.operations.slice()
    if (operation.action === "write") {
      for (var index = queue.length - 1; index >= 0; index--) {
        if (queue[index].kind !== operation.kind) continue
        if (queue[index].action === "write") {
          queue[index] = operation
          root.operations = queue
          return
        }
        break
      }
    } else if (operation.action === "delete") {
      for (var deleteIndex = queue.length - 1; deleteIndex >= 0; deleteIndex--) {
        if (queue[deleteIndex].kind !== operation.kind) continue
        if (queue[deleteIndex].action === "delete") return
        if (queue[deleteIndex].action === "write") {
          queue[deleteIndex] = operation
          root.operations = queue
          return
        }
        break
      }
    }
    if (queue.length >= root.maxQueuedOperations) {
      root.fail("State operation queue exceeded its limit")
      return
    }
    queue.push(operation)
    root.operations = queue
    root.runNext()
  }

  function runNext() {
    if (stateProcess.running || root.currentOperation || !root.operations.length || root.error) return
    var queue = root.operations.slice()
    root.currentOperation = queue.shift()
    root.operations = queue
    root.operationOutput = ""
    root.operationTimedOut = false
    root.loadFiles = null
    root.loadKind = ""
    root.loadChunksLeft = 0
    root.streamChars = 0
    root.streamRecords = 0
    root.streamComplete = false
    var operation = root.currentOperation
    var command = [
      root.interpreterPath, root.relayPath,
      "--max-bytes", String(root.relayMaxBytes),
      "--deadline", String(root.relayDeadline),
      "--", root.interpreterPath, root.helperPath, operation.action
    ]
    if (operation.kind) command.push(operation.kind)
    if (operation.quarantine) command.push("--quarantine")
    stateProcess.command = command
    stateProcess.stdinEnabled = operation.payload !== undefined
    operationTimeout.restart()
    stateProcess.running = true
  }

  function enqueueWrite(kind, value, quarantine) {
    var payload
    try {
      payload = JSON.stringify(value)
    } catch (serializeError) {
      root.fail("State serialization failed")
      return
    }
    var characterLimits = { stats: 2 * 1024 * 1024, settings: 64 * 1024, session: 512 * 1024 }
    if (payload.length > characterLimits[kind]) {
      root.fail(kind + " state exceeded its limit")
      return
    }
    root.enqueue({ action: "write", kind: kind, payload: payload, quarantine: quarantine === true })
  }

  function saveStats() {
    root.stats = Stats.migrate(root.stats)
    root.enqueueWrite("stats", root.stats, root.statsCorrupt)
    root.statsCorrupt = false
  }

  function saveSettings() {
    root.settings = root.normalizedSettings(root.settings)
    root.enqueueWrite("settings", root.settings, root.settingsCorrupt)
    root.settingsCorrupt = false
  }

  function saveSession(value) {
    root.session = Session.sanitize(value)
    if (!root.session) {
      root.clearSession()
      return
    }
    root.enqueueWrite("session", root.session, root.sessionCorrupt)
    root.sessionCorrupt = false
  }

  function clearSession() {
    root.session = null
    root.enqueue({ action: "delete", kind: "session" })
  }

  // One record at a time while the helper is still running, so an oversized
  // response is abandoned rather than retained and measured afterwards.
  // Write, delete and quarantine reply with a single small acknowledgement.
  function acceptAcknowledgement(line) {
    var text = String(line || "")
    if (!text.trim().length) return
    if (text.length > 4096) throw new Error("oversized state acknowledgement")
    var acknowledgement = JSON.parse(text)
    if (!acknowledgement || acknowledgement.schemaVersion !== 1 || acknowledgement.ok !== true)
      throw new Error("invalid state acknowledgement")
    root.streamComplete = true
  }

  // Give the helper a chance to exit on its own before forcing it down.
  function stopHelper() {
    if (!stateProcess.running) return
    stateProcess.signal(15)
    forceStop.restart()
  }

  function acceptLine(line) {
    if (root.streamComplete) return
    var text = String(line || "")
    if (text.length > root.maxRecordChars) throw new Error("state record exceeded its limit")
    root.streamChars += text.length + 1
    if (root.streamChars > root.maxResponseChars) throw new Error("state response exceeded its limit")
    root.streamRecords += 1
    if (root.streamRecords > root.maxRecords) throw new Error("too many state records")
    if (!text.trim().length) return

    var record = JSON.parse(text)
    if (!record || typeof record !== "object" || Array.isArray(record))
      throw new Error("invalid state record")

    if (record.type === "header") {
      if (record.schemaVersion !== 1) throw new Error("invalid state response")
      root.loadFiles = ({ stats: "", settings: "", session: "" })
      root.loadKind = ""
      root.loadChunksLeft = 0
      return
    }

    if (record.type === "file") {
      if (!root.loadFiles) throw new Error("state record before header")
      if (["stats", "settings", "session"].indexOf(record.kind) === -1)
        throw new Error("invalid state file response")
      if (["ok", "missing", "quarantined"].indexOf(record.status) === -1)
        throw new Error("invalid state file response")
      if (typeof record.chunks !== "number" || !isFinite(record.chunks)
          || Math.floor(record.chunks) !== record.chunks || record.chunks < 0)
        throw new Error("invalid state chunk count")
      root.loadKind = record.kind
      root.loadChunksLeft = record.chunks
      return
    }

    if (record.type === "chunk") {
      if (!root.loadFiles || record.kind !== root.loadKind || root.loadChunksLeft <= 0)
        throw new Error("unexpected state chunk")
      if (typeof record.data !== "string") throw new Error("invalid state chunk")
      var existing = String(root.loadFiles[record.kind])
      var addition = String(record.data)
      if (existing.length + addition.length > root.fileLimits[record.kind])
        throw new Error("state file exceeded its limit")
      root.loadFiles[record.kind] = existing + addition
      root.loadChunksLeft -= 1
      return
    }

    if (record.type !== "end") throw new Error("unknown state record type")
    if (!root.loadFiles || root.loadChunksLeft !== 0) throw new Error("incomplete state response")
    root.streamComplete = true
    root.loadStats(root.loadFiles.stats)
    root.loadSettings(root.loadFiles.settings)
    root.loadSession(root.loadFiles.session)
    root.loadFiles = null
  }

  Component.onCompleted: root.enqueue({ action: "load" })
  Component.onDestruction: {
    operationTimeout.stop()
    forceStop.stop()
    if (stateProcess.running) {
      stateProcess.signal(15)
      stateProcess.signal(9)
    }
  }

  Timer {
    id: operationTimeout
    interval: 5000
    repeat: false
    onTriggered: {
      root.operationTimedOut = true
      root.stopHelper()
    }
  }

  Timer {
    id: forceStop
    interval: 500
    repeat: false
    onTriggered: if (stateProcess.running) stateProcess.signal(9)
  }

  Process {
    id: stateProcess
    clearEnvironment: true
    Component.onCompleted: stateProcess.environment = root.childEnvironment()
    stdout: SplitParser {
      splitMarker: "\n"
      onRead: function(line) {
        if (root.error) return
        try {
          if (root.currentOperation && root.currentOperation.action === "load") root.acceptLine(line)
          else root.acceptAcknowledgement(line)
        } catch (lineError) {
          root.fail("State helper returned invalid data")
          root.stopHelper()
        }
      }
    }
    onStarted: {
      if (root.currentOperation && root.currentOperation.payload !== undefined)
        stateProcess.write(root.currentOperation.payload + "\n")
    }
    onExited: function(exitCode) {
      operationTimeout.stop()
      forceStop.stop()
      var operation = root.currentOperation
      root.currentOperation = null
      if (root.operationTimedOut) {
        root.fail("State helper exceeded its deadline")
        return
      }
      if (exitCode !== 0) {
        root.fail("State helper failed")
        return
      }
      if (root.error) return
      if (!root.streamComplete) {
        root.fail("State helper returned invalid data")
        return
      }
      Qt.callLater(function() { root.runNext() })
    }
  }
}
