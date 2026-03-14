/**
 * Export command - Export search results to file
 */

import { writeFileSync } from 'fs';

import { Command } from 'commander';
import ora from 'ora';

import { searchWorks } from '@client';
import type { CanonicalLegislationRecord } from '@models';
import { worksToCsv } from '@output';

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

export function toCanonicalExportRecords(
  results: Awaited<ReturnType<typeof searchWorks>>
): Array<
  Pick<CanonicalLegislationRecord, 'work' | 'expressions' | 'manifestations' | 'relationships'>
> {
  return results.results.map(work => {
    const canonicalId = `legacy:${work.id}`;
    const workUri = `urn:nz-legislation:work:${work.id.replace(/[^a-zA-Z0-9-]+/g, '-')}`;
    const expressionUri = `${workUri}:expression:current`;
    const manifestationUri = `${expressionUri}:manifestation:html`;

    return {
      work: {
        canonicalId,
        workUri,
        source: {
          sourceSystem: 'legacy-cli-export',
          sourceId: work.id,
          sourceUrl: work.url,
        },
        jurisdictionCode: 'unknown',
        documentType: work.type,
        title: work.title,
        shortTitle: work.shortTitle,
        language: 'en',
      },
      expressions: [
        {
          expressionUri,
          workUri,
          expressionDate: work.date,
          publicationDate: work.date,
          lifecycleState:
            work.status === 'in-force'
              ? 'in-force'
              : work.status === 'repealed'
                ? 'repealed'
                : work.status === 'withdrawn'
                  ? 'withdrawn'
                  : work.status === 'not-yet-in-force'
                    ? 'not-yet-in-force'
                    : 'unknown',
          isCurrent: true,
          versionLabel: 'current',
          language: 'en',
        },
      ],
      manifestations: [
        {
          manifestationUri,
          expressionUri,
          format: 'html',
          mediaType: 'text/html',
          sourceUrl: work.url,
        },
      ],
      relationships: [
        {
          subjectUri: workUri,
          relationshipType: 'has_expression',
          objectUri: expressionUri,
        },
        {
          subjectUri: expressionUri,
          relationshipType: 'has_manifestation',
          objectUri: manifestationUri,
        },
      ],
    };
  });
}

export const exportCommand = new Command()
  .name('export')
  .description('Export search results to file')
  .requiredOption('-q, --query <text>', 'Search query')
  .requiredOption('-o, --output <file>', 'Output file path')
  .option('-t, --type <type>', 'Filter by type (act, bill, regulation, instrument)')
  .option('-s, --status <status>', 'Filter by status')
  .option('--from <date>', 'Filter from date (YYYY-MM-DD)')
  .option('--to <date>', 'Filter to date (YYYY-MM-DD)')
  .option('-l, --limit <number>', 'Maximum results (default: 100)', '100')
  .option('-f, --format <format>', 'Output format (csv, json)', 'csv')
  .option('--include-metadata', 'Include export metadata', false)
  .action(async (options: ExportOptions) => {
    const spinner = ora('Searching and exporting...').start();

    try {
      const limit = Math.min(parseInt(options.limit, 10), 1000);

      const results = await searchWorks({
        query: options.query,
        type: options.type,
        status: options.status,
        from: options.from,
        to: options.to,
        limit,
      });

      spinner.stop();

      let output: string;
      const timestamp = new Date().toISOString();

      if (options.format.toLowerCase() === 'json') {
        // JSON export
        const exportData = options.includeMetadata
          ? {
              metadata: {
                query: options.query,
                filters: {
                  type: options.type,
                  status: options.status,
                  from: options.from,
                  to: options.to,
                },
                timestamp,
                totalResults: results.total,
                exportedCount: results.results.length,
                canonical: {
                  standardProfile: [
                    'Akoma Ntoso concepts',
                    'FRBR work-expression-manifestation',
                    'ELI-style identifiers',
                    'schema.org/Legislation',
                  ],
                  included: true,
                },
              },
              results: results.results,
              canonicalRecords: toCanonicalExportRecords(results),
            }
          : results;
        output = JSON.stringify(exportData, null, 2);
      } else {
        // CSV export (default)
        let csvContent = worksToCsv(results);

        if (options.includeMetadata) {
          // Add metadata as comments at the end
          csvContent += `\n# Export Metadata`;
          csvContent += `\n# Query: ${options.query}`;
          csvContent += `\n# Timestamp: ${timestamp}`;
          csvContent += `\n# Total Results: ${results.total}`;
          csvContent += `\n# Exported: ${results.results.length}`;
          csvContent += `\n# Canonical Metadata: included`;
          csvContent += `\n# Canonical Standards: Akoma Ntoso concepts; FRBR work-expression-manifestation; ELI-style identifiers; schema.org/Legislation`;
          if (options.type) {
            csvContent += `\n# Type: ${options.type}`;
          }
          if (options.status) {
            csvContent += `\n# Status: ${options.status}`;
          }
        }

        output = csvContent;
      }

      // Write to file
      writeFileSync(options.output, output, 'utf-8');

      console.log(`✓ Exported ${results.results.length} results to ${options.output}`);
      console.log(`  Total available: ${results.total}`);

      if (options.includeMetadata) {
        console.log(`  Metadata: included`);
      }
    } catch (error) {
      spinner.stop();
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });
