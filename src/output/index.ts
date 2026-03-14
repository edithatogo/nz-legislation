/**
 * Output formatters for CLI
 * Tables, JSON, CSV, and citation formatting
 */

import chalk from 'chalk';
import Table from 'cli-table3';

import type { SearchResults, Version, Work } from '@models';

export * from './legal-metadata-publication.js';

/**
 * Format work type for display
 */
function formatWorkType(type: string): string {
  const colors: Record<string, (text: string) => string> = {
    act: chalk.cyan,
    bill: chalk.magenta,
    regulation: chalk.yellow,
    instrument: chalk.white,
  };
  return (colors[type] || chalk.white)(type);
}

/**
 * Format status for display
 */
function formatStatus(status: string): string {
  const colors: Record<string, (text: string) => string> = {
    'in-force': chalk.green,
    'not-yet-in-force': chalk.yellow,
    repealed: chalk.red,
    'partially-repealed': chalk.yellow,
    withdrawn: chalk.red,
  };
  return (colors[status] || chalk.white)(status);
}

/**
 * Print search results as a table
 */
export function printTable(results: SearchResults): void {
  if (results.results.length === 0) {
    console.log(chalk.yellow('No results found.'));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold('ID'),
      chalk.bold('Title'),
      chalk.bold('Type'),
      chalk.bold('Status'),
      chalk.bold('Date'),
    ],
    colWidths: [20, 50, 15, 20, 12],
    wordWrap: true,
    wrapOnWordBoundary: false,
  });

  results.results.forEach(work => {
    table.push([
      work.id,
      work.title.length > 48 ? work.title.substring(0, 47) + '…' : work.title,
      formatWorkType(work.type),
      formatStatus(work.status),
      work.date,
    ]);
  });

  console.log(table.toString());
  console.log(chalk.gray(`\nTotal: ${results.total} results (showing ${results.results.length})`));
}

/**
 * Print a single work's details
 */
export function printWorkDetail(work: Work): void {
  const table = new Table({
    colWidths: [20, 60],
  });

  table.push(
    [chalk.bold('ID'), work.id],
    [chalk.bold('Title'), work.title],
    ...(work.shortTitle ? [[chalk.bold('Short Title'), work.shortTitle]] : []),
    [chalk.bold('Type'), formatWorkType(work.type)],
    [chalk.bold('Status'), formatStatus(work.status)],
    [chalk.bold('Date'), work.date],
    [chalk.bold('Versions'), work.versionCount.toString()],
    [chalk.bold('URL'), work.url]
  );

  console.log(table.toString());
}

/**
 * Print versions as a table
 */
export function printVersionsTable(versions: Version[]): void {
  if (versions.length === 0) {
    console.log(chalk.yellow('No versions found.'));
    return;
  }

  const table = new Table({
    head: [
      chalk.bold('ID'),
      chalk.bold('Version'),
      chalk.bold('Type'),
      chalk.bold('Date'),
      chalk.bold('Current'),
      chalk.bold('Formats'),
    ],
    colWidths: [25, 10, 15, 12, 10, 30],
    wordWrap: true,
  });

  versions.forEach(version => {
    table.push([
      version.id,
      version.version.toString(),
      version.type,
      version.date,
      version.isCurrent ? chalk.green('Yes') : chalk.gray('No'),
      version.formats.join(', '),
    ]);
  });

  console.log(table.toString());
  console.log(chalk.gray(`\nTotal versions: ${versions.length}`));
}

/**
 * Print as JSON
 */
export function printJson(data: unknown): void {
  console.log(JSON.stringify(data, null, 2));
}

/**
 * Convert works to CSV format
 */
export function worksToCsv(results: SearchResults): string {
  const headers = ['id', 'title', 'shortTitle', 'type', 'status', 'date', 'url', 'versionCount'];
  const rows = results.results.map(work => [
    work.id,
    `"${work.title.replace(/"/g, '""')}"`,
    work.shortTitle ? `"${work.shortTitle.replace(/"/g, '""')}"` : '',
    work.type,
    work.status,
    work.date,
    work.url,
    work.versionCount.toString(),
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Convert versions to CSV format
 */
export function versionsToCsv(versions: Version[]): string {
  const headers = ['id', 'version', 'type', 'date', 'isCurrent', 'formats'];
  const rows = versions.map(version => [
    version.id,
    version.version.toString(),
    version.type,
    version.date,
    version.isCurrent.toString(),
    `"${version.formats.join(';').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
}

/**
 * Generate citation in different styles
 */
export function generateCitation(work: Work, style: string = 'nzmj'): string {
  const year = extractCitationYear(work);

  switch (style.toLowerCase()) {
    case 'nzmj':
      return `${work.title}, ${work.type === 'act' ? 'Public Act' : work.type} ${year} (NZ).`;

    case 'bibtex':
      return `@legislation{${work.id.replace(/\//g, '-')},
  title = {${work.title}},
  year = {${year}},
  type = {${work.type}},
  status = {${work.status}},
  url = {${work.url}}
}`;

    case 'ris':
      return `TY - LEG
ID - ${work.id}
TI - ${work.title}
PY - ${year}
M3 - ${work.type === 'act' ? 'Public Act' : work.type}
CY - New Zealand
UR - ${work.url}
ER - `;

    case 'enw':
      return `%0 Statute
%A New Zealand
%D ${year}
%T ${work.title}
%9 ${work.type === 'act' ? 'Public Act' : work.type}
%U ${work.url}
%Z ${work.id}`;

    case 'apa':
      return `${work.title}. (${year}). ${work.type === 'act' ? 'Public Act' : work.type} (New Zealand). ${work.url}`;

    default:
      return `Unknown citation style: ${style}`;
  }
}

function extractCitationYear(work: Work): string {
  const idMatch = work.id.match(/(?:^|[_/])((?:19|20)\d{2})(?:[_/]|$)/);
  if (idMatch) {
    return idMatch[1];
  }

  const titleMatch = work.title.match(/\b((?:19|20)\d{2})\b/);
  if (titleMatch) {
    return titleMatch[1];
  }

  return work.date.substring(0, 4);
}
