# STRICT Prompt — the mandatory structure for Grok-to-Claude work orders

Canonized 2026-07-27 by Josh ruling (DECISION_LOG entry R-001), from the
exemplar `docs/EAGLE-EYE-WAVE1-CLAUDE-PROMPT-STRICT.md` in
`Gull-Stack/cinch-app` (Eagle Eye Wave 1 — mobile recording trust).

**When this applies:** every QA/QC approval prompt in the loop that flows
from Grok to a Claude maker — a Final Gate verdict that opens a fix round,
a Brief Gate revision that authorizes build, or any standalone Grok audit
that becomes build work. The gate's JSON findings are the *data*; the
STRICT prompt is the *work order* derived from them. Findings never go to
the maker raw.

**Two laws before the skeleton:**

1. **Verbatim transfer.** The prompt is written once, committed to the
   product repo (`docs/<NAME>-CLAUDE-PROMPT-STRICT.md` or `qaqc/`), and
   pasted whole — "copy everything below the rule, do not paraphrase."
   A paraphrased work order is a corrupted work order.
2. **One wave per prompt.** A prompt covers exactly one bounded wave of
   work → one PR. Later waves are named so the maker knows they exist and
   are forbidden so it cannot start them.

## The mandatory sections, in order

| # | Section | Must contain | Why it exists |
|---|---|---|---|
| 1 | **Header** | Repo, base branch, canon pointer (the audit/ledger on record), and the scope sentence: "This PR is Wave N only; Waves X–Y are separate PRs — do not start them." | Anchors the work to committed truth, not chat memory |
| 2 | **PASTE OPENER** | The exact first message for the maker: follow-exactly file pointer, canon source of truth, scope reminder, standing constraints (rebase target, local gate, language rules) | The opener survives even if only the first screen gets pasted |
| 3 | **ROLE** | The mission in owner terms: what broke for whom, what the audit ranked, and a **north star** sentence describing the end state | The maker optimizes the outcome, not the checklist |
| 4 | **PREFLIGHT** | What is the HUMAN's job (env vars, accounts, approvals) as a table; and the standing order: if preflight is unverified, implement the code fully, note the status in the PR body, and **stop — never invent around a missing precondition** (no fake modes, no bypass paths, no weakened gates) | The #1 silent-corruption vector is a maker "helpfully" routing around a human-owned blocker |
| 5 | **READ FIRST (once)** | Ordered file list with one-line purpose each; plus: "Do not re-audit. Citations were against an older tip — re-open the files and match current symbols." | Bounded context load; prevents the maker burning the round re-deriving the audit |
| 6 | **HARD SCOPE** | An allowed-files table (file class → why) AND a forbidden list. Standing order: a fix requiring an out-of-table file means **stop, name the file and one-sentence reason, wait**. Never expand silently | Scope tables are the only proven defense against "while I was here" |
| 7 | **MANDATORY FIXES** | F1..Fn, each with three parts: **Symptom** (what the user/owner experiences), **Required** (numbered, concrete, testable steps), **Fail if** (a falsifiable scenario that, if still possible, means the fix is not done) | "Fail if" converts every fix into its own acceptance test |
| 8 | **EXPLICIT NON-GOALS** | "You failed if you do these" — the tempting adjacent work, named specifically, including forbidden claims ("do not claim X complete while Y unverified") | Non-goals stated once beat scope police forever |
| 9 | **IMPLEMENTATION SEQUENCE** | Ordered steps, branch name, test expectations, what manual sanity notes go in the PR | Removes sequencing judgment calls from the maker |
| 10 | **GATES** | Table: gate → bar (tests, types, scope-of-diff, owner-language, the trust scenario). These are the round's dumb gates | The maker knows exactly what will be checked |
| 11 | **PR** | Exact title; required body contents as a numbered list (status table per fix, preflight status, key decisions, exact owner-facing strings, next-wave pointer) | The PR body becomes the evidence pack index |
| 12 | **AFTER THIS PR** | Handoff table of later waves — labeled "do not implement now" | Continuity without scope leak |
| 13 | **DONE means** | One plain-language paragraph of the owner's end state, ending with the word **Stop.** | Done is an outcome, not a diff |

## Fit with the rest of the loop

- The gate contracts (`BRIEF-GATE.md`, `GROK-GATE.md`) still return JSON
  findings into `qaqc/findings.json` first. The carrier (Josh in Phase 0,
  the script in Phase 2) then packages the approved wave as a STRICT
  prompt. Ledger = record; STRICT prompt = orders.
- For the maker, a STRICT prompt IS the round's spec: its HARD SCOPE table
  overrides everything except the loop's own invariants, and its "Fail if"
  clauses are auditable findings if violated — the auditor checks them
  like rubric rules.
- A STRICT prompt never overrides: maker/auditor separation, the evidence
  pack requirement, the hard accept rule, or the dedupe law. If one tries
  to, that conflict escalates to Josh.
