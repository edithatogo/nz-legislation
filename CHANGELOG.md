# nz-legislation-tool

## 1.2.0

### Minor Changes

- Add a stable MCP server surface alongside the CLI.

  This release publishes the `nzlegislation-mcp` entrypoint and the MCP tool layer for search,
  retrieval, export, citation, and configuration workflows without breaking the existing CLI
  interface.

## 1.1.0

### Minor Changes

- 06ead46: # Performance & Scalability Release

  ## New Features
  - Added `nzlegislation batch` command for bulk operations
  - Added `nzlegislation stream` command for streaming large exports
  - Added performance audit script (`npm run bench:audit`)
  - Added bundle analysis script
  - Added load testing infrastructure with k6

  ## Improvements
  - API optimization with connection pooling, retry, and deduplication
  - Performance monitoring dashboard and scorecards
  - CI/CD integration for performance gates
  - Comprehensive documentation for performance metrics

  ## Performance Targets
  - Cache hit rate >80%
  - Bulk operations 10x faster
  - Streaming handles 1GB+ exports
  - API response <500ms p95
  - Memory usage <256MB
