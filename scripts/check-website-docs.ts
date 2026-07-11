import { existsSync, readFileSync } from 'node:fs';

const read = (path: string): string => readFileSync(path, 'utf8');
const normalize = (value: string): string => value.replace(/\s+/g, ' ').trim();
const failures: string[] = [];

function requireFile(path: string): void {
  if (!existsSync(path)) {
    failures.push(`Missing website/docs file: ${path}`);
  }
}

function requireIncludes(path: string, needles: string[]): void {
  requireFile(path);
  if (!existsSync(path)) return;
  const content = normalize(read(path));
  for (const needle of needles) {
    if (!content.includes(normalize(needle))) {
      failures.push(`${path} is missing required website/docs text: ${needle}`);
    }
  }
}

function rejectPattern(path: string, pattern: RegExp, reason: string): void {
  if (existsSync(path) && pattern.test(read(path))) {
    failures.push(`${path} contains forbidden website/docs language: ${reason}`);
  }
}

const requiredDocs = [
  'README.md',
  'llms.txt',
  'docs/capabilities.md',
  'docs/provider-runtime.md',
  'docs/documentation-site-config.md',
  'docs/documentation-site-setup.md',
  'docs/maintainers/australian-source-inventory.md',
  'docs/maintainers/distribution-submission-map.md',
  'docs/maintainers/install-snippet-verification.md',
  'docs/maintainers/package-metadata-review.md',
  'docs/maintainers/provider-source-cards.md',
  'docs/maintainers/release-notes-anz-readiness-draft.md',
  'docs/maintainers/security-and-submission-gates-v9.md',
  'integrations/README.md',
  'integrations/assistant-marketplace-readiness.md',
  'integrations/ide-marketplace-readiness.md',
  'integrations/mcp/example-configs.md',
];

for (const path of requiredDocs) requireFile(path);

requireIncludes('llms.txt', [
  'ANZ Legislation',
  'official-source-first legislation research',
  'Australian support is prerelease or planned',
  'docs/capabilities.md',
  'docs/provider-runtime.md',
  'docs/maintainers/provider-source-cards.md',
  'docs/maintainers/distribution-submission-map.md',
]);

requireIncludes('docs/capabilities.md', [
  '| New Zealand | `legislation-govt-nz` | Stable | Supported, source-backed',
  '| Australian Commonwealth | `federal-register-of-legislation` | Prerelease | Supported, source-backed',
  '| New South Wales | `nsw-legislation` | Planned | Unsupported',
  '| Northern Territory | `northern-territory-legislation` | Planned | Unsupported',
  'Commonwealth citation and single-version support: unsupported.',
  'Do not use this matrix to describe Australia as stable.',
]);

requireIncludes('README.md', [
  'npm install -g nz-legislation-tool',
  'nzlegislation search --query "health act"',
  'nzlegislation-mcp',
  'npx -y --package nz-legislation-tool nzlegislation search --query "health"',
]);

requireIncludes('docs/provider-runtime.md', [
  'Provider Runtime',
  'New Zealand is the stable runtime-supported provider',
  'Australian Commonwealth is source-backed prerelease for search, get-work, versions, export, and MCP paths',
  'citation and single-version retrieval remain unsupported',
]);

requireIncludes('docs/maintainers/provider-source-cards.md', [
  'Australian Commonwealth may include Federal Register of Legislation source metadata and is runtime-supported for source-backed prerelease search',
  'Australian Commonwealth citation and single-version retrieval remain unsupported',
  'Australian Commonwealth citation and single-version support: unsupported.',
  'Do not use source cards to bypass unsupported-provider errors or imply that Australia is stable.',
]);

requireIncludes('docs/maintainers/australian-source-inventory.md', [
  'Runtime status must match the provider capability manifest',
  '| Australian Commonwealth',
  '| Queensland',
  '| New South Wales',
  '| Northern Territory',
  'Prerelease',
  'Planned',
]);

requireIncludes('docs/maintainers/distribution-submission-map.md', [
  'Package and listing metadata must describe the current NZ runtime.',
  'Do not claim Australian runtime support until the provider gates pass.',
  '| Website/docs',
  '| MCP generic',
  '| Docker/GHCR',
  '| Homebrew',
]);

requireIncludes('docs/maintainers/install-snippet-verification.md', [
  '`npm install -g nz-legislation-tool`',
  '`npx -y --package nz-legislation-tool nzlegislation --help`',
  '`npx -y --package nz-legislation-tool nzlegislation-mcp`',
]);

requireIncludes('docs/maintainers/package-metadata-review.md', [
  'Status: preparation only; blocked for external publication until all release/submission gates pass.',
  '`nz-legislation-tool` remains the npm package name.',
  'Australian support remains prerelease, planned, or unsupported',
]);

requireIncludes('integrations/README.md', [
  'Integrations',
  'MCP',
  'Claude',
  'Codex',
  'GitHub Copilot',
]);
requireIncludes('integrations/assistant-marketplace-readiness.md', [
  'Claude',
  'Codex',
  'GitHub Copilot',
  'Gemini',
  'Qwen',
  'preparation-only',
  'NZ_LEGISLATION_API_KEY',
]);
requireIncludes('integrations/ide-marketplace-readiness.md', [
  'VS Code Marketplace',
  'Open VSX',
  'JetBrains Marketplace',
  'preparation-only',
]);
requireIncludes('integrations/mcp/example-configs.md', [
  '"command": "npx"',
  '"args": ["-y", "--package", "nz-legislation-tool", "nzlegislation-mcp"]',
]);

for (const workflow of [
  '.github/workflows/ci.yml',
  '.github/workflows/release-stable.yml',
  '.github/workflows/release-next.yml',
  '.github/workflows/publish-github-packages.yml',
]) {
  requireIncludes(workflow, ['pnpm gate:website-docs']);
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
if (packageJson.scripts?.['gate:website-docs'] !== 'tsx scripts/check-website-docs.ts') {
  failures.push('package.json must define gate:website-docs as tsx scripts/check-website-docs.ts');
}

const prematureClaims = [
  {
    pattern: /\bAustralian\s+(?:runtime\s+)?support\s+(?:is\s+)?stable\b/i,
    reason: 'Australian support must not be described as stable in website/docs copy.',
  },
  {
    pattern: /\bstable\s+Australian\s+(?:runtime\s+)?support\b/i,
    reason: 'Australian support must remain prerelease or planned until provider gates pass.',
  },
  {
    pattern: /\bproduction-ready\s+Australian\s+(?:runtime\s+)?support\b/i,
    reason: 'Australian support is not production-ready.',
  },
];

for (const path of requiredDocs) {
  for (const { pattern, reason } of prematureClaims) rejectPattern(path, pattern, reason);
}

if (failures.length > 0) {
  console.error('Website/docs gate failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log('Website/docs gate passed: docs and website control files match release posture.');
