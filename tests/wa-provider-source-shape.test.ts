import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { getProviderSourceCard } from '../src/providers/source-cards.ts';

const sourceShape = JSON.parse(
  readFileSync('docs/maintainers/wa-provider-source-shape.json', 'utf8')
) as {
  jurisdiction: string;
  providerId: string;
  sourceAuthority: string;
  sourceEntryPoints: string[];
  runtimeStatus: string;
  fixturePolicy: string;
};

describe('Western Australia provider source-shape contract', () => {
  it('restricts source entry points to official Western Australian hosts', () => {
    expect(sourceShape.sourceEntryPoints.length).toBeGreaterThanOrEqual(2);
    for (const sourceUrl of sourceShape.sourceEntryPoints) {
      const url = new URL(sourceUrl);
      expect(url.protocol).toBe('https:');
      expect(['www.legislation.wa.gov.au', 'legislation.wa.gov.au', 'www.wa.gov.au']).toContain(
        url.hostname
      );
    }
  });
  it('aligns the source record with the provider card and metadata-only policy', () => {
    expect(sourceShape.jurisdiction).toBe('au-wa');
    expect(sourceShape.providerId).toBe('western-australian-legislation');
    expect(sourceShape.sourceAuthority).toBe('Western Australian Legislation website');
    expect(sourceShape.runtimeStatus).toBe('unsupported');
    expect(sourceShape.fixturePolicy).toContain('no legal text');
    expect(getProviderSourceCard('au-wa')).toMatchObject({
      jurisdiction: 'au-wa',
      providerId: sourceShape.providerId,
    });
  });
});
