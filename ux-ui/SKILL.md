---
name: ux-ui
description: Marketing/site UX+UI for GullStack client websites — the genre branch (local/physical vs software/product), Editorial Light layout, typography, nav, CTAs, forms, imagery, and the mobile pass (tap targets, reachability, breakpoints). The decision layer over design-standard-v3 / website-conversion / storybrand. Use when designing, restyling, or reviewing any marketing site, landing page, or public-facing page on web OR mobile. NOT for product app UI — that is `app-design`.
---

# Skill: GullStack UX/UI (marketing sites)

Make and review interface decisions on GullStack **marketing sites** — layout, typography, buttons, CTAs, forms, imagery, mobile — to the Editorial Light standard. This skill is the decision layer; the canonical specs live in the playbooks and are linked, not duplicated (duplicates drift — bryce-method Part 2, rule 7).

---

## Router — pick the right design skill first

| You are working on | Skill | Standard |
|--------------------|-------|----------|
| Marketing site, landing page, public page (web + mobile) | **`ux-ui`** (this) | Editorial Light v3 |
| Product app UI — Cinch admin/HQ/register, `/m`, member, any Flight Deck | **`app-design`** | Ocean product world, shell law |
| Building/rebuilding a whole client site end to end | **`site-builder`** | wraps this skill |
| Generic stack recipes (React/Vue/Flutter idioms, chart types, a11y checklists) | `ui-ux-pro-max` | **fallback only** — GullStack canon outranks it on every conflict |

Never apply product ocean chrome to a marketing site. Never apply Editorial Light heroes to an admin room.

---

## Genre branch — pick this BEFORE any layout decision

⛔ **Added 2026-08-08.** Everything below this section was written for one genre and
silently applied to all of them. Editorial Light is the law for **local/physical**
clients. It is the wrong law for a **software/product** client, and applying it there
produces a site that reads as a landscaping company selling an API.

Name the genre out loud before you touch a hero.

| | **Genre A — local / physical** | **Genre B — software / product** |
|---|---|---|
| Who | Plato's, ECM, Desert Reef, Salisbury, trades, retail, hospitality, clinics | Cinch, OnRecord, Flight Decks sold as product, any SaaS/tool |
| Standard | **Editorial Light v3** — everything below applies verbatim | Editorial Light **branch** — the rules below marked 🅑 replace their Genre A version |
| The hero image is | a **real photograph** of the work, crew, storefront, product in hand | the **product itself** — a real UI screenshot/recording, cropped tight, or a short loop |
| Ground | 80% light (`#f5f5f0`/white) | light **or** dark, committed and consistent — dark is legal and common at the top of the market |
| Palette | warm neutrals + one accent | near-monochrome + one accent; the product screenshot supplies the color |
| Proof section | photos, stat bands, before/after | the product doing the thing: a real screen per claim, labelled |
| Trust | reviews, local presence, license, years | logos, security/compliance posture, docs, uptime, changelog |
| Motion | minimal; nothing that delays the phone | a first-class medium — one product loop, scroll-reveals, honor `prefers-reduced-motion` |
| Killer section | the comparison table | the comparison table **and** an interactive/annotated product tour |
| Type | Archivo grotesk, bold and tight | same grotesk law; a restrained editorial serif is legal for a display line only |

**Both genres keep, without exception:** the one formula, the grunt test at 1440 and
390, one primary CTA per view, every CTA resolves, the no-icon-box-grid law, the mobile
pass, and the look-at-what-you-build pass.

**Genre B evidence (Mobbin top-rated web, 2026-08-08):** Fey (4.92, the #1 rated web
app, dark, product-shot hero), Linear (dark), Mercury, Origin, Attio, Plane, Steep.
None of them ship a photograph above the fold. Their hero *is* the interface.

If a client is genuinely both (a physical business selling a software product — Cinch's
own site), the **public marketing site is Genre A** and the **product/pricing pages are
Genre B**. Do not blend them inside one page.

---

## Canonical sources

Resolve against `$GULLSTACK_HOME`, or the agent's `playbooks/` copy. If a file is missing, say so and continue with the rules below — do not halt.

- `design-standard-v3.md` — Editorial Light layout/typography/section/mobile spec
- `website-conversion.md` — conversion + visual-design rules and sources
- `storybrand.md` — SB7 messaging
- `bryce-method.md` — shipped-work lessons and hard gates

---

## The one formula

```
Conversion Rate = Desire − (Labor + Confusion)
```

Every UX decision must increase desire or decrease friction. If a proposed element does neither, cut it.

---

## Layout decisions (Editorial Light v3)

