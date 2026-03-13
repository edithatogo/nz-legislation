/**
 * Secure credential management
 * Handles API keys and sensitive configuration securely
 */

import { chmodSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'fs';
import { homedir } from 'os';
import { join } from 'path';

import { logger } from './logger.js';

const CONFIG_DIR = join(homedir(), '.nz-legislation-tool');
const CONFIG_FILE = join(CONFIG_DIR, 'config.json');

/**
 * Ensure config directory has secure permissions
 */
function ensureSecureConfigDir(): void {
  if (!existsSync(CONFIG_DIR)) {
    // Create directory with restrictive permissions (owner only)
    try {
      mkdirSync(CONFIG_DIR, { recursive: true, mode: 0o700 });
      logger.debug('Created secure config directory', { path: CONFIG_DIR });
    } catch (error) {
      logger.warn(
        'Failed to set secure permissions on config directory',
        error instanceof Error ? { error: error.message } : undefined
      );
    }
  } else {
    // Ensure existing directory has correct permissions
    try {
      const stats = statSync(CONFIG_DIR);
      if ((stats.mode & 0o777) !== 0o700) {
        chmodSync(CONFIG_DIR, 0o700);
        logger.debug('Fixed config directory permissions', { path: CONFIG_DIR });
      }
    } catch (error) {
      logger.warn(
        'Failed to verify config directory permissions',
        error instanceof Error ? { error: error.message } : undefined
      );
    }
  }
}

/**
 * Check if config file has secure permissions
 */
export function verifyConfigFilePermissions(): boolean {
  if (!existsSync(CONFIG_FILE)) {
    return true; // No file to check
  }

  try {
    const stats = statSync(CONFIG_FILE);
    const permissions = stats.mode & 0o777;

    // File should only be readable/writable by owner
    if (permissions !== 0o600) {
      logger.warn('Config file has insecure permissions', {
        current: permissions.toString(8),
        expected: '600',
      });

      // Fix permissions
      try {
        chmodSync(CONFIG_FILE, 0o600);
        logger.info('Fixed config file permissions', { path: CONFIG_FILE });
        return true;
      } catch (fixError) {
        const errorMessage = fixError instanceof Error ? fixError.message : 'Unknown error';
        logger.error('Failed to fix config file permissions', undefined, { error: errorMessage });
        return false;
      }
    }

    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to verify config file permissions', undefined, { error: errorMessage });
    return false;
  }
}

/**
 * Save configuration securely
 */
export function saveSecureConfig(config: Record<string, unknown>): void {
  ensureSecureConfigDir();

  try {
    // Serialize to JSON
    const json = JSON.stringify(config, null, 2);

    // Write with restrictive permissions (owner read/write only)
    writeFileSync(CONFIG_FILE, json, {
      mode: 0o600,
      encoding: 'utf-8',
    });

    logger.debug('Configuration saved securely', { path: CONFIG_FILE });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to save configuration', undefined, { error: errorMessage });
    throw new Error('Failed to save configuration');
  }
}

/**
 * Load configuration securely
 */
export function loadSecureConfig(): Record<string, unknown> {
  if (!existsSync(CONFIG_FILE)) {
    return {};
  }

  // Verify permissions before reading
  if (!verifyConfigFilePermissions()) {
    logger.warn('Config file permissions may be insecure');
  }

  try {
    const content = readFileSync(CONFIG_FILE, 'utf-8');
    return JSON.parse(content) as Record<string, unknown>;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    logger.error('Failed to load configuration', undefined, { error: errorMessage });
    return {};
  }
}

/**
 * Validate API key format
 */
export function validateApiKeyFormat(apiKey: string): boolean {
  // Basic validation - should be non-empty and reasonable length
  if (!apiKey || typeof apiKey !== 'string') {
    return false;
  }

  // API keys should be at least 16 characters
  if (apiKey.length < 16) {
    return false;
  }

  // Check for common placeholder patterns
  const placeholders = [
    'your_api_key_here',
    'your-api-key-here',
    'YOUR_API_KEY_HERE',
    'placeholder',
    'changeme',
  ];

  if (placeholders.includes(apiKey.toLowerCase())) {
    return false;
  }

  return true;
}

/**
 * Mask API key for display (show only first and last 4 chars)
 */
export function maskApiKey(apiKey: string): string {
  if (!apiKey || apiKey.length < 8) {
    return '****';
  }

  const visible = 4;
  const start = apiKey.substring(0, visible);
  const end = apiKey.substring(apiKey.length - visible);
  const maskLength = apiKey.length - visible * 2;

  return `${start}${'*'.repeat(maskLength)}${end}`;
}

/**
 * Check if running on shared/multi-user system
 */
export function isSharedSystem(): boolean {
  // Check if home directory is in a shared location
  const home = homedir();

  // Common shared system indicators
  const sharedIndicators = [
    '/home/', // Linux multi-user
    '/Users/', // macOS (generally single-user but can be shared)
  ];

  return sharedIndicators.some(indicator => home.includes(indicator));
}

/**
 * Get security recommendations for config
 */
export function getConfigSecurityRecommendations(): string[] {
  const recommendations: string[] = [];

  if (isSharedSystem()) {
    recommendations.push(
      'This appears to be a shared system. Ensure config file permissions are set to 600 (owner read/write only).'
    );
  }

  if (!verifyConfigFilePermissions()) {
    recommendations.push(
      'Config file permissions are too permissive. Run: chmod 600 ~/.nz-legislation-tool/config.json'
    );
  }

  if (!existsSync(CONFIG_DIR)) {
    recommendations.push(
      'Config directory does not exist. It will be created with secure permissions on first use.'
    );
  }

  return recommendations;
}

/**
 * Get config file path
 */
export function getConfigFilePath(): string {
  return CONFIG_FILE;
}

/**
 * Get config directory path
 */
export function getConfigDirPath(): string {
  return CONFIG_DIR;
}
