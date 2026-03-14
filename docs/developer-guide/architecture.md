# Architecture Overview

**System design and structure of the NZ Legislation Tool**

---

## Overview

The NZ Legislation Tool is a TypeScript-based command-line interface (CLI) that provides programmatic access to New Zealand legislation data through the official NZ Legislation API.

**Key Design Principles:**

- **Type Safety** - Full TypeScript with strict mode
- **Modularity** - Separated concerns (CLI, API client, formatters)
- **Error Handling** - Comprehensive error boundaries
- **Testability** - Designed for unit, integration, and E2E testing
- **Maintainability** - Clear code organization and documentation

## Standards Direction

The current provider interface is the application-facing cross-jurisdiction
model. It should remain stable for CLI and runtime behavior.

The repository also now has an accepted standards direction for a canonical
legal metadata layer beneath that interface. That canonical layer should align
to:

- `Akoma Ntoso` for legal document structure and lifecycle concepts
- `FRBR` concepts for work, expression, and manifestation separation
- `ELI`-style identifiers for stable legal resource identity
- `schema.org/Legislation` for web publication metadata

See [Legal Metadata Standards](./legal-metadata-standards.md) and
[ADR 0004](../adr/0004-standards-aligned-canonical-legal-metadata.md).

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     User / CLI                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                    CLI Layer                            │
│  ┌──────────┬──────────┬──────────┬──────────┐        │
│  │  search  │   get    │  export  │   cite   │        │
│  └──────────┴──────────┴──────────┴──────────┘        │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│                 API Client Layer                        │
│  ┌──────────────────────────────────────────────────┐  │
│  │  HTTP Client (got) + Rate Limiting + Caching    │  │
│  └──────────────────────────────────────────────────┘  │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              NZ Legislation API                         │
│         https://api.legislation.govt.nz                 │
└─────────────────────────────────────────────────────────┘
```

---

## Directory Structure

```
nz-legislation-tool/
├── src/
│   ├── cli.ts              # Main CLI entry point (commander setup)
│   ├── client.ts           # API client (HTTP requests, caching)
│   ├── config.ts           # Configuration management
│   ├── errors.ts           # Error classes and handling
│   │
│   ├── commands/           # CLI command implementations
│   │   ├── search.ts       # Search command
│   │   ├── get.ts          # Get by ID command
│   │   ├── export.ts       # Export to file command
│   │   ├── cite.ts         # Citation generation command
│   │   └── config.ts       # Configuration management command
│   │
│   ├── models/             # Zod schemas and TypeScript types
│   │   ├── index.ts        # Export all models
│   │   ├── work.ts         # Work (legislation) schema
│   │   ├── search.ts       # Search parameters/results schemas
│   │   └── citation.ts     # Citation schemas
│   │
│   ├── output/             # Output formatters
│   │   ├── formatters.ts   # Table, JSON, CSV formatters
│   │   └── citations.ts    # Citation generators (NZMJ, APA, BibTeX)
│   │
│   └── utils/              # Utility functions
│       ├── logger.ts       # Logging utilities
│       └── version.ts      # Version management
│
├── tests/                  # Test files
│   ├── client.test.ts      # Client unit tests
│   ├── output.test.ts      # Output formatter tests
│   └── ...
│
├── docs/                   # Documentation
│   ├── user-guide/         # User documentation
│   └── developer-guide/    # Developer documentation
│
└── .github/                # CI/CD workflows
    └── workflows/
        └── ci.yml          # Continuous integration
```

---

## Module Architecture

### 1. CLI Layer (`cli.ts`)

**Responsibility:** Parse command-line arguments and route to appropriate commands.

**Dependencies:**

- `commander` - CLI framework
- Command modules from `./commands/`

**Key Functions:**

```typescript
// Main entry point
import { Command } from 'commander';
import { searchCommand } from './commands/search';
import { getCommand } from './commands/get';
// ... other commands

const program = new Command();
program.name('nzlegislation').description('Search and retrieve NZ legislation').version('1.0.0');

// Register commands
program.addCommand(searchCommand);
program.addCommand(getCommand);
// ... other commands

