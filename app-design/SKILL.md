---
name: app-design
description: Product UI/UX principles for GullStack apps (Cinch, platos-pos, onrecord-pro, dashboards, owner/member mobile) — hero-metric screens, progressive disclosure via bottom sheets, a single repeated card grammar, context-reactive theming, ambient data encoding, honest gating, and physical motion. Use when designing or building any app screen, dashboard, or product UI (NOT marketing sites — those use design-standard-v3).
---

# Skill: GullStack App Design

How GullStack product apps should look and behave. This is the app-product counterpart
to `design-standard-v3.md` (which governs marketing sites) and complements the Brain's
`protocol/ux-ui-uplevel.md`. When the Brain and this file disagree, the Brain wins.

Distilled from an award-winning consumer data app (a tides/fishing app studied 2026-07).
**Learn the principles; do not clone the look.** The reference app is blue-water themed
for anglers — our apps are retail, workforce, and title/escrow tools. The interaction
grammar transfers; the skin does not. Copying another app's visual identity is both wrong
and a copyright problem.

---

## The 13 principles

### Information architecture

1. **One hero metric per screen, and the "so what" underneath it.** The reference app
   opens with `0.7′ · Falling Tide · Low in 1 hr 54 min` — the number, its state, and
   what it means for you, in that order, before anything else. Every GullStack app screen
   leads with the one number the user came for (today's sales, hours scheduled, orders
   awaiting action), stated huge, with a plain-English consequence line under it. Never
   open with a grid of equal-weight tiles.

2. **Progressive disclosure through bottom sheets.** Tap a metric → a draggable sheet
   rises with the detail (day selector, chart, secondary stats) → dismiss to return.
   Detail is pulled on demand, never dumped on the first screen. Use sheets for drill-down;
   reserve full navigations for genuinely separate destinations.

3. **A persistent bottom tab bar of 3–5 clear destinations, each a different altitude on
   the same data.** The reference app's Today / Charts / Tables / Solunar are the same
   information at rising zoom levels (now → trends → raw table → context), not four
   unrelated features. Design tabs as altitudes, not as a junk drawer. Active tab is a
   filled pill; inactive are quiet line icons.

4. **One segmented range control that reframes everything.** A single pill row
   (`24H / 2D / 3D / 5D / 10D`) rescopes every chart on the screen at once, always in the
   same place. When users pick a time range, a status window, a location — give them one
   consistent control, don't scatter per-card selectors.

### The repeated grammar

5. **Every data card uses the identical structure.** Icon + small-caps label top-left,
   hero value + unit, secondary stat, mini visualization below — Air Temp, Wind Speed,
   Swell Height are byte-for-byte the same layout. Learn it once, read it everywhere.
   Define one card component and feed it data; a screen that invents a new card shape for
   each metric is a defect.

### Visual system

6. **Context-reactive theming — color carries meaning, not decoration.** The reference
   app shifts its gradient and accent by domain (blue tide, warm orange temperature, teal
   wind, purple moon) so you know what you're looking at before you read the label. Give
   each domain in our apps a consistent accent (e.g. Store vs Workforce vs Money in
   platos-pos) and use it everywhere that domain appears. Never recolor for looks alone.

7. **Big confident numerals, quiet secondary labels.** Strong type hierarchy: the value
   dominates, the unit and context recede. No timid 14px stat rows.

8. **Ambient encoding — put context into the chart chrome itself.** Sun/moon glyphs run
   across every time axis, so day vs night reads at a glance with no legend. Bake the
   ambient variable (business hours, shift boundaries, weekends, closed days) into the
   axis so the chart is legible without a key.

9. **Charts legible in one glance.** Smooth curves, a single highlighted "now" point,
   extremes labeled directly on the line (`10:36a · 0.3′`) instead of in a side legend.
   Fewer gridlines, larger labels, the one point that matters emphasized.

10. **One emoji-free line-icon set.** Consistent stroke weight, no emoji anywhere
    (matches the org-wide rule). Icons are wayfinding, not decoration.

### States and honesty

11. **Gate in place, honestly.** Locked features show exactly where the value would sit,
    inline, with one clear `Pro Required` / `Learn More` — the reference app renders the
    real locked chart card, not a nag wall. For our apps: show the empty/locked/permission
    state where the real thing lives, with a single honest next step. Never a full-screen
    interstitial that hides what's behind it.

12. **Design every state.** Empty, loading, locked, and error are first-class. The
    reference app's empty swell chart still draws its axis and zero-line. An "empty" screen
    that shows nothing is unfinished — show the frame and the path to fill it. (Ties to the
    Brain's false-all-clear rule: an empty ops path must still signal health.)

### Motion

13. **Physical, interruptible motion.** Sheets track the finger and settle with spring
    physics; they are draggable and dismissable mid-flight. Prefer direct manipulation and
    spring transitions over linear fades. Motion should feel like moving an object, not
    playing an animation.

---

## How to apply (checklist before shipping an app screen)

```
- [ ] Screen leads with ONE hero metric + a plain-English consequence line
- [ ] Drill-down is a bottom sheet, not a new page dump
- [ ] Tabs are altitudes on one dataset (3-5), active = filled pill
- [ ] One shared range/scope control, consistently placed
- [ ] All data cards share one component (icon + label + hero + mini-viz)
- [ ] Each domain has ONE consistent accent; color means something
- [ ] Charts: smooth, one "now" point, extremes labeled on the line, ambient context in the axis
- [ ] No emoji; one line-icon set, consistent stroke
- [ ] Empty / loading / locked / error states are all designed
- [ ] Gating (if any) is inline and honest, never a wall hiding the value
- [ ] Transitions are spring-based; sheets are draggable and interruptible
```

## What this skill is NOT

- **Not for marketing sites** — those follow `design-standard-v3.md` (Editorial Light).
- **Not a license to clone** the reference app's blue/tide theme, its exact iconography,
  or its layout pixel-for-pixel. Theme each product to itself.
- **Not a replacement** for the Brain's `protocol/ux-ui-uplevel.md` product doctrine
  (correct vertical chrome, no false all-clear, owner-mobile job list). This skill is the
  visual/interaction layer; the Brain governs product correctness.
