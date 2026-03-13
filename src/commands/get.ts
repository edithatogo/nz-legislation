/**
 * Get command - Retrieve legislation by ID
 */

import { Command } from 'commander';
import ora from 'ora';

import { printWorkDetail, printVersionsTable, printJson, versionsToCsv } from '@output';
import { logger } from '@utils/logger';
import { validateWorkId, sanitizeInput } from '@utils/validation';

import { getGlobalRegistry } from '../providers/index.js';
import { toLegacyVersions, toLegacyWork } from '../providers/output-adapters.js';

interface GetOptions {
  versions?: boolean;
  format: string;
}

export const getCommand = new Command()
  .name('get')
  .description('Get legislation by ID')
  .argument('<id>', 'Work ID (e.g., act_public_1989_18)')
  .option('--versions', 'Show version history')
  .option('--format <format>', 'Output format (table, json, csv)', 'table')
  .action(async (workId: string, options: GetOptions, command: Command) => {
    const globalOptions = command.parent ? command.parent.opts<{ jurisdiction?: string }>() : {};
    const jurisdiction = globalOptions.jurisdiction || 'nz';

    const spinner = ora(`Retrieving ${jurisdiction} legislation...`).start();

    try {
      // Get provider
      const registry = getGlobalRegistry();
      const provider = registry.get(jurisdiction);

      if (!provider) {
        spinner.stop();
        console.error(`❌ Error: Unknown jurisdiction "${jurisdiction}"`);
        process.exit(1);
      }

      // Sanitize and validate work ID
      const sanitizedWorkId = sanitizeInput(workId);

      // NZ-specific ID validation only if jurisdiction is nz
      if (jurisdiction === 'nz') {
        const validation = validateWorkId(sanitizedWorkId);

        if (!validation.valid) {
          spinner.stop();
          logger.error('Work ID validation failed', undefined, {
            workId,
            errors: validation.errors,
          });
          console.error('❌ Invalid work ID format:');
          validation.errors?.forEach(err => {
            console.error(`  - ${err.message}`);
          });
          console.error('\nExpected format: API work ID (e.g., act_public_1989_18)');
          process.exit(3);
        }
      }

      if (options.versions) {
        // Get version history
        const versions = await provider.getVersions(sanitizedWorkId);
        const work = await provider.getWork(sanitizedWorkId);
        const legacyVersions = toLegacyVersions(versions, work.type);
        spinner.stop();

        switch (options.format.toLowerCase()) {
          case 'json':
            printJson(versions);
            break;
          case 'csv':
            console.log(versionsToCsv(legacyVersions));
            break;
          case 'table':
          default:
            printVersionsTable(legacyVersions);
            break;
        }
      } else {
        // Get work details
        const work = await provider.getWork(sanitizedWorkId);
        const legacyWork = toLegacyWork(work);
        spinner.stop();

        switch (options.format.toLowerCase()) {
          case 'json':
            printJson(work);
            break;
          case 'csv':
            console.log('Note: CSV format not ideal for single work. Use table or json.');
            printWorkDetail(legacyWork);
            break;
          case 'table':
          default:
            printWorkDetail(legacyWork);
            break;
        }
      }
    } catch (error) {
      spinner.stop();
      logger.error('Failed to retrieve legislation', error instanceof Error ? error : undefined, {
        workId,
      });
      if (error instanceof Error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });
