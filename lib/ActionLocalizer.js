.pragma library

function lower(value) {
  return String(value || "").trim().toLowerCase()
}

function exactKey(description) {
  var keys = {
    "close current window": "action_closeWindow",
    "close window": "action_closeWindow",
    "toggle floating window": "action_toggleFloating",
    "toggle window floating/tiling": "action_toggleFloating",
    "toggle fullscreen": "action_toggleFullscreen",
    "fullscreen": "action_toggleFullscreen",
    "full screen": "action_toggleFullscreen",
    "toggle split direction": "action_toggleSplit",
    "toggle window split": "action_toggleSplit",
    "center window": "action_centerWindow",
    "pin window": "action_pinWindow",
    "focus on next window": "action_focusNext",
    "focus next window": "action_focusNext",
    "next window": "action_focusNext",
    "focus on previous window": "action_focusPrevious",
    "focus previous window": "action_focusPrevious",
    "previous window": "action_focusPrevious",
    "focus window left": "action_focusLeft",
    "focus on left window": "action_focusLeft",
    "focus window right": "action_focusRight",
    "focus on right window": "action_focusRight",
    "focus window up": "action_focusUp",
    "focus on above window": "action_focusUp",
    "focus window down": "action_focusDown",
    "focus on below window": "action_focusDown",
    "move window left": "action_moveLeft",
    "move window right": "action_moveRight",
    "move window up": "action_moveUp",
    "move window down": "action_moveDown",
    "terminal": "action_terminal",
    "browser": "action_browser",
    "browser (private)": "action_privateBrowser",
    "file manager": "action_fileManager",
    "file manager (cwd)": "action_fileManagerCwd",
    "editor": "action_editor",
    "apps menu": "action_appsMenu",
    "application launcher": "action_appsMenu",
    "lock system": "action_lockSystem",
    "power menu": "action_powerMenu",
    "show keybindings": "action_showKeybindings",
    "keybindings": "action_showKeybindings",
    "change background": "action_changeBackground",
    "background switcher": "action_changeBackground",
    "toggle nightlight": "action_toggleNightlight",
    "toggle top bar": "action_toggleTopBar",
    "screenshot region": "action_screenshotRegion",
    "screenshot window": "action_screenshotWindow",
    "screenshot display": "action_screenshotDisplay",
    "screen recording": "action_screenRecording",
    "clipboard manager": "action_clipboard",
    "emoji picker": "action_emoji",
    "calculator": "action_calculator",
    "notification center": "action_notifications",
    "toggle window transparency": "action_toggleTransparency",
    "close all windows": "action_closeAllWindows"
  }
  return keys[description] || ""
}

