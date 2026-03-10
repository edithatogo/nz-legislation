/**
 * API Client for NZ Legislation API
 * Handles HTTP requests, authentication, rate limiting, and caching
 */

import { LRUCache } from 'lru-cache';
import got from 'got';
import { z } from 'zod';

import { getConfig } from '@config';
import {
  createApiError,
  NetworkError,
} from '@errors';
import { logger } from '@utils/logger';
import {
  LegislationVersionSchema,
  SearchResultsSchema,
  VersionSchema,
  WorkSchema,
  type LegislationVersion,
  type SearchResults,
  type Version,
  type Work,
} from '@models';

/**
 * Cache entry with metadata
 */
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

/**
 * Cache configuration
 */
const CACHE_CONFIG = {
  // Max number of entries
  max: 500,
  // Default TTL: 1 hour
  defaultTTL: 60 * 60 * 1000,
  // TTL for search results: 30 minutes
  searchTTL: 30 * 60 * 1000,
  // TTL for work details: 2 hours
  workTTL: 2 * 60 * 60 * 1000,
  // TTL for versions: 1 hour
  versionsTTL: 60 * 60 * 1000,
};

/**
 * LRU Cache for API responses
 */
const cache = new LRUCache<string, CacheEntry<unknown>>({
  max: CACHE_CONFIG.max,
  ttl: CACHE_CONFIG.defaultTTL,
  updateAgeOnGet: false,
  allowStale: false,
});

/**
 * Rate limit state
 */
const rateLimitState = {
  remaining: 10000,
  resetTime: Date.now() + 86400000, // 24 hours from now
  burstRemaining: 2000,
  burstResetTime: Date.now() + 300000, // 5 minutes from now
};

/**
 * Request batching queue
 */
interface BatchRequest {
  key: string;
  resolve: (value: unknown) => void;
  reject: (reason: Error) => void;
}

const batchQueue = new Map<string, BatchRequest[]>();
const batchTimeout = 50; // ms to wait before executing batch

/**
 * Generate cache key from request parameters
 */
function generateCacheKey(endpoint: string, params?: Record<string, string>): string {
  const paramString = params ? JSON.stringify(params) : '';
  return `${endpoint}:${paramString}`;
}

/**
 * Get data from cache
 */
function getFromCache<T>(key: string): T | null {
  const entry = cache.get(key) as CacheEntry<T> | undefined;
  if (!entry) {
    return null;
  }
  
  const age = Date.now() - entry.timestamp;
  if (age > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  logger.debug('Cache hit', { key, age: `${age}ms` });
  return entry.data;
}

/**
 * Set data in cache
 */
function setInCache<T>(key: string, data: T, ttl: number): void {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
  logger.debug('Cache set', { key, ttl: `${ttl}ms` });
}

/**
 * Clear cache (optionally by pattern)
 */
export function clearCache(pattern?: string): void {
  if (!pattern) {
    cache.clear();
    logger.info('Cache cleared');
    return;
  }
  
  const keys = cache.keys();
  for (const key of keys) {
    if (key.includes(pattern)) {
      cache.delete(key);
    }
  }
  logger.info('Cache cleared', { pattern });
}

/**
 * Get cache statistics
 */
export function getCacheStats() {
  return {
    size: cache.size,
    maxSize: CACHE_CONFIG.max,
    keys: Array.from(cache.keys()).slice(0, 10), // First 10 keys
  };
}

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
  const cacheKey = generateCacheKey('search', params as Record<string, string>);
  
  // Try cache first
  const cached = getFromCache<SearchResults>(cacheKey);
  if (cached) {
    return cached;
  }

  logger.startTimer('searchWorks');
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

    const result = SearchResultsSchema.parse(data);
    
    // Cache the result
    setInCache(cacheKey, result, CACHE_CONFIG.searchTTL);
    
    const duration = logger.endTimer('searchWorks');
    logger.debug('Search completed', { 
      results: result.results.length, 
      total: result.total,
      duration: `${duration}ms` 
    });
    
    return result;
  } catch (error) {
    logger.error('Search failed', error instanceof Error ? error : undefined, { params });
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
  const cacheKey = generateCacheKey('work', { id: workId });
  
  // Try cache first
  const cached = getFromCache<Work>(cacheKey);
  if (cached) {
    return cached;
  }

  logger.startTimer('getWork');
  checkRateLimit();

  const client = createClient();

  try {
    const data = await client.get(`v0/works/${workId}`).json();
    const result = WorkSchema.parse(data);
    
    // Cache the result
    setInCache(cacheKey, result, CACHE_CONFIG.workTTL);
    
    const duration = logger.endTimer('getWork');
    logger.debug('Work retrieved', { workId, duration: `${duration}ms` });
    
    return result;
  } catch (error) {
    logger.error('Failed to get work', error instanceof Error ? error : undefined, { workId });
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
  const cacheKey = generateCacheKey('versions', { workId });
  
  // Try cache first
  const cached = getFromCache<Version[]>(cacheKey);
  if (cached) {
    return cached;
  }

  logger.startTimer('getWorkVersions');
  checkRateLimit();

  const client = createClient();

  try {
    const data = await client.get(`v0/works/${workId}/versions`).json();
    const result = z.array(VersionSchema).parse(data);
    
    // Cache the result
    setInCache(cacheKey, result, CACHE_CONFIG.versionsTTL);
    
    const duration = logger.endTimer('getWorkVersions');
    logger.debug('Versions retrieved', { workId, count: result.length, duration: `${duration}ms` });
    
    return result;
  } catch (error) {
    logger.error('Failed to get versions', error instanceof Error ? error : undefined, { workId });
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
  const cacheKey = generateCacheKey('version', { versionId });
  
  // Try cache first
  const cached = getFromCache<LegislationVersion>(cacheKey);
  if (cached) {
    return cached;
  }

  logger.startTimer('getVersion');
  checkRateLimit();

  const client = createClient();

  try {
    const data = await client.get(`v0/versions/${versionId}`).json();
    const result = LegislationVersionSchema.parse(data);
    
    // Cache the result
    setInCache(cacheKey, result, CACHE_CONFIG.versionsTTL);
    
    const duration = logger.endTimer('getVersion');
    logger.debug('Version retrieved', { versionId, duration: `${duration}ms` });
    
    return result;
  } catch (error) {
    logger.error('Failed to get version', error instanceof Error ? error : undefined, { versionId });
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
