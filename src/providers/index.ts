/**
 * Providers Index
 *
 * Central export point for all provider modules.
 */

export * from './legislation-provider.js';
export * from './nz-provider.js';
export * from './commonwealth-provider.js';
export * from './queensland-provider.js';
export * from './plugin-loader.js';
export * from './plugin-discovery.js';

// Re-export commonly used types
export type {
  LegislationProvider,
  SearchParams,
  SearchResults,
  Work,
  WorkSummary,
  VersionSummary,
  CitationStyle,
  BaseLegislationProvider,
  ProviderRegistry,
} from './legislation-provider.js';

import { getGlobalRegistry } from './legislation-provider.js';
import { NZLegislationProvider } from './nz-provider.js';
import { CommonwealthProvider } from './commonwealth-provider.js';
import { QueenslandProvider } from './queensland-provider.js';

/**
 * Initialize and register all first-party providers
 */
export function initializeProviders(config?: {
  commonwealthApiKey?: string;
  queenslandApiKey?: string;
}): void {
  const registry = getGlobalRegistry();

  // Register NZ provider (default)
  registry.register(new NZLegislationProvider());

  // Register Australian providers
  registry.register(new CommonwealthProvider(config?.commonwealthApiKey));
  registry.register(new QueenslandProvider(config?.queenslandApiKey));
}
