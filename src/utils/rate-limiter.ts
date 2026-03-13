/**
 * Rate Limiter
 *
 * Per-jurisdiction rate limiting to avoid IP blocks and
 * be a good internet citizen.
 */

export interface RateLimitOptions {
  requests: number; // Max requests
  per: number; // Time window in seconds
}

export interface RateLimitStatus {
  remaining: number;
  limit: number;
  resetTime: Date;
  retryAfter?: number; // seconds
}

export class RateLimiter {
  private limit: number;
  private windowMs: number;
  private tokens: number;
  private lastRefill: number;
  private queue: Array<{ resolve: () => void; timestamp: number }> = [];
  private wakeUpTimer: NodeJS.Timeout | null = null;

  constructor(options: RateLimitOptions) {
    this.limit = options.requests;
    this.windowMs = options.per * 1000; // Convert to ms
    this.tokens = this.limit;
    this.lastRefill = Date.now();
  }

  /**
   * Wait until rate limit allows
   */
  async throttle(): Promise<void> {
    this.refillTokens();

    if (this.tokens >= 1) {
      this.tokens--;
      return;
    }

    // Need to wait
    const waitTime = this.getWaitTime();

    if (waitTime > 0) {
      await new Promise<void>(resolve => {
        this.queue.push({ resolve, timestamp: Date.now() + waitTime });
        this.scheduleQueueProcessing();
      });
    }
  }

  /**
   * Get current rate limit status
   */
  getStatus(): RateLimitStatus {
    this.refillTokens();

    const resetTime = new Date(Date.now() + this.windowMs);
    const remaining = Math.floor(this.tokens);

    return {
      remaining,
      limit: this.limit,
      resetTime,
      retryAfter: remaining <= 0 ? Math.ceil(this.getWaitTime() / 1000) : undefined,
    };
  }

  /**
   * Get remaining requests
   */
  getRemainingRequests(): number {
    this.refillTokens();
    return Math.floor(this.tokens);
  }

  /**
   * Get reset time
   */
  getResetTime(): Date {
    return new Date(Date.now() + this.windowMs);
  }

  /**
   * Refill tokens based on elapsed time
   */
  private refillTokens(): void {
    const now = Date.now();
    const elapsed = now - this.lastRefill;
    const tokensToAdd = (elapsed / this.windowMs) * this.limit;

    this.tokens = Math.min(this.limit, this.tokens + tokensToAdd);
    this.lastRefill = now;

    // Process queue
    this.processQueue();
  }

  /**
   * Process waiting requests
   */
  private processQueue(): void {
    const now = Date.now();

    // Remove stale entries (older than 1 minute) to prevent memory leaks
    const maxQueueAge = 60 * 1000; // 1 minute
    this.queue = this.queue.filter(item => now - item.timestamp < maxQueueAge);

    // Limit queue size to prevent memory issues
    const maxQueueSize = 1000;
    if (this.queue.length > maxQueueSize) {
      console.warn(`Rate limiter queue exceeded ${maxQueueSize} items, trimming...`);
      this.queue = this.queue.slice(0, maxQueueSize);
    }

    while (this.queue.length > 0 && this.tokens >= 1) {
      const next = this.queue[0];

      if (now >= next.timestamp) {
        this.queue.shift();
        this.tokens--;
        next.resolve();
      } else {
        this.scheduleQueueProcessing(next.timestamp - now);
        break;
      }
    }

    if (this.queue.length === 0) {
      this.clearScheduledWakeUp();
    }
  }

  /**
   * Get wait time in ms
   */
  private getWaitTime(): number {
    if (this.tokens >= 1) {
      return 0;
    }

    const tokensNeeded = 1 - this.tokens;
    const timePerToken = this.windowMs / this.limit;

    return tokensNeeded * timePerToken;
  }

  /**
   * Reset rate limiter
   */
  reset(): void {
    this.tokens = this.limit;
    this.lastRefill = Date.now();
    this.clearScheduledWakeUp();

    // Resolve all waiting
    for (const item of this.queue) {
      item.resolve();
    }
    this.queue = [];
  }

  private scheduleQueueProcessing(delayMs?: number): void {
    if (this.queue.length === 0) {
      this.clearScheduledWakeUp();
      return;
    }

    const nextDelay = Math.max(0, delayMs ?? this.queue[0].timestamp - Date.now());

    if (this.wakeUpTimer) {
      clearTimeout(this.wakeUpTimer);
    }

    this.wakeUpTimer = setTimeout(() => {
      this.wakeUpTimer = null;
      this.refillTokens();
    }, nextDelay);
  }

