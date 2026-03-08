#!/usr/bin/env node
/**
 * NZ Legislation CLI
 * Command-line interface for searching and retrieving NZ legislation data
 */

import { Command } from 'commander';
import chalk from 'chalk';
import { searchCommand } from './commands/search.js';
import { getCommand } from './commands/get.js';
import { exportCommand } from './commands/export.js';
import { citeCommand } from './commands/cite.js';
import { configCommand } from './commands/config.js';
import { getConfig } from './config.js';
import { logger, setLoggerVerbose } from './utils/logger.js';
import { checkForUpdates, getVersionString } from './utils/version.js';

// Get package version from package.json
const pkg = await import('../package.json', { with: { type: 'json' } });

// Create main CLI program
const program = new Command();

program
  .name('nzlegislation')
  .description('Search and retrieve New Zealand legislation data')
  .version(getVersionString())
  .configureHelp({
    sortOptions: true,
    sortSubcommands: true,
  })
  .addHelpText(
    'after',
    `
Examples:
  $ nzlegislation search --query "health" --type act
  $ nzlegislation get "act_public_1989_18"
  $ nzlegislation export --query "health" --output health.csv
  $ nzlegislation cite "act_public_1989_18" --style nzmj
  $ nzlegislation config --show

Documentation: https://github.com/dylanmordaunt/nz-legislation-tool
API Documentation: https://api.legislation.govt.nz/docs/`
  );

// Add global options
program
  .option('--verbose', 'Enable verbose output')
  .option('--quiet', 'Suppress non-essential output');

// Add commands
program
  .addCommand(searchCommand)
  .addCommand(getCommand)
  .addCommand(exportCommand)
  .addCommand(citeCommand)
  .addCommand(configCommand);

// Pre-command hook
program.hook('preAction', (thisCommand, actionCommand) => {
  // Apply verbose mode
  if (thisCommand.opts().verbose) {
    setLoggerVerbose(true);
    const config = getConfig();
    config.verbose = true;
  }

  // Skip config check for config command itself
  if (actionCommand.name() === 'config') {
    return;
  }

  // Check API key configuration
  const config = getConfig();
  if (!config.apiKey || config.apiKey === 'your_api_key_here') {
    logger.warn('API key not configured.');
    logger.info('Run "nzlegislation config" to set up your API key.\n');
  }

  // Check for updates (non-blocking)
  if (actionCommand.name() === 'search') {
    checkForUpdates().catch(() => {});
  }
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}
