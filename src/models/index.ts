/**
 * Data models for NZ Legislation API (PCO API v0)
 * Using Zod for runtime validation and type inference
 *
 * These schemas match the actual response format from
 * https://api.legislation.govt.nz/v0/
 */

import { z } from 'zod';

export * from './canonical.js';

// Work type enumeration — maps API values to CLI display values
export const WorkTypeSchema = z.enum(['act', 'bill', 'regulation', 'instrument']);
export type WorkType = z.infer<typeof WorkTypeSchema>;

// Legislation status enumeration — maps API values to CLI display values
export const LegislationStatusSchema = z.enum([
  'in-force',
  'not-yet-in-force',
  'repealed',
  'partially-repealed',
  'withdrawn',
]);
export type LegislationStatus = z.infer<typeof LegislationStatusSchema>;

/**
 * Format entry as returned by the API.
 */
const ApiFormatSchema = z.object({
  type: z.string(),
  url: z.string(),
});

/**
 * Latest matching version as returned in search results.
 */
const LatestMatchingVersionSchema = z.object({
  title: z.string(),
  version_id: z.string(),
  is_latest_version: z.boolean().optional(),
  formats: z.array(ApiFormatSchema).optional(),
});

function extractDateFromVersionId(versionId: string): string {
  const match = versionId.match(/(\d{4}-\d{2}-\d{2})[A-Z]?$/);
  return match ? match[1] : '1900-01-01';
}

function mapLegislationType(apiType: string): WorkType {
  switch (apiType) {
    case 'act':
      return 'act';
    case 'bill':
      return 'bill';
    case 'secondary_legislation':
      return 'regulation';
    default:
      return 'instrument';
  }
}

function mapLegislationStatus(status: string | null | undefined): LegislationStatus {
  if (!status) {
    return 'not-yet-in-force';
  }

  switch (status) {
    case 'in_force':
      return 'in-force';
    case 'not_in_force':
    case 'repealed':
    case 'revoked':
      return 'repealed';
    case 'current':
      return 'not-yet-in-force';
    case 'terminated':
      return 'withdrawn';
    default:
      return 'not-yet-in-force';
  }
}

/**
 * Raw API search result item — loose schema to accept the actual API shape.
 */
const ApiWorkSchema = z
  .object({
    work_id: z.string(),
    legislation_type: z.string(),
    legislation_status: z.string().nullable().optional(),
    publisher: z.string().nullable().optional(),
    administering_agencies: z.array(z.string()).optional(),
    latest_matching_version: LatestMatchingVersionSchema,
    act_type: z.string().optional(),
    act_status: z.string().optional(),
    act_classification: z.string().optional(),
    bill_type: z.string().optional(),
    bill_status: z.string().optional(),
    instrument_type_group: z.string().optional(),
    instrument_status: z.string().optional(),
    instrument_classification: z.string().optional(),
  })
  .passthrough();

/**
 * Legislation Work model — normalized from API response.
 */
export const WorkSchema = ApiWorkSchema.transform(raw => {
  const version = raw.latest_matching_version;
  const htmlFormat = version.formats?.find(format => format.type === 'html');
  const status =
    raw.legislation_status || raw.act_status || raw.bill_status || raw.instrument_status;

  return {
    id: raw.work_id,
    title: version.title,
    shortTitle: undefined as string | undefined,
    type: mapLegislationType(raw.legislation_type),
    status: mapLegislationStatus(status),
    date: extractDateFromVersionId(version.version_id),
    url: htmlFormat?.url || `https://www.legislation.govt.nz/${raw.work_id.replace(/_/g, '/')}/`,
    versionCount: 0,
  };
});
export type Work = z.infer<typeof WorkSchema>;

/**
 * Raw API version item.
 */
const ApiVersionSchema = z
  .object({
    version_id: z.string(),
    work_id: z.string(),
    title: z.string(),
    is_latest_version: z.boolean().optional(),
    legislation_type: z.string().optional(),
    legislation_status: z.string().nullable().optional(),
    act_status: z.string().optional(),
    act_type: z.string().optional(),
    formats: z.array(ApiFormatSchema).optional(),
    administering_agencies: z.array(z.string()).optional(),
  })
  .passthrough();

/**
 * Version item promoted to a normalized work, used when the API does not expose
 * a dedicated single-work endpoint.
 */
export const WorkFromVersionSchema = ApiVersionSchema.transform(raw => {
  const htmlFormat = raw.formats?.find(format => format.type === 'html');
  const status = raw.legislation_status || raw.act_status;

  return {
    id: raw.work_id,
    title: raw.title,
    shortTitle: undefined as string | undefined,
    type: mapLegislationType(raw.legislation_type || 'instrument'),
    status: mapLegislationStatus(status),
    date: extractDateFromVersionId(raw.version_id),
    url: htmlFormat?.url || `https://www.legislation.govt.nz/${raw.work_id.replace(/_/g, '/')}/`,
    versionCount: 0,
  };
});

/**
 * Version model — normalized from API response.
 */
export const VersionSchema = ApiVersionSchema.transform(raw => {
  return {
    id: raw.version_id,
    version: 1,
    date: extractDateFromVersionId(raw.version_id),
    isCurrent: raw.is_latest_version || false,
    type: raw.legislation_type || raw.act_type || 'unknown',
    formats: (raw.formats || []).map(format => format.url),
  };
});
export type Version = z.infer<typeof VersionSchema>;

/**
 * Format information for a version.
 */
export const FormatInfoSchema = z.object({
  format: z.string(),
  url: z.string().url(),
  size: z.number().optional(),
});
export type FormatInfo = z.infer<typeof FormatInfoSchema>;

/**
 * Legislation Version with full content — normalized from API response.
 */
export const LegislationVersionSchema = ApiVersionSchema.transform(raw => {
  return {
    id: raw.version_id,
    workId: raw.work_id,
    title: raw.title,
    version: 1,
    date: extractDateFromVersionId(raw.version_id),
    isCurrent: raw.is_latest_version || false,
    content: undefined as string | undefined,
    formats: (raw.formats || []).map(format => ({ format: format.type, url: format.url })),
  };
});
export type LegislationVersion = z.infer<typeof LegislationVersionSchema>;

/**
 * Pagination links.
 */
export const PaginationLinksSchema = z.object({
  next: z.string().url().optional(),
  prev: z.string().url().optional(),
});
export type PaginationLinks = z.infer<typeof PaginationLinksSchema>;

/**
 * Search results from API — handles the actual PCO API v0 pagination format.
 */
export const SearchResultsSchema = z
  .object({
    total: z.number(),
    page: z.number().optional(),
    per_page: z.number().optional(),
    results: z.array(WorkSchema),
  })
  .transform(raw => ({
    total: raw.total,
    offset: ((raw.page || 1) - 1) * (raw.per_page || 20),
    limit: raw.per_page || 20,
    results: raw.results,
    links: undefined as PaginationLinks | undefined,
  }));
export type SearchResults = z.infer<typeof SearchResultsSchema>;

/**
 * Citation information.
 */
export const CitationSchema = z.object({
  workId: z.string(),
  style: z.enum(['nzmj', 'bibtex', 'ris', 'enw', 'apa']),
  citation: z.string(),
});
export type Citation = z.infer<typeof CitationSchema>;

/**
 * Export metadata for reproducibility.
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
