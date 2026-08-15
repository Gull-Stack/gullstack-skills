---
name: seo-audit
description: Mandatory live-site gate for every GullStack marketing site — Traditional SEO (A1–A6) plus the 7-layer AEO system, scored /45, with a P0/P1/P2 punch list, intent map, fact-consistency table, and a do-not-invent queue. Use when auditing, indexing, or verifying SEO/AEO; after any site deploy; before calling a client or GullStack-owned marketing site done; or when the user runs /seo-audit. The audit itself is read-only — building/fixing is site-builder / seo-master.
---

# Skill: SEO + AEO Site Audit

**Critical. Every public marketing site we build, rebuild, or take over.**

`seo-master` is the doctrine (what good looks like). This is the **instrument**
(what is actually true on that URL today, with a citation for every claim) and
the **ship gate** (P0s block "done").

Product-app UI is `app-design`. This skill still applies to any public marketing
surface (client `*-site`, GullStack-owned marketing, tenant public sites,
landing pages).

---

## Inputs

Fill these before starting. If the caller only gave a URL, infer the other two
from the site itself and **state the inference** in the report header.

```
SITE:            https://example.com
BUSINESS TYPE:   local / destination / professional-services / ecommerce / SaaS
PRIMARY MARKETS: city, metro, or "national"
```

---

## Hard rules (these are the skill)

- **Read-only.** Do not rebuild. Do not fix while you're here. Do not open a PR.
  Stop after the report unless the human says "now fix it."
- **Never invent a fact.** Hours, prices, staff, awards, review counts, founding
  dates, service areas — if it is not on the page, in schema, or in a public
  listing you actually fetched: write **UNKNOWN**.
- **Cite everything.** Every claim gets a URL, or a "not found" *plus the URL you
  checked*. "Missing" with no URL is not a finding.
- **Skip is never PASS.** Could-not-check is its own verdict and it is not green.
- **Never claim a tool you did not run.** Lighthouse, CWV, backlinks, GSC, paid
  tools, live AI-citation tests → **NOT RUN** unless you ran it this session and
  can paste the number.
- **A green schema block that contradicts the visible page is a FAIL**, not a pass.

Verdicts:
- **PASS** — present, unique, and consistent with visible copy
- **PARTIAL** — present but thin, duplicated, or mismatched
- **FAIL** — missing, blocked, contradictory, or invented-looking
- **N/A** — the layer does not apply; say why. Layer 7 is N/A only if they sell nothing.

---

## How to work

1. **Fetch the machine surfaces first** (curl is fine, and shows you the real
   status codes and redirects):
   `/robots.txt` · `/sitemap.xml` · `/brand-facts.json` ·
   `/.well-known/brand-facts.json` · `/llms.txt` · `/llms-full.txt`
   Record the HTTP status for each. A 200 that returns the SPA shell / a soft-404
   HTML page is **not** a hit — check the body, not the code.
2. **Build the URL list** from the sitemap + nav. Sample **every unique template**:
   home, about, each service type, each city/location page, blog index + 2 posts,
   contact, any compare/guide/cost page. Cap at 25 pages on a huge site and say
   exactly what you skipped and why.
3. **View source each sampled page** (source, not a rendered summary) for: title,
   meta description, canonical, robots/noindex, H1, first 80 words, every
   `application/ld+json` block, OG/Twitter tags, breadcrumbs, FAQ markup, and a
   spot-check of image alt coverage.
4. **Index check:** `site:{{domain}}` — approximate indexed count vs sitemap count.
   Report the delta and name the likely orphans / leftover staging URLs.
5. **AI crawler check in robots.txt.** List each bot as allow / disallow /
   unspecified: GPTBot, ChatGPT-User, OAI-SearchBot, ClaudeBot, Anthropic-AI,
   PerplexityBot, Google-Extended, GoogleOther, Bytespider, CCBot,
   Applebot-Extended. **Blocking any of these is a P0 for AEO.**
6. **Branded SERP:** search brand + primary service + city. Note who ranks — them,
   their GBP, directories, competitors.
7. **Only then** run anything heavy (Lighthouse via chrome-devtools, a 390px
   viewport pass). If you did not run it, write NOT RUN — do not estimate it.

Tooling in this environment: `curl -sSIL` for status/redirect chains, WebFetch for
page bodies, WebSearch for `site:` and branded SERPs, `mcp__chrome-devtools__*`
(`navigate_page`, `resize_page` to 390px, `lighthouse_audit`) when a real render or
a real score is required. A **stale rig or a cached fetch fakes a verdict** — audit
the live public URL, never a localhost build of it.

