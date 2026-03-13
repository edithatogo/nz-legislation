/**
 * Hypothesis tests for research-critical properties
 * Tests reproducibility, consistency, and metadata completeness
 */

import { describe, it, expect } from 'vitest';
import { worksToCsv, generateCitation } from '../../src/output/index.ts';
import type { Work, SearchResults } from '../../src/models/index.ts';

const mockWork: Work = {
  id: 'act_public_1989_18',
  title: 'Test Act 1989',
  type: 'act',
  status: 'in-force',
  date: '2026-03-05',
  url: 'https://example.com',
  versionCount: 1,
};

const mockResults: SearchResults = {
  results: [mockWork],
  offset: 0,
  limit: 20,
  total: 1,
};

describe('Hypothesis Tests: Reproducibility', () => {
  it('should produce identical CSV for same input', () => {
    const csv1 = worksToCsv(mockResults);
    const csv2 = worksToCsv(mockResults);
    const csv3 = worksToCsv(mockResults);

    expect(csv1).toBe(csv2);
    expect(csv2).toBe(csv3);
  });

  it('should produce identical citations for same work', () => {
    const citation1 = generateCitation(mockWork, 'nzmj');
    const citation2 = generateCitation(mockWork, 'nzmj');
    const citation3 = generateCitation(mockWork, 'nzmj');

    expect(citation1).toBe(citation2);
    expect(citation2).toBe(citation3);
  });

  it('should include complete metadata in exports', () => {
    const csv = worksToCsv(mockResults);
    const lines = csv.split('\n');

    expect(lines[0]).toContain('id');
    expect(lines[0]).toContain('title');
    expect(lines[0]).toContain('type');
    expect(lines[0]).toContain('status');
    expect(lines[0]).toContain('date');
    expect(lines[0]).toContain('url');
    expect(lines[0]).toContain('versionCount');
  });
});

describe('Hypothesis Tests: Consistency', () => {
  it('should maintain citation format across styles', () => {
    const nzmj = generateCitation(mockWork, 'nzmj');
    const bibtex = generateCitation(mockWork, 'bibtex');
    const ris = generateCitation(mockWork, 'ris');
    const enw = generateCitation(mockWork, 'enw');
    const apa = generateCitation(mockWork, 'apa');

    expect(nzmj).toContain('Test Act 1989');
    expect(bibtex).toContain('Test Act 1989');
    expect(ris).toContain('Test Act 1989');
    expect(enw).toContain('Test Act 1989');
    expect(apa).toContain('Test Act 1989');
  });

  it('should handle work ID format consistently', () => {
    const workIds = ['act_public_1989_18', 'bill_government_2025_217', 'regulation_2020_100'];

    workIds.forEach(workId => {
      const work: Work = {
        ...mockWork,
        id: workId,
      };

      const bibtex = generateCitation(work, 'bibtex');
      expect(bibtex).toContain(`@legislation{${workId}`);
    });
  });

  it('should preserve date format in exports', () => {
    const csv = worksToCsv(mockResults);
    expect(csv).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});

describe('Hypothesis Tests: Data Integrity', () => {
  it('should not lose data in CSV conversion', () => {
    const originalWork: Work = {
      ...mockWork,
      title: 'Test Act with "Special" & <Characters>',
    };

    const csv = worksToCsv({
      results: [originalWork],
      offset: 0,
      limit: 20,
      total: 1,
    });

    expect(csv).toContain('Special');
    expect(csv).toContain('Characters');
  });

  it('should handle large result sets', () => {
    const largeResults: SearchResults = {
      results: Array.from({ length: 1000 }, (_, i) => ({
        id: `act_${i}`,
        title: `Test Act ${i}`,
        type: 'act',
        status: 'in-force',
        date: '2026-03-05',
        url: `https://example.com/${i}`,
        versionCount: 1,
      })),
      offset: 0,
      limit: 1000,
      total: 1000,
    };

    expect(() => {
      const csv = worksToCsv(largeResults);
      const lines = csv.split('\n');
      expect(lines.length).toBe(1001);
    }).not.toThrow();
  });
});
