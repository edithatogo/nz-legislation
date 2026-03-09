/**
 * Property-based tests for output formatters
 * Uses fast-check to test invariants automatically
 */

import { describe, it, expect } from 'vitest';
import * as fc from 'fast-check';
import { worksToCsv, generateCitation } from '../src/output/index.js';
import type { Work, SearchResults } from '../src/models/index.js';

// Arbitrary Work generators
const workArbitrary: fc.Arbitrary<Work> = fc.record({
  work_id: fc.string({ minLength: 1, maxLength: 50 }),
  legislation_type: fc.oneof(
    fc.constant('act'),
    fc.constant('bill'),
    fc.constant('regulation'),
    fc.constant('instrument'),
  ),
  legislation_status: fc.oneof(
    fc.constant('in_force'),
    fc.constant('not_in_force'),
    fc.constant('repealed'),
    fc.constant(null),
  ),
  administering_agencies: fc.array(fc.string()),
  latest_matching_version: fc.record({
    formats: fc.array(fc.record({
      type: fc.string(),
      url: fc.webUrl(),
    })),
    is_latest_version: fc.boolean(),
    title: fc.string({ minLength: 1, maxLength: 200 }),
    version_id: fc.string({ minLength: 1, maxLength: 100 }),
  }),
  publisher: fc.string(),
});

const searchResultsArbitrary: fc.Arbitrary<SearchResults> = fc.record({
  results: fc.array(workArbitrary),
  page: fc.nat({ max: 100 }),
  per_page: fc.nat({ min: 1, max: 100 }),
  total: fc.nat(),
});

describe('Property-Based Tests: CSV Output', () => {
  it('should always generate valid CSV headers', () => {
    fc.assert(
      fc.property(searchResultsArbitrary, (results) => {
        const csv = worksToCsv(results);
        const lines = csv.split('\n');
        
        // First line should always be headers
        expect(lines[0]).toBe('work_id,title,type,status,date,url,publisher');
      }),
    );
  });
  
  it('should always escape quotes in titles', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary), (works) => {
        // Create a work with quotes in title
        const workWithQuotes: Work = {
          ...works[0],
          latest_matching_version: {
            ...works[0]?.latest_matching_version,
            title: 'Test "Quoted" Act',
          },
        };
        
        const csv = worksToCsv({ results: [workWithQuotes], total: 1 });
        const lines = csv.split('\n');
        
        // Quotes should be escaped
        expect(lines[1]).toContain('""Quoted""');
      }),
      { numRuns: 100 },
    );
  });
  
  it('should handle empty fields gracefully', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary), (works) => {
        const workWithEmptyFields: Work = {
          ...works[0],
          administering_agencies: [],
          publisher: '',
          legislation_status: null,
        };
        
        const csv = worksToCsv({ results: [workWithEmptyFields], total: 1 });
        const lines = csv.split('\n');
        
        // Should still generate valid CSV with empty fields
        expect(lines[0]).toContain('work_id');
        expect(lines[1]).toBeDefined();
      }),
    );
  });
  
  it('should handle special characters', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary), (works) => {
        const workWithSpecialChars: Work = {
          ...works[0],
          latest_matching_version: {
            ...works[0]?.latest_matching_version,
            title: 'Test & Special <Chars> "Here"',
          },
        };
        
        const csv = worksToCsv({ results: [workWithSpecialChars], total: 1 });
        
        // CSV should be valid (no parsing errors)
        expect(csv).toBeDefined();
        expect(csv.split('\n').length).toBeGreaterThan(1);
      }),
    );
  });
  
  it('should preserve line count', () => {
    fc.assert(
      fc.property(fc.array(workArbitrary, { minLength: 1, maxLength: 100 }), (works) => {
        const results = { results: works, total: works.length };
        const csv = worksToCsv(results);
        const lines = csv.split('\n');
        
        // Header + data rows
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
        
        // NZMJ citations should always contain a year
        expect(citation).toMatch(/\d{4}/);
      }),
    );
  });
  
  it('should always generate valid BibTeX structure', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        const citation = generateCitation(work, 'bibtex');
        
        // BibTeX should have required structure
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
        
        // RIS should have required structure
        expect(citation).toContain('TY - LEG');
        expect(citation).toContain('ER -');
      }),
    );
  });
  
  it('should handle missing version info gracefully', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        const workWithoutVersion: Work = {
          ...work,
          latest_matching_version: undefined,
        };
        
        // Should not throw
        expect(() => {
          generateCitation(workWithoutVersion, 'nzmj');
        }).not.toThrow();
      }),
    );
  });
  
  it('should produce consistent citations', () => {
    fc.assert(
      fc.property(workArbitrary, (work) => {
        const citation1 = generateCitation(work, 'nzmj');
        const citation2 = generateCitation(work, 'nzmj');
        
        // Same work should produce same citation
        expect(citation1).toBe(citation2);
      }),
    );
  });
});
