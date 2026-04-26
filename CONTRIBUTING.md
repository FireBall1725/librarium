# Contributing to Librarium

Thanks for your interest. This umbrella repo holds the marketing site at [librarium.press](https://librarium.press) plus workspace-level planning docs (`PLAN.md`, `plans/`). The code lives in the four component repos:

- [librarium-api](https://github.com/fireball1725/librarium-api) — Go API
- [librarium-web](https://github.com/fireball1725/librarium-web) — React web client
- [librarium-ios](https://github.com/fireball1725/librarium-ios) — SwiftUI iOS client
- [librarium-mcp](https://github.com/fireball1725/librarium-mcp) — MCP server

Each component repo has its own `CONTRIBUTING.md` covering build, test, and conventions for that stack.

## What goes in this repo

- Marketing site copy + design changes (Astro + Tailwind v4)
- `PLAN.md` updates — roadmap, milestone tracking
- `plans/<feature>.md` — per-feature design + brainstorming
- Workspace-level positioning (`README.md` framing)

## What does *not* go here

- Bug reports / feature requests for the API, web, iOS, or MCP server — file on the matching component repo.
- Code that runs in any of the four component apps.
- Manual `CHANGELOG.md` edits — component repos auto-generate release notes from PR titles. The marketing site itself doesn't version.

## Development setup (marketing site)

```bash
cd main
npm ci
npm run dev
```

You'll need Node 22+. Site builds and deploys to GitHub Pages on every push to `main`.

## Pull requests

- Title carries the weight.
- Body: 1–2 terse bullets explaining the why. No Summary/Test plan headers.
- CI must pass before merge.

## License

The project is licensed under the **GNU Affero General Public License v3.0 only** ([LICENSE](./LICENSE)). Contributions are accepted under the same license.

## Sign your commits (DCO)

Every commit must carry a `Signed-off-by:` trailer. Pass `-s` to `git commit`:

```bash
git commit -s -m "docs(plan): mark CSV import as shipped"
```

If you forget on one commit: `git commit --amend -s --no-edit`. For several: `git rebase --signoff main`.

The [DCO GitHub App](https://github.com/apps/dco) runs on every PR and blocks the merge if any commit is missing a sign-off.

## Code of conduct

Be decent. Assume good faith. Technical disagreements are fine; personal attacks aren't.
