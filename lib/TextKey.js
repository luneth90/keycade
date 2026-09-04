.pragma library

// The "text" judging mode, for training grounds whose application reads
// characters rather than keys.
//
// This is deliberately NOT the keysym mode in InputNormalizer.js, and the two
// must never be merged. Hyprland resolves a keycode to its base-level keysym
// and compares keysyms; issue #1 was the work of deleting a character
// round-trip from that path. A terminal application sees whatever the layout
// and the input method produced, so the character round-trip is the correct
// semantics here - and case is decisive, where the keysym side upper-cases
// everything. Folding either into the other breaks the other one outright.
//
// Authority for the named keys and for what a modifier does to a key:
// Neovim's `:help key-notation` and `:help map-modes`.

var SHIFT = 1
var CTRL = 4
var ALT = 8
var SUPER = 64
// Shift is not compared on a key that produces a character: it is already
// expressed by the character, and comparing it again would reject every
// capital reached some other way. A named key has no character to carry it,
// so there Shift is a modifier like any other - Shift+Left is a chord in its
// own right, and dropping it cost seven real herdr bindings.
//
// Tab is the exception the original rule was written for: Qt reports Backtab
// and Tab as one key, so Shift+Tab and Tab would judge the same. It stays
// refused rather than silently taught as its unshifted twin.
var MODIFIER_MASK = CTRL | ALT | SUPER
var NAMED_MODIFIER_MASK = SHIFT | CTRL | ALT | SUPER
var SHIFT_UNSAFE_NAMES = ["TAB"]

function shiftableName(named) {
  return Boolean(named) && SHIFT_UNSAFE_NAMES.indexOf(named) === -1
}

var MAX_TEXT_CHARS = 8
var MAX_NAMED_CHARS = 16

// `:help key-notation`. The value is this module's own name for the key; the
// keys of this table are every spelling a pack may use for it.
var namedKeys = {
  "BS": "BS",
  "TAB": "TAB",
  "CR": "CR",
  "RETURN": "CR",
  "ENTER": "CR",
  "ESC": "ESC",
  "SPACE": "SPACE",
  "DEL": "DEL",
  "UP": "UP",
  "DOWN": "DOWN",
  "LEFT": "LEFT",
  "RIGHT": "RIGHT",
  "HOME": "HOME",
  "END": "END",
  "PAGEUP": "PAGEUP",
  "PAGEDOWN": "PAGEDOWN",
  "INSERT": "INSERT"
}

// Characters `:help key-notation` spells as named keys because the notation
// itself would otherwise swallow them.
var namedCharacters = {
  "LT": "<",
  "BSLASH": "\\",
  "BAR": "|"
}

function canonicalName(value) {
  var name = String(value === undefined || value === null ? "" : value)
  if (!name.length || name.length > MAX_NAMED_CHARS) return ""
  var upper = name.toUpperCase()
  return Object.prototype.hasOwnProperty.call(namedKeys, upper) ? namedKeys[upper] : ""
}

function namedCharacter(value) {
  var name = String(value === undefined || value === null ? "" : value).toUpperCase()
  return Object.prototype.hasOwnProperty.call(namedCharacters, name) ? namedCharacters[name] : ""
}

// The subset of Qt's modifiers this mode compares. Shift is left out on
// purpose; see MODIFIER_MASK.
function modifierMask(qtModifiers) {
  var value = Number(qtModifiers || 0)
  var mask = 0
  if (value & 0x04000000) mask |= CTRL
  if (value & 0x08000000) mask |= ALT
  if (value & 0x10000000) mask |= SUPER
  return mask
}

function shiftHeld(qtModifiers) {
  return Boolean(Number(qtModifiers || 0) & 0x02000000)
}

var qtNamedKeys = {}
// Space is a named key here even though it produces a character: with a
// modifier held the character never arrives, and <leader> resolves to it.
qtNamedKeys[0x20] = "SPACE"
qtNamedKeys[0x01000000] = "ESC"
qtNamedKeys[0x01000001] = "TAB"
qtNamedKeys[0x01000002] = "TAB"
qtNamedKeys[0x01000003] = "BS"
qtNamedKeys[0x01000004] = "CR"
qtNamedKeys[0x01000005] = "CR"
qtNamedKeys[0x01000006] = "INSERT"
qtNamedKeys[0x01000007] = "DEL"
qtNamedKeys[0x01000010] = "HOME"
qtNamedKeys[0x01000011] = "END"
qtNamedKeys[0x01000012] = "LEFT"
qtNamedKeys[0x01000013] = "UP"
qtNamedKeys[0x01000014] = "RIGHT"
qtNamedKeys[0x01000015] = "DOWN"
qtNamedKeys[0x01000016] = "PAGEUP"
qtNamedKeys[0x01000017] = "PAGEDOWN"

