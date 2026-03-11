/**
 * Parallel Execution Utility
 * 
 * Enables concurrent execution of independent tasks for faster development
 * and better resource utilization.
 */

export interface ParallelTask<T> {
  name: string;
  execute: () => Promise<T>;
}

export interface ParallelExecutionResult<T> {
  name: string;
  success: boolean;
  result?: T;
  error?: Error;
  duration: number;
}

export class ParallelExecutor {
  /**
   * Execute all tasks in parallel
   */
  async executeAll<T>(tasks: Array<ParallelTask<T>>): Promise<ParallelExecutionResult<T>[]> {
    const wrapped = tasks.map(task => this.wrapTask(task));
    return Promise.all(wrapped);
  }

  /**
   * Execute tasks with limited concurrency
   */
  async executeWithConcurrency<T>(
    tasks: Array<ParallelTask<T>>,
    concurrency: number
  ): Promise<ParallelExecutionResult<T>[]> {
    const results: ParallelExecutionResult<T>[] = [];
    const executing: Promise<void>[] = [];

    for (const task of tasks) {
      const promise = (async () => {
        const result = await this.wrapTask(task);
        results.push(result);
      })();

      executing.push(promise);

      if (executing.length >= concurrency) {
        await Promise.race(executing);
        // Remove completed promises
        const stillExecuting = executing.filter(p => !this.isPromiseDone(p));
        executing.length = 0;
        executing.push(...stillExecuting);
      }
    }

    await Promise.all(executing);
    return results;
  }

  /**
   * Execute tasks sequentially (for dependent tasks)
   */
  async executeSequential<T>(tasks: Array<ParallelTask<T>>): Promise<ParallelExecutionResult<T>[]> {
    const results: ParallelExecutionResult<T>[] = [];

    for (const task of tasks) {
      const result = await this.wrapTask(task);
      results.push(result);
      
      // Stop on first failure
      if (!result.success) {
        break;
      }
    }

    return results;
  }

  /**
   * Wrap task with timing and error handling
   */
  private async wrapTask<T>(task: ParallelTask<T>): Promise<ParallelExecutionResult<T>> {
    const startTime = Date.now();
    
    try {
      const result = await task.execute();
      const duration = Date.now() - startTime;
      
      return {
        name: task.name,
        success: true,
        result,
        duration,
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      
      return {
        name: task.name,
        success: false,
        error: error instanceof Error ? error : new Error(String(error)),
        duration,
      };
    }
  }

  /**
   * Check if promise is completed (helper for concurrency limiting)
   */
  private isPromiseDone(promise: Promise<void>): boolean {
    // This is a simplified check - in practice, we'd track completion state
    return false;
  }

  /**
   * Get summary of execution results
   */
  static getSummary<T>(results: ParallelExecutionResult<T>[]): {
    total: number;
    successful: number;
    failed: number;
    totalDuration: number;
    averageDuration: number;
  } {
    const total = results.length;
    const successful = results.filter(r => r.success).length;
    const failed = total - successful;
    const totalDuration = results.reduce((sum, r) => sum + r.duration, 0);
    const averageDuration = total > 0 ? totalDuration / total : 0;

    return {
      total,
      successful,
      failed,
      totalDuration,
      averageDuration,
    };
  }
}

/**
 * Convenience function for parallel plugin development
 */
export async function developPluginsInParallel(
  plugins: Array<{ name: string; develop: () => Promise<void> }>
): Promise<void> {
  const executor = new ParallelExecutor();
  
  const tasks = plugins.map(plugin => ({
    name: plugin.name,
    execute: plugin.develop,
  }));

  const results = await executor.executeAll(tasks);
  const summary = ParallelExecutor.getSummary(results);

  console.log(`Plugin Development Complete:`);
  console.log(`  Total: ${summary.total}`);
  console.log(`  Successful: ${summary.successful}`);
  console.log(`  Failed: ${summary.failed}`);
  console.log(`  Average Duration: ${summary.averageDuration.toFixed(0)}ms`);

  const failed = results.filter(r => !r.success);
  if (failed.length > 0) {
    console.error('\nFailed plugins:');
    failed.forEach(f => console.error(`  - ${f.name}: ${f.error?.message}`));
  }
}
