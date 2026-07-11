import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type PackageJson = { name: string; bin: Record<string, string> };
type Matrix = {
  displayName: string;
  packageIdentifier: string;
  stableIdentifiers: string[];
  transitionAliases: string[];
  neutralAdditiveAliases: string[];
};

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as PackageJson;
const matrix = JSON.parse(
  readFileSync('docs/maintainers/legislation-identifier-matrix.json', 'utf8')
) as Matrix;

describe('legislation brand migration compatibility', () => {
  it('keeps the neutral display identity separate from package identity', () => {
    expect(matrix.displayName).toBe('legislation');
    expect(matrix.packageIdentifier).toBe(packageJson.name);
    expect(packageJson.name).toBe('nz-legislation-tool');
  });

  it('keeps stable, transition, and neutral aliases at parity', () => {
    const cliAliases = [
      ...matrix.stableIdentifiers,
      ...matrix.transitionAliases,
      ...matrix.neutralAdditiveAliases,
    ].filter(name => !name.endsWith('-mcp') && name !== 'nz-legislation-tool');
    for (const binary of cliAliases) {
      expect(packageJson.bin[binary]).toBe('./dist/cli.js');
    }
    expect(packageJson.bin['nzlegislation-mcp']).toBe('./dist/mcp-cli.js');
    expect(packageJson.bin['anzlegislation-mcp']).toBe('./dist/mcp-cli.js');
    expect(packageJson.bin['legislation-mcp']).toBe('./dist/mcp-cli.js');
  });
});