// The letter a modifier is being held with. With Ctrl down the terminal
// receives a control character rather than the letter, so the key itself is
// the only thing left that still names it.
function baseCharacter(qtKey) {
  var key = Number(qtKey || 0)
  return key >= 0x20 && key <= 0x7e ? String.fromCharCode(key).toLowerCase() : ""
}

// One key press, reduced to what this mode compares.
function normalizeEvent(event) {
  var mods = modifierMask(event.modifiers)
  var named = qtNamedKeys[Number(event.key || 0)] || ""
  var text = String(event.text === undefined || event.text === null ? "" : event.text)
  if (text === " ") { named = "SPACE"; text = "" }
  // A control character is not the text the application would see as input;
  // with a modifier down the key is what names the step.
  if (mods || text.length > MAX_TEXT_CHARS || /[\u0000-\u001f\u007f]/.test(text)) text = ""
  // Only a named key carries Shift; see MODIFIER_MASK.
  if (shiftableName(named) && shiftHeld(event.modifiers)) mods |= SHIFT
  return {
    mods: mods,
    named: named,
    text: text,
    base: baseCharacter(event.key),
    autoRepeat: Boolean(event.isAutoRepeat)
  }
}

// A pack step, checked and reduced to the same shape. Returns null when the
// step names nothing this mode can judge - the caller drops the whole entry.
function normalizedStep(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null
  var named = canonicalName(value.named)
  var mods = Number(value.mods || 0)
      & (shiftableName(named) ? NAMED_MODIFIER_MASK : MODIFIER_MASK)
  if (named) {
    // Refusing rather than quietly dropping the Shift: a card that asked for
    // Shift+Tab and accepted Tab would be teaching the wrong chord.
    if (!shiftableName(named) && (Number(value.mods || 0) & SHIFT)) return null
    return { mods: mods, named: named, text: "" }
  }
  var character = namedCharacter(value.named)
  var text = character || String(value.text === undefined || value.text === null ? "" : value.text)
  if (!text.length || text.length > MAX_TEXT_CHARS) return null
  if (/[\u0000-\u001f\u007f]/.test(text)) return null
  if (text === " ") return { mods: mods, named: "SPACE", text: "" }
  return { mods: mods, named: "", text: text }
}

// A ground's configurable prefix, as a person writes it: LazyVim's leader is a
// bare character, tmux's prefix is "C-b", herdr's is "ctrl+a". One parser for
// all three, because they are one idea - a key every other binding hangs off.
// Returns null when it cannot be read, and the caller keeps its default.
var specModifiers = {
  "C": CTRL, "CTRL": CTRL, "CONTROL": CTRL,
  "A": ALT, "ALT": ALT, "M": ALT, "META": ALT,
  "S": SUPER, "SUPER": SUPER, "CMD": SUPER,
  "SHIFT": SHIFT
}

function parseKeySpec(value) {
  var text = String(value === undefined || value === null ? "" : value)
  if (!text.length || text.length > 32) return null
  // A bare character is the whole answer - that is what a leader usually is,
  // space included, so this runs before anything is trimmed away.
  if (text.length === 1) return normalizedStep({ mods: 0, text: text })
  var body = text.trim()
  if (!body.length) return null
  var mods = 0
  // "C-b", "ctrl+a", "M-x" - either separator, either spelling.
  while (true) {
    var match = /^([A-Za-z]+)\s*[-+]\s*(.+)$/.exec(body)
    if (!match) break
    var name = match[1].toUpperCase()
    if (!Object.prototype.hasOwnProperty.call(specModifiers, name)) break
    mods |= specModifiers[name]
    body = match[2]
  }
  if (!body.length) return null
  // "<Space>" and "Space" both name the key, and so does a bare " ".
  var bare = body.replace(/^<|>$/g, "")
  var named = canonicalName(bare)
  if (named) return normalizedStep({ mods: mods, named: named })
  var character = namedCharacter(bare)
  if (character) return normalizedStep({ mods: mods, text: character })
  if (bare.length !== 1) return null
  // With a modifier held the letter's case is not part of the answer, so the
  // stored form is canonical - the same rule the pack builder applies.
  return normalizedStep({ mods: mods, text: mods ? bare.toLowerCase() : bare })
}

// A complete Vim lhs, used for the deliberately small set of literal
// vim.keymap.set/del calls the machine reader can prove. Pack collection has
// the same parser in Python; tests/fixtures/text-keys.js keeps the two sides
// on one vocabulary.
var notationModifiers = { "C": CTRL, "A": ALT, "M": ALT }

