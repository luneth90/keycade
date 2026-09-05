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

### Security Invariants (R1–R8)
All code changes interacting with external processes, files, or user environments must uphold our security invariants:
- **R1 (No User Config Execution)**: Never execute, load, or evaluate user configuration. Use only declared bounded static parsing or read-only compositor APIs.
- **R2 (Dual-Ended Bounds)**: Bound producer bytes, deadlines, records, and child trees; QML independently validates and rebuilds retained models.
- **R3 (Descriptor-Relative State I/O)**: Use verified directory descriptors with `O_NOFOLLOW`, 0600 exclusive temporary files, `fsync`, and atomic rename.
- **R4 (Prototype Safety)**: Dynamic lookups use `Object.create(null)` and reject `__proto__`, `constructor`, and `prototype`.
- **R5 (Plain Text Dynamic UI)**: Render external text through bounded `SafeText`, strip controls, and cap visual layout.
- **R6 (Standard Packaging Only)**: Use only the official Omarchy add, update, and remove lifecycle.
- **R7 (Hermetic Trusted Binaries)**: Use verified absolute command and library paths, no `/usr/bin/env`, and whitelist child environments.
- **R8 (Incremental Consumption & Reaping)**: Bound streams as bytes arrive and terminate/reap complete process groups.

### Functional Consistency Tests

When Python and JavaScript implement the same normalization rule, keep them pinned to one shared fixture corpus. Parsers for local command output must carry representative fixtures, reject malformed records, and fail closed when the installed output no longer matches. These are ordinary correctness tests, not additional security invariants and not permission to add runtime lookups or inputs.

Do not treat an upstream citation or version pin as a security gate for machine-read inputs: the current read-only local output is their source of truth. Bundled reference packs should still record reproducible provenance as a data-quality requirement, independently of R1–R8.

## Running Tests Locally

Before submitting your PR, ensure all test suites pass:

```bash
# Run Python unit and security invariant tests
python3 -m unittest discover -s tests -p "test_*.py"

# Run the parser fuzzing smoke test
python3 tests/fuzz_keybinds.py -runs=1000

# Run QML algorithm tests (requires Qt6)
QT_QPA_PLATFORM=offscreen /usr/lib/qt6/bin/qmltestrunner -input tests/qml/tst_algorithms.qml -import /usr/lib/qt6/qml

# Lint QML components
qmllint Keycade.qml lib/*.qml lib/sources/*.qml
```

## License
By contributing to Keycade, you agree that your contributions will be licensed under the project's [MIT License](https://github.com/luneth90/keycade/blob/main/LICENSE).
