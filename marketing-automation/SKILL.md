# SKILL: Marketing Automation & Self-Serve UX (Cinch + Flight Deck)

How a **customer** (the tenant/operator — gym owner, retail owner) self-serves marketing:
automations that run on their own, plus clickable surfaces answering the only two
questions they care about. Written 2026-07. Builds directly on the plumbing in
`marketing-integrations/SKILL.md` and on primitives **already shipped in Cinch** — this
is a generalization, not a greenfield build. **[load-bearing]** = breaks the loop or a
promise if wrong; *[approx.]* = tune in product.

## 0. The two customer questions **[load-bearing]**

Everything here maps to one of two questions, one per product:
- **Cinch → "How do I do marketing?"** (ACT) — connect channels, turn on automations,
  launch guided campaigns, ask the Copilot what to do next.
- **Flight Deck → "How well is my marketing working?"** (SEE) — one health score, per-
  channel report cards, ROI, and recommended next actions.

**The loop is the product: a recommendation in Flight Deck is a button that deep-links
into the matching Cinch action, and every Cinch action reports back up into Flight Deck.**
"Clickable in both" means neither surface is a dead end — see it, click it, it's done,
watch it move.

> Naming note: Cinch already ships an in-app report surface at `/admin/reports` it calls
> "Flight Deck" (module-aware per tenant). The standalone BI product is `cw-flight-deck`.
> This spec treats the customer's reporting view as one logical surface that lives in
> both; build the score + cards once and render in each.

## 1. Build on what Cinch already ships — do NOT reinvent **[load-bearing]**

The automation engine and the clickable card pattern already exist for the CRM. Marketing
= the same patterns pointed at external channels.

| Already shipped (Cinch) | Reuse it as |
|---|---|
| **Nurture Autopilot** — email/SMS cadences, stops on any human touch/stage-advance/30d, owner-editable card, `auto-*` never counts as a rep touch | The **automation-recipe engine** — every recipe below is this pattern with a different trigger/action |
| **Report subscriptions** — daily/weekly Flight Deck email, 12:00 UTC cron, idempotent | The **automated "how's it working" digest** to the customer |
| **Copilot** — dynamic memory + tools (`sales_funnel`, `lead_lookup`, `log_lead_note`, create tasks) | The **"how to do marketing" advisor** — ground it on the skills library (§6) and add channel tools |
| **`/admin/reports`** — module-aware in-app report cockpit | The host surface for the **Marketing Health Score + report cards** (§3) |
| **Lead UTM/referral attribution** + one-click SMS/email on every lead | The **attribution spine** (marketing-integrations §3) + manual-action fallback |
| **Announcement email + SMS w/ consent, A2P 10DLC** | The **send layer** every messaging recipe rides on |

If a "new" marketing feature doesn't reuse one of these, question it before building.

## 2. Cinch surface — "How do I do marketing?" (clickable)

A **Marketing hub** in the tenant admin (e.g. `/admin/marketing`), four sections:

1. **Connections** — a connect card per channel (Meta, Google Ads/GA4/GBP/GSC, Reddit;
   Email/SMS already on). One-click OAuth; status chip: `Connected` / `Needs attention`
   / `Connect`. Mirrors the marketing-integrations matrix; credentials stored **per
   tenant, encrypted** (integrations §6). **Nothing automates until a channel is
   connected — this section is the gate.**
2. **Automation recipes** — toggle cards, the exact Nurture-Autopilot UX: on/off,
   editable, honest logging. Each = trigger → action(s) → reports-to. Library in §4.
   Safe recipes ship **on**; anything that spends money or messages an audience ships
   **off** behind approval (§7).
3. **Guided campaigns** — wizards that turn the skills into clicks: pick a goal → Copilot
   drafts (grounded in `meta-ads` / `seo-master` / `storybrand`) → customer reviews →
   launch. Human approval before any spend.
4. **Copilot "What should I do?"** — the advisor recommends the next best action and can
   flip a recipe on or create a task, right there.

## 3. Flight Deck surface — "How well is my marketing working?" (clickable)

Customer-facing, glanceable, honest:
- **Marketing Health Score (0–100)** — one number + trend, composed of per-channel
  sub-scores (§5). The "am I doing well?" answer in one look.
