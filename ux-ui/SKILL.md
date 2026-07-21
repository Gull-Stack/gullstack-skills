# Skill: GullStack UX/UI

Make and review interface decisions on GullStack sites — layout, typography, buttons, CTAs, forms, mobile — to the Editorial Light standard. This skill is the decision layer; the canonical specs live in the playbooks and are linked, not duplicated (duplicates drift — bryce-method Part 2, rule 7).

Use when: designing or restyling any page or section, choosing typography/colors/shadows, writing or placing CTAs, building forms, or running a UX review on an existing page.

Canonical sources (resolve against `$GULLSTACK_HOME`, or the agent's `playbooks/` copy; if a file is missing, say so and continue with the rules below — do not halt):

- `design-standard-v3.md` — Editorial Light layout/typography/section spec
- `website-conversion.md` — conversion + visual-design rules and sources
- `storybrand.md` — SB7 messaging
- `bryce-method.md` — shipped-work lessons and hard gates

---

## The one formula

```
Conversion Rate = Desire − (Labor + Confusion)
```

Every UX decision must increase desire or decrease friction. If a proposed element does neither, cut it.

## Layout decisions (Editorial Light v3)

- 80% light backgrounds (`#f5f5f0`/white); dark only for nav + footer. No dark-heavy SaaS look — Falling Waters is retired.
- Full-bleed hero image, no heavy overlay (bottom gradient ≤ 20–30% opacity). The image IS the design.
- Big type: hero `clamp(2.25rem, 5.5vw, 3.75rem)`, H1 ≥ `clamp(2rem, 5vw, 3.5rem)`. Don't play it safe at 1.5rem.
- Whitespace: section padding `6rem 0` desktop / `4rem 0` mobile, 1200px max-width containers.
- Homepage section order and the required-minimum six sections: see `design-standard-v3.md`. The comparison table is the killer section — it answers objections visually.
- No emojis on websites. SVG icons or nothing.

## Hierarchy, buttons, and polish

- Typography hierarchy by **color + weight**, not size: dark (never pure black) → grey → light grey. No font weights under 400 in UI.
- Button hierarchy: primary = solid high-contrast (one per view), secondary = outline/low-contrast, tertiary = link. Red only when destruction is the primary action.
- Shadows: consistent light source, layered (3–5 stacked), color matched to the background — never flat grey on a colored section.
- Before adding a border, try (in order): box shadow, background-color change, more spacing. Borders are overused.
- Small icons (16–24px) never get scaled up; wrap them in a colored shape instead.

## Copy on the interface

- Headline litmus test: reading ONLY the H1, does a visitor know exactly what's sold? Specific beats slogan ("Groceries delivered in 1 hour", never "Supercharge your workflow!").
- CTA text continues the promise ("Get my free quote", "Find food") — never "Submit" or "Learn more".
- Customer is the hero, brand is the guide. Kill corporate fluff on sight ("committed to excellence").
- Nav: 2–4 links + one visually dominant CTA. Fewer links, less analysis paralysis.

## Forms and CTAs — hard gates (from shipped-work audit)

- **Every CTA must resolve.** No `href="#"`, no empty `tel:`, no form without a wired action. Click every one before calling anything done.
- Contact form on the homepage — floating white card over a blurred full-bleed image; don't make people navigate to convert.
- A form without a working backend (SendGrid handler, honeypot + timing trap) is a defect, not a placeholder.
- Real photos > stock > none. Never launch with stock in the hero; label placeholders `[REAL PHOTO: ...]`.

## Mobile

- Tap targets ≥ 44px; test thumb reach on CTAs.
- Responsive breakpoint at 768px is mandatory; 3-up grids collapse to single column.
- Strip anything (video/GIF) that slows mobile load. Nobody waits.

## UX review pass (run on any existing page)

Work top to bottom; report findings as file/section + rule violated + smallest fix:

1. **Grunt test** — 5 seconds on the hero: what do they sell? If unclear, the page fails regardless of everything else.
2. **Hierarchy scan** — is emphasis carried by color/weight? Is there exactly one primary button per view?
3. **CTA audit** — click every CTA and link; each must resolve and each label must state the next step.
4. **Friction hunt** — anything that adds labor (long forms, extra navigation to convert) or confusion (vague copy, competing emphasis)?
5. **Mobile check** — 768px breakpoint, tap sizes, load weight.
6. **Six feedback questions** (conversion, interest, clarity, expansion, brevity, disbelief) — full wording in `website-conversion.md`; use them verbatim when asking humans for review.

## Scope note

This skill covers marketing/client sites — the shipped GullStack standard. Product-app UX doctrine (`protocol/ux-ui-uplevel.md`) lives in the private brain repo (`StrongestAvengerStack/gullstack-brain`); if you are doing product UI work and have access to it, read it first. Do not halt if you can't reach it — note the gap and proceed with this skill.
