import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

import { getProviderCapability } from '../src/providers/capability-manifest.ts';
import { getProviderSourceCard } from '../src/providers/source-cards.ts';

interface NswSourceShape {
  jurisdiction: string;
  providerId: string;
  sourceAuthority: string;
  websiteUrl: string;
  exportHelpUrl: string;
  accessGuidanceUrl: string;
  formats: string[];
  collections: string[];
  exportQueryFields: string[];
  listingFormat: string;
  automationGuidance: string;
  runtimeStatus: string;
  runtimeSupported: boolean;
  sourceBacked: boolean;
  legalRecordsIncluded: boolean;
}

const fixture = JSON.parse(
  readFileSync(resolve(process.cwd(), 'tests/fixtures/nsw/source-shape.json'), 'utf8')
) as NswSourceShape;

describe('NSW provider source shape', () => {
  it('records only official export metadata and no legal records', () => {
    expect(fixture).toMatchObject({
      jurisdiction: 'au-nsw',
      providerId: 'nsw-legislation',
      sourceAuthority: expect.stringContaining('NSW Parliamentary Counsel'),
      formats: ['xml', 'json'],
      collections: ['in-force', 'repealed'],
      listingFormat: 'json',
      runtimeStatus: 'planned',
      runtimeSupported: false,
      sourceBacked: true,
      legalRecordsIncluded: false,
    });

    for (const url of [fixture.websiteUrl, fixture.exportHelpUrl, fixture.accessGuidanceUrl]) {
      expect(new URL(url).protocol).toBe('https:');
      expect(new URL(url).hostname).toMatch(/(?:legislation\.nsw\.gov\.au|pco\.nsw\.gov\.au)$/);
    }
    expect(fixture.exportQueryFields).toEqual(
      expect.arrayContaining(['type', 'year', 'number', 'title', 'repealed', 'last-updated'])
    );
    expect(fixture.automationGuidance).toMatch(/outside normal NSW business hours/i);
  });

  it('keeps NSW explicitly planned and unsupported in runtime contracts', () => {
    const capability = getProviderCapability('au-nsw');
    const card = getProviderSourceCard('au-nsw');

    expect(capability).toMatchObject({
      providerId: fixture.providerId,
      releaseChannel: 'planned',
      sourceAuthority: 'NSW legislation XML export surface',
    });
    expect(card).toMatchObject({
      runtimeSupported: false,
      runtimeKind: 'planned-au-provider',
      releaseGate: { status: 'blocked' },
      submissionGate: { status: 'blocked' },
    });
    for (const feature of Object.values(card.sourceBackedFeatureSummary.features)) {
      expect(feature).toMatchObject({ status: 'unsupported', sourceBacked: false });
    }
  });
});
