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

Both loops run as Claude Routines (scheduled fresh sessions in the Claude Code
remote environment). The routine prompts are versioned in each loop's directory —
if a routine drifts from its file here, the file wins; update the routine.
