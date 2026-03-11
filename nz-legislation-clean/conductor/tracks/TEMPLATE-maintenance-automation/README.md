# Maintenance Automation Track Template

## Overview

This track provides automated maintenance workflows for the repository. Run periodically to ensure repository health, security, and code quality.

## Trigger Methods

### 1. Manual Trigger
```bash
# Run maintenance track
/conductor:run-track maintenance-automation
```

### 2. Scheduled (GitHub Actions)
Configure in `.github/workflows/maintenance.yml`:
```yaml
on:
  schedule:
    - cron: '0 6 * * 1'  # Every Monday at 6am NZST
  workflow_dispatch:  # Allow manual trigger
```

### 3. Skill Integration
Create a reusable skill that can be invoked:
```
/maintenance:check
/maintenance:dependencies
/maintenance:security
/maintenance:cleanup
```

---

## Maintenance Tasks

### Phase 1: Dependency Management ✅

- [ ] Check for outdated dependencies
  ```bash
  npm outdated
  ```
  
- [ ] Verify Renovate is running
  - Check Renovate dashboard
  - Review pending PRs
  - Auto-merge safe updates
  
- [ ] Security audit
  ```bash
  npm audit
  npm audit fix
  ```

- [ ] Remove unused dependencies
  ```bash
  npx depcheck
  ```

### Phase 2: Code Quality ✅

- [ ] Run ESLint
  ```bash
  npm run lint
  ```

- [ ] Run type check
  ```bash
  npm run typecheck
  ```

- [ ] Run tests
  ```bash
  npm test
  ```

- [ ] Run benchmarks
  ```bash
  npm run bench
  ```

- [ ] Check code coverage
  ```bash
  npm test -- --coverage
  ```

### Phase 3: Repository Health ✅

- [ ] Check for stale issues
  - Issues inactive >30 days
  - PRs inactive >14 days
  
- [ ] Review open PRs
  - Auto-merge passing PRs
  - Request reviews on stale PRs
  
- [ ] Check branch protection
  - Verify main branch protection
  - Review required status checks

- [ ] Clean up old branches
  - Delete merged branches
  - Delete abandoned feature branches

### Phase 4: Documentation ✅

- [ ] Update changelog
  - Generate from commits since last release
  - Add to CHANGELOG.md
  
- [ ] Check README accuracy
  - Verify installation instructions
  - Test example commands
  - Update version numbers

- [ ] Review API documentation
  - Regenerate TypeDoc
  - Check for broken links

### Phase 5: Security ✅

- [ ] Run security scans
  ```bash
  npm audit --audit-level=moderate
  ```

- [ ] Check for vulnerable actions
  - Review GitHub Actions versions
  - Update to latest stable versions

- [ ] Verify secrets scanning
  - Check GitHub secret scanning alerts
  - Rotate any exposed credentials

- [ ] Review permissions
  - Check GitHub token permissions
  - Verify OAuth app access

### Phase 6: Performance ✅

- [ ] Run performance benchmarks
  ```bash
  npm run bench
  ```

- [ ] Compare with baseline
  - Check for regressions >10%
  - Document any significant changes

- [ ] Bundle size check
  ```bash
  npm run build
  # Check dist/ size
  ```

### Phase 7: Cleanup ✅

- [ ] Remove temporary files
  ```bash
  # Clean npm cache
  npm cache clean --force
  
  # Remove old logs
  rm -rf ~/.nz-legislation-tool/logs/*.log
  ```

- [ ] Update gitignore
  - Check for new patterns to ignore
  - Verify no sensitive files tracked

- [ ] Check for TODO/FIXME comments
  - Create issues for outstanding items
  - Resolve completed items

---

## Automation Scripts

### maintenance-check.sh
```bash
#!/bin/bash
# Run all maintenance checks

echo "🔍 Running maintenance checks..."

# Dependencies
echo "📦 Checking dependencies..."
npm outdated
npm audit

# Code Quality
echo "✨ Running linters..."
npm run lint
npm run typecheck

# Tests
echo "🧪 Running tests..."
npm test

# Benchmarks
echo "⚡ Running benchmarks..."
npm run bench

echo "✅ Maintenance checks complete!"
```

### maintenance-auto.yml (GitHub Actions)
```yaml
name: Maintenance Automation

on:
  schedule:
    - cron: '0 6 * * 1'  # Monday 6am NZST
  workflow_dispatch:

jobs:
  maintenance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - uses: pnpm/action-setup@v4
        with:
          version: 9
      
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install
      
      - name: Security audit
        run: npm audit
      
      - name: Run linters
        run: npm run lint
      
      - name: Run type check
        run: npm run typecheck
      
      - name: Run tests
        run: npm test
      
      - name: Run benchmarks
        run: npm run bench
      
      - name: Create maintenance report
        run: |
          echo "# Maintenance Report - $(date)" > maintenance-report.md
          echo "## Dependencies" >> maintenance-report.md
          npm outdated >> maintenance-report.md 2>&1 || true
          echo "## Security Audit" >> maintenance-report.md
          npm audit >> maintenance-report.md 2>&1 || true
      
      - name: Upload report
        uses: actions/upload-artifact@v4
        with:
          name: maintenance-report
          path: maintenance-report.md
```

---

## Skill Commands (Future)

Create MCP skills for maintenance:

### `/maintenance:check`
Run all maintenance checks and report status

### `/maintenance:dependencies`
Check and update dependencies

### `/maintenance:security`
Run security scans and audits

### `/maintenance:cleanup`
Clean up repository artifacts

### `/maintenance:report`
Generate maintenance report

---

## Schedule Recommendations

| Task | Frequency | Automation |
|------|-----------|------------|
| Dependency updates | Weekly | Renovate |
| Security audit | Weekly | GitHub Actions |
| Code quality checks | Every commit | Pre-commit hooks |
| Full maintenance | Monthly | GitHub Actions |
| Performance benchmarks | Monthly | GitHub Actions |
| Documentation review | Quarterly | Manual |
| Dependency cleanup | Quarterly | Manual + depcheck |

---

## Alerts & Notifications

Configure alerts for:
- [ ] Security vulnerabilities (immediate)
- [ ] Failed CI/CD builds (immediate)
- [ ] Dependency updates (weekly digest)
- [ ] Stale issues/PRs (weekly)
- [ ] Performance regressions (monthly)

---

## Success Criteria

Maintenance is successful when:
- ✅ No security vulnerabilities
- ✅ All tests passing
- ✅ No ESLint errors
- ✅ Dependencies up to date
- ✅ Documentation current
- ✅ No stale issues/PRs >30 days
- ✅ Performance within baseline

---

**Created:** 2026-03-09  
**Version:** 1.0  
**Status:** Ready for implementation
