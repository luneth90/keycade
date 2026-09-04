.pragma library

// One palette per Omarchy theme of the same name. The hues are anchored to
// /usr/share/omarchy/themes/<name>/colors.toml, but the roles are assigned for
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
  "gruvbox": {
    voidColor: "#141412", cabinetColor: "#3c3836", screenColor: "#1b1b18",
    inkColor: "#fbf1c7", mutedColor: "#bdae93", primaryColor: "#fabd2f",
    secondaryColor: "#d3869b", successColor: "#b8bb26", dangerColor: "#fb4934",
    coinColor: "#fe8019"
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
  // The top bar is a full width band of primaryColor, so this theme uses the
  // softer bright_cyan rather than its neon #2dd5b7 accent, which glared at
  // that size. Its red is eased off for the same reason.
  "osaka-jade": {
    voidColor: "#090f0d", cabinetColor: "#23372b", screenColor: "#0c1512",
    inkColor: "#f7e8b2", mutedColor: "#81b8a8", primaryColor: "#8cd3cb",
    secondaryColor: "#d2689c", successColor: "#63b07a", dangerColor: "#e8695c",
    coinColor: "#e5c736"
  }
}

var order = ["tokyo", "gruvbox", "catppuccin", "everforest", "osaka-jade"]

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
