import {
  getUnsupportedProviderCapability,
  ProviderCapabilityError,
  type JurisdictionCode,
  type ProviderFeature,
  type UnsupportedProviderCapability,
} from './capability-manifest.js';
import { getProviderRegistryEntry } from './registry.js';

export function getUnsupportedRuntimeProviderCapability(
  jurisdiction: JurisdictionCode,
  feature: ProviderFeature
): UnsupportedProviderCapability | null {
  const entry = getProviderRegistryEntry(jurisdiction);
  const featureCapability = entry.capability.features[feature];

  if (entry.runtimeSupported && featureCapability.status === 'supported') {
    return null;
  }

  return (
    getUnsupportedProviderCapability(jurisdiction, feature) ?? {
      error: 'unsupported_provider_capability',
      jurisdiction,
      providerId: entry.providerId,
      feature,
      status: featureCapability.status,
      sourceBacked: featureCapability.sourceBacked,
      message: `${entry.capability.label} ${feature} is not enabled for runtime use. Provider registry runtime kind: ${entry.runtimeKind}.`,
    }
  );
}

export function assertRuntimeProviderSupported(
  jurisdiction: JurisdictionCode,
  feature: ProviderFeature
): void {
  const unsupported = getUnsupportedRuntimeProviderCapability(jurisdiction, feature);

  if (unsupported) {
    throw new ProviderCapabilityError(unsupported);
  }
}
