.pragma library
.import "InputNormalizer.js" as Normalizer
.import "Categorizer.js" as Categorizer

var blockedFlags = ["release", "long-press", "mouse", "catch-all", "click", "drag", "ignore-mods", "separate"]

function hasBlockedFlag(binding) {
  var flags = Array.isArray(binding.flags) ? binding.flags : []
  for (var i = 0; i < blockedFlags.length; i++) {
    if (flags.indexOf(blockedFlags[i]) !== -1) return true
  }
  return false
}

function reason(binding) {
  if (!binding) return "invalid"
  if (binding.dontInhibit) return "dont-inhibit"
  if (binding.allowInputCapture) return "allow-input-capture"
  if (hasBlockedFlag(binding)) return "unsupported-trigger"
  if (String(binding.submap || "")) return "submap"
  if (binding.matchMode === "physical" && Number(binding.keycode || 0) <= 0) return "missing-keycode"
  if (binding.matchMode !== "physical" && !binding.key) return "missing-key"
  if (/^(mouse:|mouse_|switch:)/i.test(String(binding.key || ""))) return "unsupported-key"
  if (Normalizer.isModifier(binding.key)) return "modifier-only"
  if (!Categorizer.actionName(binding)) return "missing-description"
  return ""
}

function filter(bindings, options) {
  var opts = options || {}
  var candidates = []
  var signatures = {}
  for (var i = 0; i < bindings.length; i++) {
    var binding = bindings[i]
    if (reason(binding)) continue
    var chord = Normalizer.chordId(binding)
    if (!signatures[chord]) signatures[chord] = {}
    signatures[chord][String(binding.dispatcher || "") + "|" + String(binding.arg || "") + "|" + String(binding.description || "")] = true
    candidates.push(binding)
  }

  var eligible = []
  var excluded = []
  var seen = {}
  for (var j = 0; j < candidates.length; j++) {
    var item = candidates[j]
    var itemChord = Normalizer.chordId(item)
    if (Object.keys(signatures[itemChord]).length > 1) {
      excluded.push({ binding: item, reason: "ambiguous-chord" })
      continue
    }
    if (seen[itemChord]) continue
    seen[itemChord] = true
    item.category = Categorizer.category(item)
    item.actionName = Categorizer.actionName(item)
    if (item.category === "uncategorized" && !opts.includeUncategorized) {
      excluded.push({ binding: item, reason: "uncategorized" })
      continue
    }
    if (opts.levelOneOnly && item.category !== "navigation") {
      excluded.push({ binding: item, reason: "locked-category" })
      continue
    }
    item.id = Normalizer.bindingId(item)
    eligible.push(item)
  }
  return { eligible: eligible, excluded: excluded }
}
