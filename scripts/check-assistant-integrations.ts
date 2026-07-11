import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const matrixPath = 'integrations/assistant-marketplace-readiness.md';
const matrix = existsSync(matrixPath) ? readFileSync(matrixPath, 'utf8') : '';
if (!matrix) failures.push(`Missing ${matrixPath}`);

const targets = [
  ['Claude', 'integrations/claude/README.md', 'docs.anthropic.com'],
  ['Codex', 'integrations/codex/README.md', 'help.openai.com'],
  ['GitHub Copilot', 'integrations/github-copilot/README.md', 'docs.github.com'],
  ['Gemini', 'integrations/gemini/README.md', 'ai.google.dev'],
  ['Qwen', 'integrations/qwen/README.md', 'github.com/QwenLM/Qwen-Agent'],
] as const;

for (const [name, path, sourceDomain] of targets) {
  if (!existsSync(path)) failures.push(`${name}: missing ${path}`);
  if (!new RegExp(`\\|\\s*${name.replace(' ', '\\s+')}\\s*\\|`).test(matrix)) {
    failures.push(`${name}: missing target matrix row`);
  }
  if (!matrix.includes(sourceDomain)) failures.push(`${name}: missing official-source evidence`);
}

for (const forbidden of [/stable Australian/i, /production-ready Australian/i]) {
  if (forbidden.test(matrix))
    failures.push(`Matrix contains forbidden claim or capability: ${forbidden}`);
}

for (const required of [
  'NZ stable',
  'Commonwealth',
  'prerelease',
  'planned or unsupported',
  'NZ_LEGISLATION_API_KEY',
  'preparation-only',
  'Submission gate',
]) {
  if (!matrix.includes(required)) failures.push(`Matrix missing required boundary: ${required}`);
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as {
  bin?: Record<string, string>;
  scripts?: Record<string, string>;
};
for (const bin of ['nzlegislation-mcp', 'anzlegislation-mcp', 'legislation-mcp']) {
  if (!packageJson.bin?.[bin]) failures.push(`package.json is missing MCP binary ${bin}`);
}
if (
  packageJson.scripts?.['gate:assistant-integrations'] !==
  'tsx scripts/check-assistant-integrations.ts'
) {
  failures.push('package.json must define gate:assistant-integrations');
}

if (failures.length > 0) {
  console.error('Assistant integration gate failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(
  'Assistant integration gate passed: five target surfaces are mapped, source-backed, and publication-blocked.'
);
