/**
 * MCP Server for NZ Legislation Tool
 * Provides AI assistants with tools to interact with NZ Legislation API
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { searchWorks, getWork, getWorkVersions } from '../client.js';
import { getConfig, hasApiKey } from '../config.js';
import { generateCitation, worksToCsv } from '../output/index.js';
import { logger } from '../utils/logger.js';

/**
 * MCP request tracking for rate limiting and audit
 */
let mcpRequestCount = 0;
const MCP_DAILY_LIMIT = 9000; // Respect API limits with 10% safety margin

/**
 * Helper to check and increment MCP request count
 */
function checkMcpRateLimit(): boolean {
  if (mcpRequestCount >= MCP_DAILY_LIMIT) {
    logger.warn('MCP rate limit exceeded', { count: mcpRequestCount });
    return false;
  }
  mcpRequestCount++;
  return true;
}

/**
 * Create MCP server instance
 */
export function createServer(): McpServer {
  const server = new McpServer({
    name: 'nz-legislation',
    version: '1.0.0',
  });

  // Register tools
  registerSearchTool(server);
  registerGetTool(server);
  registerGetVersionsTool(server);
  registerCitationTool(server);
  registerExportTool(server);
  registerConfigTool(server);

  // Register resources
  registerLegislationResource(server);

  return server;
}

/**
 * Search legislation tool
 */
function registerSearchTool(server: McpServer): void {
  server.tool(
    'search_legislation',
    'Search for New Zealand legislation by query',
    {
      query: z.string().describe('Search query text'),
      type: z
        .enum(['act', 'bill', 'regulation', 'instrument'])
        .optional()
        .describe('Filter by legislation type'),
      status: z.string().optional().describe('Filter by status (e.g., in-force, repealed)'),
      from: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .transform(val => {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
          }
          return val;
        })
        .optional()
        .describe('Filter from date (YYYY-MM-DD)'),
      to: z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/)
        .transform(val => {
          const date = new Date(val);
          if (isNaN(date.getTime())) {
            throw new Error('Invalid date format');
          }
          return val;
        })
        .optional()
        .describe('Filter to date (YYYY-MM-DD)'),
      limit: z.number().min(1).max(100).default(25).describe('Maximum results (1-100)'),
    },
    async params => {
      try {
        // Check MCP rate limit
        if (!checkMcpRateLimit()) {
          return {
            content: [
              {
                type: 'text',
                text: 'MCP rate limit exceeded. Please try again later.',
                isError: true,
              },
            ],
          };
        }

        const results = await searchWorks({
          query: params.query,
          type: params.type,
          status: params.status,
          from: params.from,
          to: params.to,
          limit: params.limit,
        });

        return {
          content: [
            {
              type: 'text',
              text:
                `Found ${results.total} results (showing ${results.results.length}):\n\n` +
                results.results
                  .map(
                    work =>
                      `• **${work.title}** (${work.type}, ${work.status})\n  ID: ${work.id}\n  Date: ${work.date}`
                  )
                  .join('\n\n'),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Search failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
              isError: true,
            },
          ],
        };
      }
    }
  );
}

/**
 * Get legislation by ID tool
 */
function registerGetTool(server: McpServer): void {
  server.tool(
    'get_legislation',
    'Get details of a specific legislation work by ID',
    {
      workId: z.string().describe('Work ID (e.g., act_public_1989_18)'),
    },
    async params => {
      try {
        // Check MCP rate limit
        if (!checkMcpRateLimit()) {
          return {
            content: [
              {
                type: 'text',
                text: 'MCP rate limit exceeded. Please try again later.',
                isError: true,
              },
            ],
          };
        }

        const work = await getWork(params.workId);

        return {
          content: [
            {
              type: 'text',
              text:
                `**${work.title}**\n\n` +
                `• **ID:** ${work.id}\n` +
                `• **Type:** ${work.type}\n` +
                `• **Status:** ${work.status}\n` +
                `• **Date:** ${work.date}\n` +
                `• **Versions:** ${work.versionCount}\n` +
                `• **URL:** ${work.url}` +
                (work.shortTitle ? `\n• **Short Title:** ${work.shortTitle}` : ''),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get legislation: ${error instanceof Error ? error.message : 'Unknown error'}`,
              isError: true,
            },
          ],
        };
      }
    }
  );
}

/**
 * Get legislation versions tool
 */
function registerGetVersionsTool(server: McpServer): void {
  server.tool(
    'get_legislation_versions',
    'Get all versions of a specific legislation work',
    {
      workId: z.string().describe('Work ID (e.g., act_public_1989_18)'),
    },
    async params => {
      try {
        // Check MCP rate limit
        if (!checkMcpRateLimit()) {
          return {
            content: [
              {
                type: 'text',
                text: 'MCP rate limit exceeded. Please try again later.',
                isError: true,
              },
            ],
          };
        }

        const versions = await getWorkVersions(params.workId);

        return {
          content: [
            {
              type: 'text',
              text:
                `**Versions for ${params.workId}** (${versions.length} versions):\n\n` +
                versions
                  .map(
                    v =>
                      `• **Version ${v.version}** (${v.type})\n  ` +
                      `Date: ${v.date} | ` +
                      `Current: ${v.isCurrent ? 'Yes' : 'No'}\n  ` +
                      `Formats: ${v.formats.join(', ')}`
                  )
                  .join('\n\n'),
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get versions: ${error instanceof Error ? error.message : 'Unknown error'}`,
              isError: true,
            },
          ],
        };
      }
    }
  );
}

