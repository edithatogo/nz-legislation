/**
 * Streaming Utilities
 *
 * Provides streaming support for large data exports to minimize memory usage.
 * Allows exporting GBs of data without running out of memory.
 */

import { createWriteStream, WriteStream } from 'fs';
import { Readable } from 'stream';
import { pipeline } from 'stream/promises';

import { searchWorks, getWork } from '@client';
import type { Work } from '@models';

interface SearchParams {
  query: string;
  type?: string;
  status?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

/**
 * Streaming export options
 */
export interface StreamExportOptions {
  query: string;
  outputPath: string;
  format: 'csv' | 'json' | 'ndjson';
  includeMetadata?: boolean;
  batchSize?: number; // Results per batch (default: 100)
  maxResults?: number; // Maximum total results (default: unlimited)
  concurrency?: number; // Concurrent API calls (default: 3)
}

/**
 * Streaming progress event
 */
export interface StreamProgress {
  processed: number;
  total?: number;
  bytesWritten: number;
  percent: number;
  estimatedTimeRemaining?: number;
}

/**
 * Stream exporter with progress tracking
 */
export class StreamExporter {
  private outputPath: string;
  private format: 'csv' | 'json' | 'ndjson';
  private includeMetadata: boolean;
  private batchSize: number;
  private maxResults: number;
  private concurrency: number;
  private writeStream!: WriteStream;
  private bytesWritten = 0;
  private processed = 0;
  private aborted = false;

  constructor(options: StreamExportOptions) {
    this.outputPath = options.outputPath;
    this.format = options.format;
    this.includeMetadata = options.includeMetadata ?? false;
    this.batchSize = options.batchSize ?? 100;
    this.maxResults = options.maxResults ?? Infinity;
    this.concurrency = options.concurrency ?? 3;
  }

  /**
   * Export search results to file using streaming
   */
  async export(
    params: SearchParams,
    onProgress?: (progress: StreamProgress) => void
  ): Promise<{ processed: number; bytesWritten: number }> {
    const startTime = Date.now();

    // Create write stream
    this.writeStream = createWriteStream(this.outputPath, {
      encoding: 'utf-8',
      highWaterMark: 64 * 1024, // 64KB chunks
    });

    try {
      // Write header based on format
      if (this.format === 'csv') {
        this.writeCsvHeader();
      } else if (this.format === 'json') {
        this.writeStream.write('[\n');
      }
      // NDJSON doesn't need a header

      let offset = 0;
      let totalFetched = 0;
      let hasMore = true;

      while (hasMore && !this.aborted) {
        // Fetch batch
        const results = await searchWorks({
          ...params,
          limit: this.batchSize,
          offset,
        });

        if (results.results.length === 0) {
          hasMore = false;
          break;
        }

        // Process and write each result
        for (const work of results.results) {
          if (this.aborted) {
            break;
          }
          if (totalFetched >= this.maxResults) {
            hasMore = false;
            break;
          }

          this.writeWork(work, totalFetched === 0 && this.format === 'json');
          this.processed++;
          totalFetched++;

          // Progress callback
          if (onProgress) {
            onProgress({
              processed: this.processed,
              total: results.total,
              bytesWritten: this.bytesWritten,
              percent: results.total > 0 ? Math.round((this.processed / results.total) * 100) : 0,
              estimatedTimeRemaining: this.calculateETA(startTime, this.processed),
            });
          }
        }

        offset += this.batchSize;
      }

      // Write footer based on format
      if (this.format === 'json') {
        this.writeStream.write('\n]');
      }

      // Include metadata if requested
      if (this.includeMetadata && this.format !== 'ndjson') {
        this.writeMetadata(params, totalFetched);
      }

      // Close stream
      await this.closeStream();

      return {
        processed: this.processed,
        bytesWritten: this.bytesWritten,
      };
    } catch (error) {
      this.writeStream.destroy();
      throw error;
    }
  }

