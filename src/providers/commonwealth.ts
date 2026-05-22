import got from 'got';

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

export interface CommonwealthHttpResponseLike {
  json(): Promise<unknown>;
}

export interface CommonwealthHttpClientLike {
  get(
    path: string,
    options?: { searchParams?: Record<string, string> }
  ): CommonwealthHttpResponseLike;
}

export interface CommonwealthSearchParams {
  query?: string;
  type?: WorkType;
  status?: LegislationStatus;
  limit?: number;
  offset?: number;
}

export interface CommonwealthProviderClient {
  searchTitles(params: CommonwealthSearchParams): Promise<SearchResults>;
  getTitle(titleId: string): Promise<Work>;
  getVersions(titleId: string): Promise<Version[]>;
}

export interface CommonwealthProviderSource {
  jurisdiction: 'au-commonwealth';
  providerId: 'federal-register-of-legislation';
  sourceAuthority: 'Federal Register of Legislation public API';
  apiBaseUrl: typeof COMMONWEALTH_API_BASE_URL;
  registerBaseUrl: typeof COMMONWEALTH_REGISTER_BASE_URL;
  runtimeEnabled: boolean;
}

export interface CommonwealthProviderAdapter {
  readonly source: CommonwealthProviderSource;
  searchWorks(params: CommonwealthSearchParams): Promise<SearchResults>;
  getWork(workId: string): Promise<Work>;
  getWorkVersions(workId: string): Promise<Version[]>;
}

export interface CommonwealthProviderAdapterDependencies {
  providerClient?: CommonwealthProviderClient;
  httpClient?: CommonwealthHttpClientLike;
}

export const commonwealthProviderSource: CommonwealthProviderSource = {
  jurisdiction: 'au-commonwealth',
  providerId: 'federal-register-of-legislation',
  sourceAuthority: 'Federal Register of Legislation public API',
  apiBaseUrl: COMMONWEALTH_API_BASE_URL,
  registerBaseUrl: COMMONWEALTH_REGISTER_BASE_URL,
  runtimeEnabled: true,
};

export function createCommonwealthHttpClient(): CommonwealthHttpClientLike {
  return got.extend({
    prefixUrl: COMMONWEALTH_API_BASE_URL,
    timeout: { request: 30000 },
    headers: {
      Accept: 'application/json',
      'User-Agent': 'nz-legislation-tool/1.0.0 prerelease-commonwealth-provider',
    },
    retry: {
      limit: 2,
      methods: ['get'],
      statusCodes: [408, 429, 500, 502, 503, 504],
    },
  });
}

function toDateOnly(value?: string | null): string {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new Error('Commonwealth provider record is missing an authoritative date');
  }

  return trimmed.slice(0, 10);
}

function requireDateOnly(value: string | null | undefined, recordId: string): string {
  try {
    return toDateOnly(value);
  } catch (error) {
    throw new Error(`Commonwealth provider record ${recordId} is missing an authoritative date`, {
      cause: error,
    });
  }
}

function clampInteger(
  value: number | undefined,
  fallback: number,
  min: number,
  max: number
): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    return fallback;
  }

  return Math.min(max, Math.max(min, Math.trunc(value)));
}