/**
 * Generate citation tool
 */
function registerCitationTool(server: McpServer): void {
  server.tool(
    'generate_citation',
    'Generate citation for legislation in various styles',
    {
      workId: z.string().describe('Work ID (e.g., act_public_1989_18)'),
      style: z
        .enum(['nzmj', 'bibtex', 'ris', 'enw', 'apa'])
        .default('nzmj')
        .describe('Citation style'),
    },
    async params => {
      try {
        // Check MCP rate limit
        if (!checkMcpRateLimit()) {
          return {
            content: [
              {
                type: 'text',
                text: 'MCP rate limit exceeded. Please try again later.',
                isError: true,
              },
            ],
          };
        }

        const work = await getWork(params.workId);
        const citation = generateCitation(work, params.style);

        return {
          content: [
            {
              type: 'text',
              text: `**${params.style.toUpperCase()} Citation:**\n\n${citation}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to generate citation: ${error instanceof Error ? error.message : 'Unknown error'}`,
              isError: true,
            },
          ],
        };
      }
    }
  );
}

/**
 * Export legislation data tool
 */
function registerExportTool(server: McpServer): void {
  server.tool(
    'export_legislation',
    'Export legislation search results to CSV or JSON format',
    {
      query: z.string().describe('Search query'),
      format: z.enum(['csv', 'json']).default('csv').describe('Export format'),
      limit: z.number().min(1).max(100).default(25).describe('Maximum results'),
    },
    async params => {
      try {
        // Check MCP rate limit
        if (!checkMcpRateLimit()) {
          return {
            content: [
              {
                type: 'text',
                text: 'MCP rate limit exceeded. Please try again later.',
                isError: true,
              },
            ],
          };
        }

        const results = await searchWorks({
          query: params.query,
          limit: params.limit,
        });

        if (params.format === 'json') {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify(results, null, 2),
              },
            ],
          };
        } else {
          const csv = worksToCsv(results);
          return {
            content: [
              {
                type: 'text',
                text: `**CSV Export** (${results.results.length} results)\nHeaders: id, title, shortTitle, type, status, date, url, versionCount\n\n\`\`\`csv\n${csv}\n\`\`\``,
              },
            ],
          };
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Export failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
              isError: true,
            },
          ],
        };
      }
    }
  );
}

/**
 * Get configuration tool
 */
function registerConfigTool(server: McpServer): void {
  server.tool(
    'get_config',
    'Get current API configuration status',
    {},
    // eslint-disable-next-line @typescript-eslint/require-await
    async () => {
      try {
        const config = getConfig();
        const hasKey = hasApiKey();

        return {
          content: [
            {
              type: 'text',
              text:
                '**NZ Legislation API Configuration:**\n\n' +
                `• **API Key:** ${hasKey ? 'Configured ✓' : 'Not configured ✗'}\n` +
                `• **Base URL:** ${config.baseUrl}\n` +
                `• **Timeout:** ${config.timeout}ms\n` +
                `• **Output Format:** ${config.outputFormat}\n` +
                `• **Verbose:** ${config.verbose ? 'Yes' : 'No'}`,
            },
          ],
        };
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Failed to get config: ${error instanceof Error ? error.message : 'Unknown error'}`,
              isError: true,
            },
          ],
        };
      }
    }
  );
}

/**
 * Register legislation resource template
 */
function registerLegislationResource(server: McpServer): void {
  server.resource('legislation', 'legislation://{workId}', async (uri, workId) => {
    if (!workId || typeof workId !== 'string') {
      return {
        contents: [
          {
            uri: uri.href,
            text: 'Error: Work ID required',
            mimeType: 'text/plain',
          },
        ],
      };
    }

    try {
      const work = await getWork(workId);

      return {
        contents: [
          {
            uri: uri.href,
            text: JSON.stringify(work, null, 2),
            mimeType: 'application/json',
          },
        ],
      };
    } catch (error) {
      return {
        contents: [
          {
            uri: uri.href,
            text: `Error: ${error instanceof Error ? error.message : 'Failed to fetch legislation'}`,
            mimeType: 'text/plain',
          },
        ],
      };
    }
  });
}

/**
 * Start MCP server with stdio transport
 */
export async function startServer(): Promise<void> {
  const server = createServer();
  const transport = new StdioServerTransport();

  await server.connect(transport);

  // eslint-disable-next-line no-console
  console.error('NZ Legislation MCP Server running on stdio');
  // eslint-disable-next-line no-console
  console.error(
    'Tools available: search_legislation, get_legislation, get_legislation_versions, generate_citation, export_legislation, get_config'
  );
  // eslint-disable-next-line no-console
  console.error('Resources available: legislation://{workId}');
}
