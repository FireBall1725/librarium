# AGENTS.md

Guidance for AI coding agents working in the `librarium` repo, the marketing
site. Humans should read [CONTRIBUTING.md](./CONTRIBUTING.md) first; this file
assumes you have and does not repeat it.

## What this repo is

The public site at [librarium.press](https://librarium.press). It is a static
Astro site: a landing page, a public roadmap, and nothing else. No application
code lives here.

Librarium is five repos that ship independently:

| Repo | Role |
| --- | --- |
| **`librarium`** | **This repo. Astro + Tailwind v4, the marketing site** |
| [`librarium-api`](https://github.com/FireBall1725/librarium-api) | Go backend |
| [`librarium-web`](https://github.com/FireBall1725/librarium-web) | React client |
| [`librarium-ios`](https://github.com/FireBall1725/librarium-ios) | SwiftUI client |
| [`librarium-mcp`](https://github.com/FireBall1725/librarium-mcp) | MCP server |

Bug reports about the product itself belong on the repo that owns the code, not
here.

## Copy rules, which matter more than the code

This site is where the project's public wording is set. Get these right:

- **The canonical description**, mirrored across every README, the OpenAPI spec,
  and the GitHub repo descriptions:

  > Self-hosted, privacy-focused tracker for your physical book, manga, and
  > comic collection. A self-hosted alternative to Libib and similar cloud
  > catalog services.

  Changing it here means changing it in the other four repos too.
- **Anchor on Libib**, not Goodreads. Goodreads is a social reading product and
  is not the comparison being drawn.
- **Both editions are free**: self-hosted (AGPL 3.0, shipping) and Lite (iOS,
  local-only with iCloud sync). There is no paid tier and no feature is held
  back for one. Do not write pricing copy, waitlist copy, or "Pro" anything.
- **Never write "zero telemetry".** Telemetry exists, it is opt-in, and it is
  off by default. Say that instead.
- **No invented numbers.** No user counts, no benchmarks, no "trusted by"
  claims. If a figure is not checkable, leave it out.

## Stack

Astro 5, Tailwind v4 through `@tailwindcss/vite` (no `tailwind.config.js`),
TypeScript. No UI framework, no client-side JavaScript framework.

## Layout

```
src/
  pages/index.astro     the landing page, and it is large
  pages/roadmap.astro   renders the roadmap
  data/roadmap.ts       roadmap content as typed data, edit this rather than
                        hand-writing roadmap markup
  components/           shared sections
  layouts/              page shells, head tags, metadata
  styles/               global CSS
public/                 static assets
```

## Build and test

```bash
npm ci
npm run dev       # local preview
npm run check     # astro check, the typecheck CI runs
npm run build
```

CI runs `npm run check`, `npm run build`, `editorconfig-checker`, and CodeQL.
The build jobs live in
[FireBall1725/workflows](https://github.com/FireBall1725/workflows), so change
them there rather than in this repo's `ci.yml`.

## Things that will bite you

- **This repo does not use `YY.M.revision` versioning.** The other four do. It
  deploys continuously and has no version string, no tags, and no releases.
- **A push to `main` publishes to the live site.** GitHub Pages deploys on
  merge, with no staging step in between.
- **`index.astro` is one big file on purpose.** Splitting it into components is
  a reasonable change to propose, but do it as its own PR rather than as a side
  effect of a copy edit.
- **Check the rendered page, not just the build.** `npm run build` passing says
  nothing about whether the layout survived on a phone.

## Conventions

- Match the surrounding markup and class ordering rather than reformatting.
- Every colour needs its dark variant.
- Commit messages are short and imperative: `fix(roadmap): correct Lite status`.
- Every commit needs a DCO sign-off (`git commit -s`).
