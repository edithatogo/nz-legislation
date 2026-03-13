/**
 * Error hierarchy for NZ Legislation CLI
 * Provides structured error handling with error codes for programmatic handling
 */

/**
 * Base error code enumeration
 */
export enum ErrorCode {
  // API Errors (1000-1999)
  API_AUTHENTICATION_FAILED = 1001,
  API_NOT_FOUND = 1002,
  API_RATE_LIMIT_EXCEEDED = 1003,
  API_TIMEOUT = 1004,
  API_UNEXPECTED_RESPONSE = 1005,

  // Configuration Errors (2000-2999)
  CONFIG_NOT_FOUND = 2001,
  CONFIG_INVALID = 2002,
  CONFIG_API_KEY_MISSING = 2003,

  // Validation Errors (3000-3999)
  VALIDATION_FAILED = 3001,
  VALIDATION_INVALID_ID = 3002,
  VALIDATION_INVALID_DATE = 3003,

  // File System Errors (4000-4999)
  FILE_NOT_FOUND = 4001,
  FILE_WRITE_FAILED = 4002,
  FILE_READ_FAILED = 4003,

  // Network Errors (5000-5999)
  NETWORK_OFFLINE = 5001,
  NETWORK_DNS_FAILED = 5002,
  NETWORK_CONNECTION_REFUSED = 5003,

  // Unknown Errors (9999)
  UNKNOWN = 9999,
}

/**
 * Base application error with error code
 */
export class ApplicationError extends Error {
  public readonly code: ErrorCode;
  public readonly timestamp: Date;
  public readonly context?: Record<string, unknown>;

  constructor(code: ErrorCode, message: string, context?: Record<string, unknown>) {
    super(message);
    this.name = 'ApplicationError';
    this.code = code;
    this.timestamp = new Date();
    this.context = context;

    // Maintain proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }

  /**
   * Convert error to JSON for logging/serialization
   */
  toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      timestamp: this.timestamp.toISOString(),
      context: this.context,
      stack: this.stack,
    };
  }
}

/**
 * API-related errors
 */
export class ApiError extends ApplicationError {
  public readonly statusCode?: number;
  public readonly url?: string;

  constructor(
    code: ErrorCode,
    message: string,
    options?: { statusCode?: number; url?: string; context?: Record<string, unknown> }
  ) {
    super(code, message, options?.context);
    this.name = 'ApiError';
    this.statusCode = options?.statusCode;
    this.url = options?.url;
  }
}

/**
 * Configuration-related errors
 */
export class ConfigError extends ApplicationError {
  constructor(code: ErrorCode, message: string, context?: Record<string, unknown>) {
    super(code, message, context);
    this.name = 'ConfigError';
  }
}

/**
 * Validation-related errors
 */
export class ValidationError extends ApplicationError {
  public readonly field?: string;

  constructor(
    code: ErrorCode,
    message: string,
    options?: { field?: string; context?: Record<string, unknown> }
  ) {
    super(code, message, options?.context);
    this.name = 'ValidationError';
    this.field = options?.field;
  }
}

/**
 * File system-related errors
 */
export class FileSystemError extends ApplicationError {
  public readonly path?: string;

  constructor(
    code: ErrorCode,
    message: string,
    options?: { path?: string; context?: Record<string, unknown> }
  ) {
    super(code, message, options?.context);
    this.name = 'FileSystemError';
    this.path = options?.path;
  }
}

/**
 * Network-related errors
 */
export class NetworkError extends ApplicationError {
  public readonly url?: string;

  constructor(
    code: ErrorCode,
    message: string,
    options?: { url?: string; context?: Record<string, unknown> }
  ) {
    super(code, message, options?.context);
    this.name = 'NetworkError';
    this.url = options?.url;
  }
}

/**
 * Helper function to create API errors with common patterns
 */
export function createApiError(statusCode: number, url: string, message?: string): ApiError {
  if (statusCode === 401 || statusCode === 403) {
    return new ApiError(
      ErrorCode.API_AUTHENTICATION_FAILED,
      message || 'Authentication failed. Please check your API key.',
      { statusCode, url }
    );
  }

  if (statusCode === 404) {
    return new ApiError(ErrorCode.API_NOT_FOUND, message || 'Resource not found.', {
      statusCode,
      url,
    });
  }

  if (statusCode === 429) {
    return new ApiError(
      ErrorCode.API_RATE_LIMIT_EXCEEDED,
      message || 'Rate limit exceeded. Please wait before making more requests.',
      { statusCode, url }
    );
  }

  if (statusCode >= 500) {
    return new ApiError(
      ErrorCode.API_UNEXPECTED_RESPONSE,
      message || 'API server error. Please try again later.',
      { statusCode, url }
    );
  }

  return new ApiError(
    ErrorCode.API_UNEXPECTED_RESPONSE,
    message || `API returned status ${statusCode}`,
    { statusCode, url }
  );
}

/**
 * Type guard to check if error is ApplicationError
 */
export function isApplicationError(error: unknown): error is ApplicationError {
  return error instanceof ApplicationError;
}

/**
 * Type guard to check if error is ApiError
 */
export function isApiError(error: unknown): error is ApiError {
  return error instanceof ApiError;
}

/**
 * Get user-friendly error message
 */
export function getUserFriendlyMessage(error: unknown): string {
  if (isApplicationError(error)) {
    return error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}

/**
 * Get error code from error
 */
export function getErrorCode(error: unknown): ErrorCode {
  if (isApplicationError(error)) {
    return error.code;
  }

  return ErrorCode.UNKNOWN;
}
