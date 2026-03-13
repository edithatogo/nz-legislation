/**
 * Integration tests for Australian Legislation Providers
 * Tests Commonwealth and Queensland provider integration with mocked responses
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { CommonwealthProvider } from '../../src/providers/commonwealth-provider.js';
import { QueenslandProvider } from '../../src/providers/queensland-provider.js';

const CTH_API_KEY = 'test-cth-key';
const QLD_API_KEY = 'test-qld-key';

// Mock Commonwealth API response
const mockCthSearchResponse = {
  total: 1,
  results: [
    {
      id: 'act/2020/1',
      title: 'Test Act 2020',
      type: 'act',
      year: 2020,
      number: 1,
      status: 'in-force'
    }
  ],
  limit: 25,
  offset: 0
};

// Mock Queensland API response
const mockQldSearchResponse = {
  total: 1,
  results: [
    {
      id: 'act/2021/5',
      title: 'QLD Health Act 2021',
      type: 'act',
      year: 2021,
      number: 5,
      status: 'in-force'
    }
  ],
  limit: 25,
  offset: 0
};

// MSW server setup
const server = setupServer(
  // Commonwealth Search Mock
  http.get('https://api.prod.legislation.gov.au/v1/search', ({ request }) => {
    // Note: CommonwealthProvider currently has a placeholder searchImpl returning empty
    return HttpResponse.json(mockCthSearchResponse);
  }),
  
  // Queensland Search Mock
  http.get('https://api.legislation.qld.gov.au/v1/search', ({ request }) => {
    const authHeader = request.headers.get('X-API-Key');
    if (!authHeader || authHeader !== QLD_API_KEY) {
      return HttpResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    return HttpResponse.json(mockQldSearchResponse);
  }),

  // Health Checks
  http.head('https://api.prod.legislation.gov.au/v1/constitution', () => {
    return new HttpResponse(null, { status: 200 });
  }),
  
  http.head('https://api.legislation.qld.gov.au/v1/health', () => {
    return new HttpResponse(null, { status: 200 });
  })
);

describe('Australian Providers Integration', () => {
  beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
  afterAll(() => server.close());
  beforeEach(() => server.resetHandlers());

  describe('CommonwealthProvider', () => {
    const provider = new CommonwealthProvider(CTH_API_KEY);

    it('should identify as au-comm', () => {
      expect(provider.getJurisdiction()).toBe('au-comm');
      expect(provider.getDisplayName()).toContain('Commonwealth');
    });

    it('should perform health check', async () => {
      await expect(provider.healthCheck()).resolves.not.toThrow();
    });

    it('should throw error when searching (in development)', async () => {
      await expect(provider.search({ query: 'privacy' })).rejects.toThrow('Commonwealth search is currently in development');
    });

    it('should generate australian style citations', () => {
      const mockWork = {
        work_id: 'act/2020/1',
        title: 'Test Act 2020',
        type: 'act',
        year: 2020,
        number: 1,
        jurisdiction: 'au-comm',
        status: 'in-force',
        versions: [],
        citations: {}
      };
      const citation = provider.getCitation(mockWork as any, 'australian');
      expect(citation).toBe('Test Act 2020 (2020) au-comm');
    });
    
    it('should return a work by ID (placeholder logic)', async () => {
      const work = await provider.getWork('act/2020/1');
      expect(work.work_id).toBe('act/2020/1');
      expect(work.jurisdiction).toBe('au-comm');
    });
  });

  describe('QueenslandProvider', () => {
    const provider = new QueenslandProvider(QLD_API_KEY);

    it('should identify as au-qld', () => {
      expect(provider.getJurisdiction()).toBe('au-qld');
      expect(provider.getDisplayName()).toBe('Queensland');
    });

    it('should perform health check', async () => {
      await expect(provider.healthCheck()).resolves.not.toThrow();
    });

    it('should throw error when searching without API key', async () => {
      const noKeyProvider = new QueenslandProvider();
      await expect(noKeyProvider.search({ query: 'health' })).rejects.toThrow('Queensland API key is required');
    });

    it('should throw error when searching (in development)', async () => {
      await expect(provider.search({ query: 'health' })).rejects.toThrow('Queensland search is currently in development');
    });

    it('should throw error when getting work without API key', async () => {
      const noKeyProvider = new QueenslandProvider();
      await expect(noKeyProvider.getWork('act-2006-060')).rejects.toThrow('Queensland API key is required');
    });

    it('should throw error when getting versions without API key', async () => {
      const noKeyProvider = new QueenslandProvider();
      await expect(noKeyProvider.getVersions('act-2006-060')).rejects.toThrow('Queensland API key is required');
    });

    it('should generate australian style citations', () => {
      const mockWork = {
        work_id: 'act/2021/5',
        title: 'QLD Health Act 2021',
        type: 'act',
        year: 2021,
        number: 5,
        jurisdiction: 'au-qld',
        status: 'in-force',
        versions: [],
        citations: {}
      };
      const citation = provider.getCitation(mockWork as any, 'australian');
      expect(citation).toBe('QLD Health Act 2021 (2021) au-qld');
    });
  });
});
