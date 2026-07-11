import { describe, expect, it } from 'vitest';

import { createCommonwealthProviderAdapter } from '../src/providers/commonwealth.ts';

const enabled = process.env.LEGISLATION_LIVE_SMOKE === '1';

describe.skipIf(!enabled)('Commonwealth opt-in live smoke test', () => {
  it('performs one conservative official search request', async () => {
    const adapter = createCommonwealthProviderAdapter();
    const result = await adapter.searchWorks({ query: 'Legislation Act', limit: 1, offset: 0 });

    expect(result.limit).toBe(1);
    expect(result.results.length).toBeLessThanOrEqual(1);
  }, 30_000);
});