program.parse();
```

---

### 2. API Client Layer (`client.ts`)

**Responsibility:** Handle all HTTP communication with the NZ Legislation API.

**Features:**

- HTTP requests with `got`
- Rate limiting (10,000/day, 2,000/5min burst)
- Response caching (LRU cache, 500 entries)
- Error handling and retries
- Request batching

**Key Functions:**

```typescript
// Search for legislation
export async function searchWorks(params: SearchParams): Promise<SearchResults> {
  // Check cache first
  const cached = cache.get(cacheKey);
  if (cached) return cached;

  // Check rate limits
  checkRateLimit();

  // Make API request
  const response = await got.get(url, { searchParams });

  // Cache and return
  cache.set(cacheKey, response);
  return response;
}

// Get work by ID
export async function getWork(workId: string): Promise<Work> {
  // Implementation
}

// Get work versions
export async function getWorkVersions(workId: string): Promise<Version[]> {
  // Implementation
}
```

**Caching Strategy:**

- Search results: 30 minutes TTL
- Work details: 2 hours TTL
- Versions: 1 hour TTL
- Max entries: 500 (LRU eviction)

---

### 3. Configuration Layer (`config.ts`)

**Responsibility:** Manage application configuration and API keys.

**Storage:**

- Primary: `conf` package (JSON file in user config directory)
- Override: Environment variables
- Default: Hardcoded defaults

**Configuration Schema:**

```typescript
import { z } from 'zod';

export const configSchema = z.object({
  apiKey: z.string().min(1),
  baseUrl: z.string().url().default('https://api.legislation.govt.nz'),
  timeout: z.number().positive().default(30000),
  dailyLimit: z.number().positive().default(10000),
  burstLimit: z.number().positive().default(2000),
  safetyMargin: z.number().min(0).max(1).default(0.1),
});

export type Config = z.infer<typeof configSchema>;
```

**Priority Order:**

1. Environment variables (`NZ_LEGISLATION_*`)
2. Config file (`~/.config/nz-legislation-tool/config.json`)
3. Default values

---

### 4. Error Handling (`errors.ts`)

**Responsibility:** Define error hierarchy and handle errors gracefully.

**Error Classes:**

```typescript
// Base error class
export class ApplicationError extends Error {
  constructor(
    message: string,
    public code: ErrorCode,
    public suggestion?: string
  ) {
    super(message);
    this.name = 'ApplicationError';
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      suggestion: this.suggestion,
    };
  }
}

// Specific error types
export class ApiError extends ApplicationError {
  constructor(
    message: string,
    public statusCode?: number
  ) {
    super(message, ErrorCode.API_ERROR);
  }
}

export class ConfigError extends ApplicationError {
  constructor(message: string) {
    super(message, ErrorCode.CONFIG_ERROR);
  }
}

export class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message, ErrorCode.VALIDATION_ERROR);
  }
}
```

**Error Codes:**

```typescript
export enum ErrorCode {
  // Configuration errors (1000-1999)
  CONFIG_API_KEY_MISSING = 1001,
  CONFIG_NOT_FOUND = 1002,

  // API errors (2000-2999)
  API_AUTHENTICATION_FAILED = 2001,
  API_NOT_FOUND = 2002,
  API_RATE_LIMIT_EXCEEDED = 2003,
  API_TIMEOUT = 2004,

  // Validation errors (3000-3999)
  VALIDATION_INVALID_FORMAT = 3001,
  VALIDATION_REQUIRED_FIELD = 3002,

  // File errors (4000-4999)
  FILE_NOT_FOUND = 4001,
  FILE_WRITE_ERROR = 4002,

  // Network errors (5000-5999)
  NETWORK_ERROR = 5001,
  NETWORK_TIMEOUT = 5002,
}
```

---

### 5. Commands Layer (`commands/`)

**Responsibility:** Implement individual CLI commands.

**Pattern:**

```typescript
import { Command } from 'commander';
import { searchWorks } from '../client';
import { formatOutput } from '../output/formatters';

export const searchCommand = new Command()
  .name('search')
  .description('Search for legislation')
  .requiredOption('-q, --query <text>', 'Search query')
  .option('-t, --type <type>', 'Filter by type')
  .option('-s, --status <status>', 'Filter by status')
  .option('-l, --limit <number>', 'Maximum results', '25')
  .option('-f, --format <format>', 'Output format', 'table')
  .action(async options => {
    try {
      const results = await searchWorks({
        query: options.query,
        type: options.type,
        status: options.status,
        limit: parseInt(options.limit),
      });

      console.log(formatOutput(results, options.format));
    } catch (error) {
      handleError(error);
    }
  });
