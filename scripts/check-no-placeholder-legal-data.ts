import {
  getProviderCapabilities,
  type ProviderCapability,
} from '../src/providers/capability-manifest.js';

const placeholderTerms = /\b(dummy|fake|lorem|placeholder|sample)\b/i;

const failures: string[] = [];

function assertNoPlaceholderText(capability: ProviderCapability): void {
  const fields = [
    capability.label,
    capability.providerId,
    capability.sourceAuthority,
    capability.releaseChannel,
    ...Object.values(capability.features).flatMap(feature => [
      feature.status,
      String(feature.sourceBacked),
      feature.notes,
    ]),
  ];

  if (fields.some(field => placeholderTerms.test(field))) {
    failures.push(`${capability.jurisdiction}: capability manifest contains placeholder wording`);
  }
}

for (const capability of getProviderCapabilities()) {
  assertNoPlaceholderText(capability);

  const featureEntries = Object.entries(capability.features);

  for (const [featureName, feature] of featureEntries) {
    if (feature.status === 'supported' && !feature.sourceBacked) {
      failures.push(
        `${capability.jurisdiction}.${featureName}: supported features must be source-backed`
      );
    }

    if (capability.releaseChannel === 'planned' && feature.status === 'supported') {
      failures.push(
        `${capability.jurisdiction}.${featureName}: planned providers cannot expose supported legal data`
      );
    }

    if (capability.jurisdiction.startsWith('au-') && feature.sourceBacked) {
      failures.push(
        `${capability.jurisdiction}.${featureName}: Australian providers must remain unbacked until source validation lands`
      );
    }
  }
}

if (failures.length > 0) {
  console.error('No-placeholder legal data gate failed:');
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('No-placeholder legal data gate passed');
