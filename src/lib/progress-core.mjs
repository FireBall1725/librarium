// SPDX-License-Identifier: AGPL-3.0-only
// Copyright (C) 2026 FireBall1725
//
// Public progress numbers for /roadmap, read from the Plane board.
//
// Shared by the roadmap page (at build time) and scripts/progress-snapshot.mjs
// (which records one row of history per night). Plain JS so both can import it
// without a build step.
//
// Only card titles, states, labels and dates are fetched. Descriptions are
// never requested (`fields=` below), so they cannot leak into the site by
// accident.
//
// ─────────────────────────────────────────────────────────────────────────
// SECURITY REDACTION RULE — same rule as src/data/roadmap.ts
//
// A card labelled `security` is counted but its title is never shown: "being
// worked on now: fix X" tells an attacker X is open on every deployed
// instance. A card labelled `private` is left out entirely.
// ─────────────────────────────────────────────────────────────────────────

const API = 'https://api.plane.so/api/v1';
const WORKSPACE = 'fireball';
// The Librarium project. Never point this at another project: Homelab cards
// describe infrastructure that must not be public.
const PROJECT = '7d4ded95-022c-4105-9e6d-8ab11024877d';

const HIDE_ENTIRELY = 'private';
const HIDE_TITLE = 'security';

// Epics become "areas". A few are grouped or renamed so the public list reads
// well; anything not listed keeps its epic name.
const AREA_RULES = [
  { match: (e) => /^iOS [A-M]:/.test(e.name), name: 'iOS catches up with the web' },
  { match: (e) => e.external_id === 'lookup-catalogue', name: 'Lookup catalogue' },
  { match: (e) => e.external_id === 'ipad-kiosk', name: 'iPad kiosk (API side)' },
];
const AREA_GITHUB = 'Bugs and requests from GitHub';
const AREA_OTHER = 'Everything else';

// Title prefixes the board uses internally. The area chip already says it.
const PREFIX = /^(API|Web|iOS|Site|MCP|Research|Decide):\s*/i;
const AREA_LABELS = ['api', 'web', 'ios', 'mcp', 'site'];

const DAY = 24 * 60 * 60 * 1000;

async function get(path, key, fetchImpl) {
  const res = await fetchImpl(`${API}/workspaces/${WORKSPACE}/projects/${PROJECT}/${path}`, {
    headers: { 'X-API-Key': key, Accept: 'application/json' },
  });
  if (!res.ok) throw new Error(`plane ${path}: HTTP ${res.status}`);
  return res.json();
}

async function getAll(path, key, fetchImpl) {
  const out = [];
  let cursor = '';
  for (let page = 0; page < 50; page++) {
    const sep = path.includes('?') ? '&' : '?';
    const d = await get(`${path}${sep}per_page=100${cursor ? `&cursor=${encodeURIComponent(cursor)}` : ''}`, key, fetchImpl);
    const rows = Array.isArray(d) ? d : d.results ?? [];
    out.push(...rows);
    if (Array.isArray(d) || !d.next_page_results || !d.next_cursor) break;
    cursor = d.next_cursor;
  }
  return out;
}

/** Fetch the raw board. Throws on any failure; callers decide what that means. */
export async function fetchBoard(key, fetchImpl = fetch) {
  if (!key) throw new Error('no PLANE_API_KEY');
  const fields = 'id,name,state,labels,parent,type_id,completed_at,created_at,external_source,external_id';
  const [states, labels, types, items] = await Promise.all([
    getAll('states/', key, fetchImpl),
    getAll('labels/', key, fetchImpl),
    getAll('work-item-types/', key, fetchImpl),
    getAll(`work-items/?fields=${fields}`, key, fetchImpl),
  ]);
  return { states, labels, types, items };
}

/**
 * Turn the raw board into what the page shows. Pure, so it can be tested and
 * reused by the snapshot script.
 */
