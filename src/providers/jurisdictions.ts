import type { JurisdictionCode } from './capability-manifest.js';

export const jurisdictionCodes = [
  'nz',
  'au-commonwealth',
  'au-qld',
  'au-nsw',
  'au-vic',
  'au-sa',
  'au-wa',
  'au-tas',
  'au-act',
  'au-nt',
] as const satisfies readonly JurisdictionCode[];

const jurisdictionAliases: Record<string, JurisdictionCode> = {
  au: 'au-commonwealth',
  'au-comm': 'au-commonwealth',
  'au-commonwealth': 'au-commonwealth',
  commonwealth: 'au-commonwealth',
  nz: 'nz',
};

export function parseJurisdictionCode(input: string = 'nz'): JurisdictionCode {
  const normalized = input.trim().toLowerCase();
  const alias = jurisdictionAliases[normalized];

  if (alias) {
    return alias;
  }

  if ((jurisdictionCodes as readonly string[]).includes(normalized)) {
    return normalized as JurisdictionCode;
  }

  throw new Error(
    `Unknown jurisdiction "${input}". Supported values: ${jurisdictionCodes.join(', ')}`
  );
}
