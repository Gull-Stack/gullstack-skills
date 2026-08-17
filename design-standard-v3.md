# GullStack Design Standard v3 — "Editorial Light"

*Established: March 2026. Based on the Monterey Bay Door v3 rebuild.*
*Reference site: unikorns.work*
*v3.1 — 2026-08-07: typography corrected to grotesk, imagery law added, mobile promoted to a first-class section.*
*v3.2 — 2026-08-17: one grammar across interiors; proof sits in the first view; one serif accent on an existing word.*

**Scope:** marketing sites only. Product app UI (Cinch admin/HQ/register, `/m`, member, Flight Decks) follows `app-design`, not this. Decision layer over this spec: the `ux-ui` skill.

---

## Core Principles

### 1. Light-Dominant Layout
- 80% light backgrounds (#f5f5f0 or white), dark only for nav and footer
- Dark sections used sparingly for contrast, not as the default
- The overall feel should be editorial/magazine, not SaaS template or corporate dark

### 2. Full-Bleed Hero Imagery
- Hero images go edge-to-edge with NO heavy overlays
- Use a subtle bottom gradient (20-30% opacity max) for text readability
- Let the photo do the work — the image IS the design
- Type sits **on** the photo, not in a card beside it
- If the site has one strongest true proof (a number you can defend), it lives **in the hero** as a hairline stat row. A grey band of the same numbers under the fold is a waste of the best thing the site has
- Text sits at the bottom of the hero with generous padding

### 3. Big, Confident Typography — dynamic, not stifling
- H1 headlines: `clamp(2rem, 5vw, 3.5rem)` minimum
- Hero headlines: `clamp(2.25rem, 5.5vw, 3.75rem)`
- Don't play it safe with 1.5rem headings — say it big
- **Display face: a bold, tight grotesk. Archivo is the house default** (Archivo / Archivo Expanded; Inter is an acceptable neutral text face, not the display voice)
- **No heavy display serifs.** Playfair, Didot, and other high-contrast serif headlines are retired — they read stifling and dated
- **One serif accent is legal.** Wrap a single word or short phrase that is already in the headline in `<em>` and set that to a restrained italic serif. Never a Playfair/Didot headline. Never two accents. Never rewrite the H1 to create a prettier word — the words stay (`seo-master`)
- Tighten tracking as size grows (`-0.02em` to `-0.03em` on display); heavy weights are allowed large
- One display face + one text face. A third face is a defect. The accent serif is not a third face if it is used only on that `<em>`
- Nothing under 400 weight in UI
- Section labels: small uppercase with letter-spacing (`0.7rem, 600 weight, 0.25em tracking`)

### 4. Generous Whitespace
- Section padding: `6rem 0` desktop, `4rem 0` mobile
- Don't pack sections tight — breathing room = premium feel
- Max-width containers (1200px) with 2rem horizontal padding
- Space between section header and content: `3rem`

### 5. Social Proof Sections (mandatory on every client site)
Every homepage MUST include at least 3 of these:
- **Scrolling partner/client logos** — light bg, grayscale, subtle opacity
- **Comparison table** — us vs. alternatives with check/X marks (this is the killer)
- **Testimonial card** — star rating, quote, name/title, centered on light bg
- **FAQ accordion** — native `<details>` element, clean +/- toggle, no JS needed
- **"How to Start" process cards** — 3 steps max, rounded cards with step numbers

### 6. Comparison Table Standard
- Grid layout: label column + 2-3 attribute columns
- Green check circles for strengths, gray X circles for weaknesses
- Highlight the client's row with subtle accent background
- Compare against 3 real alternatives in their industry
- This section alone answers more buying objections than paragraphs of copy

### 7. Contact Form on Homepage
- Don't make people navigate to convert
- Full-bleed background image (blurred slightly) behind a floating white card
- Card: rounded corners (1.5rem), generous padding, drop shadow
- Fields: name, company, email, project details textarea
- Full-width CTA button

### 8. Project/Work Showcase
- Clean white cards with images (16:10 aspect ratio)
- Subtle hover: translateY(-4px) + shadow increase + slight image scale
- Grid layout: 3-up desktop, single column mobile

### 9. Imagery Over Icon Boxes (hard rule)
**Banned:** the 3-up/4-up grid of small-icon-in-a-box tiles with a title and two lines of copy. It is the default-template look and it communicates nothing.

Replace it with, in order of preference:
1. **Real photography** — the work, the crew, the storefront, the product in hand
2. **Collage / overlap** — two or three photos breaking their bounds, one caption
3. **Stat bands** — big numbers with a quiet label, full width, no boxes
4. **Before/after or comparison** — visual proof beats a claimed benefit

Villains must be **concrete**, never an abstract icon: name the actual bad outcome, don't draw a warning triangle. If an icon appears at all it is 16–24px, never scaled up, wrapped in a colored shape.

This overrides the "Benefits — checkmark icons" pattern below: benefits ship as a photo/stat treatment or an inline checklist, not as a tile grid.

### 10. One grammar across the site

A homepage with hierarchy and interiors that are six copies of eyebrow / headline / paragraph is unfinished. Interiors carry the **same grammar at a lighter weight**, in one shared `.page-head` (or equivalent):

1. **Kicker** — small, tracked, often dotted mono. Names the room ("Utah · high desert", "Editorial standard").
2. **Display headline** — same family and scale law as the homepage, not a smaller leftover.
3. **One serif accent** — an `<em>` around a phrase that was already there.
4. **Hairline meta row** — only when something true belongs in it. Do not invent a row. If the strongest true line on the page is currently a sentence in paragraph two, **it leads**.

Do not restyle each interior as a one-off. Do not leave the homepage as the only designed page.

---

## Mobile (first-class, not a media query)

Half or more of client-site traffic is a phone. Design the phone pass, don't retrofit it.

### Structure
- 768px breakpoint mandatory; 3-up grids collapse to **single column**, never a 2-up squeeze
- Hero passes the grunt test at 390px: headline legible + one CTA visible without scrolling
- Section padding `4rem 0`; type reflows through the existing `clamp()` — never hand-write a second type scale
- Wide content (tables, code, wide cards) scrolls inside its own container; the page body never scrolls horizontally
- **Bottom nav / sticky bottom CTA bar is mobile-only.** Desktop keeps top header nav. Never ship a bottom dock at a desktop viewport

### Touch
- Tap targets ≥ 44px, ≥ 8px apart
- Primary CTAs in the lower ~60% of the screen (thumb zone)
- Any hover-only affordance (tooltip, hover-reveal caption, hover menu) needs a tap equivalent or gets cut

### Weight
- No autoplay video, large GIFs, or third-party embeds above the fold
- Images: WebP + `srcset` + explicit width/height so nothing jumps

### Auditing mobile
Measure **reachability, not layout**. Tap-target audits must exclude off-canvas drawers, closed mobile menus, collapsed `<details>`, and anything hidden at that viewport — counting hidden nodes produces fake failures and masks the real ones.

---

## Section Order (Homepage Template)

1. **Hero** — full-bleed image, big headline, subtitle
2. **Partners/Logos** — scrolling marquee on light bg
3. **Who We Serve** — bold headline + 3 category descriptions
4. **Project Showcase** — image cards grid
5. **Testimonials** — "What our clients say"
6. **Benefits** — photo/stat treatment or inline checklist (see §9 — **not** an icon-tile grid)
7. **How to Start** — 3-step process cards
8. **Comparison Table** — us vs. alternatives
9. **FAQ** — accordion with 5-6 questions
10. **Contact Form** — background image + floating card

Not every site needs all 10. But every site needs Hero + Partners + Showcase + Comparison + FAQ + Contact minimum.

---

## CSS Architecture

- Scope homepage styles with `.home-` prefix
- Homepage and interiors share a page-head grammar (see §10). Body styles may stay separate so a homepage pass does not break article rhythm
- Use CSS custom properties for brand colors
- Mobile-first isn't required but responsive breakpoint at 768px is mandatory
- Native HTML elements over JS where possible (`<details>` for FAQ, CSS `@keyframes` for scrolling logos)

---

## Color Strategy

Each client gets their own brand palette, but the STRUCTURE is always:
- `--color-primary-dark` — nav, footer, headings (dark tone)
- `--color-accent` — CTAs, highlights, step numbers (brand pop color)
- `--color-light` — section backgrounds (#f5f5f0 or similar warm neutral)
- `--color-white` — cards, form backgrounds
- Body text: #333-#555 range, never pure black

---

## What This Replaces

The old "Falling Waters" dark-heavy template is retired for new builds. Existing client sites should be migrated to v3 editorial style during their next update cycle.

---

*This standard applies to all new GullStack client sites effective immediately.*
