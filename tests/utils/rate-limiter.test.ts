/**
 * Unit tests for Rate Limiter
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RateLimiter } from '../../src/utils/rate-limiter.js';

describe('RateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('should initialize with full tokens', () => {
    const limiter = new RateLimiter({ requests: 10, per: 1 });
    expect(limiter.getRemainingRequests()).toBe(10);
  });

  it('should decrease tokens on throttle', async () => {
    const limiter = new RateLimiter({ requests: 10, per: 1 });
    await limiter.throttle();
    expect(limiter.getRemainingRequests()).toBe(9);
  });

  it('should refill tokens over time', async () => {
    const limiter = new RateLimiter({ requests: 10, per: 1 });
    // Use all tokens
    for (let i = 0; i < 10; i++) await limiter.throttle();
    expect(limiter.getRemainingRequests()).toBe(0);

    // Advance time by 0.5s (should refill 5 tokens)
    vi.advanceTimersByTime(500);
    expect(limiter.getRemainingRequests()).toBe(5);

    // Advance by another 0.5s (full refill)
    vi.advanceTimersByTime(500);
    expect(limiter.getRemainingRequests()).toBe(10);
  });

  it('should return correct status', () => {
    const limiter = new RateLimiter({ requests: 10, per: 60 });
    const status = limiter.getStatus();
    expect(status.limit).toBe(10);
    expect(status.remaining).toBe(10);
    expect(status.resetTime).toBeInstanceOf(Date);
  });

  it('should wake queued requests when tokens refill', async () => {
    const limiter = new RateLimiter({ requests: 1, per: 1 });

    await limiter.throttle();

    let released = false;
    const pending = limiter.throttle().then(() => {
      released = true;
    });

    await vi.advanceTimersByTimeAsync(1000);
    await pending;

    expect(released).toBe(true);
  });
});
