# Security policy

This repo holds the marketing site and workspace-level planning docs. **It does not run user data.** Please report security issues against the right component repo:

| Component | Where to file |
|---|---|
| API (auth, data, server) | https://github.com/fireball1725/librarium-api/security/advisories/new |
| Web client | https://github.com/fireball1725/librarium-web/security/advisories/new |
| iOS app | https://github.com/fireball1725/librarium-ios/security/advisories/new |
| MCP server | https://github.com/fireball1725/librarium-mcp/security/advisories/new |

## Scope of *this* repo

If you find a security issue specifically in the marketing site (XSS in a published page, supply-chain issue in `npm` deps, leaked credentials in a commit), report privately here:

→ https://github.com/fireball1725/librarium/security/advisories/new

## Response

This is a small, self-hosted project run by a single maintainer. Best-effort response targets: 1 week to acknowledge, 2 weeks to triage, 4 weeks to plan a fix for high-severity issues.
