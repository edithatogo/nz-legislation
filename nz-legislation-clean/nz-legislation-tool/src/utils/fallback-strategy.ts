/**
 * Fallback Strategy Pattern
 * 
 * Multiple scraper strategies with automatic fallback on failure.
 * Reduces downtime when websites change structure.
 */

export interface ScrapeResult<T = unknown> {
  data: T;
  source: string;
  timestamp: Date;
  cached: boolean;
}

export abstract class ScraperStrategy<T = unknown> {
  public name: string;
  protected priority: number; // Lower = higher priority

  constructor(name: string, priority: number = 0) {
    this.name = name;
    this.priority = priority;
  }

  /**
   * Try to scrape using this strategy
   */
  abstract scrape(url: string, options?: any): Promise<ScrapeResult<T>>;

  /**
   * Check if this strategy is available
   */
  async isAvailable(): Promise<boolean> {
    try {
      await this.healthCheck();
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Health check for this strategy
   */
  abstract healthCheck(): Promise<void>;

  /**
   * Get strategy priority
   */
  getPriority(): number {
    return this.priority;
  }
}

export class FallbackScraper<T = unknown> {
  private strategies: ScraperStrategy<T>[];
  private fallbackOrder: ScraperStrategy<T>[];

  constructor(strategies: ScraperStrategy<T>[]) {
    // Sort by priority (lower = higher priority)
    this.strategies = strategies.sort((a, b) => a.getPriority() - b.getPriority());
    this.fallbackOrder = [...this.strategies];
  }

  /**
   * Scrape with automatic fallback
   */
  async scrape(url: string, options?: any): Promise<ScrapeResult<T>> {
    const errors: Error[] = [];

    for (const strategy of this.fallbackOrder) {
      try {
        const result = await strategy.scrape(url, options);
        return result;
      } catch (error) {
        errors.push(error instanceof Error ? error : new Error(String(error)));
        console.debug(`Strategy "${strategy.name}" failed, trying next...`);
      }
    }

    // All strategies failed
    // Use AggregateError if available (Node.js 16.9.0+), otherwise create custom error
    if (typeof AggregateError !== 'undefined') {
      throw new AggregateError(
        errors,
        `All ${this.fallbackOrder.length} scraper strategies failed for ${url}`
      );
    } else {
      // Fallback for older Node.js versions
      const error = new Error(`All ${this.fallbackOrder.length} scraper strategies failed for ${url}`);
      (error as any).errors = errors;
      throw error;
    }
  }

  /**
   * Get active strategy (first available)
   */
  async getActiveStrategy(): Promise<ScraperStrategy<T> | null> {
    for (const strategy of this.fallbackOrder) {
      if (await strategy.isAvailable()) {
        return strategy;
      }
    }
    return null;
  }

  /**
   * Check if any strategy is available
   */
  async isAnyAvailable(): Promise<boolean> {
    const active = await this.getActiveStrategy();
    return active !== null;
  }

  /**
   * Get status of all strategies
   */
  async getStatus(): Promise<StrategyStatus[]> {
    const statuses: StrategyStatus[] = [];

    for (const strategy of this.fallbackOrder) {
      try {
        await strategy.healthCheck();
        statuses.push({
          name: strategy.name,
          available: true,
          priority: strategy.getPriority(),
        });
      } catch (error) {
        statuses.push({
          name: strategy.name,
          available: false,
          priority: strategy.getPriority(),
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    return statuses;
  }

  /**
   * Add a new strategy
   */
  addStrategy(strategy: ScraperStrategy<T>): void {
    this.strategies.push(strategy);
    this.fallbackOrder = [...this.strategies].sort((a, b) => a.getPriority() - b.getPriority());
  }

  /**
   * Remove a strategy
   */
  removeStrategy(name: string): void {
    this.strategies = this.strategies.filter(s => s.name !== name);
    this.fallbackOrder = [...this.strategies].sort((a, b) => a.getPriority() - b.getPriority());
  }

  /**
   * Get strategy count
   */
  getStrategyCount(): number {
    return this.strategies.length;
  }
}

export interface StrategyStatus {
  name: string;
  available: boolean;
  priority: number;
  error?: string;
}

/**
 * Base class for HTTP-based scrapers
 */
export abstract class HttpScraperStrategy<T = any> extends ScraperStrategy<T> {
  protected baseUrl: string;
  protected timeout: number;

  constructor(name: string, baseUrl: string, priority: number = 0, timeout: number = 10000) {
    super(name, priority);
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  /**
   * Default health check - try to fetch base URL
   */
  async healthCheck(): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(this.baseUrl, {
        signal: controller.signal,
        method: 'HEAD',
      });

      if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
}

/**
 * Example: Primary scraper strategy
 */
export class PrimaryScraperStrategy<T> extends HttpScraperStrategy<T> {
  constructor(baseUrl: string) {
    super('primary', baseUrl, 0); // Highest priority
  }

  async scrape(url: string, options?: any): Promise<ScrapeResult<T>> {
    // Implement primary scraping logic
    throw new Error('Not implemented - extend this class');
  }
}

/**
 * Example: Alternative scraper strategy (fallback)
 */
export class AlternativeScraperStrategy<T> extends HttpScraperStrategy<T> {
  constructor(baseUrl: string) {
    super('alternative', baseUrl, 1); // Second priority
  }

  async scrape(url: string, options?: any): Promise<ScrapeResult<T>> {
    // Implement alternative scraping logic (different URL structure, mobile site, etc.)
    throw new Error('Not implemented - extend this class');
  }
}

/**
 * Example: Mirror scraper strategy (e.g., AustLII)
 */
export class MirrorScraperStrategy<T> extends HttpScraperStrategy<T> {
  constructor(baseUrl: string, mirrorName: string) {
    super(`mirror:${mirrorName}`, baseUrl, 2); // Third priority
  }

  async scrape(url: string, options?: any): Promise<ScrapeResult<T>> {
    // Implement mirror scraping logic
    throw new Error('Not implemented - extend this class');
  }
}

/**
 * Example: Cache scraper strategy (last resort)
 */
export class CacheScraperStrategy<T> extends ScraperStrategy<T> {
  private cache: Map<string, { data: T; timestamp: Date }>;
  private maxAge: number; // ms

  constructor(cache: Map<string, { data: T; timestamp: Date }>, maxAge: number = 24 * 60 * 60 * 1000) {
    super('cache', 3); // Lowest priority
    this.cache = cache;
    this.maxAge = maxAge;
  }

  async scrape(url: string): Promise<ScrapeResult<T>> {
    const cached = this.cache.get(url);
    
    if (!cached) {
      throw new Error('Cache miss');
    }

    const age = Date.now() - cached.timestamp.getTime();
    if (age > this.maxAge) {
      throw new Error('Cache expired');
    }

    return {
      data: cached.data,
      source: 'cache',
      timestamp: cached.timestamp,
      cached: true,
    };
  }

  async healthCheck(): Promise<void> {
    // Cache is always "healthy" if it exists
  }
}

/**
 * Create a complete fallback chain for a jurisdiction
 */
export function createFallbackChain<T>(
  primary: ScraperStrategy<T>,
  alternative: ScraperStrategy<T>,
  mirror?: ScraperStrategy<T>,
  cache?: ScraperStrategy<T>
): FallbackScraper<T> {
  const strategies = [primary, alternative];
  
  if (mirror) strategies.push(mirror);
  if (cache) strategies.push(cache);

  return new FallbackScraper<T>(strategies);
}
