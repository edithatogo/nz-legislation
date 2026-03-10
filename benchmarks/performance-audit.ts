/**
 * Performance Audit & Baselines
 * 
 * This script establishes comprehensive performance baselines for:
 * - CLI startup time
 * - API response times
 * - Memory usage
 * - Bundle size analysis
 * 
 * Run with: npm run tsx benchmarks/performance-audit.ts
 */

import { execSync } from 'child_process';
import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Output directory for audit results
const AUDIT_OUTPUT_DIR = join(__dirname, '..', 'performance-audit-results');

/**
 * Performance baseline data structure
 */
interface PerformanceBaseline {
  timestamp: string;
  cliStartup: {
    cold: number[]; // ms
    warm: number[]; // ms
    average: number;
    p95: number;
  };
  apiResponseTimes: {
    search: { average: number; p95: number; samples: number };
    getWork: { average: number; p95: number; samples: number };
    getVersions: { average: number; p95: number; samples: number };
  };
  memoryUsage: {
    baseline: number; // MB
    peak: number; // MB
    afterGC: number; // MB
  };
  bundleSize: {
    total: number; // KB
    main: number; // KB
    dependencies: number; // KB
  };
  scorecards: {
    overall: number; // 0-100
    startup: number;
    api: number;
    memory: number;
    bundle: number;
  };
}

/**
 * Calculate percentile
 */
function percentile(arr: number[], p: number): number {
  if (arr.length === 0) return 0;
  const sorted = arr.slice().sort((a, b) => a - b);
  const index = Math.ceil((p / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)];
}

/**
 * Calculate average
 */
function average(arr: number[]): number {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

/**
 * Measure CLI startup time
 */
async function measureCLIStartup(): Promise<{ cold: number[]; warm: number[] }> {
  const coldRuns: number[] = [];
  const warmRuns: number[] = [];
  const iterations = 5;

  console.log('\n📊 Measuring CLI Startup Time...');
  console.log(`   Running ${iterations} cold and warm starts...\n`);

  // Cold starts (clear cache first)
  for (let i = 0; i < iterations; i++) {
    // Clear tsx cache by using fresh process
    const start = Date.now();
    try {
      execSync('tsx src/cli.ts --help', { 
        stdio: 'pipe',
        env: { ...process.env, NODE_NO_WARNINGS: '1' }
      });
      const duration = Date.now() - start;
      coldRuns.push(duration);
      console.log(`   Cold run ${i + 1}: ${duration}ms`);
    } catch (error) {
      console.error(`   Cold run ${i + 1} failed: ${(error as Error).message}`);
    }
  }

  // Warm starts (module already loaded)
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      execSync('tsx src/cli.ts --help', { 
        stdio: 'pipe',
        env: { ...process.env, NODE_NO_WARNINGS: '1' }
      });
      const duration = Date.now() - start;
      warmRuns.push(duration);
      console.log(`   Warm run ${i + 1}: ${duration}ms`);
    } catch (error) {
      console.error(`   Warm run ${i + 1} failed: ${(error as Error).message}`);
    }
  }

  return { cold: coldRuns, warm: warmRuns };
}

/**
 * Measure API response times
 */
async function measureAPIResponseTimes(): Promise<{
  search: number[];
  getWork: number[];
  getVersions: number[];
}> {
  const searchTimes: number[] = [];
  const getWorkTimes: number[] = [];
  const getVersionsTimes: number[] = [];
  const iterations = 5;

  console.log('\n📡 Measuring API Response Times...');
  console.log(`   Running ${iterations} iterations for each endpoint...\n`);

  // Import client functions
  const { searchWorks, getWork, getWorkVersions } = await import('../src/client.js');

  // Search
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      await searchWorks({ query: 'health', limit: 10 });
      const duration = Date.now() - start;
      searchTimes.push(duration);
      console.log(`   Search ${i + 1}: ${duration}ms`);
    } catch (error) {
      console.error(`   Search ${i + 1} failed: ${(error as Error).message}`);
    }
  }

  // Get Work
  const TEST_WORK_ID = 'act/1986/132'; // Companies Act 1986
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      await getWork(TEST_WORK_ID);
      const duration = Date.now() - start;
      getWorkTimes.push(duration);
      console.log(`   Get Work ${i + 1}: ${duration}ms`);
    } catch (error) {
      console.error(`   Get Work ${i + 1} failed: ${(error as Error).message}`);
    }
  }

  // Get Versions
  for (let i = 0; i < iterations; i++) {
    const start = Date.now();
    try {
      await getWorkVersions(TEST_WORK_ID);
      const duration = Date.now() - start;
      getVersionsTimes.push(duration);
      console.log(`   Get Versions ${i + 1}: ${duration}ms`);
    } catch (error) {
      console.error(`   Get Versions ${i + 1} failed: ${(error as Error).message}`);
    }
  }

  return {
    search: searchTimes,
    getWork: getWorkTimes,
    getVersions: getVersionsTimes,
  };
}

