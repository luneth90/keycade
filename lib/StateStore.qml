import QtQuick
import Quickshell.Io
import "Stats.js" as Stats
import "Session.js" as Session

Item {
  id: root

  readonly property string helperPath: String(Qt.resolvedUrl("../bin/state-store")).replace("file://", "")
  readonly property int maxResponseChars: 6 * 1024 * 1024
  readonly property int maxQueuedOperations: 16

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
      theme: "tokyo",
      reducedMotion: false,
      feedbackSound: true,
      countdownSound: true,
      soundVolume: 0.6
    }
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
    result.theme = ["tokyo", "gruvbox"].indexOf(String(source.theme || "")) !== -1
        ? String(source.theme) : "tokyo"
    result.reducedMotion = source.reducedMotion === true
    result.feedbackSound = source.feedbackSound === undefined
        ? (source.soundEnabled === undefined ? true : source.soundEnabled === true)
        : source.feedbackSound === true
    result.countdownSound = source.countdownSound === undefined ? true : source.countdownSound === true
    result.soundVolume = root.finiteNumber(source.soundVolume, 0.6, 0, 1)
    if (Number(source.schemaVersion) === 2 && Math.abs(result.soundVolume - 0.3) < 0.001)
      result.soundVolume = 0.6
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
    var operation = root.currentOperation
    var command = [root.helperPath, operation.action]
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

  function consumeLoad(raw) {
    if (String(raw || "").length > root.maxResponseChars)
      throw new Error("state response exceeded its limit")
    var payload = JSON.parse(String(raw || ""))
    if (!payload || payload.schemaVersion !== 1 || !payload.files)
      throw new Error("invalid state response")
    var names = ["stats", "settings", "session"]
    var limits = { stats: 2 * 1024 * 1024, settings: 64 * 1024, session: 512 * 1024 }
    for (var index = 0; index < names.length; index++) {
      var entry = payload.files[names[index]]
      if (!entry || ["ok", "missing", "quarantined"].indexOf(entry.status) === -1
          || typeof entry.text !== "string" || entry.text.length > limits[names[index]])
        throw new Error("invalid state file response")
    }
    root.loadStats(payload.files.stats.text)
    root.loadSettings(payload.files.settings.text)
    root.loadSession(payload.files.session.text)
  }

  Component.onCompleted: root.enqueue({ action: "load" })
  Component.onDestruction: {
    operationTimeout.stop()
    if (stateProcess.running) stateProcess.signal(9)
  }

  Timer {
    id: operationTimeout
    interval: 5000
    repeat: false
    onTriggered: {
      root.operationTimedOut = true
      if (stateProcess.running) stateProcess.signal(9)
    }
  }

  Process {
    id: stateProcess
    stdout: StdioCollector {
      waitForEnd: true
      onStreamFinished: root.operationOutput = text
    }
    onStarted: {
      if (root.currentOperation && root.currentOperation.payload !== undefined)
        stateProcess.write(root.currentOperation.payload + "\n")
    }
    onExited: function(exitCode) {
      operationTimeout.stop()
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
      try {
        if (operation && operation.action === "load") root.consumeLoad(root.operationOutput)
        else {
          if (String(root.operationOutput || "").length > 4096)
            throw new Error("oversized state acknowledgement")
          var acknowledgement = JSON.parse(String(root.operationOutput || ""))
          if (!acknowledgement || acknowledgement.schemaVersion !== 1 || acknowledgement.ok !== true)
            throw new Error("invalid state acknowledgement")
        }
      } catch (responseError) {
        root.fail("State helper returned invalid data")
        return
      }
      Qt.callLater(function() { root.runNext() })
    }
  }
}