function translation(binding) {
  var description = lower(binding.description || binding.actionName)
  var key = exactKey(description)
  if (key) return { key: key, values: {} }

  var match = description.match(/^switch to workspace (.+)$/)
  if (match) return { key: "action_switchWorkspace", values: { workspace: match[1] } }
  match = description.match(/^move window to workspace (.+)$/)
  if (match) return { key: "action_moveToWorkspace", values: { workspace: match[1] } }

  var additional = {
    "pseudo window": "action_pseudoWindow",
    "tiled full screen": "action_tiledFullscreen",
    "full width": "action_fullWidth",
    "pop window out (float & pin)": "action_popWindow",
    "toggle workspace layout": "action_toggleWorkspaceLayout",
    "next workspace": "action_nextWorkspace",
    "previous workspace": "action_previousWorkspace",
    "former workspace": "action_formerWorkspace",
    "toggle scratchpad": "action_toggleScratchpad",
    "move window to scratchpad": "action_moveScratchpad",
    "swap window to the left": "action_swapLeft",
    "swap window to the right": "action_swapRight",
    "swap window up": "action_swapUp",
    "swap window down": "action_swapDown",
    "reveal active window on top": "action_revealWindow",
    "focus on next monitor": "action_focusNextMonitor",
    "focus on previous monitor": "action_focusPreviousMonitor",
    "toggle window grouping": "action_toggleGrouping",
    "move active window out of group": "action_leaveGroup",
    "move window to group on left": "action_groupLeft",
    "move window to group on right": "action_groupRight",
    "move window to group on top": "action_groupUp",
    "move window to group on bottom": "action_groupDown",
    "next window in group": "action_nextGroupWindow",
    "previous window in group": "action_previousGroupWindow",
    "move grouped window focus left": "action_groupFocusLeft",
    "move grouped window focus right": "action_groupFocusRight",
    "monitor scaling up": "action_scaleUp",
    "monitor scaling down": "action_scaleDown",
    "omarchy menu": "action_omarchyMenu",
    "capture menu": "action_captureMenu",
    "toggle menu": "action_toggleMenu",
    "hardware menu": "action_hardwareMenu",
    "system menu": "action_systemMenu",
    "tmux keybindings": "action_tmuxKeybindings",
    "herdr keybindings": "action_herdrKeybindings",
    "theme menu": "action_themeMenu",
    "toggle window gaps": "action_toggleGaps",
    "toggle single-window square aspect": "action_toggleSquareAspect",
    "dismiss last notification": "action_dismissNotification",
    "dismiss all notifications": "action_dismissAllNotifications",
    "invoke last notification": "action_invokeNotification",
    "open notification history": "action_notificationHistory",
    "toggle laptop display": "action_toggleLaptopDisplay",
    "toggle laptop display mirroring": "action_toggleDisplayMirroring",
    "share": "action_share",
    "transcode": "action_transcode",
    "set reminder": "action_setReminder",
    "show reminders": "action_showReminders",
    "clear reminders": "action_clearReminders",
    "show time": "action_showTime",
    "show battery remaining": "action_showBattery",
    "toggle weather": "action_toggleWeather",
    "agent": "action_agent",
    "audio": "action_audio",
    "bluetooth": "action_bluetooth",
    "display": "action_display",
    "calendar": "action_calendar",
    "network": "action_network",
    "power": "action_power",
    "activity": "action_activity",
    "zoom in": "action_zoomIn",
    "reset zoom": "action_resetZoom",
    "toggle dictation": "action_toggleDictation",
    "universal copy": "action_copy",
    "universal paste": "action_paste",
    "universal cut": "action_cut"
  }
  if (additional[description]) return { key: additional[description], values: {} }

  match = description.match(/^move window silently to workspace (.+)$/)
  if (match) return { key: "action_moveSilentlyToWorkspace", values: { workspace: match[1] } }
  match = description.match(/^switch to group window (.+)$/)
  if (match) return { key: "action_switchGroupWindow", values: { index: match[1] } }

  match = description.match(/^(expand window left|shrink window left|shrink window up|expand window down)( a little| a lot)?$/)
  if (match) {
    var resizeKeys = {
      "expand window left": "action_expandLeft",
      "shrink window left": "action_shrinkLeft",
      "shrink window up": "action_shrinkUp",
      "expand window down": "action_expandDown"
    }
    var suffix = match[2] === " a little" ? "Little" : match[2] === " a lot" ? "Lot" : ""
    return { key: resizeKeys[match[1]] + suffix, values: {} }
  }

  var applicationKeys = {
    "music": "action_music",
    "music tui": "action_musicTui",
    "passwords": "action_passwords",
    "email": "action_email",
    "new email": "action_newEmail"
  }
  if (applicationKeys[description]) return { key: applicationKeys[description], values: {} }

  var dispatcher = lower(binding.dispatcher)
  var arg = String(binding.arg || "")
  if (dispatcher === "workspace") return { key: "action_switchWorkspace", values: { workspace: arg } }
  if (dispatcher === "movetoworkspace") return { key: "action_moveToWorkspace", values: { workspace: arg } }
  if (dispatcher === "killactive") return { key: "action_closeWindow", values: {} }
  if (dispatcher === "togglefloating") return { key: "action_toggleFloating", values: {} }
  if (dispatcher === "fullscreen") return { key: "action_toggleFullscreen", values: {} }
  return null
}

function actionName(binding, i18n) {
  var localized = translation(binding)
  if (localized && i18n.messages && i18n.messages[localized.key] !== undefined)
    return i18n.t(localized.key, localized.values)
  return String(binding.actionName || binding.description || binding.dispatcher || i18n.t("action_shortcut"))
}
