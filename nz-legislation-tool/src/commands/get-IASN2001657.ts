/**
 * Get command - Retrieve legislation by ID
 */

import { Command } from 'commander';
import ora from 'ora';
import { getWork } from '../client.js';
import { printWorkDetail, printJson } from '../output/index.js';

export const getCommand = new Command()
  .name('get')
  .description('Get legislation by ID')
  .argument('<id>', 'Work ID (e.g., act/2020/67)')
  .option('--format <format>', 'Output format (table, json)', 'table')
  .action(async (workId, options) => {
    const spinner = ora('Retrieving legislation...').start();

    try {
      // Get work details
      const work = await getWork(workId);
      spinner.stop();

      switch (options.format.toLowerCase()) {
        case 'json':
          printJson(work);
          break;
        case 'table':
        default:
          printWorkDetail(work);
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
