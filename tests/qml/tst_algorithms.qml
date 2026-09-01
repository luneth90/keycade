import QtQuick
import QtTest
import "../../lib/InputNormalizer.js" as Normalizer
import "../../lib/Eligibility.js" as Eligibility
import "../../lib/Scheduler.js" as Scheduler
import "../../lib/Stats.js" as Stats
import "../../lib/Categorizer.js" as Categorizer

TestCase {
  name: "KeycadeAlgorithms"

  function binding(overrides) {
    var base = {
      modMask: 64,
      key: "3",
      keycode: 0,
      matchMode: "logical",
      flags: [],
      dontInhibit: false,
      allowInputCapture: false,
      dispatcher: "workspace",
      arg: "3",
      description: "Switch to workspace 3",
      submap: ""
    }
    for (var key in overrides) base[key] = overrides[key]
    return base
  }

  function test_logicalAndPhysicalMatching() {
    verify(Normalizer.matches(binding({}), { modMask: 64, logicalKey: "3", physicalCode: 12 }))
    verify(!Normalizer.matches(binding({}), { modMask: 65, logicalKey: "3", physicalCode: 12 }))
    verify(Normalizer.matches(binding({ key: "", keycode: 12, matchMode: "physical" }),
                              { modMask: 64, logicalKey: "4", physicalCode: 12 }))
  }

  function test_appleDeleteAcceptsBackspaceOneWay() {
    var deleteBinding = binding({ key: "DELETE", description: "Close all windows" })
    var backspaceInput = { modMask: 64, logicalKey: "BACKSPACE", physicalCode: 22 }
    verify(!Normalizer.matches(deleteBinding, backspaceInput))
    verify(Normalizer.matches(deleteBinding, backspaceInput, { appleKeyboard: true }))

    var backspaceBinding = binding({ key: "BACKSPACE", description: "Toggle window transparency" })
    var deleteInput = { modMask: 64, logicalKey: "DELETE", physicalCode: 119 }
    verify(!Normalizer.matches(backspaceBinding, deleteInput, { appleKeyboard: true }))

    var ambiguous = Eligibility.filter([deleteBinding, backspaceBinding], { appleKeyboard: true })
    compare(ambiguous.eligible.length, 0)
    compare(ambiguous.excluded.length, 2)
  }

  function test_tabAndBacktabNormalization() {
    var tab = Normalizer.normalizeEvent({
      key: 0x01000001,
      text: "\t",
      modifiers: 0x08000000,
      nativeScanCode: 23,
      isAutoRepeat: false
    })
    compare(tab.logicalKey, "TAB")
    compare(tab.modMask, 8)
    verify(Normalizer.matches(binding({
      modMask: 8,
      key: "TAB",
      dispatcher: "movefocus",
      arg: "next",
      description: "Focus on next window"
    }), tab))

    var backtab = Normalizer.normalizeEvent({
      key: 0x01000002,
      text: "",
      modifiers: 0x0a000000,
      nativeScanCode: 23,
      isAutoRepeat: false
    })
    compare(backtab.logicalKey, "TAB")
    compare(backtab.modMask, 9)
    verify(Normalizer.matches(binding({
      modMask: 9,
      key: "TAB",
      dispatcher: "movefocus",
      arg: "previous",
      description: "Focus on previous window"
    }), backtab))

    var macbookUnknownTab = Normalizer.normalizeEvent({
      key: 0x01ffffff,
      text: "\t",
      modifiers: 0x10000000,
      nativeScanCode: 23,
      isAutoRepeat: false
    })
    compare(macbookUnknownTab.logicalKey, "TAB")
    compare(macbookUnknownTab.modMask, 64)
    verify(Normalizer.matches(binding({
      modMask: 64,
      key: "TAB",
      dispatcher: "workspace",
      arg: "m+1",
      description: "Next workspace"
    }), macbookUnknownTab))

    var macbookUnknownBacktab = Normalizer.normalizeEvent({
      key: 0x01ffffff,
      text: "",
      modifiers: 0x12000000,
      nativeScanCode: 23,
      isAutoRepeat: false
    })
    compare(macbookUnknownBacktab.logicalKey, "TAB")
    compare(macbookUnknownBacktab.modMask, 65)
    verify(Normalizer.matches(binding({
      modMask: 65,
      key: "TAB",
      dispatcher: "workspace",
      arg: "m-1",
      description: "Previous workspace"
    }), macbookUnknownBacktab))

    compare(Normalizer.logicalKey({
      key: 0,
      text: "",
      nativeScanCode: 15
    }), "TAB")
  }

  function test_specialKeyNormalization() {
    compare(Normalizer.logicalKey({ key: 0x01000003 }), "BACKSPACE")
    compare(Normalizer.logicalKey({ key: 0x01000007 }), "DELETE")
    compare(Normalizer.logicalKey({ key: 0x0100003b }), "F12")
    compare(Normalizer.logicalKey({ key: 0x01000072 }), "XF86AUDIORAISEVOLUME")
    compare(Normalizer.logicalKey({ key: 0x010000b3 }), "XF86MONBRIGHTNESSDOWN")
  }

  function test_shiftedSymbolsNormalizeToBaseKeys() {
    var slash = Normalizer.normalizeEvent({
      key: 0x3f,
      text: "?",
      modifiers: 0x12000000,
      nativeScanCode: 61,
      isAutoRepeat: false
    })
    compare(slash.logicalKey, "/")
    compare(slash.modMask, 65)
    verify(Normalizer.matches(binding({
      modMask: 65,
      key: "/",
      dispatcher: "exec",
      arg: "passwords",
      description: "Passwords"
    }), slash))

    compare(Normalizer.logicalKey({ key: 0x2b, text: "+", modifiers: 0x02000000 }), "=")
    compare(Normalizer.logicalKey({ key: 0x3a, text: ":", modifiers: 0x02000000 }), ";")
    compare(Normalizer.logicalKey({ key: 0x3f, text: "?", modifiers: 0 }), "?")
  }

  function test_builtinShortcutCategories() {
    compare(Categorizer.category(binding({ description: "Close window", dispatcher: "__lua" })), "windows")
    compare(Categorizer.category(binding({ description: "Switch to workspace 3", dispatcher: "__lua" })), "workspaces")
    compare(Categorizer.category(binding({ description: "Lock system", dispatcher: "__lua" })), "system")
    compare(Categorizer.category(binding({ description: "Brightness up", dispatcher: "__lua" })), "system")
    compare(Categorizer.category(binding({ description: "Browser", dispatcher: "__lua" })), "applications")
    compare(Categorizer.category(binding({ description: "Volume up", dispatcher: "__lua" })), "media")
    compare(Categorizer.category(binding({ description: "Screenshot Region", dispatcher: "__lua" })), "capture")
    compare(Categorizer.category(binding({ description: "Clipboard manager", dispatcher: "__lua" })), "utilities")
  }

  function test_eligibilityRejectsAmbiguousAndBypassingBindings() {
    var duplicate = binding({ description: "Another action" })
    var result = Eligibility.filter([binding({}), duplicate], {})
    compare(result.eligible.length, 0)
    compare(result.excluded.length, 2)

    result = Eligibility.filter([binding({ dontInhibit: true })], {})
    compare(result.eligible.length, 0)

    result = Eligibility.filter([
      binding({ key: "L", description: "Lock system", dispatcher: "__lua" }),
      binding({ key: "B", description: "Browser", dispatcher: "__lua" })
    ], {})
    compare(result.eligible.length, 2)
    compare(result.eligible[0].category, "system")
    compare(result.eligible[1].category, "applications")
  }

  function test_eligibilityRejectsDeviceSpecialKeys() {
    var specialBindings = [
      binding({ key: "F1", description: "Help" }),
      binding({ key: "F12", description: "Screenshot Display" }),
      binding({ key: "XF86AUDIORAISEVOLUME", modMask: 0, description: "Volume up" }),
      binding({ key: "XF86MONBRIGHTNESSDOWN", modMask: 0, description: "Brightness down" }),
      binding({ key: "PRINT", description: "Screenshot" }),
      binding({ key: "", keycode: 201, matchMode: "physical", description: "Hardware menu" })
    ]
    for (var i = 0; i < specialBindings.length; i++) {
      compare(Eligibility.reason(specialBindings[i]), "device-special-key")
    }

    compare(Eligibility.reason(binding({ key: "TAB", description: "Next workspace" })), "")
    compare(Eligibility.reason(binding({ key: "DELETE", description: "Close all windows" })), "")
    compare(Eligibility.reason(binding({ key: "LEFT", description: "Focus left window" })), "")
  }

  function test_guidedAttemptsDoNotAffectMasteryWindow() {
    var stats = Stats.defaults()
    Stats.record(stats, "one", true, 900, true)
    compare(Stats.metrics(stats.bindings.one).samples, 0)
    Stats.record(stats, "one", true, 1000, false)
    Stats.record(stats, "one", false, -1, false)
    compare(Stats.metrics(stats.bindings.one).samples, 2)
    compare(Stats.metrics(stats.bindings.one).accuracy, 0.5)
    stats.bindings.one.forceGuided = true
    compare(Stats.tier(stats.bindings.one), "guided")
  }

  function test_schedulerCapsEachBindingPerWaveAndAvoidsRepeats() {
    var bindings = []
    for (var index = 0; index < 8; index++) {
      var item = binding({ key: String(index), arg: String(index), description: "Switch to workspace " + index })
      item.id = Normalizer.bindingId(item)
      bindings.push(item)
    }
    var deck = Scheduler.build(bindings, Stats.defaults(), 24)
    compare(deck.length, 24)
    for (var i = 1; i < deck.length; i++) verify(deck[i].binding.id !== deck[i - 1].binding.id)
    for (var wave = 1; wave <= 3; wave++) {
      var counts = {}
      for (var j = (wave - 1) * 8; j < wave * 8; j++) {
        var id = deck[j].binding.id
        counts[id] = Number(counts[id] || 0) + 1
      }
      for (var id in counts) verify(counts[id] <= 2)
    }
  }

  function test_schedulerBalancesCategoriesPerWave() {
    var categories = ["windows", "workspaces", "system", "applications"]
    var bindings = []
    for (var categoryIndex = 0; categoryIndex < categories.length; categoryIndex++) {
      for (var itemIndex = 0; itemIndex < 2; itemIndex++) {
        var item = binding({
          key: String(categoryIndex * 2 + itemIndex),
          arg: String(categoryIndex * 2 + itemIndex),
          description: categories[categoryIndex] + " " + itemIndex
        })
        item.category = categories[categoryIndex]
        item.id = Normalizer.bindingId(item)
        bindings.push(item)
      }
    }
    var deck = Scheduler.build(bindings, Stats.defaults(), 8)
    var counts = {}
    for (var i = 0; i < deck.length; i++) {
      var name = deck[i].binding.category
      counts[name] = Number(counts[name] || 0) + 1
    }
    for (var j = 0; j < categories.length; j++) compare(counts[categories[j]], 2)
  }
}
