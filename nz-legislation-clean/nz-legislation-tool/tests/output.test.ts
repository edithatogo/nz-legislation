import { describe, it, expect } from 'vitest';
import { worksToCsv, generateCitation } from '../src/output/index.ts';
import type { Work, SearchResults } from '../src/models/index.ts';

describe('Output Formatters', () => {
  const mockWork: Work = {
    id: 'act_public_1989_18',
    title: 'Trade in Endangered Species Act 1989',
    type: 'act',
    status: 'in-force',
    date: '1989-10-15',
    url: 'https://www.legislation.govt.nz/act/public/1989/18/en/latest/',
    versionCount: 12,
  };

  const mockResults: SearchResults = {
    results: [mockWork],
    total: 1,
  };

  describe('worksToCsv', () => {
    it('should generate CSV with correct headers', () => {
      const csv = worksToCsv(mockResults);
      expect(csv).toContain('id,title,shortTitle,type,status,date,url,versionCount');
    });

    it('should include work data in CSV', () => {
      const csv = worksToCsv(mockResults);
      expect(csv).toContain('act_public_1989_18');
      expect(csv).toContain('Trade in Endangered Species Act 1989');
      expect(csv).toContain('act');
      expect(csv).toContain('in-force');
    });

    it('should escape quotes in titles', () => {
      const workWithQuotes: Work = {
        ...mockWork,
        title: 'Test "Quoted" Act 1989',
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
      expect(citation).toContain('CY - New Zealand');
      expect(citation).toContain('ER -');
    });

    it('should generate ENW citation', () => {
      const citation = generateCitation(mockWork, 'enw');
      expect(citation).toContain('%0 Statute');
      expect(citation).toContain('%D 1989');
      expect(citation).toContain('%T Trade in Endangered Species Act 1989');
      expect(citation).toContain('%Z act_public_1989_18');
    });

    it('should prefer the legislation year encoded in the work ID over the latest version date', () => {
      const citation = generateCitation(
        {
          ...mockWork,
          date: '2026-03-05',
        },
        'bibtex',
      );

      expect(citation).toContain('year = {1989}');
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
