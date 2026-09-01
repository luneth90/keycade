import QtQuick
import Quickshell
import Quickshell.Io
import "Stats.js" as Stats

Item {
  id: root

  readonly property string stateDir: {
    var xdg = Quickshell.env("XDG_STATE_HOME")
    return (xdg ? xdg : Quickshell.env("HOME") + "/.local/state") + "/omarchy/keycade"
  }
  readonly property string statsPath: stateDir + "/stats.json"
  readonly property string settingsPath: stateDir + "/settings.json"
  readonly property string sessionPath: stateDir + "/session.json"

  property var stats: Stats.defaults()
  property var settings: defaultSettings()
  property var session: null
  property bool ready: false
  property bool statsLoaded: false
  property bool settingsLoaded: false
  property bool sessionLoaded: false
  property bool statsCorrupt: false
  property bool settingsCorrupt: false
  property string pendingStats: ""
  property string pendingSettings: ""

  function defaultSettings() {
    return {
      schemaVersion: 3,
      locale: "en",
      reducedMotion: false,
      feedbackSound: true,
      countdownSound: true,
      soundVolume: 0.6
    }
  }

  function updateReady() {
    root.ready = root.statsLoaded && root.settingsLoaded && root.sessionLoaded
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
      } catch (error) {
        root.stats = Stats.defaults()
        root.statsCorrupt = true
        console.warn("Keycade stats quarantined on next save:", error)
      }
    }
    root.statsLoaded = true
    root.updateReady()
  }

  function loadSettings(raw) {
    try {
      var value = JSON.parse(String(raw || ""))
      if (value.schemaVersion === 1 || value.schemaVersion === 2 || value.schemaVersion === 3) {
        var previousSchema = Number(value.schemaVersion)
        var merged = root.defaultSettings()
        Object.keys(value).forEach(function(key) { merged[key] = value[key] })
        merged.schemaVersion = 3
        if (value.feedbackSound === undefined)
          merged.feedbackSound = value.soundEnabled === undefined ? true : Boolean(value.soundEnabled)
        else merged.feedbackSound = Boolean(value.feedbackSound)
        merged.countdownSound = Boolean(merged.countdownSound)
        merged.soundVolume = Math.max(0, Math.min(1, Number(merged.soundVolume)))
        if (previousSchema === 2 && Math.abs(merged.soundVolume - 0.3) < 0.001)
          merged.soundVolume = 0.6
        root.settings = merged
        root.settingsCorrupt = false
        if (previousSchema !== merged.schemaVersion)
          Qt.callLater(function() { root.saveSettings() })
      } else {
        root.settingsCorrupt = true
      }
    } catch (error) {
      root.settingsCorrupt = String(raw || "").trim() !== ""
      console.warn("Keycade settings parse failed:", error)
    }
    root.settingsLoaded = true
    root.updateReady()
  }

  function loadSession(raw) {
    var text = String(raw || "").trim()
    root.session = null
    if (text) {
      try {
        var value = JSON.parse(text)
        if (value.schemaVersion !== 1 || !Array.isArray(value.cards))
          throw new Error("unsupported session schema")
        root.session = value
      } catch (error) {
        console.warn("Keycade session ignored:", error)
      }
    }
    root.sessionLoaded = true
    root.updateReady()
  }

  function saveStats() {
    var payload = JSON.stringify(root.stats, null, 2) + "\n"
    if (root.statsCorrupt) {
      root.pendingStats = payload
      quarantineStats.command = ["mv", "--", root.statsPath, root.statsPath + ".corrupt-" + Date.now()]
      quarantineStats.running = true
    } else statsFile.setText(payload)
  }

  function saveSettings() {
    var payload = JSON.stringify(root.settings, null, 2) + "\n"
    if (root.settingsCorrupt) {
      root.pendingSettings = payload
      quarantineSettings.command = ["mv", "--", root.settingsPath, root.settingsPath + ".corrupt-" + Date.now()]
      quarantineSettings.running = true
    } else settingsFile.setText(payload)
  }

  function saveSession(value) {
    root.session = value
    sessionFile.setText(JSON.stringify(value, null, 2) + "\n")
  }

  function clearSession() {
    root.session = null
    sessionFile.setText("")
  }

  Component.onCompleted: ensureDir.running = true

  Process {
    id: ensureDir
    command: ["mkdir", "-p", root.stateDir]
    onExited: {
      statsFile.reload()
      settingsFile.reload()
      sessionFile.reload()
    }
  }

  Process {
    id: quarantineStats
    onExited: {
      root.statsCorrupt = false
      statsFile.setText(root.pendingStats)
      root.pendingStats = ""
    }
  }

  Process {
    id: quarantineSettings
    onExited: {
      root.settingsCorrupt = false
      settingsFile.setText(root.pendingSettings)
      root.pendingSettings = ""
    }
  }

  FileView {
    id: statsFile
    path: root.statsPath
    atomicWrites: true
    printErrors: false
    onLoaded: root.loadStats(text())
    onLoadFailed: root.loadStats("")
  }

  FileView {
    id: settingsFile
    path: root.settingsPath
    atomicWrites: true
    printErrors: false
    onLoaded: root.loadSettings(text())
    onLoadFailed: root.loadSettings("")
  }

  FileView {
    id: sessionFile
    path: root.sessionPath
    atomicWrites: true
    printErrors: false
    onLoaded: root.loadSession(text())
    onLoadFailed: root.loadSession("")
  }
}
