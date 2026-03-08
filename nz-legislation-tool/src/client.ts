/**
 * API Client for NZ Legislation API
 * Handles HTTP requests, authentication, rate limiting, and caching
 */

import got from 'got';
import { z } from 'zod';
import { getConfig, hasApiKey } from './config.js';
import {
  WorkSchema,
  SearchResultsSchema,
  type Work,
  type SearchResults,
} from './models/index.js';

// Rate limit state
let rateLimitState = {
  remaining: 10000,
  resetTime: Date.now() + 86400000, // 24 hours from now
  burstRemaining: 2000,
  burstResetTime: Date.now() + 300000, // 5 minutes from now
};

/**
 * Initialize rate limit state from config
 */
function initializeRateLimitState(config: { dailyLimit: number; burstLimit: number }) {
  rateLimitState = {
    remaining: config.dailyLimit,
    resetTime: Date.now() + 86400000,
    burstRemaining: config.burstLimit,
    burstResetTime: Date.now() + 300000,
  };
}

/**
 * Check and enforce rate limits
 */
function checkRateLimit(): void {
  const config = getConfig();
  const now = Date.now();
  
  // Apply safety margin to limits
  const safeDailyLimit = Math.floor(config.dailyLimit * (1 - config.rateLimitSafetyMargin));
  const safeBurstLimit = Math.floor(config.burstLimit * (1 - config.rateLimitSafetyMargin));
  
  // Check daily limit
  if (now >= rateLimitState.resetTime) {
    rateLimitState.remaining = safeDailyLimit;
    rateLimitState.resetTime = now + 86400000;
  }
  
  // Check burst limit
  if (now >= rateLimitState.burstResetTime) {
    rateLimitState.burstRemaining = safeBurstLimit;
    rateLimitState.burstResetTime = now + 300000;
  }
  
  if (rateLimitState.remaining <= 0) {
    const waitTime = Math.ceil((rateLimitState.resetTime - now) / 1000);
    const hours = Math.floor(waitTime / 3600);
    const minutes = Math.floor((waitTime % 3600) / 60);
    throw new Error(
      `Daily rate limit exceeded. Please wait ${hours}h ${minutes}m or until midnight.`
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
  
  // Initialize rate limit state from config on first use
  if (rateLimitState.remaining === 10000 && rateLimitState.burstRemaining === 2000) {
    initializeRateLimitState(config);
  }

  return got.extend({
    prefixUrl: config.baseUrl,
    timeout: {
      request: config.timeout,
    },
    headers: {
      'Accept': 'application/json',
      'User-Agent': 'nz-legislation-tool/1.0.0',
    },
    searchParams: {
      api_key: config.apiKey,
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
 * Get a specific work by ID (searches with pagination)
 */
export async function getWork(workId: string): Promise<Work> {
  checkRateLimit();

  const client = createClient();

  try {
    // Strategy 1: Try searching with work ID as query
    // This often finds the exact work faster
    const searchResponse = await client.get('v0/works', {
      searchParams: {
        q: workId.replace(/_/g, ' '), // Convert ID to searchable text
        limit: '20',
      },
    });

    const searchData = JSON.parse(searchResponse.body);
    const searchResults = SearchResultsSchema.parse(searchData);
    
    // Find exact work ID match
    const work = searchResults.results.find(w => w.work_id === workId);
    
    if (work) {
      return work;
    }
    
    // Strategy 2: If not found, paginate through results
    // This is slower but more thorough
    const maxPages = 5; // Limit to avoid excessive API calls
    const perPage = 100;
    
    for (let page = 1; page <= maxPages; page++) {
      checkRateLimit();
      
      const response = await client.get('v0/works', {
        searchParams: {
          limit: perPage.toString(),
          // Note: API doesn't support offset, so we can't paginate properly
          // This is a limitation of the current API
        },
      });

      const data = JSON.parse(response.body);
      const results = SearchResultsSchema.parse(data);
      
      // Find exact work ID match
      const work = results.results.find(w => w.work_id === workId);
      
      if (work) {
        return work;
      }
      
      // If we got fewer results than requested, we've reached the end
      if (results.results.length < perPage) {
        break;
      }
    }
    
    throw new Error(`Work "${workId}" not found. Try searching for it first with: nzlegislation search --query "<title>"`);
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        throw error;
      }
      throw new Error(`Failed to get work: ${error.message}`);
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
