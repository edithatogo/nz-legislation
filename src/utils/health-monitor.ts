/**
 * Health Monitoring System
 *
 * Monitors the health of legislation providers and scrapers,
 * detecting issues before users complain.
 */

export interface HealthStatus {
  healthy: boolean;
  jurisdiction: string;
  lastSuccessfulScrape: Date | null;
  lastCheck: Date;
  successRate: number; // 0-100%
  averageResponseTime: number; // ms
  fallbackActive: boolean;
  consecutiveFailures: number;
  errorMessage?: string;
}

export interface HealthDashboard {
  providers: HealthStatus[];
  overallHealthy: boolean;
  lastUpdated: Date;
}

export type HealthAlertCallback = (jurisdiction: string, status: HealthStatus) => void;

export class HealthMonitor {
  private monitoringIntervals: Map<string, NodeJS.Timeout> = new Map();
  private healthData: Map<string, HealthData> = new Map();
  private alertCallbacks: HealthAlertCallback[] = [];
  private checkInterval: number;
  private unhealthyThreshold: number;

  constructor(options?: {
    checkInterval?: number; // ms between checks (default: 1 hour)
    unhealthyThreshold?: number; // consecutive failures before alert (default: 3)
  }) {
    this.checkInterval = options?.checkInterval ?? 60 * 60 * 1000; // 1 hour
    this.unhealthyThreshold = options?.unhealthyThreshold ?? 3;
  }

  /**
   * Register a provider for health monitoring
   */
  register(provider: HealthCheckable): void {
    const jurisdiction = provider.getJurisdiction();

    // Initialize health data
    this.healthData.set(jurisdiction, {
      successTimes: [],
      failureTimes: [],
      responseTimes: [],
      consecutiveFailures: 0,
      lastSuccess: null,
      fallbackActive: false,
    });

    // Start monitoring
    this.startMonitoring(provider);
  }

  /**
   * Check health of a provider
   */
  async check(provider: HealthCheckable): Promise<HealthStatus> {
    const jurisdiction = provider.getJurisdiction();
    const startTime = Date.now();

    try {
      // Perform health check (simple scrape test)
      await provider.healthCheck();

      const responseTime = Date.now() - startTime;
      this.recordSuccess(jurisdiction, responseTime);

      return this.getHealthStatus(jurisdiction);
    } catch (error) {
      this.recordFailure(jurisdiction, error instanceof Error ? error.message : 'Unknown error');
      return this.getHealthStatus(jurisdiction);
    }
  }

  /**
   * Start continuous monitoring
   */
  private startMonitoring(provider: HealthCheckable): void {
    const jurisdiction = provider.getJurisdiction();

    // Clear existing interval if any
    const existing = this.monitoringIntervals.get(jurisdiction);
    if (existing) {
      clearInterval(existing);
    }

    // Set up monitoring interval
    const interval = setInterval(async () => {
      await this.check(provider);
    }, this.checkInterval);

    this.monitoringIntervals.set(jurisdiction, interval);
  }

  /**
   * Record successful health check
   */
  private recordSuccess(jurisdiction: string, responseTime: number): void {
    const data = this.healthData.get(jurisdiction);
    if (!data) return;

    data.successTimes.push(Date.now());
    data.responseTimes.push(responseTime);
    data.consecutiveFailures = 0;
    data.lastSuccess = new Date();

    // Keep only last 100 data points
    if (data.successTimes.length > 100) data.successTimes.shift();
    if (data.responseTimes.length > 100) data.responseTimes.shift();
  }

  /**
   * Record failed health check
   */
  private recordFailure(jurisdiction: string, errorMessage: string): void {
    const data = this.healthData.get(jurisdiction);
    if (!data) return;

    data.failureTimes.push(Date.now());
    data.consecutiveFailures++;

    // Keep only last 100 data points
    if (data.failureTimes.length > 100) data.failureTimes.shift();

    // Alert if threshold reached
    if (data.consecutiveFailures >= this.unhealthyThreshold) {
      this.triggerAlert(jurisdiction);
    }
  }

