import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

describe('package manifest', () => {
  it('exposes both legacy and ANZ CLI binaries', () => {
    const packageJsonPath = join(process.cwd(), 'package.json');
    const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8')) as {
      bin: Record<string, string>;
    };

    expect(packageJson.bin).toEqual({
      nzlegislation: './dist/cli.js',
      anzlegislation: './dist/cli.js',
      'nzlegislation-mcp': './dist/mcp-cli.js',
      'anzlegislation-mcp': './dist/mcp-cli.js',
    });
  });
});
