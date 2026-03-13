/**
 * Queensland Legislation Provider
 * 
 * Provides access to Queensland legislation via the official API at
 * https://api.legislation.qld.gov.au/
 */

import { BaseLegislationProvider } from './legislation-provider.js';
import type { SearchParams, SearchResults, Work, VersionSummary, CitationStyle } from './legislation-provider.js';
import { logger } from '../utils/logger.js';

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
  protected async searchImpl(params: SearchParams): Promise<SearchResults> {
    this.ensureAuthenticated();
    
    // Implementation for the official QLD API search is currently in development.
    logger.debug('Searching Queensland legislation', { params });
    
    throw new Error('Queensland search is currently in development. Please use direct ID retrieval with "nzlegislation get <id> --jurisdiction au-qld".');
  }

  /**
   * Get work by ID
   */
  protected async getWorkImpl(workId: string): Promise<Work> {
    this.ensureAuthenticated();
    
    // Implementation for retrieving a specific work from QLD API
    // e.g., GET /v1/content('{id}')
    
    const [type, year, number] = workId.split('/');
    
    return {
      work_id: workId,
      title: `${type} ${year} (Qld)`,
      type: type ?? 'act',
      year: parseInt(year ?? '0'),
      number: parseInt(number ?? '0'),
      jurisdiction: 'au-qld',
      status: 'in-force',
      versions: [],
      citations: {
        australian: `${type} ${year} (Qld)`,
      },
    };
  }

  /**
   * Get versions of a work
   */
  protected async getVersionsImpl(workId: string): Promise<VersionSummary[]> {
    this.ensureAuthenticated();
    return [];
  }

  /**
   * Get specific version
   */
  protected async getVersionImpl(versionId: string): Promise<Work> {
    this.ensureAuthenticated();
    throw new Error('Not implemented - scraper pending');
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

      if (!response.ok && response.status !== 401) { // 401 is fine for health check if we lack key
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
      return `${work.title} (${work.year}) ${work.jurisdiction}`;
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
