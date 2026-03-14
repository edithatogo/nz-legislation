import { describe, expect, it } from 'vitest';

import type { CanonicalLegislationRecord } from '../src/models/canonical.js';
import { toSchemaOrgLegislation } from '../src/output/legal-metadata-publication.js';

describe('legal metadata publication', () => {
  it('projects a canonical record into schema.org legislation JSON-LD', () => {
    const record: CanonicalLegislationRecord = {
      work: {
        canonicalId: 'nz:act/2020/67',
        workUri: 'urn:nz-legislation:work:nz:act-2020-67',
        source: {
          sourceSystem: 'nz-legislation-api',
          sourceId: 'act/2020/67',
          sourceUrl: 'https://www.legislation.govt.nz/act/public/2020/0067/latest/LMS12345.html',
        },
        jurisdictionCode: 'nz',
        documentType: 'act',
        title: 'Health Act 2020',
        shortTitle: 'Health Act',
        language: 'en',
      },
      expressions: [
        {
          expressionUri: 'urn:nz-legislation:work:nz:act-2020-67:expression:2021-05-01',
          workUri: 'urn:nz-legislation:work:nz:act-2020-67',
          expressionDate: '2021-05-01',
          publicationDate: '2021-05-01',
          lifecycleState: 'in-force',
          isCurrent: true,
          versionLabel: 'latest',
          language: 'en',
        },
      ],
      manifestations: [
        {
          manifestationUri:
            'urn:nz-legislation:work:nz:act-2020-67:expression:2021-05-01:manifestation:html',
          expressionUri: 'urn:nz-legislation:work:nz:act-2020-67:expression:2021-05-01',
          format: 'html',
          mediaType: 'text/html',
          sourceUrl: 'https://www.legislation.govt.nz/act/public/2020/0067/latest/LMS12345.html',
        },
      ],
      relationships: [],
    };

    const jsonLd = toSchemaOrgLegislation(record);

    expect(jsonLd['@type']).toBe('Legislation');
    expect(jsonLd.legislationIdentifier).toBe('nz:act/2020/67');
    expect(jsonLd.legislationType).toBe('act');
    expect(jsonLd.url).toBe(record.manifestations[0].sourceUrl);
    expect(jsonLd.sameAs).toContain(record.work.workUri);
    expect(jsonLd.sameAs).toContain(record.expressions[0].expressionUri);
  });
});
