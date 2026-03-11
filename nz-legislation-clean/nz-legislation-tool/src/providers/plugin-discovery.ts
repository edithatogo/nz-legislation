/**
 * Plugin Discovery
 * 
 * Discovers and loads plugins from standard locations.
 */

import { PluginLoader, LoadedPlugin } from './plugin-loader.js';
import { getGlobalRegistry } from './legislation-provider.js';

export interface DiscoveryOptions {
  directories?: string[];
  autoLoad?: boolean;
  verbose?: boolean;
}

export class PluginDiscovery {
  private loader: PluginLoader;
  private directories: string[];
  private autoLoad: boolean;
  private verbose: boolean;

  constructor(loader: PluginLoader, options?: DiscoveryOptions) {
    this.loader = loader;
    this.directories = options?.directories ?? this.getDefaultDirectories();
    this.autoLoad = options?.autoLoad ?? true;
    this.verbose = options?.verbose ?? false;
  }

  /**
   * Discover and optionally load all plugins
   */
  async discover(): Promise<LoadedPlugin[]> {
    const allPlugins: string[] = [];

    for (const dir of this.directories) {
      if (this.verbose) {
        console.log(`🔍 Searching for plugins in: ${dir}`);
      }

      const plugins = await this.loader.discoverPlugins(dir);
      allPlugins.push(...plugins.map(p => `${dir}/${p}`));
    }

    if (this.verbose) {
      console.log(`📦 Found ${allPlugins.length} potential plugins`);
    }

    if (this.autoLoad && allPlugins.length > 0) {
      if (this.verbose) {
        console.log(`⚙️  Auto-loading plugins...`);
      }

      const loaded = await this.loader.loadPlugins(allPlugins);
      
      if (this.verbose) {
        const success = loaded.filter(p => p.loaded).length;
        const failed = loaded.filter(p => !p.loaded).length;
        console.log(`✅ Loaded ${success} plugins, ${failed} failed`);
      }

      return loaded;
    }

    return [];
  }

  /**
   * Get default plugin directories
   */
  private getDefaultDirectories(): string[] {
    const path = require('path');
    const os = require('os');
    
    const directories: string[] = [];

    // Global plugin directories
    if (process.platform === 'win32') {
      directories.push(
        path.join(process.env.APPDATA || '', 'npm', 'node_modules'),
        path.join(process.env.LOCALAPPDATA || '', 'nz-legislation-tool', 'plugins')
      );
    } else {
      directories.push(
        '/usr/local/lib/node_modules',
        '/usr/lib/node_modules',
        path.join(os.homedir(), '.npm', 'lib', 'node_modules'),
        path.join(os.homedir(), '.nz-legislation-tool', 'plugins')
      );
    }

    // Local plugin directory (for development)
    directories.push(
      path.join(process.cwd(), 'node_modules'),
      path.join(process.cwd(), 'plugins')
    );

    if (this.verbose) {
      console.log('Plugin search directories:');
      for (const dir of directories) {
        console.log(`  - ${dir}`);
      }
    }

    return directories;
  }

  /**
   * Get discovery summary
   */
  getSummary(): {
    directories: string[];
    autoLoad: boolean;
    loadedPlugins: number;
    availableJurisdictions: string[];
  } {
    const registry = getGlobalRegistry();
    
    return {
      directories: this.directories,
      autoLoad: this.autoLoad,
      loadedPlugins: this.loader.getLoadedPlugins().length,
      availableJurisdictions: registry.getJurisdictions(),
    };
  }
}

/**
 * Create discovery instance
 */
export function createPluginDiscovery(
  coreVersion: string,
  options?: DiscoveryOptions
): PluginDiscovery {
  const loader = new PluginLoader(coreVersion);
  return new PluginDiscovery(loader, options);
}
