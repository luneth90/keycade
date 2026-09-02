.pragma library

var DAY_MS = 86400000
var RECENT_LIMIT = 6
var REACTION_LIMIT = 10
var SUCCESSFUL_RUN_LIMIT = 10
var MAX_BINDINGS = 4000
var MAX_BINDING_ID = 2300
var MAX_COUNTER = 1000000000
var MAX_TIMESTAMP = 9000000000000000
var MAX_REACTION_MS = 600000
var FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"]

function safeMap() { return Object.create(null) }

function safeKey(value) {
  var key = String(value === undefined || value === null ? "" : value)
  return key && key.length <= MAX_BINDING_ID && FORBIDDEN_KEYS.indexOf(key) === -1 ? key : ""
}

function boundedNumber(value, fallback, minimum, maximum, integer) {
  var number = typeof value === "number" && isFinite(value) ? value : fallback
  number = Math.max(minimum, Math.min(maximum, number))
  return integer ? Math.floor(number) : number
}

function defaults() {
  return {
    schemaVersion: 3,
    bindings: safeMap(),
    runs: 0,
    coverageCursor: 0,
    totalTrainingMs: 0,
    firstMasteryAt: 0,
    firstMasteryRun: 0,
    firstMasteryCelebrated: false
  }
}

function valid(value) {
  return value && typeof value === "object" && !Array.isArray(value)
      && (value.schemaVersion === 1 || value.schemaVersion === 2
                   || value.schemaVersion === 3)
      && value.bindings && typeof value.bindings === "object" && !Array.isArray(value.bindings)
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
  item.guidedCompleted = input.guidedCompleted === true
  item.dueAt = boundedNumber(input.dueAt, 0, 0, MAX_TIMESTAMP, true)
  item.dueRun = boundedNumber(input.dueRun, 0, 0, MAX_COUNTER, true)
  item.intervalStep = boundedNumber(input.intervalStep, 0, 0, 5, true)
  item.firstTryAttempts = boundedNumber(input.firstTryAttempts, 0, 0, MAX_COUNTER, true)
  item.firstTryCorrect = boundedNumber(input.firstTryCorrect, 0, 0, item.firstTryAttempts, true)
  item.recentFirstTry = Array.isArray(input.recentFirstTry)
      ? input.recentFirstTry.slice(-RECENT_LIMIT).map(Boolean) : []
  item.reactions = Array.isArray(input.reactions)
      ? input.reactions.slice(-REACTION_LIMIT).map(function(value) {
          return boundedNumber(value, 0, 0, MAX_REACTION_MS, true)
        }).filter(function(value) { return value > 0 }) : []
  item.successfulRuns = Array.isArray(input.successfulRuns)
      ? input.successfulRuns.slice(-SUCCESSFUL_RUN_LIMIT).map(function(value) {
          return boundedNumber(value, 0, 0, MAX_COUNTER, true)
        }).filter(function(value, index, values) {
          return value > 0 && values.indexOf(value) === index
        }).slice(-SUCCESSFUL_RUN_LIMIT) : []
  item.lastSuccessfulRun = boundedNumber(input.lastSuccessfulRun, 0, 0, MAX_COUNTER, true)
  item.lastSeenAt = boundedNumber(input.lastSeenAt, 0, 0, MAX_TIMESTAMP, true)
  item.lapseCount = boundedNumber(input.lapseCount, 0, 0, MAX_COUNTER, true)
  if (item.state === "learning" && masteryReady(item)) item.state = "mastered"
  if (input.forceGuided === true) item.state = "guided"
  return item
}

function masteryReady(item) {
  var recent = item.recentFirstTry.slice(-2)
  return item.guidedCompleted
      && item.firstTryCorrect >= 2
      && item.successfulRuns.length >= 2
      && recent.length >= 2
      && recent.every(Boolean)
}

