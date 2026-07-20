# Actions audit — cinch-app: push+PR duplication & the failing Vercel deploy

Audited 2026-07-20 against the live GitHub API (follow-up to the org-wide
Actions-minutes diagnosis). Scope: `Gull-Stack/cinch-app` (private — all
minutes bill against the org's 3,000/month pool). **Nothing has been changed;
all fixes below are pending Bryce's sign-off.**

## TL;DR

1. **The "push + pull_request duplication" is three different things**, and the
   most visible one costs zero minutes: `argus-qa.yml` has been an **invalid
   workflow file since #125 (July 14, 16:32 UTC)**, so GitHub logs an instant
   failed run on *every push to every branch*. ~240 phantom failures so far —
   0 jobs, 0 minutes, pure noise. The real consequence is silent: **the Argus
   QA gate has not reviewed a single PR in 6 days.**
2. The only genuine trigger duplication is `unit-tests.yml` (`pull_request` +
   `push: [main]`). Real but cheap: ~2 billable min per merge, ≈ 24 min/day at
   current cadence.
3. **`deploy-production.yml` has failed all 14 of its runs** — the
   `VERCEL_TOKEN` secret was never created. Since the Vercel project is not
   git-connected, **main → production deploys have been dead since the
   workflow landed (July 19)**. Cost is trivial (fail-fast in ~10 s); the
   outage is the problem.
4. The actual minute burner in this repo is neither of the audited items:
   `ux-guardrail.yml` (140 runs × ~7 billable min since July 11 ≈ **~980 min**)
   plus `unit-tests` (287 runs × ~2 min ≈ **~575 min**) — together roughly
   half the org's monthly pool.

---

## Finding 1 — argus-qa.yml is invalid; every push logs a phantom failure

**Symptom** (what the Actions tab shows): every push — main or any `claude/*`
branch — produces a failed run named `.github/workflows/argus-qa.yml` (the
name degrades to the file path when GitHub can't parse the file). 0 jobs,
conclusion `failure`, ~0 s. Last 30 runs of this workflow: 30/30 push-event
failures. This is the bulk of the perceived "everything runs twice and half
of it is red."

**Timeline** (from the run history, 329 runs total):

- Last good `pull_request` run: 2026-07-14T16:30 UTC (success).
- First phantom `push` failure: 2026-07-14T16:32 UTC, on the #125 branch
  (`de093e91`).
- #125 merged to main 16:35 UTC; 100% of runs since are phantom failures.

**Root cause** — one line added by #125:

```yaml
PR_TITLE: ${{ github.event.pull_request.title || format('PR #{0} (manual dispatch)', inputs.pr_number) }}
```

The scalar is unquoted, and in YAML a ` #` inside an unquoted scalar starts a
comment. The value GitHub actually receives is:

```
${{ github.event.pull_request.title || format('PR
```

— an unterminated `${{` expression, which fails GitHub's parse-time
validation. (Generic YAML linters pass the file — the string is legal YAML —
which is why this slipped through.) GitHub validates every workflow file at
every push, and an unparseable file yields exactly this behavior: a failed
run per push, on every branch, regardless of the file's `on:` triggers.

**Impact:**

- **Argus QA gate dead since July 14.** `on: pull_request` never fires; the
  manual `workflow_dispatch` lane added by #125 has never been usable either.
  Every PR merged in the last 6 days (roughly #126–#193) went in unreviewed,
  while the failed runs made it *look* like something was running.
- ~240 phantom failed runs of log noise. Zero minutes billed (no jobs start).

**Fix (one line)** — quote the scalar:

```yaml
PR_TITLE: "${{ github.event.pull_request.title || format('PR #{0} (manual dispatch)', inputs.pr_number) }}"
```

Any push carrying this change immediately restores the PR gate and stops the
phantom failures. Worth pairing with an `actionlint` pre-push/CI check so an
unparseable workflow can't land silently again.

## Finding 2 — unit-tests.yml: the only real push+PR trigger duplication

```yaml
on:
  pull_request:
    types: [opened, synchronize, reopened]
  push:
    branches: [main]
```

Each PR is tested on its merge ref, then the same content is re-tested on
main ~1 min after merge. Last 40 h: 18 `pull_request` runs + 12 `push` runs,
all ~1.1 min wall-clock (~2 billable min after per-job round-up). The main
lane is therefore ~40% of this workflow's spend but only **≈ 24 min/day**.

Options (in preference order):

- **Keep it.** With argus-qa broken and no merge queue, the push-to-main run
  is currently the only thing verifying the actually-merged commit. Cheapest
  insurance in the building.
- Drop `push: [main]` once argus-qa is fixed and branch protection requires
  the PR checks — saves ~700 min/month only if merge cadence stays this high.

Note: `deploy-production.yml` also triggers on `push: [main]`, but that is
the deploy path, not duplication. `ux-guardrail.yml` is PR-only.

## Finding 3 — deploy-production.yml: 14/14 failures, VERCEL_TOKEN never set

Every run since the workflow landed (July 19, #180) fails in ~10 s at its own
fail-fast step:

```
##[error]VERCEL_TOKEN secret is not set. Create a token at
vercel.com/account/tokens (gull-stack team scope) and add it as a repo
secret named VERCEL_TOKEN — then re-run this workflow.
```

The cinch Vercel project is deliberately not git-connected, so this workflow
is the *only* automatic path from main to production. Consequence: **nothing
has auto-deployed since July 19** — ~14 merges' worth of shipped work
(mobile overhaul, text-to-pay, reconciliation, etc.) is live only if someone
has been running `vercel --prod` by hand.

**Fix:** create a Vercel token scoped to the gull-stack team → add as repo
secret `VERCEL_TOKEN` → re-run the latest run (org/project IDs are already
pinned in the workflow).

**Cost warning once fixed:** the workflow runs `vercel pull` + `vercel build`
(full Next.js build + Drizzle migrations) + `vercel deploy --prebuilt` on the
GitHub runner. At the current cadence (~7 main-pushes/day) expect roughly
**35–100+ min/day (~1,000–3,000 min/month)** — it would instantly become the
org's #1 consumer. Mitigations to weigh before flipping it on:

- Git-connect the Vercel project and delete this workflow — builds move to
  Vercel's infra, Actions cost drops to zero. (Migrations already run inside
  `vercel build` via `scripts/migrate-or-skip.mjs`, so they'd still apply.)
- Or keep the workflow but batch deploys (e.g. `schedule` every few hours +
  `workflow_dispatch`) instead of per-push.

## Minutes ledger for cinch-app (July cycle, estimated)

GitHub's per-run billable API now returns 0 (deprecated), so figures are
wall-clock × per-job minute round-up:

| Workflow | Runs this cycle | Typical billable | Est. total |
|---|---|---|---|
| ux-guardrail | 140 (since Jul 11) | ~7 min | **~980 min** |
| unit-tests | 287 | ~2 min | **~575 min** |
| argus-qa (real, pre-Jul 14) | ~90 | 2 jobs, ~3–5 min | ~300–450 min |
| argus-qa (phantom, post-Jul 14) | ~240 | 0 min | 0 |
| deploy-production | 14 | ≤1 min | ~14 min |

≈ **1,900–2,000 min from this one repo** — on the order of two-thirds of the
org's 3,000-minute pool, alongside the ~970 min of dead calendar-sync crons
found in the org-wide pass. If minutes are the priority, `ux-guardrail`'s
per-PR-sync full-rig run (postgres + build + seed + Playwright on every push
to a PR) is the lever that matters, not the unit-tests duplication.

## Recommended order of operations (pending Bryce)

1. Quote the `PR_TITLE` line in `argus-qa.yml` — restores the QA gate, kills
   the phantom failures. One line, zero risk.
2. Set `VERCEL_TOKEN` **after** deciding the deploy-cost question above —
   fixing it as-is starts burning 1,000+ min/month on a pool that is already
   at 100%.
3. Leave `unit-tests` push+PR duplication alone until 1) is merged; it is
   currently the only post-merge verification.
4. Separately consider gating `ux-guardrail` (e.g. `paths:` filter or a
   label-trigger) — it is the repo's dominant spend.
