# Product Loop — Evidence Base

Why this design is defensible. Researched 2026-07-27 across three tracks:
the most-starred GitHub loop/agent frameworks and their post-mortems, the
peer-reviewed self-correction literature, and shipped coding-agent and
AI-code-review products. Star counts read from github.com on 2026-07-27.

## The industry arc, one paragraph

2023 rewarded loops that promised autonomy: AutoGPT hit 185k stars (fastest
growth in GitHub history), then its autonomous loop was archived to a
`classic/` directory after documented infinite loops, circular re-planning,
and runaway spend (cost-awareness was literally its issue #6). BabyAGI:
archived. CAMEL's paper documented agents aware they were stuck in
thank-you loops but unable to exit. Every survivor moved the same
direction — explicit structure, bounded iterations, verified steps, human
gates (AutoGPT itself pivoted to a visual graph builder; CrewAI added
Flows; ChatDev went YAML; OpenAI replaced Swarm with a guardrailed SDK;
Microsoft abandoned 60k-star AutoGen for a typed-graph framework). Stars
measured demand for autonomy; production adoption went to loops that sell
control. This loop is on the surviving side of every one of those lines.

## Design decision → evidence

| Our choice | The evidence | Key sources |
|---|---|---|
| Loop-until-dry with hard caps (2-dry exit, 4-round max) | Ungrounded refinement plateaus at 1–2 rounds and can degrade (GPT-4 GSM8K 95.5→89.0 over 2 self-correction rounds); every unbounded-loop project died of no termination criteria. Grounded loops may run longer because each round injects new information — ours does. | Huang et al. ICLR'24 (arxiv 2310.01798); Self-Refine (2303.17651) iteration curve; SCoRe (2409.12917); AutoGPT/BabyAGI post-mortems |
| Every round injects unfakeable external evidence (screenshots, exit codes, crawl results) — never opinion-only refinement | The single most replicated result in the field: self-critique without external signal measures ~0 or negative on correctness (CRITIC ablation: −0.03 F1 without tools; Self-Refine math: ~0%, feedback unhelpful in 94% of cases); with a genuine signal, fix-and-retry works (Reflexion: 91% vs 80% HumanEval). Anthropic: "give Claude a way to verify its work... or you become the verification loop." | CRITIC (2305.11738); Self-Refine; Reflexion (2303.11366); Huang et al.; Anthropic building-effective-agents + Claude Code best practices |
| Maker/checker split with fresh-context auditor | "Agents tend to respond by confidently praising the work — even when the quality is obviously mediocre" (Anthropic harness post); Claude Code ships fresh-subagent review for exactly this reason; OpenHands' SWE-bench SOTA used a separate critic to score maker output. | Anthropic harness-design post; OpenHands critic blog; claude-code-action find→verify pipeline |
| Cross-model Grok gates (brief + final) | The strongest-evidenced choice in the design: self-preference bias is causally driven by self-recognition and is a property of the MODEL, not the conversation (fresh context does not remove it); a panel of judges from disjoint model families beat a single same-family judge across six datasets at 1/7 cost; feedback from a different/stronger source reliably beats self-generated feedback. | Panickssery et al. NeurIPS'24 (2404.13076); PoLL (2404.18796); Olausson et al. ICLR'24 (2306.09896) |
| Brief Gate before build, brief as committed artifact | Every surviving product added a plan gate with a human-editable artifact (Cursor Plan Mode, Claude Code plan mode, Devin 2.x interactive planning, Copilot spec→plan→code); Anthropic's harness guidance: agree what "done" looks like before code is written ("sprint contract"). Our `qaqc/brief.md` is that contract, adversarially reviewed cross-model. | Anthropic harness-design post; Cognition Devin 2025 review; Copilot Workspace retrospective |
| PR-as-state-machine, git as checkpoints, prompt files as roles, no orchestration framework | 12-Factor Agents: own your control flow. Aider (47.7k stars) uses git itself as the checkpoint mechanism; OpenHands' admired design is an append-only event log — our PR + committed ledger is the same property. Framework risk is real: 60k-star AutoGen went maintenance-mode; Swarm was deprecated. Minimal primitives outlive frameworks. | 12-factor-agents; Aider repo; OpenHands SDK paper; AutoGen retirement coverage |
| Rubric-anchored, low-precision scoring where every low score must cite findings | Unanchored scales collapse or go random; industry guidance is per-level anchors, decomposed criteria, evidence-anchored scores. LLM judges on subtle correctness are near coin-flip (GPT-4o 50.9% on JudgeBench) — so our correctness never rests on judge opinion, only on mechanical gates; the rubric covers what rubrics can. | Braintrust scorer guidance; LangSmith align-evals; JudgeBench ICLR'25 (2410.12784) |
| Dedupe against all seen + evidence-required findings + observations-are-not-findings | The AI code-review industry's central lesson: 79% of uncalibrated bot comments were ignorable nits; "the LLM's judgment of its own output was nearly random"; what worked was filtering against human reaction history and verifying findings before posting ("comments with receipts", ≥80-confidence thresholds). Precision beats recall — a muted auditor has zero recall. | Greptile "make LLMs shut up"; CodeRabbit verification posts; claude-code-action defaults |
| Verification by using the product: Playwright click-through + screenshot matrix | Anthropic's evaluator "used the Playwright MCP to click through the running application the way a user would"; the documented Claude Code UI loop is screenshot → compare → fix → repeat. SWE-agent: immediate structured feedback per action (its lint-gate) was worth more than model cleverness — our per-round evidence pack is that principle at product scale. | Anthropic harness-design post; Claude Code best practices; SWE-agent NeurIPS'24 (2405.15793) |
| Single maker per product; parallelism across products only; human gates at draft-PR and accept | "Don't Build Multi-Agents": actions carry implicit decisions parallel writers can't share; shipped compromise everywhere is parallel readers, single writer, human merge. Devin's data: long autonomous sessions fail past ~4h — chained short loops with structured handoff (our ledger) beat one long session. | Cognition don't-build-multi-agents + Devin 2025 review; industry convergence on draft-PR-as-output |
| DECISION_LOG as human-reaction calibration | The two shipped systems that solved review-bot trust both did it by persisting human reactions: CodeRabbit's "Learnings" (tell it once, it stops flagging) and Greptile's downvote-embedding filter (address rate 19%→55%). Our decision log is the same mechanism with a stronger contract: every ruling must land as a rule in a canonical home. | CodeRabbit Learnings; Greptile blog |

## What the evidence forced us to change (this audit's yield)

1. **Same-model auditor bias is acknowledged, not assumed away.** Fresh
   context does NOT remove self-preference — the bias is model-level
   (Panickssery et al.). Mitigation: the auditor's authority is coverage
   checking, rubric application, and evidence verification — never
   unanchored taste; correctness verdicts come only from mechanical gates.
   The residual same-family blind spot is exactly what acceptance-test
   metric 5 (Grok finds what Claude missed) measures. `AUDITOR.md` now
   carries this scope limit explicitly.
2. **Screenshot judgment is scoped to what VLMs are proven to do.** VLM
   screenshot judges reach ~75–85% human agreement, are reliable for
   obvious breakage and A-vs-B ranking, unreliable for fine-grained
   defect scoring (VisualWebArena 16.4% vs 88.7% human; rank-not-score
   result). The auditor's screenshot mandate is now: point-at-able
   doctrine violations and obvious breakage; pixel-level aesthetic calls
   are observations for the human. This is also why human final accept is
   permanent, not transitional.
3. **Rubric scores are declared what they are:** low-precision anchored
   gates, where the cross-round trajectory is the signal — not a
   precision instrument. (Braintrust: binary/low-precision anchored
   criteria over numeric scales.)
4. **The decision log now records negative rules too.** A finding class
   the human rejects becomes a do-not-flag rule (the CodeRabbit
   "Learnings" mechanism) — calibration comes from human reaction data,
   the only method with published address-rate gains.

## Known limits, stated plainly

- Between Grok gates, the loop's judge shares a model family with its
  maker. The literature says this costs something; metric 5 measures how
  much. If Grok keeps finding what the auditor missed, the auditor prompt
  gets revised — that path is in `ACCEPTANCE-TEST.md`.
- At matched compute, generate-N-and-pick can beat iterate-on-one
  (Huang et al.; Olausson et al.; OpenHands' best-of-N SOTA). For whole
  products N builds are impractical, but this is the Phase 2+ upgrade
  path for cheap stages: N brief drafts or N design directions, judged,
  before the loop runs.
- VLM fine-grained UI judgment may improve to human level; until there is
  evidence, the human accept stays.

## Practices we deliberately avoid — and who proved them wrong

- Unbounded autonomous loops (AutoGPT archived it; Devin v1 walked it back).
- Orchestration-framework adoption (AutoGen: 60k stars, abandoned;
  the PR + Routines substrate has no such risk).
- Same-model self-judging without rubric anchors (Greptile: "nearly random").
- Recall-maximizing review (79% nit rate trains humans to mute the bot).
- Parallel writers on one product (context fragmentation; Cognition).
- Optimization loops over subjective fitness (AlphaEvolve-class systems
  hard-require a cheap objective evaluator; product taste is not one).
