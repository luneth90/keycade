# CLAUDE.md

Keycade (`luneth90/keycade`) is a native Omarchy/Wayland desktop overlay for arcade-style shortcut recall training.

---

## 1. Essential Commands

### Testing & Verification
```bash
# Run all Python unit and security tests (189+ tests)
python3 -m unittest discover -s tests -p "test_*.py"

# Run a single test module
python3 -m unittest tests/test_keybinds_json.py

# Run Atheris fuzzing smoke test
python3 tests/fuzz_keybinds.py -runs=1000

# Run QML algorithm tests (requires Qt6)
QT_QPA_PLATFORM=offscreen /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml

# Lint QML files
qmllint Keycade.qml lib/*.qml
```

### Local Dev & Testing in Omarchy
```bash
# Summon Keycade overlay locally
omarchy-shell shell summon luneth90.keycade '{}'

# Reload Quickshell after changes
omarchy restart shell
```

---

## 2. Architecture & Data Flow

- **Frontend**: `Keycade.qml` + `lib/` (Qt 6.8+ Quick / Controls 2 running in Quickshell).
- **Cabinets (Grounds)**:
  1. `Omarchy`: Live Hyprland shortcuts from `bin/keybinds-json` via `hyprctl`.
  2. `herdr`: Multiplexer bindings from `bin/herdr-keys-json`.
  3. `tmux`: Live bindings from `bin/tmux-keys-json`; static prefix calibration from `bin/app-config-json` with a shipped fallback table.
  4. `VIM`: Curated upstream reference tables (`lib/Packs.js`).
  5. `NEOVIM`: Default upstream reference tables (`lib/Packs.js`).
  6. `LazyVim`: Dynamic leader calibration & extra plugins via `bin/app-config-json`.
- **Input Isolation**: `lib/InputGuard.qml` manages Wayland `ShortcutInhibitor` so keypresses never leak to desktop apps during training.
- **Physical Key Matching**: Shortcuts match unshifted base keysyms from `libxkbcommon` to mirror Hyprland dispatch logic.
- **State Storage**: `lib/StateStore.qml` & `bin/state-store` use descriptor-relative atomic writes (0600 temp files + fsync + atomic rename).

---

## 3. Critical Security Invariants (R1–R8)

Every change touching external commands, files, or configs **MUST** adhere to:

- **R1 (No User Config Execution)**: Never run `dofile()`, Lua interpreters, or shell commands on user configs. Only use static parsers or read-only `hyprctl`.
- **R2 (Dual-Ended Bounds)**: Enforce byte/count caps on both producer (Python) and consumer (QML). QML must independently validate schemas.
- **R3 (Descriptor-Relative State I/O)**: Use verified directory fd with `O_NOFOLLOW`. Writes must be atomic 0600. No raw pathname traversal.
- **R4 (Prototype Safety)**: Prevent JS prototype pollution. Always use `Object.create(null)` for dynamic maps. Reject `__proto__`, `constructor`, `prototype`.
- **R5 (Plain Text Dynamic UI)**: Always use `SafeText` with `Text.PlainText`. Strip ANSI escape codes and terminal controls.
- **R6 (Standard Packaging Only)**: No custom `install*` or `git pull` scripts. Respect Omarchy's plugin lifecycle.
- **R7 (Hermetic & Trusted Binaries)**: Never use ambient `PATH` or `#!/usr/bin/env`. Commands and dynamic libraries must use absolute paths verified by `trusted_command()`.
- **R8 (Incremental Consumption & Reaping)**: QML streams must bound inputs incrementally on arrival. Child processes must be reaped via `bounded-relay` (`setsid` + `PR_SET_PDEATHSIG`).

---

## 4. OpenSSF Supply Chain Rules

- **Actions Pinning**: Every GitHub Action in `.github/workflows/*.yml` must be pinned to a 40-character Git commit SHA with a version comment (`uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`).
- **Permissions**: Keep `permissions: contents: read` as the default.
- **Fuzzing Check**: Maintain `tests/fuzz_keybinds.py` with `import atheris` for Scorecard `Fuzzing: 10/10`.
- **No Binaries**: Do not check in pre-compiled binary files.

---

## 5. Coding & Contribution Workflow

- **Branching**: Always branch from `main` (`feat/*`, `fix/*`, `chore/*`, `docs/*`, `test/*`).
- **Commits**: Follow Conventional Commits (`feat:`, `fix:`, `docs:`, `test:`, `chore:`).
- **Pull Requests**: Ensure all CI status checks pass before merging. Delete branches after merge.
- **Documentation**: Keep comments and docstrings intact. Never modify external marketplace issue trackers unless explicitly instructed.
