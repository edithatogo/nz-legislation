/**
 * API Call Optimization Utilities
 *
 * Provides connection pooling, retry strategies, request deduplication,
 * and payload optimization for improved API performance.
 */

import { EventEmitter } from 'events';
import { Agent as HttpAgent } from 'node:http';
import { Agent as HttpsAgent } from 'node:https';

import got, { type Got } from 'got';
import { LRUCache } from 'lru-cache';

type SearchParamValue = string | number | boolean | null | undefined;
type SearchParams = Record<string, SearchParamValue>;
type JsonObject = Record<string, unknown>;

interface RetryableError {
  code?: string;
  message?: string;
  response?: {
    statusCode?: number;
  };
}

interface RequestOptions {
  searchParams?: SearchParams;
}

interface DeduplicationStats {
  pendingRequests: number;
  recentRequests: number;
}

interface AgentSet {
  http: HttpAgent;
  https: HttpsAgent;
}

/**
 * Connection pool configuration
 */
export interface ConnectionPoolConfig {
  maxSockets?: number;
  maxFreeSockets?: number;
  timeout?: number;
  keepAlive?: boolean;
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries?: number;
  baseDelay?: number;
  maxDelay?: number;
  retryableStatusCodes?: number[];
  retryableMethods?: string[];
}

/**
 * Request deduplication configuration
 */
export interface DeduplicationConfig {
  enabled?: boolean;
  windowMs?: number;
}

/**
 * Optimized API client options
 */
export interface OptimizedClientOptions {
  baseUrl: string;
  apiKey: string;
  pool?: ConnectionPoolConfig;
  retry?: RetryConfig;
  deduplication?: DeduplicationConfig;
}

/**
 * Request metrics
 */
export interface RequestMetrics {
  totalRequests: number;
  successfulRequests: number;
  failedRequests: number;
  retriedRequests: number;
  deduplicatedRequests: number;
  averageResponseTime: number;
  p95ResponseTime: number;
  p99ResponseTime: number;
}

class ConnectionPool {
  private readonly maxSockets: number;
  private readonly maxFreeSockets: number;
  private readonly timeout: number;
  private readonly keepAlive: boolean;

  constructor(config: ConnectionPoolConfig = {}) {
    this.maxSockets = config.maxSockets ?? 50;
    this.maxFreeSockets = config.maxFreeSockets ?? 10;
    this.timeout = config.timeout ?? 30000;
    this.keepAlive = config.keepAlive ?? true;
  }

  getAgent(): AgentSet {
    const agentOptions = {
      keepAlive: this.keepAlive,
      maxSockets: this.maxSockets,
      maxFreeSockets: this.maxFreeSockets,
      timeout: this.timeout,
    };

    return {
      http: new HttpAgent(agentOptions),
      https: new HttpsAgent(agentOptions),
    };
  }
}

class RetryManager {
  private readonly maxRetries: number;
  private readonly baseDelay: number;
  private readonly maxDelay: number;
  private readonly retryableStatusCodes: number[];
  private readonly retryableMethods: string[];

  constructor(config: RetryConfig = {}) {
    this.maxRetries = config.maxRetries ?? 3;
    this.baseDelay = config.baseDelay ?? 1000;
    this.maxDelay = config.maxDelay ?? 30000;
    this.retryableStatusCodes = config.retryableStatusCodes ?? [408, 429, 500, 502, 503, 504];
    this.retryableMethods = config.retryableMethods ?? ['GET'];
  }

  getMaxRetries(): number {
    return this.maxRetries;
  }

  shouldRetry(error: RetryableError, method: string): boolean {
    if (!this.retryableMethods.includes(method.toUpperCase())) {
      return false;
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
      return true;
    }

    const statusCode = error.response?.statusCode;
    return statusCode !== undefined && this.retryableStatusCodes.includes(statusCode);
  }

  getDelay(attempt: number): number {
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay;
    return Math.round(Math.min(exponentialDelay + jitter, this.maxDelay));
  }
}

class DeduplicationManager {
  private readonly pendingRequests = new Map<string, Promise<unknown>>();
  private readonly recentRequests: LRUCache<string, number>;
  private readonly enabled: boolean;

  constructor(config: DeduplicationConfig = {}) {
    this.enabled = config.enabled ?? true;
    this.recentRequests = new LRUCache<string, number>({
      max: 1000,
      ttl: config.windowMs ?? 1000,
    });
  }

  generateKey(url: string, options: RequestOptions): string {
    const paramString = JSON.stringify(options.searchParams ?? {});
    return `${url}:${paramString}`;
  }

  async getOrAdd<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (!this.enabled) {
      return requestFn();
    }

    const existing = this.pendingRequests.get(key);
    if (existing) {
      return existing as Promise<T>;
    }

    const promise = requestFn()
      .then(result => {
        this.pendingRequests.delete(key);
        this.recentRequests.set(key, Date.now());
        return result;
      })
      .catch(error => {
        this.pendingRequests.delete(key);
        throw error;
      });

    this.pendingRequests.set(key, promise);
    return promise;
  }

  isDuplicate(key: string): boolean {
    return this.enabled && this.recentRequests.has(key);
  }

  getStats(): DeduplicationStats {
    return {
      pendingRequests: this.pendingRequests.size,
      recentRequests: this.recentRequests.size,
    };
  }
}

