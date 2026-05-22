import { describe, expect, it } from 'vitest';

import { createServer, createUnsupportedCapabilityResponse } from '../src/mcp/server.ts';

type RegisteredTool = {
  handler: (params: Record<string, unknown>) => Promise<{
    content: Array<{ type: string; text: string }>;
    isError?: boolean;
  }>;
};

function getRegisteredTools(): Record<string, RegisteredTool> {
  const server = createServer() as unknown as {
    _registeredTools: Record<string, RegisteredTool>;
  };

  return server._registeredTools;
}

describe('MCP provider capability gates', () => {
  it('returns structured unsupported errors for planned Australian providers', () => {
    const response = createUnsupportedCapabilityResponse('au-nsw', 'export');

    expect(response?.isError).toBe(true);
    expect(response?.content[0]).toMatchObject({ type: 'text' });
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

  it('registers MCP tools with provider-aware schemas', () => {
    expect(createServer()).toBeDefined();
  });

  it('blocks planned Australian providers in each runtime MCP handler', async () => {
    const tools = getRegisteredTools();
    const cases: Array<[string, Record<string, unknown>, string]> = [
      ['search_legislation', { query: 'health', jurisdiction: 'au-nsw' }, 'search'],
      ['get_legislation', { workId: 'act_public_1989_18', jurisdiction: 'au-nsw' }, 'getWork'],
      [
        'get_legislation_versions',
        { workId: 'act_public_1989_18', jurisdiction: 'au-nsw' },
        'getVersions',
      ],
      [
        'generate_citation',
        { workId: 'act_public_1989_18', style: 'nzmj', jurisdiction: 'au-nsw' },
        'citation',
      ],
      ['export_legislation', { query: 'health', format: 'json', jurisdiction: 'au-nsw' }, 'export'],
    ];

    for (const [toolName, params, feature] of cases) {
      const response = await tools[toolName].handler(params);

      expect(response.isError).toBe(true);
      expect(JSON.parse(response.content[0].text)).toMatchObject({
        error: 'unsupported_provider_capability',
        jurisdiction: 'au-nsw',
        feature,
      });
    }
  });
});