function getCommonwealthPagination(params: CommonwealthSearchParams): {
  limit: number;
  offset: number;
} {
  return {
    limit: clampInteger(params.limit, 20, 1, 1000),
    offset: clampInteger(params.offset, 0, 0, 1000000),
  };
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

function assertODataResponse<T>(data: unknown, endpoint: string): CommonwealthODataResponse<T> {
  if (!data || typeof data !== 'object' || !Array.isArray((data as { value?: unknown }).value)) {
    throw new Error(`Invalid Commonwealth ${endpoint} response: expected an OData value array`);
  }

  return data as CommonwealthODataResponse<T>;
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''");
}

function odataString(value: string): string {
  return `'${escapeODataString(value)}'`;
}

function mapWorkTypeToCollection(type?: WorkType): string | undefined {
  switch (type) {
    case 'act':
      return 'Act';
    case 'regulation':
      return 'LegislativeInstrument';
    case 'instrument':
      return 'NotifiableInstrument';
    case 'bill':
    default:
      return undefined;
  }
}

function mapLegislationStatusToCommonwealthStatus(status?: LegislationStatus): string | undefined {
  switch (status) {
    case 'in-force':
      return 'InForce';
    case 'repealed':
    case 'partially-repealed':
      return 'Repealed';
    case 'withdrawn':
      return 'NeverEffective';
    case 'not-yet-in-force':
    default:
      return undefined;
  }
}

function buildTitleFilter(params: CommonwealthSearchParams): string | undefined {
  const filters: string[] = [];

  if (params.query?.trim()) {
    filters.push(`contains(tolower(name), ${odataString(params.query.trim().toLowerCase())})`);
  }

  const collection = mapWorkTypeToCollection(params.type);
  if (collection) {
    filters.push(`collection eq ${odataString(collection)}`);
  }

  const status = mapLegislationStatusToCommonwealthStatus(params.status);
  if (status) {
    filters.push(`status eq ${odataString(status)}`);
  }

  return filters.length > 0 ? filters.join(' and ') : undefined;
}

export function buildCommonwealthTitleSearchParams(
  params: CommonwealthSearchParams
): Record<string, string> {
  const { limit, offset } = getCommonwealthPagination(params);
  const searchParams: Record<string, string> = {
    $count: 'true',
    $top: String(limit),
    $skip: String(offset),
  };
  const filter = buildTitleFilter(params);

  if (filter) {
    searchParams.$filter = filter;
  }

  return searchParams;
}

export function mapCommonwealthTitleToWork(title: CommonwealthTitle): Work {
  return {
    id: title.id,
    title: title.name,
    shortTitle: undefined,
    type: mapCollectionToWorkType(title.collection),
    status: mapStatus(title.status, title.isInForce),
    date: requireDateOnly(title.makingDate || title.asMadeRegisteredAt, title.id),
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
  const date = requireDateOnly(
    version.registeredAt || version.start,
    version.registerId || version.titleId
  );

  return {
    id: version.registerId || `${version.titleId}:${date}`,
    version:
      Number.isFinite(compilationNumber) && compilationNumber > 0 ? compilationNumber : index + 1,
    date,
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

export function createCommonwealthProviderClient(
  httpClient: CommonwealthHttpClientLike
): CommonwealthProviderClient {
  return {
    async searchTitles(params: CommonwealthSearchParams): Promise<SearchResults> {
      const pagination = getCommonwealthPagination(params);
      const searchParams = buildCommonwealthTitleSearchParams(params);
      const data = await httpClient.get('titles', { searchParams }).json();
      const response = assertODataResponse<CommonwealthTitle>(data, 'titles');

      return mapCommonwealthTitlesToSearchResults(response, {
        offset: pagination.offset,
        limit: pagination.limit,
      });
    },

    async getTitle(titleId: string): Promise<Work> {
      const data = await httpClient
        .get('titles', {
          searchParams: {
            $filter: `id eq ${odataString(titleId)}`,
            $top: '1',
          },
        })
        .json();
      const response = assertODataResponse<CommonwealthTitle>(data, 'titles');
      const title = response.value[0];

      if (!title) {
        throw new Error(`Commonwealth title not found: ${titleId}`);
      }

      return mapCommonwealthTitleToWork(title);
    },

    async getVersions(titleId: string): Promise<Version[]> {
      const data = await httpClient
        .get('versions', {
          searchParams: {
            $filter: `titleId eq ${odataString(titleId)}`,
          },
        })
        .json();
      const response = assertODataResponse<CommonwealthVersion>(data, 'versions');

      return mapCommonwealthVersionsToVersions(response);
    },
  };
}

export function createCommonwealthProviderAdapter(
  dependencies: CommonwealthProviderAdapterDependencies = {}
): CommonwealthProviderAdapter {
  const providerClient =
    dependencies.providerClient ??
    createCommonwealthProviderClient(dependencies.httpClient ?? createCommonwealthHttpClient());

  return {
    source: commonwealthProviderSource,

    searchWorks(params: CommonwealthSearchParams): Promise<SearchResults> {
      return providerClient.searchTitles(params);
    },

    getWork(workId: string): Promise<Work> {
      return providerClient.getTitle(workId);
    },

    getWorkVersions(workId: string): Promise<Version[]> {
      return providerClient.getVersions(workId);
    },
  };
}
