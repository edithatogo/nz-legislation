/**
 * Search command - Search for legislation
 */

import { Command } from 'commander';
import ora from 'ora';

import { searchWorks } from '@client';
import { printTable, printJson, worksToCsv } from '@output';
import { logger } from '@utils/logger';
import { validateSearchParams, sanitizeInput } from '@utils/validation';

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
      // Sanitize inputs
      const sanitizedOptions = {
        ...options,
        query: sanitizeInput(options.query),
        type: options.type ? sanitizeInput(options.type) : undefined,
        status: options.status ? sanitizeInput(options.status) : undefined,
        from: options.from ? sanitizeInput(options.from) : undefined,
        to: options.to ? sanitizeInput(options.to) : undefined,
      };

      // Validate parameters
      const validation = validateSearchParams(sanitizedOptions);
      if (!validation.valid || !validation.data) {
        spinner.stop();
        logger.error('Validation failed', undefined, { errors: validation.errors });
        console.error('❌ Validation errors:');
        validation.errors?.forEach((err) => {
          console.error(`  - ${err.field}: ${err.message}`);
        });
        process.exit(3);
      }

      const validatedParams = validation.data;
      logger.debug('Search parameters validated', { 
        query: validatedParams?.query,
        type: validatedParams?.type,
        limit: validatedParams?.limit,
      });

      const results = await searchWorks({
        query: validatedParams.query,
        type: validatedParams.type,
        status: validatedParams.status,
        from: validatedParams.from,
        to: validatedParams.to,
        limit: validatedParams.limit,
        offset: validatedParams.offset,
      });

      spinner.stop();

      switch (validatedParams.format.toLowerCase()) {
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
      logger.error('Search failed', error instanceof Error ? error : undefined, { options });
      if (error instanceof Error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });
