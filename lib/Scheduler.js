.pragma library
.import "Stats.js" as Stats

var QUEUE_PRIORITY = { due: 0, unseen: 1, weak: 2, maintenance: 3 }

function stableBindings(bindings) {
  return bindings.slice().sort(function(left, right) {
    return String(left.id).localeCompare(String(right.id))
  })
}

function coverageOrder(bindings, stats) {
  var ordered = stableBindings(bindings)
  if (!ordered.length) return []
  var cursor = Number(stats.coverageCursor || 0) % ordered.length
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
      stats.coverageCursor = (index + 1) % ordered.length
      return
    }
  }
}

function chooseFallback(pool, selected, index) {
  if (!pool.length) return null
  var previousId = selected.length ? selected[selected.length - 1].binding.id : ""
  var usage = {}
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
  while (remaining.length) {
    var waveStart = Math.floor(arranged.length / 8) * 8
    var waveCounts = {}
    var categoryCounts = {}
    for (var used = waveStart; used < arranged.length; used++) {
      var usedId = arranged[used].binding.id
      var usedCategory = String(arranged[used].binding.category || "uncategorized")
      waveCounts[usedId] = Number(waveCounts[usedId] || 0) + 1
      categoryCounts[usedCategory] = Number(categoryCounts[usedCategory] || 0) + 1
    }
    var previousId = arranged.length ? arranged[arranged.length - 1].binding.id : ""
    var bestIndex = -1
    var bestScore = Infinity
    for (var index = 0; index < remaining.length; index++) {
      var candidate = remaining[index]
      var id = candidate.binding.id
      if (id === previousId || Number(waveCounts[id] || 0) >= 2) continue
      var category = String(candidate.binding.category || "uncategorized")
      var score = Number(categoryCounts[category] || 0) * 10 + Number(QUEUE_PRIORITY[candidate.queue] || 0)
      if (score < bestScore) { bestIndex = index; bestScore = score }
    }
    if (bestIndex < 0) {
      for (var fallback = 0; fallback < remaining.length; fallback++) {
        if (remaining[fallback].binding.id !== previousId) { bestIndex = fallback; break }
      }
    }
    if (bestIndex < 0) bestIndex = 0
    var chosen = remaining.splice(bestIndex, 1)[0]
    chosen.wave = Math.floor(arranged.length / 8) + 1
    arranged.push(chosen)
  }
  return arranged
}

function build(bindings, stats, cardCount, options) {
  var total = Math.max(0, Number(cardCount || 24))
  var deck = []
  if (!bindings.length || !total) return deck
  var config = options || {}
  var now = Number(config.now || Date.now())
  var runId = Math.max(1, Number(config.runId || Number(stats.runs || 0) + 1))
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

function durationFor(cardValue, stats) {
  if (!cardValue || cardValue.tier === "guided") return 0
  var metrics = Stats.metrics(stats.bindings[cardValue.binding.id])
  if (cardValue.tier === "maintenance")
    return Math.max(2600, Math.min(4000, metrics.p75 ? metrics.p75 * 1.45 : 3600))
  return Math.max(3500, Math.min(5000, metrics.p75 ? metrics.p75 * 1.7 : 4500))
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
  if (existingIndex >= 0) updated.splice(existingIndex, 1)

  var gap = 3 + (currentIndex % 3)
  var insertAt = currentIndex + 1 + gap
  var spacingCandidates = deck.filter(function(cardValue) {
    return cardValue.binding.id !== binding.id
  })
  var spacingIndex = 0
  while (updated.length < insertAt && spacingCandidates.length) {
    var source = spacingCandidates[spacingIndex % spacingCandidates.length]
    updated.push({
      binding: source.binding,
      tier: source.tier,
      queue: "spacing",
      remedial: false,
      wave: Math.floor(updated.length / 8) + 1
    })
    spacingIndex += 1
  }
  insertAt = Math.min(insertAt, updated.length)
  updated.splice(insertAt, 0, {
    binding: binding,
    tier: "learning",
    queue: "remedial",
    remedial: true,
    wave: Math.floor(insertAt / 8) + 1
  })
  return updated
}
