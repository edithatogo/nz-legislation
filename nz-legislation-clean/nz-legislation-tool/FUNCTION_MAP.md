# NZ Legislation Tool - Function Mapping

**Project:** NZ Legislation Tool  
**Version:** 2.0.0  
**Generated:** March 11, 2026  
**Scope:** Core source code and plugins

---

## Table of Contents

1. [Module Overview](#module-overview)
2. [Entry Points (CLI Commands)](#entry-points-cli-commands)
3. [Function Catalog by File](#function-catalog-by-file)
4. [Dependencies Between Modules](#dependencies-between-modules)
5. [Plugin Architecture](#plugin-architecture)

---

## Module Overview

### Core Architecture

The NZ Legislation Tool is a TypeScript-based CLI application for searching, retrieving, and exporting New Zealand legislation data. It features:

- **REST API Client** - Communicates with the NZ Legislation API (api.legislation.govt.nz)
- **Plugin System** - Extensible architecture supporting multiple jurisdictions
- **MCP Server** - Model Context Protocol integration for AI assistants
- **Caching & Rate Limiting** - Optimized API usage with LRU caching and token bucket rate limiting
- **Health Monitoring** - Continuous health checks and fallback strategies

### Directory Structure

```
nz-legislation-tool/
├── src/
│   ├── cli.ts                    # Main CLI entry point
│   ├── mcp-cli.ts                # MCP server entry point
│   ├── client.ts                 # API client
│   ├── config.ts                 # Configuration management
│   ├── errors.ts                 # Error hierarchy
│   ├── commands/                 # CLI command implementations
│   ├── mcp/                      # MCP server implementation
│   ├── models/                   # Data models and Zod schemas
│   ├── output/                   # Output formatters
│   ├── providers/                # Plugin provider system
│   └── utils/                    # Utility functions
└── plugins/
    ├── commonwealth/             # Commonwealth Australia plugin
    └── queensland/               # Queensland Australia plugin
```

---

## Entry Points (CLI Commands)

### Main CLI Entry Point

**File:** `/src/cli.ts`

```typescript
// Main program setup
const program = new Command();
program.name('nzlegislation')
  .description('Search and retrieve New Zealand legislation data')
  .version(pkg.default.version);
```

**Key Functions:**
- `handleError(error: unknown): void` - Global error boundary with suggestions
- `displayErrorWithSuggestions(error: ApplicationError): void` - Contextual error help
- `getExitCode(code: ErrorCode): number` - Maps error codes to exit codes

**Pre-action Hook:**
- Validates API key configuration
- Applies verbose/quiet options

### MCP Server Entry Point

**File:** `/src/mcp-cli.ts`

```typescript
startServer(): Promise<McpServer>
```

**Graceful Shutdown Handlers:**
- SIGTERM handler
- SIGINT handler

---

## Function Catalog by File

### Core Modules

#### `/src/cli.ts` - Main CLI

| Function/Class | Type | Description |
|----------------|------|-------------|
| `handleError` | Function | Global error boundary - catches all unhandled errors |
| `displayErrorWithSuggestions` | Function | Displays error with actionable suggestions based on error type |
| `getExitCode` | Function | Maps ErrorCode to appropriate exit code (1-5) |

**Error Code Categories:**
- API Errors (1000-1999): Exit code 1
- Config Errors (2000-2999): Exit code 2
- Validation Errors (3000-3999): Exit code 3
- File System Errors (4000-4999): Exit code 4
- Network Errors (5000-5999): Exit code 5

---

#### `/src/client.ts` - API Client

**Interfaces:**
```typescript
interface CacheEntry<T> { data: T; timestamp: number; ttl: number; }
interface CacheMetrics { hits: number; misses: number; evictions: number; sets: number; }
interface BatchRequest { key: string; resolve: Function; reject: Function; }
```

**Functions:**

| Function | Type | Description |
|----------|------|-------------|
| `generateCacheKey` | Function | Generates cache key from endpoint and params |
| `getFromCache<T>` | Function | Retrieves data from LRU cache with TTL checking |
| `setInCache<T>` | Function | Stores data in cache with specified TTL |
| `clearCache` | Function | Clears all cache or entries matching pattern |
| `getCacheStats` | Function | Returns cache statistics (size, hit rate, metrics) |
| `resetCacheMetrics` | Function | Resets cache metrics counters (for testing) |
| `executeBatch` | Function | Executes batched requests concurrently |
| `scheduleBatchExecution` | Function | Schedules batch execution with debouncing (50ms) |
| `checkRateLimit` | Function | Enforces daily (10k) and burst (2k/5min) rate limits |
| `getHeaderValue` | Function | Extracts single header value from response |
| `updateRateLimitState` | Function | Updates rate limit state from response headers |
| `createClient` | Function | Creates configured HTTP client with retry logic |
| `setHttpClientFactoryForTesting` | Function | Test utility to mock HTTP client |
| `getWorkFromVersions` | Function | Reconstructs work from versions endpoint |
| `searchWorks` | Async Function | Search for legislation works |
| `getWork` | Async Function | Get specific work by ID |
| `getWorkVersions` | Async Function | Get all versions of a work |
| `getVersion` | Async Function | Get specific version details |
| `getRateLimitStatus` | Function | Returns current rate limit state |

**Cache Configuration:**
```typescript
CACHE_CONFIG = {
  max: 500,                    // Max entries
  defaultTTL: 60 * 60 * 1000,  // 1 hour
  searchTTL: 30 * 60 * 1000,   // 30 minutes
  workTTL: 2 * 60 * 60 * 1000, // 2 hours
  versionsTTL: 60 * 60 * 1000, // 1 hour
};
```

---

#### `/src/config.ts` - Configuration Management

**Types:**
```typescript
type Config = z.infer<typeof configSchema>;
interface ConfigError { field: string; message: string; value?: unknown; }
```

**Functions:**

| Function | Type | Description |
|----------|------|-------------|
| `validateConfig` | Function | Validates config against Zod schema |
| `loadStoredConfig` | Function | Loads config from secure file |
| `saveStoredConfig` | Function | Saves config to secure file |
| `getEnvConfig` | Function | Extracts config from environment variables |
| `defaultConfig` | Function | Returns default configuration |
| `getConfig` | Function | Merges env, file, and default configs |
| `hasApiKey` | Function | Checks if valid API key is configured |
| `setApiKey` | Function | Saves API key to secure config |
| `setConfig` | Function | Updates specific config key |
| `clearConfig` | Function | Clears all configuration |
| `getConfigPath` | Function | Returns config file path |
| `getConfigValidationStatus` | Function | Returns validation status and source |

**Configuration Priority:** Environment Variables > Secure Config File > Defaults

---

#### `/src/errors.ts` - Error Hierarchy

**Enums:**
```typescript
enum ErrorCode {
  API_AUTHENTICATION_FAILED = 1001,
  API_NOT_FOUND = 1002,
  API_RATE_LIMIT_EXCEEDED = 1003,
  API_TIMEOUT = 1004,
  API_UNEXPECTED_RESPONSE = 1005,
  CONFIG_NOT_FOUND = 2001,
  CONFIG_INVALID = 2002,
  CONFIG_API_KEY_MISSING = 2003,
  VALIDATION_FAILED = 3001,
  VALIDATION_INVALID_ID = 3002,
  VALIDATION_INVALID_DATE = 3003,
  FILE_NOT_FOUND = 4001,
  FILE_WRITE_FAILED = 4002,
  FILE_READ_FAILED = 4003,
  NETWORK_OFFLINE = 5001,
  NETWORK_DNS_FAILED = 5002,
  NETWORK_CONNECTION_REFUSED = 5003,
  UNKNOWN = 9999,
}
```

**Classes:**

| Class | Extends | Description |
|-------|---------|-------------|
| `ApplicationError` | Error | Base error with code, timestamp, context |
| `ApiError` | ApplicationError | API-specific errors with statusCode, url |
| `ConfigError` | ApplicationError | Configuration errors |
| `ValidationError` | ApplicationError | Validation errors with field |
| `FileSystemError` | ApplicationError | File system errors with path |
| `NetworkError` | ApplicationError | Network errors with url |

**Helper Functions:**

| Function | Type | Description |
|----------|------|-------------|
| `createApiError` | Function | Factory for API errors based on status code |
| `isApplicationError` | Function | Type guard for ApplicationError |
| `isApiError` | Function | Type guard for ApiError |
| `getUserFriendlyMessage` | Function | Returns user-friendly error message |
| `getErrorCode` | Function | Extracts ErrorCode from error |

---

### Command Modules

#### `/src/commands/batch.ts` - Batch Operations

**Interface:**
```typescript
interface BatchOptions {
  file?: string;
  ids?: string;
  type: 'search' | 'getWork' | 'getVersions' | 'getVersion';
  output?: string;
  format: 'json' | 'csv';
  concurrency: string;
  retry: boolean;
  idColumn?: string;
}
```

**Exported Command:**
```typescript
export const batchCommand: Command
```

**Features:**
- Load from CSV or JSON files
- Comma-separated ID lists
- Configurable concurrency (default: 5)
- Retry failed requests
- Progress tracking with EventEmitter
- Summary statistics on completion

---

#### `/src/commands/cache.ts` - Cache Management

**Interface:**
```typescript
interface CacheOptions {
  clear?: boolean;
  stats?: boolean;
  pattern?: string;
}
```

**Exported Command:**
```typescript
export const cacheCommand: Command
```

**Options:**
- `--clear` - Clear all cached data
- `--pattern <pattern>` - Clear entries matching pattern
- `--stats` - Show cache statistics

---

#### `/src/commands/cite.ts` - Citation Generation

**Interface:**
```typescript
interface CiteOptions {
  style: string;
  copy: boolean;
}
```

**Exported Command:**
```typescript
export const citeCommand: Command
```

**Supported Styles:** nzmj, bibtex, ris, enw, apa

---

#### `/src/commands/config.ts` - Configuration Setup

**Interface:**
```typescript
interface ConfigOptions {
  show?: boolean;
  key?: string;
  clear?: boolean;
}
```

**Exported Command:**
```typescript
export const configCommand: Command
```

**Options:**
- `--show` - Display current configuration
- `--key <key>` - Set API key
- `--clear` - Clear all configuration

---

#### `/src/commands/export.ts` - Export to File

**Interface:**
```typescript
interface ExportOptions {
  query: string;
  output: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit: string;
  format: string;
  includeMetadata: boolean;
}
```

**Exported Command:**
```typescript
export const exportCommand: Command
```

**Formats:** CSV (default), JSON with optional metadata

---

#### `/src/commands/generate.ts` - Code Generation

**Functions:**

| Function | Description |
|----------|-------------|
| `generateCommandTemplate` | Generates new command template |
| `generateModelTemplate` | Generates Zod schema model template |
| `generateTestTemplate` | Generates Vitest test template |
| `generateDocsTemplate` | Generates documentation template |
| `createGenerateCommand` | Creates generate command with subcommands |

**Subcommands:**
- `generate command <name>` - New command
- `generate model <name>` - New model
- `generate test <name>` - New test
- `generate docs <name>` - New documentation

---

#### `/src/commands/get.ts` - Get Legislation

**Interface:**
```typescript
interface GetOptions {
  versions?: boolean;
  format: string;
}
```

**Exported Command:**
```typescript
export const getCommand: Command
```

**Options:**
- `--versions` - Show version history
- `--format <format>` - Output format (table, json, csv)

---

#### `/src/commands/help.ts` - Interactive Help

**Interfaces:**
```typescript
interface HelpTopic {
  id: string;
  title: string;
  description: string;
  examples: string[];
  relatedCommands?: string[];
}
```

**Functions:**

| Function | Description |
|----------|-------------|
| `createInteractiveHelpCommand` | Creates menu-driven help navigation |
| `createContextualHelpCommand` | Creates scenario-based help |

**Help Topics:** search, get, export, cite, config, cache, troubleshooting

**Contextual Scenarios:** auth, rate-limit, network, export, cite

---

#### `/src/commands/plugin.ts` - Plugin Management

**Exported Command:**
```typescript
export const pluginCommand: Command
```

**Subcommands:**
- `plugin list` - List installed plugins
- `plugin discover` - Discover available plugins
- `plugin install <plugin>` - Install a plugin
- `plugin uninstall <plugin>` - Uninstall a plugin
- `plugin update <plugin>` - Update a plugin
- `plugin status` - Show plugin system status

---

#### `/src/commands/search.ts` - Search Legislation

**Interface:**
```typescript
interface SearchOptions {
  query: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit: string;
  offset: string;
  format: string;
}
```

**Exported Command:**
```typescript
export const searchCommand: Command
```

**Options:**
- `-q, --query <text>` (required) - Search query
- `-t, --type <type>` - Filter by type (act, bill, regulation, instrument)
- `-s, --status <status>` - Filter by status
- `--from <date>` - Filter from date (YYYY-MM-DD)
- `--to <date>` - Filter to date (YYYY-MM-DD)
- `-l, --limit <number>` - Maximum results (default: 25, max: 100)
- `-o, --offset <number>` - Result offset
- `--format <format>` - Output format (table, json, csv)

---

#### `/src/commands/stream.ts` - Stream Large Exports

**Interface:**
```typescript
interface StreamOptions {
  query: string;
  output: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: string;
  format: string;
  batchSize: string;
  concurrency: string;
  noMetadata?: boolean;
}
```

**Exported Command:**
```typescript
export const streamCommand: Command
```

**Features:**
- Minimal memory usage with streaming
- Configurable batch size and concurrency
- Progress tracking with ETA
- Memory usage reporting

---

### MCP Server Module

#### `/src/mcp/server.ts` - MCP Server

**Functions:**

| Function | Type | Description |
|----------|------|-------------|
| `createServer` | Function | Creates MCP server instance with all tools |
| `registerSearchTool` | Function | Registers search_legislation tool |
| `registerGetTool` | Function | Registers get_legislation tool |
| `registerGetVersionsTool` | Function | Registers get_legislation_versions tool |
| `registerCitationTool` | Function | Registers generate_citation tool |
| `registerExportTool` | Function | Registers export_legislation tool |
| `registerConfigTool` | Function | Registers get_config tool |
| `registerLegislationResource` | Function | Registers legislation://{workId} resource |
| `startServer` | Async Function | Starts MCP server with stdio transport |
| `checkMcpRateLimit` | Function | Enforces MCP rate limit (9000/day) |

**MCP Rate Limiting:**
```typescript
const MCP_DAILY_LIMIT = 9000; // 10% safety margin below API limit
```

---

### Models Module

#### `/src/models/index.ts` - Data Models

**Schemas:**

| Schema | Type | Description |
|--------|------|-------------|
| `WorkTypeSchema` | Zod Enum | act, bill, regulation, instrument |
| `LegislationStatusSchema` | Zod Enum | in-force, not-yet-in-force, repealed, partially-repealed, withdrawn |
| `WorkSchema` | Zod Schema | Normalized legislation work |
| `WorkFromVersionSchema` | Zod Schema | Work reconstructed from version |
| `VersionSchema` | Zod Schema | Version item |
| `FormatInfoSchema` | Zod Schema | Format information |
| `LegislationVersionSchema` | Zod Schema | Full version with content |
| `PaginationLinksSchema` | Zod Schema | Next/prev links |
| `SearchResultsSchema` | Zod Schema | Paginated search results |
| `CitationSchema` | Zod Schema | Citation information |
| `ExportMetadataSchema` | Zod Schema | Export metadata |

**Types:**
```typescript
type WorkType = 'act' | 'bill' | 'regulation' | 'instrument'
type LegislationStatus = 'in-force' | 'not-yet-in-force' | 'repealed' | 'partially-repealed' | 'withdrawn'
type Work = z.infer<typeof WorkSchema>
type Version = z.infer<typeof VersionSchema>
type LegislationVersion = z.infer<typeof LegislationVersionSchema>
type SearchResults = z.infer<typeof SearchResultsSchema>
```

**Helper Functions:**
- `extractDateFromVersionId` - Extracts YYYY-MM-DD from version ID
- `mapLegislationType` - Maps API type to WorkType
- `mapLegislationStatus` - Maps API status to LegislationStatus

---

### Output Module

#### `/src/output/index.ts` - Output Formatters

**Functions:**

| Function | Description |
|----------|-------------|
| `formatWorkType` | Formats work type with color coding |
| `formatStatus` | Formats status with color coding |
| `printTable` | Prints search results as CLI table |
| `printWorkDetail` | Prints single work details |
| `printVersionsTable` | Prints versions as table |
| `printJson` | Prints data as formatted JSON |
| `worksToCsv` | Converts works to CSV format |
| `versionsToCsv` | Converts versions to CSV format |
| `generateCitation` | Generates citation in specified style |
| `extractCitationYear` | Extracts year for citation |

**Color Coding:**
- Acts: Cyan
- Bills: Magenta
- Regulations: Yellow
- Instruments: White
- In-force: Green
- Not-yet-in-force: Yellow
- Repealed/Withdrawn: Red

---

### Providers Modules

#### `/src/providers/legislation-provider.ts` - Provider Interface

**Interfaces:**
```typescript
interface SearchParams { query?: string; type?: ...; status?: ...; ... }
interface SearchResults { total: number; results: WorkSummary[]; ... }
interface WorkSummary { work_id: string; title: string; type: string; ... }
interface Work extends WorkSummary { status: string; versions: VersionSummary[]; ... }
interface VersionSummary { version_id: string; title: string; date: string; ... }
type CitationStyle = 'nzmj' | 'apa' | 'oscola' | 'australian'
```

**Interfaces:**

| Interface | Description |
|-----------|-------------|
| `LegislationProvider` | Interface all providers must implement |
| `HealthCheckable` | Interface for health-monitorable providers |

**Classes:**

| Class | Description |
|-------|-------------|
| `BaseLegislationProvider` | Abstract base with common functionality |
| `ProviderRegistry` | Manages multiple providers |

**BaseLegislationProvider Methods:**
- `getJurisdiction()` - Get jurisdiction identifier
- `getDisplayName()` - Get display name
- `search(params)` - Search with caching/rate limiting
- `getWork(workId)` - Get work with caching
- `getVersions(workId)` - Get versions with caching
- `getVersion(versionId)` - Get version with caching
- `getCitation(work, style)` - Generate citation
- `healthCheck()` - Health check implementation
- `getCacheStats()` - Get cache statistics
- `getRateLimitStatus()` - Get rate limit status

**Abstract Methods (to implement):**
- `searchImpl(params)` - Implementation of search
- `getWorkImpl(workId)` - Implementation of get work
- `getVersionsImpl(workId)` - Implementation of get versions
- `getVersionImpl(versionId)` - Implementation of get version

**ProviderRegistry Methods:**
- `register(provider)` - Register a provider
- `get(jurisdiction)` - Get provider by jurisdiction
- `getAll()` - Get all providers
- `getJurisdictions()` - Get all jurisdictions
- `has(jurisdiction)` - Check if provider exists
- `getHealthDashboard()` - Get health of all providers

---

#### `/src/providers/plugin-discovery.ts` - Plugin Discovery

**Interface:**
```typescript
interface DiscoveryOptions {
  directories?: string[];
  autoLoad?: boolean;
  verbose?: boolean;
}
```

**Class: PluginDiscovery**

| Method | Description |
|--------|-------------|
| `constructor(loader, options)` | Initialize with loader and options |
| `discover()` | Discover and optionally load all plugins |
| `getDefaultDirectories()` | Get default plugin directories |
| `getSummary()` | Get discovery summary |

**Function:**
```typescript
createPluginDiscovery(coreVersion: string, options?: DiscoveryOptions): PluginDiscovery
```

---

#### `/src/providers/plugin-loader.ts` - Plugin Loader

**Interfaces:**
```typescript
interface PluginManifest {
  name: string;
  version: string;
  main: string;
  provider: string;
  peerDependencies: Record<string, string>;
  pluginType: 'official' | 'community';
  pluginStatus: 'stable' | 'beta' | 'alpha';
}

interface LoadedPlugin {
  manifest: PluginManifest;
  provider: LegislationProvider;
  loaded: boolean;
  error?: Error;
}
```

**Class: PluginLoader**

| Method | Description |
|--------|-------------|
| `constructor(coreVersion, registry?)` | Initialize with core version |
| `loadPlugin(pluginPath)` | Load single plugin from path |
| `loadPlugins(pluginPaths)` | Load multiple plugins in parallel |
| `discoverPlugins(directory)` | Auto-discover plugins from directory |
| `getPlugin(name)` | Get loaded plugin by name |
| `getLoadedPlugins()` | Get all loaded plugins |
| `getRegistry()` | Get provider registry |
| `getCompatibilityMatrix()` | Get compatibility matrix |
| `unloadPlugin(name)` | Unload plugin |
| `getStatusReport()` | Get plugin status report |
| `isValidProvider(obj)` | Validate provider interface |

**Functions:**
```typescript
getGlobalPluginLoader(coreVersion: string): PluginLoader
formatPluginStatus(report): string
```

---

### Utility Modules

#### `/src/utils/index.ts` - Utilities Index

Re-exports all utility modules for convenient access.

---

#### `/src/utils/logger.ts` - Logger

**Class: Logger**

| Method | Description |
|--------|-------------|
| `constructor(verbose?, quiet?)` | Initialize logger |
| `setVerbose(verbose)` | Enable/disable verbose mode |
| `setQuiet(quiet)` | Enable/disable quiet mode |
| `setRequestContext(context)` | Set request context for logging |
| `clearRequestContext()` | Clear request context |
| `startTimer(label)` | Start performance timer |
| `endTimer(label, logMessage?)` | End timer and log duration |
| `debug(message, metadata?)` | Log debug message |
| `info(message, metadata?)` | Log info message |
| `warn(message, metadata?)` | Log warning and save to file |
| `error(message, error?, metadata?)` | Log error with stack trace |
| `getLogFile()` | Get current log file path |
| `getLogDir()` | Get log directory path |
| `clearOldLogs(daysToKeep?)` | Delete logs older than specified days |
| `getStats()` | Get logger statistics |

**Exported Instance:**
```typescript
export const logger: Logger
```

---

#### `/src/utils/batch.ts` - Batch Processing

**Types:**
```typescript
type BatchRequestType = 'search' | 'getWork' | 'getVersions' | 'getVersion'
type BatchRequestParams = { search: {...}; getWork: {...}; ... }
type BatchRequest = { id: string; type: BatchRequestType; params: ...; priority?: number }
```

**Interfaces:**
```typescript
interface BatchResult<T> {
  id: string;
  success: boolean;
  data?: T;
  error?: Error;
  cached: boolean;
  duration: number;
}

interface BatchOptions {
  concurrency?: number;
  retryFailed?: boolean;
  maxRetries?: number;
  timeout?: number;
  stopOnError?: boolean;
}

interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  cached: number;
  percent: number;
  estimatedTimeRemaining?: number;
}
```

**Class: BatchExecutor (extends EventEmitter)**

| Method | Description |
|--------|-------------|
| `constructor(options)` | Initialize with batch options |
| `execute(requests)` | Execute batch with concurrency control |
| `executeRequest(request)` | Execute single request with caching |
| `chunkArray(array, size)` | Split array into chunks |
| `calculateETA(startTime, completed, total)` | Calculate estimated time remaining |

**Events:**
- `start` - Batch execution started
- `progress` - Progress update
- `complete` - Batch execution completed

**Helper Functions:**
- `generateCacheKey(request)` - Generate cache key for batch request
- `createBatchFromSearch(results, requestType)` - Create batch from search results
- `createBatchFromIds(ids, requestType)` - Create batch from ID list
- `createBatchFromFile(rows, requestType, idColumn)` - Create batch from file
- `formatBatchResults(results)` - Format batch results with summary
- `saveBatchResults(results, outputPath, format)` - Save results to file

---

#### `/src/utils/streaming.ts` - Streaming Utilities

**Interface:**
```typescript
interface StreamExportOptions {
  query: string;
  outputPath: string;
  format: 'csv' | 'json' | 'ndjson';
  includeMetadata?: boolean;
  batchSize?: number;
  maxResults?: number;
  concurrency?: number;
}

interface StreamProgress {
  processed: number;
  total?: number;
  bytesWritten: number;
  percent: number;
  estimatedTimeRemaining?: number;
}
```

**Class: StreamExporter**

| Method | Description |
|--------|-------------|
| `constructor(options)` | Initialize stream exporter |
| `export(params, onProgress?)` | Export search results with streaming |
| `exportWorkDetails(workIds, outputPath, format?, onProgress?)` | Stream work details |
| `abort()` | Abort streaming export |
| `writeCsvHeader()` | Write CSV header |
| `writeWork(work, isFirst)` | Write work to stream |
| `formatCsvRow(work)` | Format work as CSV row |
| `writeMetadata(params, totalResults)` | Write metadata |
| `closeStream()` | Close write stream |
| `calculateETA(startTime, processed)` | Calculate ETA |

**Functions:**
```typescript
createPaginatedStream(params, options?): Readable
```

---

#### `/src/utils/validation.ts` - Input Validation

**Schemas:**

| Schema | Description |
|--------|-------------|
| `DateStringSchema` | YYYY-MM-DD date validation |
| `WorkIdSchema` | Work ID format validation |
| `SearchQuerySchema` | Search query validation |
| `LegislationTypeSchema` | Type enum validation |
| `LegislationStatusSchema` | Status enum validation |
| `OutputFormatSchema` | Output format validation |
| `LimitSchema` | Pagination limit validation |
| `OffsetSchema` - Pagination offset validation |
| `SearchParamsSchema` | Complete search params validation |
| `GetWorkParamsSchema` | Get work params validation |
| `CitationStyleSchema` | Citation style validation |
| `ExportParamsSchema` | Export params validation |
| `ConfigKeySchema` | Config key validation |
| `ApiUrlSchema` | HTTPS URL validation |
| `TimeoutSchema` | Timeout validation (1s-5min) |

**Interfaces:**
```typescript
interface ValidationError {
  field: string;
  message: string;
  value?: unknown;
}

interface ValidatedSearchParams {
  query: string;
  type?: 'act' | 'bill' | 'regulation' | 'instrument';
  status?: 'in-force' | 'not-yet-in-force' | 'repealed' | 'partially-repealed' | 'withdrawn';
  from?: string;
  to?: string;
  limit: number;
  offset: number;
  format: 'table' | 'json' | 'csv';
}
```

**Functions:**

| Function | Description |
|----------|-------------|
| `validateInput(schema, data)` | Validate against schema, return formatted errors |
| `sanitizeInput(input)` | Sanitize string to prevent injection |
| `validateSearchParams(params)` | Validate search parameters |
| `validateWorkId(workId)` | Validate work ID |
| `validateExportParams(params)` | Validate export parameters |

---

#### `/src/utils/secure-config.ts` - Secure Configuration

**Functions:**

| Function | Description |
|----------|-------------|
| `ensureSecureConfigDir()` | Create config dir with 0o700 permissions |
| `verifyConfigFilePermissions()` | Verify config file has 0o600 permissions |
| `saveSecureConfig(config)` | Save config with secure permissions |
| `loadSecureConfig()` | Load config from secure file |
| `validateApiKeyFormat(apiKey)` | Validate API key format |
| `maskApiKey(apiKey)` | Mask API key for display |
| `isSharedSystem()` | Check if running on shared system |
| `getConfigSecurityRecommendations()` | Get security recommendations |
| `getConfigFilePath()` | Get config file path |
| `getConfigDirPath()` | Get config directory path |

**Security Features:**
- Config directory: 0o700 (owner only)
- Config file: 0o600 (owner read/write only)
- API key validation (min 16 chars, no placeholders)

---

#### `/src/utils/env-loader.ts` - Environment Variables

**Schema:**
```typescript
const envSchema = z.object({
  NZ_LEGISLATION_API_KEY: z.string().optional(),
  NZ_LEGISLATION_BASE_URL: z.string().url().optional(),
  NZ_LEGISLATION_TIMEOUT: z.string().regex(/^\d+$/).transform(...).optional(),
  NZ_LEGISLATION_VERBOSE: z.string().transform(...).optional(),
});
```

**Functions:**

| Function | Description |
|----------|-------------|
| `loadEnvConfig()` | Parse and validate environment variables |
| `hasRequiredEnvVars()` | Check if API key is configured |
| `getEnvValidationStatus()` | Get validation status |

---

#### `/src/utils/rate-limiter.ts` - Rate Limiting

**Interfaces:**
```typescript
interface RateLimitOptions {
  requests: number;
  per: number; // seconds
}

interface RateLimitStatus {
  remaining: number;
  limit: number;
  resetTime: Date;
  retryAfter?: number;
}
```

**Class: RateLimiter**

| Method | Description |
|--------|-------------|
| `constructor(options)` | Initialize with rate limit options |
| `throttle()` | Wait until rate limit allows |
| `getStatus()` | Get current rate limit status |
| `getRemainingRequests()` | Get remaining requests |
| `getResetTime()` | Get reset time |
| `refillTokens()` | Refill tokens based on elapsed time |
| `processQueue()` | Process waiting requests |
| `getWaitTime()` | Get wait time in ms |
| `reset()` | Reset rate limiter |
| `static fromString(spec)` | Create from string (e.g., "30 per minute") |

**Class: RateLimiterRegistry**

| Method | Description |
|--------|-------------|
| `get(jurisdiction)` | Get/create rate limiter for jurisdiction |
| `set(jurisdiction, limiter)` | Set custom rate limiter |
| `getAllStatus()` | Get status for all jurisdictions |
| `resetAll()` | Reset all limiters |
| `createDefaultLimiter(jurisdiction)` | Create default limiter |

**Default Rate Limits:**
- NZ: 100/minute
- AU-QLD: 30/minute
- AU-COMM: 50/minute
- AU-NSW/VIC: 40/minute
- AU-SA/WA: 30/minute
- AU-TAS/NT: 20/minute
- AU-ACT: 30/minute

**Decorator:**
```typescript
@rateLimited(jurisdiction: string)
```

**Functions:**
```typescript
formatRateLimitStatus(status: RateLimitStatus): string
```

---

#### `/src/utils/health-monitor.ts` - Health Monitoring

**Interfaces:**
```typescript
interface HealthStatus {
  healthy: boolean;
  jurisdiction: string;
  lastSuccessfulScrape: Date | null;
  lastCheck: Date;
  successRate: number;
  averageResponseTime: number;
  fallbackActive: boolean;
  consecutiveFailures: number;
  errorMessage?: string;
}

interface HealthDashboard {
  providers: HealthStatus[];
  overallHealthy: boolean;
  lastUpdated: Date;
}

type HealthAlertCallback = (jurisdiction: string, status: HealthStatus) => void;
```

**Class: HealthMonitor**

| Method | Description |
|--------|-------------|
| `constructor(options?)` | Initialize with monitoring options |
| `register(provider)` | Register provider for monitoring |
| `check(provider)` | Check health of provider |
| `startMonitoring(provider)` | Start continuous monitoring |
| `recordSuccess(jurisdiction, responseTime)` | Record successful check |
| `recordFailure(jurisdiction, errorMessage)` | Record failed check |
| `getHealthStatus(jurisdiction)` | Get current health status |
| `getDashboard()` | Get dashboard with all providers |
| `onAlert(callback)` | Register alert callback |
| `triggerAlert(jurisdiction)` | Trigger alerts |
| `unregister(jurisdiction)` | Stop monitoring provider |
| `destroy()` | Stop all monitoring |

**Interface:**
```typescript
interface HealthCheckable {
  getJurisdiction(): string;
  healthCheck(): Promise<void>;
}
```

**Configuration:**
- Default check interval: 1 hour
- Unhealthy threshold: 3 consecutive failures
- Data retention: Last 100 data points

**Functions:**
```typescript
formatHealthStatus(status: HealthStatus): string
formatDashboard(dashboard: HealthDashboard): string
```

---

#### `/src/utils/plugin-marketplace.ts` - Plugin Marketplace

**Interfaces:**
```typescript
interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  type: 'official' | 'community';
  status: 'stable' | 'beta' | 'alpha';
  downloads: number;
  rating?: number;
  repository?: string;
}

interface PluginManifest {
  name: string;
  version: string;
  description: string;
  main: string;
  author: string;
  license: string;
  peerDependencies: Record<string, string>;
  pluginType: 'official' | 'community';
  pluginStatus: 'stable' | 'beta' | 'alpha';
}
```

**Class: PluginMarketplace**

| Method | Description |
|--------|-------------|
| `constructor(registryUrl?)` | Initialize with registry URL |
| `list(filter?)` | List available plugins |
| `install(name, version?)` | Install plugin |
| `uninstall(name)` | Uninstall plugin |
| `update(name)` | Update plugin |
| `getInstalled()` | Get installed plugins |
| `registerPlugin(manifest)` | Register installed plugin |
| `search(query)` | Search plugins |
| `getDetails(name)` | Get plugin details |
| `submit(manifest)` | Submit community plugin |

**Functions:**
```typescript
formatPluginList(plugins: PluginInfo[]): string
getGlobalMarketplace(): PluginMarketplace
```

---

#### `/src/utils/compatibility-matrix.ts` - Compatibility Matrix

**Interfaces:**
```typescript
interface VersionRange {
  min?: string;
  max?: string;
  exact?: string;
}

interface CompatibilityInfo {
  plugin: string;
  version: string;
  coreVersion: VersionRange;
  compatible: boolean;
  notes?: string;
}

interface PluginCompatibility {
  name: string;
  version: string;
  requires: {
    core: string;
    plugins?: Record<string, string>;
  };
  provides?: string[];
}
```

**Class: CompatibilityMatrix**

| Method | Description |
|--------|-------------|
| `constructor(coreVersion)` | Initialize with core version |
| `register(info)` | Register plugin compatibility |
| `check(plugin, version)` | Check if plugin is compatible |
| `getCompatiblePlugins()` | Get compatible plugins |
| `getIncompatiblePlugins()` | Get incompatible plugins |
| `warnOnIncompatibility(plugin, version)` | Warn on incompatibility |
| `getReport()` | Get compatibility report |
| `parseVersionRange(range)` | Parse version range string |
| `isVersionCompatible(version, range)` | Check version compatibility |
| `compareVersions(a, b)` | Compare version arrays |
| `getCompatibilityNotes(range)` | Get compatibility notes |
| `formatReport()` | Format report for CLI |

**Functions:**
```typescript
checkPluginCompatibility(plugin, version, coreVersion): Promise<{ compatible: boolean; message: string }>
```

---

#### `/src/utils/analytics.ts` - Analytics Collector

**Interfaces:**
```typescript
interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
}

interface AnalyticsConfig {
  enabled: boolean;
  anonymous: boolean;
  endpoint?: string;
}
```

**Class: AnalyticsCollector**

| Method | Description |
|--------|-------------|
| `constructor(config)` | Initialize with config |
| `track(event)` | Track an event |
| `trackCommand(command, duration, success)` | Track command usage |
| `trackSearch(jurisdiction, query, resultCount, duration)` | Track search |
| `trackPlugin(plugin, action, duration)` | Track plugin usage |
| `trackError(error, jurisdiction?)` | Track error |
| `enable()` | Enable analytics |
| `disable()` | Disable analytics |
| `flush()` | Flush queue to server |
| `getConfig()` | Get current config |
| `getQueueLength()` | Get queue length |
| `startAutoFlush()` | Start auto-flush interval |
| `anonymize(properties)` | Anonymize properties |
| `generateSessionId()` | Generate session ID |
| `destroy()` | Destroy collector |

**Configuration:**
- Auto-flush interval: 1 minute
- Queue flush threshold: 10 events
- Anonymous mode: Removes PII fields

**Functions:**
```typescript
createAnalytics(config: AnalyticsConfig): AnalyticsCollector
formatAnalyticsStatus(config: AnalyticsConfig): string
promptEnableAnalytics(): void
```

---

### Additional Utility Modules

#### `/src/utils/parallel-executor.ts` - Parallel Execution
(Referenced in index.ts, implementation details in source)

#### `/src/utils/fallback-strategy.ts` - Fallback Strategy
(Referenced in index.ts, implementation details in source)

#### `/src/utils/performance-budget.ts` - Performance Budget
(Referenced in index.ts, implementation details in source)

#### `/src/utils/scraper-cache.ts` - Scraper Cache
(Referenced in index.ts, implementation details in source)

---

## Dependencies Between Modules

### Core Dependency Graph

```
cli.ts
├── commands/* (all command modules)
├── config.ts
│   ├── utils/logger.ts
│   ├── utils/env-loader.ts
│   └── utils/secure-config.ts
├── errors.ts
└── utils/logger.ts

client.ts
├── config.ts
├── errors.ts
├── models/index.ts
└── utils/logger.ts

mcp/server.ts
├── client.ts
├── config.ts
├── output/index.ts
└── utils/logger.ts

commands/search.ts
├── client.ts
├── output/index.ts
├── utils/logger.ts
└── utils/validation.ts

commands/get.ts
├── client.ts
├── output/index.ts
├── utils/logger.ts
└── utils/validation.ts

commands/batch.ts
└── utils/batch.ts

commands/stream.ts
└── utils/streaming.ts

commands/plugin.ts
├── providers/plugin-loader.ts
├── providers/plugin-discovery.ts
└── utils/plugin-marketplace.ts

providers/legislation-provider.ts
├── utils/health-monitor.ts
├── utils/scraper-cache.ts
└── utils/rate-limiter.ts

providers/plugin-loader.ts
├── providers/legislation-provider.ts
├── utils/compatibility-matrix.ts
└── utils/plugin-marketplace.ts
```

### Import Aliases

The project uses TypeScript path aliases:
- `@config` → `./config`
- `@errors` → `./errors`
- `@models` → `./models`
- `@output` → `./output`
- `@utils/*` → `./utils/*`
- `@providers/*` → `./providers/*`
- `@commands/*` → `./commands/*`

---

## Plugin Architecture

### Plugin Structure

```
plugins/
├── commonwealth/
│   ├── CommonwealthProvider.ts
│   ├── package.json
│   ├── README.md
│   └── tsconfig.json
└── queensland/
    ├── QueenslandProvider.ts
    ├── package.json
    ├── README.md
    └── tsconfig.json
```

### Plugin Manifest Format

```typescript
{
  name: '@nz-legislation/queensland',
  version: '1.0.0',
  main: 'dist/QueenslandProvider.js',
  provider: 'QueenslandProvider',
  peerDependencies: {
    'nz-legislation-tool': '^2.0.0',
  },
  pluginType: 'official' | 'community',
  pluginStatus: 'stable' | 'beta' | 'alpha',
}
```

### Plugin Lifecycle

1. **Discovery** - `PluginDiscovery.discover()` scans plugin directories
2. **Loading** - `PluginLoader.loadPlugin()` imports and validates
3. **Compatibility Check** - `CompatibilityMatrix.check()` verifies version
4. **Registration** - `ProviderRegistry.register()` adds to registry
5. **Health Monitoring** - `HealthMonitor.register()` starts monitoring

### Plugin Interface Requirements

All plugins must implement `LegislationProvider`:

```typescript
interface LegislationProvider extends HealthCheckable {
  getJurisdiction(): string;
  getDisplayName(): string;
  search(params: SearchParams): Promise<SearchResults>;
  getWork(workId: string): Promise<Work>;
  getVersions(workId: string): Promise<VersionSummary[]>;
  getVersion(versionId: string): Promise<Work>;
  getCitation(work: Work, style: CitationStyle): string;
  healthCheck(): Promise<void>;
}
```

### Base Class Benefits

`BaseLegislationProvider` provides:
- Automatic caching (ScraperCache)
- Rate limiting (RateLimiter)
- Health monitoring integration
- Default citation generators (NZMJ, APA, OSCOLA, Australian)
- Common configuration

---

## CLI Commands Summary

| Command | Description | Key Options |
|---------|-------------|-------------|
| `search` | Search legislation | `-q, --query, --type, --status, --from, --to, --limit, --format` |
| `get` | Get work by ID | `--versions, --format` |
| `export` | Export to file | `-q, -o, --type, --status, --from, --to, --format, --include-metadata` |
| `stream` | Stream large exports | `-q, -o, --format, --batch-size, --concurrency, --no-metadata` |
| `batch` | Bulk operations | `-f, -i, -t, -o, --format, --concurrency, --retry` |
| `cite` | Generate citation | `-s, --style, --copy` |
| `config` | Configuration | `--show, --key, --clear` |
| `cache` | Cache management | `--clear, --pattern, --stats` |
| `plugin` | Plugin management | `list, discover, install, uninstall, update, status` |
| `generate` | Code generation | `command, model, test, docs` |
| `help-interactive` | Interactive help | Menu navigation |
| `help-context` | Contextual help | `auth, rate-limit, network, export, cite` |

---

## MCP Tools Summary

| Tool | Description | Parameters |
|------|-------------|------------|
| `search_legislation` | Search NZ legislation | query, type, status, from, to, limit |
| `get_legislation` | Get work by ID | workId |
| `get_legislation_versions` | Get versions | workId |
| `generate_citation` | Generate citation | workId, style |
| `export_legislation` | Export results | query, format, limit |
| `get_config` | Get config status | (none) |

**Resource Template:**
- `legislation://{workId}` - Returns work JSON

---

## Testing Infrastructure

### Test Utilities

- `setHttpClientFactoryForTesting()` - Mock HTTP client
- `resetCacheMetrics()` - Reset cache for tests
- `validateInput()` - Schema validation helper

### Error Testing

Each error type has specific exit codes and suggestions for testing error scenarios.

---

## Performance Considerations

### Caching Strategy

- **Search Results:** 30 minutes TTL
- **Work Details:** 2 hours TTL
- **Versions:** 1 hour TTL
- **LRU Cache:** 500 entries max

### Rate Limiting

- **Daily Limit:** 10,000 requests
- **Burst Limit:** 2,000 requests per 5 minutes
- **Token Bucket:** Smooths request distribution

### Batch Processing

- **Default Concurrency:** 5 requests
- **Configurable:** 1-100 concurrent
- **Retry Logic:** Exponential backoff (1s, 2s, 4s)
- **Timeout:** 30 seconds per request

### Streaming

- **Batch Size:** 100 items per batch
- **Memory:** 64KB write buffer
- **Concurrency:** 3 concurrent API calls

---

## Security Features

1. **Secure Config Storage**
   - Directory: 0o700 permissions
   - File: 0o600 permissions
   - API key validation

2. **Input Sanitization**
   - HTML tag removal
   - Quote escaping
   - Length limits

3. **HTTPS Enforcement**
   - API URL must use HTTPS
   - Certificate validation

4. **Error Handling**
   - Stack traces logged to file only
   - User-friendly messages
   - No sensitive data in errors

---

## File Paths Reference

### Configuration
- Config file: `~/.nz-legislation-tool/config.json`
- Log directory: `~/.nz-legislation-tool/logs/`
- Log file: `~/.nz-legislation-tool/logs/error-YYYY-MM-DD.log`

### Plugins
- Global (Windows): `%APPDATA%\npm\node_modules`, `%LOCALAPPDATA%\nz-legislation-tool\plugins`
- Global (Unix): `/usr/local/lib/node_modules`, `~/.npm/lib/node_modules`, `~/.nz-legislation-tool/plugins`
- Local: `./node_modules`, `./plugins`

---

**End of Function Mapping**
