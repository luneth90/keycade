import QtQuick
import QtTest
import "../../lib/InputNormalizer.js" as Normalizer
import "../../lib/Eligibility.js" as Eligibility
import "../../lib/Scheduler.js" as Scheduler
import "../../lib/Stats.js" as Stats

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

  function test_eligibilityRejectsAmbiguousAndBypassingBindings() {
    var duplicate = binding({ description: "Another action" })
    var result = Eligibility.filter([binding({}), duplicate], {})
    compare(result.eligible.length, 0)
    compare(result.excluded.length, 2)

    result = Eligibility.filter([binding({ dontInhibit: true })], {})
    compare(result.eligible.length, 0)

    result = Eligibility.filter([binding({ description: "Move window to workspace 3" })], { levelOneOnly: true })
    compare(result.eligible.length, 0)
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
}
