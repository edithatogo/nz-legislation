import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { getProviderCapability } from '../src/providers/capability-manifest.ts';
import { getProviderSourceCard } from '../src/providers/source-cards.ts';

const fixture = JSON.parse(
  readFileSync(resolve(process.cwd(), 'docs/maintainers/tasmania-provider-source-shape.json'), 'utf8')
) as { jurisdiction: string; providerId: string; sourceEntryPoints: string[]; runtimeStatus: string; runtimeSupported: boolean; sourceBacked: boolean; legalRecordsIncluded: boolean; fixturePolicy: string; adapterMapping: Record<string, string> };

describe('Tasmania provider source shape', () => {
  it('records official metadata without legal records', () => {
    expect(fixture).toMatchObject({
      jurisdiction: 'au-tas', providerId: 'tasmanian-legislation', runtimeStatus: 'unsupported',
      runtimeSupported: false, sourceBacked: true, legalRecordsIncluded: false,
      fixturePolicy: expect.stringContaining('metadata-only'),
    });
    for (const url of fixture.sourceEntryPoints) {
      expect(new URL(url).protocol).toBe('https:');
      expect(new URL(url).hostname).toMatch(/(?:legislation\.tas\.gov\.au|gazette\.tas\.gov\.au)$/);
    }
  });

  it('keeps Tasmania blocked in provider contracts', () => {
    expect(getProviderCapability('au-tas')).toMatchObject({ providerId: fixture.providerId, releaseChannel: 'planned', sourceAuthority: 'Tasmanian Legislation Online' });
    expect(getProviderSourceCard('au-tas')).toMatchObject({ runtimeSupported: false, runtimeKind: 'planned-au-provider', releaseGate: { status: 'blocked' }, submissionGate: { status: 'blocked' } });
    expect(fixture.adapterMapping.export).toMatch(/Unsupported/);
  });
});
