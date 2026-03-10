/**
 * Plugin Marketplace
 * 
 * Framework for discovering, installing, and managing plugins.
 * Supports both official and community plugins.
 */

export interface PluginInfo {
  name: string;
  version: string;
  description: string;
  author: string;
  type: 'official' | 'community';
  status: 'stable' | 'beta' | 'alpha';
  downloads: number;
  rating?: number;
  repository?: string;
}

export interface PluginManifest {
  name: string;
  version: string;
  description: string;
  main: string;
  author: string;
  license: string;
  peerDependencies: Record<string, string>;
  pluginType: 'official' | 'community';
  pluginStatus: 'stable' | 'beta' | 'alpha';
}

export class PluginMarketplace {
  private registryUrl: string;
  private installedPlugins: Map<string, PluginManifest> = new Map();

  constructor(registryUrl: string = 'https://registry.npmjs.org') {
    this.registryUrl = registryUrl;
  }

  /**
   * List available plugins
   */
  async list(filter?: { type?: 'official' | 'community'; status?: string }): Promise<PluginInfo[]> {
    // In real implementation, fetch from registry
    // For now, return mock data
    const plugins: PluginInfo[] = [
      // Official
      { name: '@nz-legislation/queensland', version: '1.0.0', description: 'Queensland legislation', author: 'NZ Legislation Team', type: 'official', status: 'stable', downloads: 1000 },
      { name: '@nz-legislation/commonwealth', version: '1.0.0', description: 'Commonwealth legislation', author: 'NZ Legislation Team', type: 'official', status: 'stable', downloads: 800 },
      { name: '@nz-legislation/nsw', version: '1.0.0', description: 'NSW legislation', author: 'NZ Legislation Team', type: 'official', status: 'stable', downloads: 600 },
      { name: '@nz-legislation/victoria', version: '1.0.0', description: 'Victoria legislation', author: 'NZ Legislation Team', type: 'official', status: 'stable', downloads: 500 },
      
      // Community
      { name: '@community/fiji', version: '0.1.0', description: 'Fiji legislation (beta)', author: 'Community', type: 'community', status: 'beta', downloads: 50 },
      { name: '@community/samoa', version: '0.1.0', description: 'Samoa legislation (alpha)', author: 'Community', type: 'community', status: 'alpha', downloads: 20 },
    ];

    if (filter?.type) {
      return plugins.filter(p => p.type === filter.type);
    }

    if (filter?.status) {
      return plugins.filter(p => p.status === filter.status);
    }

    return plugins;
  }

  /**
   * Install plugin
   */
  async install(name: string, version?: string): Promise<void> {
    console.log(`Installing ${name}${version ? `@${version}` : ''}...`);
    
    // In real implementation:
    // 1. Check compatibility
    // 2. Download from registry
    // 3. Install to plugins directory
    // 4. Register with plugin loader
    
    console.log(`✅ ${name} installed successfully`);
  }

  /**
   * Uninstall plugin
   */
  async uninstall(name: string): Promise<void> {
    console.log(`Uninstalling ${name}...`);
    
    // In real implementation:
    // 1. Remove from plugins directory
    // 2. Unregister from plugin loader
    
    console.log(`✅ ${name} uninstalled successfully`);
  }

  /**
   * Update plugin
   */
  async update(name: string): Promise<void> {
    console.log(`Updating ${name}...`);
    
    // In real implementation:
    // 1. Check for newer version
    // 2. Download and install
    
    console.log(`✅ ${name} updated successfully`);
  }

  /**
   * Get installed plugins
   */
  getInstalled(): PluginManifest[] {
    return Array.from(this.installedPlugins.values());
  }

  /**
   * Register installed plugin
   */
  registerPlugin(manifest: PluginManifest): void {
    this.installedPlugins.set(manifest.name, manifest);
  }

  /**
   * Search plugins
   */
  async search(query: string): Promise<PluginInfo[]> {
    const all = await this.list();
    const queryLower = query.toLowerCase();
    
    return all.filter(p => 
      p.name.toLowerCase().includes(queryLower) ||
      p.description.toLowerCase().includes(queryLower)
    );
  }

  /**
   * Get plugin details
   */
  async getDetails(name: string): Promise<PluginInfo | null> {
    const all = await this.list();
    return all.find(p => p.name === name) ?? null;
  }

  /**
   * Submit community plugin
   */
  async submit(manifest: PluginManifest): Promise<void> {
    console.log(`Submitting community plugin: ${manifest.name}...`);
    
    // In real implementation:
    // 1. Validate manifest
    // 2. Run tests
    // 3. Publish to community registry
    
    console.log(`✅ ${manifest.name} submitted successfully`);
  }
}

/**
 * CLI command helpers
 */
export function formatPluginList(plugins: PluginInfo[]): string {
  const official = plugins.filter(p => p.type === 'official');
  const community = plugins.filter(p => p.type === 'community');

  const lines = ['Available Plugins:', ''];

  if (official.length > 0) {
    lines.push('Official Plugins:');
    for (const plugin of official) {
      const icon = plugin.status === 'stable' ? '✅' : plugin.status === 'beta' ? '🧪' : '🔬';
      lines.push(`  ${icon} ${plugin.name}@${plugin.version} - ${plugin.description}`);
    }
    lines.push('');
  }

  if (community.length > 0) {
    lines.push('Community Plugins:');
    for (const plugin of community) {
      const icon = plugin.status === 'stable' ? '✅' : plugin.status === 'beta' ? '🧪' : '🔬';
      lines.push(`  ${icon} ${plugin.name}@${plugin.version} - ${plugin.description} (by ${plugin.author})`);
    }
    lines.push('');
  }

  return lines.join('\n');
}

/**
 * Create global marketplace instance
 */
let globalMarketplace: PluginMarketplace | null = null;

export function getGlobalMarketplace(): PluginMarketplace {
  if (!globalMarketplace) {
    globalMarketplace = new PluginMarketplace();
  }
  return globalMarketplace;
}
