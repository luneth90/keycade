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

var shiftedKeyBases = {}
shiftedKeyBases["!"] = "1"
shiftedKeyBases["@"] = "2"
shiftedKeyBases["#"] = "3"
shiftedKeyBases["$"] = "4"
shiftedKeyBases["%"] = "5"
shiftedKeyBases["^"] = "6"
shiftedKeyBases["&"] = "7"
shiftedKeyBases["*"] = "8"
shiftedKeyBases["("] = "9"
shiftedKeyBases[")"] = "0"
shiftedKeyBases["_"] = "-"
shiftedKeyBases["+"] = "="
shiftedKeyBases["{"] = "["
shiftedKeyBases["}"] = "]"
shiftedKeyBases["|"] = "\\"
shiftedKeyBases[":"] = ";"
shiftedKeyBases['"'] = "'"
shiftedKeyBases["<"] = ","
shiftedKeyBases[">"] = "."
shiftedKeyBases["?"] = "/"
shiftedKeyBases["~"] = "`"

function canonicalKey(value) {
  var source = String(value === undefined || value === null ? "" : value)
  if (source === "\t") return "TAB"
  var raw = source.trim()
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
  var scanCode = Number(event.nativeScanCode || 0)
  var modifiers = modifierMask(event.modifiers)
  if (String(event.text || "") === "\t") return "TAB"
  if ((scanCode === 15 || scanCode === 23) && (key === 0 || key === 0x01ffffff)) return "TAB"
  if (key >= 0x20 && key <= 0x7e) {
    var character = String.fromCharCode(key)
    if ((modifiers & SHIFT) && shiftedKeyBases[character]) return shiftedKeyBases[character]
    return canonicalKey(character)
  }
  if (key >= 0x01000030 && key <= 0x01000052) return "F" + (key - 0x01000030 + 1)
  var special = {}
  special[0x01000000] = "ESCAPE"
  special[0x01000001] = "TAB"
  special[0x01000002] = "TAB"
  special[0x01000003] = "BACKSPACE"
  special[0x01000004] = "RETURN"
  special[0x01000005] = "RETURN"
  special[0x01000006] = "INSERT"
  special[0x01000007] = "DELETE"
  special[0x01000008] = "PAUSE"
  special[0x01000009] = "PRINT"
  special[0x0100000a] = "SYSREQ"
  special[0x0100000b] = "CLEAR"
  special[0x01000010] = "HOME"
  special[0x01000011] = "END"
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
  special[0x01000070] = "XF86AUDIOLOWERVOLUME"
  special[0x01000071] = "XF86AUDIOMUTE"
  special[0x01000072] = "XF86AUDIORAISEVOLUME"
  special[0x01000080] = "XF86AUDIOPLAY"
  special[0x01000081] = "XF86AUDIOSTOP"
  special[0x01000082] = "XF86AUDIOPREV"
  special[0x01000083] = "XF86AUDIONEXT"
  special[0x01000085] = "XF86AUDIOPAUSE"
  special[0x01000086] = "XF86AUDIOPLAY"
  special[0x010000b2] = "XF86MONBRIGHTNESSUP"
  special[0x010000b3] = "XF86MONBRIGHTNESSDOWN"
  special[0x010000b4] = "XF86KBDLIGHTONOFF"
  special[0x010000b5] = "XF86KBDBRIGHTNESSUP"
  special[0x010000b6] = "XF86KBDBRIGHTNESSDOWN"
  special[0x010000b7] = "XF86POWEROFF"
  special[0x010000b9] = "XF86EJECT"
  special[0x010000cb] = "XF86CALCULATOR"
  special[0x01000110] = "XF86TOUCHPADTOGGLE"
  special[0x01000111] = "XF86TOUCHPADON"
  special[0x01000112] = "XF86TOUCHPADOFF"
  special[0x01000113] = "XF86AUDIOMICMUTE"
  if (special[key]) return special[key]
  if (event.text) {
    var text = String(event.text)
    if ((modifiers & SHIFT) && shiftedKeyBases[text]) return shiftedKeyBases[text]
    return canonicalKey(text)
  }
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

function trainingKey(value, options) {
  var key = canonicalKey(value)
  if (options && options.appleKeyboard && key === "DELETE") return "BACKSPACE"
  return key
}

function chordId(binding, options) {
  var main = binding.matchMode === "physical"
    ? "code:" + Number(binding.keycode || 0)
    : trainingKey(binding.key, options)
  return Number(binding.modMask || 0) + "|" + main
}

function matches(binding, input, options) {
  if (!binding || !input || Number(binding.modMask || 0) !== Number(input.modMask || 0)) return false
  if (binding.matchMode === "physical") return Number(binding.keycode || 0) === Number(input.physicalCode || 0)
  var expected = canonicalKey(binding.key)
  var received = canonicalKey(input.logicalKey)
  if (expected === received) return true
  return Boolean(options && options.appleKeyboard && expected === "DELETE" && received === "BACKSPACE")
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
