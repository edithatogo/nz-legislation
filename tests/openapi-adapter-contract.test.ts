import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

import { getProviderCapabilities } from '../src/providers/capability-manifest.ts';

type ContractRoute = {
  method: string;
  path: string;
  operationId: string;
  response: string;
  providerGate?: string;
  unsupportedResponse?: string;
};

type AdapterContract = {
  version: string;
  status: string;
  serviceEnabled: boolean;
  security: Record<string, string>;
  routes: ContractRoute[];
  nonGoals: string[];
};

const contract = JSON.parse(
  readFileSync('docs/maintainers/openapi-adapter-contract.json', 'utf8')
) as AdapterContract;

describe('OpenAPI adapter readiness contract', () => {
  it('remains a readiness-only artifact', () => {
    expect(contract.status).toBe('future-contract-only');
    expect(contract.serviceEnabled).toBe(false);
    expect(contract.nonGoals.join(' ')).toContain('No HTTP server');
  });

  it('defines provider-aware routes for every runtime provider feature', () => {
    const manifestFeatures = new Set(Object.keys(getProviderCapabilities()[0]?.features ?? {}));
    const routeFeatures = new Set(contract.routes.map(route => route.providerGate).filter(Boolean));

    for (const feature of manifestFeatures) {
      expect(routeFeatures).toContain(feature);
    }
  });

  it('requires structured unsupported responses on provider-gated routes', () => {
    for (const route of contract.routes.filter(
      route => route.providerGate && route.providerGate !== 'capability-manifest'
    )) {
      expect(route.unsupportedResponse).toBe('UnsupportedProviderCapability');
    }
  });

  it('declares security prerequisites before deployment', () => {
    expect(contract.security.transport).toBe('https-only');
    expect(contract.security.authentication).toContain('required');
    expect(contract.security.authorization).toContain('scoped');
    expect(contract.security.rateLimiting).toBe('required');
    expect(contract.security.auditLogging).toBe('required');
    expect(contract.security.apiKeyLogging).toBe('prohibited');
  });
});
