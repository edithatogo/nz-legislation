import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const read = (path: string): string => readFileSync(path, 'utf8');
const failures: string[] = [];

function readJson<T>(path: string): T | null {
  if (!existsSync(path)) {
    failures.push(`Missing channel readiness artifact: ${path}`);
    return null;
  }
  return JSON.parse(read(path)) as T;
}

interface SubmissionContract {
  allowed: boolean;
  reason: string;
}

interface ClaimContract {
  nz: string;
  australia: string;
}

interface RegistryMetadata {
  registry: string;
  status: string;
  packageName: string;
  command: string;
  args: string[];
  env: string[];
  capabilityMatrix: string;
  sourceCards: string;
  license: string;
  maintainer: string;
  claims: ClaimContract;
  submission: SubmissionContract;
}

function assertNotSubmitted(path: string, status: string, submission: SubmissionContract): void {
  if (status !== 'not_submitted' && status !== 'not_started') {
    failures.push(`${path} must remain not_submitted or not_started.`);
  }
  if (submission.allowed !== false) {
    failures.push(`${path} must block external submission/publication.`);
  }
  if (!submission.reason || !/gate|blocked|review|evidence/i.test(submission.reason)) {
    failures.push(
      `${path} submission.reason must explain the blocking gate or evidence requirement.`
    );
  }
}

function assertClaims(path: string, claims: ClaimContract): void {
  if (!/stable/i.test(claims.nz)) {
    failures.push(`${path} must describe NZ as stable.`);
  }
  if (!/(prerelease|planned|unsupported)/i.test(claims.australia)) {
    failures.push(
      `${path} must describe Australian support as prerelease, planned, or unsupported.`
    );
  }
  if (
    /stable Australian|Australian stable|production-ready Australian/i.test(JSON.stringify(claims))
  ) {
    failures.push(`${path} must not claim stable Australian support.`);
  }
}

const registryDir = 'integrations/mcp/registry-metadata';
const expectedRegistries = ['smithery', 'mcp-so', 'mcp-market', 'mcp-store', 'pulsemcp', 'glama'];
for (const name of expectedRegistries) {
  const path = join(registryDir, `${name}.json`).replaceAll('\\', '/');
  const metadata = readJson<RegistryMetadata>(path);
  if (!metadata) continue;
  assertNotSubmitted(path, metadata.status, metadata.submission);
  assertClaims(path, metadata.claims);
  if (metadata.packageName !== 'nz-legislation-tool')
    failures.push(`${path} packageName must be nz-legislation-tool.`);
  if (metadata.command !== 'npx') failures.push(`${path} command must be npx.`);
  if (metadata.args.join(' ') !== '-y --package nz-legislation-tool nzlegislation-mcp') {
    failures.push(`${path} args must execute nzlegislation-mcp via nz-legislation-tool.`);
  }
  if (!metadata.env.includes('NZ_LEGISLATION_API_KEY'))
    failures.push(`${path} must list NZ_LEGISLATION_API_KEY.`);
  if (metadata.capabilityMatrix !== 'docs/capabilities.md')
    failures.push(`${path} must link docs/capabilities.md.`);
  if (metadata.sourceCards !== 'docs/maintainers/provider-source-cards.md')
    failures.push(`${path} must link provider source cards.`);
  if (metadata.license !== 'Apache-2.0') failures.push(`${path} license must be Apache-2.0.`);
}

const registryFiles = existsSync(registryDir)
  ? readdirSync(registryDir).filter(file => file.endsWith('.json'))
  : [];
if (registryFiles.length !== expectedRegistries.length) {
  failures.push(
    `${registryDir} must contain exactly ${expectedRegistries.length} registry metadata files.`
  );
}

