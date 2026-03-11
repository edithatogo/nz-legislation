/**
 * Plugin Commands
 * 
 * CLI commands for managing plugins.
 */

import { Command } from 'commander';
import { getGlobalPluginLoader } from '../providers/plugin-loader.js';
import { createPluginDiscovery } from '../providers/plugin-discovery.js';
import { getGlobalMarketplace, formatPluginList } from '../utils/plugin-marketplace.js';
import { formatPluginStatus } from '../providers/plugin-loader.js';

const CORE_VERSION = '2.0.0';

export const pluginCommand = new Command()
  .name('plugin')
  .description('Manage jurisdiction plugins')
  .addCommand(
    new Command()
      .name('list')
      .description('List installed plugins')
      .option('-v, --verbose', 'Show detailed information')
      .action(async (options) => {
        const loader = getGlobalPluginLoader(CORE_VERSION);
        const report = loader.getStatusReport();

        console.log(formatPluginStatus(report));

        if (options.verbose) {
          const registry = loader.getRegistry();
          const dashboard = await registry.getHealthDashboard();

          console.log('\nPlugin Health:');
          for (const item of dashboard) {
            const icon = item.healthy ? '✅' : '❌';
            console.log(`  ${icon} ${item.jurisdiction}: ${item.healthy ? 'Healthy' : 'Unhealthy'}`);
          }
        }
      })
  )
  .addCommand(
    new Command()
      .name('discover')
      .description('Discover available plugins')
      .option('--type <type>', 'Filter by type (official, community)')
      .action(async (options) => {
        const marketplace = getGlobalMarketplace();
        const plugins = await marketplace.list({
          type: options.type,
        });
        
        console.log(formatPluginList(plugins));
      })
  )
  .addCommand(
    new Command()
      .name('install')
      .description('Install a plugin')
      .argument('<plugin>', 'Plugin name (e.g., @nz-legislation/queensland)')
      .option('--version <version>', 'Specific version to install')
      .action(async (plugin, options) => {
        const marketplace = getGlobalMarketplace();
        
        try {
          await marketplace.install(plugin, options.version);
          
          // Try to load the plugin after installation
          const loader = getGlobalPluginLoader(CORE_VERSION);
          await loader.loadPlugin(plugin);
          
          console.log(`✅ Plugin ${plugin} installed and loaded successfully`);
        } catch (error) {
          console.error(`❌ Failed to install ${plugin}:`, error instanceof Error ? error.message : error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command()
      .name('uninstall')
      .description('Uninstall a plugin')
      .argument('<plugin>', 'Plugin name')
      .action(async (plugin) => {
        const marketplace = getGlobalMarketplace();
        
        try {
          await marketplace.uninstall(plugin);
          
          const loader = getGlobalPluginLoader(CORE_VERSION);
          loader.unloadPlugin(plugin);
          
          console.log(`✅ Plugin ${plugin} uninstalled successfully`);
        } catch (error) {
          console.error(`❌ Failed to uninstall ${plugin}:`, error instanceof Error ? error.message : error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command()
      .name('update')
      .description('Update a plugin')
      .argument('<plugin>', 'Plugin name')
      .action(async (plugin) => {
        const marketplace = getGlobalMarketplace();
        
        try {
          await marketplace.update(plugin);
          console.log(`✅ Plugin ${plugin} updated successfully`);
        } catch (error) {
          console.error(`❌ Failed to update ${plugin}:`, error instanceof Error ? error.message : error);
          process.exit(1);
        }
      })
  )
  .addCommand(
    new Command()
      .name('status')
      .description('Show plugin system status')
      .action(() => {
        const loader = getGlobalPluginLoader(CORE_VERSION);
        const report = loader.getStatusReport();
        const discovery = createPluginDiscovery(CORE_VERSION);
        const summary = discovery.getSummary();
        
        console.log('Plugin System Status');
        console.log('='.repeat(50));
        console.log(`Core Version: v${report.coreVersion}`);
        console.log(`Loaded Plugins: ${report.loaded}/${report.totalPlugins}`);
        console.log(`Failed Plugins: ${report.failed}`);
        console.log(`Available Jurisdictions: ${summary.availableJurisdictions.length}`);
        console.log(`Plugin Directories: ${summary.directories.length}`);
        console.log('');
        
        if (report.plugins.length > 0) {
          console.log('Installed Plugins:');
          for (const plugin of report.plugins) {
            const icon = plugin.loaded ? '✅' : '❌';
            const error = plugin.error ? ` - ${plugin.error}` : '';
            console.log(`  ${icon} ${plugin.name}@${plugin.version}${error}`);
          }
        }
        
        if (summary.availableJurisdictions.length > 0) {
          console.log('');
          console.log('Available Jurisdictions:');
          for (const jurisdiction of summary.availableJurisdictions) {
            console.log(`  - ${jurisdiction}`);
          }
        }
      })
  );
