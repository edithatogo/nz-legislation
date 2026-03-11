/**
 * Version management and update checking
 */

import chalk from 'chalk';

import pkg from '../../package.json' assert { type: 'json' };

import { logger } from './logger.js';

interface NpmPackage {
  version: string;
}

const packageJson = pkg as unknown as NpmPackage;

export const VERSION = packageJson.version;

/**
 * Check for available updates
 * Runs asynchronously and doesn't block execution
 */
export async function checkForUpdates(): Promise<void> {
  try {
    const response = await fetch('https://registry.npmjs.org/nz-legislation-tool/latest');

    if (!response.ok) {
      logger.debug('Update check failed: Registry returned', { status: response.status });
      return;
    }

    const data = await response.json() as { version: string };
    const latestVersion = data.version;

    if (latestVersion !== VERSION) {
      console.log(chalk.yellow(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  ⚠️  New version available!                               ║
║                                                           ║
║  Current: ${VERSION.padEnd(12)} Latest:   ${latestVersion.padEnd(12)} ║
║                                                           ║
║  Run: npm install -g nz-legislation-tool                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
      `));
    }
  } catch (error) {
    // Log debug info if verbose mode is enabled
    logger.debug('Update check failed', error instanceof Error ? { error: error.message } : { error });
  }
}

/**
 * Get version string with build info
 */
export function getVersionString(): string {
  return `nz-legislation-tool v${VERSION}`;
}
