/**
 * New Zealand Legislation Provider
 * 
 * Provides access to New Zealand legislation via the official PCO API
 * at https://api.legislation.govt.nz/
 */

import { BaseLegislationProvider } from './legislation-provider.js';
import type { SearchParams, SearchResults, Work, VersionSummary, CitationStyle } from './legislation-provider.js';
import * as client from '../client.js';

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
        work_id: r.work_id,
        title: r.title,
        type: r.type,
        year: r.year,
        number: r.number,
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
    const work = await client.getWork(workId);
    
    return {
      work_id: work.work_id,
      title: work.title,
      type: work.type,
      year: work.year,
      number: work.number,
      jurisdiction: 'nz',
      status: work.status,
      versions: work.versions.map(v => ({
        version_id: v.version_id,
        title: v.title,
        date: v.date,
        is_current: v.is_current,
      })),
      citations: work.citations || {},
    };
  }

  /**
   * Get versions of a work
   */
  protected async getVersionsImpl(workId: string): Promise<VersionSummary[]> {
    const versions = await client.getWorkVersions(workId);
    return versions.map(v => ({
      version_id: v.version_id,
      title: v.title,
      date: v.date,
      is_current: v.is_current,
    }));
  }

  /**
   * Get specific version
   */
  protected async getVersionImpl(versionId: string): Promise<Work> {
    const version = await client.getVersion(versionId);
    
    return {
      work_id: version.work_id,
      title: version.title,
      type: version.type,
      year: version.year,
      number: version.number,
      jurisdiction: 'nz',
      status: 'in-force', // Versions are typically historical/in-force snapshots
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
