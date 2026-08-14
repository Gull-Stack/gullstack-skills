# PawTree — independent pet-wellness site for a PawTree distributor

**Status: project setup.** This directory is the staging quarantine for the PawTree
project until the `Gull-Stack/PawTree` repository exists (the session that set this
up could not create org repos — see "Repo split-out" below). Per this repo's
CLAUDE.md, `apps/` is the quarantine for exactly this situation; keep everything
self-contained (no imports from the scaffold) so `git subtree split` can lift it
out whole, the way Home Manager was.

Source of record for the scope below: client meeting 2026-08-13, Plaud recording
"08-13 Automating Lead Generation for a Multi-Level Marketing Business"
(https://web.plaud.ai/s/pub_d86a136f-430c-482d-a2de-f7efc33415ff::ZjyPDyQovbrzinJlSgleBGFwM1ffln_GNWOXLAroDFSp8tFvCrdDQI5sIezSlMaMHukRqJ2nMvQM7A0C).
Transcript gotcha: Plaud mis-transcribes the brand as "poetry", "Paughkeepsie",
"Pa Tree", and "Podtree" — all of these mean **PawTree**.

## What this project is

The client is a top sales manager / distributor at **PawTree**, an online-only
MLM selling pet products (dog food, supplements). She has a monthly minimum for
new customer accounts, and 12 years of experience that link-posting on social
media does not convert — the products sell on storytelling (near-100% close rate
in person at vendor shows, which she is burnt out on). Enrolling new customers is
worth roughly $1,000–$2,000/mo to her. She wants automated, passive top-of-funnel
lead generation.

**The build:** an independent, community/blog-style pet-wellness website that we
control as the buyer's first touchpoint — engineered for SEO and AEO (the
seo-master 7-layer system) so search engines and AI assistants surface it for
queries like "best dog food", "dog supplements", "dog arthritis supplement",
"supplement for dog anxiety". Content reads like an animal-wellness community
blog (travel-blog pattern: editorial surface, directed funnel underneath). At
purchase intent, the site hands off to the client's replicated PawTree
distributor page — **pawtree.com/5STAR** — so every sale is attributed to her
through PawTree's own checkout.

## Compliance constraints (from PawTree policy, per the client — hard rules)

1. **All points of sale go through her replicated PawTree site** — this site
   never takes payment; checkout is a redirect to pawtree.com/5STAR.
2. **No PawTree trademarks or brand keywords** in the domain, branding, or copy
   that trades on the mark. Generic category keywords (dog health, best dog
   food) are fine — keywords aren't ownable.
3. **The site must not look like the PawTree corporate/replicated site** — no
   mirroring their design.

Note: PawTree's replicated checkout may force account creation before purchase.
That friction is on PawTree's side of the fence — attribution requires their
flow, so we don't fight it; we control everything before it.

## Deal terms

- No upfront cost to the client; build first, then iterate.
- **Profit share, split TBD** — agreed in principle on the call (client signaled
  a lot of flexibility); nothing written. Get real terms before money moves.

## Open items / next steps

- [ ] **Josh/Bryce: create `Gull-Stack/PawTree` (private)** — the GitHub App
      credential in remote sessions can't create org repos (403).
- [ ] Client to send color preferences + example sites she likes (she owes this
      from the call).
- [ ] Pick a domain — undecided. Direction from the call: generic pet-wellness /
      "best dog food"-shaped naming, no PawTree mark in it.
- [ ] Build the initial site (house standard: site-builder skill — 11ty +
      Nunjucks, Editorial Light, AEO schema, Vercel deploy; ux-ui genre branch =
      local/physical? No — this is a content/affiliate-style funnel site; read
      DESIGN.md first per CLAUDE.md before layout decisions).
- [ ] Text the client a preview link, iterate until she'd be proud of it.
- Later roadmap floated on the call (not committed): lead-capture that gets
  people to call directly, then a trained phone bot taking those calls.

## Repo split-out (when Gull-Stack/PawTree exists)

```
git subtree split --prefix=apps/pawtree -b pawtree-split
git push git@github.com:Gull-Stack/PawTree.git pawtree-split:main
```

Then delete `apps/pawtree` here, same as the Home Manager move.

## The site (v1 draft) — `site/`

11ty + Nunjucks + vanilla CSS per `site-builder`; Editorial Light v3.1, Genre A.
Working brand **"The Good Bowl"** — swap in `site/src/_data/site.json` when the
domain is picked (brand, url, email are all config). Type echoes Bryce's
thriftutah.com build (Space Grotesk display / Inter text / Plex Mono eyebrows,
numbered sections); palette is forest + toasted copper, deliberately nothing
like PawTree corporate (compliance rule 3). Checkout CTAs all resolve to
`pawtree.com/5STAR` with `rel="sponsored"`; the commission disclosure renders
in the footer and About page.

- Build: `cd site && npm install && npx eleventy` → `_site/`
- AEO shipped: brand-facts.json · Organization/BreadcrumbList/FAQPage schema ·
  two answer-hub guides (itchy skin, joint supplements) · sitemap · robots
- Verified: builds clean, zero broken internal links, 1440 + 390 screenshots
  reviewed, 390 grunt test passes (headline + CTA in first viewport)
- **Before this goes live:** real photos into the `[REAL PHOTO: …]` slots
  (never stock in the hero), author bio on `/about` filled with the client's
  real story, final domain + brand name, and the client's read on whether
  naming "pawTree petPro" in the disclosure fits their policy wording.

- **Live preview (v1, texted-link candidate):** https://good-bowl-nothputpa-gull-stack.vercel.app
  (Vercel project `good-bowl`, gull-stack scope, deployment protection off so the
  client can open it; project name avoids the PawTree mark in the URL on purpose.)
