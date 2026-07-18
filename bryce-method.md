# The Bryce Method — lessons from Walk Through Labs' shipped work

Codified 2026-07 from an audit of the org's repos: surgeon-website-template-v2 (flagship
template), agile-counseling (live client site), platoswallet (own venture),
supertool-app (marketing platform), platos-pos (retail POS), and the ~200 client/demo
sites in the org. These are the lessons Bryce's processes and examples actually teach —
both the patterns to repeat and the misses to never repeat.

## Part 1 — The repeatable method (do this every time)

### Build
1. **Static-first, one stack.** 11ty + Nunjucks + vanilla CSS/JS, deployed to Vercel
   (GitHub Actions for real clients). React only when the product demands app behavior —
   and it never earns exemption from SEO fundamentals (see Part 2).
2. **Site-wide data lives in one place** (`src/_data/site.json`): name, phone, address,
   hours. Every page interpolates; nothing is hand-duplicated. All pages extend
   `base.njk` — if a page carries its own `<head>`, that's a defect (this drift is
   the #1 maintenance bug in shipped sites).
3. **Template farm economics.** Build one Tier-S template per vertical, then stamp
   client previews from it fast (the plastic-surgery farm proved this: dozens of
   preview repos in days). Speed of previews IS the sales pipeline.

### SEO/AEO (the signature edge)
4. **Layered JSON-LD per page:** LocalBusiness/vertical type + FAQPage + BreadcrumbList
   + ItemList on list pages. Sitemap generated from 11ty collections, never by hand.
5. **Programmatic city × service pages** for every locality in the trade area. Each
   opens by restating the search query verbatim and answering it in the first paragraph.
6. **`/.well-known/brand-facts.json`** + human-readable twin page: differentiators,
   competitiveContext, keyQuestions, idealClients, faqs — written for answer engines
   (ChatGPT/Perplexity/AI Overviews) to cite. This is the moat; ship it on every site.

### Convert
7. **The fixed conversion skeleton:** full-viewport video hero → dual CTA (one hard,
   one soft) → trust badges immediately under hero → animated stat bar → source-badged
   testimonials → financing/risk-reversal → phone-first `tel:`/`sms:` everywhere.
8. **Price-anchor the booking CTA** ("Book Now — $173") and productize the offer with
   branded/trademark-styled names for commodity services.
9. **Leads route centrally:** serverless form → SendGrid to client + CC Walk Through Labs (still the gullstack.com inbox until domain migration) →
   central lead-pipe CRM keyed by client. Honeypot + timing trap + gibberish filter on
   every form. A form without a wired backend is a defect, not a placeholder.

### Sell
10. **Copy doctrine:** StoryBrand wins the click, Voss wins the call, Belfort wins the
    close; WizGat every claim (feature → felt outcome or cut it). AIDA/PAS remain the
    page-level scaffolds. One-liner formula on every homepage.

## Part 2 — The anti-lessons (misses found in shipped work; now hard gates)

These were found across the audited repos. Each is now a **gate**: do not call a site
done if any of these fail.

1. **No pixel, no launch.** Zero audited sites had a Meta pixel, Google Ads tag, or GTM
   — including sites for clients being sold "social media marketing." Every new site
   ships with GA4 + Meta pixel (dataset) + conversion events (`form_submission`,
   `phone_click`, `email_click`) wired, not documented-as-aspiration.
2. **Own-brand sites get the same rigor as client sites.** platoswallet shipped as a
   React SPA with a one-word `<title>`, no meta description, no OG, no schema, no
   sitemap, no analytics — the least findable site in the org was our own. Venture
   sites go through the same DEPLOYMENT-CHECKLIST as client sites.
3. **"Config-driven" must be true.** The flagship template's config.js was not actually
   injected — customization was find-and-replace under a config-driven pitch. Never
   claim a capability in README/BUILD_SPEC the code doesn't have; the next bot will
   trust the claim.
4. **Every CTA must resolve.** Found: `href="tel:"` with empty number, footer links to
   `#`, contact forms with no action. Click every CTA before deploy (this belongs to
   the DEPLOYMENT-CHECKLIST crawl).
5. **Capture emails or you rent your audience.** No audited site builds a list. Add a
   newsletter/VIP-list capture to every retail/consumer site; leads are for sales,
   lists are for marketing.
6. **Skills must not gate on files that don't exist.** site-builder/SKILL.md required
   reading CLIENT-MONITORING.md ("STOP if missing") — the file doesn't exist, so an
   obedient bot halts. When writing skills: every referenced file must exist in the
   repo, or the gate must be soft.
7. **One canonical copy per doctrine.** StoryBrand existed in two diverging copies
   (here and in threekingssalestalkmethod); SEO existed as both seo-master and
   seo-homework. Duplicates drift. Link, don't copy.
8. **Working software beats specs — and specs must say so.** SuperTool's SMS/loyalty/
   win-back engines are real, shipped code; its retail packaging is a to-do list. Mark
   every doc's claims as SHIPPED vs PLANNED so bots don't sell vapor.

## Part 3 — Where the method points next (from the same audit)

- **Retail is the open flank.** The brain covered B2B lead-gen only, while the org
  owns a ~$1.3M/yr Plato's Closet and a working retail marketing platform (SuperTool).
  The new skills `meta-ads/` and `retail-resale-marketing/` close this gap.
- **The customer graph is the asset.** platos-pos captures phone/email/birthday +
  purchase history; SuperTool auto-links customers from Stripe card fingerprints.
  Wiring them turns every swipe into audience data (SMS, loyalty, Meta custom
  audiences, offline conversions).
- **AEO transfers to retail intact:** brand-facts.json + FAQPage + programmatic city
  pages work the same for "thrift store in Draper" as for "EMDR in Sandy."
