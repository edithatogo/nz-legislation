/**
 * API Call Optimization Utilities
 * 
 * Provides connection pooling, retry strategies, request deduplication,
 * and payload optimization for improved API performance.
 */

import { EventEmitter } from 'events';
import got, { OptionsOfJSONResponseBody } from 'got';
import { LRUCache } from 'lru-cache';

/**
 * Connection pool configuration
 */
export interface ConnectionPoolConfig {
  maxSockets?: number;        // Max concurrent sockets (default: 50)
  maxFreeSockets?: number;    // Max free sockets to keep (default: 10)
  timeout?: number;           // Socket timeout in ms (default: 30000)
  keepAlive?: boolean;        // Enable keep-alive (default: true)
}

/**
 * Retry configuration
 */
export interface RetryConfig {
  maxRetries?: number;        // Max retry attempts (default: 3)
  baseDelay?: number;         // Base delay in ms (default: 1000)
  maxDelay?: number;          // Max delay in ms (default: 30000)
  retryableStatusCodes?: number[];  // Status codes to retry (default: [408, 429, 500, 502, 503, 504])
  retryableMethods?: string[];      // Methods to retry (default: ['GET'])
}

/**
 * Request deduplication configuration
 */
export interface DeduplicationConfig {
  enabled?: boolean;          // Enable deduplication (default: true)
  windowMs?: number;          // Deduplication window in ms (default: 1000)
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

/**
 * Connection pool manager
 */
class ConnectionPool {
  private maxSockets: number;
  private maxFreeSockets: number;
  private timeout: number;
  private keepAlive: boolean;

  constructor(config: ConnectionPoolConfig = {}) {
    this.maxSockets = config.maxSockets ?? 50;
    this.maxFreeSockets = config.maxFreeSockets ?? 10;
    this.timeout = config.timeout ?? 30000;
    this.keepAlive = config.keepAlive ?? true;
  }

  getAgent() {
    // Node.js http/https agent with connection pooling
    const http = require('http');
    const https = require('https');

    const agentOptions = {
      keepAlive: this.keepAlive,
      maxSockets: this.maxSockets,
      maxFreeSockets: this.maxFreeSockets,
      timeout: this.timeout,
    };

    return {
      http: new http.Agent(agentOptions),
      https: new https.Agent(agentOptions),
    };
  }
}

/**
 * Retry manager with exponential backoff and jitter
 */
class RetryManager {
  private maxRetries: number;
  private baseDelay: number;
  private maxDelay: number;
  private retryableStatusCodes: number[];
  private retryableMethods: string[];

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

  shouldRetry(error: any, method: string): boolean {
    // Check if method is retryable
    if (!this.retryableMethods.includes(method.toUpperCase())) {
      return false;
    }

    // Check if error is retryable
    if (error.code === 'ETIMEDOUT' || error.code === 'ECONNRESET') {
      return true;
    }

    // Check if status code is retryable
    if (error.response?.statusCode) {
      return this.retryableStatusCodes.includes(error.response.statusCode);
    }

    return false;
  }

  getDelay(attempt: number): number {
    // Exponential backoff with jitter
    const exponentialDelay = this.baseDelay * Math.pow(2, attempt);
    const jitter = Math.random() * 0.3 * exponentialDelay; // 30% jitter
    const delay = Math.min(exponentialDelay + jitter, this.maxDelay);
    
    return Math.round(delay);
  }
}

/**
 * Request deduplication manager
 */
class DeduplicationManager {
  private pendingRequests: Map<string, Promise<any>>;
  private windowMs: number;
  private recentRequests: LRUCache<string, number>;

  constructor(config: DeduplicationConfig = {}) {
    this.pendingRequests = new Map();
    this.windowMs = config.windowMs ?? 1000;
    this.recentRequests = new LRUCache({
      max: 1000,
      ttl: this.windowMs,
    });
  }

  /**
   * Generate cache key from request options
   */
  generateKey(url: string, options: any): string {
    const params = options.searchParams || {};
    const paramString = JSON.stringify(params);
    return `${url}:${paramString}`;
  }

  /**
   * Get or create deduplicated request
   */
  getOrAdd(key: string, requestFn: () => Promise<any>): Promise<any> {
    // Check if identical request is in flight
    const existing = this.pendingRequests.get(key);
    if (existing) {
      return existing;
    }

    // Execute request and store promise
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

  /**
   * Check if request was recently made (deduplication)
   */
  isDuplicate(key: string): boolean {
    return this.recentRequests.has(key);
  }

  /**
   * Get deduplication statistics
   */
  getStats() {
    return {
      pendingRequests: this.pendingRequests.size,
      recentRequests: this.recentRequests.size,
    };
  }
}

/**
 * Optimized API Client
 */
export class OptimizedApiClient extends EventEmitter {
  private baseUrl: string;
  private apiKey: string;
  private pool: ConnectionPool;
  private retryManager: RetryManager;
  private deduplicationManager: DeduplicationManager;
  private metrics: RequestMetrics;
  private responseTimes: number[];

