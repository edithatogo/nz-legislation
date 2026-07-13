import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import {
  getProviderCapability,
  getUnsupportedProviderCapability,
} from '../src/providers/capability-manifest.ts';

type SourceShape = {
  authoritativeFormats: { status: string };
  accessTerms: { machineReadableAccess: string };
  runtimeStatus: string;
  fixturePolicy: string;
};
const sourceShape = JSON.parse(
  readFileSync('docs/maintainers/sa-provider-source-shape.json', 'utf8')
) as SourceShape;

describe('South Australia provider readiness', () => {
  it('keeps every South Australia capability unsupported', () => {
    const capability = getProviderCapability('au-sa');
    expect(capability.releaseChannel).toBe('planned');
    expect(
      Object.values(capability.features).every(feature => feature.status === 'unsupported')
    ).toBe(true);
    expect(getUnsupportedProviderCapability('au-sa', 'search')).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-sa',
      providerId: 'south-australian-legislation',
    });
  });
  it('records discovery limits without legal text fixtures', () => {
    expect(sourceShape.authoritativeFormats.status).toContain('not verified');
    expect(sourceShape.accessTerms.machineReadableAccess).toContain('not verified');
    expect(sourceShape.runtimeStatus).toBe('unsupported');
    expect(sourceShape.fixturePolicy).toContain('metadata-only');
    expect(existsSync('docs/maintainers/sa-provider-readiness.md')).toBe(true);
  });
});
