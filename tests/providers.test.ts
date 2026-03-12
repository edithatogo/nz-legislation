import { describe, expect, it } from 'vitest';

import {
  getLegislation,
  getLegislationVersions,
  searchLegislation,
  SUPPORTED_JURISDICTIONS,
} from '../src/providers/index.js';

describe('provider routing', () => {
  it('exposes the planned jurisdiction list', () => {
    expect(SUPPORTED_JURISDICTIONS).toEqual(['nz', 'au-comm', 'au-qld']);
  });

  it('rejects unimplemented Commonwealth search explicitly', async () => {
    await expect(
      searchLegislation({ jurisdiction: 'au-comm', query: 'privacy' })
    ).rejects.toThrow("Jurisdiction 'au-comm' is not implemented in this branch yet.");
  });

  it('rejects unimplemented Queensland retrieval explicitly', async () => {
    await expect(
      getLegislation({ jurisdiction: 'au-qld', workId: 'act/2006/60' })
    ).rejects.toThrow("Jurisdiction 'au-qld' is not implemented in this branch yet.");
  });

  it('rejects unimplemented Queensland versions explicitly', async () => {
    await expect(
      getLegislationVersions({ jurisdiction: 'au-qld', workId: 'act/2006/60' })
    ).rejects.toThrow("Jurisdiction 'au-qld' is not implemented in this branch yet.");
  });
});
