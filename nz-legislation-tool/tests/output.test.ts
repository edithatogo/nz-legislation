import { describe, it, expect } from 'vitest';
import { worksToCsv, generateCitation } from '../src/output/index.js';
import type { Work, SearchResults } from '../src/models/index.js';

describe('Output Formatters', () => {
  const mockWork: Work = {
    work_id: 'act_public_1989_18',
    legislation_type: 'act',
    legislation_status: 'in_force',
    administering_agencies: ['Department of Conservation'],
    latest_matching_version: {
      formats: [
        { type: 'html', url: 'https://www.legislation.govt.nz/act/public/1989/18/en/latest/' },
        { type: 'pdf', url: 'https://www.legislation.govt.nz/act/public/1989/18/en/latest.pdf' },
      ],
      is_latest_version: true,
      title: 'Trade in Endangered Species Act 1989',
      version_id: 'act_public_1989_18_en_2026-03-05',
    },
    publisher: 'Parliamentary Counsel Office',
  };

  const mockResults: SearchResults = {
    results: [mockWork],
    page: 1,
    per_page: 20,
    total: 1,
  };

  describe('worksToCsv', () => {
    it('should generate CSV with correct headers', () => {
      const csv = worksToCsv(mockResults);
      expect(csv).toContain('work_id,title,type,status,date,url,publisher');
    });

    it('should include work data in CSV', () => {
      const csv = worksToCsv(mockResults);
      expect(csv).toContain('act_public_1989_18');
      expect(csv).toContain('Trade in Endangered Species Act 1989');
      expect(csv).toContain('act');
      expect(csv).toContain('in_force');
    });

    it('should escape quotes in titles', () => {
      const workWithQuotes: Work = {
        ...mockWork,
        latest_matching_version: {
          ...mockWork.latest_matching_version,
          title: 'Test "Quoted" Act 1989',
        },
      };

      const csv = worksToCsv({ ...mockResults, results: [workWithQuotes] });
      expect(csv).toContain('"Test ""Quoted"" Act 1989"');
    });
  });

  describe('generateCitation', () => {
    it('should generate NZMJ citation', () => {
      const citation = generateCitation(mockWork, 'nzmj');
      expect(citation).toContain('Trade in Endangered Species Act 1989');
      expect(citation).toContain('Public Act 1989 (NZ)');
    });

    it('should generate BibTeX citation', () => {
      const citation = generateCitation(mockWork, 'bibtex');
      expect(citation).toContain('@legislation{act_public_1989_18');
      expect(citation).toContain('title = {Trade in Endangered Species Act 1989}');
      expect(citation).toContain('year = {1989}');
      expect(citation).toContain('type = {act}');
    });

    it('should generate RIS citation', () => {
      const citation = generateCitation(mockWork, 'ris');
      expect(citation).toContain('TY - LEG');
      expect(citation).toContain('ID - act_public_1989_18');
      expect(citation).toContain('TI - Trade in Endangered Species Act 1989');
      expect(citation).toContain('ER -');
    });

    it('should generate APA citation', () => {
      const citation = generateCitation(mockWork, 'apa');
      expect(citation).toContain('Trade in Endangered Species Act 1989');
      expect(citation).toContain('(1989)');
      expect(citation).toContain('Public Act (New Zealand)');
    });

    it('should handle unknown citation style', () => {
      const citation = generateCitation(mockWork, 'invalid');
      expect(citation).toContain('Unknown citation style');
    });
  });
});
