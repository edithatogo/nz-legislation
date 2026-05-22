import { Command } from 'commander';

import { getProviderCapabilities } from '../providers/capability-manifest.js';
import { getProviderRegistry } from '../providers/registry.js';

export const capabilitiesCommand = new Command()
  .name('capabilities')
  .description('Show jurisdiction and provider capability status')
  .option('-f, --format <format>', 'Output format (table, json)', 'table')
  .option('--include-runtime', 'Include runtime provider registry details')
  .action((options: { format: string; includeRuntime?: boolean }) => {
    const capabilities = getProviderCapabilities();
    const runtimeProviders = options.includeRuntime ? getProviderRegistry() : undefined;

    if (options.format.toLowerCase() === 'json') {
      console.log(
        JSON.stringify(
          options.includeRuntime
            ? { providers: capabilities, runtimeProviders }
            : { providers: capabilities },
          null,
          2
        )
      );
      return;
    }

    console.log('Jurisdiction capability manifest\n');

    for (const capability of capabilities) {
      const runtimeProvider = runtimeProviders?.find(
        provider => provider.jurisdiction === capability.jurisdiction
      );
      const supported = Object.entries(capability.features)
        .filter(([, feature]) => feature.status === 'supported')
        .map(([feature]) => feature);

      const unsupported = Object.entries(capability.features)
        .filter(([, feature]) => feature.status !== 'supported')
        .map(([feature]) => feature);

      console.log(`${capability.label} (${capability.jurisdiction})`);
      console.log(`  Provider: ${capability.providerId}`);
      console.log(`  Source: ${capability.sourceAuthority}`);
      console.log(`  Release channel: ${capability.releaseChannel}`);
      console.log(`  Supported: ${supported.length ? supported.join(', ') : 'none'}`);
      console.log(`  Not yet supported: ${unsupported.length ? unsupported.join(', ') : 'none'}`);
      if (options.includeRuntime && runtimeProvider) {
        console.log(`  Runtime kind: ${runtimeProvider.runtimeKind}`);
        console.log(`  Runtime supported: ${runtimeProvider.runtimeSupported ? 'yes' : 'no'}`);
      }
      console.log('');
    }
  });