  private clearScheduledWakeUp(): void {
    if (this.wakeUpTimer) {
      clearTimeout(this.wakeUpTimer);
      this.wakeUpTimer = null;
    }
  }

  /**
   * Create rate limiter from string (e.g., "30 per minute")
   */
  static fromString(spec: string): RateLimiter {
    const match = spec.match(/(\d+)\s*per\s*(second|minute|hour|day)/i);

    if (!match) {
      throw new Error(`Invalid rate limit spec: ${spec}`);
    }

    const requests = parseInt(match[1], 10);
    const unit = match[2].toLowerCase();

    const perSeconds: Record<string, number> = {
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
    };

    return new RateLimiter({
      requests,
      per: perSeconds[unit],
    });
  }
}

/**
 * Rate limiter registry for multiple jurisdictions
 */
export class RateLimiterRegistry {
  private limiters: Map<string, RateLimiter> = new Map();

  /**
   * Get or create rate limiter for jurisdiction
   */
  get(jurisdiction: string): RateLimiter {
    if (!this.limiters.has(jurisdiction)) {
      const limiter = this.createDefaultLimiter(jurisdiction);
      this.limiters.set(jurisdiction, limiter);
    }

    return this.limiters.get(jurisdiction)!;
  }

  /**
   * Set custom rate limiter for jurisdiction
   */
  set(jurisdiction: string, limiter: RateLimiter): void {
    this.limiters.set(jurisdiction, limiter);
  }

  /**
   * Get status for all jurisdictions
   */
  getAllStatus(): Array<{ jurisdiction: string; status: RateLimitStatus }> {
    return Array.from(this.limiters.entries()).map(([jurisdiction, limiter]) => ({
      jurisdiction,
      status: limiter.getStatus(),
    }));
  }

  /**
   * Reset all limiters
   */
  resetAll(): void {
    for (const limiter of this.limiters.values()) {
      limiter.reset();
    }
  }

  /**
   * Create default limiter based on jurisdiction
   */
  private createDefaultLimiter(jurisdiction: string): RateLimiter {
    // Default limits based on jurisdiction
    const limits: Record<string, RateLimitOptions> = {
      nz: { requests: 100, per: 60 }, // 100 per minute
      'au-qld': { requests: 30, per: 60 }, // 30 per minute (more conservative)
      'au-comm': { requests: 50, per: 60 }, // 50 per minute
      'au-nsw': { requests: 40, per: 60 },
      'au-vic': { requests: 40, per: 60 },
      'au-wa': { requests: 30, per: 60 },
      'au-sa': { requests: 30, per: 60 },
      'au-tas': { requests: 20, per: 60 },
      'au-nt': { requests: 20, per: 60 },
      'au-act': { requests: 30, per: 60 },
    };

    const options = limits[jurisdiction] ?? { requests: 30, per: 60 };
    return new RateLimiter(options);
  }
}

/**
 * Rate limit decorator for methods
 */
export function rateLimited(
  jurisdiction: string
): <T extends (...args: unknown[]) => Promise<unknown>>(
  target: object,
  propertyKey: string,
  descriptor: TypedPropertyDescriptor<T>
) => TypedPropertyDescriptor<T> {
  return function <T extends (...args: unknown[]) => Promise<unknown>>(
    _target: object,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> {
    const originalMethod = descriptor.value;
    const registry = new RateLimiterRegistry();

    if (!originalMethod) {
      return descriptor;
    }

    descriptor.value = async function (
      this: ThisParameterType<T>,
      ...args: Parameters<T>
    ): Promise<Awaited<ReturnType<T>>> {
      const limiter = registry.get(jurisdiction);
      await limiter.throttle();
      return (await originalMethod.apply(this, args)) as Awaited<ReturnType<T>>;
    } as T;

    return descriptor;
  };
}

/**
 * CLI helper for rate limit status
 */
export function formatRateLimitStatus(status: RateLimitStatus): string {
  const icon = status.remaining > status.limit * 0.5 ? '✅' : status.remaining > 0 ? '⚠️' : '❌';

  return `${icon} ${status.remaining}/${status.limit} remaining${status.retryAfter ? ` (retry after ${status.retryAfter}s)` : ''}`;
}
