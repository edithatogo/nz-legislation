import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getProviderSourceCard } from '../src/providers/source-cards.ts';

type SourceShape = {
  jurisdiction: string;
  providerId: string;
  sourceAuthority: string;
  sourceEntryPoints: string[];
  runtimeStatus: string;
  fixturePolicy: string;
};
const sourceShape = JSON.parse(
  readFileSync('docs/maintainers/sa-provider-source-shape.json', 'utf8')
) as SourceShape;

describe('South Australia provider source-shape contract', () => {
  it('restricts source entry points to official South Australian hosts', () => {
    expect(sourceShape.sourceEntryPoints.length).toBeGreaterThanOrEqual(2);
    for (const sourceUrl of sourceShape.sourceEntryPoints) {
      const url = new URL(sourceUrl);
      expect(url.protocol).toBe('https:');
      expect(['www.legislation.sa.gov.au', 'governmentgazette.sa.gov.au']).toContain(url.hostname);
    }
  });
  it('keeps the source card gated and metadata-only', () => {
    expect(sourceShape).toMatchObject({
      jurisdiction: 'au-sa',
      providerId: 'south-australian-legislation',
      sourceAuthority: 'South Australian Legislation website',
      runtimeStatus: 'unsupported',
    });
    expect(sourceShape.fixturePolicy).toMatch(/metadata-only/i);
    expect(getProviderSourceCard('au-sa')).toMatchObject({
      jurisdiction: 'au-sa',
      providerId: 'south-australian-legislation',
      runtimeSupported: false,
      runtimeKind: 'planned-au-provider',
      releaseGate: { status: 'blocked' },
      submissionGate: { status: 'blocked' },
    });
  });
});
