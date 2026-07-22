---
name: app-design
description: Product UI/UX principles for GullStack apps (Cinch, platos-pos, onrecord-pro, dashboards, owner/member mobile) — hero-metric screens, progressive disclosure via bottom sheets, a single repeated card grammar, context-reactive theming, ambient data encoding, honest gating, and physical motion. Use when designing or building any app screen, dashboard, or product UI (NOT marketing sites — those use design-standard-v3).
---

# Skill: GullStack App Design

How GullStack product apps should look and behave. This is the app-product counterpart
to `design-standard-v3.md` (which governs marketing sites) and complements the Brain's
`protocol/ux-ui-uplevel.md`. When the Brain and this file disagree, the Brain wins.

Distilled from two award-winning consumer apps studied 2026-07: a tides/fishing data app
(hero metrics, multi-domain color, charts) and a day-planner (timeline metaphor, a single
brand accent, shared-element transitions). **Learn the principles; do not clone either
look.** Their skins are themed for anglers and personal productivity — our apps are retail,
workforce, and title/escrow tools. The interaction grammar transfers; the skin does not.
Copying another app's visual identity is both wrong and a copyright problem.

---

## North star — the three questions (this outranks everything below)

Before type ramps, tokens, or copy: a user on any screen must answer, without thinking,
**"Where am I? What here is tappable? What will happen when I tap it?"** An app can be
pixel-perfect on every page and still lose the user, because being-found lives in the
*connective tissue between screens*, not inside any one screen. This is the axis award-
winning apps win and most business apps fail. It is the first test; page polish is necessary
but never sufficient.

- **Where am I → orientation.** ONE navigation model per role (tabs as altitudes on one
  dataset), always visible, always answering "what layer am I on." Many different nav chromes
  across one app — multiple sidebars, palettes, swipe-navs, action bars — are the single
  biggest source of "lost." Converge on one shell.
- **What's tappable → affordance.** Reserve the accent for interactive things. When only
  tappable elements wear the accent, the color itself teaches where to act. Do not spend the
  action-accent on decoration, status, and branding at the same time.
- **What happens when I tap → feedback & continuity.** The tapped thing should visibly
  become the next screen (shared-element transition), and the way back should retrace the way
  in. A hard cut between routes is a teleport, and teleports are how users get lost.

> **Anti-pattern learned from cinch (2026-07, from the builder: "I get lost in cinch and I
> built it"):** a doctrine that optimizes copy simplicity and token convergence — the *page* —
> while leaving five different navigation models, an accent spent on branding rather than
> affordance, and hard route cuts, produces polished screens and a lost user. Measure the
> *journey*, not just the page. Wayfinding, affordance, and continuity are P0; type/spacing/
> color convergence is P1.

---

## The principles

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

6. **Color is systematic and meaningful, never decorative.** There are two disciplined
   strategies — pick one per app, deliberately, and hold the line:
   - **One accent per domain** (the tides app): gradient + accent shift by data domain
     (blue tide, warm orange temperature, teal wind, purple moon) so you know what you're
     looking at before reading the label. Use for apps with several parallel data types —
     e.g. Store vs Workforce vs Money in platos-pos.
   - **One brand accent, everything else neutral** (the day-planner): near-black canvas,
     white type, a single signature accent (a warm coral) used *only* for interactive and
     brand elements, plus one quiet secondary (a calm blue) reserved for a special state
     (end-of-day "Wind Down"). The restraint is the point: when only tappable things wear
     the accent, the accent itself teaches the user where to act.
   Either way: color means something. Never recolor for looks alone, and never let a
   decorative gradient compete with the accent that signals action.

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

### Transitions — make navigation self-explanatory

14. **Shared-element transitions: the thing you tapped becomes the next screen.** In the
    day-planner, tapping a task makes its colored pill — same accent, same icon, same
    title — *grow continuously* out of its row in the timeline into the header of the
    detail sheet. The object is never lost; the user always knows what they opened and
    where it came from. Build drill-downs so the tapped card visibly expands into the
    destination (and collapses back on dismiss). This is the single highest-leverage
    "makes it obvious" move — prefer it over a cut or a generic slide whenever a detail
    view has a clear parent element.

15. **Color confirms the destination.** As the sheet expands, its top floods with the
    tapped item's accent, then settles into neutral detail below. The color flash is a
    receipt: "yes, this is the item you touched." Use the source element's color to brand
    the transition and the destination header.

16. **Transitions are directional and reversible.** Open grows from the source and pushes
    forward; dismiss shrinks back to exactly where it came from. Never open with one motion
    and close with an unrelated one — the return path should retrace the entry so the
    mental model stays intact.

### Structure

17. **Give the screen one organizing axis.** The day-planner hangs everything off a single
    vertical time spine with a fixed ruler down the left edge (9:10, 9:15, 1:00 …) and
    day-defining bookends (a "Rise and Shine" at the top, a "Wind Down" at the bottom).
    One dominant axis — time, pipeline stage, location — that every item aligns to beats a
    loose grid of cards. Find the app's natural spine and commit to it.

18. **Negative space is content — design the gaps.** Empty time between tasks is rendered
    and labeled, even motivating: "12h 40m to pursue passion," "15h 59m of potential." An
    unscheduled stretch isn't blank; it's a designed, inviting slot with an inline
    "Add Task." Wherever our apps have gaps (an open shift, an empty buy-counter hour, a
    quiet pipeline stage), show the gap as a real, labeled, actionable space — never a void.

19. **Teach inside the product's own metaphor.** Onboarding steps ("Add Your First Task,"
    "Fill Your Inbox," "Make It Your Own") appear *as real timeline tasks with 0/5
    checklists*, not as a separate tour or modal. First-run guidance should live inside the
    app's primary structure so learning the app and using the app are the same motion.

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
- [ ] Drill-down uses a shared-element transition: the tapped card grows into the detail header and collapses back on dismiss
- [ ] The source element's accent brands the transition and destination header
- [ ] Open and close retrace the same path (directional + reversible)
- [ ] The screen has ONE organizing axis (time / stage / location) everything aligns to
- [ ] Gaps and empty stretches are rendered as labeled, actionable space — never a void
- [ ] First-run guidance lives inside the app's own metaphor, not a separate tour
```

## What this skill is NOT

- **Not for marketing sites** — those follow `design-standard-v3.md` (Editorial Light).
- **Not a license to clone** the reference app's blue/tide theme, its exact iconography,
  or its layout pixel-for-pixel. Theme each product to itself.
- **Not a replacement** for the Brain's `protocol/ux-ui-uplevel.md` product doctrine
  (correct vertical chrome, no false all-clear, owner-mobile job list). This skill is the
  visual/interaction layer; the Brain governs product correctness.
