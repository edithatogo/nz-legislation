#!/usr/bin/env node
/**
 * NZ Legislation CLI
 * Command-line interface for searching and retrieving NZ legislation data
 */

import chalk from 'chalk';
import { Command } from 'commander';

import { citeCommand } from './commands/cite.js';
import { configCommand } from './commands/config.js';
import { exportCommand } from './commands/export.js';
import { getCommand } from './commands/get.js';
import { searchCommand } from './commands/search.js';
import { getConfig } from './config.js';
import {
  ApplicationError,
  ErrorCode,
  getUserFriendlyMessage,
} from './errors.js';
import { logger } from './utils/logger.js';

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
    logger.warn('API key not configured.');
    logger.warn('Run "nzlegislation config" to set up your API key.\n');
  }

  // Apply global options
  if (thisCommand.opts().verbose) {
    logger.setVerbose(true);
    config.verbose = true;
  }
});

/**
 * Global error boundary - catches all unhandled errors
 */
function handleError(error: unknown): void {
  logger.clearOldLogs(7);

  if (error instanceof ApplicationError) {
    logger.error(getUserFriendlyMessage(error), error);
    displayErrorWithSuggestions(error);
    process.exit(getExitCode(error.code));
  }

  if (error instanceof Error) {
    logger.error('An unexpected error occurred', error);
    console.error(chalk.red('\n💥 Unexpected error:'), error.message);
    console.error(chalk.yellow('\nSuggestions:'));
    console.error(chalk.white('  1. Run with --verbose for more details'));
    console.error(chalk.white('  2. Check the log file:'), chalk.gray(logger.getLogFile()));
    console.error(chalk.white('  3. If the issue persists, report it on GitHub'));
    process.exit(1);
  }

  logger.error('An unknown error occurred');
  console.error(chalk.red('\n💥 An unknown error occurred'));
  process.exit(1);
}

/**
 * Display error with actionable suggestions based on error type
 */
function displayErrorWithSuggestions(error: ApplicationError): void {
  console.error(chalk.red(`\n❌ ${error.message}\n`));

  console.error(chalk.yellow('Suggestions:'));

  switch (error.code) {
    case ErrorCode.CONFIG_API_KEY_MISSING:
    case ErrorCode.CONFIG_NOT_FOUND:
      console.error(chalk.white('  1. Run ') + chalk.cyan('nzlegislation config') + chalk.white(' to set up your API key'));
      console.error(chalk.white('  2. Or set environment variable ') + chalk.cyan('NZ_LEGISLATION_API_KEY'));
      console.error(chalk.white('  3. Get your API key from https://api.legislation.govt.nz'));
      break;

    case ErrorCode.API_AUTHENTICATION_FAILED:
      console.error(chalk.white('  1. Check your API key is correct'));
      console.error(chalk.white('  2. Run ') + chalk.cyan('nzlegislation config --show') + chalk.white(' to verify'));
      console.error(chalk.white('  3. Contact API support if the issue persists'));
      break;

    case ErrorCode.API_NOT_FOUND:
      console.error(chalk.white('  1. Check the work ID is correct'));
      console.error(chalk.white('  2. Use ') + chalk.cyan('nzlegislation search') + chalk.white(' to find the correct ID'));
      console.error(chalk.white('  3. Verify the legislation exists on the NZ Legislation website'));
      break;

    case ErrorCode.API_RATE_LIMIT_EXCEEDED:
      console.error(chalk.white('  1. Wait a few minutes before trying again'));
      console.error(chalk.white('  2. Reduce the frequency of your requests'));
      console.error(chalk.white('  3. Consider using the --limit flag to batch requests'));
      break;

    case ErrorCode.API_TIMEOUT:
    case ErrorCode.NETWORK_OFFLINE:
    case ErrorCode.NETWORK_CONNECTION_REFUSED:
      console.error(chalk.white('  1. Check your internet connection'));
      console.error(chalk.white('  2. Verify the API is accessible at ') + chalk.cyan('https://api.legislation.govt.nz'));
      console.error(chalk.white('  3. Try again in a few moments'));
      break;

    case ErrorCode.FILE_WRITE_FAILED:
    case ErrorCode.FILE_NOT_FOUND:
      console.error(chalk.white('  1. Check the file path is correct'));
      console.error(chalk.white('  2. Verify you have write permissions'));
      console.error(chalk.white('  3. Ensure the output directory exists'));
      break;

    case ErrorCode.VALIDATION_FAILED:
    case ErrorCode.VALIDATION_INVALID_ID:
      console.error(chalk.white('  1. Check the format of your input'));
      console.error(chalk.white('  2. Use ') + chalk.cyan('--help') + chalk.white(' to see valid options'));
      console.error(chalk.white('  3. Example: ') + chalk.cyan('nzlegislation get "act/2020/67"'));
      break;

    default:
      console.error(chalk.white('  1. Run with ') + chalk.cyan('--verbose') + chalk.white(' for more details'));
      console.error(chalk.white('  2. Check the log file: ') + chalk.gray(logger.getLogFile()));
      console.error(chalk.white('  3. Report the issue on GitHub with the error details'));
      break;
  }

  console.error(chalk.gray(`\nError Code: ${ErrorCode[error.code]} (${error.code})`));
  console.error(chalk.gray(`Log File: ${logger.getLogFile()}`));
}

/**
 * Get exit code based on error type
 */
function getExitCode(code: ErrorCode): number {
  if (code >= ErrorCode.API_AUTHENTICATION_FAILED && code < ErrorCode.CONFIG_NOT_FOUND) {
    return 1; // API errors (1000-1999)
  }
  if (code >= ErrorCode.CONFIG_NOT_FOUND && code < ErrorCode.VALIDATION_FAILED) {
    return 2; // Config errors (2000-2999)
  }
  if (code >= ErrorCode.VALIDATION_FAILED && code < ErrorCode.FILE_NOT_FOUND) {
    return 3; // Validation errors (3000-3999)
  }
  if (code >= ErrorCode.FILE_NOT_FOUND && code < ErrorCode.NETWORK_OFFLINE) {
    return 4; // File system errors (4000-4999)
  }
  if (code >= ErrorCode.NETWORK_OFFLINE && code < ErrorCode.UNKNOWN) {
    return 5; // Network errors (5000-5999)
  }
  return 1; // Default
}

// Set up global error handler
process.on('uncaughtException', handleError);
process.on('unhandledRejection', (reason) => {
  handleError(reason instanceof Error ? reason : new Error(String(reason)));
});

// Parse command line arguments
program.parse();

// Show help if no command provided
if (!process.argv.slice(2).length) {
  program.outputHelp();
  process.exit(0);
}
