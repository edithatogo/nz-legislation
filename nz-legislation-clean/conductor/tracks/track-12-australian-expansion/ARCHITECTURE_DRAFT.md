# Australian Legislation Integration Architecture

**Track:** Track 12 - Australian Legislation API Integration  
**Phase:** Phase 2 - Technical Feasibility Assessment  
**Status:** DRAFT  
**Date:** 2026-03-10

---

## Overview

This document defines the architecture for integrating multiple Australian legislation APIs into a unified tool (CLI + MCP Server).

---

## Design Principles

### 1. Multi-Jurisdiction from Day 1

**Rationale:**
- Start with Commonwealth, add states incrementally
- Consistent interface across all jurisdictions
- Easy to add new jurisdictions

**Implementation:**
- Jurisdiction abstraction layer
- Plugin architecture for adapters
- Common data models

### 2. API-First

**Rationale:**
- All functionality available via API
- Enables CLI, MCP, and future integrations
- Testable and documentable

**Implementation:**
- RESTful design
- Clear API contracts
- Versioned APIs

### 3. Open Source

**Rationale:**
- Community contributions
- Transparency
- Sustainability

**Implementation:**
- Apache 2.0 license
- Public GitHub repository
- Clear contribution guidelines

### 4. Free Tier

**Rationale:**
- Research/academic focus
- Accessibility
- Community good

**Implementation:**
- Free and open source
- Optional paid support/hosting
- Grant funding for development

---

## Architecture Layers

```
┌─────────────────────────────────────────────────┐
│              User Interfaces                     │
├──────────────────┬──────────────────────────────┤
│   CLI Tool       │      MCP Server              │
│  (au-legislation)│  (australian-legislation-mcp)│
└──────────────────┴──────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│          Common Interface Layer                  │
│  - search(query, filters)                        │
│  - getById(id)                                   │
│  - getVersions(id)                               │
│  - getCitation(id, style)                        │
│  - export(query, format)                         │
└───────────────────────┬─────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│         Jurisdiction Adapter Layer              │
├──────────────┬──────────────┬──────────────────┤
│ Commonwealth │  Queensland  │   Future States  │
│   Adapter    │   Adapter    │     Adapters     │
└──────────────┴──────────────┴──────────────────┘
                        │
┌───────────────────────▼─────────────────────────┐
│           External API Layer                    │
├──────────────┬──────────────┬──────────────────┤
│  https://    │  https://    │   Future APIs    │
│  api.prod.   │  legislation.│                  │
│  legislation.│  qld.gov.au/ │                  │
│  gov.au/v1/  │  api/        │                  │
└──────────────┴──────────────┴──────────────────┘
```

---

## Data Models

### Work (Legislation)

```typescript
interface Work {
  id: string;              // Unique identifier
  title: string;           // Full title
  shortTitle?: string;     // Short title (if available)
  jurisdiction: string;    // e.g., 'Cth', 'Qld', 'NSW'
  type: WorkType;          // 'act', 'bill', 'regulation', etc.
  status: WorkStatus;      // 'in-force', 'repealed', etc.
  date: string;            // ISO 8601 date
  versions: Version[];     // Array of versions
  url: string;             // Canonical URL
  metadata: Record<string, any>; // Jurisdiction-specific metadata
}

enum WorkType {
  ACT = 'act',
  BILL = 'bill',
  REGULATION = 'regulation',
  INSTRUMENT = 'instrument',
  GAZETTE = 'gazette',
  CONSTITUTION = 'constitution'
}

enum WorkStatus {
  IN_FORCE = 'in-force',
  NOT_YET_IN_FORCE = 'not-yet-in-force',
  REPEALED = 'repealed',
  PARTIALLY_REPEALED = 'partially-repealed',
  WITHDRAWN = 'withdrawn'
}
```

### Version

```typescript
interface Version {
  id: string;              // Version identifier
  workId: string;          // Parent work ID
  versionNumber: number;   // Version number
  date: string;            // ISO 8601 date
  isCurrent: boolean;      // Is this the current version?
  title: string;           // Version title
  url: string;             // Version URL
  formats: string[];       // Available formats (PDF, HTML, etc.)
}
```

