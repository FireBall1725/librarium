# Librarium

Self-hosted, privacy-focused library tracker for physical books, manga, comics, and technical documents. One instance, many libraries, zero telemetry.

> ⚠︎ **Early beta.** Things are changing fast, some edges are rough, and self-hosters should expect to read release notes before upgrading.

[librarium.press](https://librarium.press) · [API docs](https://fireball1725.github.io/librarium-api/)

---

## What it does

- **Self-hosted, always.** Runs on your own infrastructure in Docker or Kubernetes. No telemetry. No external data calls unless you explicitly ask for a metadata lookup.
- **Multi-library, multi-user.** One instance hosts independent libraries (shared household, personal collection, tech manuals) with per-library roles.
- **Print-first catalog.** FRBR-style work/edition model covers physical books, manga, comics, magazines, and technical documents without schema gymnastics.
- **Bring your own AI.** Opt-in reading suggestions backed by Ollama, Osaurus, OpenAI, or Anthropic. Pick your provider and model. Run locally or ship it to the cloud, your call.
- **Scheduled work, observable.** Cover backfills, metadata refreshes, and AI runs all live on a single cron-driven jobs page. Run on demand, inspect history, or let it tick quietly.
- **Bring your own storage.** For ebooks and PDFs, Librarium stores a path reference. Your files stay where you put them.
- **Cross-platform.** Go API, React web UI, and a native SwiftUI iOS app (TestFlight today, App Store soon).
- **Open source.** Apache 2.0. Ship patches, file issues, or fork it.

## Where the code lives

API-first: every client consumes the same OpenAPI contract, and each piece ships independently on a `YY.M.R` cadence.


| Repo                                                           | Stack                                |
| -------------------------------------------------------------- | ------------------------------------ |
| [librarium-api](https://github.com/fireball1725/librarium-api) | Go · Postgres · River jobs           |
| [librarium-web](https://github.com/fireball1725/librarium-web) | React · TypeScript · Tailwind · Vite |
| [librarium-ios](https://github.com/fireball1725/librarium-ios) | SwiftUI · iOS 26+ (TestFlight)       |

Plus an optional companion service for AI clients:

| Repo                                                           | Stack                                |
| -------------------------------------------------------------- | ------------------------------------ |
| [librarium-mcp](https://github.com/fireball1725/librarium-mcp) | MCP server · Go · streamable HTTP    |


## Get started

Follow the [librarium-api deploy guide](https://github.com/fireball1725/librarium-api#deployment) for Docker or Kubernetes. Point the web client at your running API and you're off.

## Roadmap

A public roadmap page is on the way. Until then, watch the individual repos for commits and releases.

## About this repo

This repo hosts the Librarium landing page at [librarium.press](https://librarium.press). Built with [Astro](https://astro.build) and [Tailwind CSS v4](https://tailwindcss.com), auto-deployed to GitHub Pages on every push to `main`.

```sh
npm install
npm run dev      # local preview on :4321
npm run build    # static build to dist/
```

## License

Apache 2.0, matching the component repos.