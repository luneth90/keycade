.pragma library
.import "InputNormalizer.js" as Normalizer
.import "Categorizer.js" as Categorizer
.import "Session.js" as Session

var blockedFlags = ["release", "long-press", "mouse", "catch-all", "click", "drag", "ignore-mods", "separate"]
// Keys a compact keyboard is not guaranteed to carry. The list is the
// navigation/editing cluster that 60%/65%/75% boards and HHKB drop, plus the
// print/system keys above it. DELETE belongs here for the same reason the
// rest of the cluster does: issue #3 reports CTRL+ALT+DELETE being impossible
// to press, and no keymap can tell us the key is missing, because the keymap
// describes the layout rather than the hardware.
var deviceSpecialKeys = [
  "PRINT",
  "SYSREQ",
  "PAUSE",
  "CLEAR",
  "HOME",
  "END",
  "INSERT",
  "PAGEUP",
  "PAGEDOWN",
  "DELETE"
]

function hasBlockedFlag(binding) {
  var flags = Array.isArray(binding.flags) ? binding.flags : []
  for (var i = 0; i < blockedFlags.length; i++) {
    if (flags.indexOf(blockedFlags[i]) !== -1) return true
  }
  return false
}

function isDeviceSpecialKey(binding) {
  var key = Normalizer.canonicalKey(binding && binding.key)
  if (/^F(?:[1-9]|[12][0-9]|3[0-5])$/.test(key)) return true
  if (/^XF86/.test(key)) return true
  if (deviceSpecialKeys.indexOf(key) !== -1) return true
  return binding && binding.matchMode === "physical" && !key
}

function reason(binding, options) {
  if (!binding) return "invalid"
  if (binding.dontInhibit) return "dont-inhibit"
  if (binding.allowInputCapture) return "allow-input-capture"
  if (hasBlockedFlag(binding)) return "unsupported-trigger"
  if (String(binding.submap || "")) return "submap"
  if (binding.matchMode === "physical" && Number(binding.keycode || 0) <= 0) return "missing-keycode"
  if (binding.matchMode !== "physical" && !binding.key) return "missing-key"
  // With a reproduced keymap, a key absent from it has no base-level keycode
  // on this layout, so Hyprland would never fire the bind either. Training it
  // would teach a shortcut that cannot be pressed.
  if (options && options.keymapAuthoritative && binding.matchMode !== "physical"
      && !Object.prototype.hasOwnProperty.call(options.keycodeMap || {},
                                               Normalizer.canonicalKey(binding.key)))
    return "unreachable-on-layout"
  if (isDeviceSpecialKey(binding)) return "device-special-key"
  if (/^(mouse:|mouse_|switch:)/i.test(String(binding.key || ""))) return "unsupported-key"
  if (Normalizer.isModifier(binding.key)) return "modifier-only"
  if (!Categorizer.actionName(binding)) return "missing-description"
  return ""
}

function filter(bindings, options) {
  var opts = options || {}
  // Re-derived from the stored array on every call: the eligibility side never
  // trusts what settings.json happened to hold.
  var userExcluded = Session.excludedSet(opts.excludedBindings, opts.profile || "hyprland")
  var candidates = []
  var signatures = {}
  for (var i = 0; i < bindings.length; i++) {
    var binding = bindings[i]
    if (reason(binding, opts)) continue
    var chord = Normalizer.chordId(binding, opts)
    if (!signatures[chord]) signatures[chord] = {}
    signatures[chord][String(binding.dispatcher || "") + "|" + String(binding.arg || "") + "|" + String(binding.description || "")] = true
    candidates.push(binding)
  }

  var eligible = []
  var excluded = []
  var seen = {}
  for (var j = 0; j < candidates.length; j++) {
    var item = candidates[j]
    var itemChord = Normalizer.chordId(item, opts)
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
    item.id = Normalizer.bindingId(item)
    // Deliberately after the signature scan above: dropping a bind here must
    // not change which chords count as ambiguous, or excluding one bind would
    // silently readmit another that shares its chord.
    if (Object.prototype.hasOwnProperty.call(userExcluded, item.id)) {
      excluded.push({ binding: item, reason: "user-excluded" })
      continue
    }
    eligible.push(item)
  }
  return { eligible: eligible, excluded: excluded }
}
