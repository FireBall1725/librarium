// Public roadmap. Single source of truth for two renderings:
//
//   - the condensed three-column section on the homepage (#roadmap)
//   - the full /roadmap page, which also shows blurbs, areas and the
//     not-planning list
//
// Keep it that way. A second hand-maintained list is how the two drift.
//
// ─────────────────────────────────────────────────────────────────────────
// SECURITY REDACTION RULE — read before adding anything
//
// Security work appears here only once the mitigation has SHIPPED, described
// as a shipped improvement. Never describe an unmitigated weakness, however
// vaguely. A roadmap entry saying "harden X" tells an attacker that X is soft
// in every deployed instance today, and self-hosters cannot patch on your
// schedule.
//
// If an item cannot be described without disclosing a live gap, it belongs in
// the private PLAN.md only. There is at least one such item there now.
// ─────────────────────────────────────────────────────────────────────────

export type Status = 'shipping-next' | 'on-deck' | 'exploring' | 'not-planning';

export type Area = 'api' | 'web' | 'ios' | 'mcp' | 'product';

export interface RoadmapItem {
  /** Short label. This is all the homepage shows, so it has to stand alone. */
  title: string;
  /** One or two sentences, user-facing. Shown on /roadmap only. */
  blurb?: string;
  status: Status;
  areas: Area[];
}

export const STATUS_LABELS: Record<Status, string> = {
  'shipping-next': 'Shipping next',
  'on-deck': 'On deck',
  exploring: 'Exploring',
  'not-planning': 'Not planning',
};

/** Homepage shows these three, in this order. /roadmap adds not-planning. */
export const HOMEPAGE_STATUSES: Status[] = ['shipping-next', 'on-deck', 'exploring'];

export const roadmap: RoadmapItem[] = [
  // ── Shipping next ──────────────────────────────────────────────────────
  {
    title: 'Lite mode for iOS',
    blurb:
      'A free iOS edition that keeps everything on device with iCloud sync across your Apple devices, no server to run. Point it at your own Librarium later if you want to.',
    status: 'shipping-next',
    areas: ['ios', 'api'],
  },
  {
    title: 'iOS app redesign',
    status: 'shipping-next',
    areas: ['ios'],
  },
  {
    title: 'Sync protocol (per-field timestamps, delta API)',
    blurb:
      'Field-level last-writer-wins with per-field timestamps, incremental deltas and tombstones. Underpins Lite, and fixes the flaky read-only offline cache for self-hosted users as a side effect.',
    status: 'shipping-next',
    areas: ['api', 'ios'],
  },
  {
    title: 'App Store launch',
    status: 'shipping-next',
    areas: ['ios'],
  },

  // ── On deck ────────────────────────────────────────────────────────────
  {
    title: 'CSV import (Goodreads, StoryGraph, Libib)',
    blurb:
      'Drop in an export from any of them and Librarium hydrates the catalogue with metadata and covers from whichever providers you have enabled.',
    status: 'on-deck',
    areas: ['api', 'web'],
  },
  {
    title: 'One-click cloud deploy templates',
    blurb:
      'Deploy templates so you can stand up your own instance on a cloud host without hand-rolling Compose. Railway first, then others. Your instance, your data, your bill.',
    status: 'on-deck',
    areas: ['api', 'web'],
  },
  {
    title: 'Bookstore links',
    status: 'on-deck',
    areas: ['web', 'ios'],
  },
  {
    title: 'Opt-in telemetry SDK',
    blurb:
      'Off by default, and gated twice on self-hosted: an operator flag plus per-user consent. The code that sends lives in the public repos.',
    status: 'on-deck',
    areas: ['api', 'web', 'ios'],
  },
  {
    title: 'Series rework',
    status: 'on-deck',
    areas: ['api', 'web'],
  },
  {
    title: 'Move books between libraries, in bulk',
    blurb: 'There is no path for this in the UI today.',
    status: 'on-deck',
    areas: ['api', 'web'],
  },
  {
    title: 'Higher-resolution covers',
    blurb:
      'Covers currently come back as a 128px thumbnail. Providers expose larger images; this makes that an option.',
    status: 'on-deck',
    areas: ['api', 'web'],
  },

  // ── Exploring ──────────────────────────────────────────────────────────
  {
    title: 'Pre-ISBN and vintage collections',
    blurb:
      'ISBN is already optional, but four things make older collections awkward: no way to describe what is inside an anthology or an Ace Double, publish dates that turn "1932" into 1 January 1932, no per-copy record for condition or provenance, and no identifiers beyond ISBN. The first is a real schema change; the rest are cheaper.',
    status: 'exploring',
    areas: ['api'],
  },
  {
    title: 'Member reviews on book pages',
    blurb:
      'Reviews marked visible to members are stored but never shown to anyone else, so the field is half built. This would surface them on the book page, same-library scope only, with private notes staying private.',
    status: 'exploring',
    areas: ['api', 'web'],
  },
  {
    title: 'One list of every book across libraries',
    status: 'exploring',
    areas: ['api', 'web'],
  },
  {
    title: 'Edit metadata from the refresh panel',
    status: 'exploring',
    areas: ['web'],
  },
  {
    title: 'Shared reading feed (household scope)',
    status: 'exploring',
    areas: ['api', 'web', 'ios'],
  },
  {
    title: 'iPad and Mac apps',
    status: 'exploring',
    areas: ['ios'],
  },
  {
    title: 'AI metadata enrichment',
    status: 'exploring',
    areas: ['api'],
  },
  {
    title: 'Library invite links',
    status: 'exploring',
    areas: ['api', 'ios'],
  },
  {
    title: 'Bulk select on books grid',
    status: 'exploring',
    areas: ['ios'],
  },

  // ── Not planning ───────────────────────────────────────────────────────
  // Saying no costs nothing and saves people weeks. Worth as much as the rest.
  {
    title: 'A paid hosted edition',
    blurb:
      'Cancelled. Running a hosted service means being on call for other people’s servers. One-click deploy templates are the answer instead: your instance, your data. Nothing is held back from self-hosted for a commercial tier.',
    status: 'not-planning',
    areas: ['product'],
  },
  {
    title: 'An Android app',
    blurb:
      "I don't have an Android device to test on, so there's nothing to develop against. The web UI works in a mobile browser in the meantime. This could change if I pick one up.",
    status: 'not-planning',
    areas: ['product'],
  },
  {
    title: 'Federation between instances',
    blurb:
      'Running several of your own servers and switching between them is supported. A cross-instance social graph is a different product.',
    status: 'not-planning',
    areas: ['product'],
  },
];
