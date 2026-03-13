/**
 * Configuration Validation
 * Runtime validation and health checks for configuration
 */

import { ErrorCode, ValidationError } from '@errors';
import { logger } from '@utils/logger';
import { validateApiKeyFormat } from '@utils/secure-config';

/**
 * Configuration validation result
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationErrorDetail[];
  warnings: string[];
}

/**
 * Validation error detail
 */
export interface ValidationErrorDetail {
  field: string;
  message: string;
  code: ErrorCode;
}

/**
 * Validate API key
 */
function validateApiKey(apiKey: string | undefined): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (!apiKey || apiKey.length === 0) {
    errors.push({
      field: 'apiKey',
      message:
        'API key is required. Set via config file or NZ_LEGISLATION_API_KEY environment variable.',
      code: ErrorCode.CONFIG_API_KEY_MISSING,
    });
  } else if (apiKey === 'your_api_key_here') {
    errors.push({
      field: 'apiKey',
      message: 'API key is a placeholder. Please set your actual API key.',
      code: ErrorCode.CONFIG_API_KEY_MISSING,
    });
  } else if (!validateApiKeyFormat(apiKey)) {
    errors.push({
      field: 'apiKey',
      message: 'API key format is invalid. API keys must be at least 16 characters.',
      code: ErrorCode.CONFIG_INVALID,
    });
  }

  return errors;
}

/**
 * Validate base URL
 */
function validateBaseUrl(baseUrl: string | undefined): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (!baseUrl) {
    return errors; // Optional field with default
  }

  try {
    new URL(baseUrl);

    if (!baseUrl.startsWith('https://')) {
      errors.push({
        field: 'baseUrl',
        message: 'API URL must use HTTPS for security.',
        code: ErrorCode.CONFIG_INVALID,
      });
    }
  } catch {
    errors.push({
      field: 'baseUrl',
      message: 'Base URL is not a valid URL.',
      code: ErrorCode.CONFIG_INVALID,
    });
  }

  return errors;
}

/**
 * Validate timeout
 */
function validateTimeout(timeout: number | undefined): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (timeout === undefined) {
    return errors; // Optional field with default
  }

  if (timeout <= 0) {
    errors.push({
      field: 'timeout',
      message: 'Timeout must be a positive number.',
      code: ErrorCode.CONFIG_INVALID,
    });
  } else if (timeout > 300000) {
    errors.push({
      field: 'timeout',
      message: 'Timeout must be <= 5 minutes (300000ms).',
      code: ErrorCode.CONFIG_INVALID,
    });
  }

  return errors;
}

/**
 * Validate rate limit
 */
function validateRateLimit(rateLimit: number | undefined): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];

  if (rateLimit === undefined) {
    return errors; // Optional field with default
  }

  if (rateLimit <= 0) {
    errors.push({
      field: 'rateLimitPerMinute',
      message: 'Rate limit must be a positive number.',
      code: ErrorCode.CONFIG_INVALID,
    });
  } else if (rateLimit > 1000) {
    errors.push({
      field: 'rateLimitPerMinute',
      message: 'Rate limit must be <= 1000 requests per minute.',
      code: ErrorCode.CONFIG_INVALID,
    });
  }

  return errors;
}

/**
 * Validate output format
 */
function validateOutputFormat(format: string | undefined): ValidationErrorDetail[] {
  const errors: ValidationErrorDetail[] = [];
  const validFormats = ['table', 'json', 'csv'];

  if (format && !validFormats.includes(format)) {
    errors.push({
      field: 'outputFormat',
      message: `Output format must be one of: ${validFormats.join(', ')}.`,
      code: ErrorCode.CONFIG_INVALID,
    });
  }

  return errors;
}

/**
 * Generate warnings for suboptimal configuration
 */
function generateWarnings(config: Record<string, unknown>): string[] {
  const warnings: string[] = [];

  // Warn if using non-default timeout
  if (config.timeout && (config.timeout as number) < 10000) {
    warnings.push(
      'Timeout is set to less than 10 seconds. This may cause failures on slow connections.'
    );
  }

  // Warn if cache is disabled
  if (config.cacheEnabled === false) {
    warnings.push(
      'Caching is disabled. This may result in slower performance and higher API usage.'
    );
  }

  // Warn if verbose mode is enabled in production-like setting
  if (config.verbose === true) {
    warnings.push('Verbose mode is enabled. This may expose sensitive information in logs.');
  }

  return warnings;
}

/**
 * Validate complete configuration
 * @param config - Configuration object to validate
 * @returns Validation result with errors and warnings
 */
export function validateConfiguration(config: Record<string, unknown>): ValidationResult {
  const errors: ValidationErrorDetail[] = [];
  const warnings: string[] = [];

  // Validate each field
  errors.push(...validateApiKey(config.apiKey as string | undefined));
  errors.push(...validateBaseUrl(config.baseUrl as string | undefined));
  errors.push(...validateTimeout(config.timeout as number | undefined));
  errors.push(...validateRateLimit(config.rateLimitPerMinute as number | undefined));
  errors.push(...validateOutputFormat(config.outputFormat as string | undefined));

  // Generate warnings
  warnings.push(...generateWarnings(config));

  // Log validation results
  if (errors.length > 0) {
    logger.warn('Configuration validation failed', { errors });
  } else if (warnings.length > 0) {
    logger.debug('Configuration validated with warnings', { warnings });
  } else {
    logger.debug('Configuration validated successfully');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validate configuration and throw on errors
 * @param config - Configuration object to validate
 * @throws {ValidationError} if validation fails
 */
export function validateConfigurationOrThrow(config: Record<string, unknown>): void {
  const result = validateConfiguration(config);

  if (!result.valid && result.errors.length > 0) {
    const firstError = result.errors[0];
    throw new ValidationError(firstError.code, firstError.message, { field: firstError.field });
  }
}

/**
 * Check if configuration is ready for API calls
 * @param config - Configuration to check
 * @returns True if configuration is valid for API usage
 */
export function isConfigReadyForApi(config: Record<string, unknown>): boolean {
  const apiKeyErrors = validateApiKey(config.apiKey as string | undefined);
  return apiKeyErrors.length === 0;
}
