/**
 * Interactive Help Command
 * Provides menu-driven help navigation for NZ Legislation CLI
 */

import chalk from 'chalk';
import { Command } from 'commander';
import * as readline from 'readline';

interface HelpTopic {
  id: string;
  title: string;
  description: string;
  examples: string[];
  relatedCommands?: string[];
}

const helpTopics: HelpTopic[] = [
  {
    id: 'search',
    title: 'Search Legislation',
    description: 'Search for legislation works by keyword, type, or status',
    examples: [
      'nzlegislation search --query "health"',
      'nzlegislation search --query "health" --type act --limit 10',
      'nzlegislation search --query "covid" --status in-force',
    ],
    relatedCommands: ['get', 'export'],
  },
  {
    id: 'get',
    title: 'Get Legislation Details',
    description: 'Retrieve detailed information about a specific work',
    examples: [
      'nzlegislation get "act_public_1989_18"',
      'nzlegislation get "act_public_1989_18" --versions',
      'nzlegislation get "act_public_1989_18" --format json',
    ],
    relatedCommands: ['search', 'cite'],
  },
  {
    id: 'export',
    title: 'Export Legislation',
    description: 'Export search results to CSV, JSON, or NDJSON format',
    examples: [
      'nzlegislation export --query "health" --output health.csv',
      'nzlegislation export --query "health" --output health.json --format json',
      'nzlegislation export --query "health" --output health.ndjson --format ndjson',
    ],
    relatedCommands: ['search'],
  },
  {
    id: 'cite',
    title: 'Generate Citations',
    description: 'Generate citations in various academic styles',
    examples: [
      'nzlegislation cite "act_public_1989_18" --style nzmj',
      'nzlegislation cite "act_public_1989_18" --style bibtex',
      'nzlegislation cite "act_public_1989_18" --style ris',
      'nzlegislation cite "act_public_1989_18" --style apa',
    ],
    relatedCommands: ['get'],
  },
  {
    id: 'config',
    title: 'Configuration',
    description: 'Manage API key and CLI settings',
    examples: [
      'nzlegislation config --key YOUR_API_KEY',
      'nzlegislation config --show',
      'nzlegislation config --clear',
    ],
    relatedCommands: [],
  },
  {
    id: 'cache',
    title: 'Cache Management',
    description: 'View and manage API response cache',
    examples: [
      'nzlegislation cache --status',
      'nzlegislation cache --clear',
      'nzlegislation cache --stats',
    ],
    relatedCommands: [],
  },
  {
    id: 'troubleshooting',
    title: 'Troubleshooting',
    description: 'Common issues and solutions',
    examples: [
      chalk.yellow('Issue: API key not working'),
      '  → Run: nzlegislation config --show',
      '  → Run: nzlegislation config --key YOUR_API_KEY',
      '',
      chalk.yellow('Issue: Rate limit exceeded'),
      '  → Wait 5 minutes and try again',
      '  → Use --limit to reduce requests',
      '',
      chalk.yellow('Issue: Network error'),
      '  → Check internet connection',
      '  → Verify API URL: https://api.legislation.govt.nz',
    ],
    relatedCommands: ['config'],
  },
];

/**
 * Create interactive help command
 */
export function createInteractiveHelpCommand(): Command {
  const cmd = new Command();
  
  cmd
    .name('help-interactive')
    .alias('help-i')
    .description('Interactive help system with menu navigation')
    .action(async () => {
      console.log(chalk.blue.bold('\n📚 NZ Legislation Tool - Interactive Help\n'));
      console.log('Use arrow keys to navigate, Enter to select, q to quit\n');

      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });

      let selectedIndex = 0;

      const showMenu = () => {
        console.clear();
        console.log(chalk.blue.bold('\n📚 NZ Legislation Tool - Interactive Help\n'));
        console.log('Select a topic:\n');

        helpTopics.forEach((topic, index) => {
          const isSelected = index === selectedIndex;
          const symbol = isSelected ? chalk.green('❯') : ' ';
          const color = isSelected ? chalk.green.bold : chalk.white;
          console.log(`${symbol} ${color(topic.title)} - ${topic.description}`);
        });

        console.log('\n' + chalk.gray('q - Quit'));
        console.log(chalk.gray('↑/↓ - Navigate | Enter - Select\n'));
      };

      const showTopic = (topic: HelpTopic) => {
        console.clear();
        console.log(chalk.blue.bold(`\n📖 ${topic.title}\n`));
        console.log(`${topic.description}\n`);

        console.log(chalk.yellow.bold('Examples:'));
        topic.examples.forEach((example) => {
          console.log(`  ${chalk.cyan(example)}`);
        });

        if (topic.relatedCommands && topic.relatedCommands.length > 0) {
          console.log('\n' + chalk.yellow.bold('Related Commands:'));
          topic.relatedCommands.forEach((cmdName) => {
            console.log(`  ${chalk.green(`nzlegislation ${cmdName} --help`)}`);
          });
        }

        console.log('\n' + chalk.gray('Press Enter to return to menu...'));
      };

      // Handle keyboard input
      const handleInput = async (): Promise<void> => {
        return new Promise((resolve) => {
          rl.once('data', (key) => {
            const input = key.toString().toLowerCase();

            if (input === 'q') {
              console.log(chalk.green('\n👋 Goodbye!\n'));
              rl.close();
              process.exit(0);
            }

            if (input === '\r' || input === '\n') {
              // Show selected topic
              const topic = helpTopics[selectedIndex];
              showTopic(topic);

              // Wait for Enter to return
              rl.once('data', () => {
                showMenu();
                handleInput().then(resolve);
              });
              return;
            }

            if (input === '\x1b[A') { // Up arrow
              selectedIndex = Math.max(0, selectedIndex - 1);
            } else if (input === '\x1b[B') { // Down arrow
              selectedIndex = Math.min(helpTopics.length - 1, selectedIndex + 1);
            }

            showMenu();
            handleInput().then(resolve);
          });
        });
      };

      showMenu();
      await handleInput();
    });
  
  return cmd;
}

