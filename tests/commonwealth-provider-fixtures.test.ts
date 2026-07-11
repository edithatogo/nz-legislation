import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';

type Fixture = Record<string, unknown>;

const readFixture = (name: string): Fixture =>
  JSON.parse(readFileSync(`tests/fixtures/commonwealth/${name}`, 'utf8')) as Fixture;

describe('Commonwealth official API-shaped fixtures', () => {
  it('contains title, search, version, and document metadata shapes', () => {
    const search = readFixture('title-search.json');
    const title = readFixture('title-by-id.json');
    const versions = readFixture('versions.json');
    const document = readFixture('document-metadata.json');

    expect(search.value).toHaveLength(1);
    expect(title.value).toHaveLength(1);
    expect(versions.value).toHaveLength(2);
    expect(document).toMatchObject({
      sourceAuthority: 'Federal Register of Legislation',
      contentIncluded: false,
    });
  });

  it('contains no fabricated legal content or placeholder records', () => {
    const serialized = [
      'title-search.json',
      'title-by-id.json',
      'versions.json',
      'document-metadata.json',
    ]
      .map(name => readFileSync(`tests/fixtures/commonwealth/${name}`, 'utf8').toLowerCase())
      .join('\n');

    expect(serialized).not.toMatch(/placeholder|dummy|fake|sample legal text/);
    expect(serialized).toContain('c2004a01224');
  });
});
