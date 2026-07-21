# EXAMPLE — repo-conventions for a fictional TypeScript/Next.js repo

> **This is reference material, not configuration.** It shows what a *filled*
> `.claude/skills/repo-conventions/SKILL.md` looks like for a made-up repo
> (`acme-storefront`: Next.js 15 App Router, pnpm, Drizzle ORM on Postgres,
> Vitest, Playwright). Nothing in it applies to your repos. Copy the *shape*
> and *specificity*, not the content. Note that every rule points at a real
> file or a real incident — that is the bar.

---

```markdown
---
name: repo-conventions
description: Use when adding new code to this repository that should match existing patterns — creating a new endpoint, route, model, migration, component, service, test file, or module. Do NOT use for one-off scripts, debugging, or edits confined to a single existing file.
---

# acme-storefront Conventions

## Layout

- `src/app/` — Next.js App Router routes only. No business logic; route
  handlers call a service and return.
- `src/services/` — all business logic. One file per domain
  (`orders.ts`, `catalog.ts`, `pricing.ts`).
- `src/infra/db/` — Drizzle schema, migrations, query helpers. The ONLY
  place `drizzle-orm` may be imported.
- `src/components/` — React components. `ui/` is shadcn-generated, never
  hand-edited; everything else is ours.
- `src/lib/` — pure utilities with zero imports from services or infra.
- `tests/e2e/` — Playwright. Unit tests live next to the file they test
  (`pricing.ts` → `pricing.test.ts`).

## Commands

- Install: `pnpm install --frozen-lockfile`
- Dev: `pnpm dev` (port 3000, needs `docker compose up -d` for Postgres first)
- All tests: `pnpm test`
- One test file: `pnpm vitest run src/services/pricing.test.ts`
- E2E: `pnpm test:e2e`
- Typecheck: `pnpm typecheck` (this is what the post-edit hook runs)
- Lint: `pnpm lint`
- New migration: `pnpm db:generate` then `pnpm db:migrate` (never hand-write
  SQL files; Drizzle generates them from schema.ts)

## How things are added here

### API endpoint
1. Route handler in `src/app/api/<resource>/route.ts` — copy the shape of
   `src/app/api/orders/route.ts` (zod-parse input → call service → typed
   response, no try/catch in the handler).
2. Logic goes in an existing or new `src/services/<domain>.ts` function.
3. Unit test the service, not the route. E2E covers the route.

### Model + migration
1. Add the table to `src/infra/db/schema.ts`.
2. `pnpm db:generate` — commit the generated SQL in `drizzle/` alongside the
   schema change, same commit, always.
3. Exemplar: the `wishlists` table + `drizzle/0042_wishlists.sql` pair.

### Component
1. `src/components/<Domain>/<Name>.tsx`, server component by default;
   `"use client"` only with a stated reason in the PR.
2. Copy the structure of `src/components/Cart/CartSummary.tsx`.

### Test file
- Vitest, `describe` per function, no snapshot tests (they got banned after
  the 2025-11 snapshot-drift incident; see PR #412).

## Non-obvious rules

- **Money is integer cents. There is no float currency anywhere.** `Price`
  in `src/lib/money.ts` is the only representation; formatting happens at
  render time only. PRs with `number` dollars get rejected on sight.
- All service functions take a `ctx` first argument (`src/services/context.ts`)
  — never import the db client directly in a service.
- Errors thrown to route handlers must be `AppError` subclasses
  (`src/lib/errors.ts`); anything else becomes a 500 with no message.
- Feature flags via `ctx.flags.isEnabled("...")` only — no env-var checks in
  business logic.
- Timestamps in the DB are `timestamptz` UTC. Client-local conversion happens
  in components, never in services.

## Things that look wrong but are intentional

- `src/infra/db/schema.ts` is 1200 lines. We know. Splitting it breaks
  Drizzle's type inference across relation definitions. Leave it.
- `src/components/ui/` fails our own lint rules — it is shadcn-generated and
  excluded in `eslint.config.js`. Do not "clean it up"; regeneration would
  erase the cleanup anyway.
- `pricing.test.ts` has three near-identical test blocks. They pin three
  separately-regressed rounding bugs (PRs #388, #395, #401). Do not DRY them.
- The checkout route disables Next's static optimization with
  `export const dynamic = "force-dynamic"` — required for per-request tax
  lookup, not an oversight.
```

---

**Why this works, section by section:**

- *Commands* are copy-pasteable and include the single-test-file form — the
  one Claude actually needs mid-task.
- *How things are added* names an exemplar file per change type. "Copy
  `CartSummary.tsx`" beats three paragraphs of prose.
- *Non-obvious rules* is the "things that get PRs rejected here" list — the
  knowledge Claude cannot infer from reading code that already complies.
- *Things that look wrong but are intentional* is the sleeper. It stops
  Claude "helpfully" fixing deliberate decisions — a failure mode nothing
  else in the scaffold catches.
