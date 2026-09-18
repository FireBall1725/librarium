// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2026 FireBall1725
//
// Records tonight's board counts for the /roadmap progress chart.
//
// History lives on the `progress-data` branch, not on main: main is protected
// and needs a reviewed PR, which a nightly job can't do. The deploy workflow
// runs this before the build; the build reads src/data/progress-history.json.
//
// Never fails the deploy. Any error leaves the file as it was (or absent) and
// the page shows the numbers without a chart.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import { fetchBoard, summarize, upsertHistory } from '../src/lib/progress-core.mjs';

const BRANCH = 'progress-data';
const FILE = 'progress-history.json';
const OUT = 'src/data/progress-history.json';
const push = process.argv.includes('--push');

const git = (...args) => execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });

function readBranchHistory() {
  try {
    git('fetch', '--depth=1', 'origin', BRANCH);
    return JSON.parse(git('show', `FETCH_HEAD:${FILE}`));
  } catch {
    return [];
  }
}

function pushBranch(history) {
  const dir = fs.mkdtempSync('/tmp/progress-');
  try {
    git('worktree', 'add', '--detach', dir);
    const run = (...a) => execFileSync('git', ['-C', dir, ...a], { stdio: 'ignore' });
    try {
      run('fetch', '--depth=1', 'origin', BRANCH);
      run('checkout', '-B', BRANCH, 'FETCH_HEAD');
    } catch {
      run('checkout', '--orphan', BRANCH);
      run('rm', '-rf', '--quiet', '.');
    }
    fs.writeFileSync(`${dir}/${FILE}`, `${JSON.stringify(history, null, 1)}\n`);
    run('add', FILE);
    run('-c', 'user.name=github-actions[bot]', '-c', 'user.email=41898282+github-actions[bot]@users.noreply.github.com',
      'commit', '-s', '-m', `chore(progress): snapshot ${history.at(-1).date}`);
    run('push', 'origin', `HEAD:${BRANCH}`);
  } finally {
    try { git('worktree', 'remove', '--force', dir); } catch { /* best effort */ }
  }
}

try {
  const s = summarize(await fetchBoard(process.env.PLANE_API_KEY));
  const before = readBranchHistory();
  const history = upsertHistory(before, s);
  fs.writeFileSync(OUT, `${JSON.stringify(history, null, 1)}\n`);
  const changed = JSON.stringify(before) !== JSON.stringify(history);
  if (push && changed) pushBranch(history);
  console.log(`progress: ${s.open} open, ${history.length} nights of history${push && changed ? ', pushed' : ''}`);
} catch (err) {
  console.log(`progress: skipped (${err instanceof Error ? err.message : err})`);
}
