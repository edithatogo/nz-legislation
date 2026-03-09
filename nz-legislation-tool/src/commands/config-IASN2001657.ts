/**
 * Config command - Interactive configuration setup
 */

import { Command } from 'commander';
import { getConfig, setApiKey, hasApiKey, clearConfig, setConfig, getConfigPath } from '../config.js';

export const configCommand = new Command()
  .name('config')
  .description('Configure API key and settings')
  .option('--show', 'Show current configuration')
  .option('--key <key>', 'Set API key')
  .option('--daily-limit <number>', 'Set daily rate limit (default: 10000)')
  .option('--burst-limit <number>', 'Set burst rate limit (default: 2000)')
  .option('--safety-margin <number>', 'Set safety margin 0-1 (default: 0.1 = 10%)')
  .option('--clear', 'Clear all configuration')
  .action((options) => {
    if (options.clear) {
      clearConfig();
      console.log('✓ Configuration cleared.');
      console.log('Run "nzlegislation config" to set up again.');
      return;
    }

    if (options.key) {
      setApiKey(options.key);
      console.log('✓ API key saved.');
      console.log(`  Stored at: ${getConfigPath()}`);
    }
    
    if (options.dailyLimit) {
      const limit = parseInt(options.dailyLimit, 10);
      if (isNaN(limit) || limit < 1) {
        console.error('Error: Daily limit must be a positive number');
        process.exit(1);
      }
      setConfig('dailyLimit', limit);
      console.log(`✓ Daily limit set to ${limit} requests`);
    }
    
    if (options.burstLimit) {
      const limit = parseInt(options.burstLimit, 10);
      if (isNaN(limit) || limit < 1) {
        console.error('Error: Burst limit must be a positive number');
        process.exit(1);
      }
      setConfig('burstLimit', limit);
      console.log(`✓ Burst limit set to ${limit} requests per 5 minutes`);
    }
    
    if (options.safetyMargin) {
      const margin = parseFloat(options.safetyMargin);
      if (isNaN(margin) || margin < 0 || margin > 1) {
        console.error('Error: Safety margin must be between 0 and 1');
        process.exit(1);
      }
      setConfig('rateLimitSafetyMargin', margin);
      console.log(`✓ Safety margin set to ${(margin * 100).toFixed(0)}%`);
    }

    if (options.show || (!options.key && !options.dailyLimit && !options.burstLimit && !options.safetyMargin)) {
      const config = getConfig();
      console.log('Current Configuration:');
      console.log('─'.repeat(50));
      console.log(`API Key: ${config.apiKey ? '***' + config.apiKey.slice(-4) : 'Not set'}`);
      console.log(`Base URL: ${config.baseUrl}`);
      console.log(`Timeout: ${config.timeout}ms`);
      console.log(`Cache: ${config.cacheEnabled ? 'Enabled' : 'Disabled'}`);
      console.log(`\nRate Limits:`);
      console.log(`  Daily Limit: ${config.dailyLimit.toLocaleString()} requests/day`);
      console.log(`  Burst Limit: ${config.burstLimit.toLocaleString()} requests/5min`);
      console.log(`  Safety Margin: ${(config.rateLimitSafetyMargin * 100).toFixed(0)}%`);
      console.log(`  Effective Daily: ${Math.floor(config.dailyLimit * (1 - config.rateLimitSafetyMargin)).toLocaleString()} requests/day`);
      console.log(`  Effective Burst: ${Math.floor(config.burstLimit * (1 - config.rateLimitSafetyMargin)).toLocaleString()} requests/5min`);
      console.log(`\nOutput Format: ${config.outputFormat}`);
      console.log(`Verbose: ${config.verbose ? 'Yes' : 'No'}`);
      console.log(`Config file: ${getConfigPath()}`);
      
      if (!hasApiKey()) {
        console.log('\n⚠️  API key not configured.');
        console.log('  Run: nzlegislation config --key YOUR_API_KEY');
      }
    }
  });
