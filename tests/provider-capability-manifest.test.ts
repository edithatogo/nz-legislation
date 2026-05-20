import { describe, expect, it } from 'vitest';

import {
  assertFeatureSupported,
  getProviderCapabilities,
  getProviderCapability,
  getUnsupportedProviderCapability,
  isFeatureSupported,
  type JurisdictionCode,
  type ProviderFeature,
} from '../src/providers/capability-manifest.ts';
import { parseJurisdictionCode } from '../src/providers/jurisdictions.ts';

const runtimeFeatures: ProviderFeature[] = [
  'search',
  'getWork',
  'getVersions',
  'getVersion',
  'citation',
  'export',
  'mcp',
];

const australianJurisdictions: JurisdictionCode[] = [
  'au-commonwealth',
  'au-qld',
  'au-nsw',
  'au-vic',
  'au-sa',
  'au-wa',
  'au-tas',
  'au-act',
  'au-nt',
];

describe('provider capability manifest', () => {
  it('declares every runtime feature for every jurisdiction', () => {
    const capabilities = getProviderCapabilities();

    expect(capabilities.map(capability => capability.jurisdiction)).toEqual([
      'nz',
      ...australianJurisdictions,
    ]);

    for (const capability of capabilities) {
      expect(Object.keys(capability.features).sort()).toEqual([...runtimeFeatures].sort());
    }
  });

  it('keeps New Zealand marked as the only stable supported provider', () => {
    const capability = getProviderCapability('nz');

    expect(capability.releaseChannel).toBe('stable');

    for (const feature of runtimeFeatures) {
      expect(isFeatureSupported('nz', feature)).toBe(true);
      expect(capability.features[feature]).toMatchObject({
        status: 'supported',
        sourceBacked: true,
      });
    }
  });

  it('does not expose mutable manifest internals', () => {
    const capabilities = getProviderCapabilities();
    const nzCapability = capabilities.find(capability => capability.jurisdiction === 'nz');

    expect(nzCapability).toBeDefined();

    nzCapability!.features.search.status = 'unsupported';

    expect(getProviderCapability('nz').features.search.status).toBe('supported');
  });

  it('keeps Australian providers blocked until source-backed provider work lands', () => {
    for (const jurisdiction of australianJurisdictions) {
      const capability = getProviderCapability(jurisdiction);

      expect(capability.releaseChannel).toBe('planned');

      for (const feature of runtimeFeatures) {
        expect(capability.features[feature]).toMatchObject({
          status: 'unsupported',
          sourceBacked: false,
        });
        expect(() => assertFeatureSupported(jurisdiction, feature)).toThrow(/source validation/i);
      }
    }
  });

  it('returns structured unsupported capability details for planned providers', () => {
    const unsupported = getUnsupportedProviderCapability('au-nsw', 'export');

    expect(unsupported).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-nsw',
      providerId: 'nsw-legislation',
      feature: 'export',
      status: 'unsupported',
      sourceBacked: false,
    });
  });

  it('records Commonwealth source validation without enabling runtime support', () => {
    const capability = getProviderCapability('au-commonwealth');
    const unsupported = getUnsupportedProviderCapability('au-commonwealth', 'search');

    expect(capability.sourceAuthority).toBe('Federal Register of Legislation public API');
    expect(capability.releaseChannel).toBe('planned');
    expect(unsupported).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-commonwealth',
      providerId: 'federal-register-of-legislation',
      feature: 'search',
      status: 'unsupported',
      sourceBacked: false,
    });
    expect(unsupported?.message).toMatch(/Source validation is complete/);
  });

  it('parses jurisdiction aliases used by CLI and integration hosts', () => {
    expect(parseJurisdictionCode('NZ')).toBe('nz');
    expect(parseJurisdictionCode('au')).toBe('au-commonwealth');
    expect(parseJurisdictionCode('au-comm')).toBe('au-commonwealth');
    expect(parseJurisdictionCode('au-qld')).toBe('au-qld');
    expect(() => parseJurisdictionCode('mars')).toThrow(/Unknown jurisdiction/);
  });
});