export class OptimizedApiClient extends EventEmitter {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly pool: ConnectionPool;
  private readonly retryManager: RetryManager;
  private readonly deduplicationManager: DeduplicationManager;
  private metrics: RequestMetrics;
  private responseTimes: number[];

  constructor(options: OptimizedClientOptions) {
    super();
    this.baseUrl = options.baseUrl.replace(/\/+$/, '');
    this.apiKey = options.apiKey;
    this.pool = new ConnectionPool(options.pool);
    this.retryManager = new RetryManager(options.retry);
    this.deduplicationManager = new DeduplicationManager(options.deduplication);
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      retriedRequests: 0,
      deduplicatedRequests: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
    };
    this.responseTimes = [];
  }

  async get<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const normalizedEndpoint = endpoint.replace(/^\/+/, '');
    const requestUrl = `${this.baseUrl}/${normalizedEndpoint}`;
    const startTime = Date.now();

    this.metrics.totalRequests++;

    const dedupKey = this.deduplicationManager.generateKey(requestUrl, options);
    if (this.deduplicationManager.isDuplicate(dedupKey)) {
      this.metrics.deduplicatedRequests++;
      this.emit('deduplicated', { url: requestUrl, method: 'GET' });
    }

    const result = await this.deduplicationManager.getOrAdd(dedupKey, async () =>
      this.executeWithRetry<T>(normalizedEndpoint, requestUrl, 'GET', options)
    );

    this.trackResponseTime(Date.now() - startTime);
    return result;
  }

  private createClient(options: RequestOptions): Got {
    return got.extend({
      prefixUrl: this.baseUrl,
      timeout: { request: 30000 },
      headers: {
        Accept: 'application/json',
        'User-Agent': 'nz-legislation-tool/1.0.0',
      },
      searchParams: {
        api_key: this.apiKey,
        ...(options.searchParams ?? {}),
      },
      agent: this.pool.getAgent(),
      retry: {
        limit: 0,
      },
    });
  }

  private async executeWithRetry<T>(
    endpoint: string,
    requestUrl: string,
    method: string,
    options: RequestOptions,
    attempt = 0
  ): Promise<T> {
    try {
      const client = this.createClient(options);
      const response = await client.get(endpoint).json<T>();

      this.metrics.successfulRequests++;
      this.emit('success', { url: requestUrl, method, attempt });
      return response;
    } catch (error) {
      const retryableError = error as RetryableError;

      if (
        this.retryManager.shouldRetry(retryableError, method) &&
        attempt < this.retryManager.getMaxRetries()
      ) {
        const delay = this.retryManager.getDelay(attempt);
        this.metrics.retriedRequests++;
        this.emit('retry', {
          url: requestUrl,
          method,
          attempt,
          delay,
          error: retryableError.message ?? 'Unknown retryable error',
        });

        await new Promise(resolve => setTimeout(resolve, delay));
        return this.executeWithRetry<T>(endpoint, requestUrl, method, options, attempt + 1);
      }

      this.metrics.failedRequests++;
      this.emit('error', {
        url: requestUrl,
        method,
        attempt,
        error: retryableError.message ?? 'Unknown request error',
      });
      throw error;
    }
  }

  private trackResponseTime(time: number): void {
    this.responseTimes.push(time);
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }

    this.metrics.averageResponseTime =
      this.responseTimes.reduce((sum, value) => sum + value, 0) / this.responseTimes.length;

    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    this.metrics.p95ResponseTime = sorted[Math.floor(sorted.length * 0.95)] ?? 0;
    this.metrics.p99ResponseTime = sorted[Math.floor(sorted.length * 0.99)] ?? 0;
  }

  getMetrics(): RequestMetrics {
    return { ...this.metrics };
  }

  resetMetrics(): void {
    this.metrics = {
      totalRequests: 0,
      successfulRequests: 0,
      failedRequests: 0,
      retriedRequests: 0,
      deduplicatedRequests: 0,
      averageResponseTime: 0,
      p95ResponseTime: 0,
      p99ResponseTime: 0,
    };
    this.responseTimes = [];
  }

  getDeduplicationStats(): DeduplicationStats {
    return this.deduplicationManager.getStats();
  }

  close(): void {
    this.emit('close');
  }
}

export class PayloadOptimizer {
  static compressPayload(data: unknown, fields?: string[]): unknown {
    if (!fields || fields.length === 0) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.pickFields(item, fields));
    }

    return this.pickFields(data, fields);
  }

  private static pickFields(value: unknown, fields: string[]): JsonObject {
    if (!this.isJsonObject(value)) {
      return {};
    }

    const result: JsonObject = {};
    for (const field of fields) {
      const fieldValue = value[field];
      if (fieldValue !== undefined) {
        result[field] = fieldValue;
      }
    }
    return result;
  }

  static minify(data: unknown): string {
    return JSON.stringify(data);
  }

  static estimateSize(data: unknown): number {
    return Buffer.byteLength(JSON.stringify(data), 'utf8');
  }

  private static isJsonObject(value: unknown): value is JsonObject {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
  }
}

export function createOptimizedClient(options: OptimizedClientOptions): OptimizedApiClient {
  return new OptimizedApiClient(options);
}
