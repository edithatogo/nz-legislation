import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import { getProviderCapabilities } from '../src/providers/capability-manifest.ts';

type GazetteSource = {
  jurisdiction: string;
  sourceId: string;
  authority: string;
  sourceUrl: string;
  evidenceUrl: string;
  publicationKind: string;
  accessStatus:
    | 'official-online-search'
    | 'official-online-archive'
    | 'official-online-publication'
    | 'source-shape-only';
  runtimeStatus: 'not-implemented' | 'unsupported';
};

const register = JSON.parse(
  readFileSync('docs/maintainers/gazette-source-register.json', 'utf8')
) as { sources: GazetteSource[] };

describe('gazette source register', () => {
  it('covers every legislation jurisdiction without enabling runtime access', () => {
    expect(register.sources.map(source => source.jurisdiction)).toEqual(
      getProviderCapabilities().map(capability => capability.jurisdiction)
    );

    for (const source of register.sources) {
      expect(source.sourceId).toMatch(/^[a-z0-9-]+$/);
      expect(source.sourceUrl).toMatch(/^https:\/\//);
      expect(source.evidenceUrl).toMatch(/^https:\/\//);
      expect(source.authority).toBeTruthy();
      expect(source.publicationKind).toMatch(/^official-/);
      expect(['not-implemented', 'unsupported']).toContain(source.runtimeStatus);
      if (source.accessStatus !== 'source-shape-only') {
        expect(source.runtimeStatus).toBe('not-implemented');
      }
    }
  });

  it('keeps unverified lanes explicitly unsupported', () => {
    for (const source of register.sources.filter(
      item => item.accessStatus === 'source-shape-only'
    )) {
      expect(source.runtimeStatus).toBe('unsupported');
    }
  });
});