### Citation

```typescript
interface Citation {
  workId: string;          // Work ID
  style: CitationStyle;    // Citation style
  citation: string;        // Formatted citation
  pinPoint?: string;       // Pinpoint reference (if applicable)
}

enum CitationStyle {
  NZMJ = 'nzmj',
  AGLC = 'aglc',           // Australian Guide to Legal Citation
  BIBTEX = 'bibtex',
  RIS = 'ris',
  APA = 'apa'
}
```

### Search Results

```typescript
interface SearchResults {
  total: number;           // Total results
  offset: number;          // Current offset
  limit: number;           // Results per page
  results: Work[];         // Array of works
  links: {
    next?: string;         // Next page URL
    prev?: string;         // Previous page URL
  };
}
```

---

## Interface Definition

### ILegislationAdapter

```typescript
interface ILegislationAdapter {
  /**
   * Get jurisdiction identifier
   */
  getJurisdiction(): string;
  
  /**
   * Search legislation
   */
  search(params: SearchParams): Promise<SearchResults>;
  
  /**
   * Get work by ID
   */
  getById(id: string): Promise<Work>;
  
  /**
   * Get all versions of a work
   */
  getVersions(id: string): Promise<Version[]>;
  
  /**
   * Get specific version
   */
  getVersion(versionId: string): Promise<Version>;
  
  /**
   * Generate citation
   */
  getCitation(work: Work, style: CitationStyle): Promise<Citation>;
  
  /**
   * Export works
   */
  export(works: Work[], format: ExportFormat): Promise<string>;
}

interface SearchParams {
  query?: string;
  type?: WorkType;
  status?: WorkStatus;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

enum ExportFormat {
  JSON = 'json',
  CSV = 'csv',
  XML = 'xml'
}
```

---

## Adapter Implementations

### Commonwealth Adapter

```typescript
class CommonwealthAdapter implements ILegislationAdapter {
  private apiKey: string;
  private baseUrl = 'https://api.prod.legislation.gov.au/v1';
  
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }
  
  getJurisdiction(): string {
    return 'Cth';
  }
  
  async search(params: SearchParams): Promise<SearchResults> {
    const url = new URL(`${this.baseUrl}/search`);
    url.searchParams.append('apikey', this.apiKey);
    
    if (params.query) url.searchParams.append('query', params.query);
    if (params.type) url.searchParams.append('type', params.type);
    if (params.status) url.searchParams.append('status', params.status);
    if (params.from) url.searchParams.append('from', params.from);
    if (params.to) url.searchParams.append('to', params.to);
    if (params.limit) url.searchParams.append('limit', params.limit.toString());
    if (params.offset) url.searchParams.append('offset', params.offset.toString());
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    return this.mapSearchResults(data);
  }
  
  async getById(id: string): Promise<Work> {
    const url = `${this.baseUrl}/content('${encodeURIComponent(id)}')?apikey=${this.apiKey}`;
    const response = await fetch(url);
    const data = await response.json();
    return this.mapWork(data);
  }
  
  // ... other methods
  
  private mapWork(data: any): Work {
    // Map Commonwealth API response to common Work model
    return {
      id: data.id,
      title: data.title,
      jurisdiction: 'Cth',
      type: this.mapType(data.type),
      status: this.mapStatus(data.status),
      date: data.date,
      versions: [],
      url: data.url,
      metadata: data
    };
  }
  
  // ... mapping helpers
}
```

### Queensland Adapter

```typescript
class QueenslandAdapter implements ILegislationAdapter {
  private apiKey?: string;
  private baseUrl = 'https://www.legislation.qld.gov.au/api';
  
  constructor(apiKey?: string) {
    this.apiKey = apiKey;
  }
  
  getJurisdiction(): string {
    return 'Qld';
  }
  
  async search(params: SearchParams): Promise<SearchResults> {
    // Implementation depends on Queensland API documentation
    // Placeholder implementation
    const url = new URL(`${this.baseUrl}/acts`);
    
    if (params.query) {
      // Queensland may use different search mechanism
      // Implement based on actual API
    }
    
    const response = await fetch(url.toString());
    const data = await response.json();
    
    return this.mapSearchResults(data);
  }
  
  // ... other methods
}
```

