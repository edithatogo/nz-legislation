#!/usr/bin/env node
/**
 * Performance Gate Checker
 * 
 * Checks performance metrics against thresholds for CI/CD.
 * Exits with code 1 if any critical gates fail.
 * 
 * Usage: node scripts/check-performance-gates.js
 */

import { readFileSync } from 'fs';
import { glob } from 'glob';

// Get threshold from environment or use default
const PERFORMANCE_THRESHOLD = parseInt(process.env.PERFORMANCE_THRESHOLD || '60', 10);

console.log('🔍 Checking performance gates...\n');
console.log(`Threshold: ${PERFORMANCE_THRESHOLD}/100\n`);

try {
  // Find latest baseline file
  const baselineFiles = glob.sync('performance-audit-results/performance-baseline-*.json');
  
  if (baselineFiles.length === 0) {
    console.log('⚠️  No baseline files found. Skipping performance gate check.');
    console.log('   Run "npm run bench:audit" to create a baseline.\n');
    process.exit(0);
  }

  const latest = baselineFiles.sort().pop();
  const baseline = JSON.parse(readFileSync(latest, 'utf-8'));

  console.log(`Using baseline: ${latest}\n`);

  // Check gates
  const gates = {
    overall: { 
      threshold: PERFORMANCE_THRESHOLD, 
      value: baseline.scorecards?.overall || 0,
      name: 'Overall Score'
    },
    api: { 
      threshold: Math.max(50, PERFORMANCE_THRESHOLD - 10), 
      value: baseline.scorecards?.api || 0,
      name: 'API Response Score'
    },
    memory: { 
      threshold: Math.max(50, PERFORMANCE_THRESHOLD - 10), 
      value: baseline.scorecards?.memory || 0,
      name: 'Memory Score'
    },
    startup: {
      threshold: Math.max(40, PERFORMANCE_THRESHOLD - 20),
      value: baseline.scorecards?.startup || 0,
      name: 'Startup Score'
    },
  };

  let failed = false;
  let warnings = 0;

  console.log('Gate Results:');
  console.log('─'.repeat(60));

  for (const [, gate] of Object.entries(gates)) {
    const status = gate.value >= gate.threshold ? '✅ PASS' : '❌ FAIL';
    const isWarning = gate.value < gate.threshold + 10 && gate.value >= gate.threshold;
    
    console.log(`${status} ${gate.name}: ${gate.value}/100 (threshold: ${gate.threshold})`);
    
    if (!(gate.value >= gate.threshold)) {
      failed = true;
    } else if (isWarning) {
      warnings++;
    }
  }

  console.log('─'.repeat(60));

  // Check for critical failures
  if (failed) {
    console.log('\n❌ CRITICAL: Performance gates failed!\n');
    console.log('Recommendations:');
    console.log('1. Review performance audit report for details');
    console.log('2. Check for recent code changes that may impact performance');
    console.log('3. Run "npm run bench:audit" locally to diagnose issues');
    console.log('4. Consider optimizing identified bottlenecks\n');
    process.exit(1);
  }

  // Check for warnings
  if (warnings > 0) {
    console.log(`\n⚠️  WARNING: ${warnings} score(s) close to threshold\n`);
    console.log('Consider reviewing and optimizing before merging.');
  } else {
    console.log('\n✅ All performance gates passed!\n');
  }

  // Print summary
  console.log('Performance Summary:');
  console.log(`  Overall Score: ${baseline.scorecards?.overall || 0}/100`);
  console.log(`  API Response: ${baseline.scorecards?.api || 0}/100`);
  console.log(`  Memory: ${baseline.scorecards?.memory || 0}/100`);
  console.log(`  Startup: ${baseline.scorecards?.startup || 0}/100`);
  console.log(`  Bundle: ${baseline.scorecards?.bundle || 0}/100\n`);

  process.exit(0);
} catch (error) {
  console.error('❌ Performance gate check failed.');
  console.error('\nThis is typically caused by:');
  console.error('1. Missing baseline file (run "npm run bench:audit")');
  console.error('2. Invalid baseline JSON format');
  console.error('3. File system permissions\n');
  process.exit(1);
}
