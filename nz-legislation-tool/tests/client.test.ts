import { describe, it, expect } from 'vitest';
import { getRateLimitStatus } from '../src/client.js';

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
