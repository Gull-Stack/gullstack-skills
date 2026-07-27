# Product Loop — Grok gate (cross-model audit at the dry point)

Grok audits once per product, after the loop is DRY — not every round. A
different model has different blind spots; spending them on round 1 noise is
waste. This stays consistent with the brain's deploy QAQC protocol
(`protocol/grok-deploy-qaqc.md` in the upstream brain): Grok gates prod.

In Phase 0 a human carries this handoff: one paste out, one paste back.
In Phase 2 a script calls the xAI API with the same contract. Either way the
format below is the contract — do not freelance the prompt per product, or
the results stop being comparable across products.

## Handoff prompt (paste to Grok, attach or link the referenced files)

```
You are the final cross-model QA gate for a product built by another AI and
audited by a fresh instance of that same AI over several rounds. Both share
blind spots you may not. Your job is to find what they both missed.

Attached / linked:
1. The final screenshot matrix (per screen, mobile + desktop, states)
2. The PR diff
3. The findings ledger (qaqc/findings.json) - everything already found,
   fixed, or refuted. Do NOT repeat anything in it.

Judge against these standards, in priority order:
1. Would a paying customer hit a wall in the first 60 seconds? (broken
   flows, dead CTAs, confusing first screen)
2. Visual defects visible in the screenshots (alignment, contrast,
   truncation, mobile breakage, empty/error states)
3. Claims in the diff the evidence does not support
4. Anything a competent human reviewer would flag that a same-model
   reviewer plausibly would not

Return ONLY a JSON array, no prose:
[{"severity": "BLOCKER|MAJOR|MINOR",
  "where": "<screen or file>",
  "what": "<one sentence, concrete>",
  "evidence": "<which screenshot or diff hunk shows it>"}]
Return [] if you find nothing new. Do not manufacture findings to seem
thorough - an empty array from you is a meaningful pass.
```

## Return handling (whoever carries the result back)

1. Paste Grok's JSON into `qaqc/findings.json` as new entries with
   `"source": "grok"`, status `NEW`.
2. Any BLOCKER or MAJOR: the loop re-opens — maker fixes, auditor verifies,
   one extra round max, then back through this gate.
3. MINOR only, or `[]`: the gate passes. The human gets the dry-point
   summary (ledger + final screenshots + Grok result) for final accept.
4. If Grok's finding contradicts a `REFUTED` finding in the ledger, that
   conflict goes to the human as a formed question — cross-model
   disagreement is exactly what the knowledge expert is for, and the ruling
   goes in the rulings ledger.
