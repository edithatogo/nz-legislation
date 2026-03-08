/**
 * Version management and update checking
 */

import pkg from '../../package.json' assert { type: 'json' };
import chalk from 'chalk';
import { logger } from './logger.js';

export const VERSION = pkg.version;

/**
 * Check for available updates
 * Runs asynchronously and doesn't block execution
 */
export async function checkForUpdates(): Promise<void> {
  try {
    const response = await fetch('https://registry.npmjs.org/nz-legislation-tool/latest');
    
    if (!response.ok) {
      logger.debug('Update check failed: Registry returned', response.status);
      return;
    }

    const data = await response.json();
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
    logger.debug('Update check failed', error);
  }
}

/**
 * Get version string with build info
 */
export function getVersionString(): string {
  return `nz-legislation-tool v${VERSION}`;
}
