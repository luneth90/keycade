.pragma library

var MAX_CARDS = 24
var MAX_RESULTS = 24
var MAX_BINDING_ID = 2300
var MAX_REACTIONS = 10
var MAX_COUNTER = 1000000000
var FORBIDDEN_KEYS = ["__proto__", "constructor", "prototype"]

function safeMap() { return Object.create(null) }

function safeId(value) {
  var id = String(value === undefined || value === null ? "" : value)
  return id && id.length <= MAX_BINDING_ID && FORBIDDEN_KEYS.indexOf(id) === -1 ? id : ""
}

// Exclusions ride in settings.json, whose whole payload is capped at 64 KiB
// (StateStore.fileLimits and bin/state-store FILE_LIMITS). A single binding id
// can reach MAX_BINDING_ID on its own, so a count cap alone is not a bound:
// cap the serialized array too, and refuse a new entry rather than truncate.
var MAX_EXCLUDED_ENTRIES = 64
var MAX_EXCLUDED_CHARS = 8 * 1024
// Training grounds are named by the profile contract; only "hyprland" exists
// today. Entries from another profile are kept but never consumed here, so two
// grounds cannot clear each other's exclusions.
var PROFILE_PATTERN = /^[a-z][a-z0-9-]{0,31}$/

function excludedEntry(profile, bindingId) {
  var name = String(profile === undefined || profile === null ? "" : profile)
  var id = safeId(bindingId)
  return id && PROFILE_PATTERN.test(name) ? name + ":" + id : ""
}

function excludedList(values) {
  var list = []
  if (!Array.isArray(values)) return list
  var seen = safeMap()
  var chars = 2
  for (var index = 0; index < values.length && list.length < MAX_EXCLUDED_ENTRIES; index++) {
    var value = values[index]
    if (typeof value !== "string") continue
    var separator = value.indexOf(":")
    if (separator <= 0) continue
    var entry = excludedEntry(value.slice(0, separator), value.slice(separator + 1))
    if (!entry || seen[entry]) continue
    var cost = entry.length + 3
    if (chars + cost > MAX_EXCLUDED_CHARS) break
    chars += cost
    seen[entry] = true
    list.push(entry)
  }
  return list
}

// Consuming the stored array always goes through excludedList first, so the
// eligibility side never trusts what the settings file happened to hold.
function excludedSet(values, profile) {
  var prefix = String(profile === undefined || profile === null ? "" : profile) + ":"
  var set = safeMap()
  var list = excludedList(values)
  for (var index = 0; index < list.length; index++) {
    if (list[index].slice(0, prefix.length) === prefix)
      set[list[index].slice(prefix.length)] = true
  }
  return set
}

// Returns the new array, or null when the entry is invalid or does not fit.
function withExclusion(values, profile, bindingId) {
  var entry = excludedEntry(profile, bindingId)
  if (!entry) return null
  var list = excludedList(values)
  if (list.indexOf(entry) !== -1) return list
  var next = excludedList(list.concat([entry]))
  return next.indexOf(entry) === -1 ? null : next
}

function withoutExclusion(values, profile, bindingId) {
  var list = excludedList(values)
  var entry = excludedEntry(profile, bindingId)
  var index = entry ? list.indexOf(entry) : -1
  return index === -1 ? list : list.slice(0, index).concat(list.slice(index + 1))
}

function boundedInteger(value, minimum, maximum) {
  var number = typeof value === "number" && isFinite(value) ? value : minimum
  return Math.floor(Math.max(minimum, Math.min(maximum, number)))
}

function bindingMap(bindings) {
  var map = safeMap()
  for (var index = 0; index < Math.min((bindings || []).length, 2000); index++) {
    var id = safeId(bindings[index].id)
    if (id) map[id] = bindings[index]
  }
  return map
}

function cardsFrom(deck, startIndex) {
  var cards = []
  for (var index = Math.max(0, startIndex); index < deck.length && cards.length < MAX_CARDS; index++) {
    var cardValue = deck[index]
    cards.push({
      bindingId: cardValue.binding.id,
      tier: cardValue.tier,
      queue: cardValue.queue,
      remedial: Boolean(cardValue.remedial)
    })
  }
  return cards
}

function restoreCards(cards, bindings) {
  var map = bindingMap(bindings)
  var restored = []
  for (var index = 0; index < Math.min((cards || []).length, MAX_CARDS); index++) {
    var saved = cards[index]
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) continue
    var binding = map[safeId(saved.bindingId)]
    var tier = ["guided", "learning", "maintenance"].indexOf(String(saved.tier)) !== -1
        ? String(saved.tier) : "learning"
    var queue = ["due", "unseen", "weak", "maintenance", "remedial"].indexOf(String(saved.queue)) !== -1
        ? String(saved.queue) : "weak"
    if (binding) restored.push({
      binding: binding,
      tier: tier,
      queue: queue,
      remedial: Boolean(saved.remedial)
    })
  }
  return restored
}

