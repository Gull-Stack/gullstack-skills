# Product Loop — Brief Gate (Grok, before any build)

Grok's first appearance, before the maker writes a line of code. The
expensive mistake is wrong product framing, not bad pixels: if Grok only
audits at the dry point, it catches defects after Claude has already built
around weak assumptions. This gate attacks the assumptions while they are
still cheap to change.

No brief gate, no build. The maker's round 1 requires a brief that carries
this gate's verdict.

## The brief (what goes in)

The human's product brief, in whatever form it exists, plus one page the
kickoff session prepares from it:

1. Who the user is and what they are trying to do (one sentence each)
2. The primary flow, as numbered steps (this becomes the accept-rule flow)
3. What already exists that this competes with or replaces
4. The success metric the product owner will actually check
5. Explicit non-goals — what this deliberately does not do
6. Target score from `PRODUCT_RUBRIC.md` if different from the default

## Handoff prompt (paste to Grok with the brief)

```
You are the framing gate for a product about to be built by an AI. Nothing
has been built yet; your findings are cheap to act on now and expensive
later. Attack the brief, not the wording:

1. ASSUMPTIONS - what must be true about the user or the world for this
   product to work? Which of those is least supported?
2. FRAMING - is this the right product for the stated problem? What would
   a skeptical operator build instead, and why?
3. PRIMARY FLOW - walk the numbered flow as the stated user. Where do they
   stall, get confused, or leave? What state is missing (empty, error,
   first-run)?
4. SCOPE - what is in the brief that should be cut? What is missing that
   the primary flow secretly depends on?
5. MEASUREMENT - will the stated success metric actually detect failure?

Return ONLY a JSON array, no prose:
[{"severity": "BLOCKER|MAJOR|MINOR",
  "kind": "assumption|framing|flow|scope|measurement",
  "what": "<one sentence, concrete>",
  "fix": "<the change to the brief that resolves it>"}]
Return [] if the brief is sound. Do not manufacture findings to seem
thorough - an empty array is a meaningful pass.
```

## Verdict handling

1. Findings land in the product's `qaqc/findings.json` with
   `"source": "grok-brief"`, before round 1 exists.
2. BLOCKER or MAJOR: the brief is revised to address each finding, or the
   human explicitly overrides with one line of reasoning. Both the revision
   and any override are recorded in the findings entry — an overridden
   brief-gate finding that later resurfaces at the final gate is the
   strongest possible signal, and it must be traceable.
3. MINOR only, or `[]`: gate passes. The brief (with verdict attached) is
   committed as `qaqc/brief.md` on the product branch, and the maker starts.
4. Human overrides at this gate are rulings — they go in `DECISION_LOG.md`
   like any other.

In Phase 0 a human carries this handoff (one paste out, one back — same as
the final gate). In Phase 2 it becomes an API call with the same contract.
