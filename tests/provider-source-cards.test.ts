import { describe, expect, it } from 'vitest';

import { getProviderSourceCard, getProviderSourceCards } from '../src/providers/source-cards.ts';

const runtimeFeatures = [
  'search',
  'getWork',
  'getVersions',
  'getVersion',
  'citation',
  'export',
  'mcp',
] as const;

describe('provider source cards', () => {
  it('derives the New Zealand stable runtime card from registry capability data', () => {
    const card = getProviderSourceCard('nz');

    expect(card).toMatchObject({
      jurisdiction: 'nz',
      providerId: 'legislation-govt-nz',
      sourceAuthority: 'legislation.govt.nz',
      releaseChannel: 'stable',
      runtimeSupported: true,
      runtimeKind: 'legacy-nz-client',
      releaseGate: {
        status: 'allowed',
      },
      submissionGate: {
        status: 'allowed',
      },
    });
    expect(card.sourceMetadata).toBeUndefined();
    expect(card.sourceBackedFeatureSummary.sourceBacked).toEqual([...runtimeFeatures]);
    expect(card.sourceBackedFeatureSummary.notSourceBacked).toEqual([]);

    for (const feature of runtimeFeatures) {
      expect(card.sourceBackedFeatureSummary.features[feature]).toMatchObject({
        status: 'supported',
        sourceBacked: true,
      });
    }
  });

  it('keeps Commonwealth source metadata for prerelease runtime while blocking release', () => {
    const card = getProviderSourceCard('au-commonwealth');

    expect(card).toMatchObject({
      jurisdiction: 'au-commonwealth',
      providerId: 'federal-register-of-legislation',
      sourceAuthority: 'Federal Register of Legislation public API',
      releaseChannel: 'prerelease',
      runtimeSupported: true,
      runtimeKind: 'prerelease-au-adapter',
      releaseGate: {
        status: 'blocked',
      },
      submissionGate: {
        status: 'blocked',
      },
      sourceMetadata: {
        apiBaseUrl: 'https://api.prod.legislation.gov.au/v1',
        registerBaseUrl: 'https://www.legislation.gov.au',
        runtimeEnabled: true,
      },
    });
    expect(card.sourceBackedFeatureSummary.sourceBacked).toEqual([
      'search',
      'getWork',
      'getVersions',
      'export',
      'mcp',
    ]);
    expect(card.sourceBackedFeatureSummary.notSourceBacked).toEqual(['getVersion', 'citation']);

    for (const feature of ['search', 'getWork', 'getVersions', 'export', 'mcp'] as const) {
      expect(card.sourceBackedFeatureSummary.features[feature]).toMatchObject({
        status: 'supported',
        sourceBacked: true,
      });
    }

    for (const feature of ['getVersion', 'citation'] as const) {
      expect(card.sourceBackedFeatureSummary.features[feature]).toMatchObject({
        status: 'unsupported',
        sourceBacked: false,
      });
    }
  });

  it('blocks all Australian source cards from release until they are stable providers', () => {
    const australianCards = getProviderSourceCards().filter(card =>
      card.jurisdiction.startsWith('au-')
    );

    expect(australianCards).toHaveLength(9);

    for (const card of australianCards) {
      expect(card.releaseGate.status).toBe('blocked');
      expect(card.submissionGate.status).toBe('blocked');
    }
  });

  it('returns immutable cards and nested feature summaries', () => {
    const card = getProviderSourceCard('nz');

    expect(Object.isFrozen(card)).toBe(true);
    expect(Object.isFrozen(card.releaseGate)).toBe(true);
    expect(Object.isFrozen(card.submissionGate)).toBe(true);
    expect(Object.isFrozen(card.sourceBackedFeatureSummary)).toBe(true);
    expect(Object.isFrozen(card.sourceBackedFeatureSummary.features)).toBe(true);
    expect(Object.isFrozen(card.sourceBackedFeatureSummary.features.search)).toBe(true);
  });
});
