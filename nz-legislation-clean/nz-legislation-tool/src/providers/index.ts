/**
 * Providers Index
 * 
 * Central export point for all provider modules.
 */

export * from './legislation-provider.js';
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

export type {
  PluginManifest,
  LoadedPlugin,
  PluginLoader,
} from './plugin-loader.js';

export type {
  DiscoveryOptions,
  PluginDiscovery,
} from './plugin-discovery.js';
