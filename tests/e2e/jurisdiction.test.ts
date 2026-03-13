/**
 * E2E tests for jurisdiction routing in CLI
 */

import { describe, it, expect } from 'vitest';
import { execa } from 'execa';
import { join } from 'path';

const CLI_PATH = join(process.cwd(), 'src', 'cli.ts');
const TSX_BIN = join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsx.cmd' : 'tsx'
);

describe('CLI Jurisdiction Routing', () => {
  it('should route to Commonwealth jurisdiction', async () => {
    const { stdout, exitCode } = await execa(TSX_BIN, [
      CLI_PATH,
      'get',
      'act/2020/1',
      '--jurisdiction',
      'au-comm',
      '--format',
      'json',
    ]);

    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.jurisdiction).toBe('au-comm');
    expect(parsed.title).toContain('(Cth)');
  });

  it('should route to Queensland jurisdiction', async () => {
    // Queensland requires API key
    const { stdout, exitCode } = await execa(
      TSX_BIN,
      [CLI_PATH, 'get', 'act/2021/5', '-j', 'au-qld', '--format', 'json'],
      {
        env: {
          ...process.env,
          QUEENSLAND_API_KEY: 'test-key',
        },
      }
    );

    expect(exitCode).toBe(0);
    const parsed = JSON.parse(stdout);
    expect(parsed.jurisdiction).toBe('au-qld');
    expect(parsed.title).toContain('(Qld)');
  });

  it('should fail for unknown jurisdiction', async () => {
    const { stderr, exitCode } = await execa(
      TSX_BIN,
      [CLI_PATH, 'get', 'some-id', '--jurisdiction', 'unknown'],
      { reject: false }
    );

    expect(exitCode).toBe(1);
    expect(stderr).toContain('Unknown jurisdiction "unknown"');
  });
});
