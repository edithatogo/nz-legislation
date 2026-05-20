import type { LegislationStatus, SearchResults, Version, Work, WorkType } from '../models/index.js';

export const COMMONWEALTH_API_BASE_URL = 'https://api.prod.legislation.gov.au/v1';
export const COMMONWEALTH_REGISTER_BASE_URL = 'https://www.legislation.gov.au';

export interface CommonwealthODataResponse<T> {
  '@odata.context'?: string;
  '@odata.count'?: number;
  value: T[];
}

export interface CommonwealthTitle {
  id: string;
  name: string;
  makingDate?: string | null;
  collection: string;
  isPrincipal?: boolean;
  isInForce?: boolean;
  status?: string | null;
  asMadeRegisteredAt?: string | null;
  year?: number | null;
  number?: number | null;
  seriesType?: string | null;
  versions?: CommonwealthVersion[] | null;
}

export interface CommonwealthVersion {
  titleId: string;
  start: string;
  retrospectiveStart?: string | null;
  end?: string | null;
  isCurrent?: boolean;
  isLatest?: boolean;
  name?: string | null;
  status?: string | null;
  registerId?: string | null;
  registeredAt?: string | null;
  compilationNumber?: string | null;
}

function toDateOnly(value?: string | null): string {
  if (!value) {
    return '1900-01-01';
  }

  return value.slice(0, 10);
}

function mapCollectionToWorkType(collection: string): WorkType {
  switch (collection) {
    case 'Act':
    case 'Constitution':
    case 'ContinuedLaw':
      return 'act';
    case 'LegislativeInstrument':
      return 'regulation';
    case 'NotifiableInstrument':
    case 'AdministrativeArrangementsOrder':
    case 'Gazette':
    case 'PrerogativeInstrument':
    default:
      return 'instrument';
  }
}

function mapStatus(status?: string | null, isInForce?: boolean): LegislationStatus {
  if (status === 'InForce' || isInForce) {
    return 'in-force';
  }

  switch (status) {
    case 'Repealed':
    case 'Ceased':
      return 'repealed';
    case 'NeverEffective':
      return 'withdrawn';
    default:
      return 'not-yet-in-force';
  }
}

function titleUrl(titleId: string): string {
  return `${COMMONWEALTH_REGISTER_BASE_URL}/${titleId}/latest/text`;
}

function versionUrl(version: CommonwealthVersion): string {
  const registerId = version.registerId || version.titleId;
  return `${COMMONWEALTH_REGISTER_BASE_URL}/${registerId}/latest/text`;
}

export function mapCommonwealthTitleToWork(title: CommonwealthTitle): Work {
  return {
    id: title.id,
    title: title.name,
    shortTitle: undefined,
    type: mapCollectionToWorkType(title.collection),
    status: mapStatus(title.status, title.isInForce),
    date: toDateOnly(title.makingDate || title.asMadeRegisteredAt),
    url: titleUrl(title.id),
    versionCount: title.versions?.length ?? 0,
  };
}

export function mapCommonwealthTitlesToSearchResults(
  response: CommonwealthODataResponse<CommonwealthTitle>,
  options: { offset?: number; limit?: number } = {}
): SearchResults {
  const limit = options.limit ?? response.value.length;

  return {
    total: response['@odata.count'] ?? response.value.length,
    offset: options.offset ?? 0,
    limit,
    results: response.value.map(mapCommonwealthTitleToWork),
    links: undefined,
  };
}

export function mapCommonwealthVersionToVersion(
  version: CommonwealthVersion,
  index: number = 0
): Version {
  const compilationNumber = Number.parseInt(version.compilationNumber || '', 10);

  return {
    id: version.registerId || `${version.titleId}:${toDateOnly(version.start)}`,
    version:
      Number.isFinite(compilationNumber) && compilationNumber > 0 ? compilationNumber : index + 1,
    date: toDateOnly(version.registeredAt || version.start),
    isCurrent: Boolean(version.isCurrent || version.isLatest),
    type: version.status || 'unknown',
    formats: [versionUrl(version)],
  };
}

export function mapCommonwealthVersionsToVersions(
  response: CommonwealthODataResponse<CommonwealthVersion>
): Version[] {
  return response.value.map((version, index) => mapCommonwealthVersionToVersion(version, index));
}
