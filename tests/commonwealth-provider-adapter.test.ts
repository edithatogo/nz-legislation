import { describe, expect, it } from 'vitest';

import { getUnsupportedProviderCapability } from '../src/providers/capability-manifest.ts';
import {
  commonwealthProviderSource,
  createCommonwealthProviderAdapter,
  type CommonwealthHttpClientLike,
  type CommonwealthODataResponse,
  type CommonwealthProviderClient,
  type CommonwealthTitle,
  type CommonwealthVersion,
} from '../src/providers/commonwealth.ts';

interface RecordedCall {
  path: string;
  searchParams?: Record<string, string>;
}

const legislationActTitle: CommonwealthTitle = {
  id: 'C2004A01224',
  name: 'Legislation Act 2003',
  makingDate: '2003-12-17T00:00:00',
  collection: 'Act',
  isPrincipal: true,
  isInForce: true,
  status: 'InForce',
  asMadeRegisteredAt: '2005-01-01T00:00:00',
  year: 2003,
  number: 139,
  seriesType: 'Act',
};

const legislationActVersions: CommonwealthVersion[] = [
  {
    titleId: 'C2004A01224',
    start: '2003-12-17T00:00:00',
    retrospectiveStart: '2003-12-17T00:00:00',
    end: '2005-01-01T00:00:00',
    isCurrent: false,
    isLatest: false,
    name: 'Legislative Instruments Act 2003',
    status: 'InForce',
    registerId: 'C2004A01224',
    registeredAt: '2005-01-01T00:00:00',
    compilationNumber: '0',
  },
  {
    titleId: 'C2004A01224',
    start: '2005-01-01T00:00:00',
    retrospectiveStart: '2005-01-01T00:00:00',
    end: '2006-03-27T00:00:00',
    isCurrent: false,
    isLatest: false,
    name: 'Legislative Instruments Act 2003',
    status: 'InForce',
    registerId: 'C2005C00006',
    registeredAt: '2005-01-07T08:59:50',
    compilationNumber: '7',
  },
];

function createMockHttpClient(responses: Record<string, unknown>): {
  client: CommonwealthHttpClientLike;
  calls: RecordedCall[];
} {
  const calls: RecordedCall[] = [];

  return {
    calls,
    client: {
      get(path, options) {
        calls.push({ path, searchParams: options?.searchParams });

        return {
          async json() {
            return responses[path];
          },
        };
      },
    },
  };
}

describe('Commonwealth provider adapter', () => {
  it('declares source metadata for prerelease Australian runtime support', () => {
    const unsupportedSearch = getUnsupportedProviderCapability('au-commonwealth', 'search');

    expect(commonwealthProviderSource).toEqual({
      jurisdiction: 'au-commonwealth',
      providerId: 'federal-register-of-legislation',
      sourceAuthority: 'Federal Register of Legislation public API',
      apiBaseUrl: 'https://api.prod.legislation.gov.au/v1',
      registerBaseUrl: 'https://www.legislation.gov.au',
      runtimeEnabled: true,
    });
    expect(unsupportedSearch).toBeNull();
  });

  it('uses the existing Commonwealth client for search, title, and versions lookups', async () => {
    const titlesResponse: CommonwealthODataResponse<CommonwealthTitle> = {
      '@odata.count': 1,
      value: [legislationActTitle],
    };
    const versionsResponse: CommonwealthODataResponse<CommonwealthVersion> = {
      value: legislationActVersions,
    };
    const { client, calls } = createMockHttpClient({
      titles: titlesResponse,
      versions: versionsResponse,
    });

    const adapter = createCommonwealthProviderAdapter({ httpClient: client });

    expect(adapter.source).toBe(commonwealthProviderSource);

    const results = await adapter.searchWorks({
      query: 'Legislation Act',
      limit: 5,
      offset: 0,
    });
    const title = await adapter.getWork('C2004A01224');
    const versions = await adapter.getWorkVersions('C2004A01224');

    expect(calls).toEqual([
      {
        path: 'titles',
        searchParams: {
          $count: 'true',
          $top: '5',
          $skip: '0',
          $filter: "contains(tolower(name), 'legislation act')",
        },
      },
      {
        path: 'titles',
        searchParams: { $filter: "id eq 'C2004A01224'", $top: '1' },
      },
      {
        path: 'versions',
        searchParams: { $filter: "titleId eq 'C2004A01224'" },
      },
    ]);

    expect(results).toMatchObject({
      total: 1,
      limit: 5,
      results: [{ id: 'C2004A01224', title: 'Legislation Act 2003', type: 'act' }],
    });
    expect(title).toMatchObject({
      id: 'C2004A01224',
      title: 'Legislation Act 2003',
      status: 'in-force',
    });
    expect(versions.map(version => version.id)).toEqual(['C2004A01224', 'C2005C00006']);
  });

  it('can wrap an injected provider client without creating a new HTTP client', async () => {
    const calls: Array<{ method: string; value: string }> = [];
    const providerClient: CommonwealthProviderClient = {
      async searchTitles(params) {
        calls.push({ method: 'searchTitles', value: params.query ?? '' });

        return {
          total: 0,
          offset: 0,
          limit: 20,
          results: [],
          links: undefined,
        };
      },
      async getTitle(titleId) {
        calls.push({ method: 'getTitle', value: titleId });

        return {
          id: titleId,
          title: 'Injected title',
          shortTitle: undefined,
          type: 'act',
          status: 'in-force',
          date: '2003-12-17',
          url: 'https://www.legislation.gov.au/C2004A01224/latest/text',
          versionCount: 0,
        };
      },
      async getVersions(titleId) {
        calls.push({ method: 'getVersions', value: titleId });

        return [];
      },
    };

    const adapter = createCommonwealthProviderAdapter({ providerClient });

    expect(adapter.source.runtimeEnabled).toBe(true);

    await expect(adapter.searchWorks({ query: 'Legislation Act' })).resolves.toMatchObject({
      results: [],
    });
    await expect(adapter.getWork('C2004A01224')).resolves.toMatchObject({
      id: 'C2004A01224',
      title: 'Injected title',
    });
    await expect(adapter.getWorkVersions('C2004A01224')).resolves.toEqual([]);

    expect(calls).toEqual([
      { method: 'searchTitles', value: 'Legislation Act' },
      { method: 'getTitle', value: 'C2004A01224' },
      { method: 'getVersions', value: 'C2004A01224' },
    ]);
  });

  it('creates a default HTTP-backed adapter when no client dependency is provided', () => {
    expect(createCommonwealthProviderAdapter().source).toBe(commonwealthProviderSource);
  });
});