- 🅑 80% light backgrounds (`#f5f5f0`/white); dark only for nav + footer. No dark-heavy SaaS look — Falling Waters is retired.
  **Genre B:** commit to light *or* dark as a whole system and carry it end to end. The
  ban is on *accidental* dark — a dark band dropped into a light page because the hero
  needed contrast. Falling Waters stays retired either way; it was retired for being
  murky, not for being dark.
- 🅑 Full-bleed hero image, no heavy overlay (bottom gradient ≤ 20–30% opacity). The image IS the design.
  **Genre B:** the hero artifact is the product — a real screenshot or a short silent
  loop, cropped to one legible moment, never a stock laptop mockup and never a
  UI illustration of a UI. Same rule underneath: the artifact IS the design.
- Big type: hero `clamp(2.25rem, 5.5vw, 3.75rem)`, H1 ≥ `clamp(2rem, 5vw, 3.5rem)`. Don't play it safe at 1.5rem.
- Whitespace: section padding `6rem 0` desktop / `4rem 0` mobile, 1200px max-width containers.
- Homepage section order and the required-minimum six sections: see `design-standard-v3.md`. The comparison table is the killer section — it answers objections visually.
- No emojis on websites. SVG icons or nothing.

### Imagery law — no icon-box grids

**Banned:** the 3-up / 4-up grid of small icon-in-a-box tiles with a title and two lines of copy. It is the default template look and it says nothing.

Use instead, in order of preference:

1. **Real photography** — the work, the crew, the storefront, the product in hand
2. **Collage / overlap** — two or three photos breaking their own bounds, one caption
3. **Stat bands** — big numbers with a quiet label, full width, no boxes
4. **Before/after or comparison** — visual proof beats a claimed benefit

🅑 **Genre B ladder** (a software client has no crew photo, and faking one is worse
than the icon grid):

1. **Real product screens** — one screen per claim, cropped tight, annotated with a
   short label. This is the Genre B equivalent of "real photography."
2. **Short product loops** — silent, ≤6s, one interaction, `prefers-reduced-motion`
   honored, poster frame set, lazy below the fold
3. **Stat bands** — same as above
4. **Before/after** — the manual way vs the product way, both shown

Still banned in both genres: the 3-up icon-in-a-box grid, and abstract villains. A
Genre B villain is a **real screenshot of the pain** (the spreadsheet, the inbox, the
paper ticket), not a warning triangle.

Villains must be **concrete**, not abstract icons: name the actual bad outcome ("a $9,400 change order nobody approved"), don't draw a warning triangle.

If an icon must appear, it is 16–24px, never scaled up, and wrapped in a colored shape (`website-conversion.md` § Icons).

### Typography law — dynamic, not stifling

- **Bold, tight grotesks.** Archivo is the house default. Tight tracking on display sizes, heavy weights allowed at large sizes.
- **No heavy display serifs.** Playfair/Didot/high-contrast serif headlines are out — they read as stifling and dated on GullStack work.
  🅑 **Genre B exception, narrow:** one restrained low-contrast editorial serif is legal
  for a single display line (a hero or a section opener) against an otherwise grotesk
  system. It is never the body face, never the nav, and never two serifs. Playfair and
  Didot remain banned in both genres.
- Type hierarchy comes from **color + weight**, not size alone: dark (never pure black) → grey → light grey.
- No font weights under 400 in UI.
- One display face + one text face. A third face is a defect.

---

## Hierarchy, buttons, and polish

- Button hierarchy: primary = solid high-contrast (**one per view**), secondary = outline/low-contrast, tertiary = link. Red only when destruction is the primary action.
- Shadows: consistent light source, layered (3–5 stacked), color matched to the background — never flat grey on a colored section.
- Before adding a border, try (in order): box shadow, background-color change, more spacing. Borders are overused.

---

## Copy on the interface

- Headline litmus test: reading ONLY the H1, does a visitor know exactly what's sold? Specific beats slogan ("Groceries delivered in 1 hour", never "Supercharge your workflow!").
- CTA text continues the promise ("Get my free quote", "Find food") — never "Submit" or "Learn more".
- Customer is the hero, brand is the guide. Kill corporate fluff on sight ("committed to excellence").
- Nav: 2–4 links + one visually dominant CTA. Fewer links, less analysis paralysis.

---

## Forms and CTAs — hard gates (from shipped-work audit)

