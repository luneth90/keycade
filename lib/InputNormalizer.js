.pragma library

var SHIFT = 1
var CTRL = 4
var ALT = 8
var SUPER = 64

var modifierNames = [
  { mask: SUPER, label: "SUPER" },
  { mask: CTRL, label: "CTRL" },
  { mask: ALT, label: "ALT" },
  { mask: SHIFT, label: "SHIFT" }
]

var aliases = {
  "ESC": "ESCAPE",
  "ENTER": "RETURN",
  "RET": "RETURN",
  " ": "SPACE",
  "CONTROL": "CTRL",
  "META": "SUPER",
  "WIN": "SUPER",
  "COMMA": ",",
  "PERIOD": ".",
  "SLASH": "/",
  "MINUS": "-",
  "EQUAL": "=",
  "GRAVE": "`"
}

function canonicalKey(value) {
  var raw = String(value === undefined || value === null ? "" : value).trim()
  if (!raw) return ""
  var upper = raw.toUpperCase()
  return aliases[upper] || (raw.length === 1 ? raw.toUpperCase() : upper)
}

function modifierMask(qtModifiers) {
  var value = Number(qtModifiers || 0)
  var mask = 0
  if (value & 0x02000000) mask |= SHIFT
  if (value & 0x04000000) mask |= CTRL
  if (value & 0x08000000) mask |= ALT
  if (value & 0x10000000) mask |= SUPER
  return mask
}

function logicalKey(event) {
  var key = Number(event.key || 0)
  if (key >= 0x20 && key <= 0x7e) return canonicalKey(String.fromCharCode(key))
  var special = {}
  special[0x01000000] = "ESCAPE"
  special[0x01000004] = "RETURN"
  special[0x01000005] = "RETURN"
  special[0x01000012] = "LEFT"
  special[0x01000013] = "UP"
  special[0x01000014] = "RIGHT"
  special[0x01000015] = "DOWN"
  special[0x01000016] = "PAGEUP"
  special[0x01000017] = "PAGEDOWN"
  special[0x01000020] = "SHIFT"
  special[0x01000021] = "CTRL"
  special[0x01000022] = "SUPER"
  special[0x01000023] = "ALT"
  if (special[key]) return special[key]
  if (event.text) return canonicalKey(event.text)
  return "KEY_0X" + key.toString(16).toUpperCase()
}

function normalizeEvent(event) {
  return {
    modMask: modifierMask(event.modifiers),
    logicalKey: logicalKey(event),
    physicalCode: Number(event.nativeScanCode || 0),
    autoRepeat: Boolean(event.isAutoRepeat)
  }
}

function bindingId(binding) {
  var main = binding.matchMode === "physical"
    ? "code:" + Number(binding.keycode || 0)
    : canonicalKey(binding.key)
  return [Number(binding.modMask || 0), main, binding.dispatcher || "", binding.arg || ""].join("|")
}

function chordId(binding) {
  var main = binding.matchMode === "physical"
    ? "code:" + Number(binding.keycode || 0)
    : canonicalKey(binding.key)
  return Number(binding.modMask || 0) + "|" + main
}

function matches(binding, input) {
  if (!binding || !input || Number(binding.modMask || 0) !== Number(input.modMask || 0)) return false
  if (binding.matchMode === "physical") return Number(binding.keycode || 0) === Number(input.physicalCode || 0)
  return canonicalKey(binding.key) === canonicalKey(input.logicalKey)
}

function display(binding) {
  var labels = []
  var mask = Number(binding.modMask || 0)
  for (var i = 0; i < modifierNames.length; i++) {
    if (mask & modifierNames[i].mask) labels.push(modifierNames[i].label)
  }
  var main = binding.matchMode === "physical"
    ? (binding.key || "CODE " + Number(binding.keycode || 0))
    : canonicalKey(binding.key)
  if (main) labels.push(main)
  return labels.join(" + ")
}

function inputDisplay(input) {
  return display({ modMask: input.modMask, key: input.logicalKey, keycode: input.physicalCode, matchMode: "logical" })
}

function isModifier(key) {
  var value = canonicalKey(key)
  return value === "SHIFT" || value === "CTRL" || value === "ALT" || value === "SUPER"
}

