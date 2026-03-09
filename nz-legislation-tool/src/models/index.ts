/**
 * Data models for NZ Legislation API
 * Using Zod for runtime validation and type inference
 */

import { z } from 'zod';

// Work type enumeration
export const WorkTypeSchema = z.enum(['act', 'bill', 'regulation', 'instrument']);
export type WorkType = z.infer<typeof WorkTypeSchema>;

// Legislation status enumeration
export const LegislationStatusSchema = z.enum([
  'in-force',
  'not-yet-in-force',
  'repealed',
  'partially-repealed',
  'withdrawn',
]);
export type LegislationStatus = z.infer<typeof LegislationStatusSchema>;

// Date string in YYYY-MM-DD format
const DateStringSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (expected YYYY-MM-DD)');

/**
 * Legislation Work model
 * Represents an Act, Bill, Regulation, or other legislative instrument
 */
export const WorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  type: WorkTypeSchema,
  status: LegislationStatusSchema,
  date: DateStringSchema,
  url: z.string().url(),
  versionCount: z.number().default(0),
});
export type Work = z.infer<typeof WorkSchema>;

/**
 * Version model
 * Represents a specific version of a work
 */
export const VersionSchema = z.object({
  id: z.string(),
  version: z.number(),
  date: DateStringSchema,
  isCurrent: z.boolean().default(false),
  type: z.string(),
  formats: z.array(z.string()),
});
export type Version = z.infer<typeof VersionSchema>;

/**
 * Format information for a version
 */
export const FormatInfoSchema = z.object({
  format: z.string(),
  url: z.string().url(),
  size: z.number().optional(),
});
export type FormatInfo = z.infer<typeof FormatInfoSchema>;

/**
 * Legislation Version with full content
 */
export const LegislationVersionSchema = z.object({
  id: z.string(),
  workId: z.string(),
  title: z.string(),
  version: z.number(),
  date: DateStringSchema,
  isCurrent: z.boolean().default(false),
  content: z.string().optional(),
  formats: z.array(FormatInfoSchema),
});
export type LegislationVersion = z.infer<typeof LegislationVersionSchema>;

/**
 * Pagination links
 */
export const PaginationLinksSchema = z.object({
  next: z.string().url().optional(),
  prev: z.string().url().optional(),
});
export type PaginationLinks = z.infer<typeof PaginationLinksSchema>;

/**
 * Search results from API
 */
export const SearchResultsSchema = z.object({
  total: z.number(),
  offset: z.number().default(0),
  limit: z.number().default(25),
  results: z.array(WorkSchema),
  links: PaginationLinksSchema.optional(),
});
export type SearchResults = z.infer<typeof SearchResultsSchema>;

/**
 * Citation information
 */
export const CitationSchema = z.object({
  workId: z.string(),
  style: z.enum(['nzmj', 'bibtex', 'ris', 'apa']),
  citation: z.string(),
});
export type Citation = z.infer<typeof CitationSchema>;

/**
 * Export metadata for reproducibility
 */
export const ExportMetadataSchema = z.object({
  query: z.string(),
  filters: z.record(z.string(), z.any()).optional(),
  timestamp: z.string().datetime(),
  apiVersion: z.string(),
  totalResults: z.number(),
  exportedCount: z.number(),
});
export type ExportMetadata = z.infer<typeof ExportMetadataSchema>;

// Export all schemas for use in other modules
export {
  WorkTypeSchema,
  LegislationStatusSchema,
  DateStringSchema,
  WorkSchema,
  VersionSchema,
  FormatInfoSchema,
  LegislationVersionSchema,
  PaginationLinksSchema,
  SearchResultsSchema,
  CitationSchema,
  ExportMetadataSchema,
};