```

**Commands:**

- `search` - Search for legislation
- `get` - Get legislation by ID
- `export` - Export results to file
- `cite` - Generate citations
- `config` - Manage configuration

---

### 6. Models Layer (`models/`)

**Responsibility:** Define TypeScript types and Zod schemas for validation.

**Example Schema:**

```typescript
import { z } from 'zod';

// Work (legislation) schema
export const WorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  type: z.enum(['act', 'bill', 'regulation', 'instrument']),
  status: z.string().optional(),
  date: z.string(),
  url: z.string().url(),
  versionCount: z.number().optional(),
});

export type Work = z.infer<typeof WorkSchema>;

// Search parameters schema
export const SearchParamsSchema = z.object({
  query: z.string().min(1),
  type: z.enum(['act', 'bill', 'regulation', 'instrument']).optional(),
  status: z.string().optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/)
    .optional(),
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});

export type SearchParams = z.infer<SearchParamsSchema>;
```

---

### 7. Output Layer (`output/`)

**Responsibility:** Format and display results.

**Formatters:**

- **Table** - Pretty terminal tables with `cli-table3`
- **JSON** - Structured JSON output
- **CSV** - CSV for spreadsheets

**Example:**

```typescript
import Table from 'cli-table3';

export function formatAsTable(results: SearchResults): string {
  const table = new Table({
    head: ['ID', 'Title', 'Type', 'Status', 'Date'],
    colWidths: [20, 50, 10, 10, 12],
  });

  results.works.forEach(work => {
    table.push([
      work.id,
      work.title.substring(0, 47) + '...',
      work.type,
      work.status || '-',
      work.date,
    ]);
  });

  return table.toString() + `\n\nTotal: ${results.total} results`;
}

export function formatAsJson(results: SearchResults): string {
  return JSON.stringify(results, null, 2);
}

export function formatAsCsv(results: SearchResults): string {
  const headers = ['id', 'title', 'type', 'status', 'date', 'url'];
  const rows = results.works.map(work => headers.map(h => work[h as keyof Work]).join(','));

  return [headers.join(','), ...rows].join('\n');
}
```

---

## Data Flow

### Search Command Flow

```
User Input
    │
    ▼
┌─────────────────┐
│  CLI Parser     │  Parse arguments, validate options
│  (commander)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  searchWorks()  │  Check cache, rate limits
│  (client.ts)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  HTTP Request   │  GET /v0/works?q=...
│  (got)          │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  NZ API         │  Returns JSON response
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Zod Validation │  Validate response schema
│  (models/)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Output Format  │  Table/JSON/CSV
│  (output/)      │
└────────┬────────┘
         │
         ▼
    User Output
```

---

## Configuration Flow

```
Application Start
    │
    ▼
┌─────────────────┐
│  Load Env Vars  │  dotenv.config()
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Load Config    │  conf.get()
│  File           │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Merge Config   │  Env > File > Defaults
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validate       │  Zod schema validation
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Ready to Use   │  Export getConfig()
└─────────────────┘
```

---

## Error Handling Flow

```
Command Execution
    │
    ▼
┌─────────────────┐
│  Try Block      │  Execute command
└────────┬────────┘
         │
    ┌────┴────┐
    │ Error?  │
    └────┬────┘
         │
    Yes  │  No
    │    │
    ▼    ▼
┌─────────┐ ┌──────────┐
│ Catch   │ │ Success  │
│ Error   │ │ Output   │
└────┬────┘ └──────────┘
     │
     ▼
┌─────────────────┐
│ Error Handler   │  Map to error code,
│                 │  add suggestion
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Display Error   │  User-friendly message
│                 │  with actionable steps
└─────────────────┘
```

---

## Testing Architecture

### Test Layers

```
┌─────────────────────────────────────────┐
│         E2E Tests (execa)               │  Full CLI workflows
├─────────────────────────────────────────┤
│    Integration Tests (MSW)              │  API mocking
├─────────────────────────────────────────┤
│      Property Tests (fast-check)        │  Invariant testing
├─────────────────────────────────────────┤
│       Hypothesis Tests                  │  Reproducibility
├─────────────────────────────────────────┤
│         Unit Tests (Vitest)             │  Core logic
└─────────────────────────────────────────┘
```

### Mocking Strategy

**API Mocking (MSW):**

```typescript
import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';

