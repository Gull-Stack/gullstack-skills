# GullStack Design Standard v3 — "Editorial Light"

*Established: March 2026. Based on the Monterey Bay Door v3 rebuild.*
*Reference site: unikorns.work*

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
- Text sits at the bottom of the hero with generous padding

### 3. Big, Confident Typography
- H1 headlines: `clamp(2rem, 5vw, 3.5rem)` minimum
- Hero headlines: `clamp(2.25rem, 5.5vw, 3.75rem)`
- Don't play it safe with 1.5rem headings — say it big
- Inter font family (or similar clean sans-serif)
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

---

## Section Order (Homepage Template)

1. **Hero** — full-bleed image, big headline, subtitle
2. **Partners/Logos** — scrolling marquee on light bg
3. **Who We Serve** — bold headline + 3 category descriptions
4. **Project Showcase** — image cards grid
5. **Testimonials** — "What our clients say"
6. **Benefits** — checkmark icons with title + description
7. **How to Start** — 3-step process cards
8. **Comparison Table** — us vs. alternatives
9. **FAQ** — accordion with 5-6 questions
10. **Contact Form** — background image + floating card

Not every site needs all 10. But every site needs Hero + Partners + Showcase + Comparison + FAQ + Contact minimum.

---

## CSS Architecture

- Scope homepage styles with `.home-` prefix
- Keep inner page styles separate (don't break them when updating homepage)
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
