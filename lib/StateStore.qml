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

  property var stats: Stats.defaults()
  property var settings: ({ schemaVersion: 1, locale: "en", reducedMotion: false })
  property bool ready: false
  property bool statsCorrupt: false
  property bool settingsCorrupt: false
  property string pendingStats: ""
  property string pendingSettings: ""

  function loadStats(raw) {
    var text = String(raw || "").trim()
    if (!text) {
      root.stats = Stats.defaults()
      root.statsCorrupt = false
    } else {
      try {
        var value = JSON.parse(text)
        if (!Stats.valid(value)) throw new Error("unsupported stats schema")
        root.stats = value
        root.statsCorrupt = false
      } catch (error) {
        root.stats = Stats.defaults()
        root.statsCorrupt = true
        console.warn("Keycade stats quarantined on next save:", error)
      }
    }
    root.ready = true
  }

  function loadSettings(raw) {
    try {
      var value = JSON.parse(String(raw || ""))
      if (value.schemaVersion === 1) {
        root.settings = value
        root.settingsCorrupt = false
      } else {
        root.settingsCorrupt = true
      }
    } catch (error) {
      root.settingsCorrupt = String(raw || "").trim() !== ""
      console.warn("Keycade settings parse failed:", error)
    }
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

  Component.onCompleted: ensureDir.running = true

  Process {
    id: ensureDir
    command: ["mkdir", "-p", root.stateDir]
    onExited: {
      statsFile.reload()
      settingsFile.reload()
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
  }
}
