import { describe, expect, it } from 'vitest';

import {
  getProviderRegistry,
  getProviderRegistryEntry,
  getRuntimeProviderRegistry,
} from '../src/providers/registry.ts';

describe('provider registry', () => {
  it('keeps New Zealand stable and Commonwealth prerelease as runtime-supported providers', () => {
    expect(getRuntimeProviderRegistry()).toEqual([
      expect.objectContaining({
        jurisdiction: 'nz',
        providerId: 'legislation-govt-nz',
        runtimeKind: 'legacy-nz-client',
        runtimeSupported: true,
      }),
      expect.objectContaining({
        jurisdiction: 'au-commonwealth',
        providerId: 'federal-register-of-legislation',
        runtimeKind: 'prerelease-au-adapter',
        runtimeSupported: true,
      }),
    ]);
  });

  it('records the prerelease Commonwealth adapter with source-backed runtime support', () => {
    expect(getProviderRegistryEntry('au-commonwealth')).toMatchObject({
      jurisdiction: 'au-commonwealth',
      providerId: 'federal-register-of-legislation',
      runtimeKind: 'prerelease-au-adapter',
      runtimeSupported: true,
      source: {
        jurisdiction: 'au-commonwealth',
        providerId: 'federal-register-of-legislation',
        sourceAuthority: 'Federal Register of Legislation public API',
        runtimeEnabled: true,
      },
      capability: {
        releaseChannel: 'prerelease',
        features: {
          search: {
            status: 'supported',
            sourceBacked: true,
          },
        },
      },
    });
  });

  it('keeps remaining Australian jurisdictions as planned providers', () => {
    const plannedAustralianEntries = getProviderRegistry().filter(
      entry => entry.jurisdiction !== 'nz' && entry.jurisdiction !== 'au-commonwealth'
    );

    expect(plannedAustralianEntries).toHaveLength(8);
    expect(plannedAustralianEntries).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          jurisdiction: 'au-qld',
          runtimeKind: 'planned-au-provider',
          runtimeSupported: false,
          source: undefined,
        }),
        expect.objectContaining({
          jurisdiction: 'au-nsw',
          runtimeKind: 'planned-au-provider',
          runtimeSupported: false,
          source: undefined,
        }),
      ])
    );
  });

  it('fails closed for unknown registry lookups', () => {
    expect(() => getProviderRegistryEntry('unknown' as never)).toThrow(
      'Unknown provider registry jurisdiction: unknown'
    );
  });
});