---

## PART A — Traditional SEO (the floor)

Score each item PASS / PARTIAL / FAIL / N/A **with evidence**.

### A1. Indexation & crawl
- [ ] HTTPS everywhere; no mixed-content dump
- [ ] `/robots.txt` exists, does not blanket-`Disallow: /`, allows Googlebot
- [ ] `/sitemap.xml` exists, valid, URLs on the canonical host, `lastmod` present
- [ ] `site:` count vs sitemap count (delta + likely orphans / leftover staging)
- [ ] No accidental `noindex` / `nofollow` on money pages
- [ ] Canonical on every page, self-referencing, correct host (www vs apex)
- [ ] Clean URLs (`/services/name/`, not `.html?id=`)
- [ ] Soft-404s, redirect chains, http→https, trailing-slash consistency

### A2. On-page — one table row per sampled URL
`URL | title (chars) | meta (chars) | H1 | primary-keyword guess | word count (approx) | internal links out | schema types`

Rules applied to that table:
- Unique title, 50–60 chars, keyword front-loaded
- Unique meta, 140–160 chars, with a real CTA
- Exactly one H1, containing the primary topic
- Primary topic inside the first 100 words
- Thin = under ~300 words on a commercial page
- 2–5 descriptive internal links; no "click here"

### A3. Technical / UX
- [ ] Mobile usable at ~390px (no overflow, tap targets not microscopic) — say so
      plainly if you only read source and never rendered it
- [ ] Images: descriptive alt (not a filename); compressed; dimensions / CLS risk
- [ ] Semantic HTML (header/nav/main/footer, heading order, no heading-as-style)
- [ ] Core Web Vitals / PageSpeed — run it or write NOT RUN
- [ ] Broken links on sampled pages
- [ ] Content not hidden behind mobile-only accordions that strip it from the DOM

### A4. Information architecture & keywords
- [ ] One primary intent per URL (flag cannibalization)
- [ ] A service page exists for each real offer
- [ ] Location / city pages exist **only** where they carry distinct content
      (drive time, local proof). Thin doorway pages = FAIL
- [ ] Blog exists and is fresher than 90 days, or call it stale
- [ ] About page carries credentials, people, years, service area (E-E-A-T)

### A5. Local SEO (if physical / service-area)
- [ ] Google Business Profile claimed and matching site NAP exactly
- [ ] NAP identical across site footer, contact page, schema, and 2–3 directories
      you actually opened
- [ ] LocalBusiness (or a more specific type) with geo, phone, hours, address
- [ ] Reviews exist and are recent enough to matter

### A6. Authority signals (light)
- [ ] Who else talks about them? (directories, press, associations — list URLs)
- [ ] Branded search: what is the SERP? (official site, GBP, junk, competitors)

---

## PART B — the 7-layer AEO system

AEO = will ChatGPT / Perplexity / Gemini / Google AI Overviews **retrieve, trust,
and quote** this brand? Doctrine and templates: `seo-master/SKILL.md`.

### Layer 1 — Intent map
Build the map they *should* have, then mark coverage.

`query | intent (info / commercial / transactional / navigational) | owning URL or MISSING | notes (cannibal / thin / wrong intent)`

Seed from: their services × market, People-Also-Ask patterns,
"how much does X cost in [city]", "best X near me", "hire / book X [city]".

PASS = every high-value query has exactly one page.
FAIL = money queries have no page, or three pages fight over one.

### Layer 2 — Answer hubs
Long-form pages that answer the way people ask AIs: `/guides/…`, `/compare/…`,
cost pages, "best X in [city] [year]". Shape: 1,500–2,500+ words, H2s as
questions, the answer inside the first ~40 words, key takeaways near the top, a
comparison table or real numbers, an FAQ block, a CTA into a service page.

List each: `URL | approx word count | answers-in-lead? | FAQ schema? | thin/doorway?`

PASS = 5–8 real hubs (or a justified smaller set on a tiny site).
PARTIAL = a blog that almost does this. FAIL = no answer-first long pages.

### Layer 3 — Brand-facts content (human-readable)
- [ ] About: founding date, credentials, team, service area — sourced, not fluff
- [ ] Service pages: process, pricing signals, who it's for, case/proof links
- [ ] The same facts on every surface (no conflicting phone / city / hours)

PASS = a model could write a Wikipedia stub from the About + service pages alone.

