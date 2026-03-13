/**
 * Plugin Loader
 *
 * Dynamically loads and registers jurisdiction plugins.
 * Supports both official and community plugins.
 */

import { LegislationProvider, ProviderRegistry } from '../providers/legislation-provider.js';
import { CompatibilityMatrix } from '../utils/compatibility-matrix.js';
import { getGlobalMarketplace } from '../utils/plugin-marketplace.js';

export interface PluginManifest {
  name: string;
  version: string;
  main: string;
  provider: string; // Export name of the provider class
  peerDependencies: Record<string, string>;
  pluginType: 'official' | 'community';
  pluginStatus: 'stable' | 'beta' | 'alpha';
}

export interface LoadedPlugin {
  manifest: PluginManifest;
  provider: LegislationProvider;
  loaded: boolean;
  error?: Error;
}

export class PluginLoader {
  private registry: ProviderRegistry;
  private compatibilityMatrix: CompatibilityMatrix;
  private loadedPlugins: Map<string, LoadedPlugin> = new Map();
  private coreVersion: string;

  constructor(coreVersion: string, registry?: ProviderRegistry) {
    this.coreVersion = coreVersion;
    this.registry = registry ?? new ProviderRegistry();
    this.compatibilityMatrix = new CompatibilityMatrix(coreVersion);
  }

  /**
   * Load a plugin from path
   */
  async loadPlugin(pluginPath: string): Promise<LoadedPlugin> {
    try {
      // Import plugin module
      const module = await import(pluginPath);

      // Get manifest
      const manifest: PluginManifest = module.default?.manifest ?? module.manifest;

      if (!manifest) {
        throw new Error('Plugin manifest not found');
      }

      // Verify plugin integrity (trust official plugins, warn on community)
      if (manifest.pluginType === 'community') {
        console.warn(
          `⚠️  Loading community plugin: ${manifest.name}. Ensure you trust the source.`
        );
      }

      // Check compatibility
      this.compatibilityMatrix.register({
        name: manifest.name,
        version: manifest.version,
        requires: {
          core: manifest.peerDependencies['nz-legislation-tool'] ?? '*',
        },
      });

      if (!this.compatibilityMatrix.check(manifest.name, manifest.version)) {
        throw new Error(
          `Plugin ${manifest.name}@${manifest.version} is not compatible with core v${this.coreVersion}`
        );
      }

      // Get provider class and instantiate
      const ProviderClass = module[manifest.provider] ?? module.default;

      if (!ProviderClass) {
        throw new Error(`Provider class "${manifest.provider}" not found in plugin`);
      }

      const provider = new ProviderClass();

      // Verify provider implements interface
      if (!this.isValidProvider(provider)) {
        throw new Error('Plugin does not implement LegislationProvider interface');
      }

      // Register provider
      this.registry.register(provider);

      // Store loaded plugin
      const loadedPlugin: LoadedPlugin = {
        manifest,
        provider,
        loaded: true,
      };

      this.loadedPlugins.set(manifest.name, loadedPlugin);

      console.log(`✅ Plugin loaded: ${manifest.name}@${manifest.version}`);

      return loadedPlugin;
    } catch (error) {
      const loadedPlugin: LoadedPlugin = {
        manifest: {
          name: pluginPath,
          version: 'unknown',
          main: '',
          provider: '',
          peerDependencies: {},
          pluginType: 'community',
          pluginStatus: 'alpha',
        },
        provider: null as any,
        loaded: false,
        error: error instanceof Error ? error : new Error(String(error)),
      };

      this.loadedPlugins.set(pluginPath, loadedPlugin);

      console.error(`❌ Failed to load plugin: ${pluginPath}`);
      console.error(`   Error: ${error instanceof Error ? error.message : String(error)}`);

      return loadedPlugin;
    }
  }

  /**
   * Load multiple plugins in parallel
   */
  async loadPlugins(pluginPaths: string[]): Promise<LoadedPlugin[]> {
    const results = await Promise.allSettled(pluginPaths.map(path => this.loadPlugin(path)));

    return results
      .filter((r): r is PromiseFulfilledResult<LoadedPlugin> => r.status === 'fulfilled')
      .map(r => r.value);
  }

