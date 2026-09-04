.pragma library

// Training grounds. A profile answers what a run is made of: where its
// bindings come from, how an answer is judged, and what shape an answer has.
// The registry is static and decided at build time - nothing here is read from
// the user's machine, and a profile cannot be added by data alone.
//
// Only "hyprland" exists today. It is written out in full rather than left
// implicit so the second training ground is a new row here instead of a new
// branch everywhere else.

var ID_PATTERN = /^[a-z][a-z0-9-]{0,31}$/
var MAX_ID_CHARS = 32
// Separates the profile from the id its own source minted. "/" cannot be
// confused with the start of a profile id, so a legacy unqualified id is
// recognisable by the name in front of the first separator failing the
// pattern above - see profileOf().
var SEPARATOR = "/"

var DEFAULT_ID = "hyprland"

var registry = [
  {
    id: "hyprland",
    // Hyprland resolves a keycode to its base-level keysym and compares
    // keysyms, so judging compares keys, never the character they produce.
    judgeMode: "keysym",
    // One chord per card. A chord is the length-1 case of a sequence.
    answerModel: "chord",
    // Read from the running compositor: every machine's binds differ, and a
    // read-only query for them exists.
    origin: "machine",
    // A chord is asked from wherever you are; there is no mode to name.
    contexts: []
  },
  {
    id: "lazyvim",
    // A terminal application reads the characters the layout produced, so `g`
    // and `G` are two mappings and the character round-trip is the answer.
    judgeMode: "text",
    answerModel: "sequence",
    // A pack: the upstream's own published key table, compiled in. LazyVim has
    // no read-only query for its mappings, and it does have a standard set -
    // which is what someone installing it was choosing in the first place.
    origin: "pack",
    // Named on the card so the ground never implies it read your Neovim.
    sourceLabelKey: "packSourceLazyVim",
    nameKey: "profile_lazyvim",
    // The modes a card can pose, which the card shows as a badge. This lives
    // here rather than in the shared pack loader: the second pack-backed
    // ground turned out to have contexts of its own that are not Neovim's,
    // which is exactly the check adding one was for.
    contexts: ["normal", "visual", "insert", "operator"],
    // A configurable key every other binding hangs off. The pack stores a
    // placeholder rather than the character it happened to be built with, so
    // moving it retrains the mapping instead of a key nobody presses.
    options: { leader: " ", localleader: "\\" },
    // What the settings menu offers. Typing is not available - the overlay
    // holds the keyboard - and automatic detection fills these in anyway, so
    // this only has to cover what people actually choose.
    optionChoices: {
      leader: [" ", ",", ";", "\\"],
      localleader: ["\\", ",", " "]
    }
  },
  {
    id: "vim",
    judgeMode: "text",
    answerModel: "sequence",
    // Vim's operators, motions and text objects are a grammar rather than a
    // keymap. The shipped table cites the runtime help tag behind every card.
    origin: "pack",
    nameKey: "profile_vim",
    contexts: ["normal", "operator"],
    options: {}
  },
  {
    id: "neovim",
    judgeMode: "text",
    answerModel: "sequence",
    // A table, from `nvim --clean` - the editor's own defaults with no user
    // configuration loaded. It teaches what this editor binds, not what vim
    // means: the grammar is a language and belongs in a ground of its own.
    origin: "pack",
    nameKey: "profile_neovim",
    contexts: ["normal", "visual", "operator", "insert"],
    // Nothing configurable: Neovim's built-in mappings hang off no prefix.
    options: {}
  },
  {
    id: "tmux",
    judgeMode: "text",
    answerModel: "sequence",
    origin: "pack",
    nameKey: "profile_tmux",
    // Every binding is the prefix and then a key, so every answer is two
    // steps and the table names the one table they are all in.
    contexts: ["prefix"],
    // tmux's own default. Omarchy's shipped tmux.conf moves it to C-Space,
    // which is why this has to be a setting and not a baked-in key.
    // prefix2 is the spare tmux allows beside the prefix; Omarchy sets it to
    // C-b. Empty means there is none, and the card offers only the prefix.
    options: { prefix: "C-b", prefix2: "" },
    optionChoices: {
      prefix: ["C-b", "C-Space", "C-a"],
      prefix2: ["", "C-b", "C-Space"]
    }
  },
  {
    id: "herdr",
    judgeMode: "text",
    answerModel: "sequence",
    // Omarchy ships a tool that resolves herdr's bindings from its own
    // defaults and this machine's config.toml, prefix substituted. That is a
    // read-only listing, so this ground reads the machine like the Hyprland
    // one does rather than carrying a table.
    origin: "machine",
    nameKey: "profile_herdr",
    // "navigate" is a mode you open first, so its keys are asked with the
    // mode named on the card rather than as a longer sequence.
    contexts: ["default", "navigate"],
    // None: the listing resolves the prefix, so there is nothing to set and
    // nothing to guess if it cannot be read.
    options: {}
  }
]