### Layer 4 — brand-facts.json (machine-readable)
Fetch `{{origin}}/brand-facts.json` and `{{origin}}/.well-known/brand-facts.json`.
Required: `name, type, founded, location, services[], differentiators[],
credentials[], serviceArea[], NAP, FAQs, last_updated`.
Check it exists, is valid JSON, and **matches visible copy AND schema**.
A mismatch is a FAIL even though the file exists.

### Layer 5 — Schema (JSON-LD in `<head>`)
Extract every `@type` on the sampled pages. Baseline:
- `Organization` (name, url, logo, sameAs, foundingDate)
- `LocalBusiness` **or the specific subtype** (Dentist, LodgingBusiness,
  TouristAttraction, FinancialService, …) with PostalAddress, telephone,
  openingHours, geo
- `FAQPage` on every service/hub that shows FAQs — and the questions must be
  visible on the page
- `BreadcrumbList` on all non-home pages
- `WebSite` + `SearchAction` if on-site search exists

Also flag: `Review` / `AggregateRating` with no evidence, `Offer` prices that do
not appear on the page, any schema that contradicts the copy.

PASS = valid, specific, consistent with visible text. FAIL = missing
LocalBusiness on a local business, FAQ schema with no FAQ, or invented ratings.

### Layer 6 — Citations & authority
- [ ] GBP optimized (categories, hours, photos, posts — as far as the public SERP shows)
- [ ] Industry directories / associations / "best of" / press — list live URLs
- [ ] Reviews: count + recency **if visible**; never invent one
- [ ] Unstructured mentions (news, chambers, suppliers)

PASS = multiple independent sources repeat the same NAP + category. Answer engines
trust this more than the About page.

### Layer 7 — Product / Offer schema
N/A if they sell no product, lodging, ticket, or priced package — say so.
Otherwise `Product` / `Offer` / `AggregateOffer` with real price, availability,
currency — and it must match the page.

### AEO extras (grade them even though they sit beside the 7)
- [ ] `/llms.txt` and `/llms-full.txt` exist, quote-ready, same facts as brand-facts.json
- [ ] robots.txt does **not** block AI crawlers (list every bot: allow / disallow / unspecified)
- [ ] Answer-first writing on commercial pages, not only on hubs
- [ ] Per-page Open Graph (not one shared card for the whole site)

---

## PART C — Deliverable (use this exact shape)

### 1. Scorecard

| Area | Score 0–5 | One-line why |
|---|---|---|
| Traditional SEO (A1–A6) | | |
| AEO L1 Intent map | | |
| AEO L2 Answer hubs | | |
| AEO L3 Brand-facts content | | |
| AEO L4 brand-facts.json | | |
| AEO L5 Schema | | |
| AEO L6 Citations | | |
| AEO L7 Product/Offer | | |
| AEO extras (llms / robots / OG) | | |
| **TOTAL / 45** | | |

5 = cite-ready. 3 = present but leaky. 0 = missing or contradictory.
Layer 7 N/A → score out of 40 and say so.

### 2. P0 / P1 / P2 punch list
Each item: `severity | layer | what's wrong | URL evidence | the fix in one sentence`.
- **P0** — blocked from the index or from AI crawl, or facts contradict each other
- **P1** — money-query gap, missing schema type, no hubs, no brand-facts.json
- **P2** — polish (meta length, OG cards, freshness)

### 3. Intent-map table
The Layer 1 table. The MISSING rows *are* the content brief.

### 4. Fact-consistency table
Rows: name, phone, address, hours, geo, founding, review count.
Columns: visible page | JSON-LD | brand-facts.json | llms.txt | GBP/directory.
Mark MATCH / MISMATCH / MISSING in every cell.

### 5. What I did not verify
Explicit list — Lighthouse, backlinks, GSC, paid tools, live AI-citation test,
anything capped out of the 25-page sample. Never imply those ran.

### 6. Do-not-invent queue
Every fact the next builder will be tempted to fill in, written as the exact
question to put to the client. No plausible placeholders.

---

## Stop rule

Stop after the report. Do not start implementing unless the human says so.
When they do: the fixes are built with `site-builder`, the content strategy comes
from `seo-master`, and the design of anything new goes through `DESIGN.md`.

If running inside the site's repo, save the report to
`docs/audits/seo-aeo-<domain>-<YYYY-MM-DD>.md` so the next audit has a baseline to
diff against.

## Ship rule

A marketing site we build or rebuild is **not done** until this report exists for
the **live** URL (customer host, not localhost) and every P0 is closed.

The audit stays read-only. Closing P0s is a separate turn.

`DEPLOYMENT-CHECKLIST.md` still owns load / images / forms / crawl. This skill
owns whether the site can rank and be cited.