- **Every CTA must resolve.** No `href="#"`, no empty `tel:`, no form without a wired action. Click every one before calling anything done.
- Contact form on the homepage — floating white card over a blurred full-bleed image; don't make people navigate to convert.
- A form without a working backend (SendGrid handler, honeypot + timing trap) is a defect, not a placeholder.
- Real photos > stock > none. Never launch with stock in the hero; label placeholders `[REAL PHOTO: ...]`.

---

## Mobile

Mobile is a **design pass**, not a media query you add at the end. Half or more of client-site traffic is a phone.

### Structure

- Breakpoint at 768px is mandatory. 3-up grids collapse to single column — never a 2-up squeeze.
- **Bottom nav is mobile-only.** A phone may use a bottom dock or a sticky bottom CTA bar; **desktop web keeps top header tabs.** Never ship a bottom dock on a desktop viewport.
- The hero must still pass the grunt test at 390px wide: headline legible, one CTA visible without scrolling.
- Section padding drops to `4rem 0`; hero type reflows via `clamp()` — don't hand-write a second type scale.
- Tables and wide content scroll inside their own container. The page body never scrolls horizontally.

### Touch

- Tap targets ≥ 44px, with ≥ 8px between adjacent targets.
- Primary CTAs sit in the lower ~60% of the screen where the thumb lives.
- Anything hover-only (tooltips, hover-reveal captions, hover menus) must have a tap equivalent or be cut.

### Weight

- Strip anything that slows mobile load — autoplay video, large GIFs, third-party embeds above the fold. Nobody waits.
- Images: WebP, `srcset`, explicit width/height so nothing jumps.

### Reachability audit rule

When auditing tap targets, **measure reachability, not layout.** The audit MUST exclude:

- off-canvas drawers and closed mobile menus
- collapsed `<details>` content
- anything `display:none` / `visibility:hidden` / zero-size at that viewport

Counting hidden elements produces fake failures and hides the real ones. Measure what a thumb can actually reach at the tested viewport.

---

## UX review pass (run on any existing page)

Work top to bottom; report findings as file/section + rule violated + smallest fix:

0. **Genre** — name it (A local/physical or B software/product) before judging anything
   else. Auditing a Genre B site against the Genre A law produces confident, wrong
   findings — this was the skill's own failure mode until 2026-08-08.
1. **Grunt test** — 5 seconds on the hero: what do they sell? If unclear, the page fails regardless of everything else. Run it at 1440px **and** 390px.
2. **Hierarchy scan** — is emphasis carried by color/weight? Is there exactly one primary button per view?
3. **Imagery scan** — any icon-box grid? Any stock in the hero? Any abstract villain? Genre B: is the hero a real product screen, or a mockup of one?
4. **Type scan** — grotesk display face, no heavy serif, ≤2 faces, nothing under 400 weight?
4b. **Access scan** — contrast ≥4.5:1 on body text (check the section over the hero
   image first, it always fails), visible focus rings, alt text, tab order matches
   visual order, `prefers-reduced-motion` honored on every animation. Detail lives in
   `ui-ux-pro-max` § Accessibility — **this route is mandatory, not a fallback.**
5. **CTA audit** — click every CTA and link; each must resolve and each label must state the next step.
6. **Friction hunt** — anything that adds labor (long forms, extra navigation to convert) or confusion (vague copy, competing emphasis)?
7. **Mobile pass** — 768px breakpoint, 390px grunt test, tap sizes (reachability-filtered), no desktop bottom dock, load weight.
8. **Six feedback questions** (conversion, interest, clarity, expansion, brevity, disbelief) — full wording in `website-conversion.md`; use them verbatim when asking humans for review.

---

## Look at what you build — this is the job, not a gate

Nothing blocks you here; no machine checks any of it. Green assertions are not a
design review, and a checklist someone else enforces was never what made a page
good. Before calling any page done:

- [ ] Genre named (A or B) and the right half of every 🅑 rule applied
- [ ] Screenshot the page at **1440px and 390px**, and screenshot every state that differs (menu open, form submitted, form error, empty/loading)
- [ ] Look at each screenshot and judge it against this skill — hierarchy, imagery, type, one primary CTA
- [ ] Access scan run (contrast, focus, alt, tab order, reduced motion)
- [ ] Genre B: hero artifact is a real product screen/loop — not a mockup, not an illustration
- [ ] Fix what looks wrong before reporting done. "Tests pass" is not "it looks right."

---

## Scope note

This skill covers **marketing/client sites**. Product-app UX is `app-design` (ocean world, shell law, page species) plus the private brain doctrine `protocol/ux-ui-uplevel.md` in `StrongestAvengerStack/gullstack-brain` — read it first for product work if you have access. Do not halt if you can't reach it — note the gap and proceed.
