/**
 * Search command - Search for legislation
 */

import { Command } from 'commander';
import ora from 'ora';

import { searchWorks } from '@client';
import { printTable, printJson, worksToCsv } from '@output';

interface SearchOptions {
  query: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit: string;
  offset: string;
  format: string;
}

export const searchCommand = new Command()
  .name('search')
  .description('Search for legislation')
  .requiredOption('-q, --query <text>', 'Search query')
  .option('-t, --type <type>', 'Filter by type (act, bill, regulation, instrument)')
  .option('-s, --status <status>', 'Filter by status (in-force, repealed, etc.)')
  .option('--from <date>', 'Filter from date (YYYY-MM-DD)')
  .option('--to <date>', 'Filter to date (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Maximum results (default: 25, max: 100)', '25')
  .option('-o, --offset <number>', 'Result offset for pagination', '0')
  .option('--format <format>', 'Output format (table, json, csv)', 'table')
  .action(async (options: SearchOptions) => {
    const spinner = ora('Searching legislation...').start();

    try {
      const limit = Math.min(parseInt(options.limit, 10), 100);
      const offset = parseInt(options.offset, 10);

      const results = await searchWorks({
        query: options.query,
        type: options.type,
        status: options.status,
        from: options.from,
        to: options.to,
        limit,
        offset,
      });

      spinner.stop();

      switch (options.format.toLowerCase()) {
        case 'json':
          printJson(results);
          break;
        case 'csv':
          console.log(worksToCsv(results));
          break;
        case 'table':
        default:
          printTable(results);
          break;
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
