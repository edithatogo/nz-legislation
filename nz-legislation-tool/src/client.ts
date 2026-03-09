/**
 * API Client for NZ Legislation API
 * Handles HTTP requests, authentication, rate limiting, and caching
 */

import got from 'got';
import { z } from 'zod';
import { getConfig, hasApiKey } from '../config.js';
import {
  WorkSchema,
  VersionSchema,
  SearchResultsSchema,
  LegislationVersionSchema,
  type Work,
  type Version,
  type SearchResults,
  type LegislationVersion,
} from '../models/index.js';

// Rate limit state
let rateLimitState = {
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
 * Update rate limit state from response headers
 */
function updateRateLimitState(headers: Record<string, string | undefined>): void {
  if (headers['x-ratelimit-remaining']) {
    rateLimitState.remaining = parseInt(headers['x-ratelimit-remaining'], 10);
  }
  if (headers['x-ratelimit-reset']) {
    rateLimitState.resetTime = parseInt(headers['x-ratelimit-reset'], 10) * 1000;
  }
  if (headers['x-burst-remaining']) {
    rateLimitState.burstRemaining = parseInt(headers['x-burst-remaining'], 10);
  }
  if (headers['x-burst-reset']) {
    rateLimitState.burstResetTime = parseInt(headers['x-burst-reset'], 10) * 1000;
  }
}

/**
 * Create HTTP client with proper configuration
 */
function createClient() {
  const config = getConfig();

  return got.extend({
    prefixUrl: config.baseUrl,
    timeout: config.timeout,
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
          const retryAfter = error.response.headers['retry-after'];
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
    const response = await client.get('v0/works', {
      searchParams: {
        ...(params.query && { q: params.query }),
        ...(params.type && { type: params.type }),
        ...(params.status && { status: params.status }),
        ...(params.from && { from: params.from }),
        ...(params.to && { to: params.to }),
        ...(params.limit && { limit: params.limit.toString() }),
        ...(params.offset && { offset: params.offset.toString() }),
      },
    });

    const data = JSON.parse(response.body);
    return SearchResultsSchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Search failed: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get a specific work by ID
 */
export async function getWork(workId: string): Promise<Work> {
  checkRateLimit();

  const client = createClient();

  try {
    const response = await client.get(`v0/works/${workId}`);
    const data = JSON.parse(response.body);
    return WorkSchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get work: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get all versions of a work
 */
export async function getWorkVersions(workId: string): Promise<Version[]> {
  checkRateLimit();

  const client = createClient();

  try {
    const response = await client.get(`v0/works/${workId}/versions`);
    const data = JSON.parse(response.body);
    return z.array(VersionSchema).parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get versions: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Get a specific version of a work
 */
export async function getVersion(versionId: string): Promise<LegislationVersion> {
  checkRateLimit();

  const client = createClient();

  try {
    const response = await client.get(`v0/versions/${versionId}`);
    const data = JSON.parse(response.body);
    return LegislationVersionSchema.parse(data);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to get version: ${error.message}`);
    }
    throw error;
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
