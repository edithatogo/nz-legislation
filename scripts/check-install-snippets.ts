import { readFileSync } from 'node:fs';

interface PackageJson {
  bin?: Record<string, string>;
  scripts?: Record<string, string>;
}

const read = (path: string): string => readFileSync(path, 'utf8');
const packageJson = JSON.parse(read('package.json')) as PackageJson;
const bins = packageJson.bin ?? {};
const failures: string[] = [];

const requiredBins = ['nzlegislation', 'nzlegislation-mcp'];
for (const bin of requiredBins) {
  if (!bins[bin]) {
    failures.push(`package.json is missing required bin ${bin}.`);
  }
}

const snippetExpectations: Array<{ path: string; required: string[] }> = [
  {
    path: 'README.md',
    required: [
      'npm install -g nz-legislation-tool',
      'nzlegislation search --query "health act"',
      'nzlegislation-mcp',
      'npx -y --package nz-legislation-tool nzlegislation search --query "health"',
    ],
  },
  {
    path: 'integrations/mcp/example-configs.md',
    required: [
      '"command": "npx"',
      '"args": ["-y", "--package", "nz-legislation-tool", "nzlegislation-mcp"]',
      'NZ_LEGISLATION_API_KEY',
    ],
  },
  {
    path: 'docs/maintainers/install-snippet-verification.md',
    required: [
      '`npm install -g nz-legislation-tool`',
      '`npx -y --package nz-legislation-tool nzlegislation --help`',
      '`npx -y --package nz-legislation-tool nzlegislation-mcp`',
    ],
  },
];

for (const expectation of snippetExpectations) {
  const content = read(expectation.path);
  for (const required of expectation.required) {
    if (!content.includes(required)) {
      failures.push(`${expectation.path} is missing required install snippet: ${required}`);
    }
  }
}

const forbiddenPatterns: Array<{ pattern: RegExp; reason: string }> = [
  {
    pattern: /npx\s+(?!-y\s+--package\s+nz-legislation-tool\s+nzlegislation)nz-legislation-tool\b/g,
    reason:
      'use `npx -y --package nz-legislation-tool nzlegislation ...` because the package bin is `nzlegislation`.',
  },
  {
    pattern: /"args"\s*:\s*\[\s*"-y"\s*,\s*"nz-legislation-tool"\s*,\s*"mcp"\s*\]/g,
    reason: 'MCP snippets must execute the packaged `nzlegislation-mcp` binary.',
  },
  {
    pattern: /\bnz-legislation-tool\s+mcp\b/g,
    reason: 'there is no documented `mcp` subcommand; use `nzlegislation-mcp`.',
  },
];

const checkedSnippetFiles = [
  'README.md',
  'integrations/mcp/example-configs.md',
  'docs/maintainers/install-snippet-verification.md',
  'integrations/mcp/registry-submission-checklist.md',
  'integrations/mcp/submission-evidence-template.md',
];

for (const path of checkedSnippetFiles) {
  const content = read(path);
  for (const { pattern, reason } of forbiddenPatterns) {
    const matches = [...content.matchAll(pattern)];
    if (matches.length > 0) {
      failures.push(
        `${path} contains ${matches.length} unverified install snippet pattern(s): ${reason}`
      );
    }
  }
}

if (failures.length > 0) {
  console.error('Install snippet gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Install snippet gate passed: package bins and high-risk snippets are aligned.');
