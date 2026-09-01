.pragma library

var DAY_MS = 86400000
var RECENT_LIMIT = 6
var REACTION_LIMIT = 10

function defaults() {
  return { schemaVersion: 2, bindings: {}, runs: 0, coverageCursor: 0 }
}

function valid(value) {
  return value && (value.schemaVersion === 1 || value.schemaVersion === 2)
      && value.bindings && typeof value.bindings === "object"
}

function freshEntry() {
  return {
    state: "unseen",
    guidedCompleted: false,
    dueAt: 0,
    dueRun: 0,
    intervalStep: 0,
    firstTryAttempts: 0,
    firstTryCorrect: 0,
    recentFirstTry: [],
    reactions: [],
    successfulRuns: [],
    lastSuccessfulRun: 0,
    lastSeenAt: 0,
    lapseCount: 0
  }
}

function normalizedEntry(source) {
  var item = freshEntry()
  var input = source || {}
  item.state = ["unseen", "guided", "learning", "mastered"].indexOf(String(input.state)) !== -1
      ? String(input.state) : "unseen"
  item.guidedCompleted = Boolean(input.guidedCompleted)
  item.dueAt = Math.max(0, Number(input.dueAt || 0))
  item.dueRun = Math.max(0, Number(input.dueRun || 0))
  item.intervalStep = Math.max(0, Number(input.intervalStep || 0))
  item.firstTryAttempts = Math.max(0, Number(input.firstTryAttempts || 0))
  item.firstTryCorrect = Math.max(0, Number(input.firstTryCorrect || 0))
  item.recentFirstTry = Array.isArray(input.recentFirstTry)
      ? input.recentFirstTry.slice(-RECENT_LIMIT).map(Boolean) : []
  item.reactions = Array.isArray(input.reactions)
      ? input.reactions.map(Number).filter(function(value) { return value > 0 }).slice(-REACTION_LIMIT) : []
  item.successfulRuns = Array.isArray(input.successfulRuns)
      ? input.successfulRuns.map(Number).filter(function(value, index, values) {
          return value > 0 && values.indexOf(value) === index
        }).slice(-10) : []
  item.lastSuccessfulRun = Math.max(0, Number(input.lastSuccessfulRun || 0))
  item.lastSeenAt = Math.max(0, Number(input.lastSeenAt || 0))
  item.lapseCount = Math.max(0, Number(input.lapseCount || 0))
  if (input.forceGuided) item.state = "guided"
  return item
}

function migrateV1(value) {
  var migrated = defaults()
  migrated.runs = Math.max(0, Number(value.runs || 0))
  Object.keys(value.bindings || {}).forEach(function(id) {
    var old = value.bindings[id] || {}
    var item = freshEntry()
    var attempts = Array.isArray(old.attempts) ? old.attempts : []
    var independent = attempts.filter(function(attempt) { return !attempt.guided })
    var correct = independent.filter(function(attempt) { return Boolean(attempt.correct) })
    item.guidedCompleted = Number(old.guidedHits || 0) > 0
    item.state = old.forceGuided ? "guided" : item.guidedCompleted ? "learning" : "unseen"
    item.firstTryAttempts = Math.max(Number(old.hits || 0) + Number(old.misses || 0)
                                     - Number(old.guidedHits || 0), independent.length)
    item.firstTryCorrect = Math.max(0, Number(old.hits || 0) - Number(old.guidedHits || 0), correct.length)
    item.recentFirstTry = independent.slice(-RECENT_LIMIT).map(function(attempt) { return Boolean(attempt.correct) })
    item.reactions = correct.map(function(attempt) { return Number(attempt.reactionMs || 0) })
        .filter(function(reaction) { return reaction > 0 }).slice(-REACTION_LIMIT)
    item.lastSeenAt = Math.max(0, Number(old.lastSeen || 0))
    item.dueRun = migrated.runs + 1
    migrated.bindings[id] = item
  })
  return migrated
}

function migrate(value) {
  if (!valid(value)) return defaults()
  if (value.schemaVersion === 1) return migrateV1(value)
  var migrated = defaults()
  migrated.runs = Math.max(0, Number(value.runs || 0))
  migrated.coverageCursor = Math.max(0, Number(value.coverageCursor || 0))
  Object.keys(value.bindings).forEach(function(id) {
    migrated.bindings[id] = normalizedEntry(value.bindings[id])
  })
  return migrated
}

function parse(raw) {
  try {
    return migrate(JSON.parse(String(raw || "")))
  } catch (error) {
    return defaults()
  }
}

function entry(stats, id) {
  if (!stats.bindings[id]) stats.bindings[id] = freshEntry()
  return stats.bindings[id]
}

