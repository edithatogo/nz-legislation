import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const read = (path: string): string => (existsSync(path) ? readFileSync(path, 'utf8') : '');
const matrixPath = 'integrations/ide-marketplace-readiness.md';
const matrix = read(matrixPath);
if (!matrix) failures.push(`Missing ${matrixPath}`);

for (const [name, path, source] of [
  ['VS Code', 'integrations/vscode/extension-contract.json', 'code.visualstudio.com'],
  ['Open VSX', 'integrations/vscode/openvsx-contract.json', 'github.com/eclipse-openvsx/openvsx'],
  ['JetBrains', 'integrations/jetbrains/plugin-contract.json', 'plugins.jetbrains.com'],
] as const) {
  const content = read(path);
  if (!content) failures.push(`${name}: missing ${path}`);
  if (!matrix.includes(name)) failures.push(`${name}: missing readiness matrix entry`);
  if (!matrix.includes(source)) failures.push(`${name}: missing official-source evidence`);
  if (!content.includes('"allowed": false'))
    failures.push(`${name}: submission must remain blocked`);
  if (!content.includes('threat-model.md')) failures.push(`${name}: missing threat-model link`);
  if (!content.includes('readinessMatrix')) failures.push(`${name}: missing readiness-matrix link`);
  for (const requiredLink of ['capabilityManifest', 'sourceCards', 'snippetVerification']) {
    if (!content.includes(requiredLink)) failures.push(`${name}: missing ${requiredLink} link`);
  }
  if (/stable Australian|production-ready Australian/i.test(content)) {
    failures.push(`${name}: contains an unsupported Australian stability claim`);
  }
}

for (const required of [
  'SecretStorage',
  'Open VSX',
  'JetBrains Marketplace',
  'VS Code Marketplace',
  'NZ is stable',
  'Commonwealth is prerelease',
  'planned or unsupported',
  'preparation-only',
]) {
  if (!matrix.includes(required)) failures.push(`Matrix missing required boundary: ${required}`);
}

if (failures.length > 0) {
  console.error('IDE integration gate failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(
  'IDE integration gate passed: VS Code, Open VSX, and JetBrains readiness is mapped and publication-blocked.'
);
