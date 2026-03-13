/**
 * Config command - Interactive configuration setup
 */

import { Command } from 'commander';

import { clearConfig, getConfig, getConfigPath, hasApiKey, setApiKey } from '../config.js';
import { maskApiKey } from '../utils/secure-config.js';

interface ConfigOptions {
  show?: boolean;
  key?: string;
  clear?: boolean;
}

export const configCommand = new Command()
  .name('config')
  .description('Configure API key and settings')
  .option('--show', 'Show current configuration')
  .option('--key <key>', 'Set API key')
  .option('--clear', 'Clear all configuration')
  .action((options: ConfigOptions) => {
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
      return;
    }

    if (options.show) {
      const config = getConfig();
      console.log('Current Configuration:');
      console.log('─'.repeat(50));
      console.log(`API Key: ${config.apiKey ? maskApiKey(config.apiKey) : 'Not set'}`);
      console.log(`Base URL: ${config.baseUrl}`);
      console.log(`Timeout: ${config.timeout}ms`);
      console.log(`Cache: ${config.cacheEnabled ? 'Enabled' : 'Disabled'}`);
      console.log(`Output Format: ${config.outputFormat}`);
      console.log(`Verbose: ${config.verbose ? 'Yes' : 'No'}`);
      console.log(`Config file: ${getConfigPath()}`);
      return;
    }

    // Interactive setup
    console.log('NZ Legislation CLI - Setup');
    console.log('─'.repeat(50));

    if (hasApiKey()) {
      console.log('✓ API key is already configured.');
      console.log('  Use --key to update or --clear to reset.');
      console.log(`  Config file: ${getConfigPath()}`);
    } else {
      console.log('API key not configured.');
      console.log('\nTo get your API key:');
      console.log('1. Visit: https://api.legislation.govt.nz/docs/');
      console.log('2. Sign up for an API key');
      console.log('3. Run: nzlegislation config --key YOUR_API_KEY');
      console.log('\nOr set environment variable:');
      console.log('  export NZ_LEGISLATION_API_KEY=your_key_here');
    }
  });
