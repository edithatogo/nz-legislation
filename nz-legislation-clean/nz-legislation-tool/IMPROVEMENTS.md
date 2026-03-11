# NZ Legislation Tool - Production Improvements

## Summary

Implemented **critical production-readiness improvements** for the NZ Legislation CLI tool:

1. ✅ **CI/CD Pipeline** (GitHub Actions)
2. ✅ **Test Suite** (Vitest)
3. ✅ **Error Logging** (File-based)
4. ✅ **Version Management** (Update checks)
5. ✅ **Configurable Rate Limits** (With safety margins)

---

## 1. CI/CD Pipeline ✅

**File:** `.github/workflows/ci.yml`

### Features:
- **Automated Testing** on every push/PR
- **Linting & Type Checking** before merge
- **Automated Builds** with artifact storage
- **Automated Publishing** to npm on version tag
- **GitHub Releases** auto-created

### Workflows:
```yaml
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  lint:      # ESLint + TypeScript type check
  test:      # Vitest tests with coverage
  build:     # Build dist/ artifacts
  publish:   # Publish to npm + GitHub release
```

### Usage:
```bash
# Tests run automatically on push/PR
# To publish: git tag v1.0.0 && git push --tags
# Or: npm version patch && git push --follow-tags
```

---

## 2. Test Suite ✅

**Framework:** Vitest (Vite-based test runner)

### Test Files:
- `tests/output.test.ts` - Output formatter tests (8 tests)
- `tests/client.test.ts` - Rate limiting tests (2 tests)

### Test Coverage:
- **Output Formatters:** CSV, Citations (NZMJ, BibTeX, RIS, APA)
- **Rate Limiting:** Status tracking
- **Total:** 10 tests, all passing ✅

### Commands:
```bash
npm test              # Run tests in watch mode
npm run test:run      # Run tests once
npm run test:coverage # Run with coverage report
```

### Coverage Reports:
- Text summary in console
- HTML report in `coverage/index.html`
- LCOV for Codecov integration

---

## 3. Error Logging ✅

**File:** `src/utils/logger.ts`

### Features:
- **File-based logging** to `~/.nz-legislation-tool/logs/`
- **Daily log files** (error-YYYY-MM-DD.log)
- **Log levels:** debug, info, warn, error
- **Automatic cleanup** of logs older than 7 days
- **Verbose mode** via `--verbose` flag

### Usage:
```typescript
import { logger } from './utils/logger.js';

logger.debug('Debug info', data);
logger.info('User performed action');
logger.warn('API key missing');
logger.error('Request failed', error);
```

### Log File Location:
- **Windows:** `C:\Users\<user>\.nz-legislation-tool\logs\`
- **macOS/Linux:** `~/.nz-legislation-tool/logs/`

### Verbose Mode:
```bash
nzlegislation search --query "health" --verbose
# Shows debug logs in console
```

---

## 4. Version Management ✅

**File:** `src/utils/version.ts`

### Features:
- **Automatic update checks** on search command
- **Non-blocking** (doesn't slow down execution)
- **Friendly update notification** with install command
- **Version displayed** in `--version` flag

### Update Check:
```
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║  ⚠️  New version available!                               ║
║                                                           ║
║  Current: 1.0.0        Latest:   1.1.0                   ║
║                                                           ║
║  Run: npm install -g nz-legislation-tool                  ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
```

### Commands:
```bash
nzlegislation --version  # Shows: nz-legislation-tool v1.0.0
```

---

## 5. Configurable Rate Limits ✅

**Files:** `src/config.ts`, `src/commands/config.ts`, `src/client.ts`

### Configuration Options:
```bash
# View current limits
nzlegislation config --show

# Set custom daily limit
nzlegislation config --daily-limit 5000

# Set burst limit
nzlegislation config --burst-limit 1000

