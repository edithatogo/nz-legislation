import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import { defineConfig } from 'vitest/config';

const rootDir = fileURLToPath(new URL('.', import.meta.url));
const srcDir = resolve(rootDir, 'src');

export default defineConfig({
  resolve: {
    alias: [
      { find: /^@models$/, replacement: resolve(srcDir, 'models', 'index.ts') },
      { find: /^@models\/(.*)$/, replacement: `${resolve(srcDir, 'models')}/$1` },
      { find: /^@utils$/, replacement: resolve(srcDir, 'utils', 'index.ts') },
      { find: /^@utils\/(.*)$/, replacement: `${resolve(srcDir, 'utils')}/$1` },
      { find: /^@output$/, replacement: resolve(srcDir, 'output', 'index.ts') },
      { find: /^@output\/(.*)$/, replacement: `${resolve(srcDir, 'output')}/$1` },
      { find: /^@commands\/(.*)$/, replacement: `${resolve(srcDir, 'commands')}/$1` },
      { find: /^@mcp\/(.*)$/, replacement: `${resolve(srcDir, 'mcp')}/$1` },
      { find: /^@client$/, replacement: resolve(srcDir, 'client.ts') },
      { find: /^@config$/, replacement: resolve(srcDir, 'config.ts') },
      { find: /^@errors$/, replacement: resolve(srcDir, 'errors.ts') },
    ],
  },
  test: {
    globals: true,
    environment: 'node',
    include: [
      'tests/**/*.test.ts',
      'tests/integration/**/*.test.ts',
      'tests/e2e/**/*.test.ts',
      'tests/property/**/*.test.ts',
      'tests/hypothesis/**/*.test.ts',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: ['node_modules', 'dist', 'tests/', '*.config.*'],
      thresholds: {
        global: {
          branches: 60,
          functions: 60,
          lines: 60,
          statements: 60,
        },
      },
    },
    testTimeout: 30000,
    setupFiles: ['./tests/setup.ts'],
  },
});