  /**
   * Get current health status
   */
  getHealthStatus(jurisdiction: string): HealthStatus {
    const data = this.healthData.get(jurisdiction);

    if (!data) {
      return {
        healthy: true,
        jurisdiction,
        lastSuccessfulScrape: null,
        lastCheck: new Date(),
        successRate: 100,
        averageResponseTime: 0,
        fallbackActive: false,
        consecutiveFailures: 0,
      };
    }

    const total = data.successTimes.length + data.failureTimes.length;
    const successRate = total > 0 ? (data.successTimes.length / total) * 100 : 100;
    const averageResponseTime =
      data.responseTimes.length > 0
        ? data.responseTimes.reduce((a, b) => a + b, 0) / data.responseTimes.length
        : 0;

    return {
      healthy: data.consecutiveFailures < this.unhealthyThreshold,
      jurisdiction,
      lastSuccessfulScrape: data.lastSuccess,
      lastCheck: new Date(),
      successRate,
      averageResponseTime,
      fallbackActive: data.fallbackActive,
      consecutiveFailures: data.consecutiveFailures,
    };
  }

  /**
   * Get dashboard with all providers
   */
  getDashboard(): HealthDashboard {
    const providers: HealthStatus[] = [];

    for (const jurisdiction of this.healthData.keys()) {
      providers.push(this.getHealthStatus(jurisdiction));
    }

    const overallHealthy = providers.every(p => p.healthy);

    return {
      providers,
      overallHealthy,
      lastUpdated: new Date(),
    };
  }

  /**
   * Register alert callback
   */
  onAlert(callback: HealthAlertCallback): void {
    this.alertCallbacks.push(callback);
  }

  /**
   * Trigger alerts to all registered callbacks
   */
  private triggerAlert(jurisdiction: string): void {
    const status = this.getHealthStatus(jurisdiction);

    for (const callback of this.alertCallbacks) {
      callback(jurisdiction, status);
    }

    console.warn(
      `⚠️ Health Alert: ${jurisdiction} is unhealthy (${status.consecutiveFailures} consecutive failures)`
    );
  }

  /**
   * Stop monitoring a provider
   */
  unregister(jurisdiction: string): void {
    const interval = this.monitoringIntervals.get(jurisdiction);
    if (interval) {
      clearInterval(interval);
      this.monitoringIntervals.delete(jurisdiction);
    }
    this.healthData.delete(jurisdiction);
  }

  /**
   * Stop all monitoring
   */
  destroy(): void {
    for (const interval of this.monitoringIntervals.values()) {
      clearInterval(interval);
    }
    this.monitoringIntervals.clear();
    this.healthData.clear();
  }
}

/**
 * Interface for health-checkable providers
 */
export interface HealthCheckable {
  getJurisdiction(): string;
  healthCheck(): Promise<void>;
}

/**
 * Internal health data storage
 */
interface HealthData {
  successTimes: number[];
  failureTimes: number[];
  responseTimes: number[];
  consecutiveFailures: number;
  lastSuccess: Date | null;
  fallbackActive: boolean;
}

/**
 * CLI command helper for health status
 */
export function formatHealthStatus(status: HealthStatus): string {
  const icon = status.healthy ? '✅' : '❌';
  const fallback = status.fallbackActive ? ' (fallback)' : '';

  return `${icon} ${status.jurisdiction}${fallback}: ${status.successRate.toFixed(1)}% success, ${status.averageResponseTime.toFixed(0)}ms avg`;
}

/**
 * CLI command helper for dashboard
 */
export function formatDashboard(dashboard: HealthDashboard): string {
  const lines = [
    `Health Dashboard (updated: ${dashboard.lastUpdated.toLocaleString()})`,
    `Overall: ${dashboard.overallHealthy ? '✅ All Healthy' : '⚠️ Some Unhealthy'}`,
    '',
  ];

  for (const provider of dashboard.providers) {
    lines.push(formatHealthStatus(provider));
  }

  return lines.join('\n');
}
