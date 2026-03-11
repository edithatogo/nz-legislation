/**
 * Property-based tests for output formatters
 * Uses fast-check to test invariants automatically
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { worksToCsv, generateCitation } from '../../src/output/index.ts';
import type { Work, SearchResults } from '../../src/models/index.ts';

const fallbackWork: Work = {
  id: 'test-work',
  title: 'Fallback Work',
  shortTitle: undefined,
  type: 'act',
  status: 'in-force',
  date: '2026-03-10',
  url: 'https://example.com',
  versionCount: 1,
};

const workArbitrary: fc.Arbitrary<Work> = fc.record({
  id: fc.string({ minLength: 1, maxLength: 50 }),
  title: fc.string({ minLength: 1, maxLength: 200 }),
  shortTitle: fc.option(fc.string({ minLength: 1, maxLength: 100 }), { nil: undefined }),
  type: fc.oneof(
    fc.constant('act'),
    fc.constant('bill'),
    fc.constant('regulation'),
    fc.constant('instrument'),
  ),
  status: fc.oneof(
    fc.constant('in-force'),
    fc.constant('not-yet-in-force'),
    fc.constant('repealed'),
    fc.constant('withdrawn'),
  ),
  date: fc
    .tuple(
      fc.integer({ min: 1900, max: 2099 }),
      fc.integer({ min: 1, max: 12 }),
      fc.integer({ min: 1, max: 28 }),
    )
    .map(([year, month, day]) =>
      `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    ),
  url: fc.webUrl(),
  versionCount: fc.nat({ max: 1000 }),
});

const searchResultsArbitrary: fc.Arbitrary<SearchResults> = fc.record({
  results: fc.array(workArbitrary),
  offset: fc.nat({ max: 1000 }),
  limit: fc.integer({ min: 1, max: 100 }),
  total: fc.nat(),
});

describe('Property-Based Tests: CSV Output', () => {
  it('should always generate valid CSV headers', () => {
    fc.assert(
      fc.property(searchResultsArbitrary, (results) => {
        const csv = worksToCsv(results);
        const lines = csv.split('\n');
        expect(lines[0]).toBe('id,title,shortTitle,type,status,date,url,versionCount');
      }),
    );
  });

  it('should always escape quotes in titles', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary), (works) => {
        const workWithQuotes: Work = {
          ...(works[0] ?? fallbackWork),
          title: 'Test "Quoted" Act',
        };

        const csv = worksToCsv({ results: [workWithQuotes], offset: 0, limit: 1, total: 1 });
        const lines = csv.split('\n');
        expect(lines[1]).toContain('""Quoted""');
      }),
      { numRuns: 100 },
    );
  });

  it('should handle empty optional fields gracefully', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary), (works) => {
        const workWithEmptyFields: Work = {
          ...(works[0] ?? fallbackWork),
          shortTitle: undefined,
        };

        const csv = worksToCsv({ results: [workWithEmptyFields], offset: 0, limit: 1, total: 1 });
        const lines = csv.split('\n');
        expect(lines[0]).toContain('id');
        expect(lines[1]).toBeDefined();
      }),
    );
  });

  it('should handle special characters', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary), (works) => {
        const workWithSpecialChars: Work = {
          ...(works[0] ?? fallbackWork),
          title: 'Test & Special <Chars> "Here"',
        };

        const csv = worksToCsv({ results: [workWithSpecialChars], offset: 0, limit: 1, total: 1 });
        expect(csv).toBeDefined();
        expect(csv.split('\n').length).toBeGreaterThan(1);
      }),
    );
  });

  it('should preserve line count', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary, { minLength: 1, maxLength: 100 }), (works) => {
        const results: SearchResults = {
          results: works,
          offset: 0,
          limit: works.length,
          total: works.length,
        };
        const csv = worksToCsv(results);
        const lines = csv.split('\n');
        expect(lines.length).toBe(works.length + 1);
      }),
    );
  });
});

describe('Property-Based Tests: Citations', () => {
  it('should always include year in NZMJ citations', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        const citation = generateCitation(work, 'nzmj');
        expect(citation).toMatch(/\d{4}/);
      }),
    );
  });

  it('should always generate valid BibTeX structure', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        const citation = generateCitation(work, 'bibtex');
        expect(citation).toContain('@legislation{');
        expect(citation).toContain('title = {');
        expect(citation).toContain('year = {');
        expect(citation).toContain('}');
      }),
    );
  });

  it('should always generate valid RIS structure', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        const citation = generateCitation(work, 'ris');
        expect(citation).toContain('TY - LEG');
        expect(citation).toContain('ER -');
      }),
    );
  });

  it('should generate citations without throwing', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        expect(() => {
          generateCitation(work, 'nzmj');
        }).not.toThrow();
      }),
    );
  });

  it('should produce consistent citations', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        const citation1 = generateCitation(work, 'nzmj');
        const citation2 = generateCitation(work, 'nzmj');
        expect(citation1).toBe(citation2);
      }),
    );
  });
});
