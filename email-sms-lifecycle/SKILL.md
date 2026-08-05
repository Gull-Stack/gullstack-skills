---
name: email-sms-lifecycle
description: Email & SMS lifecycle marketing for local businesses — list capture with real consent, TCPA/10DLC compliance (April 2026 revocation rule), Gmail/Microsoft deliverability requirements, and the core flows (welcome, win-back, loyalty, post-visit). Use when building list capture, any email/SMS campaign or automation, or auditing lifecycle marketing.
---

# SKILL: Email & SMS lifecycle marketing

How GullStack builds owned-audience marketing. Written 2026-08; compliance facts
verified then. **[load-bearing]** = legal exposure or blocked delivery if wrong;
*[approx.]* = benchmark. Doctrine: **bryce-method gate #5 — capture emails or you
rent your audience.** Ads rent attention; the list owns it. Lifecycle flows beat
blasts: the money is in automated moments (welcome, lapsed, post-visit), not in
"newsletter when we remember."

## 1. Capture (the asset comes first)

- **POS capture is non-negotiable for brick-and-mortar** — email/phone at
  checkout, framed as value ("get your offers / your payout receipt"), not as
  paperwork. Cinch/platos-pos captures at register; websites capture via a single
  clear offer (site-builder forms), QR in-store, and the review-ask flow.
- **Consent at capture [load-bearing]:** SMS marketing needs **prior express
  written consent** — its own unchecked checkbox, disclosure of message frequency,
  "msg & data rates," and STOP/HELP language. Email marketing consent is looser
  but never buy or scrape a list, ever. Keep timestamped proof of every opt-in.
- List growth rate is a monthly report line (analytics-reporting §6): a local list
  growing 50–150/mo *[approx.]* is a compounding asset.

## 2. SMS compliance **[load-bearing]**

- **TCPA:** written consent before any marketing text; quiet hours 8am–9pm
  recipient local time (mind server-TZ vs store-TZ — a UTC cron fires at the
  wrong local hour); honor STOP/QUIT/CANCEL instantly; opt-out confirmation
  within 5 minutes and containing zero marketing.
- **April 2026 revocation rule:** a revocation applies **globally across all
  automated message types** from the business — one STOP kills every flow, not
  just the one they replied to. Build suppression as one shared list per client.
- **10DLC registration** (The Campaign Registry) before any A2P volume —
  unregistered traffic is carrier-blocked no matter how clean consent is. From
  June 30, 2026 new campaigns require privacy-policy + terms URLs. Registration
  takes days-to-weeks — **start it at client onboarding**, not at launch (learned
  the hard way: Veyo launch blocked on 10DLC).
- **SHAFT** content (sex/hate/alcohol/firearms/tobacco) gets filtered — matters
  for venue/bar clients. Under-18 audiences: market to the parents' list, not
  minors (same instinct as meta-ads teen rules).
- House rails: Quo for tenant phone/SMS numbers, per-tenant sender identity.

## 3. Email deliverability **[load-bearing]**

Gmail/Yahoo bulk-sender rules (5k+/day, enforcement ramped Nov 2025; Microsoft
matching since 2025) are the floor for everyone, at any volume:
- **SPF + DKIM + DMARC (≥ p=none, aligned)** on the sending domain; send from a
  subdomain (`mail.client.com`) so marketing can't burn the root domain.
- **One-click unsubscribe** (List-Unsubscribe header) on every marketing send.
- **Spam complaints:** 0.3% is the stated ceiling; **0.1% is the real target.**
- Warm new domains gradually; house ESP is SendGrid (verify the client's API key
  and domain auth at setup — a missing SENDGRID_API_KEY has blocked launches).

## 4. The core flows (build in this order)

1. **Welcome series** (email; SMS single welcome) — 2–3 touches: the brand
   promise, the best offer, what to expect. Highest open rates the client will
   ever see; don't waste them on "thanks for subscribing."
2. **Post-visit** — receipt/thanks + the review ask (`review-reputation/SKILL.md`
   owns the rules) + next-visit reason.
3. **Win-back** — lapsed at 30/60/90 days (define "lapsed" from the client's real
   visit cadence, not a default): escalating reason-to-return; final touch is the
   strongest offer. This is the highest-ROI flow for repeat-visit businesses —
   Cinch ships win-back/loyalty engines; wire them rather than rebuilding.
4. **Loyalty/points echoes** — balance reminders, reward-unlocked (Cinch loyalty).
5. **Campaign layer on top:** promos/events from the seasonality calendar
   (retail-resale §events), 2–4 emails + 1–2 SMS per month *[approx.]*. SMS is the
   scarce channel — save it for time-bound, high-value messages only.

## 5. List hygiene + segmentation

- Sunset policy: no opens/clicks in 6–12 months → re-permission once → suppress.
  Sending to dead addresses is what breaks the 0.1% line.
- Minimum segments: new vs repeat, buy-side vs sell-side (resale), locality.
  Don't over-segment a 2,000-person list into slivers.

## 6. Copy + measurement

- Every send passes `three-kings-salestalk` — present tense, one CTA, directive
  close. Subject lines are hooks (content-calendar hook rules apply).
- Every link tagged per analytics-reporting §5 (`utm_source=email|sms`).
- Report lines: revenue-per-send where trackable, redemption of flow-exclusive
  codes (the register-truth pattern), list growth, unsub + complaint rates.

## 7. Mistakes (enforce as review checklist)

Bought/scraped lists · SMS without written consent or 10DLC · one shared STOP not
suppressing all flows (April 2026 rule) · quiet-hour sends from UTC crons ·
marketing copy in the opt-out confirmation · sending from the root domain with no
DMARC · no one-click unsub · blasts with no flows underneath · SMS used like
email (frequency kills the channel) · "lapsed" defined by guess instead of visit
data · flows launched without a test send to a seed list first (test-before-
customer-automation doctrine).

## 8. Standard build (first 60 days)

Weeks 1–2: capture live (POS + site), consent language verified, 10DLC filed,
domain auth (SPF/DKIM/DMARC) + SendGrid verified, suppression list wired.
Weeks 3–6: welcome + post-visit flows live, tested on seed list end-to-end.
Weeks 7–8: win-back flow + first campaign send; baseline the report lines.

## Worked example: Plato's Closet Draper

Two lists, one audience split: **sell-side** ("we pay cash — what we're buying
this month" monthly SMS-worthy alert, parents' numbers for the under-18 sellers)
and **buy-side** (weekly "Fresh Finds drop" email synced to the rack +
merchandising Reels). Win-back at 45/90 days keyed to average visit gap from POS
data. Flow-exclusive codes redeem at the register → the honest ROI line.
