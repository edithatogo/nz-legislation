import { afterEach, describe, expect, it } from 'vitest';

import {
  getLegislation,
  getLegislationVersions,
  searchLegislation,
  SUPPORTED_JURISDICTIONS,
} from '../src/providers/index.js';
import { setCommonwealthHttpClientFactoryForTesting } from '../src/providers/commonwealth.js';

afterEach(() => {
  setCommonwealthHttpClientFactoryForTesting();
});

describe('provider routing', () => {
  it('exposes the planned jurisdiction list', () => {
    expect(SUPPORTED_JURISDICTIONS).toEqual(['nz', 'au-comm', 'au-qld']);
  });

  it('searches Commonwealth legislation through the provider seam', async () => {
    setCommonwealthHttpClientFactoryForTesting(() => ({
      get: () => ({
        json: async () => ({
          '@odata.count': 1,
          value: [
            {
              id: 'C2004A01224',
              name: 'Legislation Act 2003',
              makingDate: '2003-12-17T00:00:00',
              collection: 'Act',
              status: 'InForce',
              isInForce: true,
              seriesType: 'Act',
            },
          ],
        }),
      }),
    }));

    await expect(
      searchLegislation({ jurisdiction: 'au-comm', query: 'legislation' })
    ).resolves.toMatchObject({
      total: 1,
      results: [
        {
          id: 'C2004A01224',
          title: 'Legislation Act 2003',
          type: 'act',
          status: 'in-force',
        },
      ],
    });
  });

  it('retrieves a Commonwealth title through the provider seam', async () => {
    setCommonwealthHttpClientFactoryForTesting(() => ({
      get: () => ({
        json: async () => ({
          id: 'C2004A01224',
          name: 'Legislation Act 2003',
          makingDate: '2003-12-17T00:00:00',
          collection: 'Act',
          status: 'InForce',
          isInForce: true,
          seriesType: 'Act',
        }),
      }),
    }));

    await expect(
      getLegislation({ jurisdiction: 'au-comm', workId: 'C2004A01224' })
    ).resolves.toMatchObject({
      id: 'C2004A01224',
      title: 'Legislation Act 2003',
      type: 'act',
      status: 'in-force',
    });
  });

  it('rejects unimplemented Queensland retrieval explicitly', async () => {
    await expect(
      getLegislation({ jurisdiction: 'au-qld', workId: 'act/2006/60' })
    ).rejects.toThrow("Jurisdiction 'au-qld' is not implemented in this branch yet.");
  });

  it('retrieves Commonwealth version history through the document feed', async () => {
    setCommonwealthHttpClientFactoryForTesting(() => ({
      get: () => ({
        json: async () => ({
          value: [
            {
              titleId: 'C2004A01224',
              start: '2005-01-01T00:00:00',
              retrospectiveStart: '2005-01-01T00:00:00',
              rectificationVersionNumber: 0,
              type: 'Primary',
              uniqueTypeNumber: 0,
              volumeNumber: 0,
              format: 'Word',
              compilationNumber: '7',
              registerId: 'C2005C00006',
            },
            {
              titleId: 'C2004A01224',
              start: '2005-01-01T00:00:00',
              retrospectiveStart: '2005-01-01T00:00:00',
              rectificationVersionNumber: 1,
              type: 'Primary',
              uniqueTypeNumber: 0,
              volumeNumber: 0,
              format: 'Pdf',
              compilationNumber: '7',
              registerId: 'C2005C00006',
            },
            {
              titleId: 'C2004A01224',
              start: '2003-12-17T00:00:00',
              retrospectiveStart: '2003-12-17T00:00:00',
              rectificationVersionNumber: 0,
              type: 'Primary',
              uniqueTypeNumber: 0,
              volumeNumber: 0,
              format: 'Word',
              compilationNumber: '0',
              registerId: 'C2004A01224',
            },
          ],
        }),
      }),
    }));

    await expect(
      getLegislationVersions({ jurisdiction: 'au-comm', workId: 'C2004A01224' })
    ).resolves.toMatchObject([
      {
        id: 'C2005C00006',
        version: 7,
        date: '2005-01-01',
        isCurrent: true,
        type: 'Primary',
        formats: [
          "https://api.prod.legislation.gov.au/v1/documents(titleid='C2004A01224',start=2005-01-01,retrospectivestart=2005-01-01,rectificationversionnumber=1,type='Primary',uniqueTypeNumber=0,volumeNumber=0,format='Pdf')",
        ],
      },
      {
        id: 'C2004A01224',
        version: 0,
        date: '2003-12-17',
        isCurrent: false,
        type: 'Primary',
      },
    ]);
  });

  it('rejects unimplemented Queensland versions explicitly', async () => {
    await expect(
      getLegislationVersions({ jurisdiction: 'au-qld', workId: 'act/2006/60' })
    ).rejects.toThrow("Jurisdiction 'au-qld' is not implemented in this branch yet.");
  });
});
