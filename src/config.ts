/**
 * Centralized Configuration Management
 * Handles API key, caching, and user preferences with Zod validation
 * Priority: Environment variables > Secure config file > Defaults
 */

import Conf from 'conf';
import { z } from 'zod';

import { loadEnvConfig } from './utils/env-loader.js';
import { logger } from './utils/logger.js';
import { loadSecureConfig, validateApiKeyFormat } from './utils/secure-config.js';

/**
 * Configuration schema with Zod validation
 */
const configSchema = z.object({
  apiKey: z
    .string()
    .default('')
    .refine(key => key.length === 0 || validateApiKeyFormat(key), 'Invalid API key format'),
  baseUrl: z
    .string()
    .url('Must be a valid URL')
    .refine(url => url.startsWith('https://'), 'API URL must use HTTPS')
    .default('https://api.legislation.govt.nz'),
  timeout: z
    .number()
    .positive('Timeout must be positive')
    .max(300000, 'Timeout must be <= 5 minutes')
    .default(30000),
  cacheEnabled: z.boolean().default(true),
  cacheTTL: z.number().positive('Cache TTL must be positive').default(3600000), // 1 hour in ms
  rateLimitPerMinute: z
    .number()
    .positive('Rate limit must be positive')
    .max(1000, 'Rate limit must be <= 1000/min')
    .default(100),
  outputFormat: z.enum(['table', 'json', 'csv']).default('table'),
  verbose: z.boolean().default(false),
});

export type Config = z.infer<typeof configSchema>;

/**
 * Configuration error type
 */
export interface ConfigError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Validate configuration
 */
function validateConfig(config: unknown): {
  valid: boolean;
  data?: Config;
  errors?: ConfigError[];
} {
  const result = configSchema.safeParse(config);

  if (!result.success) {
    const errors: ConfigError[] = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return { valid: false, errors };
  }

  return { valid: true, data: result.data };
}

// Configuration store (persists to ~/.nz-legislation-tool/config.json)
const store = new Conf<Config>({
  projectName: 'nz-legislation-tool',
  configName: 'config',
  schema: {
    apiKey: {
      type: 'string',
      minLength: 1,
    },
    baseUrl: {
      type: 'string',
      format: 'uri',
      default: 'https://api.legislation.govt.nz',
    },
    timeout: {
      type: 'number',
      default: 30000,
    },
    cacheEnabled: {
      type: 'boolean',
      default: true,
    },
    cacheTTL: {
      type: 'number',
      default: 3600000,
    },
    rateLimitPerMinute: {
      type: 'number',
      default: 100,
    },
    outputFormat: {
      type: 'string',
      enum: ['table', 'json', 'csv'],
      default: 'table',
    },
    verbose: {
      type: 'boolean',
      default: false,
    },
  },
  serialize: (value: Config): string => JSON.stringify(value, null, 2),
  deserialize: (text: string): Config => JSON.parse(text) as Config,
});

/**
 * Get environment configuration using centralized loader
 */
function getEnvConfig(): Partial<Config> {
  const envConfig = loadEnvConfig();

  return {
    apiKey: envConfig.apiKey,
    baseUrl: envConfig.baseUrl,
    timeout: envConfig.timeout,
    verbose: envConfig.verbose,
  };
}

/**
 * Get configuration with priority: env vars > config file > defaults
 */
export function getConfig(): Config {
  const envConfig = getEnvConfig();
  const fileConfig = loadSecureConfig();

  // Merge configurations with priority
  const mergedConfig = {
    apiKey: envConfig.apiKey || (fileConfig.apiKey as string) || '',
    baseUrl:
      envConfig.baseUrl || (fileConfig.baseUrl as string) || 'https://api.legislation.govt.nz',
    timeout: envConfig.timeout || (fileConfig.timeout as number) || 30000,
    cacheEnabled: (fileConfig.cacheEnabled as boolean) ?? true,
    cacheTTL: (fileConfig.cacheTTL as number) || 3600000,
    rateLimitPerMinute: (fileConfig.rateLimitPerMinute as number) || 100,
    outputFormat: (fileConfig.outputFormat as 'table' | 'json' | 'csv') || 'table',
    verbose: envConfig.verbose ?? (fileConfig.verbose as boolean) ?? false,
  };

  // Validate merged configuration
  const validation = validateConfig(mergedConfig);

  if (!validation.valid || !validation.data) {
    logger.warn('Configuration validation failed', { errors: validation.errors });
    // Return defaults for invalid config
    return configSchema.parse({
      apiKey: '',
      baseUrl: 'https://api.legislation.govt.nz',
      timeout: 30000,
      cacheEnabled: true,
      cacheTTL: 3600000,
      rateLimitPerMinute: 100,
      outputFormat: 'table',
      verbose: false,
    });
  }

  logger.debug('Configuration loaded', {
    apiKey: envConfig.apiKey ? 'from env' : fileConfig.apiKey ? 'from file' : 'default',
    baseUrl: validation.data.baseUrl,
    timeout: validation.data.timeout,
  });

  return validation.data;
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
  try {
    const config = getConfig();
    return validateApiKeyFormat(config.apiKey);
  } catch {
    return false;
  }
}

/**
 * Set API key in config with validation
 */
export function setApiKey(apiKey: string): void {
  // Validate API key format
  if (!validateApiKeyFormat(apiKey)) {
    throw new Error(
      'Invalid API key format. API key must be at least 16 characters and not a placeholder.'
    );
  }

  store.set('apiKey', apiKey);
  logger.info('API key updated');
}

/**
 * Set a configuration value with validation
 */
export function setConfig<K extends keyof Config>(key: K, value: Config[K]): void {
  const testConfig = { ...getConfig(), [key]: value };
  const validation = validateConfig(testConfig);

  if (!validation.valid) {
    throw new Error(`Invalid configuration: ${validation.errors?.map(e => e.message).join(', ')}`);
  }

  store.set(key, value);
  logger.info('Configuration updated', { key });
}

/**
 * Clear all configuration
 */
export function clearConfig(): void {
  store.clear();
  logger.info('Configuration cleared');
}

/**
 * Get config file path
 */
export function getConfigPath(): string {
  return store.path;
}

/**
 * Get configuration validation status
 */
export function getConfigValidationStatus(): {
  valid: boolean;
  errors?: ConfigError[];
  hasApiKey: boolean;
  isHttps: boolean;
  source: 'environment' | 'file';
} {
  const config = getConfig();
  const validation = validateConfig(config);

  return {
    valid: validation.valid,
    errors: validation.errors,
    hasApiKey: hasApiKey(),
    isHttps: config.baseUrl.startsWith('https://'),
    source: process.env.NZ_LEGISLATION_API_KEY ? 'environment' : 'file',
  };
}
