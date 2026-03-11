#!/usr/bin/env node
/**
 * MCP Server entry point for NZ Legislation Tool
 * Run with: nzlegislation-mcp
 */

import { startServer } from './mcp/server.js';
import { logger } from './utils/logger.js';


let serverInstance: unknown = null;

async function shutdown(signal: 'SIGTERM' | 'SIGINT'): Promise<void> {
  logger.info(`MCP server received ${signal}, shutting down gracefully...`);
  if (
    serverInstance &&
    typeof (serverInstance as { close?: () => Promise<void> }).close === 'function'
  ) {
    await (serverInstance as { close: () => Promise<void> }).close();
  }
  logger.info('MCP server shutdown complete');
  process.exit(0);
}

// Start the MCP server
startServer()
  .then(server => {
    serverInstance = server;
  })
  .catch(error => {
    // eslint-disable-next-line no-console
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });

// Graceful shutdown handlers
process.on('SIGTERM', () => {
  void shutdown('SIGTERM');
});

process.on('SIGINT', () => {
  void shutdown('SIGINT');
});
