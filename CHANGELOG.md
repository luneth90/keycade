# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- Require the active ground's current eligible model to be fully mastered before a persisted first-mastery milestone may end a run.
- Independently bound and rebuild live tmux, Herdr, and packaged binding models before QML retains them; reject prototype-special dynamic keys.
- Verify the child executable at the shared relay boundary and refuse relative, user-owned, or writable commands.
- Bound the first-mastery support prompt and marketplace action label as plain text.
- Bound the overlay open(payloadJson) entry point to 16 KiB and require a non-array JSON object.

### Changed

- Run the parser fuzzing smoke test in CI with a hash-locked Atheris dependency and explicit least-privilege workflow permissions.
- Retire the former authoritative-sourcing rule as a security invariant. Local read-only state remains the source of truth for machine grounds; shared corpora and bundled-pack provenance remain functional data-quality checks.

## [1.0.0] - 2026-09-05

### Highlights

Keycade 1.0.0 is the first major stable release, transforming shortcut memorization into an arcade-style recall training platform. This release introduces six dedicated training cabinets, Wayland input isolation, end-to-end security hardening (review invariants R1–R8), full test automation, and complete third-party verified CI/CD workflows.

### Added

- **Six Dedicated Training Grounds (Cabinets)**:
  - **Omarchy**: Live compositor shortcut extraction directly from running Hyprland instances with validated XKB keymap compilation.
  - **Herdr**: Terminal multiplexer bindings from Omarchy's bounded local listing.
  - **Tmux**: Dynamic key bindings queried safely from active tmux servers via bounded, deadline-enforced listing.
  - **Vim**: Offline curated core editing bindings and operator-motion cards.
  - **Neovim**: Shipped default upstream reference table; no user configuration is read.
  - **LazyVim**: Shipped upstream table calibrated by bounded static reads of literal leader, extras, installed commit, and top-level keymap changes.
- **Arcade Dashboard & Progression**:
  - Home screen tracking every cabinet's cards, progress, and mastery status independently.
  - Visual first-time 100% mastery result with an optional official marketplace heart action.
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

- **Compliance with marketplace security invariants R1–R8**:
  - **R1 (No User Config Execution)**: User configuration is never executed or evaluated; declared readers accept only bounded literal shapes or read-only APIs.
  - **R2 (Dual-Ended Bounds)**: Producers bound bytes, time, records, and child trees; QML independently validates and rebuilds retained models.
  - **R3 (Descriptor-Relative State I/O)**: State under `~/.local/state/omarchy/keycade/` rejects links and uses verified directory descriptors, 0600 temporary files, `fsync`, and atomic rename.
  - **R4 (Prototype Safety)**: Dynamic maps use null prototypes and reject prototype-special keys.
  - **R5 (Plain Text Dynamic UI)**: External text is stripped of controls and rendered through bounded plain-text components.
  - **R6 (Standard Packaging Only)**: Installation, updates, and removal use only Omarchy's plugin lifecycle.
  - **R7 (Hermetic Trusted Binaries)**: `/usr/bin/python3`, `/usr/bin/hyprctl`, `/usr/bin/tmux`, the root-owned Omarchy Herdr listing command, and required libraries are addressed absolutely and verified where opened by helpers; child environments are whitelisted.
  - **R8 (Incremental Consumption & Reaping)**: Streams are bounded while read and complete process groups are terminated and reaped.

### Testing

- 188 Python unit and security invariant regression tests.
- 92 QML algorithm tests verified with Qt6 `qmltestrunner`.
- 5 comprehensive QML shell integration test scripts.
- Component syntax validation using `qmllint`.
