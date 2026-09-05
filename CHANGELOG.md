# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-09-05

### Highlights

Keycade 1.0.0 is the first major stable release, transforming shortcut memorization into an arcade-style recall training platform. This release introduces six dedicated training cabinets, Wayland input isolation, end-to-end security hardening (review invariants R1–R8 and L1), full test automation, and complete third-party verified CI/CD workflows.

### Added

- **Six Dedicated Training Grounds (Cabinets)**:
  - **Omarchy**: Live compositor shortcut extraction directly from running Hyprland instances with authoritative XKB keymap compilation.
  - **Herdr**: Workspace and window layout manager shortcut practice.
  - **Tmux**: Dynamic key bindings queried safely from active tmux servers via bounded, deadline-enforced listing.
  - **Vim**: Offline curated core editing bindings and operator-motion cards.
  - **Neovim**: Safe static parsing of user configurations in `~/.config/nvim/` without executing arbitrary Lua code.
  - **LazyVim**: Static detection of LazyVim bundle plugins, `lazyvim.json`, and custom leader key bindings.
- **Arcade Dashboard & Progression**:
  - Home screen tracking every cabinet's cards, progress, and mastery status independently.
  - Visual first-time 100% mastery celebration animations and smooth transition back to cabinet selection.
  - Reset and "Start New Run" capabilities per cabinet.
- **Wayland Input Isolation**:
  - Integration with `zwlr_input_inhibit_manager_v1` ensuring all keystrokes during practice sessions are intercepted and judged locally without triggering system or desktop actions.
- **Automated CI/CD & Security Pipelines**:
  - GitHub Actions CI workflow running on Arch Linux container with container `--init` and non-root execution.
  - GitHub CodeQL Advanced Security scanning for Python and JavaScript/QML.
  - OpenSSF Scorecard supply chain security workflow.
  - Test coverage generation (74% backend coverage) with Codecov integration.
  - OpenSSF-compliant `SECURITY.md` vulnerability reporting policy.
- **Localization**:
  - Complete English and Simplified Chinese localization across all UI elements, tooltips, and documentation.

### Security & Hardening

- **Compliance with Review Invariants R1–R8 and L1**:
  - **R1 (Deadline Enforcement)**: Strict timeouts on all helper subcommands with graceful SIGTERM and immediate SIGKILL fallbacks.
  - **R2 (Trusted Binaries & Libraries)**: Executables (`/usr/bin/hyprctl`, `/usr/bin/tmux`, `/usr/bin/herdr`) and dynamic libraries (`/usr/lib/libxkbcommon.so.0`) are verified to be root-owned, non-writable regular files. Ambient `PATH` resolution is completely eliminated.
  - **R3 (Process Lifecycle)**: Process groups are tracked and killed on helper exit; `PR_SET_PDEATHSIG` ensures child processes die immediately if the helper process terminates.
  - **R4 (Environment Scrubbing)**: Child process environments are rebuilt from a strict whitelist. Dangerous XKB environment variables (`XKB_CONFIG_VERSIONED_EXTENSIONS_PATH`, `XKB_CONFIG_UNVERSIONED_EXTENSIONS_PATH`) are scrubbed before keymap compilation.
  - **R5 (Static-Only Analysis)**: Configuration readers for Lua and Vim use custom static tokenizers; zero arbitrary user code or scripts are executed.
  - **R6 (Data Sanitization & Prototype Defense)**: All keys and descriptions are sanitized of terminal escape codes and control characters. JSON dictionaries and map stores are created with null prototypes (`Object.create(null)`) to prevent prototype pollution attacks.
  - **R7 (State Quarantine)**: Persistent state directories under `~/.local/state/omarchy/plugins/luneth90.keycade/` refuse symlinks, preventing symlink traversal and arbitrary file write attacks.
  - **R8 (Bounded Resources)**: Enforced maximum line, byte, and record limits on all external inputs and IPC communication streams.
  - **L1 (Leader Safety)**: Leader keys and prefix chords are validated to ensure only well-formed single-chord prefixes are admitted.

### Testing

- 188 Python unit and security invariant regression tests.
- 92 QML algorithm tests verified with Qt6 `qmltestrunner`.
- 5 comprehensive QML shell integration test scripts.
- Component syntax validation using `qmllint`.
