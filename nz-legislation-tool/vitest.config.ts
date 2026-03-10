import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@models/index': path.resolve(__dirname, './src/models/index.ts'),
      '@models': path.resolve(__dirname, './src/models'),
      '@commands': path.resolve(__dirname, './src/commands'),
      '@utils/logger': path.resolve(__dirname, './src/utils/logger.ts'),
      '@utils/secure-config': path.resolve(__dirname, './src/utils/secure-config.ts'),
      '@utils/env-loader': path.resolve(__dirname, './src/utils/env-loader.ts'),
      '@utils/validation': path.resolve(__dirname, './src/utils/validation.ts'),
      '@utils': path.resolve(__dirname, './src/utils'),
      '@output/index': path.resolve(__dirname, './src/output/index.ts'),
      '@output': path.resolve(__dirname, './src/output'),
      '@mcp': path.resolve(__dirname, './src/mcp'),
      '@client': path.resolve(__dirname, './src/client.ts'),
      '@config': path.resolve(__dirname, './src/config.ts'),
      '@errors': path.resolve(__dirname, './src/errors.ts'),
    },
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
