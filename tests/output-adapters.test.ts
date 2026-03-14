import { describe, expect, it } from 'vitest';

import { toLegacySearchResults, toLegacyWork } from '../src/providers/output-adapters.js';
import type { SearchResults, Work } from '../src/providers/legislation-provider.js';

describe('output adapters', () => {
  it('adapts a provider work through the canonical layer without changing legacy shape', () => {
    const work: Work = {
      work_id: 'act/2020/67',
      title: 'Health Act 2020',
      shortTitle: 'Health Act',
      type: 'act',
      year: 2020,
      number: 67,
      jurisdiction: 'nz',
      status: 'in-force',
      date: '2020-08-01',
      url: 'https://www.legislation.govt.nz/act/public/2020/0067/latest/LMS12345.html',
      versionCount: 1,
      versions: [
        {
          version_id: 'act/2020/67/2021-05-01',
          title: 'latest',
          date: '2021-05-01',
          is_current: true,
          formats: ['html'],
        },
      ],
      citations: {
        nzmj: 'Health Act 2020 (NZ)',
      },
    };

    const legacy = toLegacyWork(work);

    expect(legacy).toEqual({
      id: 'act/2020/67',
      title: 'Health Act 2020',
      shortTitle: 'Health Act',
      type: 'act',
      status: 'in-force',
      date: '2021-05-01',
      url: 'https://www.legislation.govt.nz/act/public/2020/0067/latest/LMS12345.html',
      versionCount: 1,
    });
  });

  it('adapts provider search summaries through the canonical layer without requiring versions', () => {
    const results: SearchResults = {
      total: 1,
      offset: 0,
      limit: 25,
      results: [
        {
          work_id: 'act/2021/5',
          title: 'Act 2021 (Qld)',
          type: 'act',
          year: 2021,
          number: 5,
          jurisdiction: 'au-qld',
          status: 'in-force',
          date: '2021-01-01',
          url: 'https://www.legislation.qld.gov.au/view/html/inforce/current/act-2021-5',
          versionCount: 1,
        },
      ],
    };

    const legacy = toLegacySearchResults(results);

    expect(legacy.results[0]).toEqual({
      id: 'act/2021/5',
      title: 'Act 2021 (Qld)',
      shortTitle: undefined,
      type: 'act',
      status: 'in-force',
      date: '2021-01-01',
      url: 'https://www.legislation.qld.gov.au/view/html/inforce/current/act-2021-5',
      versionCount: 1,
    });
  });
});
