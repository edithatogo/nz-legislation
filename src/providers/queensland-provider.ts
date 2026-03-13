/**
 * Queensland Legislation Provider
 *
 * Provides access to Queensland legislation via the official API at
 * https://api.legislation.qld.gov.au/
 */

import { logger } from '../utils/logger.js';

import { BaseLegislationProvider } from './legislation-provider.js';
import type {
  SearchParams,
  SearchResults,
  Work,
  VersionSummary,
  CitationStyle,
} from './legislation-provider.js';
import { normalizeWorkType, parseWorkIdMetadata } from './output-adapters.js';

export class QueenslandProvider extends BaseLegislationProvider {
  private baseUrl = 'https://api.legislation.qld.gov.au/v1';
  private apiKey?: string;

  constructor(apiKey?: string) {
    super(
      'au-qld',
      'Queensland',
      { requests: 30, per: 60 }, // 30 requests per minute
      { max: 500, ttl: 24 * 60 * 60 * 1000 } // 500 entries, 24 hour TTL
    );
    this.apiKey = apiKey;
  }

  /**
   * Search Queensland legislation
   */
  protected searchImpl(params: SearchParams): Promise<SearchResults> {
    this.ensureAuthenticated();

    // Implementation for the official QLD API search is currently in development.
    logger.debug('Searching Queensland legislation', { params });

    return Promise.reject(
      new Error(
        'Queensland search is currently in development. Please use direct ID retrieval with "nzlegislation get <id> --jurisdiction au-qld".'
      )
    );
  }

  /**
   * Get work by ID
   */
  protected getWorkImpl(workId: string): Promise<Work> {
    this.ensureAuthenticated();

    // Implementation for retrieving a specific work from QLD API
    // e.g., GET /v1/content('{id}')

    const metadata = parseWorkIdMetadata(workId);

    return Promise.resolve({
      ...metadata,
      work_id: workId,
      title: `${normalizeWorkType(metadata.type)} ${metadata.year} (Qld)`,
      type: normalizeWorkType(metadata.type),
      jurisdiction: 'au-qld',
      status: 'in-force',
      date: `${metadata.year || 1900}-01-01`,
      url: `https://www.legislation.qld.gov.au/view/html/inforce/current/${workId.replace(/\//g, '-')}`,
      versionCount: 1,
      versions: [],
      citations: {
        australian: `${normalizeWorkType(metadata.type)} ${metadata.year} (Qld)`,
      },
    });
  }

  /**
   * Get versions of a work
   */
  protected getVersionsImpl(_workId: string): Promise<VersionSummary[]> {
    this.ensureAuthenticated();
    return Promise.resolve([]);
  }

  /**
   * Get specific version
   */
  protected getVersionImpl(_versionId: string): Promise<Work> {
    this.ensureAuthenticated();
    return Promise.reject(new Error('Not implemented - scraper pending'));
  }

  /**
   * Health check
   */
  async healthCheck(): Promise<void> {
    // Check if Queensland legislation API is accessible
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);

    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        signal: controller.signal,
        method: 'HEAD',
      });

      if (!response.ok && response.status !== 401) {
        // 401 is fine for health check if we lack key
        throw new Error(`Health check failed with status ${response.status}`);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  /**
   * Custom citation generation for Queensland
   */
  override getCitation(work: Work, style: CitationStyle): string {
    if (style === 'australian') {
      return `${work.title} (Qld)`;
    }
    return super.getCitation(work, style);
  }

  /**
   * Ensure API key is present for authenticated requests
   */
  private ensureAuthenticated(): void {
    if (!this.apiKey) {
      throw new Error('Queensland API key is required. Please set QUEENSLAND_API_KEY.');
    }
  }
}

export default QueenslandProvider;
