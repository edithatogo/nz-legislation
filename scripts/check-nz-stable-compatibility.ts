import { readFileSync } from 'node:fs';

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  name?: string;
  bin?: Record<string, string>;
};
const manifest = readFileSync('src/providers/capability-manifest.ts', 'utf8');
const documents = [
  readFileSync('docs/capabilities.md', 'utf8'),
  readFileSync('docs/provider-runtime.md', 'utf8'),
  readFileSync('docs/maintainers/release-notes-anz-readiness-draft.md', 'utf8'),
];
const failures: string[] = [];

if (packageJson.name !== 'nz-legislation-tool') failures.push('Stable package name drifted.');
for (const binary of [
  'nzlegislation',
  'nzlegislation-mcp',
  'anzlegislation',
  'anzlegislation-mcp',
]) {
  if (!packageJson.bin?.[binary]) failures.push(`Missing compatibility binary: ${binary}`);
}
if ((manifest.match(/releaseChannel: 'stable',/g) ?? []).length !== 1) {
  failures.push('Provider manifest must have exactly one stable entry.');
}
if (!manifest.includes("jurisdiction: 'nz'")) failures.push('Stable manifest entry must be NZ.');
for (const content of documents) {
  if (!/New Zealand[^\n]*(stable|Stable)/.test(content))
    failures.push('A document lacks NZ stable language.');
  if (!/(Commonwealth|Australian)/i.test(content) || !/(prerelease|planned)/i.test(content)) {
    failures.push('A document lacks Commonwealth prerelease/planned language.');
  }
}
if (failures.length) {
  console.error('NZ stable compatibility gate failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log('NZ stable compatibility gate passed: names, manifest, and maturity docs are aligned.');
