import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const requirementsPath = 'conductor/requirements.md';
const tracksRoot = 'conductor/tracks';
const archiveRoot = 'conductor/archive';

const requiredTracks = [
  'nz-provider-stable-compatibility',
  'anz-provider-commonwealth',
  'anz-provider-queensland',
  'anz-provider-nsw',
  'anz-provider-victoria',
  'anz-provider-south-australia',
  'anz-provider-western-australia',
  'anz-provider-tasmania',
  'anz-provider-act',
  'anz-provider-northern-territory',
  'anz-provider-aggregator-evaluation',
  'anz-openapi-adapter-readiness',
  'anz-publication-package-registries',
  'anz-publication-website-docs',
  'anz-registry-mcp-directories',
  'anz-marketplace-assistant-integrations',
  'anz-marketplace-ide-extensions',
  'anz-distribution-container-homebrew',
  'anz-rust-migration-readiness',
] as const;

const requiredSections = [
  '## MoSCoW policy',
  '## Global contracts',
  '## Provider requirements and contracts',
  '## Publication and registry requirements and contracts',
  '## Validation contract',
] as const;

const requirements = readFileSync(requirementsPath, 'utf8');
const failures: string[] = [];

for (const section of requiredSections) {
  if (!requirements.includes(section)) {
    failures.push(`Missing requirements section: ${section}`);
  }
}

for (const trackId of requiredTracks) {
  if (!requirements.includes(`\`${trackId}\``)) {
    failures.push(`Missing requirements row for ${trackId}`);
  }

  const activeDir = join(tracksRoot, trackId);
  const archivedDir = join(archiveRoot, trackId);
  const trackDir = existsSync(activeDir) ? activeDir : archivedDir;
  for (const file of ['metadata.json', 'spec.md', 'plan.md']) {
    const path = join(trackDir, file);
    if (!existsSync(path)) {
      failures.push(`Missing ${path}`);
    }
  }
}

if (failures.length > 0) {
  console.error('Conductor requirements gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log(
  `Conductor requirements gate passed: ${requiredTracks.length} tracks have MoSCoW contracts and Conductor files.`
);
