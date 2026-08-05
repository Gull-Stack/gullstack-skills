---
name: analytics-reporting
description: Analytics & client reporting for GullStack — GA4 hygiene (Consent Mode v2, key-event taxonomy, April 2026 attribution restructure), UTM discipline, register-side ground truth, ROI math (MER/cost-per-lead), and the monthly client report that proves the retainer. Use when setting up measurement, reading campaign data, or producing any client-facing performance report.
---

# SKILL: Analytics & client reporting

How GullStack measures and proves marketing ROI. Written 2026-08; platform facts
verified then. **[load-bearing]** = wrong numbers reach clients if this is wrong;
*[approx.]* = benchmark. Doctrine: **the monthly report is the retention product** —
bryce-method gate #1 wires the pixels; this skill is why. A client who sees the
register move keeps paying; a client who sees "impressions" churns.

## 1. The standard measurement stack (per client, one-time)

1. **GA4 property owned by the client's Google account**, GullStack as admin
   (same ownership principle as ad accounts — we run it, they own it).
2. Google Tag on every page (site-builder ships this; DEPLOYMENT-CHECKLIST
   verifies it fires). **Consent Mode v2 sending all 4 signals [load-bearing]** —
   the most common silent data hole; without it, ads data quietly degrades.
3. Link GA4 ↔ Google Ads ↔ Search Console. Meta pixel/CAPI per meta-ads §1/§6.
4. **Call tracking** where calls are the conversion — website number swap at
   minimum. Calls are most local businesses' #1 conversion and the #1 unmeasured one.
5. Vercel Web Analytics stays on for sites we host — it's the consent-proof
   floor for traffic sanity checks (and what we check when GA4 looks broken).

## 2. Key-event taxonomy **[load-bearing]**

Three tiers, and the discipline is keeping tier 1 SMALL:
- **Primary key events (count as conversions):** phone call, form submit, booking/
  appointment, purchase, direction request (brick-and-mortar). These feed Smart
  Bidding and headline the report.
- **Secondary (measured, not "conversions"):** menu/pricing views, 60s+ engaged
  visits, GBP website clicks, email/SMS signups.
- **Analysis events:** scrolls, video plays, outbound clicks. Never in a report headline.
A conversion list full of low-intent actions makes attribution noisy and budget
decisions wrong. If everything converts, nothing does.
**Dedupe rule:** each primary is counted in ONE system of record (usually the ads
platform's own tag — google-ads §7); GA4 holds the cross-channel view.

## 3. Attribution reality (April 2026 restructure) **[load-bearing]**

- GA4 restructured attribution April 2026: **data-driven attribution (DDA) is now
  the default** for new key events; last-click is opt-in.
- **DDA needs volume small clients don't have** — ~400 conversions per key event
  and ~20k total in the lookback window *[approx.]* — below that GA4 silently
  falls back toward last-click behavior. Consequence: don't narrate "the model
  says" for a 30-lead/month client; use last-click + common sense.
- Check the three settings that move credit before trusting any channel table:
  **attribution model, lookback windows, reporting identity.** Never compare
  pre-/post-April-2026 numbers without saying the model changed.
- Attribution is evidence, not truth. Cross-channel truth for local business is
  triangulated: platform-reported + GA4 + register (§4). When they disagree, the
  register wins.

## 4. Register-side ground truth (brick-and-mortar)

Free, day-one, non-negotiable (echoes meta-ads §6, retail-resale doctrine):
- Ad-exclusive promo codes/offers per channel.
- "How did you hear about us?" at POS/intake — logged, not vibes.
- **Week-over-week transaction volume vs ad flighting** — the honest lift test:
  did the register move when spend was on vs off?
- Offline feedback loop: upload store outcomes (Meta CAPI `physical_store`,
  Google offline conversion import) so the algorithms optimize to revenue.

## 5. UTM discipline **[load-bearing]**

Every link we control gets tagged, lowercase, no spaces:
`utm_source` = platform (`meta`, `google`, `gbp`, `email`, `sms`, `qr`) ·
`utm_medium` = paid/organic/email/sms ·
`utm_campaign` = `<client>-<theme>-<yyyymm>` (e.g. `platos-buyside-202608`).
QR codes in-store get tagged like any other channel. Untagged = "direct" = lost.
One convention across every client — reports become copy-paste comparable.

## 6. The monthly client report (the product)

One page. Money first, present tense, no vanity metrics, only what we can defend:
1. **Headline: outcomes.** Leads/calls/bookings (or register revenue where wired),
   cost per lead, **MER = total revenue ÷ total ad spend** where revenue is known.
   vs last month + same month last year (seasonality honesty).
2. **Channel table:** spend, leads, cost/lead per channel (Meta / Google / LSA /
   organic+GBP). Source: system-of-record numbers per §2, labeled.
3. **What moved and why** — 2–3 sentences, plain language.
4. **What we're doing next month** — specific, so next report has a promise to check.
Never: impressions-led reporting, screenshots of platform dashboards, unexplained
metric renames, or numbers we can't reproduce. **No incomplete-as-complete:** if
call tracking wasn't live for half the month, the report says so first.
Delivery: client's Flight Deck (the ops dashboard is where reports live), plus
email per client preference. Copy passes `three-kings-salestalk` if it sells.

## 7. Reading the data (the weekly pulse)

15 minutes per client, weekly: spend pacing vs budget · cost/lead vs last 4 weeks ·
search-terms + LSA lead log (google-ads §8) · any tracking flatline (a key event
at zero for 3+ days = broken tag until proven otherwise — check before the month
ends, not in the report). Rig: Claude sessions have the google-analytics MCP
(`runReport`, `getEvents`, `getPageViews`) and Vercel `get_web_analytics` — pull
numbers live instead of screenshotting dashboards.

## 8. ROI math the client actually feels

- **Cost per lead** → **cost per customer** (÷ close/show rate) → compare to
  **average ticket × visits-per-year**. A $40 lead is cheap for a $600/yr customer
  and ruinous for a $25 one-off — always state the comparison, not the raw number.
- MER (blended) is the honest topline for small accounts; per-channel ROAS only
  where the conversion wiring (§2/§4) actually supports it.
- Awareness spend compounds 60–90 days (meta-ads §7) — report it as an investment
  line with proxies (recall, GBP actions), never as an instant-ROI line.

## 9. Mistakes (enforce as review checklist)

Consent Mode v2 missing/partial · conversion inflation (tier-1 bloat) · counting
the same lead in GA4 and the ads platform · trusting DDA at low volume · comparing
across the April 2026 model change silently · untagged links · report leads with
impressions · dashboard screenshots as deliverables · discovering broken tracking
at report time · shipping a report the register contradicts.

## Worked example: Plato's Closet Draper

Primaries: direction requests, "sell your clothes" page form, GBP calls. Register
truth: buy-side promo code + POS "how did you hear" + weekly transaction count vs
Meta flighting. Report headline: buy-side visits (bags bought) and cost per
buy-side visit — because inventory acquisition is the business's real constraint
(retail-resale-marketing §funnel), not sell-side clicks. UTM: `platos-buyside-*`
vs `platos-sellside-*` keeps the two funnels honest in one channel table.
