/**
 * Integration tests for API client
 * Tests real API integration with mocked responses
 */

import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { clearCache, searchWorks, getWork, getRateLimitStatus } from '../../src/client.ts';

const TEST_API_KEY = 'test-api-key-123456';

// Mock API responses
const mockWork = {
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

const mockSearchResponse = {
  results: [mockWork],
  page: 1,
  per_page: 20,
  total: 1,
};

const mockVersionsResponse = {
  results: [
    {
      work_id: 'act_public_1989_18',
      legislation_type: 'act',
      legislation_status: 'in_force',
      act_status: 'in_force',
      title: 'Trade in Endangered Species Act 1989',
      version_id: 'act_public_1989_18_en_2026-03-05',
      formats: [
        { type: 'html', url: 'https://www.legislation.govt.nz/act/public/1989/18/en/latest/' },
        { type: 'pdf', url: 'https://www.legislation.govt.nz/act/public/1989/18/en/latest.pdf' },
      ],
    },
  ],
  total: 1,
  page: 1,
  per_page: 20,
};

// MSW server setup
const server = setupServer(
  http.get('https://api.legislation.govt.nz/v0/works', ({ request }) => {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('api_key');
    
    // Validate API key
    if (!apiKey || apiKey !== TEST_API_KEY) {
      return HttpResponse.json({ error: 'API key is required' }, { status: 401 });
    }
    
    // Return mock search results
    return HttpResponse.json(mockSearchResponse);
  }),
  
  http.get('https://api.legislation.govt.nz/v0/works/:workId', ({ params, request }) => {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('api_key');
    
    if (!apiKey || apiKey !== TEST_API_KEY) {
      return HttpResponse.json({ error: 'API key is required' }, { status: 401 });
    }
    
    const { workId } = params;
    if (workId === 'act_public_1989_18') {
      return HttpResponse.json(mockWork);
    }
    
    return HttpResponse.json({ error: '404', message: 'Not Found' }, { status: 404 });
  }),

  http.get('https://api.legislation.govt.nz/v0/works/:workId/versions', ({ params, request }) => {
    const url = new URL(request.url);
    const apiKey = url.searchParams.get('api_key');

    if (!apiKey || apiKey !== TEST_API_KEY) {
      return HttpResponse.json({ error: 'API key is required' }, { status: 401 });
    }

    const { workId } = params;
    if (workId === 'act_public_1989_18') {
      return HttpResponse.json(mockVersionsResponse);
    }

    return HttpResponse.json({ error: '404', message: 'Not Found' }, { status: 404 });
  }),
);

describe('API Integration Tests', () => {
  beforeAll(() => {
    // Start server before all tests
    server.listen({ onUnhandledRequest: 'error' });
  });
  
  afterAll(() => {
    // Close server after all tests
    server.close();
  });
  
  beforeEach(() => {
    // Reset handlers before each test
    server.resetHandlers();
    clearCache();
  });
  
  describe('searchWorks', () => {
    it('should search for legislation successfully', async () => {
      const results = await searchWorks({ 
        query: 'health', 
        limit: 5,
      });
      
      expect(results).toBeDefined();
      expect(results.results).toBeInstanceOf(Array);
      expect(results.results.length).toBeGreaterThan(0);
      expect(results.results[0].id).toBe('act_public_1989_18');
    });
    
    it('should handle search with filters', async () => {
      const results = await searchWorks({ 
        query: 'health',
        type: 'act',
        status: 'in-force',
        limit: 10,
      });
      
      expect(results).toBeDefined();
      expect(results.results).toBeInstanceOf(Array);
    });
    
    it('should handle empty results', async () => {
      // Override handler for this test
      server.use(
        http.get('https://api.legislation.govt.nz/v0/works', () => {
          return HttpResponse.json({
            results: [],
            page: 1,
            per_page: 20,
            total: 0,
          });
        }),
      );
      
      const results = await searchWorks({ 
        query: 'nonexistent-query-xyz',
      });
      
      expect(results).toBeDefined();
      expect(results.results).toHaveLength(0);
      expect(results.total).toBe(0);
    });
    
    it('should respect rate limits', async () => {
      // Test that rate limit state is tracked
      const status = getRateLimitStatus();
      
      expect(status).toBeDefined();
      expect(status.remaining).toBeGreaterThan(0);
    });
  });
  
  describe('getWork', () => {
    it('should get work by ID successfully', async () => {
      const work = await getWork('act_public_1989_18');
      
      expect(work).toBeDefined();
      expect(work.id).toBe('act_public_1989_18');
      expect(work.type).toBe('act');
    });
    
  });
});
