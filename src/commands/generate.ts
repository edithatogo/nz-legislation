#!/usr/bin/env node
/**
 * Code Generation Tools
 * Generate templates for commands, models, tests, and documentation
 */

import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import { Command } from 'commander';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.join(__dirname, '..');

interface GenerateOptions {
  name: string;
  output?: string;
}

/**
 * Generate a new command template
 */
function generateCommandTemplate({ name, output }: GenerateOptions): void {
  const commandName = name.toLowerCase();
  const className = name.charAt(0).toUpperCase() + name.slice(1);

  const template = `import { Command } from 'commander';
import { logger } from '../utils/logger.js';

export const ${commandName}Command = new Command();

${commandName}Command
  .name('${commandName}')
  .description('TODO: Add description for ${commandName} command')
  .argument('[query]', 'Search query or identifier')
  .option('-l, --limit <number>', 'Maximum results', '25')
  .option('-o, --output <format>', 'Output format (table|json|csv)', 'table')
  .option('--verbose', 'Enable verbose output')
  .action(async (query?: string, options?: any) => {
    try {
      logger.info('Executing ${commandName} command...', { query, options });
      
      // TODO: Implement command logic here
      // Example:
      // const results = await someApiCall(query, options);
      // outputResults(results, options.output);
      
      console.log('Command executed successfully!');
      
    } catch (error) {
      logger.error('${className} command failed', error);
      throw error;
    }
  });
`;

  const commandsDir = path.join(projectRoot, 'src', 'commands');
  const outputPath = output || path.join(commandsDir, `${commandName}.ts`);

  if (!fs.existsSync(commandsDir) && !output) {
    fs.mkdirSync(commandsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, template);
  console.log(chalk.green(`✓ Generated command: ${outputPath}`));
}

/**
 * Generate a new model (Zod schema) template
 */
function generateModelTemplate({ name, output }: GenerateOptions): void {
  const modelName = name.charAt(0).toUpperCase() + name.slice(1);
  const fileName = name.toLowerCase();

  const template = `import { z } from 'zod';

/**
 * ${modelName} Schema
 * Auto-generated model template
 */

export const ${modelName}Schema = z.object({
  id: z.string().describe('Unique identifier'),
  title: z.string().describe('Title or name'),
  description: z.string().optional().describe('Optional description'),
  status: z.enum(['draft', 'active', 'repealed', 'expired']).optional(),
  createdAt: z.string().datetime().optional().describe('ISO 8601 timestamp'),
  updatedAt: z.string().datetime().optional().describe('ISO 8601 timestamp'),
  
  // TODO: Add additional fields as needed
  // metadata: z.record(z.unknown()).optional(),
});

export type ${modelName} = z.infer<typeof ${modelName}Schema>;

/**
 * Type guard to validate ${modelName} data
 */
export function is${modelName}(data: unknown): data is ${modelName} {
  return ${modelName}Schema.safeParse(data).success;
}

/**
 * Validate and parse ${modelName} data
 * @throws {z.ZodError} if validation fails
 */
export function parse${modelName}(data: unknown): ${modelName} {
  return ${modelName}Schema.parse(data);
}
`;

  const modelsDir = path.join(projectRoot, 'src', 'models');
  const outputPath = output || path.join(modelsDir, `${fileName}.ts`);

  if (!fs.existsSync(modelsDir) && !output) {
    fs.mkdirSync(modelsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, template);
  console.log(chalk.green(`✓ Generated model: ${outputPath}`));
}

/**
 * Generate a test template
 */
function generateTestTemplate({ name, output }: GenerateOptions): void {
  const testName = name.toLowerCase();
  const className = name.charAt(0).toUpperCase() + name.slice(1);

  const template = `import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ${className}Schema } from '../src/models/${testName}.js';

describe('${className}', () => {
  beforeEach(() => {
    // Setup before each test
  });

  afterEach(() => {
    // Cleanup after each test
  });

  describe('Schema Validation', () => {
    it('should validate valid ${testName} data', () => {
      const validData = {
        id: 'test-123',
        title: 'Test ${className}',
        status: 'active' as const,
      };

      const result = ${className}Schema.safeParse(validData);
      
      expect(result.success).toBe(true);
    });

    it('should reject invalid ${testName} data', () => {
      const invalidData = {
        id: 123, // Should be string
        title: '', // Too short
      };

      const result = ${className}Schema.safeParse(invalidData);
      
      expect(result.success).toBe(false);
    });
  });

  describe('Type Guards', () => {
    it('should identify valid ${testName} instances', () => {
      const data = {
        id: 'test-123',
        title: 'Test ${className}',
      };

      // TODO: Import and test type guard
      // expect(is${className}(data)).toBe(true);
    });
  });

  // TODO: Add more tests based on your use case
});
`;

  const testsDir = path.join(projectRoot, 'tests');
  const outputPath = output || path.join(testsDir, `${testName}.test.ts`);

  if (!fs.existsSync(testsDir) && !output) {
    fs.mkdirSync(testsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, template);
  console.log(chalk.green(`✓ Generated test: ${outputPath}`));
}

/**
 * Generate documentation template
 */
function generateDocsTemplate({ name, output }: GenerateOptions): void {
  const docName = name.toLowerCase();
  const className = name.charAt(0).toUpperCase() + name.slice(1);

  const template = `# ${className}

> Auto-generated documentation template

## Overview

Brief description of what this feature/command does.

## Usage

\`\`\`bash
nzlegislation ${docName} [options]
\`\`\`

## Options

| Option | Description | Default |
|--------|-------------|---------|
| \`-l, --limit <number>\` | Maximum results | 25 |
| \`-o, --output <format>\` | Output format | table |
| \`--verbose\` | Enable verbose output | false |

## Examples

### Basic Usage

\`\`\`bash
nzlegislation ${docName} "query"
\`\`\`

### With Options

\`\`\`bash
nzlegislation ${docName} "query" --limit 50 --output json
\`\`\`

### Advanced Usage

\`\`\`bash
# Example advanced usage
nzlegislation ${docName} --verbose
\`\`\`

## Output Format

### Table Format (Default)

\`\`\`
┌─────────┬─────────────────┬────────┐
│ ID      │ Title           │ Status │
├─────────┼─────────────────┼────────┤
│ ...     │ ...             │ ...    │
└─────────┴─────────────────┴────────┘
\`\`\`

### JSON Format

\`\`\`json
{
  "id": "...",
  "title": "...",
  "status": "..."
}
\`\`\`

## Error Handling

### Common Errors

| Error Code | Description | Solution |
|------------|-------------|----------|
| \`INVALID_INPUT\` | Invalid query or parameters | Check input format |
| \`NOT_FOUND\` | Resource not found | Verify ID exists |
| \`RATE_LIMIT\` | Rate limit exceeded | Wait and retry |

## Related Commands

- \`search\` - Search for legislation
- \`get\` - Get specific work details
- \`export\` - Export results

## API Reference

- [API Documentation](https://api.legislation.govt.nz/docs/)
- [GitHub Repository](https://github.com/dylanmordaunt/nz-legislation-tool)

---

*Generated on ${new Date().toISOString().split('T')[0]}*
`;

  const docsDir = path.join(projectRoot, 'docs');
  const outputPath = output || path.join(docsDir, `${docName}.md`);

  if (!fs.existsSync(docsDir) && !output) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  fs.writeFileSync(outputPath, template);
  console.log(chalk.green(`✓ Generated documentation: ${outputPath}`));
}

/**
 * Create generate command with subcommands
 */
export function createGenerateCommand(): Command {
  const cmd = new Command();

  cmd.name('generate').description('Generate code templates');

  // Generate command subcommand
  const commandCmd = new Command('command');
  commandCmd
    .description('Generate a new command template')
    .argument('<name>', 'Command name')
    .option('-o, --output <path>', 'Output file path')
    .action((name: string, options: { output?: string }) => {
      generateCommandTemplate({ name, output: options.output });
    });

  // Generate model subcommand
  const modelCmd = new Command('model');
  modelCmd
    .description('Generate a new model (Zod schema)')
    .argument('<name>', 'Model name')
    .option('-o, --output <path>', 'Output file path')
    .action((name: string, options: { output?: string }) => {
      generateModelTemplate({ name, output: options.output });
    });

  // Generate test subcommand
  const testCmd = new Command('test');
  testCmd
    .description('Generate a test template')
    .argument('<name>', 'Test name')
    .option('-o, --output <path>', 'Output file path')
    .action((name: string, options: { output?: string }) => {
      generateTestTemplate({ name, output: options.output });
    });

  // Generate docs subcommand
  const docsCmd = new Command('docs');
  docsCmd
    .description('Generate documentation template')
    .argument('<name>', 'Documentation topic')
    .option('-o, --output <path>', 'Output file path')
    .action((name: string, options: { output?: string }) => {
      generateDocsTemplate({ name, output: options.output });
    });

  cmd.addCommand(commandCmd).addCommand(modelCmd).addCommand(testCmd).addCommand(docsCmd);

  return cmd;
}
