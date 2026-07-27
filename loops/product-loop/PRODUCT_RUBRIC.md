# Product Rubric — one scoring standard across all products

Every product loop scores against this file, every round, so scores are
comparable across rounds, products, and models. The auditor scores each
round; Grok scores at the final gate; disagreement of 2+ points on any
dimension is itself an escalation.

This file scores; it does not duplicate doctrine. Each dimension names the
canonical source it applies (one canonical copy per doctrine — link, don't
copy).

## Dimensions (0–5 each)

| # | Dimension | Doctrine source | 5 looks like | 2 looks like |
|---|---|---|---|---|
| 1 | First 60 seconds | `ux-ui`, StoryBrand one-liner | A cold user knows what this is and completes the first meaningful action without help | User must already know the product to get anywhere |
| 2 | Primary flow | the brief's numbered flow (`qaqc/brief.md`) | Every step works on desktop AND mobile, including back/retry paths | A step fails, dead-ends, or silently loses input |
| 3 | Visual craft | `app-design` (apps) / `design-standard-v3.md` (sites) | Hierarchy, spacing, and color match doctrine in every screenshot | Visible misalignment, contrast failures, or truncation in any state |
| 4 | State coverage | evidence pack requirement (`PLAN.md`) | Empty, loaded, and error states designed and screenshotted for every changed screen | Only the happy path exists |
| 5 | Mobile | screenshot matrix, 390px column | Mobile is a first-class layout, thumb-reachable, nothing crammed | Mobile is desktop squeezed until it fits |
| 6 | Evidence honesty | `argus-qa` rule G | Every claim in the verification block is backed by named output; gaps are stated | Claims without evidence, or gaps discovered by the auditor |
| 7 | Doctrine compliance | `argus-qa` A–H, bryce-method gates | Zero rubric violations in the diff | Any BLOCKER-class violation |

**Score = sum, max 35. Default target: 30, with no dimension below 3.**
The brief may set a higher target; it may set a lower one only with a
human ruling logged in `DECISION_LOG.md`.

## What these scores are

Low-precision anchored gates, not a precision instrument (unanchored
numeric scales collapse or go random — see `EVIDENCE.md`). A dimension
score answers "which anchor row does the evidence match," nothing finer.
The signal the human reads is the **trajectory across rounds** and the
findings behind each low score — never a decimal comparison between
products.

## Scoring rules

1. Score only what the evidence pack shows. A dimension without evidence
   scores what the evidence supports — usually low. Never score intentions.
2. Each score below 4 must name the finding(s) that caused it (ledger IDs).
   A low score with no findings attached is itself a defect in the audit.
3. Scores go in `qaqc/findings.json` per round, so the score trajectory
   across rounds is part of the dry-point summary the human sees.
4. The target is part of the hard accept rule (`PLAN.md`): no final
   handoff below target, no exceptions without a logged ruling.
