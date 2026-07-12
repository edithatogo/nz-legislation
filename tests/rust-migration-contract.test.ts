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

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson;
const contract = JSON.parse(
  readFileSync('tests/fixtures/rust/cli-contracts.json', 'utf8')
) as RustContract;

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
});