- **Per-channel report cards** — each channel: its key metric, trend, RYG status (reuse
  Flight Deck's RYG rules), and a plain-English "what this means." No jargon.
- **Recommended actions** — each is a **button**, not a sentence. "Reviews down 20% →
  *Turn on Review Requests*" deep-links to that Cinch recipe. **This is the loop.**
- **Funnel + ROI** — spend → lead → member, cost-per-lead, ROAS (already live for Capital
  Wealth; generalize per tenant). Every derived number shows its formula (calc-tooltip
  rule) or the AE Air-Leak-tests it.
- **Automated delivery** — the existing Report-subscriptions cron emails this weekly:
  "your marketing this week," module-aware.

## 4. Automation recipe library

Each recipe is the Nurture-Autopilot pattern (trigger → action, stop conditions, honest
logging). Channel + governing skill noted.

| Recipe | Trigger → Action | Channel(s) | Skill |
|---|---|---|---|
| **Review Requests** | POS sale / class check-in → SMS+email asking for a Google review | GBP, SMS, Email | retail-resale, seo-master |
| **GBP Auto-Posting** | Weekly cron → publish a GBP post (Copilot draft from templates) | GBP | seo-master, retail-resale |
| **Lead Nurture** *(shipped)* | New/contacted lead → 5-step email/SMS, stop-on-touch | Email, SMS | — |
| **Reactivation / Win-back** | Membership decline / lapsed customer → re-engagement sequence | Email, SMS | retail-resale |
| **Abandoned funnel** | Tour/intro started, not finished → nudge (keeps UTM/first-touch) | Email, SMS | website-conversion |
| **Social listening alert** | Brand/keyword mention on Reddit → operator task | Reddit | reddit-api |
| **Spend guardrail** | CPL/ROAS breaches threshold → pause campaign + alert | Meta/Google Ads | meta-ads |
| **Weekly Marketing Digest** *(shipped)* | Cron → the Flight Deck "how's it working" email | all | this skill |
| **SEO content suggestions** | GSC query data → recommended blog topics in Copilot | Search Console | seo-master |

## 5. The Marketing Health Score (so it's real, not vibes) **[load-bearing]**

Per channel, three factors → a sub-score:
- **Presence** — connected + configured (else the channel greys out; **never fake a
  score for an unconnected channel** — show "Connect to score").
- **Activity** — are the automations running / posts going out / campaigns live?
- **Performance** — the channel's key metric vs its goal-line / benchmark *[approx.]*.

Roll up **weighted by the tenant's active channels** (a retail tenant with no ads isn't
penalized for empty ad metrics). Apply Flight Deck RYG thresholds and **show the math** in
a tooltip. The score's job is to make "how well is it working" answerable in one glance
and honest under scrutiny.

## 6. "How to do marketing" = the skills library is the Copilot's brain **[load-bearing]**

The Copilot's marketing guidance must be grounded in the GullStack skills now in the brain
— `seo-master`, `meta-ads`, `retail-resale-marketing`, `website-conversion`, `storybrand`,
`marketing-integrations`, `reddit-api`. That grounding is *why* the brain matters: it makes
every recommendation GullStack-standard instead of generic-LLM. "How do I do marketing?"
is answered by the same SOPs our team builds to — surfaced as clickable recipes and guided
campaigns, not a wall of text.

## 7. Guardrails (customer-facing automation that spends money / messages people)

- **Human approval before any paid spend or send-to-audience.** Safe recipes (digest,
  review requests to opted-in contacts) default on; ad-spend and broadcast recipes default
  off, approval-gated.
- **Honest logging** — `auto-*` actions never count as human touches (accountability stays
  clean, per the shipped Autopilot rule).
- **Consent + compliance** — STOP/unsubscribe, consent timestamps, A2P 10DLC per tenant
  (all already required in Cinch); disclose before the click; frequency caps.
- **Never a dead-end or a phantom** — if a channel isn't connected, the recipe is greyed
  with a Connect CTA, not silently broken (the bryce-method "no phantom config" gate).

## 8. Build order

1. **Connections hub in Cinch** (OAuth connect cards) — the gate; nothing runs without it.
2. **Generalize Nurture Autopilot → recipe engine**; ship 2–3 safe recipes first (Review
   Requests, Weekly Digest, GBP Auto-Posting).
3. **Marketing Health Score + report cards** in `/admin/reports` and `cw-flight-deck`.
4. **Recommended-action deep links** — wire the Flight-Deck→Cinch loop (the clickable
   payoff).
5. **Copilot grounding** on the skills library + guided-campaign wizards.
6. **Paid-channel recipes** (spend guardrails) last, behind approval.

**Done = a customer connects a channel in one click, turns on a recipe, sees a health
score move in Flight Deck, and clicks a recommendation that sends them back into Cinch to
act — no dead ends, nothing mock, nothing they need GullStack to run for them.**

---

### Related
- Plumbing / auth / per-channel access: `marketing-integrations/SKILL.md`
- Channel playbooks the Copilot is grounded on: `seo-master/`, `meta-ads/`,
  `retail-resale-marketing/`, `reddit-api/`, `storybrand.md`, `website-conversion.md`
- Quality gates (pixel/analytics on every site, every CTA resolves, no phantom config):
  `bryce-method.md`
- Implementation repos (not in this repo): `Gull-Stack/cinch-app` (action + `/admin`
  surfaces), `Gull-Stack/cw-flight-deck` (reporting).
