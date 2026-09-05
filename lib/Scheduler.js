.pragma library
.import "Stats.js" as Stats
.import "Profiles.js" as Profiles
.import "AnswerMatcher.js" as AnswerMatcher

var QUEUE_PRIORITY = { due: 0, unseen: 1, weak: 2, maintenance: 3 }

function stableBindings(bindings) {
  return bindings.slice().sort(function(left, right) {
    return String(left.id).localeCompare(String(right.id))
  })
}

// The cursor belongs to the training ground being built, and every binding in
// a deck comes from the same one, so its id names where the cursor is kept.
function profileOf(bindings) {
  return bindings.length ? Profiles.profileOf(bindings[0].id) : ""
}

function coverageOrder(bindings, stats) {
  var ordered = stableBindings(bindings)
  if (!ordered.length) return []
  var cursor = Number(Stats.counters(stats, profileOf(ordered)).coverageCursor || 0) % ordered.length
  return ordered.slice(cursor).concat(ordered.slice(0, cursor))
}

function dueSort(left, right, stats) {
  var leftItem = Stats.entry(stats, left.id)
  var rightItem = Stats.entry(stats, right.id)
  if (leftItem.state !== rightItem.state) return leftItem.state === "learning" ? -1 : 1
  var leftDue = Number(leftItem.dueAt || 0)
  var rightDue = Number(rightItem.dueAt || 0)
  if (leftDue !== rightDue) return leftDue - rightDue
  return String(left.id).localeCompare(String(right.id))
}

function weakSort(left, right, stats) {
  var leftItem = Stats.entry(stats, left.id)
  var rightItem = Stats.entry(stats, right.id)
  if (leftItem.lapseCount !== rightItem.lapseCount) return rightItem.lapseCount - leftItem.lapseCount
  var leftAccuracy = Stats.metrics(leftItem).accuracy
  var rightAccuracy = Stats.metrics(rightItem).accuracy
  if (leftAccuracy !== rightAccuracy) return leftAccuracy - rightAccuracy
  if (leftItem.lastSeenAt !== rightItem.lastSeenAt) return leftItem.lastSeenAt - rightItem.lastSeenAt
  return String(left.id).localeCompare(String(right.id))
}

function queuePools(bindings, stats, now, runId) {
  var pools = { due: [], unseen: [], weak: [], maintenance: [] }
  var ordered = stableBindings(bindings)
  for (var index = 0; index < ordered.length; index++) {
    var binding = ordered[index]
    var item = Stats.entry(stats, binding.id)
    if (item.state === "unseen" || item.state === "guided") continue
    if (Stats.isDue(item, now, runId)) pools.due.push(binding)
    else if (item.state === "learning") pools.weak.push(binding)
    else pools.maintenance.push(binding)
  }
  pools.due.sort(function(left, right) { return dueSort(left, right, stats) })
  pools.weak.sort(function(left, right) { return weakSort(left, right, stats) })
  pools.maintenance.sort(function(left, right) {
    var age = Stats.entry(stats, left.id).lastSeenAt - Stats.entry(stats, right.id).lastSeenAt
    return age || String(left.id).localeCompare(String(right.id))
  })
  pools.unseen = coverageOrder(bindings, stats).filter(function(binding) {
    var state = Stats.entry(stats, binding.id).state
    return state === "unseen" || state === "guided"
  })
  return pools
}

function card(binding, queue, stats) {
  return { binding: binding, tier: Stats.tier(Stats.entry(stats, binding.id)), queue: queue, remedial: false }
}

function takeUnique(target, pool, count, queue, stats) {
  var amount = Math.min(Number(count || 0), pool.length)
  for (var index = 0; index < amount; index++) target.push(card(pool[index], queue, stats))
  return amount
}

function markCovered(bindings, stats, bindingId) {
  if (!bindings.length || !bindingId) return
  var ordered = stableBindings(bindings)
  for (var index = 0; index < ordered.length; index++) {
    if (ordered[index].id === bindingId) {
      Stats.ensureCounters(stats, Profiles.profileOf(bindingId)).coverageCursor =
          (index + 1) % ordered.length
      return
    }
  }
}

function chooseFallback(pool, selected, index) {
  if (!pool.length) return null
  var previousId = selected.length ? selected[selected.length - 1].binding.id : ""
  var usage = Object.create(null)
  selected.forEach(function(cardValue) {
    usage[cardValue.binding.id] = Number(usage[cardValue.binding.id] || 0) + 1
  })
  var best = null
  var bestUsage = Infinity
  for (var offset = 0; offset < pool.length; offset++) {
    var candidate = pool[(index + offset) % pool.length]
    if (candidate.binding.id === previousId) continue
    var count = Number(usage[candidate.binding.id] || 0)
    if (count < bestUsage) { best = candidate; bestUsage = count }
  }
  return best || pool[index % pool.length]
}

