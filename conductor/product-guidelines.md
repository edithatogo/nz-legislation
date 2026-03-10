# Product Guidelines

## Design Principles

### 1. User-First Experience
- **Zero-install option**: Support `npx` for trial without installation
- **Clear error messages**: Always provide actionable next steps
- **Progressive disclosure**: Simple defaults, advanced options available

### 2. Research-Grade Quality
- **Reproducibility**: All exports include metadata (timestamp, query, API version)
- **Citation support**: Multiple formats (NZMJ, BibTeX, RIS, APA)
- **Audit trail**: Error logging for debugging production issues

### 3. API Respect
- **Rate limiting**: Configurable limits with safety margins
- **Caching**: Reduce redundant API calls
- **Graceful degradation**: Handle API outages gracefully

### 4. TypeScript Excellence
- **Strict type checking**: No `any` types in production code
- **ES Modules**: Modern module system
- **Target Node.js 18+**: Current LTS versions only

---

## Documentation & Communication Standards

### Writing Principles
1. **Conversational**: Write like you're talking to a colleague
2. **Concise**: Use fewer words, say more
3. **Clear**: Avoid jargon, explain technical terms
4. **Complete**: Answer follow-up questions before they're asked
5. **Correct**: Verify all information, test all examples
6. **Considerate**: Respect the reader's time and intelligence

### Documentation Requirements
- **README**: Understandable in <3 minutes, quick start in <10 minutes
- **All CLI commands**: Must have examples with expected output
- **Error messages**: Link to relevant documentation sections
- **Visual diagrams**: Use Mermaid for architecture and workflow diagrams
- **Accessibility**: WCAG 2.1 AA compliance for all documentation

### Multi-Audience Support
- **End Users**: README + User Guide + FAQ + Troubleshooting
- **Researchers**: Research Workflow + Citation Guide + API Reference
- **Developers**: Developer Guide + Architecture + API Reference + Contributing
- **Non-Technical**: Glossary + ELI5 explanations + Learning Paths

### Documentation Deliverables (Completed)
- ✅ 17 documentation files (~78,000 words)
- ✅ 18 Mermaid diagrams
- ✅ FAQ (36 questions)
- ✅ Glossary (26 terms with ELI5)
- ✅ API Reference (11 functions)
- ✅ Error Reference (20+ errors)
- ✅ WCAG 2.1 AA accessibility compliance

---

## Code Style Guidelines

### Naming Conventions
```typescript
// Files: lowercase with hyphens
// ✅ user-config.ts
// ❌ UserConfig.ts, user_config.ts

// Classes: PascalCase
class ApiClient {}

// Functions/variables: camelCase
function searchWorks() {}
const rateLimitState = {}

// Constants: UPPER_SNAKE_CASE
const DEFAULT_TIMEOUT = 30000;

// Types/Interfaces: PascalCase
interface SearchResults {}
type WorkType = 'act' | 'bill';
```

### Error Handling
```typescript
// ✅ Always provide context
throw new Error(`Work "${workId}" not found. Try searching first.`);

// ❌ Generic errors
throw new Error('Not found');

// ✅ Log errors appropriately
logger.error('Request failed', error);
logger.debug('Update check failed', error);
```

### Async/Await
```typescript
// ✅ Use async/await consistently
async function getWork(workId: string): Promise<Work> {
  const response = await client.get(url);
  return parseResponse(response);
}

// ❌ Mixed patterns
function getWork(workId: string) {
  return client.get(url).then(r => parseResponse(r));
}
```

### Testing
```typescript
// ✅ Descriptive test names
describe('Output Formatters', () => {
  it('should generate CSV with correct headers', () => {
    // Test implementation
  });
});

// ✅ Test edge cases
it('should handle empty results', () => {
  // Empty result set test
});
```

---

## Documentation Standards

### README Requirements
1. **Quick Start** (30 seconds to first use)
2. **Installation** (multiple methods)
3. **Commands** (with examples)
4. **Configuration** (all options)
5. **Troubleshooting** (common issues)

### Code Comments
```typescript
/**
 * Get a specific work by ID (searches with pagination)
 * 
 * Strategy:
 * 1. Try searching with work ID as query
 * 2. Paginate through results if not found
 * 
 * @param workId - The work identifier
 * @returns The work details
 * @throws Error if work not found
 */
async function getWork(workId: string): Promise<Work> {
  // Implementation
}
```

### Commit Messages
```
feat: Add new feature
fix: Fix bug in existing feature
docs: Update documentation
test: Add or update tests
refactor: Code refactoring (no behavior change)
chore: Maintenance tasks
```

---

## Security Guidelines

### API Key Handling
```typescript
// ✅ Load from environment or secure config
const apiKey = process.env.NZ_LEGISLATION_API_KEY || config.apiKey;

// ❌ Never hardcode
const apiKey = 'nzlapi3f4dd302e30beef18911'; // NEVER DO THIS
```

### Input Validation
```typescript
// ✅ Validate all inputs with Zod
const configSchema = z.object({
  apiKey: z.string().min(1),
  dailyLimit: z.number().positive(),
});

// ❌ Trust user input
const limit = userInput; // NEVER DO THIS
```

### Logging
```typescript
// ✅ Log errors without sensitive data
logger.error('API request failed', { status: 401 });

// ❌ Log sensitive information
logger.error('Failed with key', apiKey); // NEVER DO THIS
```

---

## Performance Standards

### Response Time Targets
- **CLI startup**: < 500ms
- **Search query**: < 3s (depends on API)
- **Export 100 items**: < 5s

### Memory Usage
- **Idle**: < 50MB
- **Processing**: < 200MB
- **Large exports**: Stream to disk, don't buffer

### Rate Limiting
```typescript
// Default configuration
dailyLimit: 10000,        // API limit
burstLimit: 2000,         // API limit
safetyMargin: 0.1,        // 10% buffer
effectiveDaily: 9000,     // After safety margin
effectiveBurst: 1800,     // After safety margin
```

---

## Accessibility

### CLI Output
- ✅ Color-coded status (green=in-force, red=repealed)
- ✅ Support `--no-color` for screen readers
- ✅ Clear table formatting
- ✅ Machine-readable formats (JSON, CSV)

### Error Messages
- ✅ Actionable next steps
- ✅ Reference to documentation
- ✅ No stack traces in normal mode
- ✅ Verbose mode for debugging

---

**Version:** 1.0.0  
**Last Updated:** 2026-03-08  
**Status:** ✅ Active
