# Performance Metrics Interpretation Guide

This guide helps you understand and interpret the performance metrics collected by the NZ Legislation Tool audit system.

---

## Quick Reference

| Metric                 | Good   | Fair      | Poor       | Critical |
| ---------------------- | ------ | --------- | ---------- | -------- |
| **Startup Time**       | <200ms | 200-300ms | 300-500ms  | >500ms   |
| **API Response (p95)** | <500ms | 500-750ms | 750-1000ms | >1000ms  |
| **Memory Peak**        | <256MB | 256-400MB | 400-512MB  | >512MB   |
| **Bundle Size**        | <5MB   | 5-7MB     | 7-10MB     | >10MB    |
| **Cache Hit Rate**     | >80%   | 60-80%    | 40-60%     | <40%     |

---

## CLI Startup Time

### What It Measures

Startup time measures how long it takes from running `nzlegislation` command to when the CLI is ready to accept input.

### Components

1. **Node.js Initialization:** ~50-100ms
2. **Module Loading:** ~50-200ms (depends on dependencies)
3. **CLI Framework Setup:** ~10-50ms
4. **Configuration Loading:** ~5-20ms

### How to Interpret

**Cold Start:** First run after system boot or cache clear

- Includes full module loading
- Most realistic for occasional users

**Warm Start:** Subsequent runs

- Benefits from OS file caching
- Represents power user experience

### Common Issues

#### Slow Startup (>500ms)

**Symptoms:**

- CLI feels sluggish
- Noticeable delay before help text appears

**Causes:**

- Too many dependencies
- Large module imports
- Synchronous initialization
- Slow config loading

**Solutions:**

1. Profile with Clinic.js: `clinic doctor -- node dist/cli.js`
2. Implement lazy loading for non-critical modules
3. Use ES modules for better tree-shaking
4. Cache configuration loading
5. Remove unused dependencies

### Optimization Strategies

```typescript
// ❌ Bad: Load everything upfront
import { searchWorks } from './commands/search.js';
import { getWork } from './commands/get.js';
import { exportWorks } from './commands/export.js';
import { citeWork } from './commands/cite.js';

// ✅ Good: Lazy load commands
async function loadSearchCommand() {
  return await import('./commands/search.js');
}
```

---

## API Response Times

### What It Measures

Time from API request initiation to receiving and parsing the response.

### Components

1. **Network Latency:** ~10-100ms (depends on location)
2. **API Processing:** ~50-300ms (server-side)
3. **Response Parsing:** ~5-50ms (client-side)
4. **Validation:** ~5-20ms (Zod schema validation)

### How to Interpret

**Average:** Mean response time across all samples

- Good for general performance overview
- Can be skewed by outliers

**P95 (95th Percentile):** 95% of requests are faster than this

- Better metric for user experience
- Accounts for outliers
- **This is our primary target metric**

### Common Issues

#### Slow Search (>750ms p95)

**Symptoms:**

- Search feels slow
- Users perceive the tool as "laggy"

**Causes:**

- Network congestion
- API server load
- Large result sets
- No caching

**Solutions:**

1. Enable response caching (Phase 2)
2. Implement request batching (Phase 3)
3. Add pagination for large results
4. Use connection pooling (Phase 5)

#### Slow Get Work (>750ms p95)

**Symptoms:**

- Individual lookups are slow
- Citation generation delayed

**Causes:**

- Same as search issues
- Complex response parsing
- Validation overhead

**Solutions:**

1. Cache work details (already implemented)
2. Optimize Zod schemas
3. Use streaming for large responses

### Optimization Strategies

```typescript
// ❌ Bad: No caching
async function getWork(workId: string) {
  const response = await api.get(`/works/${workId}`);
  return parseWork(response);
}

// ✅ Good: With caching
async function getWork(workId: string) {
  const cacheKey = `work:${workId}`;
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  const response = await api.get(`/works/${workId}`);
  const work = parseWork(response);
  cache.set(cacheKey, work, { ttl: 3600 });
  return work;
}
```

---

## Memory Usage

