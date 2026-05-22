import { describe, expect, it } from 'vitest';

import {
  COMMONWEALTH_API_BASE_URL,
  mapCommonwealthTitlesToSearchResults,
  mapCommonwealthTitleToWork,
  mapCommonwealthVersionsToVersions,
  type CommonwealthODataResponse,
  type CommonwealthTitle,
  type CommonwealthVersion,
} from '../src/providers/commonwealth.ts';

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

describe('Commonwealth provider mapping', () => {
  it('maps an official Federal Register title shape to the normalized Work contract', () => {
    expect(mapCommonwealthTitleToWork(legislationActTitle)).toEqual({
      id: 'C2004A01224',
      title: 'Legislation Act 2003',
      shortTitle: undefined,
      type: 'act',
      status: 'in-force',
      date: '2003-12-17',
      url: 'https://www.legislation.gov.au/C2004A01224/latest/text',
      versionCount: 0,
    });
  });

  it('maps official OData title collections to SearchResults without placeholder records', () => {
    const response: CommonwealthODataResponse<CommonwealthTitle> = {
      '@odata.context': `${COMMONWEALTH_API_BASE_URL}/$metadata#Titles`,
      '@odata.count': 1,
      value: [legislationActTitle],
    };

    expect(mapCommonwealthTitlesToSearchResults(response, { limit: 25 })).toMatchObject({
      total: 1,
      offset: 0,
      limit: 25,
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

  it('maps official Federal Register version shapes to normalized Version records', () => {
    const response: CommonwealthODataResponse<CommonwealthVersion> = {
      '@odata.context': `${COMMONWEALTH_API_BASE_URL}/$metadata#Versions`,
      value: legislationActVersions,
    };

    expect(mapCommonwealthVersionsToVersions(response)).toEqual([
      {
        id: 'C2004A01224',
        version: 1,
        date: '2005-01-01',
        isCurrent: false,
        type: 'InForce',
        formats: ['https://www.legislation.gov.au/C2004A01224/latest/text'],
      },
      {
        id: 'C2005C00006',
        version: 7,
        date: '2005-01-07',
        isCurrent: false,
        type: 'InForce',
        formats: ['https://www.legislation.gov.au/C2005C00006/latest/text'],
      },
    ]);
  });

  it('maps non-Act Commonwealth collections and statuses conservatively', () => {
    expect(
      mapCommonwealthTitleToWork({
        id: 'F2025L00744',
        name: 'Customs instrument',
        collection: 'LegislativeInstrument',
        status: 'Repealed',
        asMadeRegisteredAt: '2025-06-01T00:00:00',
      })
    ).toMatchObject({
      type: 'regulation',
      status: 'repealed',
      date: '2025-06-01',
    });
  });

  it('fails closed when Commonwealth title dates are missing', () => {
    expect(() =>
      mapCommonwealthTitleToWork({
        id: 'F2025L00744',
        name: 'Customs instrument',
        collection: 'LegislativeInstrument',
        status: 'Repealed',
      })
    ).toThrow('F2025L00744 is missing an authoritative date');
  });

  it('fails closed when Commonwealth version dates are missing', () => {
    const response: CommonwealthODataResponse<CommonwealthVersion> = {
      value: [
        {
          titleId: 'C2004A01224',
          start: '',
          registerId: 'C2004A01224',
        },
      ],
    };

    expect(() => mapCommonwealthVersionsToVersions(response)).toThrow(
      'C2004A01224 is missing an authoritative date'
    );
  });
});
