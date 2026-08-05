---
name: google-ads
description: Google-side paid acquisition for local businesses — Local Services Ads (Google Verified, pay-per-lead), local Search campaigns, Performance Max guardrails, AI Max, conversion tracking before spend. Use when planning, building, or auditing Google Ads or LSA for any client.
---

# SKILL: Google Ads + Local Services Ads for local businesses

How GullStack runs the Google side of paid acquisition. Written 2026-08; platform
facts verified then. **[load-bearing]** = will break campaigns or waste money if
wrong; *[approx.]* = benchmark, varies by market. Companion to `meta-ads/SKILL.md`:
**Meta creates demand, Google captures it.** Someone typing "plumber near me" or
"sell used clothes draper" is already in motion — Google's job is to be the answer.

## 1. When to run Google vs Meta

- **Service businesses with urgent/searched need** (plumbing, HVAC, cleaning, pool
  service, legal, title): Google-first. LSA if the vertical qualifies, Search always.
- **Retail/resale/experience** (Plato's, venues): Meta-first for demand creation;
  Google gets a small high-intent Search layer ("plato's closet draper", "sell
  clothes for cash near me") + Google Business Profile organic (see
  `retail-resale-marketing/SKILL.md` — GBP is free and does most of the local work).
- Never split a starved budget across both platforms. One funded channel beats two
  starving ones — same doctrine as meta-ads §4.

## 2. Account structure (one-time, per client)

1. Google Ads account **owned by the client's Google account**, linked under the
   GullStack manager account (MCC) — never built inside a GullStack-owned account
   (client owns their pixel/portfolio on Meta; same principle here).
2. Link **GA4** and **Google Business Profile** to the Ads account. GBP must be
   claimed, verified, and current first — LSA and PMax both pull from it.
3. **Conversion tracking before a dollar of spend [load-bearing]** — bryce-method
   gate #1 applies to Google too: no conversion actions, no launch. Minimum set:
   calls from ads, calls from website number, form/lead submits.
4. Billing on the client's card. We run it; they own it.

## 3. Local Services Ads **[load-bearing — platform in transition]**

The pay-per-LEAD product (calls/messages/bookings, not clicks) that sits above
regular search results. Verticals: home services, some professional/personal
services — check eligibility per market at signup.

- **2026 migration:** Google is retiring the standalone LSA dashboard and folding
  LSA into the main Google Ads platform — phase 1 began **Aug 2026** (US home +
  storefront services: plumbing, HVAC, electrical, cleaning, lawn, roofing, pest,
  moving), broader accounts late 2026. Campaigns stay **keywordless** and pull
  from the Google Business Profile; pricing stays pay-per-valid-lead. Expect UI
  and control changes mid-flight — verify current state in the account at build time.
- **Badges:** Google Guaranteed / Google Screened were retired Oct 20, 2025 →
  one unified **Google Verified** blue checkmark. Verification = background/license/
  insurance checks; start it early, it takes days-to-weeks.
- **Ranking levers** (in rough order): review count + rating on GBP, responsiveness
  (answer every lead fast — unanswered leads tank rank), business hours coverage,
  proximity, budget. Reviews are the compounding lever → wire the review-generation
  loop before scaling LSA spend.
- **Dispute invalid leads** (wrong service, out of area, spam) inside the platform —
  it's real money back. Review the lead log weekly.
- Lead costs *[approx.]*: $25–100+ per lead depending on vertical/market. Set the
  budget by leads-per-week the client can actually answer, not by dollars.

## 4. Search campaigns (the workhorse)

- **Structure:** one campaign per service theme, 2–5 tight ad groups. Small local
  accounts do not need SKAGs or 50 ad groups.
- **Keywords:** high-intent only — service + city, "near me", emergency/urgent
  modifiers, buy-side terms. Phrase + exact match to start. **Broad match only
  with Smart Bidding + a real negative list**, never on a fresh account.
- **Negatives from day one [load-bearing]:** free, jobs/careers, DIY/how-to,
  competitor cities outside radius, wrong services. Mine the search-terms report
  weekly for the first month.
- **Location targeting: set to "Presence" (people IN your area) [load-bearing]** —
  the default "presence or interest" leaks spend to people merely searching about
  the area.
- **RSAs:** fill all headline/description slots, pin sparingly (city/phone in 1–2
  pins max). Assets: call, location (links GBP), sitelinks, structured snippets.
  Ad schedule ≈ answerable hours if calls are the conversion.
- **AI Max** (a toggle inside a standard Search campaign, expanding to Shopping in
  2026): treat as a test cell with capped budget once the account has conversion
  history — it loosens query matching in exchange for reach. Watch search terms.

## 5. Performance Max guardrails

PMax only **after** conversion signal exists (steady conversions/week from Search)
and only with real assets — never as the first campaign on an empty account.
- 2026 gives channel-level reporting + asset-level segmentation — actually read
  where spend goes; kill it if it's all low-quality display/YouTube.
- Add **brand exclusions** and campaign-level **negative keywords** (available
  since 2025) at launch, not after the first bad month.
- Google now auto-generates asset variations; AI-generated assets are flagged in
  reporting and can be **disabled** — disable if off-brand (design/typography
  doctrine applies to ads too).

## 6. Budget

- Client total marketing budget frame first (5–10% of gross for local retail; see
  meta-ads §4). Google's share rises with search intent: service businesses
  60–70% Google, retail 20–40% *[approx.]*.
- Search floors: enough for ≥10 clicks/day at the market CPC or the data is noise.
  Local service CPCs *[approx.]* $5–30 (legal/HVAC high end); retail local terms
  $0.50–3. LSA budget = answerable-leads-per-week × cost-per-lead.
- Judge Search weekly, not daily; Smart Bidding needs 2–4 weeks and resets on big
  edits (same "learning phase" discipline as Meta).

## 7. Measurement **[load-bearing]**

1. **Primary conversion actions in Google Ads' own tag** (calls from ads, website
   calls ≥60s *[approx. — set to real qualify length]*, lead forms). GA4 key events
   can be imported as **secondary/observation** — never double-count a primary in
   both or ROAS math doubles.
