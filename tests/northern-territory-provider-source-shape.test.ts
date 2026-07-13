import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { getProviderCapability } from '../src/providers/capability-manifest.ts';
import { getProviderSourceCard } from '../src/providers/source-cards.ts';

interface NorthernTerritorySourceShape {
  jurisdiction: string;
  providerId: string;
  sourceAuthority: string;
  sourceEntryPoints: string[];
  formats: string[];
  runtimeStatus: string;
  runtimeSupported: boolean;
  sourceBacked: boolean;
  legalRecordsIncluded: boolean;
  fixturePolicy: string;
}

const fixture = JSON.parse(
  readFileSync(
    resolve(process.cwd(), 'docs/maintainers/northern-territory-provider-source-shape.json'),
    'utf8'
  )
) as NorthernTerritorySourceShape;

describe('Northern Territory provider source shape', () => {
  it('records official entry points without legal records', () => {
    expect(fixture).toMatchObject({
      jurisdiction: 'au-nt',
      providerId: 'northern-territory-legislation',
      sourceAuthority: 'Northern Territory legislation website',
      formats: ['HTML', 'PDF', 'Word'],
      runtimeStatus: 'planned',
      runtimeSupported: false,
      sourceBacked: true,
      legalRecordsIncluded: false,
    });

    for (const sourceUrl of fixture.sourceEntryPoints) {
      const url = new URL(sourceUrl);
      expect(url.protocol).toBe('https:');
      expect(url.hostname).toBe('legislation.nt.gov.au');
    }
    expect(fixture.fixturePolicy).toContain('metadata-only');
  });

  it('keeps Northern Territory explicitly planned and unsupported', () => {
    const capability = getProviderCapability('au-nt');
    const card = getProviderSourceCard('au-nt');

    expect(capability).toMatchObject({
      providerId: fixture.providerId,
      releaseChannel: 'planned',
      sourceAuthority: fixture.sourceAuthority,
    });
    expect(card).toMatchObject({
      jurisdiction: 'au-nt',
      providerId: fixture.providerId,
      runtimeSupported: false,
      runtimeKind: 'planned-au-provider',
      releaseGate: { status: 'blocked' },
      submissionGate: { status: 'blocked' },
    });
    expect(card.sourceBackedFeatureSummary.sourceBacked).toHaveLength(0);
  });
});
