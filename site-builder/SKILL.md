---
name: site-builder
description: Build premium GullStack client websites to the Tier-S standard — 11ty + Nunjucks + vanilla CSS, Editorial Light v3 design, StoryBrand messaging, full AEO schema, Vercel deploy with mandatory verification. Use when building, rebuilding, or making significant changes to any client or GullStack-owned website.
---

# Skill: GullStack Site Builder

Build premium client websites to GullStack's Tier-S standard. Every site uses 11ty, follows Editorial Light design, StoryBrand messaging, and ships with full AEO.

---

## Pre-Build Checklist

Before writing ANY code, read these files. In the `gullstack-skills` repo they live at the repo root; in an OpenClaw workspace they may be under `playbooks/`. Search both locations:

1. `design-standard-v3.md` — Editorial Light template (the ONLY standard)
2. `storybrand.md` — SB7 messaging framework
3. `website-conversion.md` — conversion optimization
4. `DEPLOYMENT-CHECKLIST.md` — mandatory post-deploy verification
5. `seo-master/SKILL.md` — the build-time SEO/AEO defaults (schema generated from
   the same source as the copy, AI crawlers allowed, machine surfaces shipped with
   the build). `seo-audit/SKILL.md` is the on-demand diagnostic, not a gate.

If any of these files are missing, STOP and tell the user. Do not build without them. (`CLIENT-MONITORING.md` — the ongoing verification protocol — does not exist yet; if you find it, read it too, but do not halt on its absence.)

---

## Build Standards

### Tech Stack
- **11ty (Eleventy)** — static site generator, always
- **Nunjucks (.njk)** — templating language
- **Vanilla CSS** — no Tailwind, no frameworks. Custom properties for brand colors.
- **No JS frameworks** — vanilla JS only, minimal. Native HTML elements preferred (`<details>` for FAQ, CSS animations for marquees)

### Design: Editorial Light v3.2
Full spec in `design-standard-v3.md`; decision layer + review pass in the `ux-ui` skill. Headlines only:

