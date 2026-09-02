# Keycade

**English** | [简体中文](README.zh-CN.md)

> Shortcut Recall Arcade

![Keycade English learning screen](docs/screenshots/keycade-en.png)

![All shortcuts mastered celebration](docs/screenshots/keycade-mastery-en.png)

Keycade is a native Omarchy shortcut trainer for Hyprland. It reads the
shortcuts active on your machine and turns them into short, adaptive recall
runs. Correct input is recognized locally and never dispatches the original
shortcut action.

## Core features

- Trains your active Hyprland shortcuts instead of a fixed generic list.
- Uses a protected full-screen overlay with Exclusive focus and Wayland
  Shortcuts Inhibitor, so training input does not trigger desktop actions.
- Builds one continuous 24-card run from new, due, weak, and mastered
  shortcuts without artificial waves.
- Guarantees coverage over continued play and schedules spaced reviews.
- Marks a shortcut mastered after two consecutive first-try successes across
  at least two different runs.
- Keeps the correct answer visible after a mistake, requires a correction, and
  reviews the shortcut again later in the run.
- Saves progress locally, resumes interrupted runs, tracks total mastery, and
  shows a one-time celebration when every eligible shortcut first reaches 100%.
- Includes English and Simplified Chinese, local feedback/countdown sounds,
  and Tokyo Night and Gruvbox palettes.

Function-row, XF86 media/device, Print/Pause/SysRq, dedicated
Home/End/Insert/Page, ambiguous, unsafe, and unsupported bindings are excluded.

## Requirements

- Omarchy 4.x
- Quickshell 0.3.1 with
  `Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`
- Hyprland with `binds:disable_keybind_grabbing = false`
- Python 3

Keycade refuses to start a run when it cannot verify input protection. It does
not fall back to an unsafe focus-only mode.

## Install

```bash
omarchy plugin add https://github.com/luneth90/keycade.git --enable
```

This is Omarchy's standard plugin installation path. Then add a shortcut to
`~/.config/hypr/bindings.lua`, for example:

```bash
echo 'o.bind("SUPER + SHIFT + K", "Keycade", "omarchy-shell shell summon luneth90.keycade '\''{}'\''")' >> ~/.config/hypr/bindings.lua
```

## Update

```bash
omarchy plugin update luneth90.keycade
omarchy restart shell
```

The restart is required — updating alone does not reliably reload Keycade.

## Use

- Launch with `Super + Shift + K`, or run
  `omarchy-shell shell summon luneth90.keycade '{}'`.
- Press Enter to start or continue a run.
- Release Esc to save the current run and exit safely. This only fires for a
  bare Esc; Esc held with a modifier (e.g. `Super + Esc`) is treated as a
  normal shortcut chord, so it won't fight with a system binding that also
  uses Esc (like a Super + Esc menu) while you're answering a card for it.
- Use the top menus to switch language, sound, volume, and palette.

Progress is stored under
`${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/` and is preserved across
updates.

## Uninstall

Remove the plugin while preserving progress:

```bash
omarchy plugin remove luneth90.keycade
```

Progress remains in `${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/`.
Keycade intentionally does not provide a script that deletes user state or
edits Hyprland configuration during removal.

## Development

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= QT_STYLE_OVERRIDE=Fusion \
  /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml
./tests/test_state_store_qml.sh
./tests/test_keybind_source_qml.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml dev/InputProbe.qml
```

## License

Keycade is released under the [MIT License](LICENSE). Copyright © 2026 luneth90.
