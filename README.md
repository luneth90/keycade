# Keycade

Keycade = Key + Arcade. It is a native Omarchy overlay that turns the
shortcuts active in the current Hyprland session into a short adaptive arcade
run. Correct input is recognized locally and is never dispatched as the bound
action.

This repository implements Stage 0 and the MVP described in [DESIGN.md](DESIGN.md):

- a versioned `hyprctl binds` JSON helper with logical and physical-key modes;
- strict eligibility filtering for unsafe, ambiguous, and unsupported binds;
- an Exclusive layer-shell overlay plus Wayland Shortcuts Inhibitor guard;
- a 24-card, three-wave adaptive run with guided, recall, and speed cards;
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

Install from the repository URL:

```bash
omarchy plugin add <git-url>
```

Then add a free shortcut after checking your current bindings. `Super + G` is
only an example:

```ini
bind = SUPER, G, exec, omarchy-shell shell summon xiaowei.keycade '{}'
```

Hyprland reloads configuration changes automatically. Validate them with:

```bash
hyprctl reload
hyprctl configerrors
```

Inside Keycade, press Enter to start and release Esc to exit safely. On exit,
Keycade waits for all held modifiers before disabling the inhibitor and giving
keyboard focus back.

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
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
```

The browser prototype remains available under `prototype/` for visual and
motion review. It cannot validate Wayland keyboard isolation.
