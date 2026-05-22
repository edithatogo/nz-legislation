import {
  getProviderCapabilities,
  type JurisdictionCode,
  type ProviderCapability,
} from './capability-manifest.js';
import { commonwealthProviderSource, type CommonwealthProviderSource } from './commonwealth.js';

export type ProviderRuntimeKind = 'legacy-nz-client' | 'gated-au-adapter' | 'planned-au-provider';

export interface ProviderRegistryEntry {
  readonly jurisdiction: JurisdictionCode;
  readonly providerId: string;
  readonly runtimeKind: ProviderRuntimeKind;
  readonly runtimeSupported: boolean;
  readonly capability: ProviderCapability;
  readonly source?: CommonwealthProviderSource;
}

function runtimeKindForCapability(capability: ProviderCapability): ProviderRuntimeKind {
  if (capability.jurisdiction === 'nz') {
    return 'legacy-nz-client';
  }

  if (capability.jurisdiction === commonwealthProviderSource.jurisdiction) {
    return 'gated-au-adapter';
  }

  return 'planned-au-provider';
}

function sourceForCapability(
  capability: ProviderCapability
): CommonwealthProviderSource | undefined {
  if (capability.jurisdiction === commonwealthProviderSource.jurisdiction) {
    return commonwealthProviderSource;
  }

  return undefined;
}

function registryEntryForCapability(capability: ProviderCapability): ProviderRegistryEntry {
  const runtimeKind = runtimeKindForCapability(capability);

  return {
    jurisdiction: capability.jurisdiction,
    providerId: capability.providerId,
    runtimeKind,
    runtimeSupported: capability.releaseChannel === 'stable' && capability.jurisdiction === 'nz',
    capability,
    source: sourceForCapability(capability),
  };
}

export function getProviderRegistry(): readonly ProviderRegistryEntry[] {
  return getProviderCapabilities().map(registryEntryForCapability);
}

export function getProviderRegistryEntry(jurisdiction: JurisdictionCode): ProviderRegistryEntry {
  const entry = getProviderRegistry().find(item => item.jurisdiction === jurisdiction);

  if (!entry) {
    throw new Error(`Unknown provider registry jurisdiction: ${jurisdiction}`);
  }

  return entry;
}

export function getRuntimeProviderRegistry(): readonly ProviderRegistryEntry[] {
  return getProviderRegistry().filter(entry => entry.runtimeSupported);
}
