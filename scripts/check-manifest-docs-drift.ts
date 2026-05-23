import { readFileSync } from 'node:fs';

import {
  getProviderCapabilities,
  type ProviderCapability,
} from '../src/providers/capability-manifest.js';

interface InventoryRow {
  jurisdiction: string;
  status: string;
}

const inventoryPath = 'docs/maintainers/australian-source-inventory.md';
const llmsPath = 'llms.txt';
const requirementsPath = 'conductor/requirements.md';

const statusLabel = (capability: ProviderCapability): string => {
  switch (capability.releaseChannel) {
    case 'stable':
      return 'Stable';
    case 'prerelease':
      return 'Prerelease';
    case 'planned':
      return 'Planned';
  }
};

const read = (path: string): string => readFileSync(path, 'utf8');

function parseInventoryRows(markdown: string): InventoryRow[] {
  return markdown
    .split(/\r?\n/)
    .filter(line => line.startsWith('| ') && !line.includes('---'))
    .map(line => line.split('|').map(cell => cell.trim()))
    .filter(cells => cells.length >= 6 && cells[1] !== 'Jurisdiction')
    .map(cells => ({ jurisdiction: cells[1], status: cells[4] }));
}

const failures: string[] = [];
const capabilities = getProviderCapabilities();
const australianCapabilities = capabilities.filter(capability =>
  capability.jurisdiction.startsWith('au-')
);
const inventory = read(inventoryPath);
const inventoryRows = parseInventoryRows(inventory);

for (const capability of australianCapabilities) {
  const row = inventoryRows.find(item => item.jurisdiction === capability.label);
  const expectedStatus = statusLabel(capability);

  if (!row) {
    failures.push(`${inventoryPath} is missing a row for ${capability.label}.`);
    continue;
  }

  if (row.status !== expectedStatus) {
    failures.push(
      `${inventoryPath} lists ${capability.label} as ${row.status}; expected ${expectedStatus} from provider capability manifest.`
    );
  }
}

const llms = read(llmsPath);
if (!llms.includes('Australian support is prerelease.')) {
  failures.push(`${llmsPath} must describe Australian support as prerelease.`);
}

if (!llms.includes('runtime capability manifest')) {
  failures.push(`${llmsPath} must direct readers to the runtime capability manifest.`);
}

const requirements = read(requirementsPath);
for (const capability of capabilities) {
  const expectedStatus = statusLabel(capability).toLowerCase();
  if (capability.jurisdiction === 'nz') {
    if (!requirements.includes('Present stable compatibility provider')) {
      failures.push(
        `${requirementsPath} must record NZ as the present stable compatibility provider.`
      );
    }
    continue;
  }

  if (!requirements.includes(capability.label)) {
    failures.push(`${requirementsPath} is missing provider label ${capability.label}.`);
  }

  if (!requirements.toLowerCase().includes(expectedStatus)) {
    failures.push(
      `${requirementsPath} does not include the manifest release channel ${expectedStatus} for ${capability.label}.`
    );
  }
}

const runtimeDocs = read('docs/provider-runtime.md');
const sourceCardDocs = read('docs/maintainers/provider-source-cards.md');
const capabilitiesDocs = read('docs/capabilities.md');

for (const [path, content] of [
  ['docs/provider-runtime.md', runtimeDocs],
  ['docs/maintainers/provider-source-cards.md', sourceCardDocs],
  ['docs/capabilities.md', capabilitiesDocs],
] as const) {
  if (!/Australian Commonwealth/i.test(content) || !/prerelease/i.test(content)) {
    failures.push(path + ' must describe Australian Commonwealth as prerelease.');
  }
  if (
    !/(citation|single-version).{0,80}unsupported/i.test(content) &&
    !/unsupported.{0,80}(citation|single-version)/i.test(content)
  ) {
    failures.push(
      path + ' must record Commonwealth citation and single-version support as unsupported.'
    );
  }
}

const forbiddenClaimPatterns = [
  /Australian support is stable/i,
  /stable Australian support/i,
  /all Australian jurisdictions (are )?supported/i,
  /Queensland .*runtime-supported/i,
  /New South Wales .*runtime-supported/i,
  /Victoria .*runtime-supported/i,
  /South Australia .*runtime-supported/i,
  /Western Australia .*runtime-supported/i,
  /Tasmania .*runtime-supported/i,
  /Australian Capital Territory .*runtime-supported/i,
  /Northern Territory .*runtime-supported/i,
];

const claimSurfaces = [
  'README.md',
  'llms.txt',
  'docs/maintainers/australian-source-inventory.md',
  'docs/maintainers/distribution-submission-map.md',
  'integrations/mcp/registry-submission-checklist.md',
  'integrations/README.md',
];

for (const path of claimSurfaces) {
  const content = read(path);
  for (const pattern of forbiddenClaimPatterns) {
    if (pattern.test(content)) {
      failures.push(`${path} contains forbidden provider capability claim matching ${pattern}.`);
    }
  }
}

if (failures.length > 0) {
  console.error('Manifest/docs drift gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Manifest/docs drift gate passed: ${australianCapabilities.length} Australian provider inventory rows match the capability manifest.`
);
