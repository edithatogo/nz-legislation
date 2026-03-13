/**
 * Environment Variable Loader
 * Loads and validates environment variables with type safety
 */

import { z } from 'zod';

/**
 * Environment variable schema with validation
 */
const envSchema = z.object({
  NZ_LEGISLATION_API_KEY: z.string().optional(),
  NZ_LEGISLATION_BASE_URL: z.string().url().optional(),
  NZ_LEGISLATION_TIMEOUT: z
    .string()
    .regex(/^\d+$/)
    .transform(val => parseInt(val, 10))
    .optional(),
  NZ_LEGISLATION_VERBOSE: z
    .string()
    .transform(val => val === 'true')
    .optional(),
});

export type EnvConfig = z.infer<typeof envSchema>;

/**
 * Interface for parsed environment variables
 */
interface ParsedEnv {
  apiKey?: string;
  baseUrl?: string;
  timeout?: number;
  verbose?: boolean;
}

/**
 * Parse and validate environment variables
 * @returns Validated environment configuration
 */
export function loadEnvConfig(): ParsedEnv {
  // Parse environment variables
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    // Log validation errors but don't fail - we'll use defaults
    const errors = result.error.errors.map(err => ({
      variable: err.path.join('.'),
      message: err.message,
    }));

    // Only warn if there are actual env vars set but invalid
    const hasEnvVars = Object.keys(process.env).some(key => key.startsWith('NZ_LEGISLATION_'));

    if (hasEnvVars) {
      console.warn('Warning: Invalid environment variables detected:', errors);
    }

    return {};
  }

  const parsed: ParsedEnv = {};

  if (result.data.NZ_LEGISLATION_API_KEY) {
    parsed.apiKey = result.data.NZ_LEGISLATION_API_KEY;
  }

  if (result.data.NZ_LEGISLATION_BASE_URL) {
    parsed.baseUrl = result.data.NZ_LEGISLATION_BASE_URL;
  }

  if (result.data.NZ_LEGISLATION_TIMEOUT !== undefined) {
    parsed.timeout = result.data.NZ_LEGISLATION_TIMEOUT;
  }

  if (result.data.NZ_LEGISLATION_VERBOSE !== undefined) {
    parsed.verbose = result.data.NZ_LEGISLATION_VERBOSE;
  }

  return parsed;
}

/**
 * Check if required environment variables are set
 * @returns True if API key is configured
 */
export function hasRequiredEnvVars(): boolean {
  return (
    !!process.env.NZ_LEGISLATION_API_KEY &&
    process.env.NZ_LEGISLATION_API_KEY !== 'your_api_key_here'
  );
}

/**
 * Get environment variable validation status
 */
export function getEnvValidationStatus(): {
  hasApiKey: boolean;
  hasBaseUrl: boolean;
  hasTimeout: boolean;
  isVerbose: boolean;
  source: 'environment';
} {
  const env = loadEnvConfig();

  return {
    hasApiKey: !!env.apiKey && env.apiKey !== 'your_api_key_here',
    hasBaseUrl: !!env.baseUrl,
    hasTimeout: !!env.timeout,
    isVerbose: !!env.verbose,
    source: 'environment',
  };
}