export function summarize(board, now = new Date()) {
  const groupOf = new Map(board.states.map((s) => [s.id, s.group]));
  const labelName = new Map(board.labels.map((l) => [l.id, l.name]));
  const epicTypes = new Set(board.types.filter((t) => t.is_epic || t.name === 'Epic').map((t) => t.id));
  const names = (it) => (it.labels ?? []).map((id) => labelName.get(id)).filter(Boolean);

  const byId = new Map(board.items.map((it) => [it.id, it]));
  const isEpic = (it) => epicTypes.has(it.type_id);
  const visible = board.items.filter((it) => !isEpic(it) && !names(it).includes(HIDE_ENTIRELY));

  const areaName = (it) => {
    const epic = it.parent ? byId.get(it.parent) : null;
    if (epic && isEpic(epic)) {
      const rule = AREA_RULES.find((r) => r.match(epic));
      return rule ? rule.name : epic.name.replace(PREFIX, '');
    }
    return it.external_source === 'github' ? AREA_GITHUB : AREA_OTHER;
  };
  const chip = (it) => names(it).find((n) => AREA_LABELS.includes(n)) ?? null;
  const title = (it) => { const t = it.name.replace(PREFIX, ''); return t.charAt(0).toUpperCase() + t.slice(1); };
  const canShowTitle = (it) => !names(it).includes(HIDE_TITLE);

  const group = (it) => groupOf.get(it.state) ?? 'backlog';
  const isDone = (it) => group(it) === 'completed';
  const isCancelled = (it) => group(it) === 'cancelled';
  const isOpen = (it) => !isDone(it) && !isCancelled(it);
  const doneWithin = (it, days) => isDone(it) && it.completed_at && now - new Date(it.completed_at) <= days * DAY;

  const areas = new Map();
  for (const it of visible) {
    if (isCancelled(it)) continue;
    const a = areaName(it);
    const row = areas.get(a) ?? { name: a, done: 0, doing: 0, total: 0 };
    row.total++;
    if (isDone(it)) row.done++;
    else if (group(it) === 'started') row.doing++;
    areas.set(a, row);
  }
  const areaList = [...areas.values()]
    .sort((a, b) => (a.name === AREA_OTHER) - (b.name === AREA_OTHER) || b.total - a.total || a.name.localeCompare(b.name));

  const doneThisWeek = visible
    .filter((it) => doneWithin(it, 7) && canShowTitle(it))
    .sort((a, b) => (a.completed_at < b.completed_at ? 1 : -1))
    .slice(0, 8)
    .map((it) => ({ title: title(it), area: chip(it), date: it.completed_at }));
  const doingNow = visible
    .filter((it) => group(it) === 'started' && canShowTitle(it))
    .slice(0, 8)
    .map((it) => ({ title: title(it), area: chip(it) }));

  return {
    asOf: now.toISOString(),
    open: visible.filter(isOpen).length,
    doing: visible.filter((it) => group(it) === 'started').length,
    doneWeek: visible.filter((it) => doneWithin(it, 7)).length,
    done4w: visible.filter((it) => doneWithin(it, 28)).length,
    // Running totals for the history file: the chart derives per-week done
    // and added counts from the difference between two nights.
    doneTotal: visible.filter(isDone).length,
    createdTotal: visible.filter((it) => !isCancelled(it)).length,
    areas: areaList,
    doneThisWeek,
    doingNow,
  };
}

/** Add or replace today's row (by Toronto date) in a history array. */
export function upsertHistory(history, s, now = new Date()) {
  const date = now.toLocaleDateString('en-CA', { timeZone: 'America/Toronto' });
  const row = { date, open: s.open, doneTotal: s.doneTotal, createdTotal: s.createdTotal };
  const rest = (Array.isArray(history) ? history : []).filter((r) => r && r.date !== date);
  return [...rest, row].sort((a, b) => (a.date < b.date ? -1 : 1)).slice(-400);
}

/**
 * Collapse nightly rows into weeks (the last row of each week, weeks ending on
 * Sunday) for the chart, newest 12.
 */
export function weekly(history) {
  const weeks = new Map();
  for (const r of history) {
    const d = new Date(`${r.date}T12:00:00Z`);
    const end = new Date(d.getTime() + ((7 - d.getUTCDay()) % 7) * DAY);
    weeks.set(end.toISOString().slice(0, 10), r);
  }
  const rows = [...weeks.entries()].sort((a, b) => (a[0] < b[0] ? -1 : 1)).map(([week, r]) => ({ week, ...r }));
  return rows.map((r, i) => {
    const prev = rows[i - 1];
    return {
      week: r.week,
      open: r.open,
      done: prev ? Math.max(0, r.doneTotal - prev.doneTotal) : null,
      added: prev ? Math.max(0, r.createdTotal - prev.createdTotal) : null,
    };
  }).slice(-12);
}
