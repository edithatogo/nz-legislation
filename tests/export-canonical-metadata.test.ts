import { describe, expect, it } from 'vitest';

import { toCanonicalExportRecords } from '../src/commands/export.js';
import type { SearchResults } from '../src/models/index.js';

describe('export canonical metadata', () => {
  it('builds additive canonical records from legacy search results', () => {
    const results: SearchResults = {
      total: 1,
      offset: 0,
      limit: 25,
      results: [
        {
          id: 'act/2020/67',
          title: 'Health Act 2020',
          shortTitle: 'Health Act',
          type: 'act',
          status: 'in-force',
          date: '2020-08-01',
          url: 'https://www.legislation.govt.nz/act/public/2020/0067/latest/LMS12345.html',
          versionCount: 1,
        },
      ],
      links: undefined,
    };

    const canonicalRecords = toCanonicalExportRecords(results);

    expect(canonicalRecords).toHaveLength(1);
    expect(canonicalRecords[0].work.canonicalId).toBe('legacy:act/2020/67');
    expect(canonicalRecords[0].expressions[0].lifecycleState).toBe('in-force');
    expect(canonicalRecords[0].manifestations[0].sourceUrl).toBe(results.results[0].url);
    expect(canonicalRecords[0].relationships.map(r => r.relationshipType)).toEqual([
      'has_expression',
      'has_manifestation',
    ]);
  });
});
