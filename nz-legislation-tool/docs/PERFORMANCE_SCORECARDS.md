# Performance Scorecards

This document defines the performance scorecard system for tracking and evaluating NZ Legislation Tool performance.

## Scorecard System Overview

Each performance category is scored from 0-100 based on how well it meets targets.

---

## Scoring Criteria

### 1. Startup Time Score

**Target:** <200ms average, <300ms p95

**Calculation:**
```
startupScore = max(0, 100 - ((averageStartupMs - 200) / 10))
```

**Interpretation:**
- **100-90:** ✅ Excellent (<200ms)
- **89-80:** ✅ Good (200-250ms)
- **79-70:** ⚠️ Fair (250-300ms)
- **69-60:** ⚠️ Poor (300-350ms)
- **<60:** ❌ Critical (>350ms)

---

### 2. API Response Score

**Target:** <500ms p95 for all endpoints

**Calculation:**
```
apiP95 = max(searchP95, getWorkP95, getVersionsP95)
apiScore = max(0, 100 - ((apiP95 - 500) / 10))
```

**Interpretation:**
- **100-90:** ✅ Excellent (<500ms)
- **89-80:** ✅ Good (500-600ms)
- **79-70:** ⚠️ Fair (600-700ms)
- **69-60:** ⚠️ Poor (700-800ms)
- **<60:** ❌ Critical (>800ms)

---

### 3. Memory Usage Score

**Target:** <256MB peak usage

**Calculation:**
```
memoryScore = max(0, 100 - ((peakMemoryMB - 256) / 5))
```

**Interpretation:**
- **100-90:** ✅ Excellent (<256MB)
- **89-80:** ✅ Good (256-300MB)
- **79-70:** ⚠️ Fair (300-350MB)
- **69-60:** ⚠️ Poor (350-400MB)
- **<60:** ❌ Critical (>400MB)

---

### 4. Bundle Size Score

**Target:** <5MB (5120KB) total

**Calculation:**
```
bundleScore = max(0, 100 - ((totalBundleKB - 5120) / 50))
```

**Interpretation:**
- **100-90:** ✅ Excellent (<5MB)
- **89-80:** ✅ Good (5-6MB)
- **79-70:** ⚠️ Fair (6-7MB)
- **69-60:** ⚠️ Poor (7-8MB)
- **<60:** ❌ Critical (>8MB)

---

## Overall Score Calculation

The overall performance score is a weighted average:

```
overallScore = round(
  (startupScore × 0.25) +
  (apiScore × 0.35) +      # API response is most important
  (memoryScore × 0.25) +
  (bundleScore × 0.15)     # Bundle size is least critical
)
```

**Weights Rationale:**
- **API Response (35%):** Most critical for user experience
- **Startup Time (25%):** Important for CLI responsiveness
- **Memory Usage (25%):** Important for system resource management
- **Bundle Size (15%):** Less critical for installed CLI tools

---

## Scorecard Template

### Current Period Scorecard

**Period:** YYYY-MM-DD to YYYY-MM-DD

| Category | Score | Previous | Change | Status |
|----------|-------|----------|--------|--------|
| **Overall** | TBD/100 | - | - | ⏳ |
| Startup Time | TBD/100 | - | - | ⏳ |
| API Response | TBD/100 | - | - | ⏳ |
| Memory Usage | TBD/100 | - | - | ⏳ |
| Bundle Size | TBD/100 | - | - | ⏳ |

### Detailed Metrics

#### Startup Time
- Average: TBD ms
- P95: TBD ms
- Samples: TBD
- Trend: ⏳

#### API Response
| Endpoint | Average | P95 | Samples |
|----------|---------|-----|---------|
| Search | TBD ms | TBD ms | TBD |
| Get Work | TBD ms | TBD ms | TBD |
| Get Versions | TBD ms | TBD ms | TBD |

#### Memory Usage
- Baseline: TBD MB
- Peak: TBD MB
- After GC: TBD MB

#### Bundle Size
- Total: TBD KB
- Main Bundle: TBD KB
- Dependencies: TBD KB

---

## Performance Trends

### Historical Scorecards

| Period | Overall | Startup | API | Memory | Bundle |
|--------|---------|---------|-----|--------|--------|
| 2026-03-10 | ⏳ | ⏳ | ⏳ | ⏳ | ⏳ |