---

## Common Interface Layer

### LegislationService

```typescript
class LegislationService {
  private adapters: Map<string, ILegislationAdapter> = new Map();
  
  registerAdapter(adapter: ILegislationAdapter): void {
    this.adapters.set(adapter.getJurisdiction(), adapter);
  }
  
  async search(params: SearchParams, jurisdictions?: string[]): Promise<SearchResults> {
    const targetJurisdictions = jurisdictions || Array.from(this.adapters.keys());
    
    const results = await Promise.all(
      targetJurisdictions.map(jurisdiction => {
        const adapter = this.adapters.get(jurisdiction);
        if (!adapter) {
          throw new Error(`No adapter found for jurisdiction: ${jurisdiction}`);
        }
        return adapter.search(params);
      })
    );
    
    // Combine results from all jurisdictions
    return this.combineSearchResults(results);
  }
  
  async getById(id: string): Promise<Work> {
    // Determine jurisdiction from ID
    const jurisdiction = this.extractJurisdiction(id);
    const adapter = this.adapters.get(jurisdiction);
    
    if (!adapter) {
      throw new Error(`No adapter found for jurisdiction: ${jurisdiction}`);
    }
    
    return adapter.getById(id);
  }
  
  // ... other methods
  
  private combineSearchResults(results: SearchResults[]): SearchResults {
    // Combine and sort results from multiple jurisdictions
    const allResults = results.flatMap(r => r.results);
    const total = results.reduce((sum, r) => sum + r.total, 0);
    
    return {
      total,
      offset: 0,
      limit: allResults.length,
      results: allResults,
      links: {}
    };
  }
  
  private extractJurisdiction(id: string): string {
    // Extract jurisdiction from ID format
    // e.g., 'act/2020/67' -> determine from context or ID pattern
    // This may need to be jurisdiction-specific
  }
}
```

---

## CLI Architecture

### Command Structure

```typescript
// src/commands/search.ts
export const searchCommand = new Command()
  .name('search')
  .description('Search Australian legislation')
  .requiredOption('-q, --query <text>', 'Search query')
  .option('-j, --jurisdictions <jurisdictions>', 'Jurisdictions to search (comma-separated)')
  .option('-t, --type <type>', 'Filter by type')
  .option('-s, --status <status>', 'Filter by status')
  .option('-l, --limit <number>', 'Maximum results', '25')
  .option('--format <format>', 'Output format', 'table')
  .action(async (options) => {
    const service = createLegislationService();
    const jurisdictions = options.jurisdictions?.split(',') || undefined;
    
    const results = await service.search({
      query: options.query,
      type: options.type,
      status: options.status,
      limit: parseInt(options.limit),
    }, jurisdictions);
    
    // Output results
    outputResults(results, options.format);
  });
```

### MCP Server Structure

```typescript
// src/mcp/server.ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

export function createServer(): McpServer {
  const server = new McpServer({
    name: 'australian-legislation',
    version: '1.0.0',
  });
  
  // Register tools
  server.tool(
    'search_legislation',
    'Search Australian legislation',
    {
      query: z.string(),
      jurisdictions: z.array(z.string()).optional(),
      type: z.enum(['act', 'bill', 'regulation']).optional(),
      limit: z.number().default(25),
    },
    async (params) => {
      const service = createLegislationService();
      const results = await service.search({
        query: params.query,
        type: params.type,
        limit: params.limit,
      }, params.jurisdictions);
      
      return {
        content: [
          {
            type: 'text',
            text: formatSearchResults(results),
          },
        ],
      };
    }
  );
  
  // ... other tools
  
  return server;
}
```

---

## Caching Strategy

### In-Memory Cache

