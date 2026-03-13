/**
 * Batch Command - Execute bulk operations
 */

import { readFileSync } from 'fs';

import { Command } from 'commander';
import ora from 'ora';

import {
  BatchExecutor,
  type BatchProgress,
  BatchRequest,
  createBatchFromFile,
  createBatchFromIds,
  formatBatchResults,
  saveBatchResults,
} from '@utils/batch';

interface BatchOptions {
  file?: string;
  ids?: string;
  type: 'search' | 'getWork' | 'getVersions' | 'getVersion';
  output?: string;
  format: 'json' | 'csv';
  concurrency: string;
  retry: boolean;
  idColumn?: string;
}

export const batchCommand = new Command()
  .name('batch')
  .description('Execute bulk operations with batching')
  .option('-f, --file <path>', 'Input file with IDs (CSV or JSON)')
  .option('-i, --ids <ids>', 'Comma-separated list of IDs')
  .requiredOption('-t, --type <type>', 'Operation type (search, getWork, getVersions, getVersion)')
  .option('-o, --output <path>', 'Output file path')
  .option('-F, --format <format>', 'Output format (json, csv)', 'json')
  .option('-c, --concurrency <number>', 'Concurrent requests', '5')
  .option('-r, --retry', 'Retry failed requests', false)
  .option('--id-column <column>', 'Column name for ID in CSV (default: "id")')
  .action(async (options: BatchOptions) => {
    if (!options.file && !options.ids) {
      console.error('Error: Either --file or --ids is required');
      process.exit(1);
    }

    const spinner = ora('Preparing batch...').start();

    try {
      let requests: BatchRequest[] = [];

      // Load requests from file or IDs
      if (options.file) {
        spinner.text = 'Loading input file...';
        const content = readFileSync(options.file, 'utf-8');

        if (options.file.endsWith('.json')) {
          const data: unknown = JSON.parse(content);
          if (Array.isArray(data)) {
            requests = createBatchFromFile(
              data as Array<Record<string, string>>,
              options.type,
              options.idColumn || 'id'
            );
          } else {
            throw new Error('JSON file must contain an array of objects');
          }
        } else if (options.file.endsWith('.csv')) {
          // Simple CSV parsing (for production, use a proper CSV parser)
          const lines = content.trim().split('\n');
          const headers = lines[0].split(',');
          const idColumnIndex = options.idColumn
            ? headers.indexOf(options.idColumn)
            : headers.indexOf('id');

          if (idColumnIndex === -1) {
            throw new Error(`ID column "${options.idColumn || 'id'}" not found in CSV`);
          }

          const rows = lines.slice(1).map(line => {
            const values = line.split(',');
            return { [headers[idColumnIndex]]: values[idColumnIndex] };
          });

          requests = createBatchFromFile(rows, options.type, options.idColumn || 'id');
        } else {
          throw new Error('Unsupported file format. Use CSV or JSON.');
        }
      } else if (options.ids) {
        const ids = options.ids
          .split(',')
          .map(id => id.trim())
          .filter(id => id);
        requests = createBatchFromIds(ids, options.type);
      }

      if (requests.length === 0) {
        spinner.fail('No requests to process');
        process.exit(1);
      }

      spinner.succeed(`Prepared ${requests.length} requests`);

      // Create batch executor
      const executor = new BatchExecutor({
        concurrency: parseInt(options.concurrency, 10),
        retryFailed: options.retry,
        maxRetries: 3,
      });

      // Track progress
      let lastProgress = 0;
      executor.on('progress', (progress: BatchProgress) => {
        if (progress.percent - lastProgress >= 10) {
          console.log(`  Progress: ${progress.percent}% (${progress.completed}/${progress.total})`);
          lastProgress = progress.percent;
        }
      });

      // Execute batch
      console.log('\nExecuting batch operations...');
      const results = await executor.execute(requests);

      // Format results
      const { successful, failed, cached, summary } = formatBatchResults(results);

      // Print summary
      console.log('\nBatch Execution Summary:');
      console.log('─'.repeat(50));
      console.log(`  Total:        ${summary.total}`);
      console.log(`  Successful:   ${successful.length} (${summary.successRate}%)`);
      console.log(`  Failed:       ${failed.length}`);
      console.log(`  From Cache:   ${cached.length} (${summary.cacheHitRate}%)`);
      console.log(`  Avg Duration: ${summary.averageDuration}ms`);
      console.log(`  Total Time:   ${summary.totalDuration}ms`);

      // Save results if output specified
      if (options.output) {
        saveBatchResults(results, options.output, options.format);
        console.log(`\n✓ Results saved to: ${options.output}`);
      }

      // Exit with error if any failed
      if (failed.length > 0) {
        console.log(`\n⚠ ${failed.length} request(s) failed`);
        if (failed.length <= 10) {
          console.log('\nFailed requests:');
          failed.forEach(r => {
            console.log(`  - ${r.id}: ${r.error?.message}`);
          });
        }
      }
    } catch (error) {
      spinner.fail('Batch operation failed');
      console.error('Error:', error instanceof Error ? error.message : error);
      process.exit(1);
    }
  });