  /**
   * Auto-discover plugins from directory
   */
  async discoverPlugins(directory: string): Promise<string[]> {
    const plugins: string[] = [];

    try {
      const fs = await import('fs');
      const path = await import('path');

      if (!fs.existsSync(directory)) {
        console.debug(`Plugin directory not found: ${directory}`);
        return plugins;
      }

      const files = fs.readdirSync(directory);

      for (const file of files) {
        if (file.startsWith('@')) {
          // Scoped package directory
          const scopeDir = path.join(directory, file);
          const scopedPlugins = await this.discoverPlugins(scopeDir);
          plugins.push(...scopedPlugins.map(p => path.join(file, p)));
        } else if (file.startsWith('nz-legislation-') || file.startsWith('legislation-')) {
          // Plugin directory
          plugins.push(file);
        }
      }

      console.log(`🔍 Discovered ${plugins.length} potential plugins in ${directory}`);
    } catch (error) {
      console.error('Error discovering plugins:', error);
    }

    return plugins;
  }

  /**
   * Get loaded plugin
   */
  getPlugin(name: string): LoadedPlugin | undefined {
    return this.loadedPlugins.get(name);
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): LoadedPlugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * Get registry
   */
  getRegistry(): ProviderRegistry {
    return this.registry;
  }

  /**
   * Get compatibility matrix
   */
  getCompatibilityMatrix(): CompatibilityMatrix {
    return this.compatibilityMatrix;
  }

  /**
   * Unload plugin
   */
  unloadPlugin(name: string): void {
    const plugin = this.loadedPlugins.get(name);

    if (plugin) {
      // Note: In Node.js, we can't truly unload modules, but we can remove from registry
      this.loadedPlugins.delete(name);
      console.log(`Plugin unloaded: ${name}`);
    }
  }

  /**
   * Get plugin status report
   */
  getStatusReport(): {
    coreVersion: string;
    totalPlugins: number;
    loaded: number;
    failed: number;
    plugins: Array<{
      name: string;
      version: string;
      loaded: boolean;
      error?: string;
    }>;
  } {
    const plugins = this.getLoadedPlugins().map(p => ({
      name: p.manifest.name,
      version: p.manifest.version,
      loaded: p.loaded,
      error: p.error?.message,
    }));

    return {
      coreVersion: this.coreVersion,
      totalPlugins: plugins.length,
      loaded: plugins.filter(p => p.loaded).length,
      failed: plugins.filter(p => !p.loaded).length,
      plugins,
    };
  }

  /**
   * Validate provider implements interface
   */
  private isValidProvider(obj: any): obj is LegislationProvider {
    return (
      typeof obj.getJurisdiction === 'function' &&
      typeof obj.getDisplayName === 'function' &&
      typeof obj.search === 'function' &&
      typeof obj.getWork === 'function' &&
      typeof obj.healthCheck === 'function'
    );
  }
}

/**
 * Create global plugin loader instance
 */
let globalPluginLoader: PluginLoader | null = null;

export function getGlobalPluginLoader(coreVersion: string): PluginLoader {
  if (!globalPluginLoader) {
    globalPluginLoader = new PluginLoader(coreVersion);
  }
  return globalPluginLoader;
}

/**
 * CLI helper for plugin status
 */
export function formatPluginStatus(report: ReturnType<PluginLoader['getStatusReport']>): string {
  const lines = [
    `Plugin Status (Core v${report.coreVersion})`,
    `Total: ${report.totalPlugins} | Loaded: ${report.loaded} | Failed: ${report.failed}`,
    '',
  ];

  for (const plugin of report.plugins) {
    const icon = plugin.loaded ? '✅' : '❌';
    const error = plugin.error ? ` - ${plugin.error}` : '';
    lines.push(`  ${icon} ${plugin.name}@${plugin.version}${error}`);
  }

  return lines.join('\n');
}
