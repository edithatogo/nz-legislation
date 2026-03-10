#!/usr/bin/env node
/**
 * MCP Server entry point for NZ Legislation Tool
 * Run with: nzlegislation-mcp
 */

import { startServer } from './mcp/server.js';
import { logger } from '@utils/logger';

let serverInstance: unknown = null;

// Start the MCP server
startServer()
  .then((server) => {
    serverInstance = server;
  })
  .catch((error) => {
    // eslint-disable-next-line no-console
    console.error('Failed to start MCP server:', error);
    process.exit(1);
  });

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  logger.info('MCP server received SIGTERM, shutting down gracefully...');
  if (serverInstance && typeof (serverInstance as { close?: () => Promise<void> }).close === 'function') {
    await (serverInstance as { close: () => Promise<void> }).close();
  }
  logger.info('MCP server shutdown complete');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('MCP server received SIGINT, shutting down gracefully...');
  if (serverInstance && typeof (serverInstance as { close?: () => Promise<void> }).close === 'function') {
    await (serverInstance as { close: () => Promise<void> }).close();
  }
  logger.info('MCP server shutdown complete');
  process.exit(0);
});