function percentile75(samples) {
  if (!samples.length) return 0
  var sorted = samples.slice().sort(function(left, right) { return left - right })
  return sorted[Math.max(0, Math.ceil(sorted.length * 0.75) - 1)]
}

function metrics(item) {
  var value = item ? normalizedEntry(item) : freshEntry()
  var samples = value.recentFirstTry.length
  var recentCorrect = value.recentFirstTry.filter(Boolean).length
  return {
    samples: samples,
    accuracy: samples ? recentCorrect / samples : 0,
    p75: percentile75(value.reactions),
    totalAttempts: value.firstTryAttempts,
    totalCorrect: value.firstTryCorrect
  }
}

function scheduleNext(item, now, runId) {
  var intervals = [0, 0, DAY_MS, 3 * DAY_MS, 7 * DAY_MS, 14 * DAY_MS]
  var step = Math.min(item.intervalStep, intervals.length - 1)
  if (step <= 1) {
    item.dueAt = 0
    item.dueRun = runId + 1
  } else {
    item.dueAt = now + intervals[step]
    item.dueRun = 0
  }
}

function recordGuided(stats, id, runId, now) {
  var item = entry(stats, id)
  item.guidedCompleted = true
  item.state = "learning"
  item.lastSeenAt = Number(now || Date.now())
  item.dueAt = 0
  item.dueRun = Math.max(1, Number(runId || Number(stats.runs || 0) + 1))
  return item
}

function recordFirstTry(stats, id, correct, reactionMs, runId, now) {
  var item = entry(stats, id)
  var timestamp = Number(now || Date.now())
  var session = Math.max(1, Number(runId || Number(stats.runs || 0) + 1))
  var wasMastered = item.state === "mastered"
  item.firstTryAttempts += 1
  item.recentFirstTry.push(Boolean(correct))
  if (item.recentFirstTry.length > RECENT_LIMIT) item.recentFirstTry = item.recentFirstTry.slice(-RECENT_LIMIT)
  item.lastSeenAt = timestamp

  if (!correct) {
    item.state = "learning"
    item.lapseCount += 1
    item.intervalStep = Math.max(0, item.intervalStep - 1)
    item.dueAt = 0
    item.dueRun = session + 1
    return { item: item, masteredGained: false, lapsed: wasMastered }
  }

  item.firstTryCorrect += 1
  if (Number(reactionMs) >= 0) {
    item.reactions.push(Math.round(Number(reactionMs)))
    if (item.reactions.length > REACTION_LIMIT) item.reactions = item.reactions.slice(-REACTION_LIMIT)
  }
  if (item.lastSuccessfulRun !== session) {
    item.lastSuccessfulRun = session
    item.intervalStep = Math.min(5, item.intervalStep + 1)
    if (item.successfulRuns.indexOf(session) === -1) item.successfulRuns.push(session)
    if (item.successfulRuns.length > 10) item.successfulRuns = item.successfulRuns.slice(-10)
  }

  var recentCorrect = item.recentFirstTry.filter(Boolean).length
  var mastered = item.guidedCompleted
      && item.firstTryCorrect >= 5
      && item.successfulRuns.length >= 3
      && item.recentFirstTry.length >= 6
      && recentCorrect >= 5
  item.state = mastered || wasMastered ? "mastered" : "learning"
  scheduleNext(item, timestamp, session)
  return { item: item, masteredGained: !wasMastered && item.state === "mastered", lapsed: false }
}

function requestGuidance(stats, id) {
  var item = entry(stats, id)
  item.state = "guided"
  item.dueAt = 0
  item.dueRun = Number(stats.runs || 0) + 1
  return item
}

function isDue(item, now, runId) {
  if (!item || item.state === "unseen" || item.state === "guided") return false
  if (Number(item.dueRun || 0) > 0) return Number(runId || 0) >= Number(item.dueRun)
  if (Number(item.dueAt || 0) > 0) return Number(now || Date.now()) >= Number(item.dueAt)
  return true
}

function tier(item) {
  if (!item || item.state === "unseen" || item.state === "guided") return "guided"
  return item.state === "mastered" ? "maintenance" : "learning"
}

function counts(stats, bindings, now, runId) {
  var result = { unseen: 0, learning: 0, mastered: 0, due: 0, total: bindings.length }
  for (var index = 0; index < bindings.length; index++) {
    var item = entry(stats, bindings[index].id)
    if (item.state === "unseen" || item.state === "guided") result.unseen += 1
    else if (item.state === "mastered") result.mastered += 1
    else result.learning += 1
    if (isDue(item, now, runId)) result.due += 1
  }
  return result
}
