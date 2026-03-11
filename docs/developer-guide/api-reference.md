# API Reference

**Complete API documentation for the NZ Legislation Tool**

---

## Overview

This is the complete API reference for the NZ Legislation Tool. It includes all public functions, classes, interfaces, and types with examples and usage guidelines.

**Generated from:** TypeScript source code  
**Last Updated:** 2026-03-10  
**Version:** 1.0.0

---

## Quick Links

- [Client API](#client-api) - Core API client methods
- [Commands API](#commands-api) - Command implementations
- [Models & Types](#models--types) - TypeScript types and schemas
- [Output Formatters](#output-formatters) - Formatting utilities
- [Error Classes](#error-classes) - Error handling
- [Configuration](#configuration) - Config management

---

## Client API

**Module:** `src/client.ts`

Core API client for interacting with the NZ Legislation API.

---

### `searchWorks(params: SearchParams): Promise<SearchResults>`

Search for legislation works matching the query parameters.

**Parameters:**

| Name     | Type           | Required | Description              |
| -------- | -------------- | -------- | ------------------------ |
| `params` | `SearchParams` | Yes      | Search parameters object |

**SearchParams Interface:**

```typescript
interface SearchParams {
  query: string; // Search query (required)
  type?: 'act' | 'bill' | 'regulation' | 'instrument';
  status?: string; // e.g., 'in-force', 'repealed'
  from?: string; // ISO date: YYYY-MM-DD
  to?: string; // ISO date: YYYY-MM-DD
  limit?: number; // 1-100, default: 25
  offset?: number; // For pagination, default: 0
}
```

**Returns:** `Promise<SearchResults>`

**SearchResults Interface:**

```typescript
interface SearchResults {
  total: number; // Total matching results
  offset: number; // Current offset
  limit: number; // Results per page
  works: Work[]; // Array of matching works
}
```

**Throws:**

- `ApiError` - If API request fails
- `ValidationError` - If parameters are invalid
- `RateLimitError` - If rate limit exceeded

**Example:**

```typescript
import { searchWorks } from '@client';

// Basic search
const results = await searchWorks({
  query: 'health',
  limit: 25,
});

console.log(`Found ${results.total} results`);
console.log(results.works);

// With filters
const filtered = await searchWorks({
  query: 'health',
  type: 'act',
  status: 'in-force',
  from: '2020-01-01',
  to: '2024-12-31',
  limit: 50,
});
```

**Caching:**

- Results cached for 30 minutes
- Cache key includes all parameters
- LRU eviction (max 500 entries)

**Rate Limiting:**

- Checks daily limit (10,000 requests)
- Checks burst limit (2,000 requests/5min)
- Includes 10% safety margin

---

### `getWork(workId: string, options?: GetWorkOptions): Promise<Work>`

Get detailed information about a specific work by ID.

**Parameters:**

| Name      | Type             | Required | Description                   |
| --------- | ---------------- | -------- | ----------------------------- |
| `workId`  | `string`         | Yes      | Work ID (e.g., 'act/2020/67') |
| `options` | `GetWorkOptions` | No       | Additional options            |

**GetWorkOptions Interface:**

```typescript
interface GetWorkOptions {
  includeVersions?: boolean; // Include version history
  format?: 'json' | 'table'; // Output format
}
```

**Returns:** `Promise<Work>`

**Work Interface:**

```typescript
interface Work {
  id: string;
  title: string;
  shortTitle?: string;
  type: 'act' | 'bill' | 'regulation' | 'instrument';
  status?: string;
  date: string;
  url: string;
  versionCount?: number;
  latestVersion?: {
    id: string;
    title: string;
    date: string;
  };
}
```

**Throws:**

- `ApiError` - If work not found (404)
- `ValidationError` - If workId format invalid

**Example:**

```typescript
import { getWork } from '@client';

// Get work details
const work = await getWork('act/2020/67');
console.log(work.title);

// Include version history
const workWithVersions = await getWork('act/2020/67', {
  includeVersions: true,
});
console.log(`Has ${work.versionCount} versions`);
```

**Caching:**

- Work details cached for 2 hours
- Version history cached for 1 hour

---

### `getWorkVersions(workId: string): Promise<Version[]>`

Get all versions of a specific work.

**Parameters:**

| Name     | Type     | Required | Description |
| -------- | -------- | -------- | ----------- |
| `workId` | `string` | Yes      | Work ID     |

**Returns:** `Promise<Version[]>`

**Version Interface:**

```typescript
interface Version {
  id: string;
  versionId: string;
  title: string;
  date: string;
  url: string;
  isCurrent: boolean;
}
```

**Example:**

```typescript
import { getWorkVersions } from '@client';

const versions = await getWorkVersions('act/2020/67');
console.log(`Found ${versions.length} versions`);

// Find current version
const current = versions.find(v => v.isCurrent);
console.log(`Current: ${current.title}`);
```

---

### `exportWorks(params: ExportParams): Promise<void>`

Export search results to a file.

**Parameters:**

| Name     | Type           | Required | Description       |
| -------- | -------------- | -------- | ----------------- |
| `params` | `ExportParams` | Yes      | Export parameters |

**ExportParams Interface:**

```typescript
interface ExportParams {
  query: string;
  output: string; // File path
  format?: 'csv' | 'json';
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  includeMetadata?: boolean;
}
```

**Returns:** `Promise<void>`

**Side Effects:**

- Creates file at specified path
- Overwrites existing files

**Example:**

```typescript
import { exportWorks } from '@client';

// Export to CSV
await exportWorks({
  query: 'health',
  output: 'health_acts.csv',
  format: 'csv',
  limit: 1000,
});

// Export to JSON with metadata
await exportWorks({
  query: 'health',
  output: 'health_acts.json',
  format: 'json',
  includeMetadata: true,
});
```

**Metadata (when includeMetadata: true):**

```json
{
  "exportedAt": "2026-03-10T12:00:00Z",
  "query": "health",
  "totalResults": 42,
  "apiVersion": "v0",
  "toolVersion": "1.0.0"
}
```

---

### `generateCitation(workId: string, style?: CitationStyle): Promise<string>`

Generate a citation for a specific work.

**Parameters:**

| Name     | Type            | Required | Description                      |
| -------- | --------------- | -------- | -------------------------------- |
| `workId` | `string`        | Yes      | Work ID                          |
| `style`  | `CitationStyle` | No       | Citation style (default: 'nzmj') |

**CitationStyle Type:**

```typescript
type CitationStyle = 'nzmj' | 'apa' | 'bibtex' | 'ris';
```

**Returns:** `Promise<string>` - Formatted citation

**Example:**

```typescript
import { generateCitation } from '@client';

// NZMJ style (default)
const nzmj = await generateCitation('act/2020/67');
console.log(nzmj);
// Output: "Health Act 2020 (NZ) 2020/67."

// APA style
const apa = await generateCitation('act/2020/67', 'apa');
console.log(apa);
// Output: "Health Act 2020, Public Act 2020/67 (New Zealand)."

// BibTeX
const bibtex = await generateCitation('act/2020/67', 'bibtex');
console.log(bibtex);
// Output: @legislation{health2020, ...}

// RIS
const ris = await generateCitation('act/2020/67', 'ris');
console.log(ris);
// Output: TY - STATUTE ...
```

---

## Commands API

**Module:** `src/commands/`

CLI command implementations.

---

### `searchCommand`

**Type:** `Command` (from commander)

Search command configuration and handler.

**Options:**

```typescript
interface SearchOptions {
  query: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
  format?: 'table' | 'json' | 'csv';
  verbose?: boolean;
}
```

**Usage:**

```bash
nzlegislation search --query "health" --type act --limit 50
```

**Handler:**

```typescript
async function searchHandler(options: SearchOptions) {
  try {
    const results = await searchWorks({
      query: options.query,
      type: options.type as SearchParams['type'],
      status: options.status,
      from: options.from,
      to: options.to,
      limit: options.limit,
      offset: options.offset,
    });

    console.log(formatOutput(results, options.format));
  } catch (error) {
    handleError(error);
  }
}
```

---

### `getCommand`

**Type:** `Command`

Get command configuration and handler.

**Options:**

```typescript
interface GetOptions {
  id: string;
  versions?: boolean;
  format?: 'table' | 'json' | 'csv';
  verbose?: boolean;
}
```

**Usage:**

```bash
nzlegislation get "act/2020/67" --versions
```

---

### `exportCommand`

**Type:** `Command`

Export command configuration and handler.

**Options:**

```typescript
interface ExportOptions {
  query: string;
  output: string;
  format?: 'csv' | 'json';
  type?: string;
  status?: string;
  limit?: number;
  includeMetadata?: boolean;
}
```

**Usage:**

```bash
nzlegislation export --query "health" --output results.csv --include-metadata
```

---

### `citeCommand`

**Type:** `Command`

Cite command configuration and handler.

**Options:**

```typescript
interface CiteOptions {
  id: string;
  style?: 'nzmj' | 'apa' | 'bibtex' | 'ris';
}
```

**Usage:**

```bash
nzlegislation cite "act/2020/67" --style apa
```

---

### `configCommand`

**Type:** `Command`

Configuration command configuration and handler.

**Options:**

```typescript
interface ConfigOptions {
  show?: boolean;
  key?: string;
  clear?: boolean;
}
```

**Usage:**

```bash
# Show current config
nzlegislation config --show

# Set API key
nzlegislation config --key YOUR_API_KEY

# Clear config
nzlegislation config --clear
```

---

## Models & Types

**Module:** `src/models/`

TypeScript types and Zod schemas for validation.

---

### WorkSchema

**Type:** `ZodSchema<Work>`

Schema for validating work objects.

**Definition:**

```typescript
import { z } from 'zod';

export const WorkSchema = z.object({
  id: z.string(),
  title: z.string(),
  shortTitle: z.string().optional(),
  type: z.enum(['act', 'bill', 'regulation', 'instrument']),
  status: z.string().optional(),
  date: z.string(),
  url: z.string().url(),
  versionCount: z.number().optional(),
  latestVersion: z
    .object({
      id: z.string(),
      title: z.string(),
      date: z.string(),
    })
    .optional(),
});

export type Work = z.infer<typeof WorkSchema>;
```

**Validation:**

```typescript
import { WorkSchema } from '@models';

// Validate work object
const result = WorkSchema.safeParse(apiResponse);

if (!result.success) {
  console.error('Validation failed:', result.error);
} else {
  console.log('Valid work:', result.data);
}
```

---

### SearchParamsSchema

**Type:** `ZodSchema<SearchParams>`

Schema for validating search parameters.

**Definition:**

```typescript
export const SearchParamsSchema = z.object({
  query: z.string().min(1, 'Query is required'),
  type: z.enum(['act', 'bill', 'regulation', 'instrument']).optional(),
  status: z.string().optional(),
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format')
    .optional(),
  limit: z.number().min(1).max(100).default(25),
  offset: z.number().min(0).default(0),
});
```

---

### SearchResultsSchema

**Type:** `ZodSchema<SearchResults>`

Schema for validating search results.

**Definition:**

```typescript
export const SearchResultsSchema = z.object({
  total: z.number(),
  offset: z.number(),
  limit: z.number(),
  works: z.array(WorkSchema),
});
```

---

### ConfigSchema

**Type:** `ZodSchema<Config>`

Schema for validating configuration.

**Definition:**

```typescript
export const ConfigSchema = z.object({
  apiKey: z.string().min(1, 'API key is required'),
  baseUrl: z.string().url().default('https://api.legislation.govt.nz'),
  timeout: z.number().positive().default(30000),
  dailyLimit: z.number().positive().default(10000),
  burstLimit: z.number().positive().default(2000),
  safetyMargin: z.number().min(0).max(1).default(0.1),
});
```

---

## Output Formatters

**Module:** `src/output/`

Utilities for formatting output.

---

### `formatAsTable(results: SearchResults): string`

Format search results as a pretty table.

**Parameters:**

| Name      | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `results` | `SearchResults` | Search results to format |

**Returns:** `string` - Formatted table

**Example:**

```typescript
import { formatAsTable } from '@output/formatters';

const table = formatAsTable(results);
console.log(table);
```

**Output:**

```
┌────────────────────┬──────────────────────────────────────────┬────────┬──────────┬────────────┐
│ ID                 │ Title                                    │ Type   │ Status   │ Date       │
├────────────────────┼──────────────────────────────────────────┼────────┼──────────┼────────────┤
│ act/2020/67        │ Health Act 2020                          │ act    │ in-force │ 2020-11-15 │
└────────────────────┴──────────────────────────────────────────┴────────┴──────────┴────────────┘
```

---

### `formatAsJson(results: SearchResults): string`

Format search results as JSON.

**Parameters:**

| Name      | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `results` | `SearchResults` | Search results to format |

**Returns:** `string` - JSON string

**Example:**

```typescript
import { formatAsJson } from '@output/formatters';

const json = formatAsJson(results);
console.log(json);
```

**Output:**

```json
{
  "total": 42,
  "offset": 0,
  "limit": 25,
  "works": [...]
}
```

---

### `formatAsCsv(results: SearchResults): string`

Format search results as CSV.

**Parameters:**

| Name      | Type            | Description              |
| --------- | --------------- | ------------------------ |
| `results` | `SearchResults` | Search results to format |

**Returns:** `string` - CSV string

**Example:**

```typescript
import { formatAsCsv } from '@output/formatters';

const csv = formatAsCsv(results);
console.log(csv);
```

**Output:**

```csv
id,title,shortTitle,type,status,date,url,versionCount
act/2020/67,Health Act 2020,Health Act 2020,act,in-force,2020-11-15,https://...,5
```

---

### `generateCitation(work: Work, style: CitationStyle): string`

Generate a citation in the specified style.

**Parameters:**

| Name    | Type            | Description    |
| ------- | --------------- | -------------- |
| `work`  | `Work`          | Work to cite   |
| `style` | `CitationStyle` | Citation style |

**Returns:** `string` - Formatted citation

**Supported Styles:**

- `nzmj` - New Zealand Medical Journal
- `apa` - APA 7th edition
- `bibtex` - BibTeX format
- `ris` - RIS format

**Example:**

```typescript
import { generateCitation } from '@output/citations';

const citation = generateCitation(work, 'apa');
console.log(citation);
```

---

## Error Classes

**Module:** `src/errors.ts`

Error classes for error handling.

---

### `ApplicationError`

**Base class for all application errors.**

**Properties:**

- `message: string` - Error message
- `code: ErrorCode` - Error code
- `suggestion?: string` - Suggested fix

**Example:**

```typescript
import { ApplicationError, ErrorCode } from '@errors';

throw new ApplicationError(
  'API key not configured',
  ErrorCode.CONFIG_API_KEY_MISSING,
  'Run: nzlegislation config --key YOUR_KEY'
);
```

---

### `ApiError`

**Error for API-related issues.**

**Extends:** `ApplicationError`

**Properties:**

- `statusCode?: number` - HTTP status code

**Example:**

```typescript
import { ApiError } from '@errors';

throw new ApiError('Authentication failed', 401);
```

---

### `ConfigError`

**Error for configuration issues.**

**Extends:** `ApplicationError`

**Example:**

```typescript
import { ConfigError } from '@errors';

throw new ConfigError('Configuration file not found');
```

---

### `ValidationError`

**Error for validation failures.**

**Extends:** `ApplicationError`

**Example:**

```typescript
import { ValidationError } from '@errors';

throw new ValidationError('Invalid date format. Use YYYY-MM-DD');
```

---

### `RateLimitError`

**Error for rate limit exceeded.**

**Extends:** `ApplicationError`

**Properties:**

- `retryAfter?: number` - Seconds to wait

**Example:**

```typescript
import { RateLimitError } from '@errors';

throw new RateLimitError('Rate limit exceeded. Please wait 300 seconds.', 300);
```

---

### ErrorCode Enum

**All error codes:**

```typescript
enum ErrorCode {
  // Configuration errors (1000-1999)
  CONFIG_API_KEY_MISSING = 1001,
  CONFIG_NOT_FOUND = 1002,

  // API errors (2000-2999)
  API_AUTHENTICATION_FAILED = 2001,
  API_NOT_FOUND = 2002,
  API_RATE_LIMIT_EXCEEDED = 2003,
  API_TIMEOUT = 2004,
  API_NETWORK_ERROR = 2005,

  // Validation errors (3000-3999)
  VALIDATION_INVALID_FORMAT = 3001,
  VALIDATION_REQUIRED_FIELD = 3002,
  VALIDATION_INVALID_DATE = 3003,

  // File errors (4000-4999)
  FILE_NOT_FOUND = 4001,
  FILE_WRITE_ERROR = 4002,
  FILE_READ_ERROR = 4003,

  // Network errors (5000-5999)
  NETWORK_ERROR = 5001,
  NETWORK_TIMEOUT = 5002,
  NETWORK_DNS_ERROR = 5003,
}
```

---

## Configuration

**Module:** `src/config.ts`

Configuration management utilities.

---

### `getConfig(): Promise<Config>`

Get current configuration.

**Returns:** `Promise<Config>`

**Example:**

```typescript
import { getConfig } from '@config';

const config = await getConfig();
console.log(`API Key: ${maskApiKey(config.apiKey)}`);
console.log(`Base URL: ${config.baseUrl}`);
```

---

### `setConfig(updates: Partial<Config>): Promise<Config>`

Update configuration.

**Parameters:**

| Name      | Type              | Description           |
| --------- | ----------------- | --------------------- |
| `updates` | `Partial<Config>` | Configuration updates |

**Returns:** `Promise<Config>` - Updated configuration

**Example:**

```typescript
import { setConfig } from '@config';

const config = await setConfig({
  apiKey: 'nzlapi3f4dd302e30beef18911',
});
```

---

### `clearConfig(): Promise<void>`

Clear all configuration.

**Returns:** `Promise<void>`

**Example:**

```typescript
import { clearConfig } from '@config';

await clearConfig();
console.log('Configuration cleared');
```

---

### `validateConfig(config: unknown): Config`

Validate configuration object.

**Parameters:**

| Name     | Type      | Description               |
| -------- | --------- | ------------------------- |
| `config` | `unknown` | Configuration to validate |

**Returns:** `Config` - Validated configuration

**Throws:** `ConfigError` if validation fails

**Example:**

```typescript
import { validateConfig } from '@config';

try {
  const config = validateConfig(rawConfig);
} catch (error) {
  console.error('Invalid config:', error);
}
```

---

## Interactive Examples

### Example 1: Basic Search

```typescript
import { searchWorks } from '@client';
import { formatAsTable } from '@output/formatters';

async function basicSearch() {
  const results = await searchWorks({
    query: 'health',
    limit: 25,
  });

  console.log(formatAsTable(results));
}

basicSearch();
```

---

### Example 2: Advanced Search with Filters

```typescript
import { searchWorks } from '@client';
import { formatAsJson } from '@output/formatters';

async function advancedSearch() {
  const results = await searchWorks({
    query: 'health',
    type: 'act',
    status: 'in-force',
    from: '2020-01-01',
    to: '2024-12-31',
    limit: 100,
  });

  console.log(formatAsJson(results));
}

advancedSearch();
```

---

### Example 3: Export to CSV

```typescript
import { exportWorks } from '@client';

async function exportData() {
  await exportWorks({
    query: 'health',
    output: 'health_acts.csv',
    format: 'csv',
    limit: 1000,
    includeMetadata: true,
  });

  console.log('Export complete!');
}

exportData();
```

---

### Example 4: Generate Citations

```typescript
import { generateCitation } from '@client';

async function createBibliography() {
  const works = ['act/1981/118', 'act/2020/67', 'act/2000/7'];

  for (const workId of works) {
    const bibtex = await generateCitation(workId, 'bibtex');
    console.log(bibtex);
  }
}

createBibliography();
```

---

### Example 5: Error Handling

```typescript
import { searchWorks } from '@client';
import { ApiError, RateLimitError } from '@errors';

async function searchWithHandling() {
  try {
    const results = await searchWorks({ query: 'health' });
    console.log(results);
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.log(`Rate limited. Wait ${error.retryAfter} seconds.`);
    } else if (error instanceof ApiError) {
      console.log(`API error: ${error.message}`);
      if (error.suggestion) {
        console.log(`Suggestion: ${error.suggestion}`);
      }
    } else {
      console.log('Unknown error:', error);
    }
  }
}

searchWithHandling();
```

---

## Related Documentation

- [Architecture Overview](./architecture.md) - System design
- [Visual Diagrams](./visual-diagrams.md) - Flow diagrams
- [Contributing Guide](./contributing.md) - How to contribute
- [Testing Guide](./testing.md) - Testing strategies

---

**Last Updated:** 2026-03-10  
**Version:** 1.0.0  
**Track:** Documentation Optimization & Humanization  
**Phase:** 7.5 - API Documentation & Troubleshooting