/**
 * Create contextual help command
 */
export function createContextualHelpCommand(): Command {
  const cmd = new Command();
  
  cmd
    .name('help-context')
    .description('Show contextual help for common scenarios')
    .argument('[scenario]', 'Scenario: auth, rate-limit, network, export, cite')
    .action((scenario?: string) => {
      if (!scenario) {
        console.log(chalk.blue.bold('\n📚 Contextual Help\n'));
        console.log('Available scenarios:\n');
        console.log('  auth       - Authentication and API key issues');
        console.log('  rate-limit - Rate limiting and quotas');
        console.log('  network    - Network and connectivity issues');
        console.log('  export     - Export format and file issues');
        console.log('  cite       - Citation format and style issues');
        console.log('\nUsage: nzlegislation help-context <scenario>\n');
        return;
      }

      const scenarios: Record<string, string[]> = {
        'auth': [
          chalk.yellow.bold('Authentication Issues'),
          '',
          chalk.green('Check API Key Configuration:'),
          '  nzlegislation config --show',
          '',
          chalk.green('Set API Key:'),
          '  nzlegislation config --key YOUR_API_KEY',
          '',
          chalk.green('Get API Key:'),
          '  Visit: https://api.legislation.govt.nz/docs/',
          '',
          chalk.green('Environment Variable:'),
          '  export NZ_LEGISLATION_API_KEY=your_key',
        ],
        'rate-limit': [
          chalk.yellow.bold('Rate Limiting'),
          '',
          chalk.green('Current Limits:'),
          '  • 10,000 requests/day',
          '  • 2,000 requests/5min (burst)',
          '',
          chalk.green('Solutions:'),
          '  1. Wait 5 minutes and retry',
          '  2. Use --limit to reduce batch size',
          '  3. Enable caching: nzlegislation cache --status',
          '  4. Export large datasets in chunks',
          '',
          chalk.green('Example:'),
          '  nzlegislation search --query "health" --limit 50',
        ],
        'network': [
          chalk.yellow.bold('Network Issues'),
          '',
          chalk.green('Check Connection:'),
          '  • Verify internet connection',
          '  • Check API status: https://api.legislation.govt.nz',
          '  • Try: curl https://api.legislation.govt.nz',
          '',
          chalk.green('Firewall/Proxy:'),
          '  • Ensure HTTPS (port 443) is allowed',
          '  • Configure proxy if needed',
          '',
          chalk.green('Timeout Issues:'),
          '  • Increase timeout: export NZ_LEGISLATION_TIMEOUT=60000',
        ],
        'export': [
          chalk.yellow.bold('Export Issues'),
          '',
          chalk.green('Supported Formats:'),
          '  • table (default) - Pretty terminal table',
          '  • json - JSON format',
          '  • csv - CSV format',
          '  • ndjson - Newline-delimited JSON',
          '',
          chalk.green('Examples:'),
          '  nzlegislation export --query "health" --output health.csv',
          '  nzlegislation export --query "health" --format json',
          '',
          chalk.green('Troubleshooting:'),
          '  • Check file path permissions',
          '  • Ensure directory exists',
          '  • Use absolute paths if needed',
        ],
        'cite': [
          chalk.yellow.bold('Citation Issues'),
          '',
          chalk.green('Supported Styles:'),
          '  • nzmj - New Zealand Medical Journal',
          '  • bibtex - BibTeX format',
          '  • ris - RIS format (EndNote, Mendeley)',
          '  • apa - APA style',
          '',
          chalk.green('Examples:'),
          '  nzlegislation cite "act_public_1989_18" --style nzmj',
          '  nzlegislation cite "act_public_1989_18" --style bibtex',
          '',
          chalk.green('Missing Data:'),
          '  • Some works may lack metadata',
          '  • Use --verbose to see available fields',
        ],
      };

      const help = scenarios[scenario];
      if (!help) {
        console.log(chalk.red(`\nUnknown scenario: ${scenario}\n`));
        console.log('Run without arguments to see available scenarios.\n');
        process.exit(1);
      }

      console.log(help.join('\n'));
      console.log();
    });
  
  return cmd;
}
