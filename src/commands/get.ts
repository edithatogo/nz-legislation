/**
 * Get command - Retrieve legislation by ID
 */

import { Command } from 'commander';
import ora from 'ora';

import { getWork, getWorkVersions } from '@client';
import { printWorkDetail, printVersionsTable, printJson, versionsToCsv } from '@output';
import { logger } from '@utils/logger';
import { validateWorkId, sanitizeInput } from '@utils/validation';

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
  .action(async (workId: string, options: GetOptions) => {
    const spinner = ora('Retrieving legislation...').start();

    try {
      // Sanitize and validate work ID
      const sanitizedWorkId = sanitizeInput(workId);
      const validation = validateWorkId(sanitizedWorkId);

      if (!validation.valid) {
        spinner.stop();
        logger.error('Work ID validation failed', undefined, { workId, errors: validation.errors });
        console.error('❌ Invalid work ID format:');
        validation.errors?.forEach(err => {
          console.error(`  - ${err.message}`);
        });
        console.error('\nExpected format: API work ID (e.g., act_public_1989_18)');
        process.exit(3);
      }

      logger.debug('Work ID validated', { workId: sanitizedWorkId });

      if (options.versions) {
        // Get version history
        const versions = await getWorkVersions(sanitizedWorkId);
        spinner.stop();

        switch (options.format.toLowerCase()) {
          case 'json':
            printJson(versions);
            break;
          case 'csv':
            console.log(versionsToCsv(versions));
            break;
          case 'table':
          default:
            printVersionsTable(versions);
            break;
        }
      } else {
        // Get work details
        const work = await getWork(sanitizedWorkId);
        spinner.stop();

        switch (options.format.toLowerCase()) {
          case 'json':
            printJson(work);
            break;
          case 'csv':
            console.log('Note: CSV format not ideal for single work. Use table or json.');
            printWorkDetail(work);
            break;
          case 'table':
          default:
            printWorkDetail(work);
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