// The modes a ground's cards can pose. Empty when it has none to name.
function contexts(id) {
  var item = profile(id)
  return item && Array.isArray(item.contexts) ? item.contexts : []
}

// Grounds that carry a compiled-in key table rather than reading the machine.
function isPack(id) {
  var item = profile(id)
  return Boolean(item && item.origin === "pack")
}

function options(id) {
  var item = profile(id)
  return item && item.options ? item.options : ({})
}

// The values the settings menu offers for one option, its default first.
function optionChoices(id, name) {
  var item = profile(id)
  var choices = item && item.optionChoices ? item.optionChoices[name] : null
  return Array.isArray(choices) ? choices.slice() : []
}

// The options a ground has, in a stable order.
function optionNames(id) {
  return Object.keys(options(id))
}

function ids() {
  return registry.map(function(item) { return item.id })
}

// How the cabinets are laid out on the home screen: the machine's own
// shortcuts and the two multiplexers on one row, the three editors on the
// next. A ground not built yet simply leaves a gap in its row rather than
// shifting the others around.
var layout = [
  ["hyprland", "herdr", "tmux"],
  ["vim", "neovim", "lazyvim"]
]

function rows() {
  var result = []
  for (var index = 0; index < layout.length; index++) {
    var row = layout[index].filter(known)
    if (row.length) result.push(row)
  }
  // Anything registered but not placed still has to be reachable.
  var placed = []
  for (var i = 0; i < result.length; i++) placed = placed.concat(result[i])
  var rest = ids().filter(function(id) { return placed.indexOf(id) === -1 })
  if (rest.length) result.push(rest)
  return result
}

function defaultId() { return DEFAULT_ID }

function known(id) {
  return Boolean(profile(id))
}

// A syntactically usable profile name. Kept separate from known(): stored
// state may name a profile this build does not carry, and that has to be
// rejected as unknown rather than as malformed.
function valid(id) {
  var name = String(id === undefined || id === null ? "" : id)
  return name.length <= MAX_ID_CHARS && ID_PATTERN.test(name)
}

function profile(id) {
  var name = String(id === undefined || id === null ? "" : id)
  for (var index = 0; index < registry.length; index++) {
    if (registry[index].id === name) return registry[index]
  }
  return null
}

// The namespaced id every layer above the source uses. Returns "" rather than
// a half-formed id, so a caller cannot key state on an unusable name.
function qualify(profileId, localId) {
  var local = String(localId === undefined || localId === null ? "" : localId)
  return valid(profileId) && local ? String(profileId) + SEPARATOR + local : ""
}

// The profile in front of the first separator, or "" when there is none. A
// local id may itself contain "/" (a dispatcher argument holding a path, for
// one), which is why only the first segment is considered and why it has to
// pass the id pattern to count.
function profileOf(qualifiedId) {
  var value = String(qualifiedId === undefined || qualifiedId === null ? "" : qualifiedId)
  var separator = value.indexOf(SEPARATOR)
  if (separator <= 0) return ""
  var name = value.slice(0, separator)
  return valid(name) ? name : ""
}

function localOf(qualifiedId) {
  var name = profileOf(qualifiedId)
  return name ? String(qualifiedId).slice(name.length + SEPARATOR.length) : ""
}

function isQualified(qualifiedId) {
  return Boolean(profileOf(qualifiedId))
}

// Used when state written before profiles existed is read back: everything a
// previous version stored belonged to the Hyprland training ground.
function qualifyLegacy(id, profileId) {
  var value = String(id === undefined || id === null ? "" : id)
  if (!value) return ""
  return profileOf(value) ? value : qualify(profileId || DEFAULT_ID, value)
}
