# Walk Through Labs Skills & Playbooks

Standard operating procedures for building premium client websites at **Walk Through Labs** (formerly GullStack). These skills and playbooks ensure every bot on the team builds to the same Tier-S quality standard.

> **Organizational transition in progress:** GullStack is being reorganized as Walk Through Labs, a 501(c)(3) nonprofit whose mission is protecting businesses from malicious AI — fraud, impersonation, AI-enabled scams, and manipulated online presence. The legal and operational transfer is tracked in [`501C3-MIGRATION.md`](501C3-MIGRATION.md). Legacy identifiers (the `gullstack.com` domain, `leads@gullstack.com`, GitHub org/repo slugs) remain live until each migration step completes — do not break them; see the migration doc before renaming anything wired into production.

## Upstream Brain (protocol + never-guess)

Product UX, agent standing orders, and deploy QAQC live in the private brain — not only in this skills repo:

**Repo:** [StrongestAvengerStack/gullstack-brain](https://github.com/StrongestAvengerStack/gullstack-brain)

| Protocol file | Purpose |
|---|---|
| `protocol/never-guess.md` | **NEVER GUESS** — read code; cite paths |
| `protocol/ux-ui-uplevel.md` | CFA product UX doctrine |
| `protocol/grok-deploy-qaqc.md` | Always Grok QAQC on prod deploys |
| `protocol/agent-prompts.md` | Copy-paste Claude/Grok/Marketing prompts |

Argus enforces related rules: [Gull-Stack/Argus](https://github.com/Gull-Stack/Argus) PLAYBOOK G + H.

## Skills

### `site-builder/SKILL.md`
Complete guide for building Walk Through Labs client websites. Covers:
- **Editorial Light v3** design standard (the only template we use)
- **StoryBrand (SB7)** messaging framework
- **11ty** static site architecture
- **AEO** schema markup requirements
- Git workflow, Vercel deployment, post-deploy verification

### `seo-master/SKILL.md`
Full SEO & AEO (Answer Engine Optimization) framework. Covers:
- 2026 ranking factors (priority order)
- On-page SEO checklist
- 7-layer AEO system (Intent Map → Answer Hubs → Brand-Facts → Schema → Citations → AI Shopping)
- Blog/content strategy
- SEO audit process (quick + full)
- Local SEO playbook
- Keyword research process

### `meta-ads/SKILL.md`
Meta (Facebook + Instagram) advertising for local businesses. Covers:
- Business Portfolio / Page / pixel setup
- 2025-26 objective changes (Store Traffic retired, Offer ads gone)
- Radius + teen-targeting rules (under-18 = age + location only)
- Budgets, Reels-first/UGC creative, offline measurement via Conversions API
- Worked example: resale (Plato's Closet Draper / Thrift Utah)

### `retail-resale-marketing/SKILL.md`
Brick-and-mortar retail & resale marketing. Covers:
- Retail vs lead-gen recalibration (register metrics, not CRM pipelines)
- The two-sided resale funnel (buy side vs sell side)
- Google Business Profile first; merchandising-as-content loop
- Events/promos, seasonality calendar, register-side measurement, budget frame

## Playbooks

| File | What It Is |
|------|-----------|
| `design-standard-v3.md` | Editorial Light template spec — layout, typography, color, sections |
| `storybrand.md` | Donald Miller's SB7 framework for messaging |
| `website-conversion.md` | Conversion optimization principles |
| `seo-homework.md` | 2026 SEO best practices & ranking factors deep-dive |
| `DEPLOYMENT-CHECKLIST.md` | Mandatory pre/post deploy verification |
| `501C3-MIGRATION.md` | Legal + operational checklist for the GullStack → Walk Through Labs 501(c)(3) transition |
| `bryce-method.md` | Lessons codified from Walk Through Labs' shipped repos — the repeatable method + hard gates from audited misses (pixel/analytics on every site, every CTA resolves, no phantom config claims) |

## How to Use

For any OpenClaw bot:
1. Copy `site-builder/` and `seo-master/` into the bot's `workspace/skills/` directory
2. Copy playbooks into `workspace/playbooks/`
3. Copy `DEPLOYMENT-CHECKLIST.md` into `workspace/`
4. Update the bot's `AGENTS.md` to reference the skills before any build work

The bot will read the relevant skill file before starting work and follow the standards automatically.

## Currently Installed On
- **Melvin** (main builder)
- **Bogey** (backup builder + sales)
- **Jackie** (PPA + builder)

---

*Built by Walk Through Labs (formerly GullStack). No fluff, no shortcuts.*
