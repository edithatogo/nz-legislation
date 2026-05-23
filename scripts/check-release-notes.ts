import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string): string => readFileSync(path, 'utf8');
const failures: string[] = [];
const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim();

function requireIncludes(path: string, needles: string[]): void {
  const content = normalize(read(path));
  for (const needle of needles) {
    if (!content.includes(normalize(needle))) {
      failures.push(`${path} is missing required text: ${needle}`);
    }
  }
}

function rejectPatterns(path: string, patterns: Array<{ pattern: RegExp; reason: string }>): void {
  const content = read(path);
  for (const { pattern, reason } of patterns) {
    if (pattern.test(content)) {
      failures.push(`${path} contains forbidden release-note language: ${reason}`);
    }
  }
}

const releaseNoteDocs = [
  'docs/maintainers/release-notes-anz-readiness-draft.md',
  'conductor/tracks/anz-platform-release-and-distribution/release-submission-gates.md',
  'conductor/tracks/anz-platform-release-and-distribution/plan.md',
  'conductor/tracks/anz-publication-package-registries/plan.md',
];

for (const path of releaseNoteDocs) {
  if (!existsSync(path)) {
    failures.push(`Missing release-note gate document: ${path}`);
  }
}

requireIncludes('docs/maintainers/release-notes-anz-readiness-draft.md', [
  'stable New Zealand legislation support',
  'New Zealand support remains the stable, supported runtime surface',
  'Australian support is prerelease/planned only',
  'No packages are published by this PR',
  'Future external release notes must keep the distinction between stable New Zealand support and Australian prerelease/planned support',
]);

requireIncludes(
  'conductor/tracks/anz-platform-release-and-distribution/release-submission-gates.md',
  [
    'NZ stable/Australian prerelease release notes',
    'Release notes clearly distinguish NZ stable support from Australian prerelease or planned support.',
    'between stable New Zealand support and Australian prerelease or planned',
  ]
);

requireIncludes('conductor/tracks/anz-platform-release-and-distribution/plan.md', [
  'Add an executable release notes gate that distinguishes NZ stable from Australian prerelease support.',
  'Keep all release automation guarded by provenance, docs, install, and release note checks.',
]);

requireIncludes('conductor/tracks/anz-publication-package-registries/plan.md', [
  'Verify GitHub Release note template distinguishes NZ stable from AU',
  'prerelease support.',
]);

const workflowGateCommand = 'pnpm gate:release-notes';
for (const workflow of [
  '.github/workflows/ci.yml',
  '.github/workflows/release-stable.yml',
  '.github/workflows/release-next.yml',
  '.github/workflows/publish-github-packages.yml',
]) {
  requireIncludes(workflow, [workflowGateCommand]);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
if (packageJson.scripts?.['gate:release-notes'] !== 'tsx scripts/check-release-notes.ts') {
  failures.push(
    'package.json must define gate:release-notes as tsx scripts/check-release-notes.ts'
  );
}

const prematureStableClaims = [
  {
    pattern: /\bAustralian\s+(?:runtime\s+)?support\s+(?:is\s+)?stable\b/i,
    reason: 'Australian support must not be described as stable.',
  },
  {
    pattern: /\bstable\s+Australian\s+(?:runtime\s+)?support\b/i,
    reason: 'Australian support must remain prerelease/planned until release gates pass.',
  },
  {
    pattern: /\bAU\s+(?:runtime\s+)?support\s+(?:is\s+)?stable\b/i,
    reason: 'AU support must not be described as stable.',
  },
  {
    pattern: /\bproduction-ready\s+Australian\s+(?:runtime\s+)?support\b/i,
    reason: 'Australian runtime support is not production-ready.',
  },
];

for (const path of releaseNoteDocs) {
  if (existsSync(path)) {
    rejectPatterns(path, prematureStableClaims);
  }
}

const australianScopePattern =
  /\b(Australia|Australian|ANZ|Commonwealth|Queensland|NSW|Victoria|Tasmania|ACT|Northern Territory|South Australia|Western Australia)\b/i;
const constrainedStatusPattern =
  /\b(prerelease|planned|unsupported|gated|blocked|readiness|not wired|without enabling|source-validation|required)\b/i;

const changesetDir = '.changeset';
if (existsSync(changesetDir)) {
  for (const entry of readdirSync(changesetDir)) {
    if (!entry.endsWith('.md') || entry === 'README.md') {
      continue;
    }

    const path = join(changesetDir, entry).replaceAll('\\', '/');
    const content = read(path);
    if (!australianScopePattern.test(content)) {
      continue;
    }

    if (!constrainedStatusPattern.test(content)) {
      failures.push(
        `${path} mentions Australian/ANZ scope but does not state prerelease, planned, unsupported, gated, blocked, readiness, or source-validation status.`
      );
    }

    rejectPatterns(path, prematureStableClaims);
  }
}

if (failures.length > 0) {
  console.error('Release notes gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  'Release notes gate passed: NZ stable and Australian prerelease/planned release language is guarded.'
);
