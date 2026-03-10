/**
 * Performance Budget Enforcement
 * 
 * Enforces performance budgets to prevent regression and ensure
 * consistent user experience.
 */

export interface PerformanceBudget {
  name: string;
  limit: number; // ms or MB depending on type
  type: 'duration' | 'memory' | 'size';
  critical: boolean;
}

export interface BudgetResult {
  budget: PerformanceBudget;
  actual: number;
  passed: boolean;
  percentage: number; // actual/limit * 100
  message: string;
}

export interface BudgetViolation {
  budget: PerformanceBudget;
  actual: number;
  exceeded: number;
  severity: 'warning' | 'error';
}

/**
 * Default performance budgets for NZ Legislation Tool
 */
export const DEFAULT_BUDGETS: PerformanceBudget[] = [
  // Startup
  { name: 'startup:cold', limit: 500, type: 'duration', critical: true },
  { name: 'startup:warm', limit: 200, type: 'duration', critical: true },
  
  // Search
  { name: 'search:nz-only', limit: 500, type: 'duration', critical: true },
  { name: 'search:au-jurisdiction', limit: 1500, type: 'duration', critical: false },
  { name: 'search:all-jurisdictions', limit: 3000, type: 'duration', critical: false },
  
  // Retrieval
  { name: 'getWork:nz', limit: 400, type: 'duration', critical: true },
  { name: 'getWork:au', limit: 1500, type: 'duration', critical: false },
  { name: 'getVersions:nz', limit: 500, type: 'duration', critical: false },
  { name: 'getVersions:au', limit: 2000, type: 'duration', critical: false },
  
  // Memory
  { name: 'memory:baseline', limit: 100, type: 'memory', critical: true }, // MB
  { name: 'memory:per-plugin', limit: 50, type: 'memory', critical: false }, // MB
  { name: 'memory:max', limit: 300, type: 'memory', critical: true }, // MB
  
  // Bundle Size
  { name: 'bundle:core', limit: 1024, type: 'size', critical: true }, // KB
  { name: 'bundle:per-plugin', limit: 512, type: 'size', critical: false }, // KB
];

export class PerformanceBudgetEnforcer {
  private budgets: Map<string, PerformanceBudget>;
  private violations: BudgetViolation[] = [];
  private strictMode: boolean;

  constructor(budgets: PerformanceBudget[] = DEFAULT_BUDGETS, strictMode: boolean = true) {
    this.budgets = new Map();
    this.strictMode = strictMode;

    for (const budget of budgets) {
      this.budgets.set(budget.name, budget);
    }
  }

