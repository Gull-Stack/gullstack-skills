---
name: retail-resale-marketing
description: Brick-and-mortar retail & resale marketing — register metrics not CRM pipelines, the two-sided buy/sell resale funnel, Google Business Profile first, merchandising-as-content loop, events/promos, seasonality. Use when marketing any physical storefront, especially resale/thrift (Plato's Closet, Thrift Utah).
---

# SKILL: Retail & resale marketing (brick-and-mortar foot traffic)

How GullStack markets physical retail — written for the resale/thrift vertical
(Plato's Closet Draper, Thrift Utah/Draper) but the structure generalizes to any
storefront. Written 2026-07. Companion skills: `meta-ads/`, `seo-master/`
(local-SEO section), and platos-pos repo `marketing/` for the worked plans.

## 1. Retail ≠ lead-gen (recalibrate before applying other skills)

The rest of this brain optimizes B2B lead-gen: one visitor → one form → one high-value
sale. Retail is: thousands of small transactions, walk-in traffic, repeat frequency,
and (for resale) a **two-sided funnel** — you market for inventory (buy side) AND for
shoppers (sell side). Success metrics are transaction count, average basket, buy-counter
volume, repeat rate — measured at the register, not in a CRM pipeline.

## 2. The two funnels (resale/buy-counter model)

| | Sell side (shoppers) | Buy side (sellers) |
|---|---|---|
| Search intent | "thrift store near me" | "sell clothes for cash near me" |
| Audience | bargain / Gen-Z shoppers | decluttering parents, closet-cleaners |
| Objections | picked-over, dirty, outdated | lowball fear, wait time, rejection embarrassment |
| Content | daily drops, hauls, styling, themed racks | payout transparency, what-we-buy lists, "cash on the spot" |
| Timing | at seasonal demand peaks | **surge 4–8 weeks BEFORE peaks** |

Treat sell-to-us as a *product* with its own page: how it works, accepted brands,
cash vs store-credit split (credit pays ~25% more), no appointment. "We're buying X"
posts double as freshness signals to shoppers. Buy volume leads sales revenue by
1–2 months — verify in the client's POS.

## 3. Google Business Profile first (highest-ROI channel)

Before any paid spend: complete GBP (hours, weekly photos, product categories), Google
Posts for drops/events, review velocity (ask at the register, respond to all),
city-name keywords sitewide. Descriptive store names ("Thrift Draper") are weak
trademarks but exact-match local queries — GBP + local pages capture that intent.
Apply the full AEO stack (brand-facts.json, FAQPage schema, programmatic city pages)
exactly as seo-master specifies; it transfers to retail unchanged.

## 4. The content loop (organic engine)

**Merchandising IS content.** Rotate themed racks/zones on a schedule ("Just In,"
staff picks, flannel wall, ski rack) → photograph/film each rotation → "Today's Drop"
Reels synced to the physical rack → online hype drives visits → restock drives content.
Anchor post days to intake/processing days. Formats that work: haul/try-on, "come
thrift with me," one-of-one item spotlights, "$5 and under" series, transformation/
styling. Honest scarcity is structural in resale — every item is one-of-one.
Micro-influencer/creator hauls (paid in store credit) are the cheapest reach multiplier.

## 5. Events & promos (traffic spikes on demand)

Recurring high-urgency events beat constant discounts: $5 fill-a-bag clearance days
(also solve aging inventory), weekly cadence promos (bring-the-bag Wednesdays),
seasonal pushes (prom March–April, back-to-school August, winter/ski Nov–Feb).
Events generate their own ad creative and social proof (lines at the door).

## 6. Seasonality (teen/family resale, northern states)

| When | Move |
|---|---|
| Early Jan | Buy surge #1 (New-Year purge) → spring floor |
| Mar–Apr | Prom/formal sell push (intake opens Jan–Feb) |
| Apr–Jun | Spring-cleaning intake; thrift's biggest shopping season |
| Jun–Jul | Buy surge #2 → back-to-school |
| **Aug** | **Peak sales month** (BTS prices 2–3x; first 3 weeks) |
| Sep–Oct | Buy surge #3: coats/ski (Oct coat prices beat Jan clearance) |
| Nov–Feb | Winter sell season; pre-holiday cleanout intake Oct–Dec |

Peak-season items sell 40–60% faster; source 4–8 weeks ahead.

## 7. Measurement at the register (non-negotiable)

From day one: ad-exclusive promo codes captured in the POS (discount-reason field),
"how did you hear about us" at checkout/buy counter, and week-over-week comparison of
transactions + buy volume + new customers vs ad flighting. Upgrade path: capture
email/phone at the register → hashed uploads to Meta CAPI (`physical_store`) → Sales
objective + custom audiences + lookalikes. The customer graph (phone/email/birthday/
purchase history) is the compounding asset — it powers SMS, loyalty, win-back, and
paid audiences (SuperTool implements all four; wire the POS to it).

## 8. Budget frame

Local retail: 5–10% of gross revenue total marketing. Franchise clients: check the FDD
for mandated minimums first (e.g., Winmark/Plato's since Jul 2026: 2% national ad fund,
6% total minimum, $1,500/yr fee) — the mandated floor IS the budget until measurement
proves scaling. Split guidance: ~40–60% Meta, ~15% GBP/local SEO/reviews, remainder
events/promos. Derive the actual number from the client's books or POS, never a guess.
