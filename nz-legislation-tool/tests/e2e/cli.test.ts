/**
 * End-to-End tests for CLI commands
 * Tests complete CLI workflows from user perspective
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { execa } from 'execa';
import { readFileSync, existsSync, unlinkSync } from 'fs';
import { join } from 'path';

const CLI_PATH = join(process.cwd(), 'src', 'cli.ts');
const FIXTURES_DIR = join(process.cwd(), 'tests', 'fixtures');

describe('E2E CLI Tests', () => {
  // Cleanup test files after each test
  afterEach(() => {
    const testFiles = [
      'test-export.csv',
      'test-export-metadata.csv',
    ];
    
    testFiles.forEach(file => {
      const filePath = join(FIXTURES_DIR, file);
      if (existsSync(filePath)) {
        unlinkSync(filePath);
      }
    });
  });
  describe('nzlegislation --help', () => {
    it('should display help text', async () => {
      const { stdout, exitCode } = await execa('tsx', [CLI_PATH, '--help']);
      
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
      const { stdout, exitCode } = await execa('tsx', [CLI_PATH, '--version']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('nz-legislation-tool v');
    });
  });
  
  describe('nzlegislation config --show', () => {
    it('should display configuration', async () => {
      const { stdout, exitCode } = await execa('tsx', [CLI_PATH, 'config', '--show']);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Current Configuration:');
      expect(stdout).toContain('API Key:');
      expect(stdout).toContain('Base URL:');
      expect(stdout).toContain('Rate Limits:');
    });
  });
  
  describe('nzlegislation search', () => {
    it('should search for legislation', async () => {
      const { stdout, exitCode } = await execa('tsx', [
        CLI_PATH,
        'search',
        '--query',
        'health',
        '--limit',
        '5',
      ]);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Work ID');
      expect(stdout).toContain('Title');
      expect(stdout).toContain('Type');
      expect(stdout).toContain('Status');
      expect(stdout).toContain('Date');
    });
    
    it('should search with JSON output', async () => {
      const { stdout, exitCode } = await execa('tsx', [
        CLI_PATH,
        'search',
        '--query',
        'health',
        '--limit',
        '5',
        '--format',
        'json',
      ]);
      
      expect(exitCode).toBe(0);
      const parsed = JSON.parse(stdout);
      expect(parsed).toHaveProperty('results');
      expect(parsed.results).toBeInstanceOf(Array);
    });
    
    it('should handle missing API key gracefully', async () => {
      // This test assumes no API key is set in test environment
      const { stderr, exitCode } = await execa('tsx', [
        CLI_PATH,
        'search',
        '--query',
        'health',
      ], {
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
    it('should export to CSV file', async () => {
      const outputPath = join(process.cwd(), 'tests', 'fixtures', 'test-export.csv');
      
      const { stdout, exitCode } = await execa('tsx', [
        CLI_PATH,
        'export',
        '--query',
        'health',
        '--limit',
        '10',
        '--output',
        outputPath,
      ]);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Exported');
      expect(stdout).toContain('results to');
      
      // Verify file was created
      expect(existsSync(outputPath)).toBe(true);
      
      // Verify CSV content
      const content = readFileSync(outputPath, 'utf-8');
      expect(content).toContain('work_id,title,type,status,date,url,publisher');
      
      // Clean up
      // Note: In real tests, you'd delete the file here
    });
    
    it('should export with metadata', async () => {
      const outputPath = join(process.cwd(), 'tests', 'fixtures', 'test-export-metadata.csv');
      
      const { stdout, exitCode } = await execa('tsx', [
        CLI_PATH,
        'export',
        '--query',
        'health',
        '--limit',
        '5',
        '--output',
        outputPath,
        '--include-metadata',
      ]);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('Metadata: included');
      
      // Verify metadata in file
      const content = readFileSync(outputPath, 'utf-8');
      expect(content).toContain('# Export Metadata');
      expect(content).toContain('# Query:');
      expect(content).toContain('# Timestamp:');
    });
  });
  
  describe('nzlegislation cite', () => {
    it('should generate NZMJ citation', async () => {
      const { stdout, exitCode } = await execa('tsx', [
        CLI_PATH,
        'cite',
        'act_public_1989_18',
        '--style',
        'nzmj',
      ]);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('NZMJ Citation:');
      expect(stdout).toContain('Act');
      expect(stdout).toContain('(NZ)');
    });
    
    it('should generate BibTeX citation', async () => {
      const { stdout, exitCode } = await execa('tsx', [
        CLI_PATH,
        'cite',
        'act_public_1989_18',
        '--style',
        'bibtex',
      ]);
      
      expect(exitCode).toBe(0);
      expect(stdout).toContain('BIBTEX Citation:');
      expect(stdout).toContain('@legislation{');
      expect(stdout).toContain('title = {');
      expect(stdout).toContain('year = {');
    });
  });
  
  describe('Error Handling', () => {
    it('should handle invalid command', async () => {
      const { stderr, exitCode } = await execa('tsx', [
        CLI_PATH,
        'invalid-command',
      ], {
        reject: false,
      });
      
      expect(exitCode).toBe(1);
      expect(stderr).toContain('unknown command');
    });
    
    it('should handle missing required arguments', async () => {
      const { stderr, exitCode } = await execa('tsx', [
        CLI_PATH,
        'search',
      ], {
        reject: false,
      });
      
      expect(exitCode).toBe(1);
      expect(stderr).toContain('required');
    });
  });
});
