# LogiKFlow demo: Teamspace

A tiny team-management app used to try [LogiKFlow](https://logikflow.dev), which lets a pull request's author (or their AI agent) arrange its changed files into a reading order with sections, notes and review checklists.

## Try it

1. Open the pull request **Add team invites** in this repository.
2. Swap `github.com` for `logikflow.dev` in its URL, or paste the link on the LogiKFlow dashboard.
3. Compare GitHub's alphabetical file list with the reading order:
   - flag and schema first
   - then the invite model and service, with its test beside it
   - then the API
   - then the UI and email

To arrange it yourself with an agent, connect the LogiKFlow MCP server and ask:

```text
Arrange the "Add team invites" PR in LogiKFlow in logical order.
```

## Layout

| Folder | What |
|---|---|
| `lib/` | Feature flags and shared helpers |
| `db/` | SQL migrations and a small in-memory client |
| `models/` | Data types |
| `services/` | Business logic |
| `api/` | HTTP routes |
| `ui/` | React components and strings |
| `emails/` | Email templates |

## Run the tests

```bash
npm test
```

Requires Node.js 22.6 or newer.
