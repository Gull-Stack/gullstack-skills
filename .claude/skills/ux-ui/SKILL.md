---
name: ux-ui
description: Marketing/site UX+UI for GullStack client websites — Editorial Light layout, typography, nav, CTAs, forms, imagery, and the mobile pass (tap targets, reachability, breakpoints). The decision layer over design-standard-v3 / website-conversion / storybrand. Use when designing, restyling, or reviewing any marketing site, landing page, or public-facing page on web OR mobile. NOT for product app UI — that is `app-design`.
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

- 80% light backgrounds (`#f5f5f0`/white); dark only for nav + footer. No dark-heavy SaaS look — Falling Waters is retired.
- Full-bleed hero image, no heavy overlay (bottom gradient ≤ 20–30% opacity). The image IS the design.
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

Villains must be **concrete**, not abstract icons: name the actual bad outcome ("a $9,400 change order nobody approved"), don't draw a warning triangle.

If an icon must appear, it is 16–24px, never scaled up, and wrapped in a colored shape (`website-conversion.md` § Icons).

### Typography law — dynamic, not stifling

- **Bold, tight grotesks.** Archivo is the house default. Tight tracking on display sizes, heavy weights allowed at large sizes.
- **No heavy display serifs.** Playfair/Didot/high-contrast serif headlines are out — they read as stifling and dated on GullStack work.
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

1. **Grunt test** — 5 seconds on the hero: what do they sell? If unclear, the page fails regardless of everything else. Run it at 1440px **and** 390px.
2. **Hierarchy scan** — is emphasis carried by color/weight? Is there exactly one primary button per view?
3. **Imagery scan** — any icon-box grid? Any stock in the hero? Any abstract villain?
4. **Type scan** — grotesk display face, no heavy serif, ≤2 faces, nothing under 400 weight?
5. **CTA audit** — click every CTA and link; each must resolve and each label must state the next step.
6. **Friction hunt** — anything that adds labor (long forms, extra navigation to convert) or confusion (vague copy, competing emphasis)?
7. **Mobile pass** — 768px breakpoint, 390px grunt test, tap sizes (reachability-filtered), no desktop bottom dock, load weight.
8. **Six feedback questions** (conversion, interest, clarity, expansion, brevity, disbelief) — full wording in `website-conversion.md`; use them verbatim when asking humans for review.

---

## Ship gate — look at what you build

Green assertions are not a design review. Before calling any page done:

- [ ] Screenshot the page at **1440px and 390px**, and screenshot every state that differs (menu open, form submitted, form error, empty/loading)
- [ ] Look at each screenshot and judge it against this skill — hierarchy, imagery, type, one primary CTA
- [ ] Fix what looks wrong before reporting done. "Tests pass" is not "it looks right."

---

## Scope note

This skill covers **marketing/client sites**. Product-app UX is `app-design` (ocean world, shell law, page species) plus the private brain doctrine `protocol/ux-ui-uplevel.md` in `StrongestAvengerStack/gullstack-brain` — read it first for product work if you have access. Do not halt if you can't reach it — note the gap and proceed.
