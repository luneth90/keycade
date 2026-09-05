.pragma library
.import "../TextKey.js" as TextKey

// Pure, side-effect-free validation shared by the live source and the
// offscreen test suite. Limits here are consumer limits: producer limits do
// not cross the JSON process boundary by implication.
var MAX_BINDINGS = 512
var MAX_CATEGORIES = 32
var MAX_STEPS = 8
var MAX_ALTERNATES = 4

function safeText(value, limit) {
  if (typeof value !== "string") return ""
  var text = value
  if (!text.length || text.length > limit) return ""
  return text.replace(/[\u0000-\u001f\u007f-\u009f\u200e\u200f\u202a-\u202e\u2066-\u2069]/g, " ")
}

function usableKey(value) {
  var key = String(value === undefined || value === null ? "" : value)
  return key && ["__proto__", "constructor", "prototype"].indexOf(key) === -1 ? key : ""
}

function acceptedCategories(value, limit) {
  var maximum = Number(limit || MAX_CATEGORIES)
  if (!Array.isArray(value) || !value.length || value.length > maximum) return null
  var accepted = []
  var seen = Object.create(null)
  for (var index = 0; index < value.length; index++) {
    var name = usableKey(safeText(value[index], 32))
    if (!name || seen[name]) return null
    seen[name] = true
    accepted.push(name)
  }
  return accepted
}

function acceptedTmuxOptions(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  if (typeof value.prefix !== "string"
      || (value.prefix2 !== undefined && typeof value.prefix2 !== "string")) return null
  var prefix = value.prefix
  var prefix2 = value.prefix2 || ""
  if (!prefix.length || prefix.length > 32 || /[\u0000-\u001f\u007f]/.test(prefix)) return null
  if (prefix2.length > 32 || /[\u0000-\u001f\u007f]/.test(prefix2)) return null
  if (!TextKey.parseKeySpec(prefix) || (prefix2 && !TextKey.parseKeySpec(prefix2))) return null
  var result = ({ prefix: prefix })
  if (prefix2 && prefix2 !== prefix) result.prefix2 = prefix2
  return result
}

function acceptedTmuxStep(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  if (value.option !== undefined) {
    var option = safeText(value.option, 32)
    return option === "prefix" || option === "prefix2" ? { option: option } : null
  }
  return TextKey.normalizedStep(value)
}

function acceptedTmuxSteps(value) {
  if (!Array.isArray(value) || !value.length || value.length > MAX_STEPS) return null
  var accepted = []
  for (var index = 0; index < value.length; index++) {
    var step = acceptedTmuxStep(value[index])
    if (!step || step.named === "ESC") return null
    accepted.push(step)
  }
  return accepted
}

function acceptedTmuxBinding(record, categories) {
  if (!record || typeof record !== "object" || Array.isArray(record)) return null
  var localId = usableKey(safeText(record.localId, 128))
  var description = safeText(record.desc, 512)
  var category = usableKey(safeText(record.category, 32))
  var context = safeText(record.context, 32)
  if (!localId || !description || context !== "prefix"
      || categories.indexOf(category) === -1) return null
  if (!Array.isArray(record.extras) || record.extras.length) return null
  var steps = acceptedTmuxSteps(record.steps)
  if (!steps) return null
  if (record.alternates !== undefined && !Array.isArray(record.alternates)) return null
  if (Array.isArray(record.alternates) && record.alternates.length > MAX_ALTERNATES) return null
  var alternates = []
  for (var other = 0; other < (record.alternates || []).length; other++) {
    var sequence = acceptedTmuxSteps(record.alternates[other])
    if (!sequence) return null
    alternates.push(sequence)
  }
  return {
    localId: localId, context: context, notation: safeText(record.notation, 128),
    steps: steps, alternates: alternates, category: category,
    descKey: safeText(record.descKey, 128), desc: description, extras: []
  }
}

function acceptedProvenance(value) {
  var provenance = value && typeof value === "object" && !Array.isArray(value) ? value : ({})
  var rawSource = provenance.source && typeof provenance.source === "object"
      && !Array.isArray(provenance.source) ? provenance.source : ({})
  return {
    upstream: safeText(provenance.upstream, 64),
    authority: safeText(provenance.authority, 128),
    source: {
      url: safeText(rawSource.url, 256), commit: safeText(rawSource.commit, 64),
      tag: safeText(rawSource.tag, 32), date: safeText(rawSource.date, 32),
      checksum: safeText(rawSource.checksum, 64)
    },
    generatedAt: safeText(provenance.generatedAt, 32),
    generator: safeText(provenance.generator, 64)
  }
}

function acceptedTmuxPack(record) {
  if (!record || typeof record !== "object" || Array.isArray(record)
      || record.schemaVersion !== 1 || record.profile !== "tmux"
      || record.judgeMode !== "text" || record.available !== true
      || !Array.isArray(record.bindings) || !record.bindings.length
      || record.bindings.length > MAX_BINDINGS) return null
  var options = acceptedTmuxOptions(record.options)
  var categories = acceptedCategories(record.categories, MAX_CATEGORIES)
  if (!options || !categories) return null
  var bindings = []
  var seen = Object.create(null)
  for (var index = 0; index < record.bindings.length; index++) {
    var item = acceptedTmuxBinding(record.bindings[index], categories)
    if (!item || seen[item.localId]) return null
    seen[item.localId] = true
    bindings.push(item)
  }
  return {
    schemaVersion: 1, profile: "tmux", judgeMode: "text",
    contexts: ["prefix"], extras: [], categories: categories,
    provenance: acceptedProvenance(record.provenance), bindings: bindings
  }
}
