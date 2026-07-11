/**
 * TypeScript Strict Mode Integration Tests
 *
 * Verifies that the project enforces strict TypeScript compiler options
 * including noUncheckedIndexedAccess, strictNullChecks, and noImplicitAny.
 * These tests ensure that regressions in type safety are caught.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { describe, expect, it } from 'vitest';

// ---------------------------------------------------------------------------
// Helper — parse the project tsconfig.json
// ---------------------------------------------------------------------------
function loadTsConfig(): Record<string, unknown> {
  const tsconfigPath = path.resolve(__dirname, '..', 'tsconfig.json');
  const raw = fs.readFileSync(tsconfigPath, 'utf-8');
  return JSON.parse(raw);
}

describe('TypeScript Strict Mode — tsconfig.json', () => {
  it('has strict: true', () => {
    const opts = loadTsConfig().compilerOptions as Record<string, unknown>;
    expect(opts.strict).toBe(true);
  });

  it('has noImplicitAny: true', () => {
    const opts = loadTsConfig().compilerOptions as Record<string, unknown>;
    expect(opts.noImplicitAny).toBe(true);
  });

  it('has strictNullChecks: true', () => {
    const opts = loadTsConfig().compilerOptions as Record<string, unknown>;
    expect(opts.strictNullChecks).toBe(true);
  });

  it('has noUncheckedIndexedAccess: true', () => {
    const opts = loadTsConfig().compilerOptions as Record<string, unknown>;
    expect(opts.noUncheckedIndexedAccess).toBe(true);
  });
});
