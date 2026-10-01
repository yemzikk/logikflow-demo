# Reviewing Teamspace

These are the team's rules for arranging pull requests in [LogiKFlow](https://logikflow.dev). AI agents read this file automatically, and **Add the team checklist** in arrange mode adds the checklist below.

## Order

- **Flags and migrations first.** Changes in `lib/flags.ts` and `db/migrations/` go in the first section, because everything else depends on them.
- **Models, then services.** Put `models/` before the `services/` that use them.
- **Tests right after the service they cover.** `services/foo.test.ts` goes directly below `services/foo.ts`, never in a block at the end.
- **API after services.** `api/routes/` and `api/router.ts` come once the logic they call is understood.
- **UI last, then strings and emails.** Pages before the dialogs they open; `ui/strings.json` and `emails/` at the very end.

## Notes

- For anything behind a flag, say what happens when the flag is **off**.
- Call out new database columns and indexes, and whether the migration is safe to run on a live database.
- Mark pure renames and string-only changes as **Skim**.

## Checklist

- With every new flag off, existing behaviour is unchanged
- New migration is backwards compatible with the running code
- Permission checks happen in the service, not only in the UI
- Emails and user-facing strings come from templates or `strings.json`
- New logic has tests next to it
