import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { getProviderSourceCard } from '../src/providers/source-cards.ts';

type ActSourceShape = {
  jurisdiction: string;
  providerId: string;
  sourceAuthority: string;
  sourceEntryPoints: string[];
  runtimeStatus: string;
  fixturePolicy: string;
};

const sourceShape = JSON.parse(
  readFileSync('docs/maintainers/act-provider-source-shape.json', 'utf8')
) as ActSourceShape;

describe('ACT provider source-shape contract', () => {
  it('restricts source entry points to official ACT register hosts', () => {
    expect(sourceShape.sourceEntryPoints.length).toBeGreaterThanOrEqual(2);
    for (const sourceUrl of sourceShape.sourceEntryPoints) {
      const url = new URL(sourceUrl);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('www.legislation.act.gov.au');
    }
  });

  it('keeps the source card gated while preserving metadata-only policy', () => {
    expect(sourceShape).toMatchObject({
      jurisdiction: 'au-act',
      providerId: 'act-legislation',
      sourceAuthority: 'ACT Legislation Register',
      runtimeStatus: 'unsupported',
    });
    expect(sourceShape.fixturePolicy).toMatch(/metadata-only/i);

    const card = getProviderSourceCard('au-act');
    expect(card).toMatchObject({
      jurisdiction: 'au-act',
      providerId: 'act-legislation',
      runtimeSupported: false,
      runtimeKind: 'planned-au-provider',
      releaseGate: { status: 'blocked' },
      submissionGate: { status: 'blocked' },
    });
    expect(card.sourceBackedFeatureSummary.sourceBacked).toHaveLength(0);
  });
});
