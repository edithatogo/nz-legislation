/**
 * Export command - Export search results to file
 */

import { writeFileSync } from 'fs';

import { Command } from 'commander';
import ora from 'ora';

import { worksToCsv } from '../output/index.js';
import { searchLegislation } from '../providers/index.js';

interface ExportOptions {
  jurisdiction: string;
  query: string;
  output: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit: string;
  format: string;
  includeMetadata: boolean;
}

export const exportCommand = new Command()
  .name('export')
  .description('Export search results to file')
  .option('-j, --jurisdiction <jurisdiction>', 'Jurisdiction (nz, au-comm, au-qld)', 'nz')
  .requiredOption('-q, --query <text>', 'Search query')
  .requiredOption('-o, --output <file>', 'Output file path')
  .option('-t, --type <type>', 'Filter by type (act, bill, regulation, instrument)')
  .option('-s, --status <status>', 'Filter by status')
  .option('--from <date>', 'Filter from date (YYYY-MM-DD)')
  .option('--to <date>', 'Filter to date (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Maximum results (default: 100)', '100')
  .option('-f, --format <format>', 'Output format (csv, json)', 'csv')
  .option('--include-metadata', 'Include export metadata', false)
  .action(async (options: ExportOptions) => {
    const spinner = ora('Searching and exporting...').start();

    try {
      const limit = Math.min(parseInt(options.limit, 10), 1000);

      const results = await searchLegislation({
        jurisdiction: options.jurisdiction as 'nz' | 'au-comm' | 'au-qld',
        query: options.query,
        type: options.type,
        status: options.status,
        from: options.from,
        to: options.to,
        limit,
      });

      spinner.stop();

      let output: string;
      const timestamp = new Date().toISOString();

      if (options.format.toLowerCase() === 'json') {
        // JSON export
        const exportData = options.includeMetadata
          ? {
              metadata: {
                query: options.query,
                filters: {
                  type: options.type,
                  status: options.status,
                  from: options.from,
                  to: options.to,
                },
                timestamp,
                totalResults: results.total,
                exportedCount: results.results.length,
              },
              results: results.results,
            }
          : results;
        output = JSON.stringify(exportData, null, 2);
      } else {
        // CSV export (default)
        let csvContent = worksToCsv(results);

        if (options.includeMetadata) {
          // Add metadata as comments at the end
          csvContent += `\n# Export Metadata`;
          csvContent += `\n# Query: ${options.query}`;
          csvContent += `\n# Timestamp: ${timestamp}`;
          csvContent += `\n# Total Results: ${results.total}`;
          csvContent += `\n# Exported: ${results.results.length}`;
          if (options.type) {
            csvContent += `\n# Type: ${options.type}`;
          }
          if (options.status) {
            csvContent += `\n# Status: ${options.status}`;
          }
        }

        output = csvContent;
      }

      // Write to file
      writeFileSync(options.output, output, 'utf-8');

      console.log(`✓ Exported ${results.results.length} results to ${options.output}`);
      console.log(`  Total available: ${results.total}`);

      if (options.includeMetadata) {
        console.log(`  Metadata: included`);
      }
    } catch (error) {
      spinner.stop();
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });
