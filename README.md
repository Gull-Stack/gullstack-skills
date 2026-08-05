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

### `google-ads/SKILL.md`
Google-side paid acquisition for local businesses (Meta creates demand, Google captures it). Covers:
- Local Services Ads: Google Verified badge, pay-per-lead, ranking levers, the 2026 migration into the Google Ads platform
- Local Search campaigns: structure, high-intent keywords, negatives, "Presence" targeting
- Performance Max guardrails and AI Max testing discipline
- Conversion tracking before spend (gate #1), budget split vs Meta
- Worked examples: LSA-eligible service client + Plato's Closet Draper (retail, no LSA)

### `analytics-reporting/SKILL.md`
Measurement and the monthly client report — the retention product. Covers:
- The standard stack: client-owned GA4, Consent Mode v2, call tracking, platform links
- Key-event taxonomy (small tier-1, dedupe rule), April 2026 attribution restructure gotchas
- Register-side ground truth + offline conversion feedback loops
- UTM conventions, weekly pulse, MER / cost-per-lead ROI math
- The one-page monthly report format (money first, no vanity metrics)

### `email-sms-lifecycle/SKILL.md`
Owned-audience marketing (gate #5: capture emails or you rent your audience). Covers:
- List capture with real consent (POS-first), timestamped opt-in proof
- SMS compliance: TCPA, quiet hours, April 2026 global-revocation rule, 10DLC (file at onboarding — takes weeks)
- Email deliverability floor: SPF/DKIM/DMARC, one-click unsub, 0.1% complaint target
- The core flows in build order: welcome, post-visit, win-back, loyalty echoes
- List hygiene/sunset, Three Kings copy, register-truth measurement

### `review-reputation/SKILL.md`
Review generation, response, and recovery. Covers:
- The rules with live enforcement: FTC Consumer Review Rule ($53,088/violation), Google no-gating/no-quotas (April 2026)
- The generation loop: moment-of-delight timing, direct-link ask, staff script (no quotas)
- Respond-to-100% doctrine + the Voss negative-review playbook
- Recovery vs removal (flag only policy violations), velocity measurement

### `content-calendar/SKILL.md`
Organic content & social calendar (organic proves, paid amplifies). Covers:
- 3–4 content pillars per client (proof / drop / people / answers)
- The minimum-viable cadence floor and monthly batch production
- Hook formulas, the one-shoot-five-surfaces repurposing chain
- GBP weekly posting, saves/shares measurement, winners→boost pipeline

### `pitch-pricing/SKILL.md`
The offer (Three Kings owns the message; this owns what's for sale). Covers:
- The 4-pillar productized ladder as the thing we sell; retainer-first structure
- Value-anchored flat pricing, three tiers anchored high, descope-never-discount
- Demo-not-document proposals (Walkthru Labs `/proposal/<slug>/` + accept API)
- Close mechanics: deposit-to-start, expiry dates, two follow-ups max
- Live rates come from the rate card, never from the skill

### `billing-bookkeeping/SKILL.md`
Agency money ops — billing, books, and MRR truth. Covers:
- Autopay recurring invoices, deposit-before-work, ad spend never on our books
- Revenue categories by pillar; MRR view must reconcile to QBO reality
- The monthly close checklist (runnable live via the QuickBooks MCP)
- The fixed AR/dunning sequence (day 1/7/15/30) and offboarding rule

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
| `google-ads` | Google Ads + Local Services Ads for local business |
| `analytics-reporting` | Measurement + monthly client reporting |
| `email-sms-lifecycle` | Owned-audience email/SMS flows + compliance |
| `review-reputation` | Review generation/response/recovery |
| `content-calendar` | Organic content system + calendar |
| `pitch-pricing` | The 4-pillar offer, proposals, pricing |
| `billing-bookkeeping` | Client billing, books, MRR ops |
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
