/**
 * Unit tests for Scraper Cache
 */

import { describe, it, expect, vi } from 'vitest';
import { ScraperCache } from '../../src/utils/scraper-cache.js';

describe('ScraperCache', () => {
  it('should initialize with default options', () => {
    const cache = new ScraperCache();
    expect(cache.getStats().maxSize).toBe(1000);
  });

  it('should set and get values', () => {
    const cache = new ScraperCache();
    cache.set('key1', 'value1');
    expect(cache.get('key1')).toBe('value1');
  });

  it('should track hits and misses', () => {
    const cache = new ScraperCache();
    cache.get('missing');
    expect(cache.getStats().misses).toBe(1);

    cache.set('exists', 'val');
    cache.get('exists');
    expect(cache.getStats().hits).toBe(1);
  });

  it('should use getOrSet to fetch and cache', async () => {
    const cache = new ScraperCache();
    const fetcher = vi.fn().mockResolvedValue('fetched');
    
    const result = await cache.getOrSet('key', fetcher);
    expect(result).toBe('fetched');
    expect(fetcher).toHaveBeenCalledTimes(1);

    // Second call should hit cache
    const result2 = await cache.getOrSet('key', fetcher);
    expect(result2).toBe('fetched');
    expect(fetcher).toHaveBeenCalledTimes(1);
    expect(cache.getStats().hits).toBe(1);
  });

  it('should clear the cache', () => {
    const cache = new ScraperCache();
    cache.set('k1', 'v1');
    cache.clear();
    expect(cache.get('k1')).toBeUndefined();
  });
});
