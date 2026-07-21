# EXAMPLE — CLAUDE.md for the same fictional repo

> **Reference material, not configuration.** A filled `CLAUDE.md` for the
> made-up `acme-storefront` repo, ~250 tokens. Note what it does NOT contain:
> no philosophy, no duplicated convention detail (that lives in the
> repo-conventions skill), nothing situational. Every line earns its place on
> every session.

---

```markdown
# acme-storefront

Next.js 15 storefront for Acme's retail sites. pnpm + Drizzle/Postgres + Vitest.

## Commands

- Dev: `docker compose up -d && pnpm dev`
- All tests: `pnpm test` · one file: `pnpm vitest run <path>`
- Typecheck: `pnpm typecheck` · lint: `pnpm lint`
- Migrations: `pnpm db:generate && pnpm db:migrate`

## Hard rules

- Money is integer cents (`src/lib/money.ts`). Never floats, never `number` dollars.
- Business logic in `src/services/`, never in route handlers or components.
- `drizzle-orm` imports only inside `src/infra/db/`.
- Schema changes and their generated SQL migration go in the same commit.
- Before declaring done: `pnpm typecheck && pnpm test` must pass.

## Where things live

- Routes: `src/app/` — Services: `src/services/` — DB: `src/infra/db/`
- Components: `src/components/` (`ui/` is generated — don't edit)
- Conventions detail: `.claude/skills/repo-conventions/SKILL.md`
```
