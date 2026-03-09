/**
 * Performance benchmarks for NZ Legislation CLI
 * Run with: npm run bench
 */

import Benchmark from 'benchmark';
import { searchWorks, getWork, getWorkVersions } from '../src/client.js';
import { generateCitation } from '../src/output/index.js';

const suite = new Benchmark.Suite();

// Test data
const TEST_WORK_ID = 'act/1986/132'; // Companies Act 1986
const TEST_QUERY = 'companies';

console.log('Starting NZ Legislation CLI Benchmarks...\n');

// Add benchmarks
suite
  // Startup benchmark
  .add('CLI Startup', {
    defer: true,
    fn: async (deferred: { resolve: () => void }) => {
      // Measure module load time
      await import('../src/client.js');
      deferred.resolve();
    },
  })
  
  // Search benchmark
  .add('Search (10 results)', {
    defer: true,
    fn: async (deferred: { resolve: () => void }) => {
      try {
        await searchWorks({ query: TEST_QUERY, limit: 10 });
        deferred.resolve();
      } catch {
        deferred.resolve();
      }
    },
  })
  
  // Get work benchmark
  .add('Get Work by ID', {
    defer: true,
    fn: async (deferred: { resolve: () => void }) => {
      try {
        await getWork(TEST_WORK_ID);
        deferred.resolve();
      } catch {
        deferred.resolve();
      }
    },
  })
  
  // Get versions benchmark
  .add('Get Work Versions', {
    defer: true,
    fn: async (deferred: { resolve: () => void }) => {
      try {
        await getWorkVersions(TEST_WORK_ID);
        deferred.resolve();
      } catch {
        deferred.resolve();
      }
    },
  })
  
  // Citation generation benchmark
  .add('Generate Citation (NZMJ)', {
    defer: true,
    fn: async (deferred: { resolve: () => void }) => {
      try {
        const work = await getWork(TEST_WORK_ID);
        generateCitation(work, 'nzmj');
        deferred.resolve();
      } catch {
        deferred.resolve();
      }
    },
  })
  
  // Callback when complete
  .on('cycle', (event: Event & { target: Benchmark }) => {
    const bench = event.target;
    if (!bench.error) {
      console.log(`${String(bench)} - ${bench.hz.toFixed(2)} ops/sec`);
    }
  })
  .on('complete', () => {
    console.log('\nBenchmark complete!');
    console.log('Note: API calls may vary based on network conditions and rate limits.');
  })
  .on('error', (event: Event & { target: Benchmark }) => {
    console.error('Benchmark error:', event.target.error);
  })
  .run({ async: true });
