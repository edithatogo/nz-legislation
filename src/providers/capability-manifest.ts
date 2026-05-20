export type JurisdictionCode =
  | 'nz'
  | 'au-commonwealth'
  | 'au-qld'
  | 'au-nsw'
  | 'au-vic'
  | 'au-sa'
  | 'au-wa'
  | 'au-tas'
  | 'au-act'
  | 'au-nt';

export type CapabilityStatus = 'supported' | 'prerelease' | 'unsupported';

export type ProviderFeature =
  | 'search'
  | 'getWork'
  | 'getVersions'
  | 'getVersion'
  | 'citation'
  | 'export'
  | 'mcp';

export interface FeatureCapability {
  status: CapabilityStatus;
  sourceBacked: boolean;
  notes: string;
}

export interface ProviderCapability {
  jurisdiction: JurisdictionCode;
  label: string;
  providerId: string;
  sourceAuthority: string;
  releaseChannel: 'stable' | 'prerelease' | 'planned';
  features: Record<ProviderFeature, FeatureCapability>;
}

export interface UnsupportedProviderCapability {
  error: 'unsupported_provider_capability';
  jurisdiction: JurisdictionCode;
  providerId: string;
  feature: ProviderFeature;
  status: CapabilityStatus;
  sourceBacked: boolean;
  message: string;
}

export class ProviderCapabilityError extends Error {
  readonly details: UnsupportedProviderCapability;

  constructor(details: UnsupportedProviderCapability) {
    super(details.message);
    this.name = 'ProviderCapabilityError';
    this.details = details;
  }
}

const supportedNzFeature: FeatureCapability = {
  status: 'supported',
  sourceBacked: true,
  notes: 'Backed by the existing legislation.govt.nz API client surface.',
};

const unsupportedAuFeature: FeatureCapability = {
  status: 'unsupported',
  sourceBacked: false,
  notes:
    'Source validation and provider implementation are required before this feature can be enabled.',
};

const cloneFeature = (capability: FeatureCapability): FeatureCapability => ({ ...capability });

const features = (capability: FeatureCapability): Record<ProviderFeature, FeatureCapability> => ({
  search: cloneFeature(capability),
  getWork: cloneFeature(capability),
  getVersions: cloneFeature(capability),
  getVersion: cloneFeature(capability),
  citation: cloneFeature(capability),
  export: cloneFeature(capability),
  mcp: cloneFeature(capability),
});

export const providerCapabilityManifest: readonly ProviderCapability[] = [
  {
    jurisdiction: 'nz',
    label: 'New Zealand',
    providerId: 'legislation-govt-nz',
    sourceAuthority: 'legislation.govt.nz',
    releaseChannel: 'stable',
    features: features(supportedNzFeature),
  },
  {
    jurisdiction: 'au-commonwealth',
    label: 'Australian Commonwealth',
    providerId: 'federal-register-of-legislation',
    sourceAuthority: 'Federal Register of Legislation',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-qld',
    label: 'Queensland',
    providerId: 'queensland-legislation',
    sourceAuthority: 'Queensland legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-nsw',
    label: 'New South Wales',
    providerId: 'nsw-legislation',
    sourceAuthority: 'NSW legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-vic',
    label: 'Victoria',
    providerId: 'victorian-legislation',
    sourceAuthority: 'Victorian legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-sa',
    label: 'South Australia',
    providerId: 'south-australian-legislation',
    sourceAuthority: 'South Australian legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-wa',
    label: 'Western Australia',
    providerId: 'western-australian-legislation',
    sourceAuthority: 'Western Australian legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-tas',
    label: 'Tasmania',
    providerId: 'tasmanian-legislation',
    sourceAuthority: 'Tasmanian legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-act',
    label: 'Australian Capital Territory',
    providerId: 'act-legislation',
    sourceAuthority: 'ACT legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
  {
    jurisdiction: 'au-nt',
    label: 'Northern Territory',
    providerId: 'northern-territory-legislation',
    sourceAuthority: 'Northern Territory legislation official source',
    releaseChannel: 'planned',
    features: features(unsupportedAuFeature),
  },
] as const;

function cloneProviderCapability(capability: ProviderCapability): ProviderCapability {
  return {
    ...capability,
    features: Object.fromEntries(
      Object.entries(capability.features).map(([feature, value]) => [feature, cloneFeature(value)])
    ) as Record<ProviderFeature, FeatureCapability>,
  };
}

export function getProviderCapabilities(): readonly ProviderCapability[] {
  return providerCapabilityManifest.map(cloneProviderCapability);
}

export function getProviderCapability(jurisdiction: JurisdictionCode): ProviderCapability {
  const capability = providerCapabilityManifest.find(item => item.jurisdiction === jurisdiction);

  if (!capability) {
    throw new Error(`Unknown jurisdiction capability: ${jurisdiction}`);
  }

  return cloneProviderCapability(capability);
}

export function isFeatureSupported(
  jurisdiction: JurisdictionCode,
  feature: ProviderFeature
): boolean {
  return getProviderCapability(jurisdiction).features[feature].status === 'supported';
}

export function getUnsupportedProviderCapability(
  jurisdiction: JurisdictionCode,
  feature: ProviderFeature
): UnsupportedProviderCapability | null {
  const capability = getProviderCapability(jurisdiction);
  const featureCapability = capability.features[feature];

  if (featureCapability.status === 'supported') {
    return null;
  }

  return {
    error: 'unsupported_provider_capability',
    jurisdiction,
    providerId: capability.providerId,
    feature,
    status: featureCapability.status,
    sourceBacked: featureCapability.sourceBacked,
    message: `${capability.label} ${feature} is ${featureCapability.status}. ${featureCapability.notes}`,
  };
}

export function assertFeatureSupported(
  jurisdiction: JurisdictionCode,
  feature: ProviderFeature
): void {
  const unsupported = getUnsupportedProviderCapability(jurisdiction, feature);

  if (unsupported) {
    throw new ProviderCapabilityError(unsupported);
  }
}
