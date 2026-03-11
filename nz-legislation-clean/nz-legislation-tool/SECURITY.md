# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

We take the security of nz-legislation seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### How to Report

**Please do NOT report security vulnerabilities through public GitHub issues.**

Instead, please report them via email to: **dylan.mordaunt@vuw.ac.nz**

You should receive a response within 48 hours acknowledging your report.

### What to Include

Please include the following information in your report:

- **Type of issue** (e.g., buffer overflow, SQL injection, cross-site scripting, etc.)
- **Full paths** of source file(s) related to the issue
- **Location** of the affected source code (tag/branch/commit or direct URL)
- **Step-by-step instructions** to reproduce the issue
- **Proof-of-concept** or exploit code (if possible)
- **Impact** of the issue, including how an attacker might exploit it

### Response Process

1. **Acknowledgment** (within 48 hours)
   - We'll confirm receipt of your report

2. **Investigation** (within 5 business days)
   - We'll investigate the reported issue
   - We may request additional information

3. **Resolution** (timeline depends on severity)
   - **Critical**: Within 7 days
   - **High**: Within 14 days
   - **Medium**: Within 30 days
   - **Low**: Within 60 days

4. **Disclosure**
   - We'll coordinate with you on public disclosure
   - We'll credit you for the discovery (if you wish)
   - We'll publish a security advisory if appropriate

### Security Best Practices We Follow

- ✅ Regular dependency updates via Dependabot
- ✅ CI/CD security checks
- ✅ Code review for all changes
- ✅ Minimal permissions principle
- ✅ Secure API key handling
- ✅ No sensitive data in logs

### Known Limitations

- API keys are stored locally (not encrypted)
- No runtime security scanning (yet)
- Dependencies are trusted from npm registry

---

## Security Updates

Security updates will be released as patch versions (e.g., 1.0.1, 1.0.2) and announced via:

- GitHub Releases: https://github.com/edithatogo/nz-legislation/releases
- npm changelog: https://www.npmjs.com/package/nz-legislation

---

**Thank you for helping keep nz-legislation and our users safe!**