```typescript
class Cache {
  private cache: Map<string, { data: any; expiry: number }> = new Map();
  
  get(key: string): any | null {
    const item = this.cache.get(key);
    if (!item || Date.now() > item.expiry) {
      this.cache.delete(key);
      return null;
    }
    return item.data;
  }
  
  set(key: string, data: any, ttlMs: number): void {
    this.cache.set(key, {
      data,
      expiry: Date.now() + ttlMs,
    });
  }
  
  invalidate(pattern: string): void {
    // Invalidate cache entries matching pattern
  }
}
```

### Cache Integration

```typescript
class CachedAdapter implements ILegislationAdapter {
  private adapter: ILegislationAdapter;
  private cache: Cache;
  
  constructor(adapter: ILegislationAdapter, cache: Cache) {
    this.adapter = adapter;
    this.cache = cache;
  }
  
  async getById(id: string): Promise<Work> {
    const cacheKey = `work:${id}`;
    const cached = this.cache.get(cacheKey);
    
    if (cached) {
      return cached;
    }
    
    const work = await this.adapter.getById(id);
    this.cache.set(cacheKey, work, 3600000); // 1 hour TTL
    
    return work;
  }
  
  // ... other methods with caching
}
```

---

## Error Handling

### Error Types

```typescript
class LegislationError extends Error {
  constructor(
    message: string,
    public code: string,
    public jurisdiction?: string,
  ) {
    super(message);
    this.name = 'LegislationError';
  }
}

class ApiError extends LegislationError {
  constructor(
    message: string,
    public statusCode?: number,
    jurisdiction?: string,
  ) {
    super(message, 'API_ERROR', jurisdiction);
    this.name = 'ApiError';
  }
}

class RateLimitError extends ApiError {
  constructor(
    message: string,
    public retryAfter?: number,
    jurisdiction?: string,
  ) {
    super(message, 429, jurisdiction);
    this.name = 'RateLimitError';
  }
}

class NotFoundError extends ApiError {
  constructor(id: string, jurisdiction?: string) {
    super(`Resource not found: ${id}`, 404, jurisdiction);
    this.name = 'NotFoundError';
  }
}
```

### Error Handling Strategy

```typescript
async function safeApiCall<T>(
  fn: () => Promise<T>,
  jurisdiction: string,
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    if (error instanceof Response) {
      const statusCode = error.status;
      
      if (statusCode === 429) {
        const retryAfter = error.headers.get('Retry-After');
        throw new RateLimitError(
          'Rate limit exceeded',
          retryAfter ? parseInt(retryAfter) : undefined,
          jurisdiction,
        );
      }
      
      if (statusCode === 404) {
        throw new NotFoundError('Resource', jurisdiction);
      }
      
      throw new ApiError(
        `API error: ${statusCode}`,
        statusCode,
        jurisdiction,
      );
    }
    
    throw error;
  }
}
```

---

## Configuration

### Environment Variables

```bash
# Commonwealth API
COMMONWEALTH_API_KEY=your_api_key_here

# Queensland API (if available)
QUEENSLAND_API_KEY=your_api_key_here

# Optional: Cache TTL (milliseconds)
CACHE_TTL=3600000

# Optional: Rate limiting
RATE_LIMIT_PER_MINUTE=60
```

### Configuration File

```json
{
  "apis": {
    "commonwealth": {
      "enabled": true,
      "apiKey": "${COMMONWEALTH_API_KEY}",
      "baseUrl": "https://api.prod.legislation.gov.au/v1/",
      "rateLimit": {
        "requestsPerMinute": 60,
        "requestsPerDay": 10000
      }
    },
    "queensland": {
      "enabled": true,
      "apiKey": "${QUEENSLAND_API_KEY}",
      "baseUrl": "https://www.legislation.qld.gov.au/api/",
      "rateLimit": {
        "requestsPerMinute": 60
      }
    }
  },
  "cache": {
    "enabled": true,
    "ttl": 3600000
  }
}
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('CommonwealthAdapter', () => {
  let adapter: CommonwealthAdapter;
  
  beforeEach(() => {
    adapter = new CommonwealthAdapter('test-api-key');
  });
  
  describe('search', () => {
    it('should search legislation', async () => {
      // Mock fetch
      global.fetch = jest.fn().mockResolvedValue({
        json: () => Promise.mockResolvedValue({
          total: 1,
          results: [{ id: 'act/2020/67', title: 'Test Act' }]
        })
      });
      
      const results = await adapter.search({ query: 'test' });
      
      expect(results.total).toBe(1);
      expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('apikey=test-api-key')
      );
    });
  });
});
```

