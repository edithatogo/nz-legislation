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

// Get package version from package.json
const pkg = await import('../package.json', { with: { type: 'json' } });

// Create main CLI program
const program = new Command();

program
  .name('nzlegislation')
  .description('Search and retrieve New Zealand legislation data')
  .version(pkg.default.version)
  .configureHelp({
    sortOptions: true,
    sortSubcommands: true,
  })
  .addHelpText(
    'after',
    `
Examples:
  $ nzlegislation search --query "health" --type act
  $ nzlegislation get "act/2020/67"
  $ nzlegislation get "act/2020/67" --versions
  $ nzlegislation export --query "health" --output health.csv
  $ nzlegislation cite "act/2020/67" --style nzmj
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

// Pre-command hook to check configuration
program.hook('preAction', (thisCommand, actionCommand) => {
  // Skip config check for config command itself
  if (actionCommand.name() === 'config') {
    return;
  }

  const config = getConfig();

  if (!config.apiKey || config.apiKey === 'your_api_key_here') {
    console.log(chalk.yellow('Warning: API key not configured.'));
    console.log(chalk.yellow('Run "nzlegislation config" to set up your API key.\n'));
  }

  // Apply global options
  if (thisCommand.opts().verbose) {
    config.verbose = true;
  }
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}
