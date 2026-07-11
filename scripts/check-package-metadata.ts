import { existsSync, readFileSync } from 'node:fs';

interface PackageJson {
  name?: string;
  version?: string;
  description?: string;
  type?: string;
  main?: string;
  bin?: Record<string, string>;
  files?: string[];
  keywords?: string[];
  license?: string;
  repository?: { type?: string; url?: string };
  bugs?: { url?: string };
  homepage?: string;
  scripts?: Record<string, string>;
}

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

function rejectPattern(path: string, pattern: RegExp, reason: string): void {
  const content = read(path);
  if (pattern.test(content)) {
    failures.push(`${path} contains forbidden metadata/listing language: ${reason}`);
  }
}

const packageJson = JSON.parse(read('package.json')) as PackageJson;
const releaseGatesPath = existsSync(
  'conductor/tracks/anz-platform-release-and-distribution/release-submission-gates.md'
)
  ? 'conductor/tracks/anz-platform-release-and-distribution/release-submission-gates.md'
  : 'conductor/archive/anz-platform-release-and-distribution/release-submission-gates.md';

const expectedPackageFields: Array<[keyof PackageJson, string]> = [
  ['name', 'nz-legislation-tool'],
  ['description', 'CLI tool for searching and retrieving New Zealand legislation data'],
  ['type', 'module'],
  ['main', 'dist/cli.js'],
  ['license', 'Apache-2.0'],
  ['homepage', 'https://github.com/edithatogo/nz-legislation#readme'],
];

for (const [field, expected] of expectedPackageFields) {
  if (packageJson[field] !== expected) {
    failures.push(`package.json ${String(field)} must be ${expected}.`);
  }
}

if (!packageJson.version || !/^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?$/.test(packageJson.version)) {
  failures.push('package.json version must be valid semver.');
}

const expectedBins: Record<string, string> = {
  nzlegislation: './dist/cli.js',
  'nzlegislation-mcp': './dist/mcp-cli.js',
  anzlegislation: './dist/cli.js',
  'anzlegislation-mcp': './dist/mcp-cli.js',
};

for (const [bin, expectedPath] of Object.entries(expectedBins)) {
  if (packageJson.bin?.[bin] !== expectedPath) {
    failures.push(`package.json bin ${bin} must point to ${expectedPath}.`);
  }
}

for (const file of ['dist', 'README.md', 'LICENSE']) {
  if (!packageJson.files?.includes(file)) {
    failures.push(`package.json files must include ${file}.`);
  }
}

for (const keyword of [
  'nz',
  'legislation',
  'cli',
  'legal-tech',
  'research',
  'new-zealand',
  'api',
]) {
  if (!packageJson.keywords?.includes(keyword)) {
    failures.push(`package.json keywords must include ${keyword}.`);
  }
}

if (packageJson.repository?.type !== 'git') {
  failures.push('package.json repository.type must be git.');
}

if (packageJson.repository?.url !== 'https://github.com/edithatogo/nz-legislation.git') {
  failures.push('package.json repository.url must point at edithatogo/nz-legislation.git.');
}

if (packageJson.bugs?.url !== 'https://github.com/edithatogo/nz-legislation/issues') {
  failures.push('package.json bugs.url must point at repository issues.');
}

if (packageJson.scripts?.['gate:package-metadata'] !== 'tsx scripts/check-package-metadata.ts') {
  failures.push(
    'package.json must define gate:package-metadata as tsx scripts/check-package-metadata.ts'
  );
}

const requiredDocs = [
  'docs/maintainers/package-metadata-review.md',
  releaseGatesPath,
  'conductor/tracks/anz-publication-package-registries/spec.md',
  'conductor/requirements.md',
  'README.md',
];

for (const path of requiredDocs) {
  if (!existsSync(path)) {
    failures.push(`Missing package/listing metadata document: ${path}`);
  }
}

requireIncludes('docs/maintainers/package-metadata-review.md', [
  'Status: preparation only; blocked for external publication until all release/submission gates pass.',
  '`nz-legislation-tool` remains the npm package name.',
  '`nzlegislation` and `nzlegislation-mcp` remain the stable documented command names.',
  '`anzlegislation` and `anzlegislation-mcp` are transitional compatibility aliases while the ANZ transition is incomplete.',
  'New Zealand support is the stable runtime support claim.',
  'Australian support remains prerelease, planned, or unsupported unless the provider capability manifest and release gates promote a jurisdiction.',
]);

requireIncludes(releaseGatesPath, [
  'Accurate package metadata',
  '`package.json`, README, registry metadata, binaries, aliases, and deprecation/prerelease language match runtime capability.',
]);

requireIncludes('conductor/tracks/anz-publication-package-registries/spec.md', [
  'Preserve stable package and binary compatibility names.',
  'Keep ANZ aliases transitional until migration policy changes.',
  'stable claims are NZ-only unless a provider is promoted through all gates.',
]);

requireIncludes('conductor/requirements.md', [
  'Preserve `nz-legislation-tool`, `nzlegislation`, and `nzlegislation-mcp` compatibility.',
  'Keep `anzlegislation` and `anzlegislation-mcp` as compatibility aliases while the ANZ transition is incomplete.',
]);

requireIncludes('README.md', [
  'npm install -g nz-legislation-tool',
  'nzlegislation search --query "health act"',
  'nzlegislation-mcp',
]);

for (const workflow of [
  '.github/workflows/ci.yml',
  '.github/workflows/release-stable.yml',
  '.github/workflows/release-next.yml',
  '.github/workflows/publish-github-packages.yml',
]) {
  requireIncludes(workflow, ['pnpm gate:package-metadata']);
}

const prematureClaims = [
  {
    pattern: /\bAustralian\s+(?:runtime\s+)?support\s+(?:is\s+)?stable\b/i,
    reason: 'Australian support must not be described as stable package support.',
  },
  {
    pattern: /\bstable\s+Australian\s+(?:runtime\s+)?support\b/i,
    reason: 'Australian support must remain prerelease/planned until release gates pass.',
  },
  {
    pattern: /\bproduction-ready\s+Australian\s+(?:runtime\s+)?support\b/i,
    reason: 'Australian support is not production-ready.',
  },
];

for (const path of [
  'docs/maintainers/package-metadata-review.md',
  'conductor/tracks/anz-publication-package-registries/spec.md',
  'README.md',
]) {
  if (existsSync(path)) {
    for (const { pattern, reason } of prematureClaims) {
      rejectPattern(path, pattern, reason);
    }
  }
}

if (failures.length > 0) {
  console.error('Package metadata gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  'Package metadata gate passed: package identity, bins, aliases, and listing claims are guarded.'
);
