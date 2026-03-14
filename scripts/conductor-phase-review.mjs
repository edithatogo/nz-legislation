import fs from 'node:fs';
import path from 'node:path';

const CONDUCTOR_DIR = 'conductor';
const TRACKS_DIR = 'tracks';
const TRACK_REQUIRED_FILES = [
  'index.md',
  'plan.md',
  'metadata.json',
];

function parseArgs(argv) {
  const args = {
    track: '',
    phase: '',
    allowOpenTasks: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if ((arg === '--track' || arg === '-t') && next) {
      args.track = next;
      i += 1;
      continue;
    }

    if ((arg === '--phase' || arg === '-p') && next) {
      args.phase = next;
      i += 1;
      continue;
    }

    if (arg === '--allow-open-tasks') {
      args.allowOpenTasks = true;
      continue;
    }
  }

  return args;
}

function fail(message) {
  console.error(`Conductor phase review failed: ${message}`);
  process.exit(1);
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function readText(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function countUncheckedTasks(section) {
  const matches = section.match(/^- \[ \] /gm);
  return matches ? matches.length : 0;
}

const { track, phase, allowOpenTasks } = parseArgs(process.argv.slice(2));

if (!track || !phase) {
  fail('usage: node scripts/conductor-phase-review.mjs --track <track-id> --phase <phase-number>');
}

if (!/^\d+$/.test(phase) || Number(phase) < 1) {
  fail(`phase must be a positive integer, received: ${phase}`);
}

const rootDir = process.cwd();
const trackDir = path.join(rootDir, CONDUCTOR_DIR, TRACKS_DIR, track);

if (!fs.existsSync(trackDir)) {
  fail(`track directory not found: ${trackDir}`);
}

for (const file of TRACK_REQUIRED_FILES) {
  const filePath = path.join(trackDir, file);
  if (!fs.existsSync(filePath)) {
    fail(`required track file is missing: ${CONDUCTOR_DIR}/${TRACKS_DIR}/${track}/${file}`);
  }
}

const planPath = path.join(trackDir, 'plan.md');
const indexPath = path.join(trackDir, 'index.md');
const metadataPath = path.join(trackDir, 'metadata.json');

const plan = readText(planPath);
const index = readText(indexPath);
const metadata = (() => {
  try {
    return JSON.parse(readText(metadataPath));
  } catch (error) {
    fail(
      `failed to parse ${CONDUCTOR_DIR}/${TRACKS_DIR}/${track}/metadata.json: ${error.message}`
    );
  }
})();

const escapedPhase = escapeRegex(phase);
const phaseHeader = new RegExp(`## Phase ${escapedPhase}:`, 'i');
if (!phaseHeader.test(plan)) {
  fail(`phase ${phase} was not found in ${CONDUCTOR_DIR}/${TRACKS_DIR}/${track}/plan.md`);
}

const phaseSplit = plan.split(new RegExp(`## Phase ${escapedPhase}:`, 'i'));
const phaseBody = phaseSplit[1]?.split(/\n## Phase \d+:/i)[0] ?? '';

if (!/Automated Review Gate/i.test(phaseBody)) {
  fail(`phase ${phase} is missing an "Automated Review Gate" section`);
}

const commandPattern = new RegExp(
  `node scripts/conductor-phase-review\\.mjs --track ${escapeRegex(track)} --phase ${escapedPhase}`,
  'i'
);
if (!commandPattern.test(phaseBody)) {
  fail(`phase ${phase} does not contain its own conductor review command`);
}

const uncheckedTasks = countUncheckedTasks(phaseBody);
const statusLine =
  index.match(/## Status\s+([\s\S]*?)## /)?.[1]?.trim() ??
  index.match(/## Status\s+([\s\S]*)$/)?.[1]?.trim() ??
  'status section not found';

console.log('Conductor Phase Review');
console.log(`Track: ${track}`);
console.log(`Phase: ${phase}`);
console.log(`Metadata status: ${metadata.status ?? 'unknown'}`);
console.log(`Metadata updated_at: ${metadata.updated_at ?? 'missing'}`);
console.log(`Unchecked tasks in phase section: ${uncheckedTasks}`);
console.log(`Index status summary: ${statusLine}`);
console.log('Required files: ok');
console.log('Automated review gate: ok');

if (uncheckedTasks > 0) {
  if (allowOpenTasks) {
    console.log(
      'Result: review command completed in informational mode, but this phase still contains unchecked tasks.'
    );
    process.exit(0);
  } else {
    fail(
      'phase review found unchecked tasks in the phase section; close or explicitly bypass them before treating this phase as complete'
    );
  }
}

console.log('Result: review command completed and no unchecked tasks remain in this phase section.');