function migrateV1(value) {
  var migrated = defaults()
  migrated.runs = boundedNumber(value.runs, 0, 0, MAX_COUNTER, true)
  Object.keys(value.bindings || {}).slice(0, MAX_BINDINGS).forEach(function(rawId) {
    var id = safeKey(rawId)
    if (!id) return
    var old = value.bindings[id] || {}
    var item = freshEntry()
    var attempts = Array.isArray(old.attempts) ? old.attempts.slice(-1000) : []
    var independent = attempts.filter(function(attempt) { return !attempt.guided })
    var correct = independent.filter(function(attempt) { return Boolean(attempt.correct) })
    item.guidedCompleted = boundedNumber(old.guidedHits, 0, 0, MAX_COUNTER, true) > 0
    item.state = old.forceGuided === true ? "guided" : item.guidedCompleted ? "learning" : "unseen"
    item.firstTryAttempts = boundedNumber(
        Math.max(Number(old.hits || 0) + Number(old.misses || 0)
                 - Number(old.guidedHits || 0), independent.length), 0, 0, MAX_COUNTER, true)
    item.firstTryCorrect = boundedNumber(
        Math.max(0, Number(old.hits || 0) - Number(old.guidedHits || 0), correct.length),
        0, 0, item.firstTryAttempts, true)
    item.recentFirstTry = independent.slice(-RECENT_LIMIT).map(function(attempt) { return Boolean(attempt.correct) })
    item.reactions = correct.map(function(attempt) { return Number(attempt.reactionMs || 0) })
        .filter(function(reaction) { return reaction > 0 }).slice(-REACTION_LIMIT)
    item.lastSeenAt = boundedNumber(old.lastSeen, 0, 0, MAX_TIMESTAMP, true)
    item.dueRun = boundedNumber(migrated.runs + 1, 1, 1, MAX_COUNTER, true)
    migrated.bindings[id] = item
  })
  return migrated
}

function migrate(value) {
  if (!valid(value)) return defaults()
  if (value.schemaVersion === 1) return migrateV1(value)
  var migrated = defaults()
  migrated.runs = boundedNumber(value.runs, 0, 0, MAX_COUNTER, true)
  migrated.coverageCursor = boundedNumber(value.coverageCursor, 0, 0, MAX_COUNTER, true)
  migrated.totalTrainingMs = boundedNumber(value.totalTrainingMs, 0, 0, MAX_TIMESTAMP, true)
  migrated.firstMasteryAt = boundedNumber(value.firstMasteryAt, 0, 0, MAX_TIMESTAMP, true)
  migrated.firstMasteryRun = boundedNumber(value.firstMasteryRun, 0, 0, MAX_COUNTER, true)
  migrated.firstMasteryCelebrated = value.firstMasteryCelebrated === true
  Object.keys(value.bindings).slice(0, MAX_BINDINGS).forEach(function(rawId) {
    var id = safeKey(rawId)
    if (!id) return
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
  var key = safeKey(id)
  if (!key) return freshEntry()
  if (!stats.bindings || typeof stats.bindings !== "object" || Array.isArray(stats.bindings))
    stats.bindings = safeMap()
  if (!stats.bindings[key]) stats.bindings[key] = freshEntry()
  return stats.bindings[key]
}

function percentile75(samples) {
  if (!samples.length) return 0
  var sorted = samples.slice().sort(function(left, right) { return left - right })
  return sorted[Math.max(0, Math.ceil(sorted.length * 0.75) - 1)]
}

function aggregate(stats, bindings) {
  var attempts = 0
  var correct = 0
  var reactions = []
  var seen = {}
  var source = (stats && stats.bindings) || {}
  var ids = bindings ? bindings.map(function(binding) { return binding.id })
                     : Object.keys(source)
  for (var index = 0; index < ids.length; index++) {
    var id = String(ids[index] || "")
    if (!id || seen[id]) continue
    seen[id] = true
    var item = normalizedEntry(source[id])
    attempts += item.firstTryAttempts
    correct += item.firstTryCorrect
    reactions = reactions.concat(item.reactions)
  }
  return {
    attempts: attempts,
    correct: correct,
    accuracy: attempts ? Math.round(correct / attempts * 100) : 0,
    response: percentile75(reactions)
  }
}

function addTrainingTime(stats, elapsedMs) {
  var elapsed = boundedNumber(elapsedMs, 0, 0, MAX_TIMESTAMP, true)
  stats.totalTrainingMs = boundedNumber(
      Number(stats.totalTrainingMs || 0) + elapsed, 0, 0, MAX_TIMESTAMP, true)
  return stats.totalTrainingMs
}

function noteFirstMastery(stats, now, runId) {
  if (Number(stats.firstMasteryAt || 0) > 0) return false
  stats.firstMasteryAt = Math.max(1, Number(now || Date.now()))
  stats.firstMasteryRun = Math.max(1, Number(runId || Number(stats.runs || 0) + 1))
  stats.firstMasteryCelebrated = false
  return true
}

function markFirstMasteryCelebrated(stats) {
  if (!Number(stats.firstMasteryAt || 0) || stats.firstMasteryCelebrated) return false
  stats.firstMasteryCelebrated = true
  return true
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

  var mastered = masteryReady(item)
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
