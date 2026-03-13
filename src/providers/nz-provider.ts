/**
 * New Zealand Legislation Provider
 *
 * Provides access to New Zealand legislation via the official PCO API
 * at https://api.legislation.govt.nz/
 */

import * as client from '../client.js';

import { BaseLegislationProvider } from './legislation-provider.js';
import type {
  SearchParams,
  SearchResults,
  Work,
  VersionSummary,
  CitationStyle,
} from './legislation-provider.js';
import { normalizeWorkType, parseWorkIdMetadata } from './output-adapters.js';

export class NZLegislationProvider extends BaseLegislationProvider {
  constructor() {
    super(
      'nz',
      'New Zealand',
      { requests: 100, per: 60 }, // 100 requests per minute
      { max: 500, ttl: 24 * 60 * 60 * 1000 }
    );
  }

  /**
   * Search NZ legislation
   */
  protected async searchImpl(params: SearchParams): Promise<SearchResults> {
    const results = await client.searchWorks({
      query: params.query,
      type: params.type,
      status: params.status,
      from: params.from,
      to: params.to,
      limit: params.limit,
      offset: params.offset,
    });

    return {
      total: results.total,
      results: results.results.map(r => ({
        ...parseWorkIdMetadata(r.id),
        work_id: r.id,
        title: r.title,
        shortTitle: r.shortTitle,
        type: r.type,
        status: r.status,
        date: r.date,
        url: r.url,
        versionCount: r.versionCount,
        jurisdiction: 'nz',
      })),
      limit: results.limit,
      offset: results.offset,
    };
  }

  /**
   * Get work by ID
   */
  protected async getWorkImpl(workId: string): Promise<Work> {
    const [work, versions] = await Promise.all([
      client.getWork(workId),
      client.getWorkVersions(workId),
    ]);

    return {
      ...parseWorkIdMetadata(work.id),
      work_id: work.id,
      title: work.title,
      shortTitle: work.shortTitle,
      type: work.type,
      jurisdiction: 'nz',
      status: work.status,
      date: work.date,
      url: work.url,
      versionCount: work.versionCount || versions.length,
      versions: versions.map(v => ({
        version_id: v.id,
        title: v.id,
        date: v.date,
        is_current: v.isCurrent,
        version: v.version,
        type: v.type,
        formats: v.formats,
      })),
      citations: {},
    };
  }

  /**
   * Get versions of a work
   */
  protected async getVersionsImpl(workId: string): Promise<VersionSummary[]> {
    const versions = await client.getWorkVersions(workId);
    return versions.map(v => ({
      version_id: v.id,
      title: v.id,
      date: v.date,
      is_current: v.isCurrent,
      version: v.version,
      type: v.type,
      formats: v.formats,
    }));
  }

  /**
   * Get specific version
   */
  protected async getVersionImpl(versionId: string): Promise<Work> {
    const version = await client.getVersion(versionId);
    const metadata = parseWorkIdMetadata(version.workId);

    return {
      ...metadata,
      work_id: version.workId,
      title: version.title,
      type: normalizeWorkType(metadata.type),
      jurisdiction: 'nz',
      status: 'in-force', // Versions are typically historical/in-force snapshots
      date: version.date,
      url: version.formats.find(format => format.format === 'html')?.url,
      versionCount: 1,
      versions: [],
      citations: {},
    };
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<void> {
    // Simple search to verify API access
    await this.searchImpl({ query: 'health', limit: 1 });
  }

  /**
   * Custom citation generation for NZ
   */
  override getCitation(work: Work, style: CitationStyle): string {
    if (style === 'nzmj') {
      const year = work.year;
      return `${work.title}, ${work.type === 'act' ? 'Public Act' : work.type} ${year} (NZ).`;
    }
    return super.getCitation(work, style);
  }
}

export default NZLegislationProvider;