### What It Measures

Heap memory used by the Node.js process during operation.

### Components

1. **Baseline:** Memory used at startup (modules, config)
2. **Peak:** Maximum memory during operation
3. **After GC:** Memory remaining after garbage collection

### How to Interpret

**Baseline (50-150MB typical):**

- Higher = more dependencies or larger modules
- Should be stable across runs

**Peak (<256MB target):**

- Indicates memory needed for typical operations
- Higher = potential memory inefficiency

**After GC:**

- Should be close to baseline
- Large difference = memory pressure or leaks

### Common Issues

#### High Memory Usage (>400MB)

**Symptoms:**

- System slows down
- Other applications affected
- Possible crashes on low-memory systems

**Causes:**

- Loading large datasets into memory
- Memory leaks (unclosed handles, growing caches)
- Inefficient data structures
- Buffer accumulation

**Detection:**

```bash
# Run with memory profiling
node --inspect dist/cli.js search --query "health" --limit 1000

# Then open chrome://inspect and take heap snapshot
```

**Solutions:**

1. Use streaming for large exports (Phase 4)
2. Implement pagination
3. Clear caches periodically
4. Fix memory leaks

### Memory Leak Detection

```javascript
// Monitor memory over time
setInterval(() => {
  const usage = process.memoryUsage();
  console.log({
    heapUsed: (usage.heapUsed / 1024 / 1024).toFixed(2) + ' MB',
    heapTotal: (usage.heapTotal / 1024 / 1024).toFixed(2) + ' MB',
    rss: (usage.rss / 1024 / 1024).toFixed(2) + ' MB',
  });
}, 5000);
```

### Optimization Strategies

```typescript
// ❌ Bad: Load all results into memory
async function exportAll(query: string) {
  const allResults = [];
  let offset = 0;
  while (true) {
    const results = await searchWorks({ query, limit: 100, offset });
    if (results.length === 0) break;
    allResults.push(...results);
    offset += 100;
  }
  // allResults could be GBs in memory!
  return generateExport(allResults);
}

// ✅ Good: Stream results
async function exportAll(query: string, outputStream: WriteStream) {
  let offset = 0;
  while (true) {
    const results = await searchWorks({ query, limit: 100, offset });
    if (results.length === 0) break;
    for (const result of results) {
      outputStream.write(formatRow(result) + '\n');
    }
    offset += 100;
  }
  // Constant memory usage regardless of result size
}
```

---

## Bundle Size

### What It Measures

Size of compiled JavaScript in the `dist/` directory.

### Components

1. **Main Bundle:** Your application code
2. **Dependencies:** Third-party libraries
3. **Type Definitions:** TypeScript type information (if included)

### How to Interpret

**Total <5MB:**

- Excellent for a CLI tool
- Fast installation
- Minimal disk usage

**5-10MB:**

- Acceptable
- Consider optimization

**>10MB:**

- Needs investigation
- Likely including unnecessary dependencies

### Common Issues

#### Large Bundle (>10MB)

**Causes:**

- Including dev dependencies in production
- Large dependencies (lodash, moment.js)
- Duplicate dependencies
- No tree-shaking
- Including source maps in production

**Analysis:**

```bash
# Run bundle analyzer
npm run build:analyze

# Or use webpack-bundle-analyzer
npx webpack-bundle-analyzer dist/stats.json
```

**Solutions:**

1. Replace heavy dependencies (moment.js → date-fns)
2. Enable tree-shaking (ES modules)
3. Remove unused dependencies
4. Lazy load large modules
5. Don't include source maps in production

### Optimization Strategies

```json
// ❌ Bad: Import entire library
import _ from 'lodash';
_.debounce(() => {}, 100);

// ✅ Good: Import only what you need
import { debounce } from 'lodash-es';
debounce(() => {}, 100);

// ✅ Better: Use lighter alternative
import { debounce } from 'es-toolkit';
debounce(() => {}, 100);
```

---

## Cache Metrics

### What It Measures

Effectiveness of the LRU caching layer for API responses.

### Components

