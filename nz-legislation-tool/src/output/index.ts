/**
 * Output formatters for CLI
 * Tables, JSON, CSV, and citation formatting
 */

import Table from 'cli-table3';
import chalk from 'chalk';
import type { Work, SearchResults } from '../models/index.js';

/**
 * Format work type for display
 */
function formatWorkType(type: string): string {
  const colors: Record<string, chalk.Chalk> = {
    act: chalk.cyan,
    bill: chalk.magenta,
    regulation: chalk.yellow,
    instrument: chalk.white,
    secondary_legislation: chalk.yellow,
    amendment_paper: chalk.gray,
  };
  return (colors[type] || chalk.white)(type);
}

/**
 * Format status for display
 */
function formatStatus(status: string | null): string {
  if (!status) return chalk.gray('unknown');
  
  const colors: Record<string, chalk.Chalk> = {
    in_force: chalk.green,
    current: chalk.green,
    not_in_force: chalk.yellow,
    repealed: chalk.red,
    revoked: chalk.red,
  };
  return (colors[status] || chalk.white)(status);
}

/**
 * Get display title from work
 */
function getWorkTitle(work: Work): string {
  return work.latest_matching_version?.title || 'Untitled';
}

/**
 * Get work date from version
 */
function getWorkDate(work: Work): string {
  const versionId = work.latest_matching_version?.version_id || '';
  // Extract date from version_id (e.g., "bill_government_2025_217_en_2026-03-06")
  const dateMatch = versionId.match(/(\d{4}-\d{2}-\d{2})$/);
  return dateMatch ? dateMatch[1] : 'N/A';
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
      chalk.bold('Work ID'),
      chalk.bold('Title'),
      chalk.bold('Type'),
      chalk.bold('Status'),
      chalk.bold('Date'),
    ],
    colWidths: [25, 45, 20, 15, 12],
    wordWrap: true,
    wrapOnWordBoundary: false,
  });

  results.results.forEach((work) => {
    table.push([
      work.work_id,
      getWorkTitle(work).length > 43 ? getWorkTitle(work).substring(0, 42) + '…' : getWorkTitle(work),
      formatWorkType(work.legislation_type),
      formatStatus(work.legislation_status),
      getWorkDate(work),
    ]);
  });

  console.log(table.toString());
  console.log(
    chalk.gray(`\nTotal: ${results.total || results.results.length} results (showing ${results.results.length})`)
  );
}

/**
 * Print a single work's details
 */
export function printWorkDetail(work: Work): void {
  const table = new Table({
    colWidths: [25, 55],
  });

  table.push(
    [chalk.bold('Work ID'), work.work_id],
    [chalk.bold('Title'), getWorkTitle(work)],
    [chalk.bold('Type'), formatWorkType(work.legislation_type)],
    [chalk.bold('Status'), formatStatus(work.legislation_status)],
    [chalk.bold('Date'), getWorkDate(work)],
    ...(work.publisher ? [[chalk.bold('Publisher'), work.publisher]] : []),
    [chalk.bold('URL'), work.latest_matching_version?.formats?.find(f => f.type === 'html')?.url || 'N/A']
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

  versions.forEach((version) => {
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
  const headers = ['work_id', 'title', 'type', 'status', 'date', 'url', 'publisher'];
  const rows = results.results.map((work) => [
    work.work_id,
    `"${getWorkTitle(work).replace(/"/g, '""')}"`,
    work.legislation_type,
    work.legislation_status || '',
    getWorkDate(work),
    work.latest_matching_version?.formats?.find(f => f.type === 'html')?.url || '',
    work.publisher || '',
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Convert versions to CSV format
 */
export function versionsToCsv(versions: Version[]): string {
  const headers = ['id', 'version', 'type', 'date', 'isCurrent', 'formats'];
  const rows = versions.map((version) => [
    version.id,
    version.version.toString(),
    version.type,
    version.date,
    version.isCurrent.toString(),
    `"${version.formats.join(';').replace(/"/g, '""')}"`,
  ]);

  return [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
}

/**
 * Get work year from work ID or version date
 */
function getWorkYear(work: Work): string {
  // For acts, extract year from work_id (e.g., "act_public_1989_18" -> "1989")
  const idYearMatch = work.work_id.match(/(?:act|regulation)_[^_]+_(\d{4})_/);
  if (idYearMatch) {
    return idYearMatch[1];
  }
  
  // Fallback to version date
  const versionId = work.latest_matching_version?.version_id || '';
  const dateMatch = versionId.match(/(\d{4}-\d{2}-\d{2})$/);
  return dateMatch ? dateMatch[1].substring(0, 4) : 'N/A';
}

/**
 * Generate citation in different styles
 */
export function generateCitation(work: Work, style: string = 'nzmj'): string {
  const title = getWorkTitle(work);
  const year = getWorkYear(work);
  const type = work.legislation_type;
  const url = work.latest_matching_version?.formats?.find(f => f.type === 'html')?.url || '';

  switch (style.toLowerCase()) {
    case 'nzmj':
      return `${title}, ${type === 'act' ? 'Public Act' : type} ${year} (NZ).`;

    case 'bibtex':
      return `@legislation{${work.work_id.replace(/\//g, '-')},
  title = {${title}},
  year = {${year}},
  type = {${type}},
  status = {${work.legislation_status || 'unknown'}},
  url = {${url}}
}`;

    case 'ris':
      return `TY - LEG
ID - ${work.work_id}
TI - ${title}
PY - ${year}
UR - ${url}
ER - `;

    case 'apa':
      return `${title}. (${year}). ${type === 'act' ? 'Public Act' : type} (New Zealand). ${url}`;

    default:
      return `Unknown citation style: ${style}`;
  }
}
