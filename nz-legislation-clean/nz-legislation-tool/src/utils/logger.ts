/**
 * Lightweight logger used by the CLI, MCP server, and tests.
 *
 * The previous Winston-based implementation is intentionally replaced here
 * because the current local install cannot resolve the package reliably under
 * Node/Vitest in this repository. This keeps logging functional without
 * blocking the build or test runner.
 */

import { appendFileSync, existsSync, mkdirSync, readdirSync, statSync, unlinkSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import chalk from 'chalk';

const LOG_DIR = join(homedir(), '.nz-legislation-tool', 'logs');

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface RequestContext {
  correlationId?: string;
  operation?: string;
  duration?: number;
}

function ensureLogDir() {
  if (!existsSync(LOG_DIR)) {
    mkdirSync(LOG_DIR, { recursive: true });
  }
}

function serializeMetadata(metadata?: Record<string, unknown>): string {
  if (!metadata || Object.keys(metadata).length === 0) {
    return '';
  }

  return ` ${JSON.stringify(metadata)}`;
}

function getLogFilePath(): string {
  const today = new Date().toISOString().split('T')[0];
  return join(LOG_DIR, `error-${today}.log`);
}

function appendLog(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
  ensureLogDir();

  const entry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...metadata,
  };

  appendFileSync(getLogFilePath(), `${JSON.stringify(entry)}\n`, 'utf8');
}

function writeConsole(level: LogLevel, message: string, metadata?: Record<string, unknown>): void {
  const timestamp = chalk.gray(new Date().toISOString().replace('T', ' ').replace('Z', ''));
  const line = `${timestamp} [${level}]: ${message}${serializeMetadata(metadata)}`;

  if (level === 'error' || level === 'warn') {
    console.error(line);
    return;
  }

  console.log(line);
}

export class Logger {
  private verbose: boolean;
  private quiet: boolean;
  private requestContext: RequestContext = {};
  private timers: Map<string, number> = new Map();

  constructor(verbose: boolean = false, quiet: boolean = false) {
    this.verbose = verbose;
    this.quiet = quiet;
  }

  setVerbose(verbose: boolean) {
    this.verbose = verbose;
  }

  setQuiet(quiet: boolean) {
    this.quiet = quiet;
  }

  setRequestContext(context: RequestContext) {
    this.requestContext = { ...this.requestContext, ...context };
  }

  clearRequestContext() {
    this.requestContext = {};
  }

  startTimer(label: string): void {
    this.timers.set(label, Date.now());
  }

  endTimer(label: string, logMessage?: string): number {
    const start = this.timers.get(label);
    if (!start) {
      this.warn(`Timer "${label}" not started`);
      return 0;
    }

    const duration = Date.now() - start;
    this.timers.delete(label);
    this.debug(logMessage || `Timer "${label}" completed`, { duration });
    return duration;
  }

  debug(message: string, metadata?: Record<string, unknown>) {
    if (!this.verbose || this.quiet) {
      return;
    }

    const merged = { ...this.requestContext, ...metadata };
    writeConsole('debug', message, merged);
  }

  info(message: string, metadata?: Record<string, unknown>) {
    if (this.quiet) {
      return;
    }

    const merged = { ...this.requestContext, ...metadata };
    writeConsole('info', message, merged);
  }

  warn(message: string, metadata?: Record<string, unknown>) {
    if (this.quiet) {
      return;
    }

    const merged = { ...this.requestContext, ...metadata };
    writeConsole('warn', message, merged);
    appendLog('warn', message, merged);
  }

  error(message: string, error?: Error, metadata?: Record<string, unknown>) {
    if (this.quiet) {
      return;
    }

    const merged: Record<string, unknown> = {
      ...this.requestContext,
      ...metadata,
    };

    if (error) {
      merged.stack = error.stack;
      merged.name = error.name;
      merged.code = (error as NodeJS.ErrnoException).code;
    }

    writeConsole('error', message, merged);
    appendLog('error', message, merged);
  }

  getLogFile(): string {
    return getLogFilePath();
  }

  getLogDir(): string {
    return LOG_DIR;
  }

  clearOldLogs(daysToKeep: number = 7) {
    try {
      ensureLogDir();
      const now = Date.now();
      const maxAge = daysToKeep * 24 * 60 * 60 * 1000;

      for (const file of readdirSync(LOG_DIR)) {
        const filePath = join(LOG_DIR, file);
        const stats = statSync(filePath);

        if (now - stats.mtimeMs > maxAge) {
          unlinkSync(filePath);
          this.debug(`Deleted old log file: ${file}`);
        }
      }
    } catch {
      this.debug('Failed to clear old logs');
    }
  }

  getStats() {
    return {
      level: this.verbose ? 'debug' : 'info',
      requestContext: this.requestContext,
      activeTimers: this.timers.size,
    };
  }
}

export const logger = new Logger();

export function setLoggerVerbose(verbose: boolean) {
  logger.setVerbose(verbose);
}

export function setLoggerQuiet(quiet: boolean) {
  logger.setQuiet(quiet);
}
