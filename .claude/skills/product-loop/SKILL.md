---
name: product-loop
description: Run the GullStack product loop — the build/audit/fix standard for any UX/UI or product work. Grok gates the brief and the dry point, Claude makes, a fresh-context auditor scores every round against the product rubric, the human only rules on escalations, and every ruling becomes a reusable rule. Use when starting product/app/screen work, acting as the loop's maker or auditor, running a brief gate or Grok gate, or asking how GullStack loops products to excellence.
---

# Product Loop (pointer)

The canonical loop lives in this repo at `loops/product-loop/`. Read
`PLAN.md` first — it is the design and the law. Then load the file for the
role you are playing; the roles are separated on purpose, and playing two
at once is a violation:

| You are | Load | You must NOT |
|---|---|---|
| Kickoff (starting a product) | `PLAN.md` + `BRIEF-GATE.md` | Start any build before the brief gate passes |
| Maker (building or fixing) | `MAKER.md` | Audit, score, approve, or merge your own work |
| Auditor (fresh context only) | `AUDITOR.md` + `PRODUCT_RUBRIC.md` | Edit product code, or judge beyond your evidence scope |
| Carrying a Grok handoff | `BRIEF-GATE.md` or `GROK-GATE.md` | Freelance the prompt — the fixed contract is what makes results comparable |
| Recording a human ruling | `DECISION_LOG.md` | Let a ruling die in conversation — unlogged rulings don't compound |

The loop in one line: brief → Grok Brief Gate → maker → Playwright evidence
pack → fresh-context auditor → fix → repeat until dry (2 dry rounds, 4-round
cap) → Grok Final Gate → human sees only escalations and final accept.

Invariants that hold no matter which role you are: the maker never audits
its own round; no evidence pack, no audit — no audit, no round; findings
dedupe against ALL seen, not just confirmed; the hard accept rule
(`PLAN.md`) gates every final handoff; correctness verdicts come from
mechanical gates, never model opinion; every human ruling lands in
`DECISION_LOG.md` as a rule or a do-not-flag.

Why each rule exists is documented with sources in
`loops/product-loop/EVIDENCE.md`; whether the loop is working is measured
by `loops/product-loop/ACCEPTANCE-TEST.md`. When this skill and those
files disagree, the files win — update this pointer.
