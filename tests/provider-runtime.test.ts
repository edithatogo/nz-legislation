import { describe, expect, it } from 'vitest';

import { ProviderCapabilityError } from '../src/providers/capability-manifest.ts';
import {
  assertRuntimeProviderSupported,
  getUnsupportedRuntimeProviderCapability,
} from '../src/providers/runtime.ts';

describe('provider runtime gates', () => {
  it('allows supported New Zealand runtime features', () => {
    expect(getUnsupportedRuntimeProviderCapability('nz', 'search')).toBeNull();
    expect(() => assertRuntimeProviderSupported('nz', 'export')).not.toThrow();
  });

  it('blocks Commonwealth runtime use even with a gated adapter source card', () => {
    const unsupported = getUnsupportedRuntimeProviderCapability('au-commonwealth', 'search');

    expect(unsupported).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-commonwealth',
      providerId: 'federal-register-of-legislation',
      feature: 'search',
      status: 'unsupported',
      sourceBacked: false,
    });
    expect(unsupported?.message).toMatch(/provider implementation is required/i);
  });

  it('blocks planned Australian providers before runtime clients are invoked', () => {
    expect(() => assertRuntimeProviderSupported('au-nsw', 'export')).toThrow(
      ProviderCapabilityError
    );

    try {
      assertRuntimeProviderSupported('au-nsw', 'export');
    } catch (error) {
      expect(error).toBeInstanceOf(ProviderCapabilityError);
      expect((error as ProviderCapabilityError).details).toMatchObject({
        jurisdiction: 'au-nsw',
        feature: 'export',
        providerId: 'nsw-legislation',
      });
    }
  });
});
