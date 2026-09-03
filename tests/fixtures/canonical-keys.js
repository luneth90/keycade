.pragma library

// Shared by tests/test_keybinds_json.py and tests/qml/tst_algorithms.qml.
//
// Each row is a key as `hyprctl binds` prints it, and the canonical form
// bin/keybinds-json canonical_key() must produce for it. That output is what
// reaches QML as binding.key, and QML looks the keycode map up with
// InputNormalizer canonicalKey(), so the canonical form must also be a fixed
// point of canonicalKey(). Two implementations of one normalisation drift
// otherwise: a bind written "q" once produced "q" here and "Q" there, which
// dropped the binding from training entirely.
var pairs = [
  ["q", "Q"],
  ["Q", "Q"],
  ["z", "Z"],
  ["3", "3"],
  ["W", "W"],
  ["comma", ","],
  ["COMMA", ","],
  ["Comma", ","],
  [",", ","],
  ["period", "."],
  ["slash", "/"],
  ["SLASH", "/"],
  ["/", "/"],
  ["minus", "-"],
  ["equal", "="],
  ["grave", "`"],
  ["`", "`"],
  ["return", "RETURN"],
  ["RETURN", "RETURN"],
  ["enter", "RETURN"],
  ["ret", "RETURN"],
  ["space", "SPACE"],
  ["SPACE", "SPACE"],
  ["escape", "ESCAPE"],
  ["ESCAPE", "ESCAPE"],
  ["esc", "ESCAPE"],
  ["control", "CTRL"],
  ["meta", "SUPER"],
  ["win", "SUPER"],
  ["TAB", "TAB"],
  ["BACKSPACE", "BACKSPACE"],
  ["DELETE", "DELETE"],
  ["LEFT", "LEFT"],
  ["XF86AudioPlay", "XF86AUDIOPLAY"],
  ["XF86MonBrightnessUp", "XF86MONBRIGHTNESSUP"],
  ["mouse_up", "MOUSE_UP"],
  ["SUPER + ALT + comma", ","],
  ["SUPER + SHIFT + q", "Q"]
]
