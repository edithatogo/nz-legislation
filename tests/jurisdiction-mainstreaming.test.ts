import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { getProviderCapabilities } from '../src/providers/capability-manifest.ts';

type RegistryEntry = {
  jurisdiction: string;
  providerId: string;
  sourceAuthority: string;
  releaseChannel: string;
  licenseStatus: string;
  accessStatus: string;
};

const registry = JSON.parse(
  readFileSync('docs/maintainers/jurisdiction-source-registry.json', 'utf8')
) as { jurisdictions: RegistryEntry[] };

describe('jurisdiction mainstreaming registry', () => {
  it('matches every capability manifest entry in deterministic order', () => {
    const capabilities = getProviderCapabilities();
    expect(registry.jurisdictions.map(entry => entry.jurisdiction)).toEqual(
      capabilities.map(capability => capability.jurisdiction)
    );

    for (const capability of capabilities) {
      expect(registry.jurisdictions).toContainEqual(
        expect.objectContaining({
          jurisdiction: capability.jurisdiction,
          providerId: capability.providerId,
          sourceAuthority: capability.sourceAuthority,
          releaseChannel: capability.releaseChannel,
        })
      );
    }
  });

  it('blocks unverified jurisdictions from being described as supported', () => {
    for (const entry of registry.jurisdictions) {
      expect(entry.licenseStatus).toBeTruthy();
      expect(entry.accessStatus).toBeTruthy();
      if (entry.jurisdiction !== 'nz' && entry.jurisdiction !== 'au-commonwealth') {
        expect(entry.releaseChannel).toBe('planned');
        expect(entry.accessStatus).toBe('source-shape-only');
      }
    }
  });

  it('keeps the Commonwealth convergence lane prerelease', () => {
    expect(registry.jurisdictions).toContainEqual(
      expect.objectContaining({
        jurisdiction: 'au-commonwealth',
        releaseChannel: 'prerelease',
        accessStatus: 'source-backed-api',
      })
    );
  });
});
