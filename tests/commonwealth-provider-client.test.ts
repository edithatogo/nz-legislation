import { describe, expect, it } from 'vitest';

import {
  buildCommonwealthTitleSearchParams,
  createCommonwealthProviderClient,
  type CommonwealthHttpClientLike,
  type CommonwealthODataResponse,
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

describe('Commonwealth provider client', () => {
  it('builds conservative Federal Register title search params', () => {
    expect(
      buildCommonwealthTitleSearchParams({
        query: "Legislation's Act",
        type: 'act',
        status: 'in-force',
        limit: 10,
        offset: 20,
      })
    ).toEqual({
      $count: 'true',
      $top: '10',
      $skip: '20',
      $filter:
        "contains(tolower(name), 'legislation''s act') and collection eq 'Act' and status eq 'InForce'",
    });
  });

  it('searches titles through the injected HTTP client and maps official responses', async () => {
    const response: CommonwealthODataResponse<CommonwealthTitle> = {
      '@odata.count': 1,
      value: [legislationActTitle],
    };
    const { client, calls } = createMockHttpClient({ titles: response });

    const results = await createCommonwealthProviderClient(client).searchTitles({
      query: 'Legislation Act',
      limit: 5,
      offset: 0,
    });

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
    ]);
    expect(results).toMatchObject({
      total: 1,
      limit: 5,
      results: [{ id: 'C2004A01224', title: 'Legislation Act 2003', type: 'act' }],
    });
  });

  it('retrieves one title by registered title id', async () => {
    const response: CommonwealthODataResponse<CommonwealthTitle> = {
      value: [legislationActTitle],
    };
    const { client, calls } = createMockHttpClient({ titles: response });

    const work = await createCommonwealthProviderClient(client).getTitle('C2004A01224');

    expect(calls).toEqual([
      {
        path: 'titles',
        searchParams: { $filter: "id eq 'C2004A01224'", $top: '1' },
      },
    ]);
    expect(work).toMatchObject({
      id: 'C2004A01224',
      title: 'Legislation Act 2003',
      status: 'in-force',
    });
  });

  it('retrieves versions for a registered title id', async () => {
    const response: CommonwealthODataResponse<CommonwealthVersion> = {
      value: legislationActVersions,
    };
    const { client, calls } = createMockHttpClient({ versions: response });

    const versions = await createCommonwealthProviderClient(client).getVersions('C2004A01224');

    expect(calls).toEqual([
      {
        path: 'versions',
        searchParams: { $filter: "titleId eq 'C2004A01224'" },
      },
    ]);
    expect(versions.map(version => version.id)).toEqual(['C2004A01224', 'C2005C00006']);
  });

  it('fails closed on invalid or empty Federal Register responses', async () => {
    const invalid = createCommonwealthProviderClient(createMockHttpClient({ titles: {} }).client);
    const empty = createCommonwealthProviderClient(
      createMockHttpClient({ titles: { value: [] } }).client
    );

    await expect(invalid.searchTitles({})).rejects.toThrow('Invalid Commonwealth titles response');
    await expect(empty.getTitle('C00000000000')).rejects.toThrow(
      'Commonwealth title not found: C00000000000'
    );
  });
});
