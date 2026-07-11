import { existsSync, readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

import {
  getProviderCapability,
  getUnsupportedProviderCapability,
} from '../src/providers/capability-manifest.ts';

type ActSourceShape = {
  jurisdiction: string;
  providerId: string;
  authority: { authorisedFormat: string; convenienceFormats: string[]; wordStatus: string };
  accessTerms: { publicAccess: string; machineReadableAccess: string };
  identifierPatterns: Array<{ class: string; pattern: string }>;
  runtimeStatus: string;
  fixturePolicy: string;
};

const sourceShape = JSON.parse(
  readFileSync('docs/maintainers/act-provider-source-shape.json', 'utf8')
) as ActSourceShape;

describe('ACT provider readiness', () => {
  it('keeps the ACT manifest unsupported and provider-aware', () => {
    const capability = getProviderCapability('au-act');
    expect(capability.releaseChannel).toBe('planned');
    expect(
      Object.values(capability.features).every(feature => feature.status === 'unsupported')
    ).toBe(true);
    expect(getUnsupportedProviderCapability('au-act', 'search')).toMatchObject({
      error: 'unsupported_provider_capability',
      jurisdiction: 'au-act',
      providerId: 'act-legislation',
    });
  });

  it('records authoritative format and identifier boundaries without legal text fixtures', () => {
    expect(sourceShape.jurisdiction).toBe('au-act');
    expect(sourceShape.authority.authorisedFormat).toBe('PDF');
    expect(sourceShape.authority.convenienceFormats).toEqual(
      expect.arrayContaining(['HTML', 'Word'])
    );
    expect(sourceShape.authority.wordStatus).toBe('unauthorised');
    expect(sourceShape.accessTerms.publicAccess).toContain('free');
    expect(sourceShape.accessTerms.machineReadableAccess).toContain('not verified');
    expect(sourceShape.identifierPatterns).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ class: 'act', pattern: '^A\\d{4}-\\d+$' }),
        expect.objectContaining({ class: 'subordinate-law' }),
      ])
    );
    expect(sourceShape.runtimeStatus).toBe('unsupported');
    expect(sourceShape.fixturePolicy).toContain('metadata-only');
    expect(existsSync('docs/maintainers/act-provider-readiness.md')).toBe(true);
  });
});
