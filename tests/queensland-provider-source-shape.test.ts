import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { getProviderCapability } from '../src/providers/capability-manifest.ts';
import { getProviderSourceCard } from '../src/providers/source-cards.ts';

interface QueenslandSourceShape {
  jurisdiction: string;
  providerId: string;
  sourceAuthority: string;
  sourceEntryPoints: string[];
  apiBaseUrl: string;
  access: { registrationRequired: boolean; authentication: string; rateLimits: string };
  formats: string[];
  runtimeStatus: string;
  runtimeSupported: boolean;
  sourceBacked: boolean;
  legalRecordsIncluded: boolean;
  fixturePolicy: string;
}

const fixture = JSON.parse(
  readFileSync(
    resolve(process.cwd(), 'docs/maintainers/queensland-provider-source-shape.json'),
    'utf8'
  )
) as QueenslandSourceShape;

describe('Queensland provider source shape', () => {
  it('records official API metadata without legal records', () => {
    expect(fixture).toMatchObject({
      jurisdiction: 'au-qld',
      providerId: 'queensland-legislation',
      sourceAuthority: expect.stringContaining('Queensland'),
      formats: ['json', 'xml', 'html', 'pdf'],
      access: { registrationRequired: true },
      runtimeStatus: 'planned',
      runtimeSupported: false,
      sourceBacked: true,
      legalRecordsIncluded: false,
    });

    for (const url of fixture.sourceEntryPoints) {
      expect(new URL(url).protocol).toBe('https:');
      expect(new URL(url).hostname).toMatch(
        /(?:legislation\.qld\.gov\.au|api\.legislation\.qld\.gov\.au)$/
      );
    }
    expect(fixture.apiBaseUrl).toBe('https://api.legislation.qld.gov.au/');
    expect(fixture.access.authentication).toMatch(/credentials must not be committed/i);
    expect(fixture.access.rateLimits).toMatch(/usage agreement/i);
    expect(fixture.fixturePolicy).toContain('metadata-only');
  });

  it('keeps Queensland explicitly planned and unsupported in runtime contracts', () => {
    const capability = getProviderCapability('au-qld');
    const card = getProviderSourceCard('au-qld');

    expect(capability).toMatchObject({
      providerId: fixture.providerId,
      releaseChannel: 'planned',
      sourceAuthority: 'Queensland Legislation API service',
    });
    expect(card).toMatchObject({
      runtimeSupported: false,
      runtimeKind: 'planned-au-provider',
      releaseGate: { status: 'blocked' },
      submissionGate: { status: 'blocked' },
    });
    for (const feature of Object.values(card.sourceBackedFeatureSummary.features)) {
      expect(feature).toMatchObject({ status: 'unsupported', sourceBacked: false });
    }
  });
});
