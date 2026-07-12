import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

type PackageJson = {
  name: string;
  bin: Record<string, string>;
};

type RustContract = {
  packageName: string;
  cliBinaries: string[];
  mcpBinaries: string[];
  commands: string[];
  providerIdentifiers: string[];
};

type McpContract = {
  tools: string[];
  response_fields: string[];
  provenance_fields: string[];
};

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson;
const contract = JSON.parse(
  readFileSync('tests/fixtures/rust/cli-contracts.json', 'utf8')
) as RustContract;
const mcpContract = JSON.parse(
  readFileSync('tests/fixtures/rust/mcp-contracts.json', 'utf8')
) as McpContract;
const mcpServerSource = readFileSync('src/mcp/server.ts', 'utf8');

describe('Rust migration compatibility contract', () => {
  it('preserves package and executable identities', () => {
    expect(packageJson.name).toBe(contract.packageName);
    for (const binary of contract.cliBinaries) {
      expect(packageJson.bin[binary]).toBe('./dist/cli.js');
    }
    for (const binary of contract.mcpBinaries) {
      expect(packageJson.bin[binary]).toBe('./dist/mcp-cli.js');
    }
  });

  it('keeps the command and provider contract inventory non-empty', () => {
    expect(contract.commands.length).toBeGreaterThan(0);
    expect(contract.providerIdentifiers).toEqual(['nz', 'au-commonwealth', 'au-qld']);
  });

  it('keeps the MCP tool inventory aligned with the TypeScript server', () => {
    const registeredTools = [...mcpServerSource.matchAll(/server\.tool\(\s*'([^']+)'/g)].map(
      match => match[1]
    );
    expect(registeredTools).toEqual(mcpContract.tools);
    expect(mcpContract.response_fields).toContain('provenance');
    expect(mcpContract.provenance_fields).toEqual([
      'sourceAuthority',
      'sourceUrl',
      'retrievedAt',
      'sourceBacked',
    ]);
  });
});
