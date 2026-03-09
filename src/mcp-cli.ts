#!/usr/bin/env node
/**
 * MCP Server entry point for NZ Legislation Tool
 * Run with: nzlegislation-mcp
 */

import { startServer } from './mcp/server.js';

// Start the MCP server
startServer().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Failed to start MCP server:', error);
  process.exit(1);
});
