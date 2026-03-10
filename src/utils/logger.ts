/**
 * Enhanced logging with Winston
 * Structured logging with file rotation, request tracing, and performance timing
 */

import { existsSync, mkdirSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';
import winston from 'winston';
import 'winston-daily-rotate-file';

import chalk from 'chalk';

const LOG_DIR = join(homedir(), '.nz-legislation-tool', 'logs');

/**
 * Ensure log directory exists
 */
function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
}

ensureLogDir();

/**
 * Custom format for console output with colors
 */
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...metadata }) => {
    let msg = `${chalk.gray(timestamp)} [${level}]: ${message}`;
    if (Object.keys(metadata).length > 0) {
      msg += ` ${JSON.stringify(metadata)}`;
    }
    return msg;
  })
);

/**
 * Custom format for file output (JSON)
 */
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DDTHH:mm:ss.SSSZ' }),
  winston.format.json()
);

/**
 * Create daily rotating file transport
 */
const dailyRotateTransport = new winston.transports.DailyRotateFile({
  filename: join(LOG_DIR, 'error-%DATE%.log'),
  datePattern: 'YYYY-MM-DD',
  level: 'error',
  format: fileFormat,
  maxFiles: '14d', // Keep 14 days of logs
  maxSize: '10m',   // Rotate at 10MB
  zippedArchive: true,
});

/**
 * Create Winston logger instance
 */
const winstonLogger = winston.createLogger({
  level: 'debug',
  transports: [
    dailyRotateTransport,
    new winston.transports.Console({
      format: consoleFormat,
      stderrLevels: ['error', 'warn'],
      consoleWarnLevels: ['warn'],
    }),
  ],
});

/**
 * Request correlation ID type
 */
interface RequestContext {
  correlationId?: string;
  operation?: string;
  duration?: number;
}

/**
 * Logger class with Winston and request tracing
 */
export class Logger {
  private verbose: boolean;
  private quiet: boolean;
  private requestContext: RequestContext = {};
  private timers: Map<string, number> = new Map();

  constructor(verbose: boolean = false, quiet: boolean = false) {
    this.verbose = verbose;
    this.quiet = quiet;
  }

  /**
   * Set verbose mode
   */
  setVerbose(verbose: boolean) {
    this.verbose = verbose;
    winstonLogger.level = verbose ? 'debug' : 'info';
  }

  /**
   * Set quiet mode
   */
  setQuiet(quiet: boolean) {
    this.quiet = quiet;
  }

  /**
   * Set request context for tracing
   */
  setRequestContext(context: RequestContext) {
    this.requestContext = { ...this.requestContext, ...context };
  }

  /**
   * Clear request context
   */
  clearRequestContext() {
    this.requestContext = {};
  }

  /**
   * Start a timer for performance tracking
   */
  startTimer(label: string): void {
    this.timers.set(label, Date.now());
  }

  /**
   * End timer and log duration
   */
  endTimer(label: string, logMessage?: string): number {
    const start = this.timers.get(label);
    if (!start) {
      this.warn(`Timer "${label}" not started`);
      return 0;
    }
    const duration = Date.now() - start;
    this.timers.delete(label);
    const message = logMessage || `Timer "${label}" completed`;
    this.debug(`${message}: ${duration}ms`, { duration });
    return duration;
  }

  /**
   * Debug log (only shown in verbose mode)
   */
  debug(message: string, metadata?: Record<string, unknown>) {
    if (this.verbose && !this.quiet) {
      winstonLogger.debug(message, { ...this.requestContext, ...metadata });
    }
  }

  /**
   * Info log
   */
  info(message: string, metadata?: Record<string, unknown>) {
    if (!this.quiet) {
      winstonLogger.info(message, { ...this.requestContext, ...metadata });
    }
  }

  /**
   * Warning log
   */
  warn(message: string, metadata?: Record<string, unknown>) {
    if (!this.quiet) {
      winstonLogger.warn(message, { ...this.requestContext, ...metadata });
    }
  }

  /**
   * Error log
   */
  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    if (this.quiet) {
      return;
    }
    const errorData: Record<string, unknown> = {
      ...this.requestContext,
      ...metadata,
    };
    if (error) {
      errorData.stack = error.stack;
      errorData.name = error.name;
      errorData.code = (error as NodeJS.ErrnoException).code;
    }
    winstonLogger.error(message, errorData);
  }

  /**
   * Get path to current log file
   */
  getLogFile(): string {
    const today = new Date().toISOString().split('T')[0];
    return join(LOG_DIR, `error-${today}.log`);
  }

  /**
   * Get log directory path
   */
  getLogDir(): string {
    return LOG_DIR;
  }

  /**
   * Clear old log files
   */
  clearOldLogs(daysToKeep: number = 7) {
    try {
      const { readdirSync, statSync, unlinkSync } = require('fs');
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      const files = readdirSync(LOG_DIR);
      for (const file of files) {
        const filePath = join(LOG_DIR, file);
        const stats = statSync(filePath);
        if (now - stats.mtimeMs > maxAge) {
          unlinkSync(filePath);
          this.debug(`Deleted old log file: ${file}`);
        }
      }
    } catch (error) {
      this.debug('Failed to clear old logs', error instanceof Error ? { error: error.message } : undefined);
    }
  }

  /**
   * Get logger statistics
   */
  getStats() {
    return {
      level: winstonLogger.level,
      transports: winstonLogger.transports.length,
      requestContext: this.requestContext,
      activeTimers: this.timers.size,
    };
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

/**
 * Set logger quiet mode
 */
export function setLoggerQuiet(quiet: boolean) {
  logger.setQuiet(quiet);
}