const vscode = readJson<{
  status: string;
  submission: SubmissionContract;
  packageNames: Record<string, string>;
  commands: Array<{ id: string; title: string; runtime: string }>;
  activationEvents: string[];
  permissions: string[];
  apiKeyHandling: string;
  claims: ClaimContract;
}>('integrations/vscode/extension-contract.json');
if (vscode) {
  assertNotSubmitted(
    'integrations/vscode/extension-contract.json',
    vscode.status,
    vscode.submission
  );
  assertClaims('integrations/vscode/extension-contract.json', vscode.claims);
  if (!vscode.permissions.includes('secretStorage'))
    failures.push('VS Code contract must require secretStorage.');
  if (!/SecretStorage/.test(vscode.apiKeyHandling))
    failures.push('VS Code contract must describe SecretStorage API key handling.');
  if (!vscode.commands.some(command => command.runtime === 'nzlegislation'))
    failures.push('VS Code contract must map at least one command to nzlegislation.');
}

const container = readJson<{
  status: string;
  submission: SubmissionContract;
  image: string;
  entrypoints: string[];
  sbom: string;
  provenance: string;
  threatModel: string;
  snippetVerification: string;
  claims: ClaimContract;
}>('distribution/container/container-contract.json');
if (container) {
  assertNotSubmitted(
    'distribution/container/container-contract.json',
    container.status,
    container.submission
  );
  assertClaims('distribution/container/container-contract.json', container.claims);
  for (const bin of [
    'nzlegislation',
    'nzlegislation-mcp',
    'anzlegislation',
    'anzlegislation-mcp',
    'legislation',
    'legislation-mcp',
  ]) {
    if (!container.entrypoints.includes(bin))
      failures.push(`Container contract must include entrypoint ${bin}.`);
  }
  if (!/required/i.test(container.sbom) || !/required/i.test(container.provenance)) {
    failures.push('Container contract must require SBOM and provenance before publication.');
  }
  if (!existsSync(container.threatModel) || !existsSync(container.snippetVerification)) {
    failures.push(
      'Container contract must link an existing threat model and snippet verification record.'
    );
  }
}

const homebrew = readJson<{
  status: string;
  submission: SubmissionContract;
  formulaName: string;
  installCommand: string;
  binaries: string[];
  checksumSource: string;
  threatModel: string;
  snippetVerification: string;
  claims: ClaimContract;
}>('distribution/homebrew/formula-contract.json');
if (homebrew) {
  assertNotSubmitted(
    'distribution/homebrew/formula-contract.json',
    homebrew.status,
    homebrew.submission
  );
  assertClaims('distribution/homebrew/formula-contract.json', homebrew.claims);
  if (homebrew.formulaName !== 'nz-legislation-tool')
    failures.push('Homebrew formulaName must be nz-legislation-tool.');
  for (const bin of [
    'nzlegislation',
    'nzlegislation-mcp',
    'anzlegislation',
    'anzlegislation-mcp',
    'legislation',
    'legislation-mcp',
  ]) {
    if (!homebrew.binaries.includes(bin))
      failures.push(`Homebrew contract must include binary ${bin}.`);
  }
  if (!/brew install/.test(homebrew.installCommand))
    failures.push('Homebrew contract must include a brew install command.');
  if (!existsSync(homebrew.threatModel) || !existsSync(homebrew.snippetVerification)) {
    failures.push(
      'Homebrew contract must link an existing threat model and snippet verification record.'
    );
  }
}

for (const workflow of [
  '.github/workflows/ci.yml',
  '.github/workflows/release-stable.yml',
  '.github/workflows/release-next.yml',
  '.github/workflows/publish-github-packages.yml',
]) {
  if (!read(workflow).includes('pnpm gate:channel-readiness')) {
    failures.push(`${workflow} must run pnpm gate:channel-readiness.`);
  }
}

const packageJson = JSON.parse(read('package.json')) as { scripts?: Record<string, string> };
if (packageJson.scripts?.['gate:channel-readiness'] !== 'tsx scripts/check-channel-readiness.ts') {
  failures.push(
    'package.json must define gate:channel-readiness as tsx scripts/check-channel-readiness.ts'
  );
}

if (failures.length > 0) {
  console.error('Channel readiness gate failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(
  'Channel readiness gate passed: registry, assistant/IDE, container, and Homebrew contracts are local-only and guarded.'
);