/**
 * Measure memory usage
 */
async function measureMemoryUsage(): Promise<{
  baseline: number;
  peak: number;
  afterGC: number;
}> {
  console.log('\n💾 Measuring Memory Usage...');

  // Force GC if available (Node.js 20+)
  if (global.gc) {
    global.gc();
  }

  const baseline = process.memoryUsage();
  const baselineMB = baseline.heapUsed / 1024 / 1024;
  console.log(`   Baseline: ${baselineMB.toFixed(2)} MB`);

  // Perform some operations to increase memory usage
  console.log('   Running memory-intensive operations...');
  const { searchWorks } = await import('../src/client.js');
  
  // Load data into memory
  const results = [];
  for (let i = 0; i < 5; i++) {
    try {
      const result = await searchWorks({ query: 'health', limit: 50 });
      results.push(result);
    } catch {
      // Ignore errors
    }
  }

  const peak = process.memoryUsage();
  const peakMB = peak.heapUsed / 1024 / 1024;
  console.log(`   Peak: ${peakMB.toFixed(2)} MB`);

  // Force GC
  if (global.gc) {
    global.gc();
    // Wait for GC to complete
    await new Promise(resolve => setTimeout(resolve, 100));
  }

  const afterGC = process.memoryUsage();
  const afterGCMB = afterGC.heapUsed / 1024 / 1024;
  console.log(`   After GC: ${afterGCMB.toFixed(2)} MB`);

  return {
    baseline: baselineMB,
    peak: peakMB,
    afterGC: afterGCMB,
  };
}

/**
 * Analyze bundle size
 */
function analyzeBundleSize(): {
  total: number;
  main: number;
  dependencies: number;
} {
  console.log('\n📦 Analyzing Bundle Size...');

  try {
    // Check if dist directory exists
    const distDir = join(__dirname, '..', 'dist');
    if (!existsSync(distDir)) {
      console.log('   ⚠️  dist/ directory not found. Run `npm run build` first.');
      console.log('   Building project...');
      execSync('npm run build', { stdio: 'inherit' });
    }

    // Get file sizes
    const { readdirSync, statSync } = await import('fs');
    
    let totalSize = 0;
    let mainSize = 0;
    let dependencySize = 0;

    const files = readdirSync(distDir);
    for (const file of files) {
      const filePath = join(distDir, file);
      const stat = statSync(filePath);
      
      if (stat.isFile()) {
        const sizeKB = stat.size / 1024;
        totalSize += sizeKB;
        
        if (file === 'cli.js' || file === 'main.js') {
          mainSize += sizeKB;
        } else {
          dependencySize += sizeKB;
        }
      }
    }

    console.log(`   Total bundle size: ${totalSize.toFixed(2)} KB`);
    console.log(`   Main bundle: ${mainSize.toFixed(2)} KB`);
    console.log(`   Dependencies: ${dependencySize.toFixed(2)} KB`);

    return {
      total: totalSize,
      main: mainSize,
      dependencies: dependencySize,
    };
  } catch (error) {
    console.error('   Bundle analysis failed:', (error as Error).message);
    return {
      total: 0,
      main: 0,
      dependencies: 0,
    };
  }
}

/**
 * Calculate performance scorecards
 */
function calculateScorecards(baseline: PerformanceBaseline): {
  overall: number;
  startup: number;
  api: number;
  memory: number;
  bundle: number;
} {
  // Scoring criteria (0-100 scale)
  
  // Startup score: target <200ms
  const startupScore = Math.max(0, 100 - ((baseline.cliStartup.average - 200) / 10));
  
  // API score: target <500ms p95
  const apiP95 = Math.max(
    baseline.apiResponseTimes.search.p95,
    baseline.apiResponseTimes.getWork.p95,
    baseline.apiResponseTimes.getVersions.p95
  );
  const apiScore = Math.max(0, 100 - ((apiP95 - 500) / 10));
  
  // Memory score: target <256MB
  const memoryScore = Math.max(0, 100 - ((baseline.memoryUsage.peak - 256) / 5));
  
  // Bundle score: target <5MB (5120KB)
  const bundleScore = Math.max(0, 100 - ((baseline.bundleSize.total - 5120) / 50));

  // Overall score: weighted average
  const overall = Math.round(
    (startupScore * 0.25) +
    (apiScore * 0.35) +
    (memoryScore * 0.25) +
    (bundleScore * 0.15)
  );

  return {
    overall: Math.round(overall),
    startup: Math.round(startupScore),
    api: Math.round(apiScore),
    memory: Math.round(memoryScore),
    bundle: Math.round(bundleScore),
  };
}

