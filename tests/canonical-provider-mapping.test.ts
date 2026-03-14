import { describe, expect, it } from 'vitest';

import { toCanonicalLegislationRecord } from '../src/providers/canonical-metadata.js';
import type { Work } from '../src/providers/legislation-provider.js';

describe('canonical provider mapping', () => {
  it('maps a versioned NZ work into canonical work, expressions, manifestations, and relationships', () => {
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
      versionCount: 2,
      versions: [
        {
          version_id: 'act/2020/67/2020-08-01',
          title: 'as enacted',
          date: '2020-08-01',
          is_current: false,
          version: 1,
          formats: ['html', 'pdf'],
        },
        {
          version_id: 'act/2020/67/2021-05-01',
          title: 'latest',
          date: '2021-05-01',
          is_current: true,
          version: 2,
          formats: ['html'],
        },
      ],
      citations: {
        nzmj: 'Health Act 2020 (NZ)',
      },
    };

    const record = toCanonicalLegislationRecord(work);

    expect(record.work.source.sourceSystem).toBe('nz-legislation-api');
    expect(record.work.canonicalId).toBe('nz:act/2020/67');
    expect(record.expressions).toHaveLength(2);
    expect(record.manifestations).toHaveLength(3);
    expect(
      record.relationships.filter(
        relationship => relationship.relationshipType === 'has_expression'
      )
    ).toHaveLength(2);
    expect(record.citations?.preferred).toBe('Health Act 2020 (NZ)');
  });

  it('creates a fallback current expression when a provider has no versions yet', () => {
    const work: Work = {
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
      versions: [],
      citations: {
        australian: 'Act 2021 (Qld)',
      },
    };

    const record = toCanonicalLegislationRecord(work);

    expect(record.work.source.sourceSystem).toBe('queensland-legislation-api');
    expect(record.expressions).toHaveLength(1);
    expect(record.expressions[0].isCurrent).toBe(true);
    expect(record.manifestations[0].sourceUrl).toBe(work.url);
    expect(record.relationships).toEqual([
      {
        subjectUri: record.work.workUri,
        relationshipType: 'has_expression',
        objectUri: record.expressions[0].expressionUri,
      },
      {
        subjectUri: record.expressions[0].expressionUri,
        relationshipType: 'has_manifestation',
        objectUri: record.manifestations[0].manifestationUri,
      },
    ]);
  });
});