function canResume(session, runId, bindings, cardLimit) {
  var limit = Math.max(1, Number(cardLimit || 24))
  if (!session || session.schemaVersion !== 1 || Number(session.runId || 0) !== Number(runId)
      || !Array.isArray(session.cards) || Number(session.offset || 0) >= limit) return false
  return restoreCards(session.cards, bindings).length > 0
}

function serializableResults(results) {
  var output = safeMap()
  Object.keys(results || {}).slice(0, MAX_RESULTS).forEach(function(rawId) {
    var id = safeId(rawId)
    if (!id) return
    var row = results[id]
    if (!row || typeof row !== "object" || Array.isArray(row)) return
    output[id] = {
      misses: boundedInteger(row.misses, 0, MAX_COUNTER),
      reactions: Array.isArray(row.reactions) ? row.reactions.slice(-MAX_REACTIONS).map(function(value) {
        return boundedInteger(value, 0, 600000)
      }) : []
    }
  })
  return output
}

function restoreResults(saved, bindings) {
  var map = bindingMap(bindings)
  var restored = safeMap()
  if (!saved || typeof saved !== "object" || Array.isArray(saved)) return restored
  Object.keys(saved).slice(0, MAX_RESULTS).forEach(function(rawId) {
    var id = safeId(rawId)
    var row = id ? saved[id] : null
    if (id && map[id] && row && typeof row === "object" && !Array.isArray(row)) restored[id] = {
      binding: map[id],
      misses: boundedInteger(row.misses, 0, MAX_COUNTER),
      reactions: Array.isArray(row.reactions) ? row.reactions.slice(-MAX_REACTIONS).map(function(value) {
        return boundedInteger(value, 0, 600000)
      }) : []
    }
  })
  return restored
}

function sanitize(value) {
  if (!value || typeof value !== "object" || Array.isArray(value) || value.schemaVersion !== 1
      || !Array.isArray(value.cards)) return null
  var result = {
    schemaVersion: 1,
    runId: boundedInteger(value.runId, 1, MAX_COUNTER),
    savedAt: boundedInteger(value.savedAt, 0, 9000000000000000),
    offset: boundedInteger(value.offset, 0, MAX_CARDS),
    cards: [],
    correctionRequired: value.correctionRequired === true,
    currentBindingId: safeId(value.currentBindingId),
    runReviewTarget: boundedInteger(value.runReviewTarget, 0, MAX_CARDS),
    runNewTarget: boundedInteger(value.runNewTarget, 0, MAX_CARDS),
    correct: boundedInteger(value.correct, 0, MAX_CARDS),
    attempts: boundedInteger(value.attempts, 0, MAX_COUNTER),
    newLearned: boundedInteger(value.newLearned, 0, MAX_CARDS),
    masteredGained: boundedInteger(value.masteredGained, 0, MAX_CARDS),
    reactions: Array.isArray(value.reactions) ? value.reactions.slice(-MAX_REACTIONS).map(function(item) {
      return boundedInteger(item, 0, 600000)
    }) : [],
    pendingReinforcements: Array.isArray(value.pendingReinforcements)
        ? value.pendingReinforcements.slice(0, MAX_CARDS).map(safeId).filter(Boolean) : [],
    runResults: safeMap()
  }
  for (var index = 0; index < Math.min(value.cards.length, MAX_CARDS); index++) {
    var card = value.cards[index]
    if (!card || typeof card !== "object" || Array.isArray(card)) continue
    var bindingId = safeId(card.bindingId)
    if (!bindingId) continue
    result.cards.push({
      bindingId: bindingId,
      tier: ["guided", "learning", "maintenance"].indexOf(String(card.tier)) !== -1
          ? String(card.tier) : "learning",
      queue: ["due", "unseen", "weak", "maintenance", "remedial"].indexOf(String(card.queue)) !== -1
          ? String(card.queue) : "weak",
      remedial: card.remedial === true
    })
  }
  if (value.runResults && typeof value.runResults === "object" && !Array.isArray(value.runResults)) {
    Object.keys(value.runResults).slice(0, MAX_RESULTS).forEach(function(rawId) {
      var id = safeId(rawId)
      var row = id ? value.runResults[id] : null
      if (!id || !row || typeof row !== "object" || Array.isArray(row)) return
      result.runResults[id] = {
        misses: boundedInteger(row.misses, 0, MAX_COUNTER),
        reactions: Array.isArray(row.reactions) ? row.reactions.slice(-MAX_REACTIONS).map(function(item) {
          return boundedInteger(item, 0, 600000)
        }) : []
      }
    })
  }
  return result
}