/**
 * Generate markdown report
 */
function generateMarkdownReport(baseline: PerformanceBaseline): string {
  return `# Performance Audit Report

**Generated:** ${baseline.timestamp}

---

## Executive Summary

**Overall Performance Score:** ${baseline.scorecards.overall}/100

| Category | Score | Status |
|----------|-------|--------|
| Startup | ${baseline.scorecards.startup}/100 | ${baseline.scorecards.startup >= 80 ? '✅ Good' : baseline.scorecards.startup >= 60 ? '⚠️ Fair' : '❌ Needs Improvement'} |
| API Response | ${baseline.scorecards.api}/100 | ${baseline.scorecards.api >= 80 ? '✅ Good' : baseline.scorecards.api >= 60 ? '⚠️ Fair' : '❌ Needs Improvement'} |
| Memory | ${baseline.scorecards.memory}/100 | ${baseline.scorecards.memory >= 80 ? '✅ Good' : baseline.scorecards.memory >= 60 ? '⚠️ Fair' : '❌ Needs Improvement'} |
| Bundle Size | ${baseline.scorecards.bundle}/100 | ${baseline.scorecards.bundle >= 80 ? '✅ Good' : baseline.scorecards.bundle >= 60 ? '⚠️ Fair' : '❌ Needs Improvement'} |

---

## CLI Startup Time

| Metric | Value | Target |
|--------|-------|--------|
| Average (Cold) | ${baseline.cliStartup.average.toFixed(0)}ms | <200ms |
| P95 (Cold) | ${baseline.cliStartup.p95.toFixed(0)}ms | <300ms |
| Samples | ${baseline.cliStartup.cold.length} | - |

**Trend:** ${baseline.cliStartup.average < 200 ? '✅ Within target' : '❌ Exceeds target'}

---

## API Response Times

| Endpoint | Average | P95 | Samples | Target |
|----------|---------|-----|---------|--------|
| Search | ${baseline.apiResponseTimes.search.average.toFixed(0)}ms | ${baseline.apiResponseTimes.search.p95.toFixed(0)}ms | ${baseline.apiResponseTimes.search.samples} | <500ms |
| Get Work | ${baseline.apiResponseTimes.getWork.average.toFixed(0)}ms | ${baseline.apiResponseTimes.getWork.p95.toFixed(0)}ms | ${baseline.apiResponseTimes.getWork.samples} | <500ms |
| Get Versions | ${baseline.apiResponseTimes.getVersions.average.toFixed(0)}ms | ${baseline.apiResponseTimes.getVersions.p95.toFixed(0)}ms | ${baseline.apiResponseTimes.getVersions.samples} | <500ms |

---

## Memory Usage

| Metric | Value | Target |
|--------|-------|--------|
| Baseline | ${baseline.memoryUsage.baseline.toFixed(2)} MB | - |
| Peak | ${baseline.memoryUsage.peak.toFixed(2)} MB | <256MB |
| After GC | ${baseline.memoryUsage.afterGC.toFixed(2)} MB | - |

**Status:** ${baseline.memoryUsage.peak < 256 ? '✅ Within target' : '❌ Exceeds target'}

---

## Bundle Size

| Component | Size | Target |
|-----------|------|--------|
| Total | ${baseline.bundleSize.total.toFixed(2)} KB | <5120KB |
| Main Bundle | ${baseline.bundleSize.main.toFixed(2)} KB | - |
| Dependencies | ${baseline.bundleSize.dependencies.toFixed(2)} KB | - |

**Status:** ${baseline.bundleSize.total < 5120 ? '✅ Within target' : '❌ Exceeds target'}

---

## Recommendations

${generateRecommendations(baseline)}

---

## Next Steps

1. Review recommendations above
2. Implement optimizations in priority order
3. Re-run audit to measure improvements
4. Track trends over time

---

*Report generated by Performance Audit Tool v1.0*
`;
}

/**
 * Generate recommendations based on baseline
 */
