/**
 * Legislation Provider Interface
 *
 * Core interface that all jurisdiction providers must implement.
 * Includes health monitoring, caching, and rate limiting support.
 */

import type { HealthCheckable, HealthStatus } from '../utils/health-monitor.js';
import { RateLimiter } from '../utils/rate-limiter.js';
import { ScraperCache } from '../utils/scraper-cache.js';

/**
 * Search parameters
 */
export interface SearchParams {
  query?: string;
  type?: 'act' | 'bill' | 'regulation' | 'instrument';
  status?: 'in-force' | 'repealed' | 'not-in-force';
  from?: string; // YYYY-MM-DD
  to?: string; // YYYY-MM-DD
  limit?: number;
  offset?: number;
}

/**
 * Search results
 */
export interface SearchResults {
  total: number;
  results: WorkSummary[];
  limit: number;
  offset: number;
}

/**
 * Work summary (lightweight)
 */
export interface WorkSummary {
  work_id: string;
  title: string;
  type: string;
  year: number;
  number: number;
  jurisdiction: string;
  shortTitle?: string;
  status?: string;
  date?: string;
  url?: string;
  versionCount?: number;
}

/**
 * Full work details
 */
export interface Work extends WorkSummary {
  status: string;
  versions: VersionSummary[];
  citations: Record<string, string>;
}

/**
 * Version summary
 */
export interface VersionSummary {
  version_id: string;
  title: string;
  date: string;
  is_current: boolean;
  version?: number;
  type?: string;
  formats?: string[];
}

/**
 * Citation styles
 */
export type CitationStyle = 'nzmj' | 'apa' | 'oscola' | 'australian' | 'bibtex' | 'ris' | 'enw';

/**
 * Legislation Provider Interface
 *
 * All jurisdiction providers (NZ, Australian states, etc.) must implement this.
 */
export interface LegislationProvider extends HealthCheckable {
  /**
   * Get jurisdiction identifier (e.g., 'nz', 'au-qld', 'au-comm')
   */
  getJurisdiction(): string;

  /**
   * Get jurisdiction display name (e.g., 'New Zealand', 'Queensland')
   */
  getDisplayName(): string;

  /**
   * Search legislation
   */
  search(params: SearchParams): Promise<SearchResults>;

  /**
   * Get work by ID
   */
  getWork(workId: string): Promise<Work>;

  /**
   * Get versions of a work
   */
  getVersions(workId: string): Promise<VersionSummary[]>;

  /**
   * Get specific version
   */
  getVersion(versionId: string): Promise<Work>;

  /**
   * Generate citation in specified style
   */
  getCitation(work: Work, style: CitationStyle): string;

  /**
   * Health check (from HealthCheckable)
   */
  healthCheck(): Promise<void>;
}

/**
 * Base provider with common functionality
 */
export abstract class BaseLegislationProvider implements LegislationProvider {
  protected cache: ScraperCache<unknown>;
  protected rateLimiter: RateLimiter;
  protected jurisdiction: string;
  protected displayName: string;

  constructor(
    jurisdiction: string,
    displayName: string,
    rateLimitOptions: { requests: number; per: number },
    cacheOptions?: { max?: number; ttl?: number }
  ) {
    this.jurisdiction = jurisdiction;
    this.displayName = displayName;
    this.rateLimiter = new RateLimiter(rateLimitOptions);
    this.cache = new ScraperCache({
      jurisdiction,
      ...cacheOptions,
    });
  }

  /**
   * Get jurisdiction identifier
   */
  getJurisdiction(): string {
    return this.jurisdiction;
  }

  /**
   * Get display name
   */
  getDisplayName(): string {
    return this.displayName;
  }

  /**
   * Search with caching and rate limiting
   */
  async search(params: SearchParams): Promise<SearchResults> {
    await this.rateLimiter.throttle();

    const cacheKey = `search:${JSON.stringify(params)}`;

    const results = await this.cache.getOrSet(
      cacheKey,
      async (): Promise<unknown> => this.searchImpl(params),
      30 * 60 * 1000
    ); // 30 minute cache for search

    return results as SearchResults;
  }

