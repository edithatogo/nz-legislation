import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

type RuntimeComparison = {
  typescriptRuntime: { available: boolean; securityChecks: string[]; performanceEvidence: string };
  rustRuntime: {
    available: boolean;
    contractRuntimeAvailable: boolean;
    securityChecks: string[];
    performanceEvidence: string | null;
  };
  cutoverAllowed: boolean;
  reason: string;
};

const comparison = JSON.parse(
  readFileSync('tests/fixtures/rust/runtime-comparison.json', 'utf8')
) as RuntimeComparison;

describe('Rust migration runtime comparison gate', () => {
  it('requires explicit evidence before runtime cutover', () => {
    expect(comparison.typescriptRuntime.available).toBe(true);
    expect(comparison.typescriptRuntime.performanceEvidence).toBe('benchmarks/performance.ts');
    expect(comparison.rustRuntime.available).toBe(false);
    expect(comparison.rustRuntime.contractRuntimeAvailable).toBe(true);
    expect(comparison.rustRuntime.performanceEvidence).toBeNull();
    expect(comparison.cutoverAllowed).toBe(false);
    expect(comparison.reason).toMatch(/not yet available/);
  });

  it('keeps security evidence requirements explicit for both runtimes', () => {
    expect(comparison.typescriptRuntime.securityChecks.length).toBeGreaterThan(0);
    expect(comparison.rustRuntime.securityChecks).toEqual([
      'cargo-check-locked',
      'cargo-test-locked',
      'cargo-tree-locked',
    ]);
  });
});
