// Vitest setup file
import { beforeAll, afterAll } from 'vitest';
import { setLoggerQuiet } from '../src/utils/logger.ts';

const originalLocalStorageDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'localStorage');

// Node 25 exposes a browser-like localStorage that warns without --localstorage-file.
// MSW only needs localStorage in browser mode, so disable it in the Node test runtime.
if (originalLocalStorageDescriptor?.configurable) {
  Object.defineProperty(globalThis, 'localStorage', {
    configurable: true,
    enumerable: false,
    writable: true,
    value: undefined,
  });
}

// Setup MSW for API mocking
beforeAll(() => {
  // Global setup for all tests
  process.env.NZ_LEGISLATION_API_KEY ||= 'test-api-key-123456';
  setLoggerQuiet(true);
});

afterAll(() => {
  // Global cleanup
  if (originalLocalStorageDescriptor) {
    Object.defineProperty(globalThis, 'localStorage', originalLocalStorageDescriptor);
  }
});
