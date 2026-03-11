/**
 * Centralized configuration management.
 * Priority: environment variables > secure config file > defaults.
 */

import { z } from 'zod';

import { logger } from '@utils/logger';
import { loadEnvConfig } from '@utils/env-loader';
import {
  getConfigFilePath,
  loadSecureConfig,
  saveSecureConfig,
  validateApiKeyFormat,
} from '@utils/secure-config';

const configSchema = z.object({
  apiKey: z.string().default('').refine((key) => key.length === 0 || validateApiKeyFormat(key), 'Invalid API key format'),
  baseUrl: z.string().url('Must be a valid URL').refine((url) => url.startsWith('https://'), 'API URL must use HTTPS').default('https://api.legislation.govt.nz'),
  timeout: z.number().positive('Timeout must be positive').max(300000, 'Timeout must be <= 5 minutes').default(30000),
  cacheEnabled: z.boolean().default(true),
  cacheTTL: z.number().positive('Cache TTL must be positive').default(3600000),
  rateLimitPerMinute: z.number().positive('Rate limit must be positive').max(1000, 'Rate limit must be <= 1000/min').default(100),
  outputFormat: z.enum(['table', 'json', 'csv']).default('table'),
  verbose: z.boolean().default(false),
});

export type Config = z.infer<typeof configSchema>;

export interface ConfigError {
  field: string;
  message: string;
  value?: unknown;
}

function validateConfig(config: unknown): { valid: boolean; data?: Config; errors?: ConfigError[] } {
  const result = configSchema.safeParse(config);

  if (!result.success) {
    return {
      valid: false,
      errors: result.error.errors.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      })),
    };
  }

  return { valid: true, data: result.data };
}

function loadStoredConfig(): Partial<Config> {
  return loadSecureConfig() as Partial<Config>;
}

function saveStoredConfig(config: Partial<Config>): void {
  saveSecureConfig(config as Record<string, unknown>);
}

function getEnvConfig(): Partial<Config> {
  const envConfig = loadEnvConfig();

  return {
    apiKey: envConfig.apiKey,
    baseUrl: envConfig.baseUrl,
    timeout: envConfig.timeout,
    verbose: envConfig.verbose,
  };
}

function defaultConfig(): Config {
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

export function getConfig(): Config {
  const envConfig = getEnvConfig();
  const fileConfig = loadStoredConfig();

  const mergedConfig = {
    apiKey: envConfig.apiKey || fileConfig.apiKey || '',
    baseUrl: envConfig.baseUrl || fileConfig.baseUrl || 'https://api.legislation.govt.nz',
    timeout: envConfig.timeout || fileConfig.timeout || 30000,
    cacheEnabled: fileConfig.cacheEnabled ?? true,
    cacheTTL: fileConfig.cacheTTL || 3600000,
    rateLimitPerMinute: fileConfig.rateLimitPerMinute || 100,
    outputFormat: fileConfig.outputFormat || 'table',
    verbose: envConfig.verbose ?? fileConfig.verbose ?? false,
  };

  const validation = validateConfig(mergedConfig);
  if (!validation.valid || !validation.data) {
    logger.warn('Configuration validation failed', { errors: validation.errors });
    return defaultConfig();
  }

  logger.debug('Configuration loaded', {
    apiKey: envConfig.apiKey ? 'from env' : fileConfig.apiKey ? 'from file' : 'default',
    baseUrl: validation.data.baseUrl,
    timeout: validation.data.timeout,
  });

  return validation.data;
}

export function hasApiKey(): boolean {
  try {
    return validateApiKeyFormat(getConfig().apiKey);
  } catch {
    return false;
  }
}

export function setApiKey(apiKey: string): void {
  if (!validateApiKeyFormat(apiKey)) {
    throw new Error('Invalid API key format. API key must be at least 16 characters and not a placeholder.');
  }

  saveStoredConfig({ ...loadStoredConfig(), apiKey });
  logger.info('API key updated');
}

export function setConfig<K extends keyof Config>(key: K, value: Config[K]): void {
  const testConfig = { ...getConfig(), [key]: value };
  const validation = validateConfig(testConfig);

  if (!validation.valid) {
    throw new Error(`Invalid configuration: ${validation.errors?.map((error) => error.message).join(', ')}`);
  }

  saveStoredConfig({ ...loadStoredConfig(), [key]: value });
  logger.info('Configuration updated', { key });
}

export function clearConfig(): void {
  saveStoredConfig({});
  logger.info('Configuration cleared');
}

export function getConfigPath(): string {
  return getConfigFilePath();
}

export function getConfigValidationStatus() {
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