  constructor(options: OptimizedClientOptions) {
    super();
    this.baseUrl = options.baseUrl;
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

  /**
   * Execute HTTP GET request with optimization
   */
  async get<T>(endpoint: string, options?: any): Promise<T> {
    const url = `${this.baseUrl}/${endpoint}`;
    const method = 'GET';
    const startTime = Date.now();

    this.metrics.totalRequests++;

    // Generate deduplication key
    const dedupKey = this.deduplicationManager.generateKey(url, options || {});

    // Check for duplicate request
    if (this.deduplicationManager.isDuplicate(dedupKey)) {
      this.metrics.deduplicatedRequests++;
      this.emit('deduplicated', { url, method });
    }

    // Execute with deduplication
    const result = await this.deduplicationManager.getOrAdd(dedupKey, async () => {
      return this.executeWithRetry<T>(url, method, options);
    });

    // Track response time
    const responseTime = Date.now() - startTime;
    this.trackResponseTime(responseTime);

    return result;
  }

  /**
   * Execute request with retry logic
   */
  private async executeWithRetry<T>(
    url: string,
    method: string,
    options?: any,
    attempt: number = 0
  ): Promise<T> {
    try {
      const client = got.extend({
        prefixUrl: this.baseUrl,
        timeout: { request: 30000 },
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'nz-legislation-tool/1.0.0',
        },
        searchParams: {
          api_key: this.apiKey,
          ...options?.searchParams,
        },
        agent: this.pool.getAgent(),
        retry: {
          limit: 0, // We handle retries manually
        },
      });

      const response = await client.get(url, {
        responseType: 'json',
      });

      this.metrics.successfulRequests++;
      this.emit('success', { url, method, attempt });

      return response.body as T;
    } catch (error: any) {
      // Check if should retry
      if (this.retryManager.shouldRetry(error, method) && attempt < this.retryManager.getMaxRetries()) {
        const delay = this.retryManager.getDelay(attempt);
        this.metrics.retriedRequests++;
        this.emit('retry', { url, method, attempt, delay, error: error.message });

        // Wait before retry
        await new Promise(resolve => setTimeout(resolve, delay));

        // Retry
        return this.executeWithRetry<T>(url, method, options, attempt + 1);
      }

      this.metrics.failedRequests++;
      this.emit('error', { url, method, attempt, error: error.message });
      throw error;
    }
  }

  /**
   * Track response time for metrics
   */
  private trackResponseTime(time: number) {
    this.responseTimes.push(time);

    // Keep last 1000 response times
    if (this.responseTimes.length > 1000) {
      this.responseTimes.shift();
    }

    // Update metrics
    this.metrics.averageResponseTime = 
      this.responseTimes.reduce((a, b) => a + b, 0) / this.responseTimes.length;
    
    const sorted = [...this.responseTimes].sort((a, b) => a - b);
    this.metrics.p95ResponseTime = sorted[Math.floor(sorted.length * 0.95)] || 0;
    this.metrics.p99ResponseTime = sorted[Math.floor(sorted.length * 0.99)] || 0;
  }

  /**
   * Get request metrics
   */
  getMetrics(): RequestMetrics {
    return { ...this.metrics };
  }

  /**
   * Reset metrics
   */
  resetMetrics() {
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

  /**
   * Get deduplication stats
   */
  getDeduplicationStats() {
    return this.deduplicationManager.getStats();
  }

  /**
   * Close all connections
   */
  close() {
    // Agents will be garbage collected when no longer referenced
    this.emit('close');
  }
}

/**
 * Payload optimizer
 */
export class PayloadOptimizer {
  /**
   * Compress payload by removing unnecessary fields
   */
  static compressPayload(data: any, fields?: string[]): any {
    if (!fields || fields.length === 0) {
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.pickFields(item, fields));
    }

    return this.pickFields(data, fields);
  }

  /**
   * Pick only specified fields from object
   */
  private static pickFields(obj: any, fields: string[]): any {
    const result: any = {};
    for (const field of fields) {
      if (obj[field] !== undefined) {
        result[field] = obj[field];
      }
    }
    return result;
  }

  /**
   * Minify JSON payload
   */
  static minify(data: any): string {
    return JSON.stringify(data);
  }

  /**
   * Estimate payload size in bytes
   */
  static estimateSize(data: any): number {
    return Buffer.byteLength(JSON.stringify(data), 'utf8');
  }
}

/**
 * Create optimized API client
 */
export function createOptimizedClient(options: OptimizedClientOptions): OptimizedApiClient {
  return new OptimizedApiClient(options);
}
