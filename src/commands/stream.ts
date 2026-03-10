/**
 * Stream Command - Stream large exports with minimal memory usage
 */

import { Command } from 'commander';
import ora from 'ora';

import { StreamExporter, type StreamExportOptions } from '@utils/streaming';

interface StreamOptions {
  query: string;
  output: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: string;
  format: string;
  batchSize: string;
  concurrency: string;
  noMetadata?: boolean;
}

export const streamCommand = new Command()
  .name('stream')
  .description('Stream large exports with minimal memory usage')
  .requiredOption('-q, --query <text>', 'Search query')
  .requiredOption('-o, --output <file>', 'Output file path')
  .option('-t, --type <type>', 'Filter by type (act, bill, regulation, instrument)')
  .option('-s, --status <status>', 'Filter by status')
  .option('--from <date>', 'Filter from date (YYYY-MM-DD)')
  .option('--to <date>', 'Filter to date (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Maximum results (default: unlimited)')
  .option('-f, --format <format>', 'Output format (csv, json, ndjson)', 'csv')
  .option('-b, --batch-size <number>', 'Results per batch', '100')
  .option('-c, --concurrency <number>', 'API concurrency', '3')
  .option('--no-metadata', 'Exclude metadata from output')
  .action(async (options: StreamOptions) => {
    const spinner = ora('Starting stream export...').start();
    
    try {
      // Validate format
      if (!['csv', 'json', 'ndjson'].includes(options.format)) {
        throw new Error('Format must be csv, json, or ndjson');
      }

      // Parse options
      const exportOptions: StreamExportOptions = {
        query: options.query,
        outputPath: options.output,
        format: options.format as 'csv' | 'json' | 'ndjson',
        includeMetadata: !options.noMetadata,
        batchSize: parseInt(options.batchSize, 10),
        maxResults: options.limit ? parseInt(options.limit, 10) : undefined,
        concurrency: parseInt(options.concurrency, 10),
      };

      // Create exporter
      const exporter = new StreamExporter(exportOptions);

      // Prepare search parameters
      const searchParams = {
        query: options.query,
        type: options.type,
        status: options.status,
        from: options.from,
        to: options.to,
      };

      spinner.succeed('Starting stream export');
      console.log('\nExport Configuration:');
      console.log('─'.repeat(50));
      console.log(`  Query:      ${options.query}`);
      console.log(`  Output:     ${options.output}`);
      console.log(`  Format:     ${options.format.toUpperCase()}`);
      console.log(`  Batch Size: ${exportOptions.batchSize}`);
      console.log(`  Concurrency: ${exportOptions.concurrency}`);
      console.log(`  Max Results: ${exportOptions.maxResults || 'unlimited'}`);
      console.log(`  Metadata:   ${exportOptions.includeMetadata ? 'Included' : 'Excluded'}`);
      console.log('\nStreaming... (Press Ctrl+C to cancel)\n');

      // Track progress
      let lastPercent = 0;
      const startTime = Date.now();

      const result = await exporter.export(searchParams, (progress) => {
        // Only show progress every 10%
        if (progress.percent - lastPercent >= 10) {
          const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
          const eta = progress.estimatedTimeRemaining 
            ? `${(progress.estimatedTimeRemaining / 1000).toFixed(0)}s` 
            : 'Calculating...';
          
          console.log(`  ${progress.percent}% | ${progress.processed} items | ${elapsed}s elapsed | ETA: ${eta}`);
          lastPercent = progress.percent;
        }
      });

      const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);

      spinner.succeed('Stream export complete');
      console.log('\nExport Summary:');
      console.log('─'.repeat(50));
      console.log(`  Items Exported: ${result.processed}`);
      console.log(`  File Size:      ${(result.bytesWritten / 1024).toFixed(2)} KB`);
      console.log(`  Total Time:     ${totalTime}s`);
      console.log(`  Output File:    ${options.output}`);
      console.log(`  Format:         ${options.format.toUpperCase()}`);

      // Performance stats
      const itemsPerSecond = (result.processed / (Date.now() - startTime) * 1000).toFixed(2);
      console.log(`  Throughput:     ${itemsPerSecond} items/sec`);

      // Memory usage
      const memoryUsage = process.memoryUsage();
      console.log(`  Memory Used:    ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB`);

    } catch (error) {
      spinner.fail('Stream export failed');
      console.error('\nError: Stream export failed.');
      
      if (error instanceof Error && error.message.includes('EACCES')) {
        console.log('\nHint: Check file permissions and ensure the output directory exists.');
      } else if (error instanceof Error && error.message.includes('ENOSPC')) {
        console.log('\nHint: Disk space is full. Free up space and try again.');
      }
      
      process.exit(1);
    }
  });
