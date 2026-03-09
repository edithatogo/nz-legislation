import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/cli.ts'],
  format: ['cjs'],
  dts: true,
  minify: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  splitting: false,
  cjsInterop: true,
  outDir: 'dist',
  platform: 'node',
  target: 'node18',
  banner: {
    js: '#!/usr/bin/env node',
  },
});
