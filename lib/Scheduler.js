.pragma library
.import "Stats.js" as Stats

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

function build(bindings, stats, cardCount) {
  var total = Number(cardCount || 24)
  var deck = []
  if (!bindings.length) return deck
  for (var wave = 0; deck.length < total; wave++) {
    var counts = {}
    var previous = deck.length ? deck[deck.length - 1].binding.id : ""
    for (var slot = 0; slot < 8 && deck.length < total; slot++) {
      var binding = chooseWeighted(bindings, stats, counts, previous)
      counts[binding.id] = Number(counts[binding.id] || 0) + 1
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