2. Enhanced conversions on (hashed email/phone from forms) — recovers matching
   lost to consent/ITP.
3. Offline truth: leads → register/CRM outcomes. Import offline conversions (or at
   minimum tag won-leads manually monthly) so Smart Bidding optimizes to revenue,
   not form-fills.
4. Full reporting doctrine, attribution gotchas (incl. the April 2026 GA4
   restructure), and the monthly client report live in
   `analytics-reporting/SKILL.md` — read it before promising any number to a client.

## 8. Beginner mistakes (enforce as review checklist)

Launching without conversion tracking · "presence or interest" default left on ·
broad match on a new account · no negatives · PMax as the first/only campaign ·
LSA leads unanswered for hours (kills rank AND wastes paid leads) · daily
panic-edits during learning · counting GA4 + Ads conversions twice · set-and-forget
(search terms + lead log are weekly chores) · badge/verification started late.

## 9. Standard launch (first 90 days)

Weeks 1–2: account + MCC link, GBP cleanup, conversion actions + call tracking
verified firing, LSA verification started (if vertical qualifies), negative list v1.
Weeks 3–8: LSA live (answer everything <15 min) + one Search campaign on the
highest-intent theme; weekly search-terms + lead-dispute pass.
Weeks 9–12: read cost/lead vs register truth, prune losers, scale winners; consider
PMax only if conversion volume supports it; wire offline conversion import.

## Worked examples

**Service client (LSA-eligible):** LSA first (pay-per-lead beats pay-per-click at
equal quality), one exact/phrase Search campaign for the top service + city as the
safety net, review-generation loop feeding both LSA rank and Local Pack.
**Plato's Closet Draper (retail/resale):** no LSA (retail resale isn't a
qualifying vertical). Small Search layer on buy-side money terms ("sell used
clothes for cash draper/utah") + brand terms; the buy-side is the unfair
advantage (retail-resale-marketing §funnel). Meta stays the demand engine.
