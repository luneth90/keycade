.pragma library
.import "Stats.js" as Stats
.import "Categorizer.js" as Categorizer

function weight(binding, stats, now) {
  var item = stats.bindings[binding.id]
  if (!item) return 2.4
  var metrics = Stats.metrics(item)
  var errorBoost = 1 + (1 - metrics.accuracy) * 2.2
  var slowBoost = metrics.p75 > 1800 ? Math.min(1.5, (metrics.p75 - 1800) / 1800) : 0
  var ageDays = Math.max(0, (now - Number(item.lastSeen || now)) / 86400000)
  return Math.min(5, errorBoost + slowBoost + Math.min(1.2, ageDays / 7))
}

function chooseWeighted(pool, stats, counts, previousId) {
  var now = Date.now()
  var choices = pool.filter(function(binding) {
    return binding.id !== previousId && Number(counts[binding.id] || 0) < 2
  })
  if (!choices.length) choices = pool.filter(function(binding) { return binding.id !== previousId })
  if (!choices.length) choices = pool.slice()
  var total = 0
  var weighted = []
  for (var i = 0; i < choices.length; i++) {
    total += weight(choices[i], stats, now)
    weighted.push(total)
  }
  var needle = Math.random() * total
  for (var j = 0; j < weighted.length; j++) if (needle <= weighted[j]) return choices[j]
  return choices[choices.length - 1]
}

function categoryPools(bindings) {
  var pools = {}
  for (var i = 0; i < bindings.length; i++) {
    var name = String(bindings[i].category || "uncategorized")
    if (!pools[name]) pools[name] = []
    pools[name].push(bindings[i])
  }
  return pools
}

function orderedPoolNames(pools, wave) {
  var names = Categorizer.categories().filter(function(name) { return Boolean(pools[name] && pools[name].length) })
  Object.keys(pools).forEach(function(name) {
    if (names.indexOf(name) === -1 && pools[name].length) names.push(name)
  })
  if (!names.length) return names
  var offset = Number(wave || 0) % names.length
  return names.slice(offset).concat(names.slice(0, offset))
}

function hasAvailable(pool, counts, previousId, avoidPrevious) {
  for (var i = 0; i < pool.length; i++) {
    if (Number(counts[pool[i].id] || 0) >= 2) continue
    if (!avoidPrevious || pool[i].id !== previousId) return true
  }
  return false
}

function chooseCategory(names, pools, categoryCounts, bindingCounts, previousId) {
  var avoidPrevious = names.some(function(name) {
    return hasAvailable(pools[name], bindingCounts, previousId, true)
  })
  var best = ""
  var bestCount = Infinity
  for (var i = 0; i < names.length; i++) {
    var name = names[i]
    if (!hasAvailable(pools[name], bindingCounts, previousId, avoidPrevious)) continue
    var count = Number(categoryCounts[name] || 0)
    if (count < bestCount) {
      best = name
      bestCount = count
    }
  }
  return best
}

function build(bindings, stats, cardCount) {
  var total = Number(cardCount || 24)
  var deck = []
  if (!bindings.length) return deck
  var pools = categoryPools(bindings)
  for (var wave = 0; deck.length < total; wave++) {
    var counts = {}
    var categoryCounts = {}
    var names = orderedPoolNames(pools, wave)
    var previous = deck.length ? deck[deck.length - 1].binding.id : ""
    for (var slot = 0; slot < 8 && deck.length < total; slot++) {
      var category = chooseCategory(names, pools, categoryCounts, counts, previous)
      var binding = chooseWeighted(category ? pools[category] : bindings, stats, counts, previous)
      counts[binding.id] = Number(counts[binding.id] || 0) + 1
      categoryCounts[String(binding.category || "uncategorized")] = Number(categoryCounts[String(binding.category || "uncategorized")] || 0) + 1
      var item = stats.bindings[binding.id]
      deck.push({ binding: binding, tier: Stats.tier(item), wave: wave + 1 })
      previous = binding.id
    }
  }
  return deck
}

function durationFor(card, stats) {
  if (!card || card.tier === "guided") return 0
  var metrics = Stats.metrics(stats.bindings[card.binding.id])
  if (card.tier === "rush") return Math.max(1400, Math.min(2400, metrics.p75 ? metrics.p75 * 1.25 : 2200))
  return Math.max(2400, Math.min(3500, metrics.p75 ? metrics.p75 * 1.5 : 3500))
}
