/**
 * Error logging utility
 * Logs errors to file for debugging production issues
 */

import { appendFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import chalk from 'chalk';

const LOG_DIR = join(homedir(), '.nz-legislation-tool', 'logs');
const LOG_FILE = join(LOG_DIR, `error-${new Date().toISOString().split('T')[0]}.log`);

/**
 * Ensure log directory exists
 */
function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
}

/**
 * Log level enumeration
 */
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

/**
 * Logger class for consistent logging
 */
export class Logger {
  private verbose: boolean;

  constructor(verbose: boolean = false) {
    this.verbose = verbose;
  }

  /**
   * Set verbose mode
   */
  setVerbose(verbose: boolean) {
    this.verbose = verbose;
  }

  /**
   * Debug log (only shown in verbose mode)
   */
  debug(message: string, ...args: any[]) {
    if (this.verbose) {
      console.log(chalk.gray(`[DEBUG] ${message}`), ...args);
    }
  }

  /**
   * Info log
   */
  info(message: string, ...args: any[]) {
    console.log(chalk.blue(`[INFO] ${message}`), ...args);
  }

  /**
   * Warning log
   */
  warn(message: string, ...args: any[]) {
    console.log(chalk.yellow(`[WARN] ${message}`), ...args);
    this.logToFile('warn', message, args);
  }

  /**
   * Error log
   */
  error(message: string, error?: Error) {
    console.log(chalk.red(`[ERROR] ${message}`));
    if (error) {
      console.error(chalk.red(error.stack || error.message));
    }
    this.logToFile('error', message, [error]);
  }

  /**
   * Log to file
   */
  private logToFile(level: LogLevel, message: string, args: any[]) {
    try {
      ensureLogDir();

      const timestamp = new Date().toISOString();
      const logEntry = [
        `[${timestamp}]`,
        `[${level.toUpperCase()}]`,
        message,
        ...args.map(arg => {
          if (arg instanceof Error) {
            return `\n  Stack: ${arg.stack}`;
          }
          if (typeof arg === 'object') {
            return JSON.stringify(arg, null, 2);
          }
          return String(arg);
        }),
      ].join(' ');

      appendFileSync(LOG_FILE, logEntry + '\n');
    } catch (logError) {
      // Silently fail - don't want logging errors to crash the app
      console.error(chalk.gray('[LOG ERROR] Failed to write to log file'));
    }
  }

  /**
   * Get path to current log file
   */
  getLogFile(): string {
    ensureLogDir();
    return LOG_FILE;
  }

  /**
   * Clear old log files (older than 7 days)
   */
  clearOldLogs(daysToKeep: number = 7) {
    try {
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      const files = readdirSync(LOG_DIR);
      for (const file of files) {
        const filePath = join(LOG_DIR, file);
        const stats = statSync(filePath);
        if (now - stats.mtimeMs > maxAge) {
          unlinkSync(filePath);
        }
      }
    } catch (error) {
      this.debug('Failed to clear old logs', error);
    }
  }
}

// Export singleton instance
export const logger = new Logger();

/**
 * Set logger verbose mode from CLI
 */
export function setLoggerVerbose(verbose: boolean) {
  logger.setVerbose(verbose);
}