function generateRecommendations(baseline: PerformanceBaseline): string {
  const recommendations: string[] = [];

  if (baseline.cliStartup.average > 200) {
    recommendations.push('- **Startup Time:** Consider implementing lazy loading for non-critical modules');
    recommendations.push('- **Startup Time:** Add startup caching for frequently used data');
  }

  if (baseline.apiResponseTimes.search.p95 > 500) {
    recommendations.push('- **API Response:** Implement response caching (see Phase 2)');
    recommendations.push('- **API Response:** Add request batching for bulk operations (see Phase 3)');
  }

  if (baseline.memoryUsage.peak > 256) {
    recommendations.push('- **Memory:** Profile memory usage to identify leaks');
    recommendations.push('- **Memory:** Implement streaming for large exports (see Phase 4)');
  }

  if (baseline.bundleSize.total > 5120) {
    recommendations.push('- **Bundle:** Run bundle analyzer to identify large dependencies');
    recommendations.push('- **Bundle:** Implement tree shaking and code splitting (see Phase 6)');
  }

  if (recommendations.length === 0) {
    return 'All performance metrics are within target ranges. Continue monitoring.';
  }

  return recommendations.join('\n');
}

/**
 * Main audit function
 */
async function runPerformanceAudit(): Promise<void> {
  console.log('🚀 Starting Performance Audit & Baselines\n');
  console.log('=' .repeat(60));

  // Create output directory
  if (!existsSync(AUDIT_OUTPUT_DIR)) {
    mkdirSync(AUDIT_OUTPUT_DIR, { recursive: true });
  }

  const baseline: PerformanceBaseline = {
    timestamp: new Date().toISOString(),
    cliStartup: {
      cold: [],
      warm: [],
      average: 0,
      p95: 0,
    },
    apiResponseTimes: {
      search: { average: 0, p95: 0, samples: 0 },
      getWork: { average: 0, p95: 0, samples: 0 },
      getVersions: { average: 0, p95: 0, samples: 0 },
    },
    memoryUsage: {
      baseline: 0,
      peak: 0,
      afterGC: 0,
    },
    bundleSize: {
      total: 0,
      main: 0,
      dependencies: 0,
    },
    scorecards: {
      overall: 0,
      startup: 0,
      api: 0,
      memory: 0,
      bundle: 0,
    },
  };

  try {
    // 1. Measure CLI startup
    const startupData = await measureCLIStartup();
    baseline.cliStartup.cold = startupData.cold;
    baseline.cliStartup.warm = startupData.warm;
    baseline.cliStartup.average = average(startupData.cold);
    baseline.cliStartup.p95 = percentile(startupData.cold, 95);

    // 2. Measure API response times
    const apiData = await measureAPIResponseTimes();
    baseline.apiResponseTimes.search = {
      average: average(apiData.search),
      p95: percentile(apiData.search, 95),
      samples: apiData.search.length,
    };
    baseline.apiResponseTimes.getWork = {
      average: average(apiData.getWork),
      p95: percentile(apiData.getWork, 95),
      samples: apiData.getWork.length,
    };
    baseline.apiResponseTimes.getVersions = {
      average: average(apiData.getVersions),
      p95: percentile(apiData.getVersions, 95),
      samples: apiData.getVersions.length,
    };

    // 3. Measure memory usage
    baseline.memoryUsage = await measureMemoryUsage();

    // 4. Analyze bundle size
    baseline.bundleSize = analyzeBundleSize();

    // 5. Calculate scorecards
    baseline.scorecards = calculateScorecards(baseline);

    // 6. Generate report
    const report = generateMarkdownReport(baseline);
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const reportPath = join(AUDIT_OUTPUT_DIR, `performance-audit-${timestamp}.md`);
    writeFileSync(reportPath, report);

    console.log('\n' + '='.repeat(60));
    console.log('\n✅ Performance Audit Complete!\n');
    console.log(`📊 Overall Score: ${baseline.scorecards.overall}/100`);
    console.log(`📁 Report saved to: ${reportPath}\n`);

    // Also save JSON data for programmatic access
    const jsonPath = join(AUDIT_OUTPUT_DIR, `performance-baseline-${timestamp}.json`);
    writeFileSync(jsonPath, JSON.stringify(baseline, null, 2));
    console.log(`📄 Baseline data saved to: ${jsonPath}\n`);

  } catch (error) {
    console.error('\n❌ Performance Audit Failed:', (error as Error).message);
    console.error(error);
    process.exit(1);
  }
}

// Run the audit
runPerformanceAudit();
