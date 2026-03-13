/**
 * Cite command - Generate citations
 */

import { Command } from 'commander';
import ora from 'ora';

import { getGlobalRegistry } from '../providers/index.js';
import { generateCitation } from '../output/index.js';
import { logger } from '../utils/logger.js';

interface CiteOptions {
  style: string;
  copy: boolean;
}

export const citeCommand = new Command()
  .name('cite')
  .description('Generate citation for legislation')
  .argument('<id>', 'Work ID (e.g., act_public_1989_18)')
  .option('-s, --style <style>', 'Citation style (nzmj, bibtex, ris, enw, apa, australian)', 'nzmj')
  .option('--copy', 'Copy to clipboard (not implemented)', false)
  .action(async (workId: string, options: CiteOptions, command: Command) => {
    const globalOptions = command.parent?.opts() || {};
    const jurisdiction = globalOptions.jurisdiction || 'nz';
    const spinner = ora(`Generating citation for ${jurisdiction} legislation...`).start();

    try {
      // Get provider
      const registry = getGlobalRegistry();
      const provider = registry.get(jurisdiction);
      
      if (!provider) {
        spinner.stop();
        console.error(`❌ Error: Unknown jurisdiction "${jurisdiction}"`);
        process.exit(1);
      }

      const work = await provider.getWork(workId);
      spinner.stop();

      const citation = provider.getCitation(work as any, options.style as any);

      console.log(`\n${options.style.toUpperCase()} Citation:`);
      console.log('─'.repeat(60));
      console.log(citation);
      console.log('─'.repeat(60));

      if (options.copy) {
        console.log('\nNote: Clipboard copy not yet implemented.');
        console.log('Please manually copy the citation above.');
      }
    } catch (error) {
      spinner.stop();
      logger.error('Failed to generate citation', error instanceof Error ? error : undefined, { workId });
      if (error instanceof Error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });
