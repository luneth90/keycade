# Keycade

**English** | [简体中文](README.zh-CN.md)

> A shortcut recall arcade for Omarchy, herdr, tmux, Vim, Neovim and LazyVim

![Keycade English learning screen](docs/screenshots/keycade-en.png)

![Every cabinet's progress on the home screen](docs/screenshots/keycade-grounds-en.png)

![A LazyVim leader sequence](docs/screenshots/keycade-lazyvim-en.png)

Keycade is a native Omarchy overlay that turns shortcuts into short recall
runs. What you press is judged locally and never triggers what it normally
would.

Six training grounds, picked on the home screen the way you pick a machine in
an arcade. Each keeps its own deck, progress and mastery, and the row shows all
of them at once:

| Ground | Where its shortcuts come from |
| --- | --- |
| **Omarchy** | The shortcuts active on this machine, read from the running compositor |
| **herdr** | The bindings active on this machine, from Omarchy's read-only listing |
| **tmux** | A running server's real prefixes and key table; with no server, the prefix from your config plus the shipped table |
| **VIM** | Operators, motions, text objects and their compositions, each checked against Neovim's help |
| **NEOVIM** | Neovim's built-in mappings, collected from a clean instance |
| **LazyVim** | LazyVim's published keymaps, calibrated by your leader, extras and overrides |

Omarchy is what you get on a fresh install and after an upgrade; the rest are
one click away.

## Core features

- The first three grounds read this machine rather than dealing a generic list;
  the other three use the tables their upstreams publish.
- Sequences are judged like single shortcuts - `<leader>ff`, `gcc`, `C-b %` -
  drawn step by step, each one lighting up as you type it.
- While you train, only Keycade sees your keys. Nothing on the desktop fires.
- One run is 24 cards mixing new, due, weak and mastered shortcuts. Keep
  playing and it covers everything, with reviews spaced out over time.
- Mastered means two first-try successes in a row, across two different runs.
- A miss leaves the answer on screen, asks you to type it, and brings the card
  back later in the run.
- Progress is saved locally, an interrupted run resumes, and clearing a ground
  is celebrated once.
- A shortcut your keyboard cannot press, or one you would rather skip, can be
  excluded and put back later with its history intact.
- The leader and prefix keys are read from your own configuration, so there is
  nothing to set twice.
- English and Simplified Chinese, local sounds, and five palettes: Catppuccin,
  Tokyo Night, Gruvbox, Everforest and Ristretto.
- Arcade trimmings: dot matrix numbers, scanlines, a marquee frame. Reduced
  motion stops the movement and keeps every reading.

Keys a compact keyboard may not have are left out: the function row, media
keys, Print/Pause/SysRq, dedicated Home/End/Insert/Page/Delete, and bindings
that are ambiguous or cannot be read reliably. So is any shortcut answered by
Esc alone - releasing Esc saves and leaves, so that card could never be
cleared. Esc with a modifier is a different gesture and stays trainable.

## Requirements

- Omarchy 4.x
- Quickshell 0.3.1 with `Quickshell.Wayland._ShortcutsInhibitor.ShortcutInhibitor`
- Hyprland with `binds:disable_keybind_grabbing = false`
- Python 3

Keycade refuses to start when it cannot confirm input protection is active. It
never falls back to an unsafe focus-only mode.

## Keyboard layouts

Keycade judges by **which physical key you pressed**, the same way Hyprland
decides whether a bind fires: a bind names the key that produces its keysym
with nothing held, whatever that key types once Shift is down. This matters on
non-US layouts, where `SUPER + SHIFT + comma` is the key labelled `,` even
though it types `;` with Shift held.

The layout comes from Hyprland's own `input:kb_*` options, and a bind that
cannot be pressed on the active layout is never dealt. Two setups fall back to
comparing typed characters: a keymap given through `input:kb_file`, and a
custom layout under `~/.xkb` or `~/.config/xkb`. Keycade reads no files outside
Hyprland's own output, so it steps back rather than guess.

## Install

```bash
omarchy plugin add https://github.com/luneth90/keycade.git --enable
```

Then add a shortcut to `~/.config/hypr/bindings.lua`, for example:

```bash
echo 'o.bind("SUPER + SHIFT + K", "Keycade", "omarchy-shell shell summon luneth90.keycade '\''{}'\''")' >> ~/.config/hypr/bindings.lua
```

## Update

```bash
omarchy plugin update luneth90.keycade
omarchy restart shell
```

The restart is required: updating alone does not reliably reload Keycade.

## Use

- Launch with `Super + Shift + K`, or run
  `omarchy-shell shell summon luneth90.keycade '{}'`.
- Pick a cabinet on the home screen and press Enter to start or continue. Every
  cabinet shows where it stands; one you have never opened shows a dash.
- To train somewhere else, press BACK. The run is saved, and picking that
  cabinet again resumes where it stopped.
- Use the top bar to switch language, sound, volume and palette. The choice is
  remembered.
- For a shortcut you cannot press, or would rather skip, press `✕ EXCLUDE`. It
  stops being dealt and stops counting toward mastery. `EXCLUDED` lists what
  you set aside and puts any of it back with its history intact. The list is
  capped, and the last remaining shortcut cannot be excluded.
- Release Esc to save and leave. Only a bare Esc does this; `Super + Esc` and
  the like are ordinary shortcuts, so you can still answer a card for one.

Progress lives in `${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/` and
survives updates.

## Uninstall

```bash
omarchy plugin remove luneth90.keycade
```

Progress stays in `${XDG_STATE_HOME:-$HOME/.local/state}/omarchy/keycade/`.
Keycade intentionally ships no script that deletes your data or edits Hyprland
configuration on removal.

## Development

### What it reads from your machine

The tables are the upstream defaults; your configuration is read only to
calibrate the leader and prefix keys. Only fixed shapes at fixed paths are
read, anything else is skipped and counted, and the upstream default applies
when nothing can be proved. No Lua runs, no editor starts, no `require` chain
is followed.

tmux is the one live query. Once `has-session` proves a server is already up,
`show-options` gives its real `prefix` and `prefix2` and `list-keys` gives the
key table. With no server, only global `set` lines in `~/.config/tmux/tmux.conf`
and `~/.tmux.conf` are parsed and the shipped table is kept. Both prefixes fire
in tmux, so both are accepted; if `C-b` is one of them, it is the one on the
card.

### Shortcut packs

The LazyVim, tmux, VIM and NEOVIM tables are static data, collected on a
maintainer's machine and committed as reviewable JSON. Collection never runs on
a user's machine, and nothing is fetched at runtime.

When an upstream moves, re-collect and read the JSON diff:

```bash
git clone https://github.com/LazyVim/LazyVim.github.io ../LazyVim.github.io
git clone https://github.com/LazyVim/LazyVim ../LazyVim && git -C ../LazyVim checkout v16.0.0
python3 tools/build_packs.py --collect lazyvim --site ../LazyVim.github.io --lazyvim ../LazyVim

printf '# tmux %s\n' "$(tmux -V | awk '{print $2}')" > /tmp/tmux-keys.txt
tmux -L keycade-build -f /dev/null list-keys -N -T prefix >> /tmp/tmux-keys.txt
tmux -L keycade-build kill-server
python3 tools/build_packs.py --collect tmux --listing /tmp/tmux-keys.txt

python3 tools/build_packs.py --collect vim --runtime /usr/share/nvim/runtime \
  --runtime-version 'NVIM v0.12.5'
```

The `-f /dev/null` is not optional: without it tmux starts a server, sources
your own `tmux.conf`, and collects your keys instead of the defaults.

### Tests and screenshots

```bash
python3 -m unittest discover -s tests -p 'test_*.py' -v
QT_QPA_PLATFORM=offscreen QT_QPA_PLATFORMTHEME= QT_STYLE_OVERRIDE=Fusion \
  /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml
./tests/test_state_store_qml.sh
./tests/test_hyprland_source_qml.sh
./tests/test_ground_switching_qml.sh
./tests/test_run_counters_qml.sh
/usr/lib/qt6/bin/qmllint -I /usr/lib/qt6/qml Keycade.qml lib/*.qml lib/sources/*.qml dev/InputProbe.qml
./tools/shoot-screenshots
```

## License

Keycade is released under the [MIT License](LICENSE). Copyright © 2026 luneth90.
