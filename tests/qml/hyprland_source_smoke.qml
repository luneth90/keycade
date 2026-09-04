import QtQuick
import Quickshell
import "lib/sources"

ShellRoot {
  id: root

  // Synthetic checks drive acceptLine() directly and must not be mistaken
  // for the single live helper run that follows them.
  property bool liveMode: false

  function binding(overrides) {
    var result = {
      type: "binding",
      modMask: 64,
      key: "K",
      keycode: 0,
      matchMode: "logical",
      flags: [],
      dontInhibit: false,
      allowInputCapture: false,
      dispatcher: "exec",
      arg: "terminal",
      description: "Open terminal",
      submap: ""
    }
    Object.keys(overrides || {}).forEach(function(key) { result[key] = overrides[key] })
    return JSON.stringify(result)
  }

  function header(count, rejected, overrides) {
    var result = {
      schemaVersion: 1,
      type: "header",
      keymapFingerprint: "a".repeat(64),
      appleKeyboard: false,
      rejected: rejected,
      count: count,
      keymapSource: "none",
      keycodeMap: {}
    }
    Object.keys(overrides || {}).forEach(function(key) { result[key] = overrides[key] })
    return JSON.stringify(result)
  }

  function reset() {
    source.keycodeMap = ({})
    source.keymapSource = "none"
    source.bindings = []
    source.error = ""
    source.rejected = 0
    source.pendingBindings = []
    source.pendingHeader = null
    source.streamChars = 0
    source.streamRecords = 0
    source.streamSettled = false
  }

  function require(condition, message) {
    if (!condition) throw new Error(message)
  }

  function runChecks() {
    try {
      // A header declaring zero records settles immediately.
      root.reset()
      source.acceptLine(root.header(0, 2))
      root.require(source.error === "" && source.bindings.length === 0
                   && source.rejected === 2, "bounded rejected count was not accepted")

      // A complete stream is adopted only once its declared count arrives.
      root.reset()
      source.acceptLine(root.header(1, 0))
      root.require(source.bindings.length === 0, "model was adopted before the stream completed")
      source.acceptLine(root.binding({}))
      root.require(source.bindings.length === 1 && source.bindings[0].key === "K",
                   "valid model was not adopted")

      // A malformed record must not partially replace an adopted model.
      var adopted = source.bindings
      root.reset()
      source.bindings = adopted
      source.acceptLine(root.header(1, 0))
      source.acceptLine(root.binding({ flags: ["future-flag"] }))
      root.require(source.error.length > 0 && source.bindings === adopted,
                   "unknown flag was accepted or clobbered the adopted model")

      root.reset()
      source.acceptLine(root.header(1, 0))
      source.acceptLine(root.binding({ dontInhibit: "false" }))
      root.require(source.error.length > 0 && source.bindings.length === 0,
                   "non-boolean safety flag was accepted")

      // Records before a header, duplicate headers and overruns are refused.
      root.reset()
      source.acceptLine(root.binding({}))
      root.require(source.error.length > 0, "record before header was accepted")

      root.reset()
      source.acceptLine(root.header(1, 0))
      source.acceptLine(root.header(1, 0))
      root.require(source.error.length > 0, "duplicate header was accepted")

      root.reset()
      source.acceptLine(root.header(1, 0))
      source.acceptLine(root.binding({}))
      source.acceptLine(root.binding({}))
      root.require(source.error.length > 0 || source.bindings.length === 1,
                   "record beyond the declared count was accepted")

      // An oversized single record is refused while reading, not afterwards.
      root.reset()
      source.acceptLine(root.header(1, 0))
      source.acceptLine("x".repeat(source.maxRecordChars + 1))
      root.require(source.error.length > 0 && source.bindings.length === 0,
                   "oversized record was accepted")

      // A valid keycode map is adopted with the rest of the header.
      root.reset()
      source.acceptLine(root.header(0, 0, { keymapSource: "global-rmlvo", keycodeMap: { ",": [59] } }))
      root.require(source.keymapAuthoritative && source.keycodeMap[","][0] === 59,
                   "valid keycode map was not adopted")
      root.require(source.keycodeMap["__proto__"] === undefined,
                   "keycode map was not built on a null prototype")

      // A malformed map degrades judging instead of failing the snapshot.
      var badMaps = [
        { keymapSource: "global-rmlvo", keycodeMap: [] },
        { keymapSource: "global-rmlvo", keycodeMap: { ",": [] } },
        { keymapSource: "global-rmlvo", keycodeMap: { ",": [70000] } },
        { keymapSource: "global-rmlvo", keycodeMap: { ",": "59" } },
        { keymapSource: "global-rmlvo", keycodeMap: { "__proto__": [59] } },
        { keymapSource: "unexpected", keycodeMap: { ",": [59] } }
      ]
      for (var i = 0; i < badMaps.length; i++) {
        root.reset()
        source.acceptLine(root.header(0, 0, badMaps[i]))
        root.require(source.error === "" && !source.keymapAuthoritative,
                     "malformed keycode map " + i + " was adopted or failed the snapshot")
      }

      // The session HOME is only forwarded when it is a plain absolute path,
      // as one token so a value shaped like an option cannot be parsed as one.
      var homeArguments = source.sessionHomeArguments()
      root.require(homeArguments.length === 1
                   && homeArguments[0].indexOf("--session-home=") === 0,
                   "session home was not passed as a single token")

      // A helper-reported error line surfaces as a failure.
      root.reset()
      source.acceptLine(JSON.stringify({ schemaVersion: 1, type: "error", error: "boom" }))
      root.require(source.error.length > 0, "helper error line was ignored")

      root.reset()
      root.liveMode = true
      liveRun.start()
    } catch (error) {
      console.error("HYPRLAND_SOURCE_SMOKE_FAILED: " + error)
      Qt.quit()
    }
  }

  // Drive the real helper once so the absolute interpreter path, the cleared
  // child environment and the incremental parser are all exercised together.
  function checkLiveRun() {
    if (!root.liveMode) return
    try {
      // Without a compositor the helper cannot reach hyprctl; the run still
      // has to terminate cleanly through the same transport.
      if (Quickshell.env("KEYCADE_SMOKE_EXPECT_LIVE") === "1") {
        root.require(source.error === "", "live helper run failed: " + source.error)
        root.require(source.bindings.length > 0, "live helper run produced no bindings")
        root.require(/^[0-9a-f]{64}$/.test(source.fingerprint), "live run produced no fingerprint")
        if (Quickshell.env("KEYCADE_SMOKE_EXPECT_DEGRADED") === "1") {
          // The session names an XKB source of its own, so the compositor's
          // keymap cannot be reproduced and judging must fall back.
          root.require(!source.keymapAuthoritative,
                       "an overridden XKB environment was not reported")
          root.require(Object.keys(source.keycodeMap).length === 0,
                       "a keycode map was published for an overridden environment")
        } else {
          root.require(source.keymapAuthoritative, "live helper run produced no keymap")
          root.require(Object.keys(source.keycodeMap).length > 0, "live keycode map was empty")
        }
      } else {
        root.require(!source.loading, "live helper run never settled")
      }
      console.log("HYPRLAND_SOURCE_SMOKE_OK")
    } catch (error) {
      console.error("HYPRLAND_SOURCE_SMOKE_FAILED: " + error)
    }
    Qt.quit()
  }

  HyprlandSource {
    id: source
    onLoaded: root.checkLiveRun()
    onFailed: root.checkLiveRun()
  }

  Timer {
    id: liveRun
    interval: 10
    repeat: false
    onTriggered: source.refresh()
  }

  Timer {
    interval: 50
    running: true
    repeat: false
    onTriggered: root.runChecks()
  }

  Timer {
    interval: 8000
    running: true
    repeat: false
    onTriggered: {
      console.error("HYPRLAND_SOURCE_SMOKE_FAILED: timeout")
      Qt.quit()
    }
  }
}