function arrange(cards) {
  var remaining = cards.slice()
  var arranged = []
  var usage = Object.create(null)
  var categoryCounts = Object.create(null)
  while (remaining.length) {
    var previousId = arranged.length ? arranged[arranged.length - 1].binding.id : ""
    var bestIndex = -1
    var bestScore = Infinity
    for (var index = 0; index < remaining.length; index++) {
      var candidate = remaining[index]
      var id = candidate.binding.id
      if (id === previousId) continue
      var category = String(candidate.binding.category || "uncategorized")
      var score = Number(usage[id] || 0) * 100
                + Number(categoryCounts[category] || 0) * 10
                + Number(QUEUE_PRIORITY[candidate.queue] || 0)
      if (score < bestScore) { bestIndex = index; bestScore = score }
    }
    if (bestIndex < 0) {
      for (var fallback = 0; fallback < remaining.length; fallback++) {
        if (remaining[fallback].binding.id !== previousId) { bestIndex = fallback; break }
      }
    }
    if (bestIndex < 0) bestIndex = 0
    var chosen = remaining.splice(bestIndex, 1)[0]
    arranged.push(chosen)
    var chosenId = chosen.binding.id
    var chosenCategory = String(chosen.binding.category || "uncategorized")
    usage[chosenId] = Number(usage[chosenId] || 0) + 1
    categoryCounts[chosenCategory] = Number(categoryCounts[chosenCategory] || 0) + 1
  }
  return arranged
}

function build(bindings, stats, cardCount, options) {
  var total = Math.max(0, Number(cardCount || 24))
  var deck = []
  if (!bindings.length || !total) return deck
  var config = options || {}
  var now = Number(config.now || Date.now())
  var runId = Math.max(1, Number(config.runId
      || Number(Stats.counters(stats, config.profile || profileOf(bindings)).runs || 0) + 1))
  var pools = queuePools(bindings, stats, now, runId)
  takeUnique(deck, pools.due, 10, "due", stats)
  takeUnique(deck, pools.unseen, 6, "unseen", stats)
  takeUnique(deck, pools.weak, 6, "weak", stats)
  takeUnique(deck, pools.maintenance, 2, "maintenance", stats)

  var fallback = []
  ;["due", "unseen", "weak", "maintenance"].forEach(function(name) {
    pools[name].forEach(function(binding) { fallback.push(card(binding, name, stats)) })
  })
  if (!fallback.length) stableBindings(bindings).forEach(function(binding) {
    fallback.push(card(binding, "unseen", stats))
  })
  var cursor = 0
  while (deck.length < total) {
    var chosen = chooseFallback(fallback, deck, cursor)
    if (!chosen) break
    deck.push(card(chosen.binding, chosen.queue, stats))
    cursor += 1
  }
  if (deck.length > total) deck = deck.slice(0, total)
  return arrange(deck)
}

function planCounts(deck) {
  var newBindings = Object.create(null)
  var reviewBindings = Object.create(null)
  for (var index = 0; index < (deck || []).length; index++) {
    var cardValue = deck[index]
    if (!cardValue || !cardValue.binding) continue
    if (cardValue.queue === "unseen" && cardValue.tier === "guided")
      newBindings[cardValue.binding.id] = true
    else reviewBindings[cardValue.binding.id] = true
  }
  return {
    added: Object.keys(newBindings).length,
    review: Object.keys(reviewBindings).length
  }
}

// A longer answer takes longer to type, and the clamps were chosen for one
// chord. The extra per step is added outside them so a four-step sequence is
// not held to a single chord's ceiling. p75 measures the whole sequence, so
// the statistics need no notion of steps at all.
function durationFor(cardValue, stats) {
  if (!cardValue || cardValue.tier === "guided") return 0
  var metrics = Stats.metrics(stats.bindings[cardValue.binding.id])
  var extraSteps = Math.max(0, AnswerMatcher.stepCount(cardValue.binding.answer) - 1)
  if (cardValue.tier === "maintenance")
    return Math.max(2600, Math.min(4000, metrics.p75 ? metrics.p75 * 1.45 : 3600)) + 600 * extraSteps
  return Math.max(3500, Math.min(5000, metrics.p75 ? metrics.p75 * 1.7 : 4500)) + 800 * extraSteps
}

function insertRemedial(deck, currentIndex, binding) {
  var updated = deck.slice()
  var existingIndex = -1
  for (var index = currentIndex + 1; index < updated.length; index++) {
    if (updated[index].remedial && updated[index].binding.id === binding.id) {
      existingIndex = index
      break
    }
  }
  if (existingIndex >= currentIndex + 4 && existingIndex <= currentIndex + 6) return updated

  var start = currentIndex + 4
  var end = Math.min(currentIndex + 6, updated.length - 1)
  if (start > end) return updated

  var replacePriority = { maintenance: 4, weak: 3, unseen: 2, due: 1 }
  var replaceIndex = -1
  var bestPriority = -1
  for (var candidateIndex = start; candidateIndex <= end; candidateIndex++) {
    var candidate = updated[candidateIndex]
    if (candidate.remedial) continue
    var priority = Number(replacePriority[candidate.queue] || 0)
    if (priority > bestPriority) {
      replaceIndex = candidateIndex
      bestPriority = priority
    }
  }
  if (replaceIndex < 0) return updated

  var displaced = updated[replaceIndex]
  updated[replaceIndex] = {
    binding: binding,
    tier: "learning",
    queue: "remedial",
    remedial: true
  }
  if (existingIndex >= 0) updated[existingIndex] = displaced
  return updated
}
