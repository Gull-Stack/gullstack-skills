# GullStack Skills & Playbooks

Standard operating procedures for building premium client websites at GullStack. These skills and playbooks ensure every bot on the team builds to the same Tier-S quality standard.

## Operational Scaffold

This repo doubles as the GullStack Claude Code scaffold: installer, doctor, post-edit typecheck hook, and the per-repo convention templates. Layout:

| Path | What it is |
|---|---|
| `install.sh` | `--global` → hooks/skills/agents into `~/.claude`; `<repo-path>` → per-repo templates |
| `doctor.sh` | Verifies the install end to end. Ends `Operational.` or fails loudly. Prints a fingerprint that must match across instances |
| `describe-repo.sh` | Read-only repo survey (redacts `.env` values) for writing the templates accurately |
| `claude/hooks/post-edit-typecheck.sh` | PostToolUse hook — runs the project typechecker after every edit, feeds errors straight back to Claude |
| `claude/skills/repo-conventions/SKILL.md` | Per-repo conventions **template** — ships empty with `TODO(fill)` markers; doctor fails until filled |
| `claude/agents/gullstack-reviewer.md` | Agent that reviews diffs against the filled conventions, citing evidence only |
| `templates/CLAUDE.md` | Per-repo project-memory **template** (<500 tokens when filled) |
| `examples/` | Fully worked versions of both templates for a fictional TS/Next.js repo — reference, not config |
| `prompts/` | The instance-1 fill prompt (8 phases, evidence-only) and the instances-2/3 verify prompt (regeneration forbidden) |

### Order of operations

1. Clone on each instance: `git clone git@github.com:Gull-Stack/gullstack-skills.git ~/gullstack` and `export GULLSTACK_HOME="$HOME/gullstack"` in your shell rc.
2. On each instance: `cd ~/gullstack && ./install.sh --global`, then `./install.sh /path/to/repo` per working repo.
3. On **instance 1 only**: run `prompts/instance-1-fill-templates.md` in Claude Code (plan mode) inside the working repo. Review, commit, push the filled templates.
4. On instances 2 and 3: pull the working repo, then run `prompts/instances-2-3.md`. It verifies; it never regenerates.
5. `./doctor.sh` on all three must end `Operational.` with matching fingerprints. A differing fingerprint means a local copy drifted — diff it against this repo, don't hand-patch it.

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

### `ux-ui/SKILL.md`
UX/UI decision layer for GullStack sites. Covers:
- The conversion formula (Desire − (Labor + Confusion)) applied to interface decisions
- Editorial Light layout rules; hierarchy by color + weight, button hierarchy, shadows/borders
- Interface copy rules (headline litmus test, CTA wording, nav limits)
- Hard gates from the shipped-work audit (every CTA resolves, wired forms, no stock heroes)
- A 6-step UX review pass for existing pages
Links to `design-standard-v3.md` / `website-conversion.md` for full specs rather than duplicating them.

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
| `bryce-method.md` | Lessons codified from GullStack's shipped repos — the repeatable method + hard gates from audited misses (pixel/analytics on every site, every CTA resolves, no phantom config claims) |

## How to Use

### For Claude Code / claude.ai sessions

The repo ships project-level skills in `.claude/skills/` — any Claude Code session working in this repo auto-discovers them:

| Skill | Loads |
|---|---|
| `site-builder` | The full build standard + all playbooks (marketing sites) |
| `app-design` | Product UI/UX principles for apps (Cinch, platos-pos, onrecord-pro, dashboards) |
| `seo-master` | SEO & 7-layer AEO framework |
| `meta-ads` | Meta advertising for local business |
| `retail-resale-marketing` | Brick-and-mortar / resale marketing |
| `three-kings-salestalk` | Voss + Belfort + Miller sales doctrine (pointer to `Gull-Stack/ThreeKingsSalesTalkMethod`) |
| `argus-qa` | The Argus PR/QA rubric (pointer to `Gull-Stack/Argus`) |
| `title-escrow` | The Bones title & escrow brain (pointer to `Gull-Stack/titlebot-bones-brain`) |

The `.claude/skills/` entries are thin pointers — the canonical content stays in one place (this repo's root directories, or the linked repos) so copies can't drift. To use them outside this repo, copy the pointer directories into `~/.claude/skills/` and keep this repo cloned alongside.

### For any OpenClaw bot
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
