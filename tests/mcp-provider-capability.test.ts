import { describe, expect, it } from 'vitest';

import { createUnsupportedCapabilityResponse } from '../src/mcp/server.ts';

describe('MCP provider capability gates', () => {
  it('returns structured unsupported errors for planned Australian providers', () => {
    const response = createUnsupportedCapabilityResponse('au-nsw', 'export');

    expect(response?.content[0]).toMatchObject({
      type: 'text',
      isError: true,
    });
    expect(JSON.parse(response!.content[0].text)).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-nsw',
      feature: 'export',
      status: 'unsupported',
      sourceBacked: false,
    });
  });

  it('allows supported New Zealand provider capabilities to continue to runtime handlers', () => {
    expect(createUnsupportedCapabilityResponse('nz', 'export')).toBeNull();
  });
});
