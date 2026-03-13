/**
 * Scraper Caching Utility
 * 
 * LRU caching for scraper results to improve performance and
 * reduce load on legislation websites.
 */

import { LRUCache } from 'lru-cache';

export interface CachedResult<T = any> {
  data: T;
  timestamp: Date;
  ttl: number; // ms
  hits: number;
  source: string;
}

export interface CacheStats {
  size: number;
  maxSize: number;
  hits: number;
  misses: number;
  hitRate: number; // percentage
  evictions: number;
  averageAge: number; // ms
}

export interface ScraperCacheOptions {
  max?: number; // Max entries (default: 1000)
  ttl?: number; // Default TTL in ms (default: 24 hours)
  jurisdiction?: string; // For stats
}

export class ScraperCache<T = any> {
  private cache: LRUCache<string, CachedResult<T>>;
  private defaultTTL: number;
  private hits: number = 0;
  private misses: number = 0;
  private jurisdiction: string;

  constructor(options: ScraperCacheOptions = {}) {
    this.defaultTTL = options.ttl ?? 24 * 60 * 60 * 1000; // 24 hours
    this.jurisdiction = options.jurisdiction ?? 'unknown';

    this.cache = new LRUCache({
      max: options.max ?? 1000,
      ttl: this.defaultTTL,
      updateAgeOnGet: false,
      allowStale: false,
      dispose: (value, key) => {
        // Called when item is evicted
        console.debug(`Cache eviction: ${key} (age: ${Date.now() - value.timestamp.getTime()}ms)`);
      },
    });
  }

  /**
   * Get from cache or fetch and cache
   */
  async getOrSet(key: string, fetcher: () => Promise<T>, ttl?: number): Promise<T> {
    // Check cache first
    const cached = this.cache.get(key);
    
    if (cached) {
      this.hits++;
      cached.hits++;
      return cached.data;
    }

    this.misses++;

    // Fetch and cache
    const data = await fetcher();
    
    this.set(key, data, ttl);
    
    return data;
  }

  /**
   * Set value in cache
   */
  set(key: string, data: T, ttl?: number): void {
    this.cache.set(key, {
      data,
      timestamp: new Date(),
      ttl: ttl ?? this.defaultTTL,
      hits: 0,
      source: this.jurisdiction,
    });
  }

  /**
   * Get value from cache (returns undefined if not found)
   */
  get(key: string): T | undefined {
    const cached = this.cache.get(key);
    
    if (cached) {
      this.hits++;
      cached.hits++;
      return cached.data;
    }

    this.misses++;
    return undefined;
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    return this.cache.has(key);
  }

  /**
   * Delete from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Clear cache (optionally by pattern)
   */
  clear(pattern?: string): void {
    if (!pattern) {
      this.cache.clear();
      console.log(`Cache cleared: ${this.jurisdiction}`);
      return;
    }

    const keys = Array.from(this.cache.keys());
    for (const key of keys) {
      if (key.includes(pattern)) {
        this.cache.delete(key);
      }
    }

    console.log(`Cache cleared (pattern: ${pattern}): ${this.jurisdiction}`);
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.hits + this.misses;
    const hitRate = total > 0 ? (this.hits / total) * 100 : 0;
    
    let totalAge = 0;
    let count = 0;
    for (const key of this.cache.keys()) {
      const item = this.cache.get(key);
      if (item) {
        totalAge += Date.now() - item.timestamp.getTime();
        count++;
      }
    }
    const averageAge = count > 0 ? totalAge / count : 0;

    return {
      size: this.cache.size,
      maxSize: this.cache.max,
      hits: this.hits,
      misses: this.misses,
      hitRate,
      evictions: 0, // lru-cache v11 doesn't expose eviction count
      averageAge,
    };
  }

  /**
   * Get all keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Get all values
   */
  values(): T[] {
    return Array.from(this.cache.values()).map(entry => entry.data);
  }

  /**
   * Get all entries
   */
  entries(): Array<{ key: string; value: T; timestamp: Date; hits: number }> {
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      value: entry.data,
      timestamp: entry.timestamp,
      hits: entry.hits,
    }));
  }

  /**
   * Get oldest entries (for debugging)
   */
  getOldest(count: number = 10): Array<{ key: string; age: number }> {
    const entries = this.entries();
    entries.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime());
    
    return entries.slice(0, count).map(entry => ({
      key: entry.key,
      age: Date.now() - entry.timestamp.getTime(),
    }));
  }

  /**
   * Get most accessed entries (for optimization insights)
   */
  getMostAccessed(count: number = 10): Array<{ key: string; hits: number }> {
    const entries = this.entries();
    entries.sort((a, b) => b.hits - a.hits);
    
    return entries.slice(0, count).map(entry => ({
      key: entry.key,
      hits: entry.hits,
    }));
  }

  /**
   * Reset statistics
   */
  resetStats(): void {
    this.hits = 0;
    this.misses = 0;
  }

  /**
   * Get cache info for CLI
   */
  getInfo(): string {
    const stats = this.getStats();
    
    return [
      `Cache: ${this.jurisdiction}`,
      `  Size: ${stats.size} / ${stats.maxSize} entries`,
      `  Hit Rate: ${stats.hitRate.toFixed(1)}%`,
      `  Hits: ${stats.hits}, Misses: ${stats.misses}`,
      `  Average Age: ${(stats.averageAge / 1000).toFixed(0)}s`,
    ].join('\n');
  }
}

/**
 * Create a shared cache instance for a jurisdiction
 */
const sharedCaches: Map<string, ScraperCache> = new Map();

export function getSharedCache(jurisdiction: string, options?: ScraperCacheOptions): ScraperCache {
  const key = options?.jurisdiction ?? jurisdiction;
  
  if (!sharedCaches.has(key)) {
    sharedCaches.set(key, new ScraperCache({ ...options, jurisdiction }));
  }
  
  return sharedCaches.get(key)!;
}

/**
 * Clear all shared caches
 */
export function clearAllSharedCaches(): void {
  for (const cache of sharedCaches.values()) {
    cache.clear();
  }
}

/**
 * Get stats for all shared caches
 */
export function getAllCacheStats(): Array<{ jurisdiction: string; stats: CacheStats }> {
  return Array.from(sharedCaches.entries()).map(([jurisdiction, cache]) => ({
    jurisdiction,
    stats: cache.getStats(),
  }));
}
