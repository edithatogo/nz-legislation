/**
 * Unit tests for Secure Config Utility
 */

import { describe, it, expect } from 'vitest';
import { maskApiKey, validateApiKeyFormat } from '../../src/utils/secure-config.js';

describe('SecureConfig Utils', () => {
  describe('maskApiKey', () => {
    it('should mask a long API key', () => {
      const key = 'nzlapi1234567890abcdef';
      const masked = maskApiKey(key);
      expect(masked).toBe('nzla**************cdef');
      expect(masked.length).toBe(key.length);
    });

    it('should return stars for a short key', () => {
      expect(maskApiKey('short')).toBe('****');
    });

    it('should handle empty key', () => {
      expect(maskApiKey('')).toBe('****');
    });
  });

  describe('validateApiKeyFormat', () => {
    it('should validate a correct key', () => {
      expect(validateApiKeyFormat('nzlapi1234567890abcdef')).toBe(true);
    });

    it('should fail for short keys', () => {
      expect(validateApiKeyFormat('too-short')).toBe(false);
    });

    it('should fail for common placeholders', () => {
      expect(validateApiKeyFormat('your_api_key_here')).toBe(false);
      expect(validateApiKeyFormat('placeholder')).toBe(false);
    });
  });
});
