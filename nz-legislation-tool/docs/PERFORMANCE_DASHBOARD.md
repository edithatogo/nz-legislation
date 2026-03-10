# Performance Dashboard

This document provides a comprehensive performance dashboard for the NZ Legislation Tool, tracking key performance metrics over time.

## Current Performance Baselines

**Last Updated:** 2026-03-10

### Overall Performance Score

| Category | Score | Target | Status |
|----------|-------|--------|--------|
| **Overall** | TBD/100 | >80 | ⏳ Pending |
| **Startup Time** | TBD/100 | <200ms | ⏳ Pending |
| **API Response** | TBD/100 | <500ms (p95) | ⏳ Pending |
| **Memory Usage** | TBD/100 | <256MB | ⏳ Pending |
| **Bundle Size** | TBD/100 | <5MB | ⏳ Pending |

---

## Performance Targets

These are the target metrics we aim to achieve:

| Metric | Target | Critical Threshold |
|--------|--------|-------------------|
| CLI Startup Time (average) | <200ms | <500ms |
| CLI Startup Time (p95) | <300ms | <750ms |
| API Response Time - Search (p95) | <500ms | <1000ms |
| API Response Time - Get Work (p95) | <500ms | <1000ms |
| API Response Time - Get Versions (p95) | <500ms | <1000ms |
| Memory Usage (peak) | <256MB | <512MB |
| Bundle Size (total) | <5MB | <10MB |
| Cache Hit Rate | >80% | >50% |
| Concurrent Requests Supported | >100 | >50 |

---

## Historical Trends

### CLI Startup Time

| Date | Average (ms) | P95 (ms) | Score |
|------|-------------|-----------|-------|
| 2026-03-10 | Baseline pending | Baseline pending | ⏳ |

**Trend:** ⏳ Awaiting baseline data

### API Response Times

| Date | Search (p95) | Get Work (p95) | Get Versions (p95) | Score |
|------|-------------|---------------|-------------------|-------|
| 2026-03-10 | Baseline pending | Baseline pending | Baseline pending | ⏳ |

**Trend:** ⏳ Awaiting baseline data

### Memory Usage

| Date | Baseline (MB) | Peak (MB) | After GC (MB) | Score |
|------|--------------|-----------|---------------|-------|
| 2026-03-10 | Baseline pending | Baseline pending | Baseline pending | ⏳ |

**Trend:** ⏳ Awaiting baseline data

### Bundle Size

| Date | Total (KB) | Main (KB) | Dependencies (KB) | Score |
|------|-----------|-----------|-------------------|-------|
| 2026-03-10 | Baseline pending | Baseline pending | Baseline pending | ⏳ |

**Trend:** ⏳ Awaiting baseline data

---

## Cache Metrics

| Metric | Current | Target |
|--------|---------|--------|
| Cache Hit Rate | TBD% | >80% |
| Total Cache Entries | TBD | - |
| Cache Size (max) | 500 | 500 |
| Evictions | TBD | Minimize |

---

## Rate Limit Status

| Metric | Current | Limit |
|--------|---------|-------|
| Daily Remaining | TBD | 10,000/day |
| Burst Remaining | TBD | 2,000/5min |

---

## Performance Alerts

### Active Alerts

*No active alerts*

### Alert Configuration

| Alert Type | Threshold | Action |
|-----------|-----------|--------|
| High Response Time | >1000ms (p95) | Log warning |
| High Memory Usage | >512MB | Log warning |
| Low Cache Hit Rate | <50% | Log info |
| Bundle Size Growth | >10% increase | Log warning |

---

## How to Run Performance Audit

### Quick Audit

```bash
cd nz-legislation-tool
npm run bench:audit
```

This will:
1. Measure CLI startup time (5 cold + 5 warm starts)
2. Measure API response times (5 iterations per endpoint)
3. Measure memory usage (baseline, peak, after GC)
4. Analyze bundle size
5. Generate performance scorecards
6. Create markdown report and JSON baseline data

### Output

Results are saved to:
- `performance-audit-results/performance-audit-YYYY-MM-DD.md` - Human-readable report
- `performance-audit-results/performance-baseline-YYYY-MM-DD.json` - Machine-readable data

