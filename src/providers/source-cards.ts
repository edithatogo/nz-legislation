import {
  type CapabilityStatus,
  type FeatureCapability,
  type JurisdictionCode,
  type ProviderFeature,
} from './capability-manifest.js';
import {
  getProviderRegistry,
  getProviderRegistryEntry,
  type ProviderRegistryEntry,
  type ProviderRuntimeKind,
} from './registry.js';

export type ProviderSourceCardGateStatus = 'allowed' | 'blocked';

export interface ProviderSourceCardGate {
  readonly status: ProviderSourceCardGateStatus;
  readonly reason: string;
}

export interface ProviderSourceFeatureSummary {
  readonly status: CapabilityStatus;
  readonly sourceBacked: boolean;
  readonly notes: string;
}

export interface ProviderSourceBackedFeatureSummary {
  readonly sourceBacked: readonly ProviderFeature[];
  readonly notSourceBacked: readonly ProviderFeature[];
  readonly features: Readonly<Record<ProviderFeature, ProviderSourceFeatureSummary>>;
}

export interface ProviderSourceMetadata {
  readonly apiBaseUrl?: string;
  readonly registerBaseUrl?: string;
  readonly runtimeEnabled?: boolean;
}

export interface ProviderSourceCard {
  readonly jurisdiction: JurisdictionCode;
  readonly providerId: string;
  readonly sourceAuthority: string;
  readonly releaseChannel: ProviderRegistryEntry['capability']['releaseChannel'];
  readonly runtimeSupported: boolean;
  readonly runtimeKind: ProviderRuntimeKind;
  readonly sourceBackedFeatureSummary: ProviderSourceBackedFeatureSummary;
  readonly releaseGate: ProviderSourceCardGate;
  readonly submissionGate: ProviderSourceCardGate;
  readonly sourceMetadata?: ProviderSourceMetadata;
}

const gateAllowed = (entry: ProviderRegistryEntry): boolean =>
  entry.capability.jurisdiction === 'nz' &&
  entry.capability.releaseChannel === 'stable' &&
  entry.runtimeSupported;

function buildGate(
  entry: ProviderRegistryEntry,
  gateName: 'release' | 'submission'
): ProviderSourceCardGate {
  if (gateAllowed(entry)) {
    return Object.freeze({
      status: 'allowed',
      reason: 'New Zealand is the only stable runtime-supported provider.',
    });
  }

  return Object.freeze({
    status: 'blocked',
    reason: `${entry.capability.label} ${gateName} is blocked until the provider is stable and runtime-supported.`,
  });
}

function cloneFeatureSummary(feature: FeatureCapability): ProviderSourceFeatureSummary {
  return Object.freeze({
    status: feature.status,
    sourceBacked: feature.sourceBacked,
    notes: feature.notes,
  });
}

function buildSourceBackedFeatureSummary(
  entry: ProviderRegistryEntry
): ProviderSourceBackedFeatureSummary {
  const features = Object.fromEntries(
    Object.entries(entry.capability.features).map(([feature, capability]) => [
      feature,
      cloneFeatureSummary(capability),
    ])
  ) as Record<ProviderFeature, ProviderSourceFeatureSummary>;

  return Object.freeze({
    sourceBacked: Object.freeze(
      Object.entries(features)
        .filter(([, capability]) => capability.sourceBacked)
        .map(([feature]) => feature as ProviderFeature)
    ),
    notSourceBacked: Object.freeze(
      Object.entries(features)
        .filter(([, capability]) => !capability.sourceBacked)
        .map(([feature]) => feature as ProviderFeature)
    ),
    features: Object.freeze(features),
  });
}

function buildSourceMetadata(entry: ProviderRegistryEntry): ProviderSourceMetadata | undefined {
  if (!entry.source) {
    return undefined;
  }

  return Object.freeze({
    apiBaseUrl: entry.source.apiBaseUrl,
    registerBaseUrl: entry.source.registerBaseUrl,
    runtimeEnabled: entry.source.runtimeEnabled,
  });
}

export function buildProviderSourceCard(entry: ProviderRegistryEntry): ProviderSourceCard {
  const card = {
    jurisdiction: entry.jurisdiction,
    providerId: entry.providerId,
    sourceAuthority: entry.capability.sourceAuthority,
    releaseChannel: entry.capability.releaseChannel,
    runtimeSupported: entry.runtimeSupported,
    runtimeKind: entry.runtimeKind,
    sourceBackedFeatureSummary: buildSourceBackedFeatureSummary(entry),
    releaseGate: buildGate(entry, 'release'),
    submissionGate: buildGate(entry, 'submission'),
    sourceMetadata: buildSourceMetadata(entry),
  };

  return Object.freeze(card);
}

export function getProviderSourceCards(): readonly ProviderSourceCard[] {
  return Object.freeze(getProviderRegistry().map(buildProviderSourceCard));
}

export function getProviderSourceCard(jurisdiction: JurisdictionCode): ProviderSourceCard {
  return buildProviderSourceCard(getProviderRegistryEntry(jurisdiction));
}