  /**
   * Get work with caching and rate limiting
   */
  async getWork(workId: string): Promise<Work> {
    await this.rateLimiter.throttle();

    const cacheKey = `work:${workId}`;

    const work = await this.cache.getOrSet(
      cacheKey,
      async (): Promise<unknown> => this.getWorkImpl(workId),
      24 * 60 * 60 * 1000
    ); // 24 hour cache for work details

    return work as Work;
  }

  /**
   * Get versions with caching
   */
  async getVersions(workId: string): Promise<VersionSummary[]> {
    await this.rateLimiter.throttle();

    const cacheKey = `versions:${workId}`;

    const versions = await this.cache.getOrSet(
      cacheKey,
      async (): Promise<unknown> => this.getVersionsImpl(workId),
      24 * 60 * 60 * 1000
    );

    return versions as VersionSummary[];
  }

  /**
   * Get version with caching
   */
  async getVersion(versionId: string): Promise<Work> {
    await this.rateLimiter.throttle();

    const cacheKey = `version:${versionId}`;

    const version = await this.cache.getOrSet(
      cacheKey,
      async (): Promise<unknown> => this.getVersionImpl(versionId),
      24 * 60 * 60 * 1000
    );

    return version as Work;
  }

  /**
   * Generate citation (default implementation)
   */
  getCitation(work: Work, style: CitationStyle): string {
    switch (style) {
      case 'nzmj':
        return this.generateNzmjCitation(work);
      case 'apa':
        return this.generateApaCitation(work);
      case 'oscola':
        return this.generateOscolaCitation(work);
      case 'australian':
        return this.generateAustralianCitation(work);
      case 'bibtex':
        return this.generateBibtexCitation(work);
      case 'ris':
        return this.generateRisCitation(work);
      case 'enw':
        return this.generateEnwCitation(work);
    }

    throw new Error(`Unknown citation style: ${String(style)}`);
  }

  /**
   * Health check (from HealthCheckable)
   */
  async healthCheck(): Promise<void> {
    // Default: try a simple search
    await this.searchImpl({ query: 'test', limit: 1 });
  }

  /**
   * Get cache stats
   */
  getCacheStats(): ReturnType<ScraperCache<unknown>['getStats']> {
    return this.cache.getStats();
  }

  /**
   * Get rate limit status
   */
  getRateLimitStatus(): ReturnType<RateLimiter['getStatus']> {
    return this.rateLimiter.getStatus();
  }

  // Abstract methods to be implemented by subclasses

  protected abstract searchImpl(params: SearchParams): Promise<SearchResults>;
  protected abstract getWorkImpl(workId: string): Promise<Work>;
  protected abstract getVersionsImpl(workId: string): Promise<VersionSummary[]>;
  protected abstract getVersionImpl(versionId: string): Promise<Work>;

  // Citation generators

  protected generateNzmjCitation(work: Work): string {
    return `${work.title} ${work.year} (${work.jurisdiction})`;
  }

  protected generateApaCitation(work: Work): string {
    return `${work.title}. (${work.year}). ${work.jurisdiction}.`;
  }

  protected generateOscolaCitation(work: Work): string {
    return `${work.title} ${work.year} (${work.jurisdiction})`;
  }

  protected generateAustralianCitation(work: Work): string {
    const suffix =
      work.jurisdiction === 'au-comm'
        ? '(Cth)'
        : work.jurisdiction === 'au-qld'
          ? '(Qld)'
          : `(${work.jurisdiction})`;

    return `${work.title} ${suffix}`;
  }

  protected generateBibtexCitation(work: Work): string {
    const year = this.getCitationYear(work);
    const url = this.getCitationUrl(work);

    return `@legislation{${work.work_id.replace(/[\\/]/g, '-')},
  title = {${work.title}},
  year = {${year}},
  type = {${work.type}},
  status = {${work.status}},
  url = {${url}}
}`;
  }

  protected generateRisCitation(work: Work): string {
    const year = this.getCitationYear(work);
    const url = this.getCitationUrl(work);

    return `TY - LEG
ID - ${work.work_id}
TI - ${work.title}
PY - ${year}
M3 - ${work.type === 'act' ? 'Public Act' : work.type}
CY - ${this.displayName}
UR - ${url}
ER - `;
  }

