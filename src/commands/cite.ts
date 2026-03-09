/**
 * Cite command - Generate citations
 */

import { Command } from 'commander';
import ora from 'ora';

import { getWork } from '../client.js';
import { generateCitation } from '../output/index.js';

interface CiteOptions {
  style: string;
  copy: boolean;
}

export const citeCommand = new Command()
  .name('cite')
  .description('Generate citation for legislation')
  .argument('<id>', 'Work ID (e.g., act/2020/67)')
  .option('-s, --style <style>', 'Citation style (nzmj, bibtex, ris, apa)', 'nzmj')
  .option('--copy', 'Copy to clipboard (not implemented)', false)
  .action(async (workId: string, options: CiteOptions) => {
    const spinner = ora('Generating citation...').start();

    try {
      const work = await getWork(workId);
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
