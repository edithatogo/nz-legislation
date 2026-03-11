import { afterEach, describe, expect, it } from 'vitest';
import {
  clearCache,
  getRateLimitStatus,
  getWork,
  searchWorks,
  setHttpClientFactoryForTesting,
} from '../src/client.ts';
import { ErrorCode } from '../src/errors.ts';

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

describe('Rate Limiting', () => {
  describe('getRateLimitStatus', () => {
    it('should return rate limit status object', () => {
      const status = getRateLimitStatus();
      expect(status).toBeDefined();
      expect(status).toHaveProperty('remaining');
      expect(status).toHaveProperty('burstRemaining');
      expect(status).toHaveProperty('resetTime');
      expect(status).toHaveProperty('burstResetTime');
    });

    it('should have numeric values', () => {
      const status = getRateLimitStatus();
      expect(typeof status.remaining).toBe('number');
      expect(typeof status.burstRemaining).toBe('number');
    });
  });
});

describe('Client error handling', () => {
  it('should reconstruct a work from the versions endpoint when the direct work endpoint returns 404', async () => {
    setHttpClientFactoryForTesting(() => ({
      get: (url: string) => ({
        json: async () => {
          if (url.endsWith('/v0/works/act_public_1989_18') || url === 'v0/works/act_public_1989_18') {
            throw makeHttpError(
              404,
              'Resource not found. Please check the ID.',
              'https://api.legislation.govt.nz/v0/works/act_public_1989_18',
            );
          }

          if (url.endsWith('/v0/works/act_public_1989_18/versions') || url === 'v0/works/act_public_1989_18/versions') {
            return {
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
                  ],
                },
                {
                  work_id: 'act_public_1989_18',
                  legislation_type: 'act',
                  legislation_status: 'in_force',
                  act_status: 'in_force',
                  title: 'Trade in Endangered Species Act 1989',
                  version_id: 'act_public_1989_18_en_2024-11-25',
                  formats: [
                    { type: 'html', url: 'https://www.legislation.govt.nz/act/public/1989/18/en/2024-11-25/' },
                  ],
                },
              ],
            };
          }

          throw new Error(`Unexpected URL: ${url}`);
        },
      }),
    }));

    await expect(getWork('act_public_1989_18')).resolves.toMatchObject({
      id: 'act_public_1989_18',
      title: 'Trade in Endangered Species Act 1989',
      date: '2026-03-05',
      versionCount: 2,
    });
  });

  it('should convert search 401 responses into API authentication errors', async () => {
    setHttpClientFactoryForTesting(() => ({
      get: () => ({
        json: async () => {
          throw makeHttpError(
            401,
            'Authentication failed. Please check your API key.',
            'https://api.legislation.govt.nz/v0/works',
          );
        },
      }),
    }));

    await expect(searchWorks({ query: 'health' })).rejects.toMatchObject({
      code: ErrorCode.API_AUTHENTICATION_FAILED,
      statusCode: 401,
    });
  });

  it('should convert getWork 404 responses into API not found errors', async () => {
    setHttpClientFactoryForTesting(() => ({
      get: () => ({
        json: async () => {
          throw makeHttpError(
            404,
            'Resource not found. Please check the ID.',
            'https://api.legislation.govt.nz/v0/works/nonexistent-work-id',
          );
        },
      }),
    }));

    await expect(getWork('nonexistent-work-id')).rejects.toMatchObject({
      code: ErrorCode.API_NOT_FOUND,
      statusCode: 404,
    });
  });

  it('should convert getWork 429 responses into API rate limit errors', async () => {
    setHttpClientFactoryForTesting(() => ({
      get: (url: string) => ({
        json: async () => {
          throw makeHttpError(
            429,
            'Rate limit exceeded. Please wait before making more requests.',
            `https://api.legislation.govt.nz/${url.replace(/^\//, '')}`,
          );
        },
      }),
    }));

    await expect(getWork('act_public_1989_18')).rejects.toMatchObject({
      code: ErrorCode.API_RATE_LIMIT_EXCEEDED,
      statusCode: 429,
    });
  });
});
