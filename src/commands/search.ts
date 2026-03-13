/**
 * Search command - Search for legislation
 */

import { Command } from 'commander';
import ora from 'ora';

import { printTable, printJson, worksToCsv } from '@output';
import { logger } from '@utils/logger';
import { validateSearchParams, sanitizeInput } from '@utils/validation';

import { getGlobalRegistry } from '../providers/index.js';
import { toLegacySearchResults } from '../providers/output-adapters.js';

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
  .action(async (options: SearchOptions, command: Command) => {
    const globalOptions = command.parent ? command.parent.opts<{ jurisdiction?: string }>() : {};
    const jurisdiction = globalOptions.jurisdiction || 'nz';

    const spinner = ora(`Searching ${jurisdiction} legislation...`).start();

    try {
      // Get provider
      const registry = getGlobalRegistry();
      const provider = registry.get(jurisdiction);

      if (!provider) {
        spinner.stop();
        console.error(`❌ Error: Unknown jurisdiction "${jurisdiction}"`);
        process.exit(1);
      }

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
      if (!validation.valid) {
        spinner.stop();
        logger.error('Validation failed', undefined, { errors: validation.errors });
        console.error('❌ Validation errors:');
        validation.errors?.forEach(err => {
          console.error(`  - ${err.field}: ${err.message}`);
        });
        process.exit(3);
      }

      const validatedParams = validation.data;
      const normalizedStatus: 'in-force' | 'repealed' | 'not-in-force' | undefined =
        validatedParams.status === 'not-yet-in-force'
          ? 'not-in-force'
          : validatedParams.status === 'in-force' || validatedParams.status === 'repealed'
            ? validatedParams.status
            : undefined;

      // Map Command-style WorkType to SearchParams WorkType
      const searchParams = {
        query: validatedParams.query,
        type: validatedParams.type,
        status: normalizedStatus,
        from: validatedParams.from,
        to: validatedParams.to,
        limit: validatedParams.limit,
        offset: validatedParams.offset,
      };

      const results = await provider.search(searchParams);
      const legacyResults = toLegacySearchResults(results);

      spinner.stop();

      switch (validatedParams.format.toLowerCase()) {
        case 'json':
          printJson(results);
          break;
        case 'csv':
          console.log(worksToCsv(legacyResults));
          break;
        case 'table':
        default:
          printTable(legacyResults);
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