1. **Hits:** Requests served from cache
2. **Misses:** Requests requiring API call
3. **Hit Rate:** Percentage of requests cached (hits / (hits + misses))
4. **Evictions:** Items removed due to cache size limits

### How to Interpret

**Hit Rate >80%:**

- Excellent caching
- Minimal API calls
- Fast response times

**Hit Rate 60-80%:**

- Good caching
- Room for improvement

**Hit Rate <60%:**

- Poor caching
- Too many API calls
- Consider increasing TTL or cache size

### Common Issues

#### Low Hit Rate (<50%)

**Causes:**

- Short TTL values
- Small cache size
- High query diversity
- Cache not being used

**Solutions:**

1. Increase cache TTL
2. Increase max cache size
3. Implement cache warming
4. Review cache key generation

### Optimization Strategies

```typescript
// Cache configuration
const CACHE_CONFIG = {
  max: 500, // Max entries
  searchTTL: 30 * 60 * 1000, // 30 minutes for search
  workTTL: 2 * 60 * 60 * 1000, // 2 hours for work details
  versionsTTL: 60 * 60 * 1000, // 1 hour for versions
};

// Cache warming (preload frequently accessed data)
async function warmCache() {
  const commonQueries = ['health', 'act', 'regulation'];
  for (const query of commonQueries) {
    await searchWorks({ query, limit: 10 });
  }
}
```

---

## Rate Limit Status

### What It Measures

Remaining API requests before hitting rate limits.

### Limits

- **Daily:** 10,000 requests per 24 hours
- **Burst:** 2,000 requests per 5 minutes

### How to Interpret

**Remaining >50%:**

- Healthy usage
- No action needed

**Remaining 20-50%:**

- Moderate usage
- Monitor closely

**Remaining <20%:**

- High usage
- Consider reducing request rate
- Enable aggressive caching

### Common Issues

#### Rate Limit Exceeded

**Symptoms:**

- 429 Too Many Requests errors
- Requests blocked until reset

**Causes:**

- Too many API calls
- Inefficient caching
- Bulk operations without batching

**Solutions:**

1. Enable caching
2. Implement request batching
3. Add rate limit awareness to CLI
4. Use exponential backoff

---

## Performance Trend Analysis

### Reading Trends

**Improving Trend:**

- Scores increasing over time
- Response times decreasing
- Memory usage stable or decreasing

**Stable Trend:**

- Scores consistent
- No significant changes
- Performance is predictable

**Degrading Trend:**

- Scores decreasing
- Response times increasing
- Memory usage growing

### Action Triggers

| Trend                  | Action                       |
| ---------------------- | ---------------------------- |
| Score drops >10 points | Investigate immediately      |
| Score drops >20 points | Block releases, fix required |
| Consistent degradation | Schedule performance sprint  |
| Improving trend        | Document optimizations       |

---

## Tools for Analysis

### Clinic.js

```bash
# Doctor mode (automatic analysis)
clinic doctor -- node dist/cli.js search --query "health"

# Flame mode (CPU profiling)
clinic flame -- node dist/cli.js export --query "health"

# Bubbleprof mode (async profiling)
clinic bubbleprof -- node dist/cli.js search --query "health"
```

### Node.js Built-in Profiler

```bash
# CPU profiling
node --prof dist/cli.js search --query "health"
node --prof-process --preprocess -j isolate-*.log > profile.json

# Memory profiling
node --inspect dist/cli.js
# Then use Chrome DevTools
```

### Chrome DevTools

1. Run with inspect: `node --inspect dist/cli.js`
2. Open `chrome://inspect`
3. Attach to process
4. Use Performance and Memory tabs

---

## Resources

- [Performance Dashboard](./PERFORMANCE_DASHBOARD.md)
- [Performance Scorecards](./PERFORMANCE_SCORECARDS.md)
- [Clinic.js Documentation](https://clinicjs.org/documentation/)
- [Node.js Performance Tools](https://nodejs.org/en/docs/guides/simple-profiling/)

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-10  
**Track:** Performance & Scalability
