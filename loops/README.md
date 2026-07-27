# GullStack Loops

Autonomous loops that enforce the standards in this repo while humans sleep.
A loop = heartbeat (schedule) + skill (this repo) + maker/checker separation +
connectors (git, GitHub, notifications) + a **dumb verifier** that passes or
fails with no opinion.

## Rules every loop follows

1. **The gate is dumb.** A script exits 0 or 1. The agent never grades its own
   homework; it interprets and routes findings, it does not decide pass/fail.
2. **State lives outside the conversation.** Findings are committed files; the
   next run diffs against them instead of starting from zero.
3. **Two exits always.** Goal met, or hard cap fired (per-run item caps, WIP
   caps). No loop runs unbounded.
4. **Judgment stays human.** Loops fix mechanical breakage and file findings.
   Copy, design, auth, payments, and anything behind the Grok deploy-QAQC gate
   never auto-ships.
5. **The metric is cost per accepted change.** If accepted-change rate drops
   below ~50%, pause the loop and tighten it — it's losing.

## Active loops

| Loop | Heartbeat | Gate | State |
|---|---|---|---|
| `fleet-crawl/` | nightly | `crawl.sh` exit code (deployment-checklist crawl over live sites) | `fleet-crawl/findings/` committed to `loop/fleet-crawl-findings` |
| `issue-to-pr/` | weekday mornings | repo build/tests + Argus PR review | the issue tracker + open PRs |
| `product-loop/` | per product, PR-event driven (**designed, not yet armed** — see its `PLAN.md`) | fresh-context auditor bound to the written rubrics + mechanical sub-gates, then a one-shot Grok cross-model gate at the dry point | `qaqc/findings.json` on the product branch |

`product-loop/` is the build → audit → fix loop for UX/UI and product work:
Claude makes, a fresh-context session checks every round, Grok cross-checks
once at the dry point, and the human only sees escalations and the final
accept. Its audit gate is not a dumb script (a product audit can't be), so it
compensates with the strictest state discipline: every finding lives in a
committed ledger, deduped against all seen, with two exits always.

Both loops run as Claude Routines (scheduled fresh sessions in the Claude Code
remote environment). The routine prompts are versioned in each loop's directory —
if a routine drifts from its file here, the file wins; update the routine.