  /**
   * Execute function within budget
   */
  async withinBudget<T>(budgetName: string, fn: () => Promise<T>): Promise<T> {
    const budget = this.budgets.get(budgetName);
    
    if (!budget) {
      console.warn(`Budget "${budgetName}" not found, skipping enforcement`);
      return fn();
    }

    const startTime = performance.now();
    
    try {
      const result = await fn();
      const duration = performance.now() - startTime;
      
      this.checkBudget(budget, duration);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Execute synchronous function within budget
   */
  withinBudgetSync<T>(budgetName: string, fn: () => T): T {
    const budget = this.budgets.get(budgetName);
    
    if (!budget) {
      console.warn(`Budget "${budgetName}" not found, skipping enforcement`);
      return fn();
    }

    const startTime = performance.now();
    
    try {
      const result = fn();
      const duration = performance.now() - startTime;
      
      this.checkBudget(budget, duration);
      
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if value is within budget
   */
  checkBudget(budget: PerformanceBudget, actual: number): BudgetResult {
    const percentage = (actual / budget.limit) * 100;
    const passed = actual <= budget.limit;
    
    const result: BudgetResult = {
      budget,
      actual,
      passed,
      percentage,
      message: this.formatResult(budget, actual, percentage),
    };

    if (!passed) {
      this.recordViolation(budget, actual);
    }

    return result;
  }

  /**
   * Assert that value is within budget
   */
  assertWithinBudget(budgetName: string, actual: number): void {
    const budget = this.budgets.get(budgetName);
    
    if (!budget) {
      throw new Error(`Budget "${budgetName}" not found`);
    }

    const result = this.checkBudget(budget, actual);
    
    if (!result.passed && this.strictMode) {
      throw new Error(
        `Performance budget exceeded: ${budget.name} (${actual.toFixed(0)}${this.getUnit(budget.type)} > ${budget.limit}${this.getUnit(budget.type)})`
      );
    }
  }

  /**
   * Get all budget violations
   */
  getViolations(): BudgetViolation[] {
    return [...this.violations];
  }

  /**
   * Clear violations
   */
  clearViolations(): void {
    this.violations = [];
  }

  /**
   * Get budget summary
   */
  getSummary(): {
    total: number;
    passed: number;
    failed: number;
    violationRate: number;
  } {
    const total = this.violations.length;
    const failed = this.violations.filter(v => v.severity === 'error').length;
    const passed = total - failed;
    const violationRate = total > 0 ? (failed / total) * 100 : 0;

    return {
      total,
      passed,
      failed,
      violationRate,
    };
  }

  /**
   * Record a violation
   */
  private recordViolation(budget: PerformanceBudget, actual: number): void {
    const exceeded = actual - budget.limit;
    const severity: 'warning' | 'error' = 
      exceeded > budget.limit * 0.5 ? 'error' : // >50% over budget
      exceeded > budget.limit * 0.2 ? 'warning' : // >20% over budget
      'warning';

    const violation: BudgetViolation = {
      budget,
      actual,
      exceeded,
      severity,
    };

    this.violations.push(violation);

    // Log violation
    const icon = severity === 'error' ? '❌' : '⚠️';
    console.warn(`${icon} Performance budget exceeded: ${budget.name} (${actual.toFixed(0)}${this.getUnit(budget.type)} > ${budget.limit}${this.getUnit(budget.type)})`);
  }

  /**
   * Format result message
   */
  private formatResult(budget: PerformanceBudget, actual: number, percentage: number): string {
    const icon = percentage <= 100 ? '✅' : percentage <= 120 ? '⚠️' : '❌';
    const unit = this.getUnit(budget.type);
    
    return `${icon} ${budget.name}: ${actual.toFixed(0)}${unit} / ${budget.limit}${unit} (${percentage.toFixed(1)}%)`;
  }

  /**
   * Get unit for budget type
   */
  private getUnit(type: 'duration' | 'memory' | 'size'): string {
    switch (type) {
      case 'duration': return 'ms';
      case 'memory': return 'MB';
      case 'size': return 'KB';
    }
  }

  /**
   * Add a custom budget
   */
  addBudget(budget: PerformanceBudget): void {
    this.budgets.set(budget.name, budget);
  }

  /**
   * Remove a budget
   */
  removeBudget(name: string): void {
    this.budgets.delete(name);
  }

  /**
   * Get a budget by name
   */
  getBudget(name: string): PerformanceBudget | undefined {
    return this.budgets.get(name);
  }

  /**
   * Enable strict mode (throw on violation)
   */
  enableStrictMode(): void {
    this.strictMode = true;
  }

  /**
   * Disable strict mode (warn only)
   */
  disableStrictMode(): void {
    this.strictMode = false;
  }
}

/**
 * Decorator for enforcing performance budgets on async functions
 */
export function enforceBudget(budgetName: string) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const enforcer = new PerformanceBudgetEnforcer();

    descriptor.value = async function (...args: any[]) {
      return enforcer.withinBudget(budgetName, () => originalMethod.apply(this, args));
    };

    return descriptor;
  };
}

/**
 * Test helper for performance budget testing
 */
export function testBudget(budgetName: string, actual: number): BudgetResult {
  const enforcer = new PerformanceBudgetEnforcer();
  const budget = enforcer.getBudget(budgetName);

  if (!budget) {
    throw new Error(`Budget "${budgetName}" not found`);
  }

  return enforcer.checkBudget(budget, actual);
}