### Detailed Benchmarks

```bash
# Run micro-benchmarks
npm run bench

# Run with Clinic.js for profiling
npx clinic doctor -- node dist/cli.js search --query "health"
```

---

## Performance Optimization Roadmap

### Phase 1: Performance Audit & Baselines ✅ IN PROGRESS
- [x] Create performance audit script
- [ ] Run initial baseline audit
- [ ] Set up performance dashboard
- [ ] Define performance targets

### Phase 2: Response Caching ⏳ PENDING
- [ ] Design caching strategy
- [ ] Implement local caching
- [ ] Add Redis caching (optional)
- [ ] Integrate caching with API client
- [ ] Implement cache invalidation

### Phase 3: Request Batching ⏳ PENDING
- [ ] Design batching architecture
- [ ] Implement batch API support
- [ ] Optimize bulk operations
- [ ] Add batching to CLI

### Phase 4: Streaming Support ⏳ PENDING
- [ ] Design streaming architecture
- [ ] Implement streaming exports
- [ ] Add streaming to API client
- [ ] Optimize memory usage

### Phase 5: API Call Optimization ⏳ PENDING
- [ ] Implement connection pooling
- [ ] Optimize retry strategies
- [ ] Add request deduplication
- [ ] Optimize request payloads

### Phase 6: Bundle Size Optimization ⏳ PENDING
- [ ] Analyze bundle composition
- [ ] Implement tree shaking
- [ ] Optimize dependencies
- [ ] Configure build optimization

### Phase 7: Load Testing Infrastructure ⏳ PENDING
- [ ] Set up load testing tools
- [ ] Create load test scenarios
- [ ] Integrate with CI/CD
- [ ] Document load testing

### Phase 8: Performance Monitoring ⏳ PENDING
- [ ] Implement performance metrics
- [ ] Create performance reports
- [ ] Add performance alerts
- [ ] Build monitoring dashboard

### Phase 9: Startup Time Optimization ⏳ PENDING
- [ ] Profile startup sequence
- [ ] Implement lazy loading
- [ ] Optimize dependencies
- [ ] Add startup caching

### Phase 10: Testing & Validation ⏳ PENDING
- [ ] Run performance tests
- [ ] Conduct load testing
- [ ] Gather user feedback
- [ ] Iterate and optimize

---

## Performance Best Practices

### For Developers

1. **Always measure before optimizing** - Use the audit script to establish baselines
2. **Cache aggressively** - Use LRU cache for API responses
3. **Stream large datasets** - Never load entire datasets into memory
4. **Batch requests** - Group multiple operations when possible
5. **Monitor continuously** - Check performance metrics regularly

### For Users

1. **Use caching** - Enable local caching for repeated queries
2. **Batch operations** - Use bulk commands for multiple operations
3. **Export efficiently** - Use streaming exports for large datasets
4. **Monitor rate limits** - Check `config --show` for rate limit status

---

## Troubleshooting

### Slow Response Times

**Symptoms:** API calls taking >1000ms

**Solutions:**
1. Check network connectivity
2. Verify API key is valid
3. Check rate limit status
4. Enable caching: `config --set-cache-ttl 3600`
5. Review cache hit rate

### High Memory Usage

**Symptoms:** Process using >512MB RAM

**Solutions:**
1. Reduce batch sizes
2. Use streaming exports
3. Clear cache: `cache clear`
4. Check for memory leaks with Clinic.js

### Slow Startup

**Symptoms:** CLI taking >500ms to start

**Solutions:**
1. Check for large dependencies
2. Enable lazy loading
3. Reduce module imports
4. Profile with Clinic.js

---

## Resources

- [Performance Audit Script](../benchmarks/performance-audit.ts)
- [Benchmark Suite](../benchmarks/performance.ts)
- [Client Implementation](../src/client.ts)
- [Cache Implementation](../src/client.ts#L38-L162)

---

**Dashboard Version:** 1.0.0  
**Last Updated:** 2026-03-10  
**Maintained By:** Performance & Scalability Track
