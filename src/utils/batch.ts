/**
 * Batch Processing Utilities
 *
 * Provides request batching for bulk operations to optimize API usage and improve performance.
 */

import { EventEmitter } from 'events';
import { writeFileSync } from 'fs';

import { searchWorks, getWork, getWorkVersions, getVersion } from '@client';
import type { SearchResults } from '@models';

/**
 * Batch request types
 */
export type BatchRequestType = 'search' | 'getWork' | 'getVersions' | 'getVersion';

/**
 * Individual batch request
 */
export interface BatchRequest {
  id: string;
  type: BatchRequestType;
  params: Record<string, unknown>;
  priority?: number; // Higher = more urgent
}

/**
 * Batch request result
 */
export interface BatchResult<T = unknown> {
  id: string;
  success: boolean;
  data?: T;
  error?: Error;
  cached: boolean;
  duration: number;
}

/**
 * Batch execution options
 */
export interface BatchOptions {
  concurrency?: number; // Max concurrent requests (default: 5)
  retryFailed?: boolean; // Auto-retry failed requests (default: false)
  maxRetries?: number; // Max retry attempts (default: 3)
  timeout?: number; // Request timeout in ms (default: 30000)
  stopOnError?: boolean; // Stop batch on first error (default: false)
}

/**
 * Batch progress event
 */
export interface BatchProgress {
  total: number;
  completed: number;
  failed: number;
  cached: number;
  percent: number;
  estimatedTimeRemaining?: number;
}

/**
 * Batch executor with progress tracking
 */
export class BatchExecutor extends EventEmitter {
  private concurrency: number;
  private retryFailed: boolean;
  private maxRetries: number;
  private timeout: number;
  private stopOnError: boolean;

  constructor(options: BatchOptions = {}) {
    super();
    this.concurrency = options.concurrency ?? 5;
    this.retryFailed = options.retryFailed ?? false;
    this.maxRetries = options.maxRetries ?? 3;
    this.timeout = options.timeout ?? 30000;
    this.stopOnError = options.stopOnError ?? false;
  }

  /**
   * Execute multiple requests with controlled concurrency
   */
  async execute(requests: BatchRequest[]): Promise<BatchResult[]> {
    const startTime = Date.now();
    const results: BatchResult[] = [];
    let completed = 0;
    let failed = 0;
    let cached = 0;

    this.emit('start', { total: requests.length });

    // Process in batches based on concurrency
    const batches = this.chunkArray(requests, this.concurrency);

    for (const batch of batches) {
      if (this.stopOnError && failed > 0) {
        break;
      }

      const batchPromises = batch.map(req => this.executeRequest(req));
      const batchResults = await Promise.allSettled(batchPromises);

      for (const result of batchResults) {
        if (result.status === 'fulfilled') {
          const batchResult = result.value;
          results.push(batchResult);
          completed++;
          if (batchResult.cached) {
            cached++;
          }
          if (!batchResult.success) {
            failed++;
          }
        } else {
          // Promise rejected
          results.push({
            id: 'unknown',
            success: false,
            error: result.reason as Error,
            cached: false,
            duration: 0,
          });
          failed++;
        }
      }

      // Emit progress
      const progress: BatchProgress = {
        total: requests.length,
        completed,
        failed,
        cached,
        percent: Math.round((completed / requests.length) * 100),
        estimatedTimeRemaining: this.calculateETA(startTime, completed, requests.length),
      };

      this.emit('progress', progress);
    }

    this.emit('complete', {
      total: requests.length,
      completed,
      failed,
      cached,
      duration: Date.now() - startTime,
      results,
    });

    return results;
  }