function notationStep(token) {
  if (token === "\ue000") return { option: "leader" }
  if (token === "\ue001") return { option: "localleader" }
  if (token.charAt(0) !== "<")
    return token === " " ? { mods: 0, named: "SPACE" } : { mods: 0, text: token }
  if (token.charAt(token.length - 1) !== ">" || token.length < 3) return null
  var body = token.slice(1, -1)
  var mods = 0
  var shifted = false
  while (body.length > 2 && body.charAt(1) === "-") {
    var prefix = body.charAt(0).toUpperCase()
    if (prefix === "D") return null
    if (prefix === "S") {
      if (shifted || mods) return null
      shifted = true
    } else if (notationModifiers[prefix] !== undefined) {
      if (shifted) return null
      mods |= notationModifiers[prefix]
    } else break
    body = body.slice(2)
  }
  if (!body.length) return null
  var named = canonicalName(body)
  if (named) {
    if (shifted) {
      if (!shiftableName(named)) return null
      mods |= SHIFT
    }
    return { mods: mods, named: named }
  }
  var character = namedCharacter(body)
  if (character) {
    if (shifted) return null
    return { mods: mods, text: character }
  }
  if (body.length !== 1) return null
  if (shifted) {
    if (body.toUpperCase() === body.toLowerCase()) return null
    return { mods: 0, text: body.toUpperCase() }
  }
  return { mods: mods, text: mods ? body.toLowerCase() : body }
}

function parseNotation(value) {
  var lhs = String(value === undefined || value === null ? "" : value)
  if (!lhs.length || lhs.length > 128) return null
  lhs = lhs.replace(/<leader>/gi, "\ue000").replace(/<localleader>/gi, "\ue001")
  var steps = []
  var index = 0
  while (index < lhs.length && steps.length <= 8) {
    var token = lhs.charAt(index)
    if (token === "<") {
      var end = lhs.indexOf(">", index)
      if (end < 0) return null
      token = lhs.slice(index, end + 1)
      index = end + 1
    } else {
      // QString.length counts UTF-16 code units. Keep one supplementary
      // Unicode code point together so a literal mapping such as an emoji is
      // one keypress, as it is in Python's collector and in Qt's event.text.
      var first = lhs.charCodeAt(index)
      var width = first >= 0xD800 && first <= 0xDBFF
          && index + 1 < lhs.length
          && lhs.charCodeAt(index + 1) >= 0xDC00
          && lhs.charCodeAt(index + 1) <= 0xDFFF ? 2 : 1
      token = lhs.slice(index, index + width)
      index += width
    }
    var step = notationStep(token)
    if (!step) return null
    steps.push(step)
  }
  return steps.length > 0 && steps.length <= 8 ? steps : null
}

function matches(step, input) {
  if (!step || !input) return false
  if (Number(step.mods || 0) !== Number(input.mods || 0)) return false
  if (step.named) return step.named === input.named
  if (input.named) return false
  // With no modifier the character is the answer, capitals included: `g` and
  // `G` are two different mappings, and Shift is already inside the character.
  if (!step.mods) return Boolean(input.text) && input.text === step.text
  // With a modifier the letter is the answer and its case is not: Vim reads
  // <C-w> and <C-W> as the same mapping.
  return Boolean(input.base) && input.base === String(step.text).toLowerCase()
}

// What a step reads as on a card, and what an unmatched key press reads as in
// the feedback line. Both go through SafeText before they are shown.
var namedLabels = {
  "BS": "BKSP", "TAB": "TAB", "CR": "ENTER", "ESC": "ESC", "SPACE": "SPACE",
  "DEL": "DEL", "UP": "↑", "DOWN": "↓", "LEFT": "←", "RIGHT": "→",
  "HOME": "HOME", "END": "END", "PAGEUP": "PGUP", "PAGEDOWN": "PGDN",
  "INSERT": "INS"
}

function modifierLabels(mods) {
  var labels = []
  if (mods & SUPER) labels.push("SUPER")
  if (mods & CTRL) labels.push("CTRL")
  if (mods & ALT) labels.push("ALT")
  if (mods & SHIFT) labels.push("SHIFT")
  return labels
}

function labels(step) {
  if (!step) return []
  var parts = modifierLabels(Number(step.mods || 0))
  if (step.named) parts.push(namedLabels[step.named] || step.named)
  else if (step.text) parts.push(step.text)
  return parts
}

function inputLabels(input) {
  if (!input) return []
  var parts = modifierLabels(Number(input.mods || 0))
  if (input.named) parts.push(namedLabels[input.named] || input.named)
  else if (input.text) parts.push(input.text)
  else if (input.base) parts.push(input.base)
  return parts
}