### Integration Tests

```typescript
describe('CommonwealthAdapter Integration', () => {
  let adapter: CommonwealthAdapter;
  
  beforeAll(() => {
    adapter = new CommonwealthAdapter(process.env.COMMONWEALTH_API_KEY!);
  });
  
  it('should search real API', async () => {
    const results = await adapter.search({ query: 'privacy', limit: 5 });
    
    expect(results.total).toBeGreaterThan(0);
    expect(results.results.length).toBeLessThanOrEqual(5);
  });
  
  it('should get work by ID', async () => {
    const work = await adapter.getById('act/1988/123');
    
    expect(work).toBeDefined();
    expect(work.id).toBe('act/1988/123');
  });
});
```

---

## Deployment

### CLI Distribution

```json
{
  "name": "au-legislation-tool",
  "version": "1.0.0",
  "bin": {
    "au-legislation": "./dist/cli.js"
  },
  "files": [
    "dist",
    "README.md",
    "LICENSE"
  ]
}
```

### MCP Server Distribution

```json
{
  "name": "australian-legislation-mcp",
  "version": "1.0.0",
  "type": "module",
  "exports": {
    ".": "./dist/mcp-server.js"
  },
  "bin": {
    "australian-legislation-mcp": "./dist/mcp-cli.js"
  }
}
```

---

## Security Considerations

### API Key Management

- ✅ Store in environment variables
- ✅ Never commit to Git
- ✅ Rotate periodically
- ✅ Use separate keys for dev/prod

### Rate Limiting

- ✅ Implement client-side rate limiting
- ✅ Respect API rate limits
- ✅ Implement exponential backoff
- ✅ Cache responses to reduce API calls

### Data Privacy

- ✅ No user data stored
- ✅ API keys encrypted at rest
- ✅ HTTPS for all API calls
- ✅ No logging of API keys

---

## Performance Considerations

### Response Time Targets

| Operation | Target | P95 |
|-----------|--------|-----|
| Search | < 500ms | < 1s |
| Get by ID | < 200ms | < 500ms |
| Get Versions | < 300ms | < 700ms |
| Generate Citation | < 100ms | < 200ms |

### Optimization Strategies

1. **Caching**
   - Cache frequently accessed works
   - Cache search results (short TTL)
   - Invalidate on update

2. **Batching**
   - Batch multiple API calls
   - Parallel requests for multi-jurisdiction search

3. **Pagination**
   - Implement cursor-based pagination
   - Lazy load large result sets

---

## Future Enhancements

### Phase 2 (Months 3-6)

- [ ] Add NSW adapter (if API available)
- [ ] Add Victoria adapter (if API available)
- [ ] Python client library
- [ ] REST API service

### Phase 3 (Months 6-12)

- [ ] Web interface
- [ ] Advanced search (full-text)
- [ ] Comparison tool (compare versions)
- [ ] Alert system (new legislation)

### Phase 4 (Year 2+)

- [ ] Machine learning features
- [ ] Citation analysis
- [ ] Legislative network visualization
- [ ] Mobile app

---

## Appendix: ID Patterns

### Commonwealth ID Format

```
/act/YYYY/NNN       # Acts
/bill/YYYY/NNN      # Bills
/legislative-instrument/YYYY/NNN  # Legislative Instruments
/gazette/YYYY/NNN   # Gazettes
```

### Queensland ID Format (Expected)

```
act/YYYY/NNN        # Acts
reg/YYYY/NNN        # Regulations
bill/YYYY/NNN       # Bills
```

---

**Document Status:** DRAFT  
**Version:** 0.1  
**Last Updated:** 2026-03-10  
**Next Review:** After Commonwealth API testing
