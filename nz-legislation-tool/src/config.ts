/**
 * Configuration management for NZ Legislation CLI
 * Handles API key, caching, and user preferences
 */

import Conf from 'conf';
import dotenv from 'dotenv';
import { z } from 'zod';

// Load environment variables from .env file
dotenv.config();

// Configuration schema for validation
const configSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  baseUrl: z.string().url().default('https://api.legislation.govt.nz'),
  timeout: z.number().positive().default(30000),
  cacheEnabled: z.boolean().default(true),
  cacheTTL: z.number().positive().default(3600000), // 1 hour in ms
  rateLimitPerMinute: z.number().positive().default(100),
  outputFormat: z.enum(['table', 'json', 'csv']).default('table'),
  verbose: z.boolean().default(false),
});

export type Config = z.infer<typeof configSchema>;

// Configuration store (persists to ~/.config/nz-legislation-tool/config.json)
const store = new Conf<Config>({
  projectName: 'nz-legislation-tool',
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
});

/**
 * Get configuration with priority: env vars > config file > defaults
 */
export function getConfig(): Config {
  const envApiKey = process.env.NZ_LEGISLATION_API_KEY;
  const envBaseUrl = process.env.NZ_LEGISLATION_BASE_URL;
  const envTimeout = process.env.NZ_LEGISLATION_TIMEOUT;

  const config = {
    apiKey: envApiKey || store.get('apiKey', ''),
    baseUrl: envBaseUrl || store.get('baseUrl'),
    timeout: envTimeout ? parseInt(envTimeout, 10) : store.get('timeout'),
    cacheEnabled: store.get('cacheEnabled'),
    cacheTTL: store.get('cacheTTL'),
    rateLimitPerMinute: store.get('rateLimitPerMinute'),
    outputFormat: store.get('outputFormat'),
    verbose: store.get('verbose'),
  };

  return configSchema.parse(config);
}

/**
 * Check if API key is configured
 */
export function hasApiKey(): boolean {
  const config = getConfig();
  return config.apiKey.length > 0 && config.apiKey !== 'your_api_key_here';
}

/**
 * Set API key in config
 */
export function setApiKey(apiKey: string): void {
  store.set('apiKey', apiKey);
}

/**
 * Set a configuration value
 */
export function setConfig<K extends keyof Config>(key: K, value: Config[K]): void {
  store.set(key, value);
}

/**
 * Clear all configuration
 */
export function clearConfig(): void {
  store.clear();
}

/**
 * Get config file path
 */
export function getConfigPath(): string {
  return store.path;
}
