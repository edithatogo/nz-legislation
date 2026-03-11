/**
 * Cache command - Manage API response cache
 */

import { Command } from 'commander';

import { clearCache, getCacheStats } from '../client.js';
import { logger } from '../utils/logger.js';

interface CacheOptions {
  clear?: boolean;
  stats?: boolean;
  pattern?: string;
}

export const cacheCommand = new Command()
  .name('cache')
  .description('Manage API response cache')
  .option('--clear', 'Clear all cached data')
  .option('--pattern <pattern>', 'Clear cache entries matching pattern')
  .option('--stats', 'Show cache statistics')
  .action((options: CacheOptions) => {
    try {
      if (options.stats || (!options.clear && !options.pattern)) {
        // Show stats by default
        const stats = getCacheStats();
        console.log('Cache Statistics:');
        console.log(`  Size: ${stats.size} / ${stats.maxSize} entries`);
        if (stats.keys.length > 0) {
          console.log('  Recent keys:');
          stats.keys.forEach((key, i) => {
            console.log(`    ${i + 1}. ${key}`);
          });
        }
      }

      if (options.clear) {
        if (options.pattern) {
          clearCache(options.pattern);
          console.log(`Cache entries matching "${options.pattern}" cleared.`);
        } else {
          clearCache();
          console.log('Cache cleared.');
        }
      }
    } catch (error) {
      logger.error('Cache operation failed', error instanceof Error ? error : undefined);
      console.error('Error:', error instanceof Error ? error.message : 'Unknown error');
      process.exit(1);
    }
  });