const server = setupServer(
  http.get('https://api.legislation.govt.nz/v0/works', ({ request }) => {
    const url = new URL(request.url);
    const query = url.searchParams.get('q');

    return HttpResponse.json({
      total: 1,
      results: [{ id: 'act/2020/67', title: 'Health Act 2020', ... }]
    });
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
```

---

## Performance Considerations

### Caching

**LRU Cache Implementation:**

```typescript
class LRUCache<K, V> {
  private cache: Map<K, V>;
  private maxEntries: number;

  constructor(maxEntries: number = 500) {
    this.cache = new Map();
    this.maxEntries = maxEntries;
  }

  get(key: K): V | undefined {
    if (!this.cache.has(key)) return undefined;

    // Move to end (most recently used)
    const value = this.cache.get(key)!;
    this.cache.delete(key);
    this.cache.set(key, value);
    return value;
  }

  set(key: K, value: V): void {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.maxEntries) {
      // Evict least recently used
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }
    this.cache.set(key, value);
  }
}
```

### Rate Limiting

**Token Bucket Algorithm:**

```typescript
class RateLimiter {
  private dailyLimit: number;
  private burstLimit: number;
  private dailyCount = 0;
  private burstCount = 0;
  private lastBurstReset = Date.now();

  checkLimit(): void {
    // Reset burst if 5 minutes passed
    if (Date.now() - this.lastBurstReset > 300000) {
      this.burstCount = 0;
      this.lastBurstReset = Date.now();
    }

    // Check daily limit
    if (this.dailyCount >= this.dailyLimit) {
      throw new Error('Daily rate limit exceeded');
    }

    // Check burst limit
    if (this.burstCount >= this.burstLimit) {
      throw new Error('Burst rate limit exceeded');
    }

    this.dailyCount++;
    this.burstCount++;
  }
}
```

---

## Security Considerations

### API Key Handling

```typescript
// ✅ Good: Load from secure config
const config = await getConfig();
const apiKey = config.apiKey;

// ❌ Bad: Hardcode API key
const apiKey = 'nzlapi3f4dd302e30beef18911';

// ✅ Good: Mask for display
function maskApiKey(key: string): string {
  return key.substring(0, 6) + '...' + key.substring(key.length - 4);
}
```

### Input Validation

```typescript
// ✅ Good: Validate all inputs
const params = SearchParamsSchema.parse({
  query: userInput,
  limit: userLimit,
});

// ❌ Bad: Trust user input
const params = {
  query: userInput, // Could be malicious
  limit: userLimit, // Could be 999999
};
```

---

## Deployment

### Build Process

```bash
# Development build
npm run build

# Production build (minified, tree-shaken)
npm run build -- --minify

# Output: dist/
#   - cli.js (CLI binary)
#   - mcp-cli.js (MCP server)
#   - *.d.ts (TypeScript declarations)
```

### Distribution

- **npm Registry:** `npm publish`
- **GitHub Releases:** Auto-created on version tag
- **Binaries:** Future (via `pkg` or `ncc`)

---

## Future Architecture Considerations

### Potential Improvements

1. **Plugin System** - Allow third-party extensions
2. **GraphQL API** - More flexible querying
3. **WebSocket Support** - Real-time updates
4. **Desktop App** - Electron-based GUI
5. **Web Interface** - Browser-based access

### Scalability

- **Horizontal Scaling:** Stateless design allows multiple instances
- **Caching Layer:** Redis for distributed caching
- **CDN:** Cache static API responses
- **Batch Processing:** Queue-based bulk operations

---

## Related Documentation

- [Visual Diagrams](./visual-diagrams.md) - Mermaid diagrams and flowcharts
- [API Reference](./api-reference/) - Detailed API docs
- [Code Style Guide](./code-style.md) - Coding standards
- [Testing Guide](./testing.md) - Testing strategies
- [Contributing Guide](./contributing.md) - How to contribute

---

## Visual Diagrams

For interactive Mermaid diagrams and detailed flowcharts, see [Visual Diagrams](./visual-diagrams.md).

**Available Diagrams:**

- High-Level Architecture
- Search Command Flow (Sequence Diagram)
- Configuration Flow
- Error Handling Flow
- Module Dependencies
- Data Model Relationships
- Test Pyramid
- Test Execution Flow
- Caching Strategy
- Rate Limiting Strategy
- API Key Flow
- First-Time User Flow
- Research Workflow
- Troubleshooting Flowcharts
- CI/CD Pipeline

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 4 - Developer Documentation
