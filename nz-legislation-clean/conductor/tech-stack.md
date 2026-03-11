# Technology Stack

## Core Technologies

### Runtime
- **Node.js** 18+ (LTS versions: 18, 20, 22)
- **TypeScript** 5.5+
- **ES Modules** (native ESM)

### Package Management
- **npm** 10+
- **pnpm** (alternative, compatible)

---

## Development Stack

### Build Tools
| Tool | Version | Purpose |
|------|---------|---------|
| **TypeScript** | 5.5+ | Type checking, transpilation |
| **tsx** | 4.16+ | Development runtime |
| **esbuild** | Latest | Fast bundling (via tsx) |

### Testing
| Tool | Version | Purpose |
|------|---------|---------|
| **Vitest** | 2.1+ | Test runner |
| **@vitest/coverage-v8** | Latest | Coverage reporting |

### Code Quality
| Tool | Purpose |
|------|---------|
| **ESLint** | Linting (future) |
| **Prettier** | Formatting (future) |

---

## Production Dependencies

### CLI Framework
```json
{
  "commander": "^12.1.0"
}
```
**Why:** Most popular CLI framework, excellent TypeScript support, auto-generates help text.

### HTTP Client
```json
{
  "got": "^14.4.2"
}
```
**Why:** Modern, TypeScript-first, better error handling than axios, supports retries.

### Data Validation
```json
{
  "zod": "^3.23.8"
}
```
**Why:** TypeScript-first schema validation, zero runtime overhead, excellent error messages.

### Output Formatting
```json
{
  "cli-table3": "^0.6.5",
  "chalk": "^5.3.0",
  "ora": "^8.1.0"
}
```
**Why:**
- **cli-table3:** Beautiful terminal tables
- **chalk:** Colored output
- **ora:** Spinners for loading states

### Configuration
```json
{
  "conf": "^13.0.1",
  "dotenv": "^16.4.5"
}
```
**Why:**
- **conf:** Persistent config storage (JSON file)
- **dotenv:** Environment variable loading

---

## Architecture

### Project Structure
```
nz-legislation-tool/
├── src/
│   ├── cli.ts              # Main entry point
│   ├── client.ts           # API client
│   ├── config.ts           # Configuration management
│   ├── commands/           # CLI commands
│   │   ├── search.ts
│   │   ├── get.ts
│   │   ├── export.ts
│   │   ├── cite.ts
│   │   └── config.ts
│   ├── models/             # Data models (Zod schemas)
│   ├── output/             # Output formatters
│   └── utils/              # Utilities
│       ├── logger.ts       # Error logging
│       └── version.ts      # Version management
├── tests/
│   ├── client.test.ts
│   └── output.test.ts
├── .github/workflows/
│   └── ci.yml              # CI/CD pipeline
└── package.json
```

### Module Pattern
```typescript
// ES Modules (package.json: "type": "module")
import { Command } from 'commander';
import type { Work } from './models/index.js';

export async function searchWorks(params: SearchParams): Promise<SearchResults> {
  // Implementation
}
```

### Error Handling Pattern
```typescript
try {
  const result = await apiCall();
  return transform(result);
} catch (error) {
  if (error instanceof Error) {
    logger.error('Operation failed', error);
    throw new Error(`User-friendly message: ${error.message}`);
  }
  throw error;
}
```

---

## API Integration

### NZ Legislation API
- **Base URL:** `https://api.legislation.govt.nz`
- **Version:** v0
- **Authentication:** API key (query parameter)
- **Rate Limits:**
  - 10,000 requests/day
  - 2,000 requests/5min (burst)

### Endpoints Used
```typescript
GET /v0/works?q={query}&limit={limit}  // Search works
```

### Response Handling
```typescript
interface Work {
  work_id: string;
  legislation_type: string;
  legislation_status: string | null;
  latest_matching_version?: {
    title: string;
    version_id: string;
    formats: Array<{ type: string; url: string }>;
  };
}
```

---

## CI/CD Stack

### GitHub Actions
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:       # ESLint + TypeScript
  test:       # Vitest (Node 18, 20, 22)
  build:      # TypeScript compilation
  publish:    # npm publish (on version tag)
```

### Distribution
- **npm Registry:** Public package
- **GitHub Releases:** Auto-created on publish
- **Binaries:** Future (via pkg/ncc)

---

## Development Requirements

### Minimum Node.js Version
```json
{
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### IDE Recommendations
- **VS Code** (recommended)
- **WebStorm** (compatible)
- **Vim/Neovim** (with LSP)

### Required Extensions (VS Code)
- ESLint
- Prettier (future)
- Vitest (test runner)

---

## Future Considerations

### Potential Additions
1. **Shell Completions** - `omelette` or `clipanion`
2. **Interactive Prompts** - `@inquirer/prompts`
3. **Progress Bars** - `cli-progress`
4. **Binary Distribution** - `pkg` or `ncc`
5. **Docker Support** - Multi-stage builds

### Deprecation Policy
- **Node.js:** Support current LTS + previous LTS (18 months)
- **Dependencies:** Keep within 1 major version of latest
- **Breaking Changes:** Semantic versioning, migration guides

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-08  
**Status:** ✅ Active
