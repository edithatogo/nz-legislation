/**
 * Analytics Collector (Opt-in)
 * 
 * Anonymous usage statistics to improve the tool.
 * Completely opt-in, no personal data collected.
 */

export interface AnalyticsEvent {
  event: string;
  properties: Record<string, any>;
  timestamp: Date;
  sessionId: string;
}

export interface AnalyticsConfig {
  enabled: boolean;
  anonymous: boolean;
  endpoint?: string;
}

export class AnalyticsCollector {
  private config: AnalyticsConfig;
  private queue: AnalyticsEvent[] = [];
  private sessionId: string;
  private flushInterval: NodeJS.Timeout | null = null;

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
    
    if (config.enabled) {
      this.startAutoFlush();
    }
  }

  /**
   * Track an event
   */
  track(event: Omit<AnalyticsEvent, 'timestamp' | 'sessionId'>): void {
    if (!this.config.enabled) {
      return;
    }

    const analyticsEvent: AnalyticsEvent = {
      ...event,
      timestamp: new Date(),
      sessionId: this.sessionId,
    };

    // Anonymize if configured
    if (this.config.anonymous) {
      analyticsEvent.properties = this.anonymize(analyticsEvent.properties);
    }

    this.queue.push(analyticsEvent);

    // Flush if queue is large
    if (this.queue.length >= 10) {
      this.flush();
    }
  }

  /**
   * Track command usage
   */
  trackCommand(command: string, duration: number, success: boolean): void {
    this.track({
      event: 'command',
      properties: {
        command,
        duration,
        success,
      },
    });
  }

  /**
   * Track search
   */
  trackSearch(jurisdiction: string, query: string, resultCount: number, duration: number): void {
    this.track({
      event: 'search',
      properties: {
        jurisdiction,
        queryLength: query.length,
        resultCount,
        duration,
      },
    });
  }

  /**
   * Track plugin usage
   */
  trackPlugin(plugin: string, action: 'load' | 'search' | 'retrieve', duration: number): void {
    this.track({
      event: 'plugin',
      properties: {
        plugin,
        action,
        duration,
      },
    });
  }

  /**
   * Track error
   */
  trackError(error: string, jurisdiction?: string): void {
    this.track({
      event: 'error',
      properties: {
        error,
        jurisdiction,
      },
    });
  }

  /**
   * Enable analytics
   */
  enable(): void {
    this.config.enabled = true;
    this.startAutoFlush();
    console.log('✅ Analytics enabled');
  }

  /**
   * Disable analytics
   */
  disable(): void {
    this.config.enabled = false;
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
      this.flushInterval = null;
    }
    console.log('❌ Analytics disabled');
  }

  /**
   * Flush queue to server
   */
  async flush(): Promise<void> {
    if (!this.config.enabled || this.queue.length === 0) {
      return;
    }

    const events = [...this.queue];
    this.queue = [];

    try {
      const endpoint = this.config.endpoint ?? 'https://analytics.nzlegislation.tool/collect';
      
      // In real implementation, send to server
      // For now, just log
      console.debug(`Analytics: Sending ${events.length} events to ${endpoint}`);
      
      // await fetch(endpoint, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events }),
      // });
    } catch (error) {
      // Silently fail - analytics shouldn't break the app
      console.debug('Analytics flush failed:', error);
      // Re-queue events
      this.queue.unshift(...events);
    }
  }

  /**
   * Get current config
   */
  getConfig(): AnalyticsConfig {
    return { ...this.config };
  }

  /**
   * Get queue length
   */
  getQueueLength(): number {
    return this.queue.length;
  }

  /**
   * Start auto-flush interval
   */
  private startAutoFlush(): void {
    if (this.flushInterval) {
      return;
    }

    this.flushInterval = setInterval(() => {
      this.flush();
    }, 60 * 1000); // Every minute
  }

  /**
   * Anonymize properties
   */
  private anonymize(properties: Record<string, any>): Record<string, any> {
    const anonymized: Record<string, any> = {};

    for (const [key, value] of Object.entries(properties)) {
      // Remove potentially identifying info
      if (key.includes('email') || key.includes('user') || key.includes('ip')) {
        continue;
      }

      // Keep numeric and boolean values
      if (typeof value === 'number' || typeof value === 'boolean') {
        anonymized[key] = value;
      }

      // Keep short strings (likely not identifying)
      if (typeof value === 'string' && value.length < 50) {
        anonymized[key] = value;
      }
    }

    return anonymized;
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Destroy collector
   */
  destroy(): void {
    if (this.flushInterval) {
      clearInterval(this.flushInterval);
    }
    this.flush();
  }
}

/**
 * Create analytics instance from config
 */
export function createAnalytics(config: AnalyticsConfig): AnalyticsCollector {
  return new AnalyticsCollector(config);
}

/**
 * CLI command helpers
 */
export function formatAnalyticsStatus(config: AnalyticsConfig): string {
  const icon = config.enabled ? '✅' : '❌';
  const anonymous = config.anonymous ? ' (anonymous)' : '';
  
  return `${icon} Analytics: ${config.enabled ? 'Enabled' : 'Disabled'}${anonymous}`;
}

/**
 * Prompt user to enable analytics
 */
export function promptEnableAnalytics(): void {
  console.log([
    '',
    '📊 Help improve NZ Legislation Tool!',
    '',
    'Would you like to enable anonymous analytics?',
    'We collect:',
    '  - Command usage (which commands are used)',
    '  - Performance metrics (how fast commands run)',
    '  - Error rates (when things go wrong)',
    '',
    'We DO NOT collect:',
    '  - Personal information',
    '  - Search queries',
    '  - API keys or credentials',
    '',
    'You can change this setting anytime with:',
    '  nzlegislation config --analytics enable',
    '  nzlegislation config --analytics disable',
    '',
  ].join('\n'));
}
