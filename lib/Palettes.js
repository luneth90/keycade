.pragma library

// Each palette named after an Omarchy theme takes its hues from
// /usr/share/omarchy/themes/<name>/colors.toml; "cyberpunk" is this project's
// own. In every case the roles are assigned for
// contrast inside the cabinet rather than copied field for field: the ink has
// to stay readable on the cabinet, and success, danger and primary have to be
// told apart at a glance while answering. Recheck against the source theme
// when Omarchy changes it.
var palettes = {
  "tokyo": {
    voidColor: "#080b14", cabinetColor: "#242a46", screenColor: "#0d1224",
    inkColor: "#f1f4ff", mutedColor: "#9aa5d1", primaryColor: "#7aa2f7",
    secondaryColor: "#bb9af7", successColor: "#9ece6a", dangerColor: "#f7768e",
    coinColor: "#e0af68"
  },
  // The one palette here with no Omarchy theme behind it. Acid yellow leads,
  // because the top bar renders primaryColor as a band with void-coloured text
  // on it, and black on acid yellow is the look this is after. The remaining
  // roles take the neon complements rather than tints of the lead, so nothing
  // here is a shade of anything else.
  "cyberpunk": {
    voidColor: "#07070f", cabinetColor: "#1b1b2c", screenColor: "#0e0e1a",
    inkColor: "#eef2ff", mutedColor: "#8e93b8", primaryColor: "#fcee0a",
    secondaryColor: "#ff2bd6", successColor: "#00e676", dangerColor: "#ff003c",
    coinColor: "#00f0ff"
  },
  "catppuccin": {
    voidColor: "#101019", cabinetColor: "#313244", screenColor: "#161622",
    inkColor: "#cdd6f4", mutedColor: "#a6adc8", primaryColor: "#cba6f7",
    secondaryColor: "#89b4fa", successColor: "#a6e3a1", dangerColor: "#f38ba8",
    coinColor: "#f9e2af"
  },
  "everforest": {
    voidColor: "#181d20", cabinetColor: "#343f44", screenColor: "#21272c",
    inkColor: "#d3c6aa", mutedColor: "#9da9a0", primaryColor: "#7fbbb3",
    secondaryColor: "#d699b6", successColor: "#a7c080", dangerColor: "#e67e80",
    coinColor: "#dbbc7f"
  },
  // Warm coffee ground with a coral lead - the only palette here that is
  // neither cool nor yellow. Its muted tone is lifted off the theme's own
  // #72696a, which is too dim to read as body text on this cabinet.
  "ristretto": {
    voidColor: "#181414", cabinetColor: "#3d2f2a", screenColor: "#211b1b",
    inkColor: "#e6d9db", mutedColor: "#a29495", primaryColor: "#f38d70",
    secondaryColor: "#a8a9eb", successColor: "#adda78", dangerColor: "#fd6883",
    coinColor: "#f9cc6c"
  }
}

var order = ["tokyo", "cyberpunk", "catppuccin", "everforest", "ristretto"]

var roles = ["voidColor", "cabinetColor", "screenColor", "inkColor", "mutedColor",
             "primaryColor", "secondaryColor", "successColor", "dangerColor", "coinColor"]

function names() {
  return order.slice()
}

function supported(name) {
  return order.indexOf(String(name === undefined || name === null ? "" : name)) !== -1
}

// Unknown names fall back rather than failing: a settings file from a newer
// version can name a theme this one has never heard of.
function palette(name) {
  return supported(name) ? palettes[name] : palettes[order[0]]
}
