.pragma library

function defaults() {
  return { schemaVersion: 1, bindings: {}, runs: 0, bestScore: 0 }
}

function valid(value) {
  return value && value.schemaVersion === 1 && value.bindings && typeof value.bindings === "object"
}

function parse(raw) {
  try {
    var value = JSON.parse(String(raw || ""))
    return valid(value) ? value : defaults()
  } catch (error) {
    return defaults()
  }
}

function entry(stats, id) {
  if (!stats.bindings[id]) stats.bindings[id] = { attempts: [], hits: 0, misses: 0, lastSeen: 0, guidedHits: 0 }
  return stats.bindings[id]
}

function record(stats, id, correct, reactionMs, guided) {
  var item = entry(stats, id)
  var attempt = { correct: Boolean(correct), guided: Boolean(guided), at: Date.now() }
  if (correct && reactionMs >= 0) attempt.reactionMs = Math.round(reactionMs)
  item.attempts.push(attempt)
  if (item.attempts.length > 10) item.attempts = item.attempts.slice(item.attempts.length - 10)
  if (correct) item.hits += 1
  else item.misses += 1
  if (correct && guided) {
    item.guidedHits += 1
    item.forceGuided = false
  }
  item.lastSeen = Date.now()
  return stats
}

function percentile75(samples) {
  if (!samples.length) return 0
  var sorted = samples.slice().sort(function(a, b) { return a - b })
  return sorted[Math.max(0, Math.ceil(sorted.length * 0.75) - 1)]
}

function metrics(item) {
  var all = item && Array.isArray(item.attempts) ? item.attempts : []
  var attempts = all.filter(function(a) { return !a.guided })
  var hits = attempts.filter(function(a) { return a.correct })
  return {
    samples: attempts.length,
    accuracy: attempts.length ? hits.length / attempts.length : 0,
    p75: percentile75(hits.map(function(a) { return Number(a.reactionMs || 0) }).filter(function(v) { return v > 0 }))
  }
}

function tier(item) {
  if (!item || item.forceGuided || Number(item.guidedHits || 0) === 0) return "guided"
  var value = metrics(item)
  if (value.samples >= 5 && value.accuracy >= 0.8 && value.p75 > 0 && value.p75 <= 1800) return "rush"
  return "recall"
}
