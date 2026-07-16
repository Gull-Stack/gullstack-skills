# GullStack Skills Inventory & Gap Audit

*Compiled 2026-07-16 from a sweep of the Gull-Stack GitHub org: this repo,
ThreeKingsSalesTalkMethod, titlebot-bones-brain, and Argus. The upstream brain
(StrongestAvengerStack/gullstack-brain) is referenced throughout but lives in a
different org — its four protocol files are catalogued here from references only.*

---

## Part 1 — Every skill currently taught, by repo

### `gullstack-skills` (this repo — the team skill library)

Installed on Melvin, Bogey, and Jackie per the README.

| Skill / playbook | What it teaches |
|---|---|
| `site-builder/SKILL.md` | Build client sites: 11ty + Nunjucks + vanilla CSS, Editorial Light v3, SB7 messaging, AEO schema, Vercel deploy + verification |
| `seo-master/SKILL.md` | 2026 ranking factors, on-page checklist, the 7-layer AEO system (intent map → answer hubs → brand-facts.json → schema → citations → AI shopping), local SEO, audits, keyword research |
| `meta-ads/SKILL.md` | Meta/IG ads for local business: portfolio/pixel setup, 2025-26 objective changes, radius + under-18 targeting rules, budget floors, Reels-first/UGC creative, offline conversions |
| `retail-resale-marketing/SKILL.md` | Brick-and-mortar + resale: register metrics not CRM metrics, the two-sided buy/sell funnel, GBP-first, merchandising-as-content loop, events/promos, seasonality |
| `design-standard-v3.md` | Editorial Light template spec — light-dominant layout, full-bleed heroes, big typography, section order |
| `storybrand.md` | Donald Miller SB7 — customer is the hero, grunt test, one-liner formula |
| `website-conversion.md` | Conversion Rate = Desire − (Labor + Confusion); landing-page structure rules (Shapiro/Demand Curve/Refactoring UI) |
| `seo-homework.md` | 2026 SEO deep-dive (overlaps seo-master — flagged below) |
| `DEPLOYMENT-CHECKLIST.md` | Mandatory pre/post-deploy verification + automated crawl audit |
| `bryce-method.md` | The codified lessons from the July 2026 org-wide repo audit — repeatable method + 8 hard gates (no pixel no launch, every CTA resolves, no phantom config claims, etc.) |

### `ThreeKingsSalesTalkMethod` (installable Claude Code skill: `/three-kings-salestalk`)

The unified sales-communication doctrine — operating DNA for Winchester, Bruno,
PeterQuill, and the marketing sub-bots.

