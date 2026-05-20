import { Command } from 'commander';

import { getProviderCapabilities } from '../providers/capability-manifest.js';

export const capabilitiesCommand = new Command()
  .name('capabilities')
  .description('Show jurisdiction and provider capability status')
  .option('-f, --format <format>', 'Output format (table, json)', 'table')
  .action((options: { format: string }) => {
    const capabilities = getProviderCapabilities();

    if (options.format.toLowerCase() === 'json') {
      console.log(JSON.stringify({ providers: capabilities }, null, 2));
      return;
    }

    console.log('Jurisdiction capability manifest\n');

    for (const capability of capabilities) {
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
      console.log('');
    }
  });
