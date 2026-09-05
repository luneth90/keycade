.pragma library

// Shared by tools/build_packs.py and tests/qml/tst_algorithms.qml.
//
// Each row is a Neovim key notation string as an upstream pack lists it, and
// the step sequence both sides must turn it into. The producer (Python, at
// build time) writes those steps into assets/packs/*.json; the consumer
// (lib/TextKey.js, at run time) judges key presses against them. Two
// implementations of one normalisation drift otherwise - that is exactly what
// canonical-keys.js exists to prevent on the Hyprland side, and the same trap
// is here, one layer over.
//
// The rules this corpus pins, in the order they bite:
//   - <leader> is resolved before parsing, so it never appears here.
//   - S- is folded into the character it shifts: <S-h> is "H", not Shift+h.
//     Case is decisive with no modifier held, and Shift is already in it.
//   - With CTRL/ALT/SUPER held the letter is lower-cased, because Vim reads
//     <C-w> and <C-W> as one mapping and comparing case would split them.
//   - <lt>, <Bslash> and <Bar> are characters the notation had to spell out;
//     they become the character, not a named key.
var pairs = [
  ["gcc", [{ "mods": 0, "text": "g" }, { "mods": 0, "text": "c" }, { "mods": 0, "text": "c" }]],
  ["gg", [{ "mods": 0, "text": "g" }, { "mods": 0, "text": "g" }]],
  ["K", [{ "mods": 0, "text": "K" }]],
  ["G", [{ "mods": 0, "text": "G" }]],
  ["]d", [{ "mods": 0, "text": "]" }, { "mods": 0, "text": "d" }]],
  ["[q", [{ "mods": 0, "text": "[" }, { "mods": 0, "text": "q" }]],
  ["zz", [{ "mods": 0, "text": "z" }, { "mods": 0, "text": "z" }]],
  ["<S-h>", [{ "mods": 0, "text": "H" }]],
  ["<S-l>", [{ "mods": 0, "text": "L" }]],
  ["<C-w>", [{ "mods": 4, "text": "w" }]],
  ["<C-W>", [{ "mods": 4, "text": "w" }]],
  ["<C-h>", [{ "mods": 4, "text": "h" }]],
  ["<C-]>", [{ "mods": 4, "text": "]" }]],
  ["<A-j>", [{ "mods": 8, "text": "j" }]],
  ["<M-k>", [{ "mods": 8, "text": "k" }]],
  ["<C-Up>", [{ "mods": 4, "named": "UP" }]],
  ["<CR>", [{ "mods": 0, "named": "CR" }]],
  ["<Return>", [{ "mods": 0, "named": "CR" }]],
  ["<Enter>", [{ "mods": 0, "named": "CR" }]],
  ["<Tab>", [{ "mods": 0, "named": "TAB" }]],
  ["<Esc>", [{ "mods": 0, "named": "ESC" }]],
  ["<Space>", [{ "mods": 0, "named": "SPACE" }]],
  ["<BS>", [{ "mods": 0, "named": "BS" }]],
  ["<Del>", [{ "mods": 0, "named": "DEL" }]],
  ["<Down>", [{ "mods": 0, "named": "DOWN" }]],
  ["<lt>", [{ "mods": 0, "text": "<" }]],
  ["<Bslash>", [{ "mods": 0, "text": "\\" }]],
  ["<Bar>", [{ "mods": 0, "text": "|" }]],
  ["<C-Space>", [{ "mods": 4, "named": "SPACE" }]],
  [" ff", [{ "mods": 0, "named": "SPACE" }, { "mods": 0, "text": "f" }, { "mods": 0, "text": "f" }]],
  [" fF", [{ "mods": 0, "named": "SPACE" }, { "mods": 0, "text": "f" }, { "mods": 0, "text": "F" }]],
  [" bd", [{ "mods": 0, "named": "SPACE" }, { "mods": 0, "text": "b" }, { "mods": 0, "text": "d" }]],
  [" c<C-a>", [{ "mods": 0, "named": "SPACE" }, { "mods": 0, "text": "c" }, { "mods": 4, "text": "a" }]]
]

// Notations no pack entry may carry. Each is refused with the entry, counted,
// and never guessed at.
//
//   <D-…>      Command, a key no Linux keyboard has
//   <S-Tab>    Shift on a named key: Shift is folded into a character
//              everywhere else and cannot be folded into this one, and Qt
//              reports Backtab and Tab as the same key
//   <C-S-…>    Shift beside another modifier: it is folded into the character
//              everywhere else, and the two spellings would judge the same
//   <Plug>…    an internal mapping target, never something a user types
//   <F5>       a function key, which a compact keyboard is not guaranteed to
//              carry - the same rule the Hyprland ground applies
var rejected = [
  "<D-s>",
  "<S-Tab>",
  "<C-S-w>",
  "<Plug>(comment_toggle)",
  "<F5>",
  "<Nul>",
  "<>",
  "<NotAKey>"
]
