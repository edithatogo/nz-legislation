/**
 * End-to-End tests for CLI commands
 * Tests complete CLI workflows from user perspective
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const CLI_PATH = join(process.cwd(), 'src', 'cli.ts');
const TSX_BIN = join(
  process.cwd(),
  'node_modules',
  '.bin',
  process.platform === 'win32' ? 'tsx.cmd' : 'tsx'
);
const FIXTURES_DIR = join(process.cwd(), 'tests', 'fixtures');
const TEST_API_KEY = process.env.NZ_LEGISLATION_API_KEY;
const itWithApi = TEST_API_KEY ? it : it.skip;

describe('E2E CLI Tests', () => {
  // Cleanup test files after each test
  afterEach(() => {
    const testFiles = ['test-export.csv', 'test-export-metadata.csv'];

    testFiles.forEach(file => {
      const filePath = join(FIXTURES_DIR, file);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    });
  });
  describe('nzlegislation --help', () => {
    it('should display help text', async () => {
      const { stdout, exitCode } = await execa(TSX_BIN, [CLI_PATH, '--help']);

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Search and retrieve New Zealand legislation data');
      expect(stdout).toContain('Commands:');
      expect(stdout).toContain('search');
      expect(stdout).toContain('get');
      expect(stdout).toContain('export');
      expect(stdout).toContain('cite');
      expect(stdout).toContain('config');
    });
  });

  describe('nzlegislation --version', () => {
    it('should display version', async () => {
      const { stdout, exitCode } = await execa(TSX_BIN, [CLI_PATH, '--version']);

      expect(exitCode).toBe(0);
      expect(stdout.trim()).toMatch(/^\d+\.\d+\.\d+$/);
    });
  });

  describe('nzlegislation config --show', () => {
    itWithApi('should display configuration', async () => {
      const { stdout, exitCode } = await execa(TSX_BIN, [CLI_PATH, 'config', '--show'], {
        env: {
          ...process.env,
          NZ_LEGISLATION_API_KEY: TEST_API_KEY,
        },
      });

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Current Configuration:');
      expect(stdout).toContain('API Key:');
      expect(stdout).toContain('Base URL:');
      expect(stdout).toContain('Timeout:');
    });
  });

  describe('nzlegislation search', () => {
    it('should fail clearly for an unimplemented Australian jurisdiction', async () => {
      const { stderr, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'search', '--query', 'health', '--jurisdiction', 'au-comm'],
        {
          reject: false,
          env: {
            NZ_LEGISLATION_API_KEY: '',
          },
        }
      );

      expect(exitCode).toBe(1);
      expect(stderr).toContain("Jurisdiction 'au-comm' is not implemented in this branch yet.");
    });

    itWithApi('should search for legislation', async () => {
      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'search', '--query', 'health', '--limit', '5'],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('ID');
      expect(stdout).toContain('Title');
      expect(stdout).toContain('Type');
      expect(stdout).toContain('Status');
      expect(stdout).toContain('Date');
    });

    itWithApi('should search with JSON output', async () => {
      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'search', '--query', 'health', '--limit', '5', '--format', 'json'],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      const parsed = JSON.parse(stdout);
      expect(parsed).toHaveProperty('results');
      expect(parsed.results).toBeInstanceOf(Array);
    });

    it('should handle missing API key gracefully', async () => {
      // This test assumes no API key is set in test environment
      const { stderr, exitCode } = await execa(TSX_BIN, [CLI_PATH, 'search', '--query', 'health'], {
        reject: false,
        env: {
          NZ_LEGISLATION_API_KEY: '',
        },
      });

      // Should show warning about missing API key
      expect(stderr).toContain('API key');
    });
  });

  describe('nzlegislation export', () => {
    itWithApi('should export to CSV file', async () => {
      const outputPath = join(process.cwd(), 'tests', 'fixtures', 'test-export.csv');

      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'export', '--query', 'health', '--limit', '10', '--output', outputPath],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Exported');
      expect(stdout).toContain('results to');

      // Verify file was created
      expect(existsSync(outputPath)).toBe(true);

      // Verify CSV content
      const content = readFileSync(outputPath, 'utf-8');
      expect(content).toContain('id,title,shortTitle,type,status,date,url,versionCount');

      // Clean up
      // Note: In real tests, you'd delete the file here
    });

    itWithApi('should export with metadata', async () => {
      const outputPath = join(process.cwd(), 'tests', 'fixtures', 'test-export-metadata.csv');

      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [
          CLI_PATH,
          'export',
          '--query',
          'health',
          '--limit',
          '5',
          '--output',
          outputPath,
          '--include-metadata',
        ],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Exported');

      // Verify metadata in file
      const content = readFileSync(outputPath, 'utf-8');
      expect(content).toContain('id,title,shortTitle,type,status,date,url,versionCount');
    });
  });

  describe('nzlegislation cite', () => {
    itWithApi('should generate NZMJ citation', async () => {
      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'cite', 'act_public_1989_18', '--style', 'nzmj'],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('Trade in Endangered Species');
      expect(stdout).toContain('Act');
      expect(stdout).toContain('(NZ)');
    });

    itWithApi('should generate BibTeX citation', async () => {
      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'cite', 'act_public_1989_18', '--style', 'bibtex'],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('@legislation{');
      expect(stdout).toContain('title = {');
      expect(stdout).toContain('year = {');
    });

    itWithApi('should generate RIS citation', async () => {
      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'cite', 'act_public_1989_18', '--style', 'ris'],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('TY - LEG');
      expect(stdout).toContain('TI - Trade in Endangered Species Act 1989');
      expect(stdout).toContain('ER -');
    });

    itWithApi('should generate ENW citation', async () => {
      const { stdout, exitCode } = await execa(
        TSX_BIN,
        [CLI_PATH, 'cite', 'act_public_1989_18', '--style', 'enw'],
        {
          env: {
            ...process.env,
            NZ_LEGISLATION_API_KEY: TEST_API_KEY,
          },
        }
      );

      expect(exitCode).toBe(0);
      expect(stdout).toContain('%0 Statute');
      expect(stdout).toContain('%T Trade in Endangered Species Act 1989');
      expect(stdout).toContain('%Z act_public_1989_18');
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid command', async () => {
      const { stderr, exitCode } = await execa(TSX_BIN, [CLI_PATH, 'invalid-command'], {
        reject: false,
      });

      expect(exitCode).toBe(1);
      expect(stderr).toContain('unknown command');
    });

    it('should handle missing required arguments', async () => {
      const { stderr, exitCode } = await execa(TSX_BIN, [CLI_PATH, 'search'], {
        reject: false,
      });

      expect(exitCode).toBe(1);
      expect(stderr).toContain('required');
    });
  });
});
