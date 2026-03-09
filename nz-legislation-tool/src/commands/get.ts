/**
 * Get command - Retrieve legislation by ID
 */

import { Command } from 'commander';
import ora from 'ora';
import { getWork, getWorkVersions } from '../client.js';
import { printWorkDetail, printVersionsTable, printJson, versionsToCsv } from '../output/index.js';

export const getCommand = new Command()
  .name('get')
  .description('Get legislation by ID')
  .argument('<id>', 'Work ID (e.g., act/2020/67)')
  .option('--versions', 'Show version history')
  .option('--format <format>', 'Output format (table, json, csv)', 'table')
  .action(async (workId, options) => {
    const spinner = ora('Retrieving legislation...').start();

    try {
      if (options.versions) {
        // Get version history
        const versions = await getWorkVersions(workId);
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
        const work = await getWork(workId);
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
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });
