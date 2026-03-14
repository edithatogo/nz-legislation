import type {
  LegislationStatus,
  SearchResults as LegacySearchResults,
  Version as LegacyVersion,
  Work as LegacyWork,
  WorkType,
} from '../models/index.js';

import { toCanonicalLegislationRecord } from './canonical-metadata.js';
import type {
  SearchResults as ProviderSearchResults,
  VersionSummary,
  Work as ProviderWork,
} from './legislation-provider.js';

interface WorkIdMetadata {
  type: string;
  year: number;
  number: number;
}

const STATUS_MAP: Record<string, LegislationStatus> = {
  'in-force': 'in-force',
  repealed: 'repealed',
  'not-yet-in-force': 'not-yet-in-force',
  'not-in-force': 'not-yet-in-force',
  'partially-repealed': 'partially-repealed',
  withdrawn: 'withdrawn',
};

export function parseWorkIdMetadata(workId: string): WorkIdMetadata {
  const slashMatch = workId.match(/^([a-z-]+)\/(\d{4})\/(\d+)$/i);
  if (slashMatch) {
    return {
      type: slashMatch[1].toLowerCase(),
      year: Number.parseInt(slashMatch[2], 10),
      number: Number.parseInt(slashMatch[3], 10),
    };
  }

  const underscoreMatch = workId.match(/^([a-z-]+)(?:_[a-z0-9-]+)*_(\d{4})_(\d+)$/i);
  if (underscoreMatch) {
    return {
      type: underscoreMatch[1].toLowerCase(),
      year: Number.parseInt(underscoreMatch[2], 10),
      number: Number.parseInt(underscoreMatch[3], 10),
    };
  }

  return {
    type: 'instrument',
    year: 0,
    number: 0,
  };
}

export function normalizeWorkType(type: string): WorkType {
  switch (type) {
    case 'act':
    case 'bill':
    case 'regulation':
    case 'instrument':
      return type;
    case 'secondary_legislation':
      return 'regulation';
    default:
      return 'instrument';
  }
}

export function normalizeStatus(status?: string): LegislationStatus {
  if (!status) {
    return 'in-force';
  }

  return STATUS_MAP[status] ?? 'in-force';
}

function deriveDate(date: string | undefined, year: number): string {
  if (date) {
    return date;
  }

  return year > 0 ? `${year}-01-01` : '1900-01-01';
}

function deriveUrl(jurisdiction: string, workId: string, explicitUrl?: string): string {
  if (explicitUrl) {
    return explicitUrl;
  }

  switch (jurisdiction) {
    case 'nz':
      return `https://www.legislation.govt.nz/${workId.replace(/_/g, '/')}/`;
    case 'au-comm':
      return `https://www.legislation.gov.au/Details/${workId}`;
    case 'au-qld':
      return `https://www.legislation.qld.gov.au/view/html/inforce/current/${workId.replace(/\//g, '-')}`;
    default:
      return workId;
  }
}

export function toLegacySearchResults(results: ProviderSearchResults): LegacySearchResults {
  return {
    total: results.total,
    offset: results.offset,
    limit: results.limit,
    links: undefined,
    results: results.results.map(work =>
      toLegacyWorkFromCanonical(
        toCanonicalLegislationRecord({
          ...work,
          status: work.status ?? 'in-force',
          versions: [],
          citations: {},
        }),
        work
      )
    ),
  };
}

export function toLegacyWork(work: ProviderWork): LegacyWork {
  return toLegacyWorkFromCanonical(toCanonicalLegislationRecord(work), work);
}

export function toLegacyVersions(
  versions: VersionSummary[],
  fallbackType: string = 'instrument'
): LegacyVersion[] {
  return versions.map((version, index) => ({
    id: version.version_id,
    version: version.version ?? index + 1,
    date: version.date,
    isCurrent: version.is_current,
    type: version.type ?? fallbackType,
    formats: version.formats ?? [],
  }));
}

function toLegacyWorkFromCanonical(
  canonical: ReturnType<typeof toCanonicalLegislationRecord>,
  fallback: {
    work_id: string;
    title: string;
    shortTitle?: string;
    type: string;
    status?: string;
    date?: string;
    url?: string;
    year?: number;
    versionCount?: number;
    versions?: VersionSummary[];
    jurisdiction: string;
  }
): LegacyWork {
  const metadata = parseWorkIdMetadata(fallback.work_id);
  const year = fallback.year || metadata.year;
  const currentExpression =
    canonical.expressions.find(expression => expression.isCurrent) ?? canonical.expressions[0];
  const primaryManifestation =
    canonical.manifestations.find(
      manifestation => manifestation.expressionUri === currentExpression?.expressionUri
    ) ?? canonical.manifestations[0];

  return {
    id: fallback.work_id,
    title: canonical.work.title || fallback.title,
    shortTitle: canonical.work.shortTitle || fallback.shortTitle,
    type: normalizeWorkType(canonical.work.documentType || fallback.type || metadata.type),
    status: normalizeStatus(fallback.status),
    date: deriveDate(
      currentExpression?.expressionDate || currentExpression?.publicationDate || fallback.date,
      year
    ),
    url:
      primaryManifestation?.sourceUrl ||
      deriveUrl(fallback.jurisdiction, fallback.work_id, fallback.url),
    versionCount:
      fallback.versionCount ?? fallback.versions?.length ?? canonical.expressions.length,
  };
}
