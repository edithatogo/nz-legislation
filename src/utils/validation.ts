/**
 * Input validation schemas using Zod
 * Provides runtime validation for all user inputs
 */

import { z } from 'zod';

/**
 * Date string in YYYY-MM-DD format
 */
export const DateStringSchema = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format')
  .refine(date => {
    const parsed = new Date(date);
    return !isNaN(parsed.getTime());
  }, 'Invalid date');

/**
 * Work ID validation for current API work IDs (e.g., act_public_1989_18)
 */
export const WorkIdSchema = z
  .string()
  .min(1, 'Work ID is required')
  .regex(
    /^(?:[a-z0-9-]+(?:_[a-z0-9-]+){2,}|[a-z0-9-]+\/\d{4}\/\d+)$/,
    'Invalid work ID format. Expected an API work ID like act_public_1989_18.'
  );

/**
 * Search query validation
 */
export const SearchQuerySchema = z
  .string()
  .min(1, 'Search query is required')
  .max(500, 'Search query must be less than 500 characters')
  .trim();

/**
 * Legislation type validation
 */
export const LegislationTypeSchema = z.enum(['act', 'bill', 'regulation', 'instrument']).optional();

/**
 * Legislation status validation
 */
export const LegislationStatusSchema = z
  .enum(['in-force', 'not-yet-in-force', 'repealed', 'partially-repealed', 'withdrawn'])
  .optional();

/**
 * Output format validation
 */
export const OutputFormatSchema = z.enum(['table', 'json', 'csv']).default('table');

/**
 * Pagination limit validation
 */
export const LimitSchema = z
  .string()
  .default('25')
  .transform(val => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return 25;
    }
    return Math.min(Math.max(num, 1), 100); // Clamp between 1 and 100
  });

/**
 * Pagination offset validation
 */
export const OffsetSchema = z
  .string()
  .default('0')
  .transform(val => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return 0;
    }
    return Math.max(num, 0); // Ensure non-negative
  });

/**
 * Search parameters schema
 */
export const SearchParamsSchema = z.object({
  query: SearchQuerySchema,
  type: LegislationTypeSchema,
  status: LegislationStatusSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  limit: LimitSchema,
  offset: OffsetSchema,
  format: OutputFormatSchema,
});

/**
 * Get work parameters schema
 */
export const GetWorkParamsSchema = z.object({
  workId: WorkIdSchema,
  versions: z.boolean().default(false),
  format: OutputFormatSchema,
});

/**
 * Citation style validation
 */
export const CitationStyleSchema = z.enum(['nzmj', 'bibtex', 'ris', 'enw', 'apa']).default('nzmj');

/**
 * Export parameters schema
 */
export const ExportParamsSchema = z.object({
  query: SearchQuerySchema,
  output: z
    .string()
    .min(1, 'Output filename is required')
    .regex(/\.csv$/i, 'Output file must have .csv extension'),
  type: LegislationTypeSchema,
  status: LegislationStatusSchema,
  from: DateStringSchema.optional(),
  to: DateStringSchema.optional(),
  limit: LimitSchema,
});

/**
 * Configuration key validation
 */
export const ConfigKeySchema = z.enum([
  'apiKey',
  'baseUrl',
  'timeout',
  'cacheEnabled',
  'cacheTTL',
  'rateLimitPerMinute',
  'outputFormat',
  'verbose',
]);

/**
 * API URL validation
 */
export const ApiUrlSchema = z
  .string()
  .url('Must be a valid URL')
  .refine(url => url.startsWith('https://'), 'API URL must use HTTPS for security');

/**
 * Timeout validation (in milliseconds)
 */
export const TimeoutSchema = z
  .string()
  .default('30000')
  .transform(val => {
    const num = parseInt(val, 10);
    if (isNaN(num)) {
      return 30000;
    }
    return Math.min(Math.max(num, 1000), 300000); // Clamp between 1s and 5min
  });

/**
 * Validation error type
 */
export interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

/**
 * Validate input against schema and return formatted errors
 */
export function validateInput<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { valid: boolean; data?: T; errors?: ValidationError[] } {
  const result = schema.safeParse(data);

  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
      value: 'input' in err ? err.input : undefined,
    }));
    return { valid: false, errors };
  }

  return { valid: true, data: result.data };
}

/**
 * Sanitize string input to prevent injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/["'`]/g, match => `\\${match}`) // Escape quotes
    .trim();
}

/**
 * Search parameters schema (output types for validated data)
 */
export interface ValidatedSearchParams {
  query: string;
  type?: 'act' | 'bill' | 'regulation' | 'instrument';
  status?: 'in-force' | 'not-yet-in-force' | 'repealed' | 'partially-repealed' | 'withdrawn';
  from?: string;
  to?: string;
  limit: number;
  offset: number;
  format: 'table' | 'json' | 'csv';
}

interface ValidationFailure {
  valid: false;
  errors: ValidationError[];
}

interface SearchValidationSuccess {
  valid: true;
  data: z.infer<typeof SearchParamsSchema>;
}

interface WorkIdValidationSuccess {
  valid: true;
  data: z.infer<typeof WorkIdSchema>;
}

interface ExportValidationSuccess {
  valid: true;
  data: z.infer<typeof ExportParamsSchema>;
}

/**
 * Validate and sanitize search parameters
 */
export function validateSearchParams(params: unknown): ValidationFailure | SearchValidationSuccess {
  const result = SearchParamsSchema.safeParse(params);
  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}

/**
 * Validate and sanitize work ID
 */
export function validateWorkId(workId: string): ValidationFailure | WorkIdValidationSuccess {
  const result = WorkIdSchema.safeParse(workId);
  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map(err => ({
      field: 'workId',
      message: err.message,
    }));
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}

/**
 * Validate and sanitize export parameters
 */
export function validateExportParams(params: unknown): ValidationFailure | ExportValidationSuccess {
  const result = ExportParamsSchema.safeParse(params);
  if (!result.success) {
    const errors: ValidationError[] = result.error.errors.map(err => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    return { valid: false, errors };
  }
  return { valid: true, data: result.data };
}