- **80% light backgrounds** (#f5f5f0 or white), dark only for nav + footer
- **Full-bleed hero imagery** — edge-to-edge, type on the photo, NO heavy overlays (20-30% opacity max gradient). Strongest true proof sits in the hero (`design-standard-v3.md` §2)
- **One grammar across interiors** — shared page-head at a lighter weight, type-only (no full-bleed photo), article headers inherit the same scale (`design-standard-v3.md` §10)
- **Big typography** — H1: `clamp(2rem, 5vw, 3.5rem)`, Hero: `clamp(2.25rem, 5.5vw, 3.75rem)`. One serif accent on an existing word is legal; do not rewrite the H1
- **Generous whitespace** — section padding `6rem 0` desktop, `4rem 0` mobile
- **Bold tight grotesk — Archivo is the house display face.** No heavy display serifs. Inter is an acceptable *text* face, not the display voice. Max two faces
- **No icon-box grids** — real photography, collage, or stat bands instead. Villains concrete, never an abstract icon (§9)
- **NO emojis** — use SVG icons or nothing
- **Mobile is a design pass, not a media query** — 390px grunt test, 44px targets, bottom nav/sticky CTA bar mobile-only (desktop keeps top header nav). See `design-standard-v3.md` § Mobile

### Homepage Section Order (minimum 6 of these)
1. Hero — full-bleed image, big headline, subtitle, CTA
2. Partners/Logos — scrolling marquee, grayscale
3. Who We Serve — bold headline + category descriptions
4. Project/Work Showcase — image cards grid (3-up desktop)
5. Testimonials — star rating, quote, name/title
6. Benefits — photo/stat treatment or inline checklist (NOT an icon-tile grid)
7. How to Start — 3-step process cards
8. Comparison Table — us vs. alternatives (green checks / gray X's)
9. FAQ — `<details>` accordion, 5-6 questions
10. Contact Form — background image + floating white card

**Required minimum:** Hero + Partners + Showcase + Comparison + FAQ + Contact

### Mandatory Social Proof
Every homepage needs at least 3 of:
- Scrolling client logos
- Comparison table (this is the killer — answers objections visually)
- Testimonial cards
- FAQ accordion
- "How to Start" process cards

### Color Strategy
```css
--color-primary-dark   /* nav, footer, headings */
--color-accent         /* CTAs, highlights, step numbers */
--color-light          /* section backgrounds (#f5f5f0 or warm neutral) */
--color-white          /* cards, form backgrounds */
/* Body text: #333-#555, never pure black */
```

### Build traps (these look like CSS nits and they ship as broken pages)

1. **Never `!important` a fill on a grouped button selector that mixes grounds.** A rule like `background: var(--ground) !important` on `.btn-primary, .hero .btn-primary` cannot be beaten by specificity. The hero CTA on a photo goes dark-on-dark (measured 1.4:1 until the exception also used `!important`). Either don't group mixed grounds, or match `!important` on the exception. Measure contrast on every ground before calling the hero done.

2. **Duplicated option lists drift.** Anything a human will edit twice (`<select>` options, price tiers, city lists) lives in `src/_data/` and is interpolated. A `<select>` cannot ellipsize — labels must be short enough to render whole at the control's width, or they clip mid-word with no other visual breakage.

3. **Layout follows state.** Do not pin a field to `grid-column: 1 / -1` because the most complex state needs a full row. The default state will look ragged. The span follows the state.

4. **Scope the serif accent to `.page-head h1 em` (and `.hero h1 em`).** A global `em` or `h1 em` turns every body italic into a flourish. Body copy like *which study* stays a normal italic.

5. **Meta rows are derived.** Collection counts, source stats, funding labels come from `_data` / collections. Do not type the number into the header.

6. **Link a Vercel project by its project name, never by folder.** Linking by folder is how a stray project gets created. Git connection stays the normal path; `vercel --prod` is the override when webhooks sit.

---

## Messaging: StoryBrand (SB7)

- **Customer is the hero.** Brand is the guide. Never position the brand as the star.
- **Lead with the problem.** External problem → internal frustration → philosophical wrong.
- **Clarity over cleverness.** Kill corporate fluff. No "committed to excellence."
- **3-step plan max.** Reduce cognitive load.
- **Bold CTAs.** Ask for the sale. Passive = "we don't believe in our product."
- **The grunt test:** Could a caveman understand what you offer in 5 seconds?

---

## AEO (Answer Engine Optimization) — EVERY Build

Doctrine: `seo-master`. Ship gate: `seo-audit` on the live URL. P0s block "done."

### Required Schema (in `<head>`)
- **Organization** — name, url, logo, sameAs (socials)
- **LocalBusiness** — address, phone, hours, geo coordinates
- **FAQPage** — on every service page
- **BreadcrumbList** — on all pages

### Required Content Patterns
- Structured Q&A sections (answer LLM queries directly)
- E-E-A-T signals: credentials, founding date, author info, reviews
- Service pages answer "how much does X cost" and "best X near me" patterns

---

## Deployment

### Git Workflow
1. `git pull --rebase origin main` — ALWAYS pull first
2. Make changes
3. `git add` + `git commit -m "Bot [YourName]: [what changed]"`
4. `git push origin main` — if rejected, pull and retry
5. **Never force push. Ever.**
6. **NEVER hardcode tokens/keys/secrets in source code**

### Vercel
- **Free plan** for all new/prospect sites
- Only move to paid/GullStack team when they become paying customers
- Auto-deploy via GitHub → Vercel integration
- Verify `vercel.json` has correct `buildCommand` and `outputDirectory`
- A git push is not a deploy. Confirm the Vercel deployment is this commit (`vercel ls` or the dashboard). If GitHub webhooks are degraded, two clean pushes can sit undeployed — ship with `vercel --prod` and leave the Git connection untouched.
- Link by **project name**, never by folder. Folder-link creates a stray project.

### Post-Deploy Verification (MANDATORY)
Run the full `DEPLOYMENT-CHECKLIST.md`:
- [ ] Live URL loads
- [ ] Homepage displays correctly
- [ ] All images load
- [ ] Navigation works
- [ ] Internal links work (no 404s)
- [ ] Contact form submits
- [ ] Mobile responsive
- [ ] Broken link scan
- [ ] Sitemap validation
- [ ] Structured data validation
- [ ] `seo-audit` report on the live URL — every P0 closed

---

## Dynamic Sitemap (11ty)

Every site MUST have a dynamic sitemap. Add to root:

```njk
---
permalink: /sitemap.xml
eleventyExcludeFromCollections: true
---
<?xml version="1.0" encoding="utf-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
{%- for page in collections.all %}
  <url>
    <loc>{{ site.url }}{{ page.url }}</loc>
    <lastmod>{{ page.date | dateToISO }}</lastmod>
  </url>
{%- endfor %}
</urlset>
```

---

## GullStack Footer (MANDATORY)

Every client site must include a GullStack attribution footer:
```html
<div class="gullstack-credit">
  Built by <a href="https://gullstack.com">GullStack</a>
</div>
```

---

## What NOT To Do
- ❌ No dark-heavy "SaaS template" designs (Falling Waters is retired)
- ❌ No emoji on websites
- ❌ No Tailwind or CSS frameworks
- ❌ No JS frameworks (React, Vue, etc.)
- ❌ No hardcoded API keys or tokens
- ❌ No generic copy ("committed to excellence", "your trusted partner")
- ❌ No deploying without running the full checklist
- ❌ No force pushing
- ❌ No `!important` fill on a button group that includes both light-page and hero-on-photo
- ❌ No duplicated `<select>` / option markup across templates
