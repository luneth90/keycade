import QtQuick
import QtTest
import "../../lib/InputNormalizer.js" as Normalizer
import "../../lib/Eligibility.js" as Eligibility
import "../../lib/Scheduler.js" as Scheduler
import "../../lib/Stats.js" as Stats
import "../../lib/Categorizer.js" as Categorizer
import "../../lib/ActionLocalizer.js" as Actions
import "../../lib/Session.js" as Session

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

  function test_spaceNormalization() {
    var space = Normalizer.normalizeEvent({
      key: 0x20,
      text: " ",
      modifiers: 0x14000000,
      nativeScanCode: 65,
      isAutoRepeat: false
    })
    compare(space.logicalKey, "SPACE")
    compare(space.modMask, 68)
    compare(Normalizer.canonicalKey(" "), "SPACE")
    verify(Normalizer.matches(binding({
      modMask: 68,
      key: "SPACE",
      dispatcher: "exec",
      arg: "background-switcher",
      description: "Background switcher"
    }), space))
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
      binding({ key: "HOME", description: "Save window width" }),
      binding({ key: "END", description: "Go to end" }),
      binding({ key: "INSERT", description: "Insert mode" }),
      binding({ key: "PAGEUP", description: "Page up" }),
      binding({ key: "PAGEDOWN", description: "Page down" }),
      binding({ key: "", keycode: 201, matchMode: "physical", description: "Hardware menu" })
    ]
    for (var i = 0; i < specialBindings.length; i++) {
      compare(Eligibility.reason(specialBindings[i]), "device-special-key")
    }

    compare(Eligibility.reason(binding({ key: "TAB", description: "Next workspace" })), "")
    compare(Eligibility.reason(binding({ key: "DELETE", description: "Close all windows" })), "")
    compare(Eligibility.reason(binding({ key: "LEFT", description: "Focus left window" })), "")
  }

  function test_guidedInputDoesNotAffectFirstTryWindow() {
    var stats = Stats.defaults()
    Stats.recordGuided(stats, "one", 1, 1000)
    compare(Stats.metrics(stats.bindings.one).samples, 0)
    Stats.recordFirstTry(stats, "one", true, 1000, 1, 2000)
    Stats.recordFirstTry(stats, "one", false, -1, 1, 3000)
    compare(Stats.metrics(stats.bindings.one).samples, 2)
    compare(Stats.metrics(stats.bindings.one).accuracy, 0.5)
    Stats.requestGuidance(stats, "one")
    compare(Stats.tier(stats.bindings.one), "guided")
  }

  function test_masteryRequiresTwoRecentCorrectAcrossTwoRunsAndLapses() {
    var sameRun = Stats.defaults()
    Stats.recordGuided(sameRun, "same-run", 1, 1000)
    Stats.recordFirstTry(sameRun, "same-run", true, 900, 1, 2000)
    Stats.recordFirstTry(sameRun, "same-run", true, 850, 1, 3000)
    compare(sameRun.bindings["same-run"].state, "learning")

    var stats = Stats.defaults()
    Stats.recordGuided(stats, "one", 1, 1000)
    Stats.recordFirstTry(stats, "one", true, 900, 1, 2000)
    compare(stats.bindings.one.state, "learning")
    var result = Stats.recordFirstTry(stats, "one", true, 800, 2, 4000)
    verify(result.masteredGained)
    compare(stats.bindings.one.state, "mastered")
    compare(stats.bindings.one.successfulRuns.length, 2)

    result = Stats.recordFirstTry(stats, "one", false, -1, 3, 8000)
    verify(result.lapsed)
    compare(stats.bindings.one.state, "learning")
    compare(stats.bindings.one.lapseCount, 1)

    Stats.recordFirstTry(stats, "one", true, 700, 4, 9000)
    compare(stats.bindings.one.state, "learning")
    result = Stats.recordFirstTry(stats, "one", true, 660, 5, 11000)
    verify(result.masteredGained)
    compare(stats.bindings.one.state, "mastered")
  }

  function test_migrationPromotesLearningProgressUnderTheEasierRule() {
    var stats = Stats.migrate({
      schemaVersion: 3,
      runs: 3,
      bindings: {
        one: {
          state: "learning",
          guidedCompleted: true,
          firstTryAttempts: 3,
          firstTryCorrect: 3,
          recentFirstTry: [true, true, true],
          successfulRuns: [1, 2, 3]
        }
      }
    })
    compare(stats.bindings.one.state, "mastered")
  }

  function test_reactionHistoryKeepsOnlyTheLatestTenSamples() {
    var stats = Stats.defaults()
    Stats.recordGuided(stats, "timed", 1, 100)
    for (var index = 0; index < 12; index++)
      Stats.recordFirstTry(stats, "timed", true, 500 + index * 10, index + 1, 200 + index)
    compare(stats.bindings.timed.reactions.length, 10)
    compare(stats.bindings.timed.reactions[0], 520)
    compare(stats.bindings.timed.reactions[9], 610)
    compare(Stats.percentile75(stats.bindings.timed.reactions), 590)
  }

  function test_lifetimeSummaryAndFirstMasteryMilestone() {
    var stats = Stats.defaults()
    Stats.recordGuided(stats, "first", 1, 100)
    Stats.recordFirstTry(stats, "first", true, 500, 1, 200)
    Stats.recordFirstTry(stats, "first", false, -1, 2, 300)
    Stats.recordGuided(stats, "second", 1, 100)
    Stats.recordFirstTry(stats, "second", true, 900, 1, 200)

    var summary = Stats.aggregate(stats, [{ id: "first" }, { id: "second" }])
    compare(summary.attempts, 3)
    compare(summary.correct, 2)
    compare(summary.accuracy, 67)
    compare(summary.response, 900)

    verify(Stats.noteFirstMastery(stats, 12345, 7))
    compare(stats.firstMasteryAt, 12345)
    compare(stats.firstMasteryRun, 7)
    verify(!stats.firstMasteryCelebrated)
    verify(!Stats.noteFirstMastery(stats, 23456, 8))
    verify(Stats.markFirstMasteryCelebrated(stats))
    verify(!Stats.markFirstMasteryCelebrated(stats))

    compare(Stats.addTrainingTime(stats, 654321), 654321)
    compare(Stats.addTrainingTime(stats, -10), 654321)
    var migrated = Stats.migrate(stats)
    compare(migrated.schemaVersion, 3)
    compare(migrated.totalTrainingMs, 654321)
    compare(migrated.firstMasteryAt, 12345)
    compare(migrated.firstMasteryRun, 7)
    verify(migrated.firstMasteryCelebrated)
  }

  function test_v1StatsMigrateWithoutInventingMastery() {
    var migrated = Stats.migrate({
      schemaVersion: 1,
      runs: 9,
      bestScore: 5000,
      bindings: {
        one: {
          attempts: [
            { correct: true, guided: true, at: 1, reactionMs: 900 },
            { correct: true, guided: false, at: 2, reactionMs: 800 },
            { correct: false, guided: false, at: 3 }
          ],
          hits: 2,
          misses: 1,
          guidedHits: 1,
          lastSeen: 3
        }
      }
    })
    compare(migrated.schemaVersion, 3)
    compare(migrated.runs, 9)
    compare(migrated.totalTrainingMs, 0)
    compare(migrated.firstMasteryAt, 0)
    verify(!migrated.firstMasteryCelebrated)
    compare(migrated.bindings.one.state, "learning")
    compare(migrated.bindings.one.firstTryAttempts, 2)
    compare(migrated.bindings.one.firstTryCorrect, 1)
    compare(migrated.bindings.one.successfulRuns.length, 0)
  }

  function test_v2StatsPreserveProgressAndGainMilestoneDefaults() {
    var migrated = Stats.migrate({
      schemaVersion: 2,
      runs: 12,
      coverageCursor: 8,
      bindings: {
        one: {
          state: "mastered",
          guidedCompleted: true,
          firstTryAttempts: 6,
          firstTryCorrect: 5,
          recentFirstTry: [true, true, true, true, true],
          reactions: [700, 650],
          successfulRuns: [8, 10, 12],
          lastSuccessfulRun: 12
        }
      }
    })
    compare(migrated.schemaVersion, 3)
    compare(migrated.runs, 12)
    compare(migrated.coverageCursor, 8)
    compare(migrated.bindings.one.state, "mastered")
    compare(migrated.bindings.one.firstTryCorrect, 5)
    compare(migrated.totalTrainingMs, 0)
    compare(migrated.firstMasteryAt, 0)
    compare(migrated.firstMasteryRun, 0)
    verify(!migrated.firstMasteryCelebrated)
  }

  function test_schedulerSpreadsRepeatedBindingsAndAvoidsAdjacentRepeats() {
    var bindings = []
    for (var index = 0; index < 8; index++) {
      var item = binding({ key: String(index), arg: String(index), description: "Switch to workspace " + index })
      item.id = Normalizer.bindingId(item)
      bindings.push(item)
    }
    var deck = Scheduler.build(bindings, Stats.defaults(), 24)
    compare(deck.length, 24)
    for (var i = 1; i < deck.length; i++) verify(deck[i].binding.id !== deck[i - 1].binding.id)
    var counts = {}
    for (var j = 0; j < deck.length; j++)
      counts[deck[j].binding.id] = Number(counts[deck[j].binding.id] || 0) + 1
    for (var id in counts) compare(counts[id], 3)
  }

  function test_schedulerBalancesCategoriesAcrossTheRun() {
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

  function test_schedulerKeepsCoverageMovingWithAllQueuesPopulated() {
    var stats = Stats.defaults()
    var bindings = []
    var now = 1000000
    for (var index = 0; index < 60; index++) {
      var item = binding({
        key: String(index),
        arg: String(index),
        description: "Shortcut " + index
      })
      item.id = "binding-" + String(index).padStart(2, "0")
      item.category = ["windows", "workspaces", "system", "applications"][index % 4]
      bindings.push(item)
      if (index >= 30 && index < 40) {
        Stats.recordGuided(stats, item.id, 1, now - 100)
        stats.bindings[item.id].dueRun = 1
      } else if (index >= 40 && index < 50) {
        Stats.recordGuided(stats, item.id, 1, now - 100)
        stats.bindings[item.id].dueRun = 99
      } else if (index >= 50) {
        var mastered = Stats.entry(stats, item.id)
        mastered.guidedCompleted = true
        mastered.state = "mastered"
        mastered.dueAt = now + 86400000
      }
    }

    var seen = {}
    for (var run = 1; run <= 5; run++) {
      var deck = Scheduler.build(bindings, stats, 24, { now: now, runId: run })
      var unseenCards = deck.filter(function(card) { return card.queue === "unseen" })
      compare(unseenCards.length, 6)
      unseenCards.forEach(function(card) {
        seen[card.binding.id] = true
        Scheduler.markCovered(bindings, stats, card.binding.id)
        Stats.recordGuided(stats, card.binding.id, run, now)
        stats.bindings[card.binding.id].dueRun = 99
      })
    }
    compare(Object.keys(seen).length, 30)
  }

  function test_schedulerOnlyAdvancesCoverageAfterCardIsShown() {
    var stats = Stats.defaults()
    var bindings = []
    for (var index = 0; index < 10; index++) {
      var item = binding({ key: String(index), arg: String(index), description: "New " + index })
      item.id = "new-" + index
      bindings.push(item)
    }
    var deck = Scheduler.build(bindings, stats, 8, { now: 100, runId: 1 })
    compare(stats.coverageCursor, 0)
    Scheduler.markCovered(bindings, stats, deck[0].binding.id)
    verify(stats.coverageCursor !== 0)
  }

  function test_schedulerPrioritizesDueBeforeMaintenance() {
    var stats = Stats.defaults()
    var bindings = []
    for (var index = 0; index < 24; index++) {
      var item = binding({ key: String(index), arg: String(index), description: "Item " + index })
      item.id = "item-" + index
      bindings.push(item)
      var progress = Stats.entry(stats, item.id)
      progress.guidedCompleted = true
      progress.state = "mastered"
      progress.dueAt = index < 10 ? 1 : 999999999
    }
    var deck = Scheduler.build(bindings, stats, 10, { now: 100, runId: 1 })
    compare(deck.filter(function(card) { return card.queue === "due" }).length, 10)
    compare(deck.filter(function(card) { return card.queue === "maintenance" }).length, 0)
  }

  function test_remedialReviewIsInsertedAfterThreeToFiveOtherCards() {
    var stats = Stats.defaults()
    var bindings = []
    for (var index = 0; index < 8; index++) {
      var item = binding({ key: String(index), arg: String(index), description: "Review " + index })
      item.id = "review-" + index
      bindings.push(item)
    }
    var deck = Scheduler.build(bindings, stats, 8, { now: 100, runId: 1 })
    var updated = Scheduler.insertRemedial(deck, 1, deck[1].binding)
    compare(updated.length, 8)
    var remedialIndex = updated.findIndex(function(card) {
      return card.remedial && card.binding.id === deck[1].binding.id
    })
    verify(remedialIndex - 1 - 1 >= 3)
    verify(remedialIndex - 1 - 1 <= 5)

    var late = Scheduler.insertRemedial(deck, 7, deck[7].binding)
    compare(late.length, 8)
    compare(late.filter(function(card) { return card.remedial }).length, 0)
  }

  function test_remedialReviewNeverExtendsTheRunNearTheEnd() {
    var deck = []
    for (var index = 0; index < 24; index++) {
      var item = binding({ key: String(index), arg: String(index), description: "Card " + index })
      item.id = "fixed-" + index
      deck.push({ binding: item, tier: "learning", queue: "weak", remedial: false })
    }
    var updated = Scheduler.insertRemedial(deck, 21, deck[21].binding)
    compare(updated.length, 24)
    compare(updated.filter(function(card) { return card.remedial }).length, 0)
  }

  function test_remedialReviewReplacesTheLowestPriorityFutureSlot() {
    var deck = []
    for (var index = 0; index < 8; index++) {
      var item = binding({ key: String(index), arg: String(index), description: "Priority " + index })
      item.id = "priority-" + index
      deck.push({
        binding: item,
        tier: index === 6 ? "maintenance" : "learning",
        queue: index === 6 ? "maintenance" : "due",
        remedial: false
      })
    }
    var updated = Scheduler.insertRemedial(deck, 0, deck[0].binding)
    compare(updated.length, 8)
    verify(updated[6].remedial)
    compare(updated[6].binding.id, deck[0].binding.id)
    compare(updated[4].queue, "due")
    compare(updated[5].queue, "due")
  }

  function test_runPlanCountsDistinctNewAndReviewBindings() {
    var first = binding({ key: "1", arg: "1", description: "First" })
    first.id = "first-plan"
    var second = binding({ key: "2", arg: "2", description: "Second" })
    second.id = "second-plan"
    var counts = Scheduler.planCounts([
      { binding: first, tier: "guided", queue: "unseen", remedial: false },
      { binding: first, tier: "guided", queue: "unseen", remedial: false },
      { binding: second, tier: "learning", queue: "due", remedial: false }
    ])
    compare(counts.added, 1)
    compare(counts.review, 1)
  }

  function test_savedSessionRestoresRemainingCardsAndCorrection() {
    var first = binding({ key: "1", arg: "1", description: "First" })
    first.id = "first"
    var second = binding({ key: "2", arg: "2", description: "Second" })
    second.id = "second"
    var deck = [
      { binding: first, tier: "learning", queue: "due", remedial: false },
      { binding: second, tier: "learning", queue: "remedial", remedial: true }
    ]
    var cards = Session.cardsFrom(deck, 1)
    compare(cards.length, 1)
    compare(cards[0].bindingId, "second")
    verify(cards[0].remedial)
    var saved = { schemaVersion: 1, runId: 4, cards: cards, correctionRequired: true }
    verify(Session.canResume(saved, 4, [first, second], 24))
    verify(!Session.canResume(saved, 5, [first, second]))
    saved.offset = 24
    verify(!Session.canResume(saved, 4, [first, second], 24))
    var restored = Session.restoreCards(cards, [first, second])
    compare(restored.length, 1)
    compare(restored[0].binding.id, "second")
    verify(restored[0].remedial)
  }

  function test_builtinActionsHaveLocaleKeysAndCustomTextStaysRaw() {
    compare(Actions.translation(binding({ description: "Close window" })).key, "action_closeWindow")
    var workspace = Actions.translation(binding({ description: "Switch to workspace 3" }))
    compare(workspace.key, "action_switchWorkspace")
    compare(workspace.values.workspace, "3")
    compare(Actions.translation(binding({ description: "My custom backup script", dispatcher: "__lua" })), null)
    var chinese = {
      messages: { action_closeWindow: "关闭当前窗口" },
      t: function(key) { return chinese.messages[key] || key }
    }
    compare(Actions.actionName(binding({ description: "Close window" }), chinese), "关闭当前窗口")
    compare(Actions.actionName(binding({ description: "My custom backup script", dispatcher: "__lua" }), chinese),
            "My custom backup script")
  }
}
