import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const readinessPath = 'integrations/registry-readiness.json';
interface ReadinessTarget {
  id: string;
  category: 'assistant' | 'mcp-registry';
  status: string;
  artifact: string;
  officialSource: string;
  blockers: string[];
  submission: { allowed: boolean; reason: string };
}
interface ReadinessContract {
  schemaVersion: number;
  status: string;
  externalSubmissionAllowed: boolean;
  packageName: string;
  targets: ReadinessTarget[];
}
if (!existsSync(readinessPath)) {
  failures.push(`Missing ${readinessPath}`);
}
let readiness: ReadinessContract | undefined;
if (existsSync(readinessPath)) {
  try {
    readiness = JSON.parse(readFileSync(readinessPath, 'utf8')) as ReadinessContract;
  } catch {
    failures.push(`${readinessPath} must contain valid JSON.`);
  }
}
if (readiness) {
  if (readiness.schemaVersion !== 1) failures.push(`${readinessPath} schemaVersion must be 1.`);
  if (readiness.status !== 'preparation-only')
    failures.push(`${readinessPath} must remain preparation-only.`);
  if (readiness.externalSubmissionAllowed !== false)
    failures.push(`${readinessPath} must block external submissions.`);
  if (readiness.packageName !== 'nz-legislation-tool')
    failures.push(`${readinessPath} packageName must be nz-legislation-tool.`);
  const expected = new Set([
    'claude',
    'codex',
    'github-copilot',
    'gemini',
    'qwen',
    'smithery',
    'mcp-so',
    'mcp-market',
    'mcp-store',
    'pulsemcp',
    'glama',
  ]);
  const seen = new Set<string>();
  for (const target of readiness.targets ?? []) {
    seen.add(target.id);
    if (!expected.has(target.id))
      failures.push(`${readinessPath} contains unknown target ${target.id}.`);
    if (target.status !== 'blocked')
      failures.push(`${readinessPath} target ${target.id} must remain blocked.`);
    if (!target.artifact || !existsSync(target.artifact))
      failures.push(`${readinessPath} target ${target.id} must link an existing artifact.`);
    if (!/^https:\/\//.test(target.officialSource))
      failures.push(`${readinessPath} target ${target.id} must link an HTTPS official source.`);
    if (!Array.isArray(target.blockers) || target.blockers.length === 0)
      failures.push(`${readinessPath} target ${target.id} must list blockers.`);
    if (
      target.submission?.allowed !== false ||
      !/preparation|blocked|evidence|review/i.test(target.submission?.reason ?? '')
    )
      failures.push(`${readinessPath} target ${target.id} must block submission with a reason.`);
  }
  for (const target of expected)
    if (!seen.has(target)) failures.push(`${readinessPath} is missing target ${target}.`);
}
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
