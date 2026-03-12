import got from 'got';

import { createApiError, ErrorCode, NetworkError } from '../errors.js';
import type { SearchResults, Version, Work, WorkType, LegislationStatus } from '../models/index.js';

const COMMONWEALTH_API_BASE_URL = 'https://api.prod.legislation.gov.au/v1/';
const COMMONWEALTH_WEB_BASE_URL = 'https://www.legislation.gov.au/';

interface CommonwealthTitle {
  id: string;
  name: string;
  makingDate?: string;
  collection?: string;
  subCollection?: string | null;
  isPrincipal?: boolean;
  isInForce?: boolean;
  status?: string;
  year?: number;
  number?: number;
  seriesType?: string;
}

interface CommonwealthTitleListResponse {
  value: CommonwealthTitle[];
  '@odata.count'?: number;
}

interface HttpResponseLike {
  json(): Promise<unknown>;
}

interface HttpClientLike {
  get(url: string, options?: Record<string, unknown>): HttpResponseLike;
}

type HttpClientFactory = () => HttpClientLike;

function mapCommonwealthType(title: CommonwealthTitle): WorkType {
  const value = `${title.collection || ''} ${title.seriesType || ''}`.toLowerCase();

  if (value.includes('act')) {
    return 'act';
  }

  if (value.includes('bill')) {
    return 'bill';
  }

  if (value.includes('regulation') || value.includes('legislative instrument')) {
    return 'regulation';
  }

  return 'instrument';
}

function mapCommonwealthStatus(title: CommonwealthTitle): LegislationStatus {
  const status = (title.status || '').toLowerCase();

  if (title.isInForce || status === 'inforce') {
    return 'in-force';
  }

  if (status.includes('repeal') || status.includes('revoke')) {
    return 'repealed';
  }

  if (status.includes('withdraw')) {
    return 'withdrawn';
  }

  if (status.includes('partial')) {
    return 'partially-repealed';
  }

  return 'not-yet-in-force';
}

function mapCommonwealthTitle(title: CommonwealthTitle): Work {
  return {
    id: title.id,
    title: title.name,
    shortTitle: undefined,
    type: mapCommonwealthType(title),
    status: mapCommonwealthStatus(title),
    date: title.makingDate?.slice(0, 10) || '1900-01-01',
    url: `${COMMONWEALTH_WEB_BASE_URL}${title.id}`,
    versionCount: 0,
  };
}

function escapeODataString(value: string): string {
  return value.replace(/'/g, "''").toLowerCase();
}

function createCommonwealthClient(): HttpClientLike {
  return got.extend({
    prefixUrl: COMMONWEALTH_API_BASE_URL,
    timeout: { request: 30000 },
    headers: {
      Accept: 'application/json',
      'User-Agent': 'nz-legislation-tool/1.2.0',
    },
  });
}

let httpClientFactory: HttpClientFactory = createCommonwealthClient;

export function setCommonwealthHttpClientFactoryForTesting(factory?: HttpClientFactory): void {
  httpClientFactory = factory || createCommonwealthClient;
}

function handleCommonwealthError(error: unknown, context: string): never {
  if (error instanceof NetworkError) {
    throw error;
  }

  if (error instanceof Error && 'response' in error) {
    const apiError = error as { response?: { statusCode?: number; url?: string } };

    if (apiError.response) {
      throw createApiError(
        apiError.response.statusCode || 500,
        apiError.response.url || COMMONWEALTH_API_BASE_URL,
        `${context}: ${error.message}`
      );
    }
  }

  if (error instanceof Error) {
    throw new NetworkError(ErrorCode.NETWORK_CONNECTION_REFUSED, `${context}: ${error.message}`, {
      url: COMMONWEALTH_API_BASE_URL,
    });
  }

  throw new Error(`${context}: Unknown Commonwealth API error`);
}

export async function searchCommonwealthLegislation(params: {
  query?: string;
  limit?: number;
  offset?: number;
}): Promise<SearchResults> {
  const client = httpClientFactory();
  const limit = params.limit ?? 20;
  const offset = params.offset ?? 0;
  const query = (params.query || '').trim();

  try {
    const data = (await client
      .get('Titles', {
        searchParams: {
          $filter: query ? `contains(tolower(name),'${escapeODataString(query)}')` : undefined,
          $top: limit.toString(),
          $skip: offset.toString(),
          $count: 'true',
        },
      })
      .json()) as CommonwealthTitleListResponse;

    const items = data.value || [];

    return {
      total: data['@odata.count'] ?? items.length,
      offset,
      limit,
      results: items.map(mapCommonwealthTitle),
      links: undefined,
    };
  } catch (error) {
    handleCommonwealthError(error, 'Commonwealth search failed');
  }
}

export async function getCommonwealthLegislation(workId: string): Promise<Work> {
  const client = httpClientFactory();

  try {
    const data = (await client.get(`Titles('${workId}')`).json()) as CommonwealthTitle;
    return mapCommonwealthTitle(data);
  } catch (error) {
    handleCommonwealthError(error, `Failed to get Commonwealth title ${workId}`);
  }
}

export function getCommonwealthLegislationVersions(_workId: string): Promise<Version[]> {
  return Promise.reject(
    new Error(
      "Jurisdiction 'au-comm' does not expose version history in this branch yet. Search and title retrieval are supported."
    )
  );
}
