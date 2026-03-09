# Repository Maintenance Guide

## Overview

This guide covers all automated and manual maintenance tasks for the NZ Legislation Tool repository.

---

## 🤖 Automated Maintenance

### GitHub Actions Workflows

#### 1. Maintenance Automation (Weekly)

**File:** `.github/workflows/maintenance.yml`  
**Schedule:** Every Monday at 6am NZST

**Tasks:**

- Security audit (`npm audit`)
- Linting (`npm run lint`)
- Type checking (`npm run typecheck`)
- Tests (`npm test`)
- Dependency check (`npm outdated`)
- Unused dependency check (`npx depcheck`)
- Performance benchmarks (`npm run bench`)

**Output:** Maintenance report in workflow summary

#### 2. Stale Issue/PR Management (Daily)

**File:** `.github/workflows/stale.yml`  
**Schedule:** Daily at midnight UTC

**Tasks:**

- Marks issues inactive >30 days as stale
- Closes stale issues after 14 more days
- Marks PRs inactive >14 days as stale
- Closes stale PRs after 7 more days
- Exempts bug, enhancement, security, and pinned items

#### 3. Renovate Bot (Automated)

**File:** `renovate.json`  
**Schedule:** Daily checks

**Tasks:**

- Checks for dependency updates
- Creates PRs for updates
- Auto-merges minor/patch updates
- Groups related dependencies

#### 4. CI/CD Pipeline (On Push/PR)

**File:** `.github/workflows/ci.yml`

**Tasks:**

- Runs on every push and PR
- Linting and type checking
- Test execution
- Build verification
- npm publishing on releases

---

## 📋 Manual Maintenance Tasks

### Weekly

- [ ] Review Renovate PRs
- [ ] Check maintenance workflow report
- [ ] Review security alerts
- [ ] Check for new issues/PRs

### Monthly

- [ ] Review and close stale issues
- [ ] Update documentation if needed
- [ ] Review performance benchmarks
- [ ] Check dependency tree for issues

### Quarterly

- [ ] Major version dependency updates
- [ ] Review and update issue templates
- [ ] Review branch protection rules
- [ ] Audit GitHub permissions
- [ ] Review and update CI/CD workflows

---

## 🔧 Maintenance Commands

### Security

```bash
# Security audit
npm audit

# Fix vulnerabilities
npm audit fix

# Force fix (may break changes)
npm audit fix --force
```

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint -- --fix

# Type check
npm run typecheck
```

### Tests

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage

# Run specific test file
npm test tests/specific.test.ts
```

### Dependencies

```bash
# Check outdated
npm outdated

# Update all (respecting semver)
npm update

# Update specific package
npm update package-name

# Check unused
npx depcheck
```

### Performance

```bash
# Run benchmarks
npm run bench

# Build and check size
npm run build
ls -lh dist/
```

---

## 📊 Maintenance Dashboard

### Key Metrics to Monitor

| Metric                   | Target | Check Frequency |
| ------------------------ | ------ | --------------- |
| Security vulnerabilities | 0      | Weekly          |
| ESLint errors            | 0      | Every commit    |
| Test pass rate           | 100%   | Every commit    |
| Type errors              | 0      | Every commit    |
| Outdated dependencies    | <10%   | Weekly          |
| Stale issues             | <5     | Weekly          |
| Stale PRs                | <3     | Weekly          |
| Build time               | <2 min | Every commit    |
| Benchmark regression     | <10%   | Monthly         |

### Where to Check

- **Security:** GitHub Security tab, `npm audit`
- **Code Quality:** ESLint output, pre-commit hooks
- **Tests:** GitHub Actions, `npm test`
- **Dependencies:** Renovate dashboard, `npm outdated`
- **Issues/PRs:** GitHub Issues, GitHub PRs
- **Performance:** Benchmark workflow, `npm run bench`

---

## 🚨 Common Issues & Fixes

### 1. Security Vulnerabilities

**Issue:** `npm audit` reports vulnerabilities

**Fix:**

```bash
# Try automatic fix first
npm audit fix

# If that fails, update specific package
npm update vulnerable-package

# As last resort (may break changes)
npm audit fix --force
```

### 2. Failing Tests

**Issue:** Tests failing after dependency update

**Fix:**

1. Check test output for specific errors
2. Review dependency changelog
3. Update test code if API changed
4. Pin dependency version if breaking change

### 3. ESLint Errors

**Issue:** New ESLint errors after dependency update

**Fix:**

```bash
# Auto-fix where possible
npm run lint -- --fix

# Review remaining errors manually
npm run lint
```

### 4. Type Errors

**Issue:** TypeScript errors after update

**Fix:**

1. Review error messages
2. Update type definitions
3. Check dependency type updates
4. Update `tsconfig.json` if needed

### 5. Stale Dependencies

**Issue:** Many dependencies outdated

**Fix:**

1. Let Renovate handle minor/patch updates
2. Review major updates manually
3. Update in batches, not all at once
4. Test thoroughly after each batch

---

## 📝 Maintenance Checklist

### Pre-Release Checklist

- [ ] All tests passing
- [ ] No ESLint errors
- [ ] No type errors
- [ ] No security vulnerabilities
- [ ] Changelog updated
- [ ] Version bumped
- [ ] Documentation updated
- [ ] Benchmarks within baseline

### Post-Release Checklist

- [ ] npm package published
- [ ] GitHub release created
- [ ] Release notes posted
- [ ] Documentation deployed
- [ ] Announce release (if applicable)

### Monthly Maintenance

- [ ] Review all open issues
- [ ] Review all open PRs
- [ ] Check dependency updates
- [ ] Review security alerts
- [ ] Check benchmark trends
- [ ] Update documentation
- [ ] Clean up old branches
- [ ] Review GitHub Actions usage

---

## 🛠️ Maintenance Tools

### Installed Tools

- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Type checking
- **Vitest** - Testing
- **Benchmark** - Performance testing
- **Depcheck** - Unused dependency detection
- **Renovate** - Dependency updates
- **Husky** - Git hooks
- **lint-staged** - Staged file linting

### GitHub Features

- **Security Scanning** - Automated vulnerability detection
- **Dependabot/Renovate** - Dependency updates
- **Actions** - CI/CD automation
- **Stale Bot** - Issue/PR management
- **Code Review** - PR review process
- **Releases** - Version management

---

## 📖 Additional Resources

- [npm audit documentation](https://docs.npmjs.com/cli/commands/npm-audit)
- [Renovate documentation](https://docs.renovatebot.com/)
- [GitHub Actions documentation](https://docs.github.com/en/actions)
- [TypeScript documentation](https://www.typescriptlang.org/docs/)
- [ESLint documentation](https://eslint.org/docs/user-guide/)

---

## 🎯 Best Practices

1. **Automate Everything** - Use GitHub Actions for repetitive tasks
2. **Small Updates** - Update dependencies in small batches
3. **Test Thoroughly** - Always run full test suite after updates
4. **Monitor Continuously** - Check dashboards regularly
5. **Document Changes** - Keep changelog and docs up to date
6. **Security First** - Address vulnerabilities immediately
7. **Performance Matters** - Track benchmarks over time
8. **Community Friendly** - Use templates and clear communication

---

**Last Updated:** 2026-03-09  
**Version:** 1.0  
**Maintained By:** Repository Maintainers
