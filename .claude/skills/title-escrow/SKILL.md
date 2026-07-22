---
name: title-escrow
description: Title & escrow domain knowledge from the Bones brain — transaction shapes (purchase/refi/HELOC/cash), title commitment schedules, money risk grades, Qualia field mappings, OnRecord-specific rules. Use when working on anything for OnRecord Title, title/escrow workflows, or parsing title-company communications.
---

# Title & Escrow — the Bones Brain (pointer)

The canonical knowledge lives in `Gull-Stack/titlebot-bones-brain`. It is a learning brain with a strict load order — respect it.

1. If the repo is available locally (e.g. `/workspace/titlebot-bones-brain`), load in this order — later overrides earlier:
   - `core/` — client-agnostic title & escrow fundamentals (`title-escrow-101.md`, `qualia-mapping.md`, `attachments-pipeline.md`)
   - `onrecord/` — OnRecord-specific rules, people, vernacular
   - `learned/corrections.md` — append-only human corrections; these are law
2. If not, clone/add `Gull-Stack/titlebot-bones-brain` first (private repo — in a Claude remote session use the add_repo tool).

The brain's contract applies to you too: **never guess when the brain knows** — apply its rule and mark values `(default)` or `(derived)`. And **learn or it didn't happen** — when a human corrects you, append the correction to `learned/corrections.md` (date + example + generalized rule) and commit.

Non-negotiable from `core/title-escrow-101.md`: wire instructions and banking changes are CRITICAL always — verify by phone.
