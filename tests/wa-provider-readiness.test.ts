import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  getProviderCapability,
  getUnsupportedProviderCapability,
} from '../src/providers/capability-manifest.ts';

const sourceShape = JSON.parse(
  readFileSync('docs/maintainers/wa-provider-source-shape.json', 'utf8')
) as {
  authoritativeFormats: { status: string };
  accessTerms: { machineReadableAccess: string };
  runtimeStatus: string;
  fixturePolicy: string;
};

describe('Western Australia provider readiness', () => {
  it('keeps every Western Australia capability unsupported', () => {
    const capability = getProviderCapability('au-wa');
    expect(capability.releaseChannel).toBe('planned');
    expect(
      Object.values(capability.features).every(feature => feature.status === 'unsupported')
    ).toBe(true);
    expect(getUnsupportedProviderCapability('au-wa', 'search')).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-wa',
      providerId: 'western-australian-legislation',
    });
  });
  it('records discovery limits without legal text fixtures', () => {
    expect(sourceShape.authoritativeFormats.status).toContain('not verified');
    expect(sourceShape.accessTerms.machineReadableAccess).toContain('not verified');
    expect(sourceShape.runtimeStatus).toBe('unsupported');
    expect(sourceShape.fixturePolicy).toContain('metadata-only');
    expect(existsSync('docs/maintainers/wa-provider-readiness.md')).toBe(true);
  });
});
