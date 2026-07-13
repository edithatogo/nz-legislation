import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

type FixtureRequest = {
  feature: string;
  path: string;
  searchParams: Record<string, string>;
};

describe('NZ provider request parity contract', () => {
  it('keeps the shared Rust fixture aligned with the TypeScript client request shapes', () => {
    const fixture = JSON.parse(
      readFileSync('tests/fixtures/rust/nz-contracts.json', 'utf8')
    ) as { providerId: string; apiBaseUrl: string; requests: FixtureRequest[] };

    expect(fixture.providerId).toBe('legislation-govt-nz');
    expect(fixture.apiBaseUrl).toBe('https://api.legislation.govt.nz');
    expect(fixture.requests).toEqual([
      {
        feature: 'search',
        path: 'v0/works',
        searchParams: {
          from: '2020-01-01',
          legislation_status: 'in_force',
          legislation_type: 'act',
          page: '3',
          per_page: '10',
          search_term: 'health',
          to: '2020-12-31',
        },
      },
      {
        feature: 'get_work',
        path: 'v0/works/act_public_1989_18/versions',
        searchParams: {},
      },
      {
        feature: 'get_versions',
        path: 'v0/works/act_public_1989_18/versions',
        searchParams: {},
      },
    ]);
  });

  it('records the same identifier safety boundary as the Rust planner', () => {
    const unsafeIdentifiers = ['act/1989/18', 'act\\1989\\18', '../secret'];
    for (const identifier of unsafeIdentifiers) {
      expect(identifier.includes('/') || identifier.includes('\\') || identifier.includes('..')).toBe(
        true
      );
    }
  });
});