### Trend Analysis

**Startup Time:** ⏳ Awaiting baseline
**API Response:** ⏳ Awaiting baseline
**Memory Usage:** ⏳ Awaiting baseline
**Bundle Size:** ⏳ Awaiting baseline

---

## Performance Gates

These gates are used in CI/CD to prevent performance regressions:

### Critical Gates (Block Merge)

| Metric | Threshold | Action |
|--------|-----------|--------|
| Overall Score | <50 | Block merge |
| API Response Score | <60 | Block merge |
| Memory Score | <60 | Block merge |

### Warning Gates (Log Warning)

| Metric | Threshold | Action |
|--------|-----------|--------|
| Overall Score | <70 | Log warning |
| Startup Score | <70 | Log warning |
| Bundle Score | <70 | Log warning |

### Info Gates (Track Only)

| Metric | Threshold | Action |
|--------|-----------|--------|
| Any score drop >10 points | Any | Track trend |

---

## How to Use Scorecards

### For Developers

1. **Run Audit:** Execute `npm run bench:audit` before major changes
2. **Check Scores:** Review scorecard in generated report
3. **Compare:** Check against previous baseline
4. **Optimize:** If scores are low, review recommendations
5. **Track:** Update this document with new scores

### For Code Review

1. **Check Impact:** Does this PR affect performance?
2. **Run Audit:** If yes, run performance audit
3. **Verify Scores:** Ensure no critical gates are blocked
4. **Document:** Note any expected score changes in PR description

### For Release Management

1. **Pre-Release Audit:** Run full audit before each release
2. **Compare Baselines:** Check against previous release
3. **Review Trends:** Ensure no degradation over time
4. **Document:** Include scorecard in release notes

---

## Integration with CI/CD

### GitHub Actions Workflow

```yaml
name: Performance Check

on:
  pull_request:
    branches: [main]

jobs:
  performance:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build
        run: npm run build
      
      - name: Run performance audit
        run: npm run bench:audit
      
      - name: Check performance gates
        run: node scripts/check-performance-gates.js
      
      - name: Upload results
        uses: actions/upload-artifact@v4
        with:
          name: performance-results
          path: performance-audit-results/
```

### Performance Gate Checker

Create `scripts/check-performance-gates.js`:

```javascript
import { readFileSync } from 'fs';
import { glob } from 'glob';

// Get latest baseline file
const files = glob.sync('performance-audit-results/performance-baseline-*.json');
const latest = files.sort().pop();

const baseline = JSON.parse(readFileSync(latest, 'utf-8'));

// Check critical gates
const gates = {
  overall: { threshold: 50, value: baseline.scorecards.overall },
  api: { threshold: 60, value: baseline.scorecards.api },
  memory: { threshold: 60, value: baseline.scorecards.memory },
};

let failed = false;
for (const [name, gate] of Object.entries(gates)) {
  if (gate.value < gate.threshold) {
    console.error(`❌ CRITICAL: ${name} score (${gate.value}) below threshold (${gate.threshold})`);
    failed = true;
  }
}

if (failed) {
  console.error('\nPerformance gates failed!');
  process.exit(1);
}

console.log('✅ All performance gates passed');
process.exit(0);
```

---

## Alerts and Notifications

### Alert Configuration

Configure alerts in your monitoring system:

| Alert | Condition | Severity | Notification |
|-------|-----------|----------|--------------|
| Performance Degradation | Overall score drops >20 points | High | Email + Slack |
| API Slowdown | API score <70 | Medium | Slack |
| Memory Leak Suspected | Memory score declining trend | High | Email |
| Bundle Bloat | Bundle score <70 | Low | Slack |

### Alert Handlers

Set up automated responses:

1. **High Severity:** Create GitHub issue automatically
2. **Medium Severity:** Post to #performance Slack channel
3. **Low Severity:** Add to weekly performance report

---

## Resources

- [Performance Dashboard](./PERFORMANCE_DASHBOARD.md)
- [Performance Audit Script](../benchmarks/performance-audit.ts)
- [CI/CD Integration](../.github/workflows/performance.yml)

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-10  
**Track:** Performance & Scalability