  /**
   * Stream work details for multiple works
   */
  async exportWorkDetails(
    workIds: string[],
    outputPath: string,
    format: 'json' | 'ndjson' = 'json',
    onProgress?: (progress: StreamProgress) => void
  ): Promise<{ processed: number; bytesWritten: number }> {
    const writeStream = createWriteStream(outputPath, {
      encoding: 'utf-8',
      highWaterMark: 64 * 1024,
    });

    const startTime = Date.now();
    let processed = 0;
    let bytesWritten = 0;

    try {
      if (format === 'json') {
        writeStream.write('[\n');
      }

      for (let i = 0; i < workIds.length; i++) {
        const workId = workIds[i];

        try {
          const work = await getWork(workId);

          const line =
            format === 'json'
              ? (i > 0 ? ',\n' : '') + JSON.stringify(work, null, 2)
              : JSON.stringify(work) + '\n';

          writeStream.write(line);
          bytesWritten += line.length;
          processed++;

          if (onProgress) {
            onProgress({
              processed,
              total: workIds.length,
              bytesWritten,
              percent: Math.round((processed / workIds.length) * 100),
              estimatedTimeRemaining: this.calculateETA(startTime, processed),
            });
          }
        } catch (error) {
          // Log error but continue
          console.error(`Failed to fetch work ${workId}:`, (error as Error).message);
        }

        // Rate limiting - small delay between requests
        if (i < workIds.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }

      if (format === 'json') {
        writeStream.write('\n]');
      }

      await new Promise<void>((resolve, reject) => {
        writeStream.end(resolve);
        writeStream.on('error', reject);
      });

      return { processed, bytesWritten };
    } catch (error) {
      writeStream.destroy();
      throw error;
    }
  }

  /**
   * Abort the streaming export
   */
  abort(): void {
    this.aborted = true;
  }

  /**
   * Write CSV header
   */
  private writeCsvHeader(): void {
    const header = 'id,title,shortTitle,type,status,date,url,versionCount\n';
    this.writeStream.write(header);
    this.bytesWritten += header.length;
  }

  /**
   * Write work to stream
   */
  private writeWork(work: Work, isFirst: boolean): void {
    let line = '';

    switch (this.format) {
      case 'csv':
        line = this.formatCsvRow(work);
        break;

      case 'json':
        line = (isFirst ? '' : ',\n') + JSON.stringify(work, null, 2);
        break;

      case 'ndjson':
        line = JSON.stringify(work) + '\n';
        break;
    }

    this.writeStream.write(line);
    this.bytesWritten += line.length;
  }

  /**
   * Format work as CSV row
   */
  private formatCsvRow(work: Work): string {
    // Escape CSV fields
    const escape = (str: string): string => {
      if (str.includes(',') || str.includes('"') || str.includes('\n')) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    return (
      [
        work.id,
        escape(work.title),
        work.shortTitle ? escape(work.shortTitle) : '',
        work.type,
        work.status,
        work.date,
        work.url,
        work.versionCount.toString(),
      ].join(',') + '\n'
    );
  }

  /**
   * Write metadata at end of file
   */
  private writeMetadata(params: SearchParams, totalResults: number): void {
    const metadata = {
      _metadata: {
        exportedAt: new Date().toISOString(),
        query: params.query,
        totalResults,
        format: this.format,
      },
    };

    if (this.format === 'csv') {
      this.writeStream.write('\n# Metadata\n');
      this.writeStream.write(`# Exported: ${metadata._metadata.exportedAt}\n`);
      this.writeStream.write(`# Query: ${params.query}\n`);
      this.writeStream.write(`# Total: ${totalResults}\n`);
    } else {
      this.writeStream.write(',\n');
      this.writeStream.write(JSON.stringify(metadata, null, 2));
    }

    this.bytesWritten += JSON.stringify(metadata).length;
  }

  /**
   * Close write stream
   */
  private async closeStream(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.writeStream.end(() => {
        resolve();
      });
      this.writeStream.on('error', reject);
    });
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateETA(startTime: number, processed: number): number | undefined {
    if (processed === 0) {
      return undefined;
    }

    const elapsed = Date.now() - startTime;
    const avgTimePerItem = elapsed / processed;
    const remaining = this.maxResults - processed;

    return Math.round(avgTimePerItem * remaining);
  }
}

/**
 * Create a readable stream from paginated API results
 */
export function createPaginatedStream(
  params: SearchParams,
  options: { batchSize?: number; concurrency?: number } = {}
): Readable {
  const batchSize = options.batchSize ?? 100;
  let offset = 0;
  let hasMore = true;
  let pending: Promise<void> | null = null;

  return new Readable({
    objectMode: true,
    read(): void {
      if (pending) {
        return;
      }

      if (!hasMore) {
        this.push(null);
        return;
      }

      pending = (async (): Promise<void> => {
        try {
          const results = await searchWorks({
            ...params,
            limit: batchSize,
            offset,
          });

          if (results.results.length === 0) {
            hasMore = false;
            this.push(null);
            return;
          }

          for (const work of results.results) {
            this.push(work);
          }

          offset += batchSize;
        } catch (error) {
          this.destroy(error as Error);
        } finally {
          pending = null;
        }
      })();
    },
  });
}

/**
 * Stream processing pipeline
 *
 * Example usage:
 * ```typescript
 * const stream = createPaginatedStream({ query: 'health' });
 * const transformed = stream.pipe(new Transform({
 *   objectMode: true,
 *   transform(work, encoding, callback) {
 *     callback(null, { id: work.work_id, title: work.title });
 *   }
 * }));
 *
 * await pipeline(stream, transformed, createWriteStream('output.json'));
 * ```
 */
export { pipeline };
