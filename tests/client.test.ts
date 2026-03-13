/**
 * Unit tests for API Client
 */

import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  clearCache,
  getRateLimitStatus,
  getCacheMetrics,
  getWork,
  searchWorks,
  setHttpClientFactoryForTesting,
} from '../src/client.ts';

function makeHttpError(statusCode: number, message: string, url: string) {
  return Object.assign(new Error(message), {
    response: {
      statusCode,
      url,
      headers: {},
    },
  });
}

afterEach(() => {
  clearCache();
  setHttpClientFactoryForTesting();
});

describe('API Client', () => {
  describe('Cache Metrics', () => {
    it('should return cache metrics', () => {
      const metrics = getCacheMetrics();
      expect(metrics).toHaveProperty('hits');
      expect(metrics).toHaveProperty('misses');
      expect(metrics).toHaveProperty('sets');
    });

    it('should track cache sets and hits', async () => {
      const mockData = { total: 1, results: [] };
      setHttpClientFactoryForTesting(() => ({
        get: () => ({
          json: async () => mockData,
        }),
      }));

      // Miss and set
      await searchWorks({ query: 'test' });
      let metrics = getCacheMetrics();
      expect(metrics.misses).toBeGreaterThan(0);
      expect(metrics.sets).toBeGreaterThan(0);

      // Hit
      const initialHits = metrics.hits;
      await searchWorks({ query: 'test' });
      metrics = getCacheMetrics();
      expect(metrics.hits).toBeGreaterThan(initialHits);
    });
  });

  describe('Rate Limiting', () => {
    it('should return rate limit status', () => {
      const status = getRateLimitStatus();
      expect(status).toHaveProperty('remaining');
      expect(status.remaining).toBeTypeOf('number');
    });
  });

  describe('Error Reconstruction', () => {
    it('should reconstruct work from versions on 404', async () => {
      setHttpClientFactoryForTesting(() => ({
        get: (url: string) => ({
          json: async () => {
            if (url.includes('/versions')) {
              return {
                results: [
                  {
                    work_id: 'test-id',
                    title: 'Reconstructed',
                    version_id: 'v1',
                    formats: [],
                  },
                ],
              };
            }
            throw makeHttpError(404, 'Not found', url);
          },
        }),
      }));

      const work = await getWork('test-id');
      expect(work.title).toBe('Reconstructed');
    });
  });
});
