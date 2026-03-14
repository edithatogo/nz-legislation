import { describe, expect, it } from 'vitest';

import {
  CanonicalLegislationRecordSchema,
  CanonicalLifecycleStateSchema,
  CanonicalManifestationFormatSchema,
  CanonicalRelationshipTypeSchema,
} from '../src/models/canonical.js';

describe('canonical legal metadata schemas', () => {
  it('accepts a complete canonical legislation record', () => {
    const parsed = CanonicalLegislationRecordSchema.parse({
      work: {
        canonicalId: 'nz:act:2020:67',
        workUri: 'https://example.test/work/nz/act/2020/67',
        source: {
          sourceSystem: 'nz-legislation-api',
          sourceId: 'act/2020/67',
          sourceUrl: 'https://www.legislation.govt.nz/act/public/2020/0067/latest/LMS12345.html',
        },
        jurisdictionCode: 'nz',
        documentType: 'act',
        title: 'Sample Health Act',
        shortTitle: 'Health Act',
        preferredCitation: 'Sample Health Act 2020',
      },
      expressions: [
        {
          expressionUri: 'https://example.test/expression/nz/act/2020/67/2020-08-01',
          workUri: 'https://example.test/work/nz/act/2020/67',
          expressionDate: '2020-08-01',
          publicationDate: '2020-08-01',
          inForceDate: '2020-08-15',
          lifecycleState: 'in-force',
          isCurrent: true,
          versionLabel: 'latest',
        },
      ],
      manifestations: [
        {
          manifestationUri: 'https://example.test/manifestation/nz/act/2020/67/2020-08-01/html',
          expressionUri: 'https://example.test/expression/nz/act/2020/67/2020-08-01',
          format: 'html',
          mediaType: 'text/html',
          sourceUrl: 'https://www.legislation.govt.nz/act/public/2020/0067/latest/LMS12345.html',
        },
      ],
      relationships: [
        {
          subjectUri: 'https://example.test/work/nz/act/2020/67',
          relationshipType: 'has_expression',
          objectUri: 'https://example.test/expression/nz/act/2020/67/2020-08-01',
        },
      ],
      citations: {
        preferred: 'Sample Health Act 2020',
        neutral: '2020 NZA 67',
      },
    });

    expect(parsed.work.language).toBe('en');
    expect(parsed.expressions[0].language).toBe('en');
    expect(parsed.relationships).toHaveLength(1);
  });

  it('rejects invalid lifecycle and relationship values', () => {
    expect(() => CanonicalLifecycleStateSchema.parse('active')).toThrow();
    expect(() => CanonicalRelationshipTypeSchema.parse('modifies')).toThrow();
    expect(() => CanonicalManifestationFormatSchema.parse('epub')).toThrow();
  });
});
