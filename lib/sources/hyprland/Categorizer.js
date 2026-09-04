.pragma library

function lower(value) { return String(value || "").toLowerCase() }

var orderedCategories = [
  "windows",
  "workspaces",
  "system",
  "applications",
  "media",
  "capture",
  "utilities",
  "groups",
  "scratchpad"
]

function categories() { return orderedCategories.slice() }

function category(binding) {
  var dispatcher = lower(binding.dispatcher)
  var arg = lower(binding.arg)
  var description = lower(binding.description)
  var haystack = dispatcher + " " + arg + " " + description

  if (/scratchpad|special workspace|specialworkspace/.test(haystack)) return "scratchpad"
  if (/group|changegroupactive|togglegroup/.test(haystack)) return "groups"
  if (dispatcher === "workspace" || /workspace/.test(haystack)) return "workspaces"
  if (/screenshot|screen ?record|capture|webcam|color picker|\bocr\b|extract text/.test(haystack)) return "capture"
  if (/movewindow|move window|resize|fullscreen|full screen|full width|floating|tiling|close .*window|killactive|swapwindow|focuswindow|movefocus|focus .*window|focus .*monitor|next window|previous window|reveal active window|expand window|shrink window|window split|pseudo window|pin\b|window width|window transparency|window gaps|single-window/.test(haystack)) return "windows"
  if (/^(terminal|browser(?: \(private\))?|file manager(?: \(cwd\))?|editor|tmux|herdr|music(?: tui)?|docker|signal|obsidian|omawrite|passwords|chatgpt|grok|calendar|email|new email|youtube|whatsapp|google messages|google photos|google maps|x|x post)$/.test(description)
      || /\b(apps menu|application launcher|launch application)\b/.test(description)) return "applications"
  if (/volume|mute|microphone|next track|previous track|\bpause\b|\bplay\b|media source|audio output|media output|eject media/.test(haystack)) return "media"
  if (/universal (copy|paste|cut)|clipboard|emoji|calculator|reminder|show time|share\b|transcode/.test(haystack)) return "utilities"
  if (/system|power|lock|nightlight|notification|theme|background|brightness|backlight|touchpad|monitor scaling|top bar|bar panel|display|bluetooth|network|hardware menu|audio$|activity$|agent$|battery|weather|idle|zoom|keybindings|omarchy menu|toggle menu/.test(haystack)) return "system"
  if (dispatcher === "exec" || /\blaunch\b|\bopen\b/.test(haystack)) return "applications"
  return "uncategorized"
}

function fallbackDescription(binding) {
  var dispatcher = lower(binding.dispatcher)
  var arg = String(binding.arg || "")
  if (dispatcher === "workspace") return "Switch to workspace " + arg
  if (dispatcher === "movetoworkspace") return "Move window to workspace " + arg
  if (dispatcher === "movefocus") return "Focus window " + arg
  if (dispatcher === "killactive") return "Close current window"
  if (dispatcher === "togglefloating") return "Toggle floating window"
  return ""
}

function actionName(binding) {
  return String(binding.description || fallbackDescription(binding) || binding.dispatcher || "Shortcut")
}
