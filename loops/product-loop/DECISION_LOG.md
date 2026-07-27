# Decision Log — every human ruling becomes a product rule

The canonical, cross-product rulings ledger. When the human rules on an
escalation — a rubric conflict, a persisting finding, a judgment call, a
brief-gate override, a below-target accept — the ruling is recorded here
in the same PR that closes the escalation. Per-product `findings.json`
records the local ruling; this file is where rulings become reusable.

This is the compounding mechanism of the whole loop: the metric that
proves it works is rounds-to-dry and escalations-per-product trending
down. If this file is not growing, the loop is not learning.

## Entry format

One row per ruling. `Rule extracted` is the point — a ruling that cannot
be turned into a rule for future products should say `one-off` and why.

| ID | Date | Product | Question (as escalated) | Ruling | Rule extracted → where it now lives |
|---|---|---|---|---|---|

## Promotion rules

1. Every ruling gets an entry the same day it is made. No batch backfilling
   from memory — memory is where rulings go to die.
2. `Rule extracted` must land in a canonical home, not just this table:
   a one-line addition to the relevant skill in this repo, an Argus
   PLAYBOOK candidate filed as an issue on `Gull-Stack/Argus`, or a new
   anchor row in `PRODUCT_RUBRIC.md`. This table records where it went;
   it is the index, not the destination (one canonical copy per doctrine).
3. If the same question is escalated twice, the first ruling's rule
   extraction failed. Fix the rule's wording or placement — do not just
   rule again.
4. Quarterly: read this table end to end. Retire rules that never fired,
   tighten rules that fired often, and check the trend line on
   rounds-to-dry across products.

## Rulings

(none yet — the loop has not run)
