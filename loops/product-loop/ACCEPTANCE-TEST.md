# Product Loop — Acceptance Test

The loop itself is a product, and this is its rubric. The point is not that
the process sounds smart; the point is that it measurably reduces the
human's cognitive load while raising the product floor. If the numbers
below do not move, the loop gets revised or killed — same law as
`loops/README.md` rule 5.

Every counter except `touch_count` is computed from committed state
(`qaqc/findings.json`, `DECISION_LOG.md`, PR history). The loop measures
itself from its own files; no one's memory is an instrument.

## Success metrics

| # | Metric | Target | Failure looks like |
|---|---|---|---|
| 1 | Human touches | Kickoff + brief paste + final paste + final accept + true escalations (Phase 0; Phase 2 removes the pastes) | The human re-reads context between rounds, or transports anything a file could have carried |
| 2 | Evidence quality | Every finding cites a screenshot, state, or rule | Vague taste notes; "seems off"; findings the maker must interpret |
| 3 | Rounds-to-dry | Falls across products as rulings become rules | The same classes of issues keep reaching the human |
| 4 | Repeated finding rate | Previously ruled issue classes do not recur | The ledger exists but does not change maker/auditor behavior |
| 5 | Final Grok value | Grok returns different-blind-spot findings, not duplicates | Grok mostly repeats what Claude/auditor already found |

The core claim under test: **UI becomes loopable only when screenshots +
states + rules become evidence.** Without that, design stays subjective and
the human stays the bridge. With it, Claude builds, Claude-fresh audits,
Grok challenges at the gates, and the human only adjudicates.

## First live test (Phase 0, one bounded real product)

Run one product through the loop and record, in the dry-point summary:

| Counter | Source |
|---|---|
| `touch_count` | Touch log (below) |
| `rounds_to_dry` | Ledger round numbers |
| `findings_count` | Ledger entries |
| `findings_with_evidence_count` | Ledger entries with a screenshot path or rule citation |
| `repeated_findings_count` | Ledger entries matching a prior ruling class in `DECISION_LOG.md` |
| `grok_new_findings_count` | `"source": "grok"` entries that are not duplicates of seen |
| `josh_rulings_added_to_rules` | `DECISION_LOG.md` rows with a filled "where it now lives" |

**The pass/fail line:**

```
touch_count <= kickoff + brief paste + final paste + final accept + true escalations
findings_with_evidence_count == findings_count
```

If `touch_count` exceeds the formula, the loop needs revision — find which
touch a file should have carried, and fix the file, not the human. If any
finding lacks evidence, the auditor prompt failed — tighten `AUDITOR.md`.

## The touch log

`touch_count` is the one counter files cannot observe, so it is logged by
hand as it happens: a `touches` array in `qaqc/findings.json`, one line per
human touch (`what`, `round`, `expected: true|false`). Expected touches are
the formula's terms. Any unexpected touch is logged with the reason it was
needed — an unlogged touch discovered later counts double, because a loop
that hides its own cost is failing metric 1 twice.

## After the first test

- Metrics 1–2 and 5 are judged on the first run.
- Metrics 3–4 need a baseline: they are judged across the first five
  products, per `PLAN.md` — rounds-to-dry and escalations must trend down,
  and ruled classes must stop recurring. Not falling after five products
  means rulings are not being captured into rubrics: fix the
  `DECISION_LOG.md` discipline, not the loop.
- If metric 5 fails twice running (Grok mostly duplicates), the Final Gate
  prompt is not extracting different-blind-spot value — revise
  `GROK-GATE.md` before concluding cross-model review is not worth its
  paste.
