/**
 * Data models for NZ Legislation API
 * Using Zod for runtime validation and type inference
 */

import { z } from 'zod';

// Work type enumeration
const WorkTypeSchema = z.enum(['act', 'bill', 'regulation', 'instrument', 'secondary_legislation', 'amendment_paper']);
type WorkType = z.infer<typeof WorkTypeSchema>;

// Legislation status enumeration
const LegislationStatusSchema = z.enum([
  'in_force',
  'not_in_force',
  'repealed',
  'partially-repealed',
  'revoked',
  'current',
]).nullable();
type LegislationStatus = z.infer<typeof LegislationStatusSchema>;

// Date string in YYYY-MM-DD format
const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (expected YYYY-MM-DD)');

/**
 * Version information embedded in work response
 */
const LatestVersionSchema = z.object({
  formats: z.array(z.object({
    type: z.string(),
    url: z.string().url(),
  })),
  is_latest_version: z.boolean(),
  title: z.string(),
  version_id: z.string(),
});
type LatestVersion = z.infer<typeof LatestVersionSchema>;

/**
 * Legislation Work model
 * Matches the actual NZ Legislation API response structure
 */
const WorkSchema = z.object({
  work_id: z.string(),
  legislation_type: z.string(),
  legislation_status: LegislationStatusSchema,
  administering_agencies: z.array(z.string()).optional(),
  latest_matching_version: LatestVersionSchema.optional(),
  // Bill-specific fields
  bill_status: z.string().optional(),
  bill_type: z.string().optional(),
  // Secondary legislation fields
  instrument_classification: z.string().optional(),
  instrument_status: z.string().optional(),
  instrument_type_group: z.string().optional(),
  // Act-specific fields
  act_classification: z.string().optional(),
  act_status: z.string().optional(),
  act_type: z.string().optional(),
  // Common fields
  publisher: z.string().optional(),
});
type Work = z.infer<typeof WorkSchema>;

/**
 * Search results from API
 */
const SearchResultsSchema = z.object({
  results: z.array(WorkSchema),
  page: z.number().optional(),
  per_page: z.number().optional(),
  total: z.number().optional(),
});
type SearchResults = z.infer<typeof SearchResultsSchema>;

// Export all schemas and types
export {
  WorkTypeSchema,
  LegislationStatusSchema,
  DateStringSchema,
  WorkSchema,
  LatestVersionSchema,
  SearchResultsSchema,
};

export type {
  WorkType,
  LegislationStatus,
  Work,
  LatestVersion,
  SearchResults,
};
