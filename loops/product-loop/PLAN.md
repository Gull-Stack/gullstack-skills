# The Product Loop — Claude builds, Grok audits, the human rules

Design doc for looping UX/UI and product work without a human as the message
bus. Codified 2026-07 from the manual loop we run today (Claude builds → paste
to Grok → paste findings back → arbitrate) and from the loop research notes:
fresh verification, loop-until-dry, false-edge test, isolation, Amdahl.

## The problem

Today the human is the transport layer: copy build output to Grok, copy Grok
findings to Claude, arbitrate every disagreement, repeat per round, per
product. That caps throughput at one human's context-switching budget and it
makes quality depend on whether the human was fresh at round 3.

## The design in one sentence

The loop runs build → audit → fix rounds until two consecutive audits find
nothing new; the human sees only escalated judgment calls and the finished PR
with its full audit trail — and every human ruling is committed as a rule so
the same question is never asked twice.

## Roles (fresh verification, applied)

| Role | Who | Rule |
|---|---|---|
| Maker | Claude session on an isolated branch | Builds and fixes. Self-reviews with `argus-qa` before every push (cheap first filter). Never audits its own round. |
| Auditor | A **fresh-context** session that did not build the thing | Runs every round. Judges the evidence pack against the rubrics, prompted to refute, not to approve. Writes findings to the ledger. |
| Cross-model gate | Grok | Runs **once per product**, at the dry point — not every round. Different model, different blind spots. Stays the prod-deploy QAQC gate per the brain protocol (`protocol/grok-deploy-qaqc.md` in the upstream brain). |
| Knowledge expert | The human | Sees only: escalations, the dry-point summary, final accept. Every ruling lands in the rulings ledger. |

The maker/checker split is the same law as `loops/README.md` rule 1 — but a
product audit cannot be a dumb script, so the gate here is a fresh-context
auditor bound to written rubrics plus a dumb sub-gate (build, typecheck,
crawl checks) that stays a script. The auditor interprets; the scripts decide
pass/fail on everything mechanical.

## The loop (loop-until-dry)

```
round N:
  maker    build or fix confirmed findings
  maker    produce evidence pack, self-review (argus-qa), push
  auditor  fresh session: judge evidence pack against rubrics
  auditor  dedupe new findings against ALL seen (not just confirmed)
  auditor  write ledger: NEW / CONFIRMED / REFUTED / PERSISTING / RESOLVED
  → if 0 new confirmed findings for 2 consecutive rounds: DRY → Grok gate
  → if any finding PERSISTING after 2 fix attempts: ESCALATE to human
  → if round N = 4: ESCALATE to human (the loop is losing; stop feeding it)
```

Two exits always, per `loops/README.md` rule 3: dry, or a hard cap. Dedupe is
against **seen**, not confirmed — otherwise refuted findings reappear every
round and the loop never converges.

## The evidence pack (what makes UI auditable)

A UI cannot be audited from a diff. Every round the maker commits an evidence
pack to the branch under `qaqc/round-<N>/`:

1. **Screenshot matrix** — every changed screen × mobile (390px) and desktop
   (1440px) × meaningful states (empty, loaded, error), taken with Playwright
   against a local build or preview deploy. If screenshots cannot be produced
   this round, the pack must say so in one line — the audit then covers code
   and crawl only, and the report headline states the gap (never guess).
2. **Mechanical gate output** — build, typecheck, tests, and the relevant
   `fleet-crawl` checks (every CTA resolves, forms wired) with exit codes.
3. **Verification block** — what was run, what was observed (Argus rule G).
   No pack, no audit; no audit, no round.

The auditor judges the screenshots against `app-design`, `ux-ui`, and
`design-standard-v3.md` — the doctrine already written down — and the diff
against `argus-qa`. A finding the auditor cannot anchor to a written rule or
a visible defect in the pack is an observation, not a finding (same law as
`claude/agents/gullstack-reviewer.md`).

## Findings ledger

One file per product loop, committed on the branch: `qaqc/findings.json`.

```json
{
  "product": "cinch-app",
  "pr": 42,
  "rounds": 3,
  "findings": [
    {
      "id": "F-007",
      "round_found": 2,
      "rule": "app-design: hero metric must be tappable",
      "where": "screens/dashboard, mobile",
      "severity": "BLOCKER",
      "status": "FIXED",
      "evidence": "qaqc/round-2/dashboard-mobile.png",
      "history": ["NEW@2", "CONFIRMED@2", "FIXED@3"]
    }
  ],
  "rulings": []
}
```