# Set safety margin (0-1)
nzlegislation config --safety-margin 0.2  # 20% buffer
```

### Default Values:
- **Daily Limit:** 10,000 requests/day (API default)
- **Burst Limit:** 2,000 requests/5min (API default)
- **Safety Margin:** 10% (stays under limits)
- **Effective Limits:** 9,000/day, 1,800/5min

### Use Cases:
| Scenario | Configuration |
|----------|---------------|
| **Casual user** | `--daily-limit 1000 --safety-margin 0.2` |
| **Power user** | `--daily-limit 10000 --safety-margin 0.05` |
| **Shared key** | `--daily-limit 2000 --burst-limit 500` |
| **Batch processing** | `--daily-limit 10000 --safety-margin 0.0` |

### Display:
```
Rate Limits:
  Daily Limit: 10,000 requests/day
  Burst Limit: 2,000 requests/5min
  Safety Margin: 10%
  Effective Daily: 9,000 requests/day
  Effective Burst: 1,800 requests/5min
```

---

## Additional Improvements

### Package.json Scripts:
```json
{
  "scripts": {
    "dev": "tsx src/cli.ts",
    "build": "tsc",
    "start": "node dist/cli.js",
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage",
    "lint": "eslint src/",
    "typecheck": "tsc --noEmit"
  }
}
```

### New Dependencies:
```json
{
  "devDependencies": {
    "vitest": "^2.1.9"
  }
}
```

### New Files Created:
```
nz-legislation-tool/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── tests/
│   ├── output.test.ts          # Output formatter tests
│   └── client.test.ts          # Rate limit tests
├── src/
│   └── utils/
│       ├── logger.ts           # Error logging utility
│       └── version.ts          # Version management
└── vitest.config.ts            # Vitest configuration
```

---

## Testing Results

```
 RUN  v2.1.9
 ✓ tests/client.test.ts (2)
 ✓ tests/output.test.ts (8)

 Test Files  2 passed (2)
      Tests  10 passed (10)
   Duration  2.07s
```

**All tests passing!** ✅

---

## Next Steps (Optional)

### Recommended Future Improvements:
1. **Shell Completions** - Tab completion for bash/zsh/fish
2. **Interactive Prompts** - Guided setup for new users
3. **Progress Bars** - For large exports
4. **Query History** - Saved searches for reproducibility
5. **Batch Operations** - Run multiple queries from file
6. **Docker Support** - Containerized deployment
7. **GitHub Releases** - Pre-built binaries for Windows/macOS/Linux

### Priority Matrix:
| Feature | Effort | Impact | Priority |
|---------|--------|--------|----------|
| Shell Completions | 1h | Medium | 🟡 P1 |
| Interactive Prompts | 2h | Medium | 🟡 P1 |
| Progress Bars | 1h | Low | 🟢 P2 |
| Query History | 2h | Low | 🟢 P2 |
| Docker Support | 2h | Low | 🟢 P2 |

---

## Production Readiness Checklist

- [x] Automated testing
- [x] CI/CD pipeline
- [x] Error logging
- [x] Version management
- [x] Configurable rate limits
- [x] Quality gates (lint, typecheck)
- [x] Automated publishing
- [ ] Shell completions (optional)
- [ ] Interactive prompts (optional)
- [ ] Docker support (optional)

**Status:** ✅ **Production Ready**

---

## Usage Examples

### Run Tests:
```bash
npm test
npm run test:coverage
```

### Configure Rate Limits:
```bash
nzlegislation config --daily-limit 5000
nzlegislation config --burst-limit 1000
nzlegislation config --safety-margin 0.15
```

### View Logs:
```bash
# Windows
notepad %USERPROFILE%\.nz-legislation-tool\logs\error-2026-03-08.log

# macOS/Linux
cat ~/.nz-legislation-tool/logs/error-2026-03-08.log
```

### Enable Verbose Mode:
```bash
nzlegislation search --query "health" --verbose
```

---

**Implementation Date:** 2026-03-08  
**Status:** ✅ Complete  
**Tests:** 10/10 Passing  
**CI/CD:** ✅ Configured