  protected generateEnwCitation(work: Work): string {
    const year = this.getCitationYear(work);
    const url = this.getCitationUrl(work);

    return `%0 Statute
%A ${this.displayName}
%D ${year}
%T ${work.title}
%9 ${work.type === 'act' ? 'Public Act' : work.type}
%U ${url}
%Z ${work.work_id}`;
  }

  protected getCitationYear(work: Work): string {
    if (work.year > 0) {
      return String(work.year);
    }

    if (work.date) {
      return work.date.substring(0, 4);
    }

    const match = work.work_id.match(/(?:^|[_/])((?:19|20)\d{2})(?:[_/]|$)/);
    return match ? match[1] : '1900';
  }

  protected getCitationUrl(work: Work): string {
    if (work.url) {
      return work.url;
    }

    switch (work.jurisdiction) {
      case 'nz':
        return `https://www.legislation.govt.nz/${work.work_id.replace(/_/g, '/')}/`;
      case 'au-comm':
        return `https://www.legislation.gov.au/Details/${work.work_id}`;
      case 'au-qld':
        return `https://www.legislation.qld.gov.au/view/html/inforce/current/${work.work_id.replace(/\//g, '-')}`;
      default:
        return work.work_id;
    }
  }
}

/**
 * Provider registry
 *
 * Manages multiple legislation providers and provides
 * health monitoring across all jurisdictions.
 */
export class ProviderRegistry {
  private providers: Map<string, LegislationProvider> = new Map();

  /**
   * Register a provider
   * @param provider - The legislation provider to register
   */
  register(provider: LegislationProvider): void {
    this.providers.set(provider.getJurisdiction(), provider);
  }

  /**
   * Get provider by jurisdiction
   * @param jurisdiction - The jurisdiction identifier
   * @returns The provider or undefined if not found
   */
  get(jurisdiction: string): LegislationProvider | undefined {
    return this.providers.get(jurisdiction);
  }

  /**
   * Get all providers
   * @returns Array of all registered providers
   */
  getAll(): LegislationProvider[] {
    return Array.from(this.providers.values());
  }

  /**
   * Get all jurisdictions
   * @returns Array of all jurisdiction identifiers
   */
  getJurisdictions(): string[] {
    return Array.from(this.providers.keys());
  }

  /**
   * Check if provider exists
   * @param jurisdiction - The jurisdiction identifier
   * @returns True if provider is registered
   */
  has(jurisdiction: string): boolean {
    return this.providers.has(jurisdiction);
  }

  /**
   * Get health dashboard for all providers
   */
  async getHealthDashboard(): Promise<
    {
      jurisdiction: string;
      healthy: boolean;
      status: HealthStatus;
    }[]
  > {
    const results = [];

    for (const provider of this.providers.values()) {
      try {
        const status = await this.getProviderHealth(provider);
        results.push({
          jurisdiction: provider.getJurisdiction(),
          healthy: status.healthy,
          status,
        });
      } catch {
        results.push({
          jurisdiction: provider.getJurisdiction(),
          healthy: false,
          status: {
            healthy: false,
            jurisdiction: provider.getJurisdiction(),
            lastSuccessfulScrape: null,
            lastCheck: new Date(),
            successRate: 0,
            averageResponseTime: 0,
            fallbackActive: false,
            consecutiveFailures: 1,
          },
        });
      }
    }

    return results;
  }

  /**
   * Get health status for a provider
   */
  private async getProviderHealth(provider: LegislationProvider): Promise<HealthStatus> {
    try {
      await provider.healthCheck();
      return {
        healthy: true,
        jurisdiction: provider.getJurisdiction(),
        lastSuccessfulScrape: new Date(),
        lastCheck: new Date(),
        successRate: 100,
        averageResponseTime: 0,
        fallbackActive: false,
        consecutiveFailures: 0,
      };
    } catch {
      return {
        healthy: false,
        jurisdiction: provider.getJurisdiction(),
        lastSuccessfulScrape: null,
        lastCheck: new Date(),
        successRate: 0,
        averageResponseTime: 0,
        fallbackActive: false,
        consecutiveFailures: 1,
      };
    }
  }
}

/**
 * Global provider registry instance
 */
const globalRegistry = new ProviderRegistry();

export function getGlobalRegistry(): ProviderRegistry {
  return globalRegistry;
}