Statuses: `NEW → CONFIRMED | REFUTED`, then `FIXED | PERSISTING | ESCALATED`.
The ledger is state outside the conversation (`loops/README.md` rule 2): any
fresh session can pick the loop up from the file alone.

## Escalation contract (what protects the human's brain)

Only four things reach the human, and each arrives as a formed question with
options — never as raw context to re-derive:

1. A BLOCKER that conflicts with written doctrine (the rubric contradicts
   itself, or following it breaks the product).
2. A finding still PERSISTING after two fix attempts.
3. A judgment call no rubric covers (copy tone, pricing, brand, auth,
   payments — the `loops/README.md` rule 4 list).
4. The dry-point summary: ledger + final screenshots + the Grok gate result,
   for accept/reject.

Everything else the loop settles itself. If the human is answering the same
kind of question twice, that is a defect in the rulings ledger, not a fact of
life.

## The rulings ledger — where the compounding lives

Every human ruling is written down twice:

1. In the product's `findings.json` under `rulings` (the local record).
2. As a rule-candidate: a one-line addition to the relevant skill in this
   repo, or an Argus PLAYBOOK candidate filed as an issue on
   `Gull-Stack/Argus`. The maker of the *next* product loads it for free.

This is the knowledge-graph idea from the research notes, applied at our
scale: the entities are rules, screens, and findings; the edges are "this
rule killed this finding" and "this ruling created this rule." At our volume
the graph lives in committed files and links — build the graph database when
the files stop answering questions, not before.

**The metric that proves compounding:** rounds-to-dry and escalations per
product must trend down across products. If rounds-to-dry has not fallen
after five products, rulings are not being captured into rubrics — fix the
ledger discipline, not the loop.

## Wiring — three phases

### Phase 0 — this week, no new infrastructure

Semi-automated ping-pong with the pieces that already exist:

1. Maker session builds on `product/<name>` in a worktree, opens a draft PR,
   subscribes to PR activity, produces the evidence pack.
2. Auditor = a fresh Claude session (new conversation, or a subagent with
   clean context) given only `AUDITOR.md` + the PR. It posts its findings as
   a PR review and updates `qaqc/findings.json`.
3. The maker session wakes on the review event and fixes. Rounds ping-pong
   through the PR with zero human transport.
4. At dry: the human runs the Grok gate once using `GROK-GATE.md` — one paste
   out, one structured paste back into the ledger. Human transport drops from
   every round to once per product.

### Phase 1 — automate the heartbeat

Auditor becomes a Routine (fresh session per firing), triggered on PR pushes
to `product/*` branches, same as the existing loops. The human gets exactly
two notification types: ESCALATION and DRY. Arm it only after Phase 0 has run
on two products with an acceptable cost per accepted change (`loops/README.md`
rule 5).

### Phase 2 — cross-model inside the loop

If an xAI API key is provisioned, the Grok gate moves from a human paste to a
script the auditor calls: diff + screenshot paths + ledger out, structured
findings back. Grok then runs every round, not just at dry, and the human's
last transport duty disappears. Quarterly: mine all rulings ledgers for rules
that belong in skills or the Argus PLAYBOOK.

## What we are deliberately NOT building

Applying the false-edge test to our own research list:

- **No agent-graph runtime** (LangGraph, AutoGen, CrewAI). The PR is the
  state machine, git is the checkpoint store, PR events are the edges. An
  orchestration framework is a false edge until a real dependency appears
  that git + Routines cannot sequence.
- **No knowledge-graph database.** The ledger + this skills repo already
  store entities and relationships as files at our volume. GraphRAG earns
  its keep at corpus scale; adopt it when the files stop answering "which
  rule killed this finding," not before.
- **No fan-out of builders within one product.** Amdahl: the critical path is
  audit → fix, which is serial. Parallelism goes across products (several
  loops in flight), never multiple makers in one checkout — isolation rule.

## Files in this loop

| File | What it is |
|---|---|
| `PLAN.md` | This design (canonical) |
| `MAKER.md` | The maker round prompt, versioned |
| `AUDITOR.md` | The fresh-context auditor prompt, versioned |
| `GROK-GATE.md` | The one-paste Grok handoff and required return format |

Per repo convention: if a live Routine drifts from these files, the file wins.
