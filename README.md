# GullStack Skills & Playbooks

Standard operating procedures for building premium client websites at GullStack. These skills and playbooks ensure every bot on the team builds to the same Tier-S quality standard.

## Skills

### `marketing-integrations/SKILL.md`
The master spec for wiring **every** marketing channel through an API into GullStack's two planes — **Cinch** (action: send, capture, publish, launch) and **Flight Deck** (reporting: spend, funnel, ROI). Covers:
- The two-plane model + the definition of "fully functional via API"
- Channel-by-channel matrix (Meta, Google Ads/GA4/GSC/GBP, Reddit, Email, SMS, Salesforce, offline) with auth, action surface, reporting surface, and access status
- The shared attribution spine (UTM discipline, one lead identity, offline conversion loop)
- Multi-tenant credential/secret model and a build order (near-term unblocks first)

### `site-builder/SKILL.md`
Complete guide for building GullStack client websites. Covers:
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

### `reddit-api/SKILL.md`
How to get a programmatic "API into Reddit" for client work. Covers:
- The two Reddit APIs (Data API vs Ads API) and which you actually need
- 2026 access reality: self-serve signup closed, commercial use = contract
- App types + OAuth (`oauth.reddit.com`, script vs web app, 1-hour tokens)
- Rate limits (100 QPM free tier), pricing ballpark, and PRAW tooling
- Use-case map (monitoring, content research, engagement, ads) + a first prototype

## Playbooks

| File | What It Is |
|------|-----------|
| `design-standard-v3.md` | Editorial Light template spec — layout, typography, color, sections |
| `storybrand.md` | Donald Miller's SB7 framework for messaging |
| `website-conversion.md` | Conversion optimization principles |
| `seo-homework.md` | 2026 SEO best practices & ranking factors deep-dive |
| `DEPLOYMENT-CHECKLIST.md` | Mandatory pre/post deploy verification |
| `bryce-method.md` | Lessons codified from GullStack's shipped repos — the repeatable method + hard gates from audited misses (pixel/analytics on every site, every CTA resolves, no phantom config claims) |

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

*Built by GullStack. No fluff, no shortcuts.*