| File | What it teaches |
|---|---|
| `SKILL.md` | The protocol: every buyer-facing message passes Voss + Belfort + Miller simultaneously, plus WizGat; hard rules (never "I", no questions in cold outreach, directive close) |
| `FRAMEWORKS/voss.md` | Tactical empathy — mirror, label, accusation audit, no-oriented questions |
| `FRAMEWORKS/belfort.md` | Straight Line — Three Tens, tonality, looping objections |
| `FRAMEWORKS/storybrand.md` | SB7 (duplicate of this repo's copy — flagged below) |
| `FRAMEWORKS/wizgat.md` | "What's So Great About That" — every fact must map to a felt outcome or be cut |
| `OBJECTION-MATRIX.md` | Per-framework responses to common objections |
| `EMAIL-RULES.md` | Hard email rules |
| `APPLICATIONS/federal-employees.md` | Capital Wealth federal-retirement messaging |
| `APPLICATIONS/gullstack-sales.md` | GullStack/SuperTool sales messaging |

### `titlebot-bones-brain` (Bones — the title & escrow bot)

A learning brain, not a SKILL.md package: load order core → onrecord → learned,
never guess when the brain knows, every human correction becomes a committed rule.

| File | What it teaches |
|---|---|
| `OPERATING.md` | The bot loop: load brain → fetch intake → parse → post → learn (heartbeat visible in Flight Deck) |
| `core/title-escrow-101.md` | Transaction shapes (purchase/refi/HELOC/cash), title commitment schedules A/B-I/B-II, money risk grades (wire changes = CRITICAL, verify by phone) |
| `core/qualia-mapping.md` | Exact Qualia field keys for parses |
| `core/attachments-pipeline.md` | Attachment ingestion |
| `onrecord/order-rules.md`, `people.md`, `qualia-new-order-playbook.md` | OnRecord-specific rules, staff defaults, vernacular (overrides core) |
| `learned/corrections.md` | Append-only correction log (empty — awaiting first real traffic) |

### `Argus` (the QA enforcer)

Argus is a skill in itself: the PR-review rubric every build must pass.

- **PLAYBOOK rubric families:** A secrets/hygiene · B facts & content-as-data ·
  C lead-pipeline fail-soft & spam protection · D schema/AEO/redirects ·
  E platform/process · F multi-tenant discipline · G never-guess/evidence
  (no "done" without a verification block) · H product-UX gates for ops apps
- **`loop/`** — automated audit-and-fix scripts with a findings schema
- **`memory/`** — QA session logs (e.g. 2026-07-15 never-guess UX gate, Cinch QAQC handoffs)

### `gullstack-brain` (upstream — StrongestAvengerStack org, referenced but separate)

Referenced by this repo's README and by Argus as the source of truth:
`protocol/never-guess.md`, `protocol/ux-ui-uplevel.md` (CFA product-UX doctrine),
`protocol/grok-deploy-qaqc.md`, `protocol/agent-prompts.md`, plus
`protocol/build-standards.md` and `IMPLEMENT.md` cited by Argus.

---

## Part 2 — What the bots have *learned* (codified, not just taught)

1. **The Bryce Method** (`bryce-method.md`) — distilled from auditing the org's
   shipped repos: the repeatable build/SEO/convert/sell method plus the eight
   anti-lesson gates.
2. **Three Kings + WizGat** — the synthesized Voss/Belfort/Miller doctrine.
3. **Argus memory** — per-session QA learnings that harden into rubric rules
   (never-guess became rubric family G on 2026-07-15).
4. **Bones learned-corrections contract** — the mechanism exists; log is empty
   pending live traffic.
5. **Deployment checklist scar tissue** — born from the D One Builders emergency;
   crawl audit added 2026-03-01.

---

## Part 3 — Gaps: skills that don't exist yet

Ordered by how directly the existing docs point at the hole.

1. **Google Ads / Local Services Ads skill.** `meta-ads/` covers one paid channel;
   there is no Google-side equivalent. GBP gets one section inside
   retail-resale-marketing but paid search, LSA, and Performance Max are untaught.
2. **Email & SMS lifecycle marketing skill.** Bryce-method gate #5 ("capture emails
   or you rent your audience") and SuperTool's shipped SMS/loyalty/win-back engines
   both demand it — no skill teaches list-building, campaign cadence, or win-back flows.
3. **Analytics & reporting skill.** Gate #1 wires GA4 + pixel + conversion events,
   but nothing teaches reading the data: offline-conversion feedback, monthly client
   reports, which numbers prove ROI at the register.
4. **Organic content / social calendar skill.** Reels/UGC guidance is embedded
   inside meta-ads and retail-resale; a standalone content skill (calendar, hooks,
   repurposing) would serve non-retail clients too.
5. **Review & reputation skill.** Review velocity is one bullet in the retail skill;
   E-E-A-T in seo-master depends on it. No playbook for generation, response, and recovery.
6. **Client onboarding / discovery skill.** brand-facts.json, site.json, BRAND.md
   voice — every skill consumes this data but nothing teaches collecting it (intake
   questionnaire → facts file).
7. **Pitch / proposal / pricing skill.** `gullstack-pitches` and the template-farm
   preview motion exist as practice, not doctrine. Three Kings covers the message,
   not the offer structure.
8. **Title/escrow & lending as a packaged skill.** Bones' brain is rich but is not
   a SKILL.md any other bot can load; if lending/loan-officer clients are a target
   vertical, a marketing skill for that vertical doesn't exist either.
9. **Bookkeeping/ops skills for the money side.** Nothing covers invoicing,
   QuickBooks hygiene, or client billing workflow, despite the agency now running
   recurring clients.

## Part 4 — Housekeeping defects in the existing library

These violate bryce-method's own anti-lessons and are cheap to fix:

- ~~**`site-builder/SKILL.md` still hard-gates on `CLIENT-MONITORING.md`, which does
  not exist** (anti-lesson #6).~~ **Fixed 2026-07-16** — the gate is now soft.
- **StoryBrand still exists in two diverging copies** (here and in
  ThreeKingsSalesTalkMethod/FRAMEWORKS) and **SEO in two** (seo-master +
  seo-homework) — anti-lesson #7 says link, don't copy.
- **The brain is split across two GitHub orgs** (Gull-Stack vs
  StrongestAvengerStack/gullstack-brain). Tooling scoped to one org cannot follow
  the references; consider mirroring or moving the brain into Gull-Stack.

## Part 5 — Packaging status (2026-07-16)

All of Bryce's bot skills are now loadable by Claude Code sessions:

- The four canonical skills got YAML frontmatter (name + description + triggers).
- `.claude/skills/` now carries seven auto-discovered project skills: the four
  local ones plus pointer skills for `three-kings-salestalk`, `argus-qa`, and
  `title-escrow`. Pointers link to the canonical repos rather than copying them
  (anti-lesson #7).
- Still open: the upstream `gullstack-brain` protocols remain unreachable from
  the Gull-Stack org — mirroring or moving that repo is the remaining gap.
