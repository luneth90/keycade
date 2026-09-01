.pragma library

function lower(value) { return String(value || "").toLowerCase() }

function category(binding) {
  var dispatcher = lower(binding.dispatcher)
  var arg = lower(binding.arg)
  var description = lower(binding.description)
  var haystack = dispatcher + " " + arg + " " + description

  if (/movetoworkspace|movewindow|move window|resize|fullscreen|floating|close window|killactive|swapwindow/.test(haystack)) return "windows"
  if (dispatcher === "workspace" || dispatcher === "focuswindow" || dispatcher === "movefocus"
      || /workspace|focus .*window|focus .*monitor|next window|previous window/.test(haystack)) return "navigation"
  if (dispatcher === "exec" || /launch|open |terminal|browser|screenshot|menu/.test(haystack)) return "launchers"
  if (/group|changegroupactive|togglegroup/.test(haystack)) return "groups"
  if (/scratchpad|special workspace|specialworkspace/.test(haystack)) return "scratchpad"
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
