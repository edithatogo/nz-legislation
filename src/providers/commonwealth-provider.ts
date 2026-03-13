/**
 * Commonwealth (Federal) Australian Legislation Provider
 *
 * Provides access to Commonwealth legislation via the official Federal
 * Register of Legislation API at https://api.prod.legislation.gov.au/v1/
 */

import { logger } from '../utils/logger.js';

import {
  BaseLegislationProvider,
  type SearchParams,
  type SearchResults,
  type Work,
  type VersionSummary,
  type CitationStyle,
} from './legislation-provider.js';
import { parseWorkIdMetadata } from './output-adapters.js';

export class CommonwealthProvider extends BaseLegislationProvider {
  private baseUrl = 'https://api.prod.legislation.gov.au/v1';

  constructor(_apiKey?: string) {
    // Default rate limit: 5 requests per second
    super('au-comm', 'Australian Commonwealth', { requests: 5, per: 1 });
  }

  /**
   * Search Commonwealth legislation
   */
  protected searchImpl(params: SearchParams): Promise<SearchResults> {
    // The Federal Register of Legislation API /v1/search requires a specific OData filter
    // implementation which is currently in development for the full scraper.
    logger.debug('Searching Commonwealth legislation', { params });

    return Promise.reject(
      new Error(
        'Commonwealth search is currently in development. Please use direct ID retrieval with "nzlegislation get <id> --jurisdiction au-comm".'
      )
    );
  }

  /**
   * Get specific Commonwealth work by ID
   */
  protected getWorkImpl(workId: string): Promise<Work> {
    // Placeholder for direct ID retrieval
    // In a real implementation, this would call /v1/Titles('{id}')
    const metadata = parseWorkIdMetadata(workId);

    return Promise.resolve({
      ...metadata,
      work_id: workId,
      title: `${workId} (Cth)`,
      type: 'act',
      status: 'in-force',
      date: new Date().toISOString().split('T')[0],
      url: `https://www.legislation.gov.au/Details/${workId}`,
      versionCount: 1,
      jurisdiction: 'au-comm',
      versions: [],
      citations: {
        nzmj: `${workId} (Cth)`,
        australian: `${workId} (Cth)`,
      },
    });
  }

  protected getVersionsImpl(_workId: string): Promise<VersionSummary[]> {
    return Promise.resolve([]);
  }

  protected getVersionImpl(_versionId: string): Promise<Work> {
    return Promise.reject(new Error('Not implemented - scraper pending'));
  }

  override async healthCheck(): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${this.baseUrl}/constitution`, {
        method: 'HEAD',
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`Health check failed with status ${response.status}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Override citation generation for Australian style
   */
  getCitation(work: Work, style: CitationStyle): string {
    if (style === 'australian') {
      return `${work.title} (Cth)`;
    }
    return super.getCitation(work, style);
  }
}

export default CommonwealthProvider;
