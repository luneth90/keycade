# Contributing to Keycade

Thank you for your interest in contributing to Keycade! Keycade is an arcade-style shortcut recall training platform designed for Omarchy and modern Wayland desktops.

## Code of Conduct

We are committed to providing a welcoming, inclusive, and harassment-free environment for all contributors. Please treat fellow maintainers and contributors with respect and courtesy.

## How to Contribute

### Reporting Bugs & Requesting Features
- Please search existing [GitHub Issues](https://github.com/luneth90/keycade/issues) before opening a new one.
- For bug reports, please include your OS environment, compositor (e.g. Hyprland version), steps to reproduce, and any relevant logs or error traces.
- For security vulnerabilities, please refer to our [Security Policy](https://github.com/luneth90/keycade/blob/main/SECURITY.md) and report via GitHub Private Vulnerability Reporting rather than public issues.

### Pull Requests
1. Fork the repository and create your branch from `main`:
   ```bash
   git checkout -b feat/your-feature-name
   ```
2. Follow the coding and security standards outlined below.
3. Verify that all automated unit and integration tests pass locally.
4. Push your branch and open a Pull Request against `main`.
5. Ensure CI tests pass on your PR before requesting review or merging.

## Development & Coding Standards

### Python Standards
- Python 3.12+ compatibility is required.
- Follow PEP 8 style conventions.
- Maintain type annotations wherever feasible.
- Preserve all existing docstrings and review invariant comments.

### QML & Shell Integration Standards
- Qt 6 (6.8+) / Quick / Controls 2.
- Adhere to the `qmllint` component verification rules.
- Prevent prototype pollution: always use `Object.create(null)` for keymap dictionaries and dynamic lookups.
- Sanitize external string inputs before rendering.

### Security Invariants (R1–R8, L1)
All code changes interacting with external processes, files, or user environments must uphold our security invariants:
- **R1 (Deadlines)**: Subcommands must have bounded timeouts with SIGTERM and SIGKILL fallbacks.
- **R2 (Trusted Binaries)**: Hardcoded executable paths must be validated as root-owned, non-writable regular files. Do not use ambient `PATH`.
- **R3 (Lifecycle)**: Child processes must be bound with `PR_SET_PDEATHSIG` and cleaned up on helper exit.
- **R4 (Environment)**: Scrub dangerous environment variables before executing subprocesses.
- **R5 (Static Parsing)**: Never execute arbitrary user configuration scripts (`~/.config/nvim/` etc.); parse statically.
- **R6 (Sanitization)**: Strip terminal control codes and escape sequences from external keys or descriptions.
- **R7 (State Quarantine)**: State directories must reject symlinks to prevent symlink traversal attacks.
- **R8 (Bounded Resources)**: Enforce line, byte, and record limits on all inputs.
- **L1 (Leader Safety)**: Validate leader chords to ensure only well-formed single chords are accepted.

## Running Tests Locally

Before submitting your PR, ensure all test suites pass:

```bash
# Run Python unit and security invariant tests
pytest -v tests/

# Run QML algorithm tests (requires Qt6)
QT_QPA_PLATFORM=offscreen /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml

# Lint QML components
qmllint src/qml/*.qml
```

## License
By contributing to Keycade, you agree that your contributions will be licensed under the project's [MIT License](https://github.com/luneth90/keycade/blob/main/LICENSE).
