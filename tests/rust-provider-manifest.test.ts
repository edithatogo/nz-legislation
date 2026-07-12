import { describe, expect, it } from 'vitest';

import { providerCapabilityManifest } from '../src/providers/capability-manifest.js';

describe('Rust provider manifest parity inventory', () => {
  it('keeps the staged Rust provider inventory aligned with TypeScript', () => {
    expect(
      providerCapabilityManifest.slice(0, 3).map(provider => ({
        jurisdiction: provider.jurisdiction,
        providerId: provider.providerId,
        releaseChannel: provider.releaseChannel,
      }))
    ).toEqual([
      { jurisdiction: 'nz', providerId: 'legislation-govt-nz', releaseChannel: 'stable' },
      {
        jurisdiction: 'au-commonwealth',
        providerId: 'federal-register-of-legislation',
        releaseChannel: 'prerelease',
      },
      { jurisdiction: 'au-qld', providerId: 'queensland-legislation', releaseChannel: 'planned' },
    ]);
  });
});
