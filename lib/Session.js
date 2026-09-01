.pragma library

function bindingMap(bindings) {
  var map = {}
  for (var index = 0; index < bindings.length; index++) map[bindings[index].id] = bindings[index]
  return map
}

function cardsFrom(deck, startIndex) {
  var cards = []
  for (var index = startIndex; index < deck.length; index++) {
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
  for (var index = 0; index < (cards || []).length; index++) {
    var saved = cards[index]
    var binding = map[saved.bindingId]
    if (binding) restored.push({
      binding: binding,
      tier: saved.tier,
      queue: saved.queue,
      remedial: Boolean(saved.remedial)
    })
  }
  return restored
}

function canResume(session, runId, bindings) {
  if (!session || session.schemaVersion !== 1 || Number(session.runId || 0) !== Number(runId)
      || !Array.isArray(session.cards)) return false
  return restoreCards(session.cards, bindings).length > 0
}

function serializableResults(results) {
  var output = {}
  Object.keys(results || {}).forEach(function(id) {
    var row = results[id]
    output[id] = { misses: Number(row.misses || 0), reactions: row.reactions || [] }
  })
  return output
}

function restoreResults(saved, bindings) {
  var map = bindingMap(bindings)
  var restored = {}
  Object.keys(saved || {}).forEach(function(id) {
    if (map[id]) restored[id] = {
      binding: map[id],
      misses: Number(saved[id].misses || 0),
      reactions: Array.isArray(saved[id].reactions) ? saved[id].reactions : []
    }
  })
  return restored
}
