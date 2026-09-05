# Security Policy

## Supported Versions

The following table lists the release branches and versions that currently receive security updates:

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

The Keycade team takes security vulnerabilities seriously. We appreciate your efforts to responsibly disclose findings.

### Private Reporting Channels

Please do **not** report security vulnerabilities through public GitHub issues. Instead:

1. **GitHub Private Vulnerability Reporting**: Go to the [Security tab](https://github.com/luneth90/keycade/security/advisories/new) of this repository and click **"Report a vulnerability"**. This creates an encrypted private advisory draft visible only to project maintainers.
2. **Email Disclosure**: If private vulnerability reporting is unavailable, email security concerns directly to `luneth90@icloud.com` with the subject line `[SECURITY] Keycade Vulnerability Report`.

### What to Include in a Report

To help us triage and verify the report efficiently, please include:
- A clear description of the vulnerability and its potential impact.
- Exact steps to reproduce, proof-of-concept scripts, or minimal test cases.
- Any affected components (e.g. `bin/keybinds-json`, `bin/state-store`, IPC socket handlers, or QML components).
- Proposed mitigations or fixes, if any.

### Response Timeline

- **Initial Acknowledgment**: Within 48 hours of receiving your disclosure.
- **Triage & Assessment**: Within 5 business days, confirming whether the report is reproducible and assessing severity.
- **Remediation & Patch**: A fix will be developed and tested against security review invariants.
- **Public Disclosure**: Coordinated advisory and release notes published once a patched version is available.
