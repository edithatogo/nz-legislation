import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Evidence = {
  schemaVersion: number;
  mode: string;
  liveLegalData: boolean;
  typescript: { status: string; timingSource: string | null; securityEvidence: string[] };
  rust: {
    status: string;
    timingSource: string | null;
    securityEvidence: string[];
    blockedReason: string | null;
  };
  cutover: { allowed: boolean; requiredEvidence: string[] };
};
const evidence = JSON.parse(
  readFileSync('tests/fixtures/rust/runtime-comparison-evidence.json', 'utf8')
) as Evidence;

describe('dual-runtime comparison evidence gate', () => {
  it('is deterministic and never benchmarks live legal data', () => {
    expect(evidence.schemaVersion).toBe(1);
    expect(evidence.mode).toBe('contract-only');
    expect(evidence.liveLegalData).toBe(false);
  });
  it('blocks cutover until provider runtime parity evidence exists', () => {
    expect(evidence.typescript.status).toBe('measured');
    expect(evidence.typescript.timingSource).toBe('benchmarks/performance.ts');
    expect(evidence.rust.status).toBe('blocked');
    expect(evidence.rust.timingSource).toBeNull();
    expect(evidence.rust.blockedReason).toMatch(/provider-backed Rust runtime/);
    expect(evidence.cutover.allowed).toBe(false);
    expect(evidence.cutover.requiredEvidence).toEqual([
      'provider-backed-runtime',
      'same-fixtures',
      'performance-comparison',
      'security-comparison',
    ]);
  });
  it('records security gates for both runtimes', () => {
    expect(evidence.typescript.securityEvidence).toEqual([
      'dependency-review',
      'codeql',
      'security-provenance-gate',
    ]);
    expect(evidence.rust.securityEvidence).toEqual([
      'cargo-check-locked',
      'cargo-test-locked',
      'cargo-tree-locked',
    ]);
  });
});
