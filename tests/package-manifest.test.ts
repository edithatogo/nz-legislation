import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('package manifest', () => {
  it('exposes both legacy and ANZ CLI binaries', () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      bin: Record<string, string>;
    };

    expect(packageJson.bin.nzlegislation).toBe('./dist/cli.js');
    expect(packageJson.bin.anzlegislation).toBe('./dist/cli.js');
    expect(packageJson.bin['nzlegislation-mcp']).toBe('./dist/mcp-cli.js');
    expect(packageJson.bin['anzlegislation-mcp']).toBe('./dist/mcp-cli.js');
  });
});
