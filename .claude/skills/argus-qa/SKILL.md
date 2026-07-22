---
name: argus-qa
description: Run the Argus QA rubric — the standard every GullStack PR must pass — covering secrets/hygiene, invented facts, content-as-data, lead-pipeline fail-soft, schema/AEO, multi-tenant discipline, never-guess evidence gates, and product-UX gates. Use when reviewing a PR, auditing a diff, or self-checking work before calling it done.
---

# Argus QA Rubric (pointer)

The canonical rubric lives in `Gull-Stack/Argus` → `PLAYBOOK.md`. Argus the bot enforces it on PRs; this skill lets any Claude apply the same law to its own work.

1. If the Argus repo is available locally (e.g. `/workspace/argus`), read `PLAYBOOK.md` and apply the rubric top to bottom against the diff. Findings cite rule IDs (`severity — rule ID — file:line — consequence`); any BLOCKER means REQUEST CHANGES. Never downgrade a BLOCKER to keep work moving.
2. If not, clone/add `Gull-Stack/Argus` first (private repo — in a Claude remote session use the add_repo tool).

The rule families, so you know what you're checking before the file loads: **A** secrets & hygiene (no credentials, no build output, no emojis) · **B** facts & content-as-data (zero invented facts; copy lives in content files) · **C** lead pipeline (fail-soft email path, spam protection, UTM passthrough) · **D** schema/AEO/redirects · **E** platform & process · **F** multi-tenant discipline · **G** never-guess/evidence (no "done" claims without a verification block naming what was run and observed) · **H** product-UX gates for ops apps.

When the upstream Brain (`StrongestAvengerStack/gullstack-brain`) and the rubric disagree, the Brain wins.
