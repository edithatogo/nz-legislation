import { readFileSync } from 'node:fs';

const read = (path: string): string => readFileSync(path, 'utf8');
const failures: string[] = [];

function requireIncludes(path: string, needles: string[]): void {
  const content = read(path);
  for (const needle of needles) {
    if (!content.includes(needle)) {
      failures.push(`${path} is missing required text: ${needle}`);
    }
  }
}

const requiredDocs = [
  'SECURITY.md',
  'docs/maintainers/security-and-submission-gates-v9.md',
  'docs/maintainers/security-provenance-review.md',
  'conductor/tracks/anz-platform-release-and-distribution/release-submission-gates.md',
  'integrations/mcp/registry-submission-checklist.md',
];

for (const path of requiredDocs) {
  try {
    read(path);
  } catch {
    failures.push(`Missing security/provenance document: ${path}`);
  }
}

requireIncludes('SECURITY.md', [
  'Reporting a Vulnerability',
  'Please do NOT report security vulnerabilities through public GitHub issues.',
  'Secure API key handling',
]);

requireIncludes('docs/maintainers/security-and-submission-gates-v9.md', [
  'Gate A',
  'Gate B',
  'Gate C',
  'Gate D',
  'Gate E',
  'package provenance',
  'MCP safety',
  'listing truthfulness',
]);

requireIncludes('docs/maintainers/security-provenance-review.md', [
  'Status: blocked for external submission and publication',
  'Package provenance',
  'Workflow permissions',
  'Release automation',
  'Dependency posture',
  'Secret handling',
  'Generated artifacts',
  'Listing claims',
  'Legal-data truthfulness',
]);

requireIncludes(
  'conductor/tracks/anz-platform-release-and-distribution/release-submission-gates.md',
  ['Security/provenance review', 'BLOCKING', 'Gate evidence must be committed in this repository']
);

const releaseGateCommands = [
  'pnpm gate:no-placeholder-legal-data',
  'pnpm gate:conductor-requirements',
  'pnpm gate:manifest-docs',
  'pnpm gate:install-snippets',
  'pnpm gate:security-provenance',
  'pnpm typecheck',
  'pnpm test:run',
  'pnpm build',
];

for (const workflow of [
  '.github/workflows/release-stable.yml',
  '.github/workflows/release-next.yml',
]) {
  requireIncludes(workflow, [
    'id-token: write',
    'npm publish --provenance',
    'ENABLE_AUTOMATED_NPM_PUBLISH',
  ]);
  requireIncludes(workflow, releaseGateCommands);
}

requireIncludes('.github/workflows/publish-github-packages.yml', [
  'packages: write',
  'pnpm gate:security-provenance',
  'pnpm gate:install-snippets',
  'pnpm gate:manifest-docs',
  'pnpm run build',
]);

requireIncludes('.github/workflows/ci.yml', [
  'Security Provenance Gate',
  'pnpm gate:security-provenance',
  'security-provenance',
]);

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
if (
  packageJson.scripts?.['gate:security-provenance'] !== 'tsx scripts/check-security-provenance.ts'
) {
  failures.push(
    'package.json must define gate:security-provenance as tsx scripts/check-security-provenance.ts'
  );
}

const forbiddenPublicationClaims = [
  /external publication is approved/i,
  /registry submission is approved/i,
  /marketplace submission is approved/i,
  /security gate passed for release/i,
];

for (const path of [
  'docs/maintainers/security-provenance-review.md',
  'docs/maintainers/security-and-submission-gates-v9.md',
]) {
  const content = read(path);
  for (const pattern of forbiddenPublicationClaims) {
    if (pattern.test(content)) {
      failures.push(`${path} contains a premature approval claim matching ${pattern}.`);
    }
  }
}

if (failures.length > 0) {
  console.error('Security/provenance gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Security/provenance gate passed: release workflows and review artifacts are guarded.');
