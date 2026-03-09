/**
 * API Client for NZ Legislation API
 * Handles HTTP requests, authentication, rate limiting, and caching
 */

import got from 'got';
import { z } from 'zod';

import { getConfig } from './config.js';
import {
  createApiError,
  NetworkError,
} from './errors.js';
import {
  LegislationVersionSchema,
  SearchResultsSchema,
  VersionSchema,
  WorkSchema,
  type LegislationVersion,
  type SearchResults,
  type Version,
  type Work,
} from './models/index.js';

// Rate limit state
const rateLimitState = {
  remaining: 10000,
  resetTime: Date.now() + 86400000, // 24 hours from now
  burstRemaining: 2000,
  burstResetTime: Date.now() + 300000, // 5 minutes from now
};

/**
 * Check and enforce rate limits
 */
function checkRateLimit(): void {
  const now = Date.now();

  // Check daily limit
  if (now >= rateLimitState.resetTime) {
    rateLimitState.remaining = 10000;
    rateLimitState.resetTime = now + 86400000;
  }

  // Check burst limit
  if (now >= rateLimitState.burstResetTime) {
    rateLimitState.burstRemaining = 2000;
    rateLimitState.burstResetTime = now + 300000;
  }

  if (rateLimitState.remaining <= 0) {
    const waitTime = Math.ceil((rateLimitState.resetTime - now) / 1000);
    throw new Error(
      `Daily rate limit exceeded. Please wait ${waitTime} seconds or until midnight.`
    );
  }

  if (rateLimitState.burstRemaining <= 0) {
    const waitTime = Math.ceil((rateLimitState.burstResetTime - now) / 1000);
    throw new Error(
      `Burst rate limit exceeded. Please wait ${waitTime} seconds.`
    );
  }
}

/**
 * Helper to get a single header value (handles string[])
 */
function getHeaderValue(headers: Record<string, string | string[] | undefined>, name: string): string | undefined {
  const value = headers[name];
  if (Array.isArray(value)) {
    return value[0];
  }
  return value;
}

/**
 * Update rate limit state from response headers
 */
function updateRateLimitState(headers: Record<string, string | string[] | undefined>): void {
  const remaining = getHeaderValue(headers, 'x-ratelimit-remaining');
  const reset = getHeaderValue(headers, 'x-ratelimit-reset');
  const burstRemaining = getHeaderValue(headers, 'x-burst-remaining');
  const burstReset = getHeaderValue(headers, 'x-burst-reset');

  if (remaining) {
    rateLimitState.remaining = parseInt(remaining, 10);
  }
  if (reset) {
    rateLimitState.resetTime = parseInt(reset, 10) * 1000;
  }
  if (burstRemaining) {
    rateLimitState.burstRemaining = parseInt(burstRemaining, 10);
  }
  if (burstReset) {
    rateLimitState.burstResetTime = parseInt(burstReset, 10) * 1000;
  }
}

/**
 * Create HTTP client with proper configuration
 */
function createClient() {
  const config = getConfig();

  return got.extend({
    prefixUrl: config.baseUrl,
    timeout: { request: config.timeout },
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'nz-legislation-tool/1.0.0',
    },
    searchParams: {
      apikey: config.apiKey,
    },
    retry: {
      limit: 3,
      methods: ['get'],
      statusCodes: [408, 413, 429, 500, 502, 503, 504],
      calculateDelay: ({ attemptCount, error }) => {
        if (error.response?.statusCode === 429) {
          const retryAfter = getHeaderValue(error.response.headers, 'retry-after');
          if (retryAfter) {
            return parseInt(retryAfter, 10) * 1000;
          }
        }
        // Exponential backoff: 1s, 2s, 4s
        return Math.pow(2, attemptCount - 1) * 1000;
      },
    },
    hooks: {
      afterResponse: [
        (response) => {
          updateRateLimitState(response.headers);
          return response;
        },
      ],
      beforeError: [
        (error) => {
          // Add helpful context to errors
          if (error.response?.statusCode === 401) {
            error.message = 'Authentication failed. Please check your API key.';
          } else if (error.response?.statusCode === 404) {
            error.message = 'Resource not found. Please check the ID.';
          } else if (error.response?.statusCode === 429) {
            error.message = 'Rate limit exceeded. Please wait before making more requests.';
          }
          return error;
        },
      ],
    },
  });
}

/**
 * Search for legislation works
 */
export async function searchWorks(params: {
  query?: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}): Promise<SearchResults> {
  checkRateLimit();

  const client = createClient();

  try {
    const data = await client.get('v0/works', {
      searchParams: {
        ...(params.query && { q: params.query }),
        ...(params.type && { type: params.type }),
        ...(params.status && { status: params.status }),
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.offset && { offset: params.offset.toString() }),
      },
    }).json();

    return SearchResultsSchema.parse(data);
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    if (error instanceof Error && 'response' in error) {
      const apiError = error as { response?: { statusCode?: number; url?: string } };
      if (apiError.response) {
        throw createApiError(
          apiError.response.statusCode || 500,
          apiError.response.url || 'unknown',
          `Search failed: ${error.message}`,
        );
      }
    }
    throw new Error(`Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a specific work by ID
 */
export async function getWork(workId: string): Promise<Work> {
  checkRateLimit();

  const client = createClient();

  try {
    const data = await client.get(`v0/works/${workId}`).json();
    return WorkSchema.parse(data);
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    if (error instanceof Error && 'response' in error) {
      const apiError = error as { response?: { statusCode?: number; url?: string } };
      if (apiError.response) {
        throw createApiError(
          apiError.response.statusCode || 500,
          apiError.response.url || 'unknown',
          `Failed to get work: ${error.message}`,
        );
      }
    }
    throw new Error(`Failed to get work: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get all versions of a work
 */
export async function getWorkVersions(workId: string): Promise<Version[]> {
  checkRateLimit();

  const client = createClient();

  try {
    const data = await client.get(`v0/works/${workId}/versions`).json();
    return z.array(VersionSchema).parse(data);
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    if (error instanceof Error && 'response' in error) {
      const apiError = error as { response?: { statusCode?: number; url?: string } };
      if (apiError.response) {
        throw createApiError(
          apiError.response.statusCode || 500,
          apiError.response.url || 'unknown',
          `Failed to get versions: ${error.message}`,
        );
      }
    }
    throw new Error(`Failed to get versions: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get a specific version of a work
 */
export async function getVersion(versionId: string): Promise<LegislationVersion> {
  checkRateLimit();

  const client = createClient();

  try {
    const data = await client.get(`v0/versions/${versionId}`).json();
    return LegislationVersionSchema.parse(data);
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error;
    }
    if (error instanceof Error && 'response' in error) {
      const apiError = error as { response?: { statusCode?: number; url?: string } };
      if (apiError.response) {
        throw createApiError(
          apiError.response.statusCode || 500,
          apiError.response.url || 'unknown',
          `Failed to get version: ${error.message}`,
        );
      }
    }
    throw new Error(`Failed to get version: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Get rate limit status
 */
export function getRateLimitStatus() {
  return {
    remaining: rateLimitState.remaining,
    resetTime: new Date(rateLimitState.resetTime),
    burstRemaining: rateLimitState.burstRemaining,
    burstResetTime: new Date(rateLimitState.burstResetTime),
  };
}
