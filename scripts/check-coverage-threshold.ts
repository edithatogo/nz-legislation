import { readFileSync } from 'node:fs';

const path = 'coverage/coverage-final.json';
const minimums: Record<string, number> = { lines: 50, statements: 50, functions: 50, branches: 45 };
const files = JSON.parse(readFileSync(path, 'utf8')) as Record<
  string,
  { s: Record<string, number>; f: Record<string, number>; b: Record<string, number[]> }
>;
const total = { lines: [0, 0], statements: [0, 0], functions: [0, 0], branches: [0, 0] };
for (const file of Object.values(files)) {
  for (const count of Object.values(file.s)) {
    total.statements[1] += 1;
    total.statements[0] += count > 0 ? 1 : 0;
  }
  for (const count of Object.values(file.f)) {
    total.functions[1] += 1;
    total.functions[0] += count > 0 ? 1 : 0;
  }
  for (const counts of Object.values(file.b)) {
    for (const count of counts) {
      total.branches[1] += 1;
      total.branches[0] += count > 0 ? 1 : 0;
    }
  }
}
for (const key of ['lines'] as const) total[key] = total.statements;

const metrics = ['lines', 'statements', 'functions', 'branches'];
const percentages = Object.fromEntries(
  metrics.map(metric => [metric, (100 * total[metric][0]) / total[metric][1]])
);
const failures = metrics.filter(metric => percentages[metric] < minimums[metric]);
if (failures.length > 0) {
  throw new Error(
    `Coverage ratchet failed: ${failures.map(metric => `${metric}=${percentages[metric].toFixed(2)}%`).join(', ')}`
  );
}
console.log(
  `Coverage ratchet passed: ${metrics.map(metric => `${metric}=${percentages[metric].toFixed(2)}% (min ${minimums[metric]}%)`).join(', ')}`
);
