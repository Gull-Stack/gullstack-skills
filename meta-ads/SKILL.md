# SKILL: Meta Ads (Facebook + Instagram) for local businesses

How Walk Through Labs runs Meta advertising for local/brick-and-mortar clients. Written 2026-07;
platform facts verified then. **[load-bearing]** = will break campaigns if wrong;
*[approx.]* = benchmark, varies by market. Worked example throughout: Plato's Closet
Draper + Thrift Utah/Draper (resale, audience 12–24 + parents).

## 1. Account structure (one-time, per client)

1. Facebook Business Page (address/hours) + Instagram converted to a **professional
   account**, linked.
2. A **Business Portfolio** (renamed Business Manager) owns Page, IG, ad account,
   payment method — owned by the business, never a personal account. Business Suite is
   just the daily dashboard.
3. Create a **dataset (pixel)** even for brick-and-mortar — required later for offline
   conversions and website custom audiences. Install it (see bryce-method.md gate #1).
4. Boosting is for cheap visibility on already-winning organic posts; Ads Manager is
   for everything else (objectives, radius targeting, A/B, clean tracking).

## 2. Objectives **[load-bearing]**

Six objectives exist: Awareness, Traffic, Engagement, Leads, App Promotion, Sales.
- **"Store Traffic" is retired** — folded into Awareness. **"Offer ads" are gone** —
  put promos in the copy/creative.
- Physical store playbook: **Awareness** (reach/ad-recall, tight radius) is the
  workhorse; **Engagement** for spend-behind-winning-Reels and message ads; **Traffic**
  only to a real destination; **Sales / Advantage+ Sales** only once conversion signal
  exists (~50 conversions/week — after offline events are wired).

## 3. Targeting **[load-bearing]**

- **Radius:** pin the location. 3–5 mi urban, 5–10 suburban, 15–25 rural *[approx.]*.
  Inside a small radius, radius + age band is most of the strategy.
- **Under-18s: age + location ONLY** — no interests, no gender, no custom/lookalike
  audiences. If teens matter, run a dedicated 13–17 ad set where the *creative* does
  the targeting.
- **Advantage+ audience** treats everything except location + minimum age as
  suggestions. Manual/original audiences remain legitimate for small-budget hyper-local.
- Detailed-targeting interests were consolidated June 2025 (legacy ad sets died
  Jan 2026) — verify interest names in Ads Manager at build time; stack max 1–2.
- Custom audiences (18+): IG/Page engagers (90–365d), client customer-list exports
  (consented email/phone) for retention + lookalikes.

## 4. Budget

- Client marketing budget first: local retail typically 5–10% of gross revenue total;
  franchises may have contractual minimums (Plato's/Winmark: 2% national ad fund +
  6% total minimum since July 2026). Meta typically gets 40–60% of the *local* share.
- Floors: $10/day per ad set minimum for signal; $20–50/day for usable feedback speed.
  **One funded campaign beats five starved ones.**
- 2025 US reference points *[approx.]*: retail CPC ~$0.70, CTR ~1.6%, CPM ~$21–27
  (awareness buys often $5–18 locally). Q4 costs +20–30%. Awareness frequency cap
  ~2–3/week.

## 5. Creative

- **Reels-first:** 9:16 1080×1920, hook in 2–3s, 7–30s, captions always, keep text out
  of UI safe zones (top ~14%, bottom ~20–35%).
- **UGC-style beats polished:** staff on camera, phone-shot, trending audio.
- Post organic first, put spend behind proven winners ("existing post" ads).
- Refresh creative every 2–4 weeks — local audiences are small and fatigue fast.
- Low-text visuals; the 20%-text rule is dead but the principle isn't.

## 6. Measurement for offline businesses

1. Delivery: reach, frequency, ThruPlays, estimated ad recall (modeled, directional).
2. Proxies: messages started, profile visits, saves/shares, direction clicks.
3. **Register/CRM-side (free, do from day one):** ad-exclusive promo codes,
   "how did you hear about us," week-over-week transaction volume vs ad flighting.
4. **Conversions API [load-bearing]:** the standalone Offline Conversions API shut down
   May 14, 2025. In-store purchases upload via unified CAPI with
   `action_source: "physical_store"`, matched on hashed email/phone. CSV upload in
   Events Manager is the low-tech interim. Requires contact capture at point of sale.
5. Single-location "store visits" estimates are effectively unavailable — don't plan
   around them.

## 7. Beginner mistakes (enforce as review checklist)

Wrong objective (boosting for likes) · over-stacked targeting in a small radius ·
budget spread thin · judging in 48h / constant edits (learning resets; wait 5–7 days) ·
creative fatigue · interest-targeting teens (silently stripped) · no measurement plan ·
ignoring ad comments/DMs · expecting instant sales (awareness compounds 60–90 days).

## 8. Standard launch (first 90 days)

Weeks 1–2: accounts + pixel + GBP cleanup + register-side capture + daily organic habit.
Weeks 3–8: Awareness (radius) + Engagement (winning Reels) at low-end budget; boost 1–2
winners/week. Weeks 9–12: read register signals, kill losers, scale winners; wire CAPI
offline events when contact capture is routine.

## Worked example: resale (Plato's Closet Draper / Thrift Utah)

Two ad sets under Awareness: 13–17 (age+location; "$5 rack" creative targets) and
18–24+parents (light thrift/fashion interests). Engagement behind "Today's Drop" Reels
synced to a physical Fresh Finds rack. **Buy-side campaigns** ("we pay cash on the
spot") are the resale-specific unfair advantage — surge them 4–8 weeks before seasonal
sales peaks. Full details: platos-pos repo `marketing/meta-ads-playbook.md` and
`retail-resale-marketing/SKILL.md` here.
