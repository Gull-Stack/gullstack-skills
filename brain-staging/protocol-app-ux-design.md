# [STAGED FOR BRAIN] protocol/app-ux-design.md

> **This file is destined for `StrongestAvengerStack/gullstack-brain` at
> `protocol/app-ux-design.md`.** It is staged here because the skills-repo session
> that wrote it could not reach the brain (different GitHub org). To land it: copy this
> file's body (everything below the divider) into the brain at that path, commit, and then
> slim `gullstack-skills/app-design/SKILL.md` to a pointer to it (per the link-don't-copy
> rule). Until then, the app-design skill carries the full content standalone.

---

# App UX & Visual Design Doctrine

The product-UI counterpart to `protocol/ux-ui-uplevel.md`. Where `ux-ui-uplevel.md` governs
product *correctness* (right vertical chrome, no false all-clear, owner-mobile job lists),
this file governs the *visual and interaction language* of every GullStack app (Cinch,
platos-pos, onrecord-pro, dashboards, owner/member mobile). Marketing sites are out of
scope — they follow `gullstack-skills/design-standard-v3.md` (Editorial Light).

Distilled 2026-07 from two award-winning consumer apps: a tides/fishing data app and a
day-planner. **Learn the principles; never clone a reference app's skin.** Their looks are
themed for anglers and personal productivity; ours are retail, workforce, and title tools.
The grammar transfers, the identity does not — and cloning another app's visual identity is
a copyright problem.

## North star — the three questions (P0, above everything else)

On any screen the user must answer without thinking: **Where am I? What here is tappable?
What happens when I tap it?** An app can be pixel-polished on every page and still lose the
user — being-found lives in the connective tissue between screens. Measure the *journey*,
not the page.

- **Where am I → orientation:** ONE nav model per role (tabs as altitudes), always visible.
  Many nav chromes in one app (multiple sidebars, palettes, swipe-navs, action bars) is the
  top source of "lost." Converge on one shell.
- **What's tappable → affordance:** reserve the accent for interactive elements; the accent
  itself then teaches where to act. Don't spend it on decoration + status + branding at once.
- **What happens → feedback & continuity:** the tapped thing becomes the next screen
  (shared-element transition); the way back retraces the way in. Hard route cuts are teleports.

**Anti-pattern (cinch, 2026-07 — from the builder: "I get lost in cinch and I built it"):**
optimizing copy simplicity + token convergence while leaving five nav models, accent spent on
branding, and hard route cuts = polished pages, lost user. Wayfinding/affordance/continuity
are P0; type/spacing/color convergence is P1. Argus and `ux-ui-uplevel.md` should test the
journey (can a first-time user, mid-flow, answer the three questions?), not only the page.

## Information architecture

1. **One hero metric per screen + the plain-English "so what" under it.** Lead with the
   single number the user came for (today's sales, hours scheduled, orders awaiting
   action), stated large, with a consequence line beneath. Never open with a grid of
   equal-weight tiles.
2. **Progressive disclosure via draggable bottom sheets.** Tap a metric → a sheet rises
   with the detail → dismiss to return. Detail on demand; full navigations only for
   genuinely separate destinations.
3. **A bottom tab bar of 3–5 destinations, each a different altitude on the same data**
   (now → trends → raw table → context), not a junk drawer. Active tab is a filled pill.
4. **One segmented scope control that reframes everything** (time range, status window,
   location), always in the same place.

## The repeated grammar

5. **Every data card is one shared component**: icon + small-caps label, hero value + unit,
   secondary stat, mini-visualization. Learn it once, read it everywhere. A new card shape
   per metric is a defect.

## Color

6. **Color is systematic and meaningful, never decorative.** Choose one strategy per app
   and hold it:
   - *One accent per domain* (tides app): accent/gradient shift by data domain so the user
     knows what they're looking at pre-label. For apps with parallel data types
     (Store / Workforce / Money in platos-pos).
   - *One brand accent, else neutral* (day-planner): near-black canvas, white type, a single
     signature accent used ONLY on interactive/brand elements, plus one quiet secondary
     reserved for a special state. The restraint teaches where to act.
   Never recolor for looks; never let a decorative gradient compete with the action accent.

## Visual system

7. **Big confident numerals, quiet secondary labels.** Strong hierarchy; the value dominates.
8. **Ambient encoding — context in the chart chrome.** The tides app runs sun/moon glyphs
   across every time axis so day/night reads with no legend. Bake the ambient variable
   (business hours, shift boundaries, weekends, closed days) into the axis itself.
9. **Charts legible in one glance**: smooth curves, one highlighted "now" point, extremes
   labeled directly on the line, minimal gridlines.
10. **One emoji-free line-icon set**, consistent stroke. (Org-wide no-emoji rule.)

## States & honesty

11. **Gate in place, honestly.** Locked features render where the value would sit, inline,
    with one clear next step — never a full-screen wall hiding what's behind it.
12. **Design every state**: empty, loading, locked, error are first-class. An empty ops
    path must still signal health (ties to the false-all-clear rule).

## Motion & transitions (make navigation self-explanatory)

13. **Physical, interruptible motion.** Sheets track the finger and settle with spring
    physics; draggable and dismissable mid-flight. Direct manipulation over linear fades.
14. **Shared-element transitions: the thing you tapped becomes the next screen.** The
    day-planner grows a task's colored pill — same accent, icon, title — out of its row
    into the detail-sheet header, so the object is never lost. Build drill-downs so the
    tapped card visibly expands into the destination and collapses back on dismiss. Highest-
    leverage "makes it obvious" move; prefer it over a cut or generic slide.
15. **Color confirms the destination.** The destination header adopts the source element's
    accent as it opens — a visual receipt that this is the item you touched.
16. **Directional and reversible.** Open grows from the source and pushes forward; dismiss
    retraces exactly back. Entry and return paths must mirror.

## Structure

17. **One organizing axis per screen** — a time spine, pipeline stage, or location that
    every item aligns to, with a fixed ruler and defining bookends (the day-planner's
    "Rise and Shine" / "Wind Down"). Beats a loose grid.
18. **Negative space is content — design the gaps.** Render empty stretches as labeled,
    actionable space (the day-planner's "12h 40m to pursue passion" with an inline Add).
    Open shifts, quiet buy-counter hours, idle pipeline stages get a real slot, never a void.
19. **Teach inside the product's own metaphor.** First-run guidance appears as real objects
    in the primary structure (onboarding steps rendered as timeline tasks), not a separate
    tour.

## Enforcement

Argus should treat material app-UI PRs against this doctrine (new rule family, or an
extension of H). A screen that opens with an undifferentiated tile grid, invents a per-metric
card shape, recolors decoratively, ships an undesigned empty/locked state, or uses a generic
cut where a shared-element transition has an obvious parent — is REQUEST CHANGES.
