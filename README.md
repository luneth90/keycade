# Keycade

Keycade = Key + Arcade. It is a native Omarchy overlay that turns the
shortcuts active in the current Hyprland session into a short adaptive arcade
run. Version 0.2.2 implements the v0.5.2 continuous-mastery design. Correct input
is recognized locally and is never dispatched as the bound action.

This repository implements Stage 0 and the MVP described in [DESIGN.md](DESIGN.md):

- a versioned `hyprctl binds` JSON helper with logical and physical-key modes;
- strict eligibility filtering for unsafe, ambiguous, and unsupported binds;
- hardware-independent training that omits function-row, XF86 media/device,
  Print/Pause/SysRq, dedicated Home/End/Insert/Page keys, and unlabeled
  physical-only shortcuts;
- automatic classification of active shortcuts into windows, workspaces,
  system, applications, media, capture, utilities, groups, and scratchpad;
- due, unseen, weak, and maintenance queues with a persistent coverage cursor,
  so sustained play cannot randomly starve an eligible shortcut;
- an Exclusive layer-shell overlay plus Wayland Shortcuts Inhibitor guard;
- 24 planned cards with guided, learning, maintenance, and short-interval review;
- no lives or score: a mistake keeps the answer visible until corrected, then
  schedules another unassisted attempt 3–5 cards later;
- first-try accuracy, spaced review, lapse handling, and mastery based on five
  unassisted successes across at least three runs;
- local correct, wrong, and 3/2/1 countdown sounds with independent
  sound/countdown controls;
- resumable runs: Esc stores the remaining deck and correction state, while a
  fresh-run button remains available on the next launch;
- a language dropdown and localized names for recognized built-in Omarchy
  actions; custom descriptions remain untouched;
- pointer-safe language and sound popovers, with a 60% default sound volume;
- local atomic stats and settings under `$XDG_STATE_HOME/omarchy/keycade/`;
- English, Simplified Chinese, Japanese, and Spanish interface text;
- Tokyo Night, Gruvbox, and Catppuccin arcade palettes;
- a standalone native input probe for machine-specific verification.

## Requirements

- Omarchy 4.x
- Quickshell 0.3.1 with
  `Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`
- Hyprland with `binds:disable_keybind_grabbing = false`
- Python 3 (for `bin/keybinds-json`)

The Shortcuts Inhibitor module is currently a private Quickshell API. Keycade
intentionally refuses to start a run when it cannot verify or activate input
protection; there is no Exclusive-focus-only fallback.

## Install and summon

For a local checkout, the quickest path is the guarded installer. It validates
the manifest, clones the current repository into the user plugin directory,
enables the plugin, and adds `Super + Ctrl + G` only when that chord is free:

```bash
./install.sh
```

Skip the Hyprland configuration edit when desired:

```bash
./install.sh --no-bind
```

Remove the installed plugin and only the marked binding block created by the
installer. Progress is preserved by default:

```bash
./uninstall.sh
```

To also permanently delete settings and progress:

```bash
./uninstall.sh --purge-state
```

The scripts back up `~/.config/hypr/bindings.lua` before modifying it and
validate with `hyprctl reload` plus `hyprctl configerrors`. They never edit
files under `/usr/share/omarchy`.

For a published repository, installation through Omarchy remains available:

Install from the repository URL:

```bash
omarchy plugin add <git-url> --enable
```

Then add a free shortcut to `~/.config/hypr/bindings.lua` after checking your
current bindings. For example:

```lua
o.bind("SUPER + CTRL + G", "Keycade", "omarchy-shell shell summon xiaowei.keycade '{}'")
```

Hyprland reloads configuration changes automatically. Validate them with:

```bash
hyprctl reload
hyprctl configerrors
```

Inside Keycade, press Enter to start and release Esc to exit safely. On exit,
Keycade waits for all held modifiers before disabling the inhibitor and giving
keyboard focus back. The next launch offers to continue the exact remaining
deck. Open the sound menu to adjust volume in 10% steps or independently toggle
feedback and countdown sounds. Feedback uses softer, faded two-tone cues and
does not play an extra sound after corrective input.

## Native Stage 0 probe

Run this from a Hyprland session before relying on the game overlay:

```bash
quickshell -p dev/InputProbe.qml
```

Verify 10–20 real bindings, including letters, digits, punctuation, Shift,
`code:` bindings, and every keyboard layout you use. The panel shows Qt's
logical key, text, native scan code, modifiers, focus, and inhibitor state.
Also verify that one harmless Hyprland binding works outside the probe, is
received but not executed inside it, and works again immediately after exit.

Bindings marked `dont_inhibit`, compositor-reserved operations, firmware keys,
and setups with `binds:disable_keybind_grabbing = true` are not supported.

## Development

```bash
python3 -m unittest discover -s tests -v
env -u WAYLAND_DISPLAY -u DISPLAY QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= \
  QT_QUICK_BACKEND=software /usr/lib/qt6/bin/qmltestrunner -input tests/qml
./tests/test_installers.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
```

The browser prototype remains available under `prototype/` for visual and
motion review. It cannot validate Wayland keyboard isolation.
