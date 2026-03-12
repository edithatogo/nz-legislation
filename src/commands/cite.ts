/**
 * Cite command - Generate citations
 */

import { Command } from 'commander';
import ora from 'ora';

import { generateCitation } from '../output/index.js';
import { getLegislation } from '../providers/index.js';

interface CiteOptions {
  jurisdiction: string;
  style: string;
  copy: boolean;
}

export const citeCommand = new Command()
  .name('cite')
  .description('Generate citation for legislation')
  .argument('<id>', 'Work ID (e.g., act_public_1989_18)')
  .option('-j, --jurisdiction <jurisdiction>', 'Jurisdiction (nz, au-comm, au-qld)', 'nz')
  .option('-s, --style <style>', 'Citation style (nzmj, bibtex, ris, enw, apa)', 'nzmj')
  .option('--copy', 'Copy to clipboard (not implemented)', false)
  .action(async (workId: string, options: CiteOptions) => {
    const spinner = ora('Generating citation...').start();

    try {
      const work = await getLegislation({
        jurisdiction: options.jurisdiction as 'nz' | 'au-comm' | 'au-qld',
        workId,
      });
      spinner.stop();

      const citation = generateCitation(work, options.style);

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
      if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
      }
      throw error;
    }
  });
