# AGENTS.md

Welcome to **Keycade** (`luneth90/keycade`). This document defines the foundational project context, system architecture, security invariants, and development lifecycle rules for autonomous AI coding agents and pair-programming assistants working on this repository.

---

## 1. Project Overview

- **Name**: Keycade
- **Repository**: `https://github.com/luneth90/keycade`
- **License**: [MIT License](LICENSE)
- **Primary Domain**: Native Wayland / Omarchy desktop overlay for arcade-style shortcut recall training.
- **Core Stacks**:
  - **Frontend / UI**: QML (Qt 6.8+ / Quick / Controls 2), running within [Quickshell](https://quickshell.outfoxxed.me/) (`Quickshell.Wayland._ShortcutsInhibitor`).
  - **Backend / Runtime Helpers**: Python 3.12+ scripts located in `bin/` (`keybinds-json`, `app-config-json`, `tmux-keys-json`, `herdr-keys-json`, `state-store`, `bounded-relay`).
  - **System Integration**: Linux `prctl(PR_SET_PDEATHSIG)`, `libxkbcommon` (base keysym & physical keycode resolution), `hyprctl` (read-only query mode).
  - **Security & Quality**: OpenSSF Scorecard (Target $\ge$ 7.5), OpenSSF Best Practices (Passing Badge), CodeQL SAST, Dependabot, Atheris fuzz testing.

---

## 2. Directory Architecture

```
keycade/
├── Keycade.qml                # Main QML application window and entry point
├── manifest.json              # Omarchy plugin manifest and metadata
├── bin/                       # Sandboxed runtime helpers (Python)
│   ├── bounded-relay          # Timeout/resource guardian with setsid & PDEATHSIG
│   ├── keybinds-json          # Hyprland active binding & keymap extractor
│   ├── app-config-json        # Static config parser for nvim/helix/lazyvim
│   ├── tmux-keys-json         # Tmux live server & static fallback key reader
│   ├── herdr-keys-json        # Herdr multiplexer binding reader
│   └── state-store            # Descriptor-relative atomic state storage
├── lib/                       # QML components, business logic, and sound assets
│   ├── SafeText.qml           # Security-hardened PlainText renderer (R5)
│   ├── StateStore.qml         # State manager (stats, settings, exclusions)
│   ├── InputGuard.qml         # Wayland shortcut inhibitor boundary
│   ├── InputNormalizer.js     # Shared key normalization logic
│   ├── AnswerMatcher.js       # Sequence & chord input evaluation
│   ├── Scheduler.js           # Spaced repetition engine (24-card sessions)
│   └── sources/               # Data sources connecting helpers to QML models
├── tests/                     # Automated test suites
│   ├── test_*.py              # Python unit and security invariant tests (188+)
│   ├── fuzz_keybinds.py       # Atheris fuzzing harness for keybinding parsers
│   ├── qml/                   # QML algorithm verification tests
│   └── fixtures/              # Test data fixtures and cross-language corpora
├── tools/                     # Build tools (packs, locales, screenshots)
├── docs/                      # Technical plans, review invariants, and specs
│   └── review-invariants.md   # Authoritative review invariants (R1–R8, L1)
├── .bestpractices.json        # OpenSSF Best Practices criteria responses
└── .github/                   # Workflows, rulesets, and Dependabot config
```

---

## 3. Mandatory Security Invariants (R1–R8, L1)

All changes interacting with external processes, files, or user environments **MUST** uphold these non-negotiable invariants established during the Omarchy marketplace security audits:

| Invariant | Title | Core Requirement |
| :--- | :--- | :--- |
| **R1** | **No User Config Execution** | Never execute, load, or evaluate user configuration scripts (`~/.config/hypr/hyprland.lua`, `init.lua`, etc.) with `dofile()`, `eval()`, or external interpreters. Only parse statically or query read-only compositor APIs (`hyprctl`). |
| **R2** | **Dual-Ended Bounds** | Producers must cap byte outputs, deadlines, and child trees. The QML consumer **MUST** independently re-validate limits, counts, and schemas before retaining data. |
| **R3** | **Descriptor-Relative State I/O** | Read/write persistent state only via verified directory file descriptors with `O_NOFOLLOW`. Writes must use `0600` exclusive temporary files + `fsync` + atomic rename. Never traverse raw pathnames. |
| **R4** | **Prototype Safety** | Prevent JS prototype pollution. Never copy external keys into `{}`. Use `Object.create(null)` for dynamic lookups and reject `__proto__`, `constructor`, and `prototype`. |
| **R5** | **Plain Text Dynamic UI** | All dynamic or external text must use `SafeText` with `Text.PlainText`, strip ANSI escape codes and terminal controls, and enforce visual layout/length boundaries. |
| **R6** | **Standard Packaging Only** | No custom clone-and-run installers (`install.sh`, `setup.py`, `git pull`). Strictly follow the official Omarchy plugin lifecycle (`omarchy plugin add/update/remove`). |
| **R7** | **Hermetic & Trusted Binaries** | No reliance on ambient `PATH` or `#!/usr/bin/env`. Commands and dynamic libraries (`libc.so.6`, `libxkbcommon.so`) must use absolute paths verified by `trusted_command()` (root-owned, non-writable). Subprocesses run in a sanitized whitelist environment. |
| **R8** | **Incremental Consumption & Process Reaping** | QML stream consumers must bound inputs incrementally on arrival (not retain full stream before checking). Teardown must terminate the entire process group (`setsid` + `PR_SET_PDEATHSIG` + fallback SIGKILL). |
| **L1** | **Authoritative Upstream Sourcing** | Any code enumerating externally defined inputs (environment variables, XKB keysyms) must cite its authoritative source (e.g. `/usr/include/xkbcommon/xkbcommon.h`). Shared logic across Python and JS must be pinned by a single shared corpus (e.g. `tests/fixtures/canonical-keys.js`). |

---

## 4. OpenSSF Compliance & Supply Chain Security

Keycade maintains an **OpenSSF Scorecard score $\ge$ 7.5** and an **OpenSSF Best Practices Passing Badge (100%)**. Any modifications to CI/CD workflows or project metadata must preserve these guarantees:

1. **Commit SHA Pinning**:
   - Every GitHub Action in `.github/workflows/*.yml` **MUST** be pinned to its full 40-character Git commit SHA, followed by a human-readable version comment (e.g., `uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683 # v4.2.2`).
   - Use true Git commit SHAs, never Git tag object SHAs.
2. **Workflow Permissions**:
   - Workflows must define minimal top-level permissions:
     ```yaml
     permissions:
       contents: read
     ```
3. **No Binary Artifacts**:
   - Never commit pre-compiled binaries, shared objects, or executable blobs into git.
4. **Fuzzing Integrity**:
   - Keep `tests/fuzz_keybinds.py` functional and containing `import atheris` to maintain the Scorecard `Fuzzing: 10/10` check.
5. **Best Practices Sync**:
   - Updates to project metadata or licenses must be reflected in `.bestpractices.json`.

---

## 5. Development & Contribution Lifecycle

### Branching & PR Strategy
- **Protected Branch**: `main` is protected by GitHub Ruleset `22312414`.
- **Direct Pushes**: Forbidden on `main`.
- **Feature Branches**: Branch from `main` using descriptive naming:
  - `feat/feature-name`
  - `fix/bug-description`
  - `chore/task-name`
  - `docs/documentation-update`
  - `test/test-suite-enhancement`
- **Cleanliness**: Delete feature branches immediately after merging.

### Commit Message Conventions
Follow Conventional Commits:
```
<type>(<optional scope>): <imperative description>

[optional body explaining rationale and invariant reviews]
```
Examples:
- `fix(keymap): validate base keysym against root-owned include paths`
- `test(fuzz): add Atheris fuzz harness for keybinding parsers`
- `docs: update review invariants checklist for issue #1`

---

## 6. Verification & Testing Instructions

Before committing or opening a PR, agents **MUST** run and pass the automated test suites:

```bash
# 1. Run full Python test suite (188+ tests)
python3 -m unittest discover -s tests -p "test_*.py"

# 2. Run Atheris fuzzing smoke test
python3 tests/fuzz_keybinds.py -runs=1000

# 3. Run QML algorithms verification (requires Qt6)
QT_QPA_PLATFORM=offscreen /usr/lib/qt6/bin/qmltestrunner   -input tests/qml/tst_algorithms.qml   -import /usr/lib/qt6/qml

# 4. Check QML component syntax
qmllint Keycade.qml lib/*.qml
```

---

## 7. Agent Guidelines & Invariants

1. **Verify Before Declaring Complete**: Always run `python3 -m unittest discover -s tests -p "test_*.py"` to confirm zero regressions.
2. **Preserve Comments & Rationale**: Maintain all existing docstrings, review notes, and invariant comments.
3. **Do Not Touch Third-Party Issue Trackers**: Never interact with external upstream issue trackers (e.g. Omarchy plugin marketplace issue #4305) unless explicitly commanded by the user.
