import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  getProviderCapability,
  getUnsupportedProviderCapability,
} from '../src/providers/capability-manifest.ts';
import { getProviderSourceCard } from '../src/providers/source-cards.ts';

const fixture = JSON.parse(
  readFileSync('docs/maintainers/victoria-provider-source-shape.json', 'utf8')
) as {
  jurisdiction: string;
  providerId: string;
  sourceEntryPoints: string[];
  authoritativeFormats: string[];
  collections: string[];
  runtimeStatus: string;
  fixturePolicy: string;
  adapterMapping: Record<string, string>;
};

describe('Victoria provider source shape', () => {
  it('records official metadata without legal records', () => {
    expect(fixture).toMatchObject({
      jurisdiction: 'au-vic',
      providerId: 'victorian-legislation',
      authoritativeFormats: ['HTML', 'PDF'],
      collections: expect.arrayContaining(['in-force', 'repealed-or-revoked']),
      runtimeStatus: 'unsupported',
      fixturePolicy: expect.stringContaining('metadata-only'),
    });
    for (const url of fixture.sourceEntryPoints) {
      expect(new URL(url).protocol).toBe('https:');
      expect(new URL(url).hostname).toMatch(/(?:legislation\.vic\.gov\.au|gazette\.vic\.gov\.au)$/);
    }
  });

  it('keeps Victoria blocked in capability, source-card, and unsupported contracts', () => {
    expect(getProviderCapability('au-vic')).toMatchObject({
      providerId: fixture.providerId,
      releaseChannel: 'planned',
      sourceAuthority: 'Victorian legislation website',
    });
    expect(getUnsupportedProviderCapability('au-vic', 'search')).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-vic',
      providerId: fixture.providerId,
    });
    expect(getProviderSourceCard('au-vic')).toMatchObject({
      runtimeSupported: false,
      runtimeKind: 'planned-au-provider',
      releaseGate: { status: 'blocked' },
      submissionGate: { status: 'blocked' },
    });
    expect(fixture.adapterMapping.export).toMatch(/Unsupported/);
  });
});
