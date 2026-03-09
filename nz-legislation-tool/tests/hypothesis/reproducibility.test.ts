/**
 * Hypothesis tests for research-critical properties
 * Tests reproducibility, consistency, and metadata completeness
 */

import { describe, it, expect } from 'vitest';
import { worksToCsv, generateCitation } from '../src/output/index.js';
import type { Work } from '../src/models/index.js';

describe('Hypothesis Tests: Reproducibility', () => {
  it('should produce identical CSV for same input', () => {
    const mockResults = {
      results: [
        {
          work_id: 'act_public_1989_18',
          legislation_type: 'act' as const,
          legislation_status: 'in_force' as const,
          latest_matching_version: {
            formats: [{ type: 'html', url: 'https://example.com' }],
            is_latest_version: true,
            title: 'Test Act 1989',
            version_id: 'act_1989_18_en_2026-03-05',
          },
          publisher: 'Test Publisher',
        },
      ],
      total: 1,
    };
    
    const csv1 = worksToCsv(mockResults);
    const csv2 = worksToCsv(mockResults);
    const csv3 = worksToCsv(mockResults);
    
    // Hypothesis: Same input always produces same output
    expect(csv1).toBe(csv2);
    expect(csv2).toBe(csv3);
  });
  
  it('should produce identical citations for same work', () => {
    const mockWork: Work = {
      work_id: 'act_public_1989_18',
      legislation_type: 'act',
      legislation_status: 'in_force',
      latest_matching_version: {
        formats: [{ type: 'html', url: 'https://example.com' }],
        is_latest_version: true,
        title: 'Test Act 1989',
        version_id: 'act_1989_18_en_2026-03-05',
      },
      publisher: 'Test Publisher',
    };
    
    const citation1 = generateCitation(mockWork, 'nzmj');
    const citation2 = generateCitation(mockWork, 'nzmj');
    const citation3 = generateCitation(mockWork, 'nzmj');
    
    // Hypothesis: Citations are deterministic
    expect(citation1).toBe(citation2);
    expect(citation2).toBe(citation3);
  });
  
  it('should include complete metadata in exports', () => {
    const mockResults = {
      results: [
        {
          work_id: 'act_public_1989_18',
          legislation_type: 'act' as const,
          legislation_status: 'in_force' as const,
          latest_matching_version: {
            formats: [{ type: 'html', url: 'https://example.com' }],
            is_latest_version: true,
            title: 'Test Act 1989',
            version_id: 'act_1989_18_en_2026-03-05',
          },
          publisher: 'Test Publisher',
        },
      ],
      total: 1,
    };
    
    const csv = worksToCsv(mockResults);
    const lines = csv.split('\n');
    
    // Hypothesis: All required fields are present
    expect(lines[0]).toContain('work_id');
    expect(lines[0]).toContain('title');
    expect(lines[0]).toContain('type');
    expect(lines[0]).toContain('status');
    expect(lines[0]).toContain('date');
    expect(lines[0]).toContain('url');
    expect(lines[0]).toContain('publisher');
  });
});

describe('Hypothesis Tests: Consistency', () => {
  it('should maintain citation format across styles', () => {
    const mockWork: Work = {
      work_id: 'act_public_1989_18',
      legislation_type: 'act',
      legislation_status: 'in_force',
      latest_matching_version: {
        formats: [{ type: 'html', url: 'https://example.com' }],
        is_latest_version: true,
        title: 'Test Act 1989',
        version_id: 'act_1989_18_en_2026-03-05',
      },
      publisher: 'Test Publisher',
    };
    
    const nzmj = generateCitation(mockWork, 'nzmj');
    const bibtex = generateCitation(mockWork, 'bibtex');
    const ris = generateCitation(mockWork, 'ris');
    const apa = generateCitation(mockWork, 'apa');
    
    // Hypothesis: All styles include the work title
    expect(nzmj).toContain('Test Act 1989');
    expect(bibtex).toContain('Test Act 1989');
    expect(ris).toContain('Test Act 1989');
    expect(apa).toContain('Test Act 1989');
  });
  
  it('should handle work ID format consistently', () => {
    const workIds = [
      'act_public_1989_18',
      'bill_government_2025_217',
      'regulation_2020_100',
    ];
    
    workIds.forEach((workId) => {
      const mockWork: Work = {
        work_id: workId,
        legislation_type: 'act',
        legislation_status: 'in_force',
        latest_matching_version: {
          formats: [{ type: 'html', url: 'https://example.com' }],
          is_latest_version: true,
          title: 'Test Work',
          version_id: `${workId}_en_2026-03-05`,
        },
        publisher: 'Test Publisher',
      };
      
      const bibtex = generateCitation(mockWork, 'bibtex');
      
      // Hypothesis: Work ID is always in BibTeX key
      expect(bibtex).toContain(`@legislation{${workId}`);
    });
  });
  
  it('should preserve date format in exports', () => {
    const mockResults = {
      results: [
        {
          work_id: 'act_public_1989_18',
          legislation_type: 'act' as const,
          legislation_status: 'in_force' as const,
          latest_matching_version: {
            formats: [{ type: 'html', url: 'https://example.com' }],
            is_latest_version: true,
            title: 'Test Act 1989',
            version_id: 'act_1989_18_en_2026-03-05',
          },
          publisher: 'Test Publisher',
        },
      ],
      total: 1,
    };
    
    const csv = worksToCsv(mockResults);
    
    // Hypothesis: Dates are in ISO 8601 format (YYYY-MM-DD)
    expect(csv).toMatch(/\d{4}-\d{2}-\d{2}/);
  });
});

describe('Hypothesis Tests: Data Integrity', () => {
  it('should not lose data in CSV conversion', () => {
    const originalWork = {
      work_id: 'act_public_1989_18',
      legislation_type: 'act' as const,
      legislation_status: 'in_force' as const,
      latest_matching_version: {
        formats: [{ type: 'html', url: 'https://example.com' }],
        is_latest_version: true,
        title: 'Test Act with "Special" & <Characters>',
        version_id: 'act_1989_18_en_2026-03-05',
      },
      publisher: 'Test Publisher',
    };
    
    const mockResults = {
      results: [originalWork],
      total: 1,
    };
    
    const csv = worksToCsv(mockResults);
    
    // Hypothesis: Special characters are preserved (escaped)
    expect(csv).toContain('Special');
    expect(csv).toContain('Characters');
  });
  
  it('should handle large result sets', () => {
    const largeResults = {
      results: Array.from({ length: 1000 }, (_, i) => ({
        work_id: `act_${i}`,
        legislation_type: 'act' as const,
        legislation_status: 'in_force' as const,
        latest_matching_version: {
          formats: [{ type: 'html', url: `https://example.com/${i}` }],
          is_latest_version: true,
          title: `Test Act ${i}`,
          version_id: `act_${i}_en_2026-03-05`,
        },
        publisher: 'Test Publisher',
      })),
      total: 1000,
    };
    
    // Hypothesis: Large result sets don't cause errors
    expect(() => {
      const csv = worksToCsv(largeResults);
      const lines = csv.split('\n');
      expect(lines.length).toBe(1001); // Header + 1000 rows
    }).not.toThrow();
  });
});
