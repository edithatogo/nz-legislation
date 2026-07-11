import { existsSync, readFileSync } from 'node:fs';

const failures: string[] = [];
const workflowPath = '.github/workflows/mirror_sync.yml';
const evidencePath = 'docs/maintainers/mirror-readiness.md';
const workflow = existsSync(workflowPath) ? readFileSync(workflowPath, 'utf8') : '';
const evidence = existsSync(evidencePath) ? readFileSync(evidencePath, 'utf8') : '';
if (!workflow) failures.push(`Missing ${workflowPath}`);
if (!evidence) failures.push(`Missing ${evidencePath}`);

for (const required of [
  'workflow_dispatch',
  'branches: [main, master]',
  'GIT_MIRROR_URL',
  'GIT_MIRROR_SSH_PRIVATE_KEY',
  'GIT_MIRROR_KNOWN_HOSTS',
  'printf \'%s\\n\' "$GIT_MIRROR_KNOWN_HOSTS"',
  'chmod 600',
]) {
  if (!workflow.includes(required)) failures.push(`Mirror workflow missing: ${required}`);
}
if (/ssh-keyscan/i.test(workflow))
  failures.push('Mirror workflow must not use runtime ssh-keyscan.');

for (const required of [
  'local workflow complete',
  'GIT_MIRROR_KNOWN_HOSTS',
  'package.json` is private',
  'GITHUB_TOKEN',
  'clean-host install',
]) {
  if (!evidence.includes(required)) failures.push(`Mirror evidence missing: ${required}`);
}

const pkg = JSON.parse(readFileSync('package.json', 'utf8')) as { private?: boolean };
if (pkg.private !== true)
  failures.push('Package publication readiness must reflect current private package state.');

if (failures.length > 0) {
  console.error('Mirror readiness gate failed:');
  failures.forEach(failure => console.error(`- ${failure}`));
  process.exit(1);
}
console.log(
  'Mirror readiness gate passed: local workflow is fail-closed and external credentials/publication remain gated.'
);