  /**
   * Execute a single batch request
   */
  private async executeRequest(request: BatchRequest): Promise<BatchResult> {
    const startTime = Date.now();
    let cached = false;

    try {
      const timeoutPromise = new Promise<never>((_, reject): void => {
        setTimeout(
          () => reject(new Error(`Request timeout after ${this.timeout}ms`)),
          this.timeout
        );
      });

      const executePromise = (async (): Promise<BatchResult> => {
        let data: unknown;
        const searchParams = request.params as {
          query?: string;
          type?: string;
          status?: string;
          from?: string;
          to?: string;
          limit?: number;
          offset?: number;
        };

        switch (request.type) {
          case 'search':
            data = await searchWorks(searchParams);
            break;

          case 'getWork':
            data = await getWork(request.params.id as string);
            break;

          case 'getVersions':
            data = await getWorkVersions(request.params.workId as string);
            break;

          case 'getVersion':
            data = await getVersion(request.params.versionId as string);
            break;

          default:
            throw new Error('Unknown request type');
        }

        // Check if result was cached (simplified - real implementation would check cache)
        cached = false; // Would need to integrate with client cache

        return {
          id: request.id,
          success: true,
          data,
          cached,
          duration: Date.now() - startTime,
        } as BatchResult;
      })();

      const result = await Promise.race([executePromise, timeoutPromise]);
      return result;
    } catch (error) {
      // Retry logic
      if (this.retryFailed) {
        for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
          try {
            await new Promise(resolve => setTimeout(resolve, 1000 * attempt)); // Exponential backoff
            const retryResult = await this.executeRequest(request);
            if (retryResult.success) {
              return retryResult;
            }
          } catch {
            // Continue to next retry
          }
        }
      }

      return {
        id: request.id,
        success: false,
        error: error instanceof Error ? error : new Error('Unknown error'),
        cached: false,
        duration: Date.now() - startTime,
      };
    }
  }

  /**
   * Chunk array into smaller arrays
   */
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  /**
   * Calculate estimated time remaining
   */
  private calculateETA(startTime: number, completed: number, total: number): number | undefined {
    if (completed === 0) {
      return undefined;
    }

    const elapsed = Date.now() - startTime;
    const avgTimePerRequest = elapsed / completed;
    const remaining = total - completed;

    return Math.round(avgTimePerRequest * remaining);
  }
}

/**
 * Create batch requests from search results
 */
export function createBatchFromSearch(
  searchResults: SearchResults,
  requestType: 'getWork' | 'getVersions' = 'getWork'
): BatchRequest[] {
  return searchResults.results.map((work, index) => ({
    id: work.id,
    type: requestType,
    params: requestType === 'getWork' ? { id: work.id } : { workId: work.id },
    priority: index,
  }));
}

/**
 * Create batch requests from ID list
 */
export function createBatchFromIds(ids: string[], requestType: BatchRequestType): BatchRequest[] {
  const paramKey =
    requestType === 'getVersion' ? 'versionId' : requestType === 'getVersions' ? 'workId' : 'id';

  return ids.map((id, index) => ({
    id,
    type: requestType,
    params: { [paramKey]: id },
    priority: index,
  }));
}

/**
 * Create batch requests from CSV/file input
 */
export function createBatchFromFile(
  rows: Array<Record<string, string>>,
  requestType: BatchRequestType,
  idColumn: string
): BatchRequest[] {
  return rows.map((row, index) => {
    const id = row[idColumn];
    if (!id) {
      throw new Error(`Missing ID column "${idColumn}" in row ${index}`);
    }

    return {
      id,
      type: requestType,
      params:
        requestType === 'search'
          ? { query: id } // Use ID as search query
          : { [requestType === 'getVersion' ? 'versionId' : 'id']: id },
      priority: index,
    };
  });
}

/**
 * Format batch results for output
 */
export function formatBatchResults<T>(results: BatchResult<T>[]): {
  successful: BatchResult<T>[];
  failed: BatchResult<T>[];
  cached: BatchResult<T>[];
  summary: {
    total: number;
    successRate: number;
    cacheHitRate: number;
    averageDuration: number;
    totalDuration: number;
  };
} {
  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const cached = results.filter(r => r.cached);

  const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);

  return {
    successful,
    failed,
    cached,
    summary: {
      total: results.length,
      successRate: results.length > 0 ? Math.round((successful.length / results.length) * 100) : 0,
      cacheHitRate: results.length > 0 ? Math.round((cached.length / results.length) * 100) : 0,
      averageDuration: results.length > 0 ? Math.round(totalDuration / results.length) : 0,
      totalDuration,
    },
  };
}

/**
 * Save batch results to file
 */
export function saveBatchResults(
  results: BatchResult[],
  outputPath: string,
  format: 'json' | 'csv' = 'json'
): void {
  if (format === 'json') {
    const output = {
      exportedAt: new Date().toISOString(),
      total: results.length,
      results: results.map(r => ({
        id: r.id,
        success: r.success,
        data: r.data,
        error: r.error?.message,
        cached: r.cached,
        duration: r.duration,
      })),
    };
    writeFileSync(outputPath, JSON.stringify(output, null, 2));
  } else {
    // CSV format - simplified
    const csvLines = ['id,success,cached,duration,error'];
    for (const result of results) {
      csvLines.push(
        `${result.id},${result.success},${result.cached},${result.duration},"${result.error?.message || ''}"`
      );
    }
    writeFileSync(outputPath, csvLines.join('\n'));
  }
}
