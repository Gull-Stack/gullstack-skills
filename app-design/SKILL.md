---
name: app-design
description: Product UI/UX for GullStack apps (Cinch web admin + HQ + register + member/employee phone) — wayfinding shells for desktop AND mobile (rail + main + inspector, responsive collapse), five page species (money home, workroom, compose, conversation/agent, inbox), hero metrics, progressive disclosure, one card/list grammar, ocean/action color law and light+dark theming, keyboard and bulk-selection affordances. Use when designing, building, or reviewing any product UI (NOT marketing sites — those use design-standard-v3 / site-builder).
---

# Skill: GullStack App Design

> **Canon:** GullStack brain `protocol/app-ux-design.md` when present; else this skill.  
> **Evidence:** Mobbin Pro study 2026-08-07 (**mobile + web**) + top-rated web pass
> 2026-08-08 (`mobbin.com/discover/apps/web/top`).  
> (`cinch-app/docs/mobbin-study/`, `GULLSTACK-APP-DESIGN-STANDARD-2026-08-07.md`).  
> Sync to: `~/.claude/skills/app-design/SKILL.md`, `gullstack-skills/app-design/SKILL.md`,
> `gullstack-skills/.claude/skills/app-design/SKILL.md`.

How GullStack **product apps** look and behave. Counterpart to marketing
`design-standard-v3` / site-builder. Complements `protocol/ux-ui-uplevel` and
Cinch `design-mastery` (numeric craft). When sources conflict: **wayfinding >
tokens > skin**.

**Learn grammar; never clone brand skins** (no Monzo coral, no Linear logo,
no Shopify illustration packs).

---

## Escalation routes — this skill does NOT cover these, go get them

This skill covers grammar, wayfinding and behaviour. It is **not** self-sufficient.
Three questions have to leave it, and "`ui-ux-pro-max` is fallback only" does **not**
apply here — these routes are mandatory, not a fallback:

| Question | Go to | Trigger |
|----------|-------|---------|
| Contrast ratio · focus rings · tab order · ARIA · screen readers | **`ui-ux-pro-max`** § Accessibility | ⛔ before shipping ANY product screen |
| Chart type · series colors · axis · legend · stat tile · sparkline | **`dataviz`** | ⛔ before writing the first line of chart code |
| React/Next/shadcn implementation idioms | `ui-ux-pro-max` § Stacks · `vercel:shadcn` | while building |

§F's hue budget governs **chrome**. It does **not** govern data series — a 7-series
comparison chart is not a 7-hue brand violation. `dataviz` owns the series palette and
outranks §F inside the plot area.

---

## North star — three questions (outranks everything below)

A user on any screen must answer without thinking:

1. **Where am I?** (scope + room)  
2. **What is tappable?** (accent = action only)  
3. **What happens if I tap?** (continuity; no teleports)

> **Cinch anti-pattern (2026-07, builder: “I get lost and I built it”):**  
> polished pages + five nav models + accent spent on branding + hard route cuts.  
> Measure the **journey**, not the page. Wayfinding is P0.

---

## Surface map (pick one shell per role — never mix mid-flow)

| Surface | Primary chrome | Evidence |
|---------|----------------|----------|
| **Owner web admin** | Left **rooms** sidebar + top **scope** + full-width main | Shopify Web, Linear Web |
| **Owner phone** | Top scope + bottom **3–5 rooms** + hero | Monzo, Starling, Shopify iOS |
| **HQ / workforce web** | One HQ shell (same rooms law as admin) | Jobber day spine |
| **Employee `/m`** | Phone column + bottom rooms | Chime / Monzo |
| **Member** | Phone consumer shell + bottom rooms | Chime simplicity |
| **Register / KDS** | Dark **ops** dialect (Toast-feel) — separate species | Toast teardown (not on Mobbin) |

Marketing sites → Editorial Light. Do not apply ocean admin chrome to marketing.

> **Dark is not the ops dialect.** Register/KDS is dark *because it is a separate
> species*, not because dark is reserved for it. Dark is a first-class product world:
> the #1-rated web app on Mobbin (Fey, 4.92) and Linear are both dark-first. Any
> surface may ship a dark theme — see §F0. What is banned is a surface that is dark
> *by accident*: an unthemed dark band sandwiched in white chrome.

---

## A. Shell law — Desktop web (P0 for Cinch admin)

Mobbin Web: **Shopify Admin** (781 screens), **Linear** (448), **Mercury** (479).

### A1. Four zones, four jobs

| Zone | Job | Do | Don’t |
|------|-----|----|-------|
| **Top bar** | **Scope** | Store/workspace name, ⌘K search, notifications, account | Primary room nav as a second row of tabs that fights the sidebar |
| **Left sidebar** | **Rooms** | 5–12 stable destinations, active = filled pill, Settings pin bottom | Different sidebar per page; rooms that vanish by route |
| **Main** | **Job** | Full width of remaining column; one page header; one spine | Centered `max-w-3xl` page that floats; double headers |
| **Right inspector** | **Configure what main is showing** | Optional 4th zone: the object’s metadata, or the controls that produce the view | A second nav; a place to hide primary actions |

The inspector is not optional trim — it is how every top-rated admin avoids burying
configuration in modals. Its law is §A1d.

**Shopify Web home (captured):** black top (logo · global search · bell · store) + light left nav (Home, Orders, Products, Customers, Content, Finances, Analytics, Marketing…) + main setup spine.  
**Linear Web (captured):** left nav (Inbox, My issues, Workspace/Projects/Views, Teams) + main content; workspace switcher at top of rail.

### A1b. Rail anatomy (Mobbin Web, 2026-08-07: Toggl Track, Twenty, LangChain, Mercor)

The rail is four stacked zones, top to bottom. This is how you exceed 12 rooms without a junk drawer:

```
[scope switcher]     workspace/store name + ▾ + collapse icon   (rail-top scope)
[grouped rooms]      TRACK · ANALYZE · MANAGE · ADMIN            (whispered small-caps group labels)
[nudge slot]         trial / plan / upgrade card                 (bottom of rail, never in main)
[identity]           avatar + account, Settings pinned           (bottom)
```

- **Group labels are whispered small-caps**, not rooms themselves. Toggl: `TRACK` (Overview, Timer) · `ANALYZE` (Reports, Approvals) · `MANAGE` (Projects, Clients, Members, Invoices…) · `ADMIN` (Subscription, Settings).
- **Scope may live at rail-top instead of the top bar** — both are legal; pick one per surface and never run both.
- **Icon-only rail** (Mercor: 5 icon+label rooms) is a legal narrow variant. Under ~5 rooms only.
- **Monetization/trial nudges belong at the bottom of the rail**, not inside the workroom.
- Active room = filled pill. Confirmed in every sampled admin.

### A1c. Teach in place — setup checklists are real components

LangSmith and Toggl both ship an in-product setup card, and both share the same grammar:

- Horizontal card row or banner **inside** the room, not a separate tour product
- A **completion counter** (`2/4`) or **progress bar** (`100%`)
- Completed steps carry a ✓ and stay visible — the list does not shrink as you go
- The whole thing is **dismissible** (✕), and does not return once dismissed

**Plus a permanent rail-bottom progress affordance** (Attio, Steep, 2026-08-08). The
dismissible card teaches the *current* step; the rail entry is the standing route back
to setup and it never disappears:

```
[rail bottom]  ⊕ Invite teammates
               ⏱ Help and first steps      4/6      ← counts down as you complete
               14 days left on trial   [Add billing]
```

Steep pins `Using demo data · Continue setup` in the rail for the entire demo-data
period. A tenant on seed/demo data must be told so **in the chrome**, not only on the
page that happens to show it.

### A1d. The right inspector (4th zone)

**Evidence 2026-08-08:** Steep, Attio, Plane — all three top-rated, all three run it.

The inspector answers *"what is this view made of, and how do I change it"*. It has
exactly two legal contents, and a room picks one:

| Kind | Holds | Evidence |
|------|-------|----------|
| **Object inspector** | the record’s metadata as labelled slot rows | Plane work item: Modules · Cycle · Parent · Labels. Todoist task rail. |
| **View builder** | the controls that produce what main renders | Attio report: Data source · Advanced filter · Metric · Grouped by · Segmented by · Visualization + toggles. Steep metric: Dimensions · Filter · Format · Time grains · Private · Cohorts · Slices. |

Rules:

- **It is collapsible and its state persists.** Every sampled app ships a panel toggle
  in the identity bar.
- **Change in the inspector re-renders main immediately** — no Apply button, no modal
  round-trip.
- **Empty slots still render** with a `+` (§N5 applies here first).
- **No primary action lives only in the inspector.** The commit button belongs to the
  toolbar or the page header.
- A room gets an inspector **or** a drawer (§P1), never both open at once.

### A1e. The shell has responsive states — the rail collapses, it does not vanish

Between "desktop rail" and "phone tabs" there are two more states, and they are
**states of the same shell**, not different designs:

```
≥1280   full rail (labels + groups)        + optional inspector
1024    icon rail (icons + tooltips)       inspector collapsed to a toggle
768     rail becomes an overlay drawer     inspector becomes a sheet
<768    phone shell — bottom rooms (§B)
```

- Plane runs a **two-level rail** (icon app-rail + labelled room rail) so the app-level
  switch survives the collapse. Legal and preferred when a role owns >12 rooms.
- The collapse toggle is a real control in the identity bar (Attio, Plane, Homerun) —
  not a hover-reveal.
- **Never** solve a narrow desktop by deleting rooms. Icon rail + tooltip, or drawer.

### A2. Web page header (every room)

One species only:

```
[optional back]
[breadcrumb / scope]  optional — the PATH to here, never a second name
[the NAME]            the room or object. always the one h1.
[subtitle]            metadata or the so-what. one quiet line.
[actions row]         primary right or under the name — never a second h1 band
```

#### A2a. The h1 rule — settled 2026-08-08 from the top-rated set

The long-running "is the h1 the eyebrow or the title?" argument was the wrong
question. It asks about a *slot*. Every top-rated web app answers about *semantics*:

> **The h1 is the NAME of the thing you are looking at. It equals the rail label.
> And it is never visually subordinate to another piece of text.**

**Evidence (Mobbin top-rated web, read 2026-08-08):**

| App | Header | Rail label |
|-----|--------|-----------|
| Homerun | `Product Manager` · sub: `Full-time / Part-time · Cali Office` | Product Manager ✓ |
| Steep (metric) | `User Conversion Rate` · sub: `Last 365 days` | User Conversion Rate ✓ |
| Steep (team) | breadcrumb `Teams / Product`, then the data | Product ✓ |
| Attio | `Tasks` | Tasks ✓ |
| Plane | breadcrumb `AS Mobbin Official › Work items` | Work items ✓ |

Three things hold in **all** of them:

1. **The line above the name, when present, is a breadcrumb — the path to here.**
   It is never a second copy of the name and never a slogan.
2. **The line below the name is metadata or the so-what** — `Full-time · Cali Office`,
   `Last 365 days`. Facts, not marketing.
3. **Nothing in the header outranks the name typographically** — except a **number**
   on a C1 money home, where the number *is* the display moment (Fey, Monzo, Steep).
   A number may outrank the name. **A sentence may not.**

So both header shapes are legal, and the choice is by species, not taste:

| Species | Shape | The h1 is |
|---------|-------|-----------|
| C1 money home | quiet name label · **huge number** · so-what | the quiet name label |
| C2/C3/C5 room or object | **name at display size** · metadata sub | the name |

⛔ **The banned shape** — and it is the one that survives audits because both halves
look fine alone: the name rendered as muted micro-type while a *different sentence*
takes the display size. "Live store numbers" over a whispered `REPORTS`,
"No customers yet" over a whispered `CUSTOMERS`, "Top spender — top 20% by lifetime
spend" over a whispered `Customers`. The h1 is semantically correct and visually
demoted; a reader's eye lands on a sentence that is not the name of the room. Move the
sentence to the subtitle and let the name take the display size — or, if the room is a
C1, let the **number** take it.

**Cinch:** `AdminHero` (title = h1) and `OceanPool` (eyebrow = h1) both satisfy A2a as
long as the slot carrying the h1 carries the **room name** and no sentence outranks it.
The component choice follows the species table above. See
`docs/ADMIN-PAGE-CHROME-LAW-2026-08-07.md` — whose §"eyebrow as h1 on one page, title
as h1 on next → FIXED" should be read as fixed *by this rule*, not by picking a winner.

#### A2b. Per-tenant vocabulary — both sides resolve from ONE function

§5 of the chrome law says *the h1 IS the sidebar label*. On a multi-vertical product
that only holds if the rail and the room read the **same resolver**, because the label
is not a constant — it is tenant vocabulary.

Evidence (Cinch #603, resort shape): `/admin/schedule`'s door has three names by venue
(Class schedule · the tenant's water word · Soak sessions) and Packs has three more
(Class packs · Session packs · Punch cards). Two rooms also both rendered `LODGING` —
the *group* name — so neither matched its door and the two were indistinguishable.

**Rule.** Where a room's label varies by tenant, vertical or module shape, it is
resolved by one exported function (Cinch: `src/lib/admin/room-labels.ts` —
`scheduleRoomLabel()`, `packsRoomLabel()`), and **both the rail and the room call it**.
A room may never hardcode its own name, and may never borrow its nav *group's* name.
Without this, every new vertical silently re-opens §A2a.

#### A2c. Numeric acceptance (AvengerCycle — acceptance is a NUMBER)

The rules above are only real as measurements. Stated for the Auditor to implement:

| ID | Assertion | Threshold |
|----|-----------|-----------|
| existing | rendered `<h1>` text == the rail label for that route | 0 violations |
| **W8_NAME_OUTRANKED** | within the **header band** (the h1's nearest sized ancestor — reuse W4's existing resolution, **not** all of `main`), no text node containing a non-digit character has a computed `font-size` greater than the h1's computed `font-size` | **0 violations** |
| **W8 exemption** | text matching `/^[\s$£€%+\-.,0-9]*$/` (pure number/currency) is exempt — a number MAY outrank the name on a C1 money home; a sentence may not | — |
| **A2b** | every per-tenant room label resolves through one exported function called by both rail and room | 0 hardcoded labels |
| **A2b-shapes** | W8 and the h1-matches-rail assertion run on **every tenant shape** (retail · member-business · resort), not one | 0 violations × 3 shapes |

⛔ **Run the h1 assertions across ALL tenant shapes.** The rail/room drift class is
*invisible on a single shape*. Live example (cinch-app #602, 2026-08-08): the packs
room chose its title with a **two-way** ternary (`classy ? "Class packs" : "Punch
cards"`) while the rail used the **three-way** `packsRoomLabel()`, which returns
"Session packs" when `resortShaped`. On retail and member-business the two agreed and
every check passed. On resort the h1 read "Punch cards" under a door reading "Session
packs" — a §5 violation *inside the PR that was adding the §5 rule*.

A grep cannot find this: both sides look correct in isolation, and the disagreement
only exists at the shape where the two functions diverge. **Only a rendered walk on
the differing shape catches it.**

⛔ Scope W8 to the header band. Asserting across all of `main` fails every C1 money
home, because the number legitimately outranks the name — which is invariant 3 itself.

### A3. Web density

- Main pad: consistent 24–32px (Cinch: match horizontal + `lg:pt-8`).  
- Lists/tables denser **below** the hero/KPI strip — not competing with it.  
- Forms may `max-w-2xl` **inside** main; the **shell and hero fill main**.  
- Tables: tabular-nums; row = hit target; hairlines before heavy shadows.

### A4. Web nav anti-patterns (instant fail)

- Unique header component invented per room  
- Centered phone column as the only desktop layout  
- Sidebar rooms + mobile dock + third palette all active for one role  
- Sidebar labels that don’t match the h1 of the destination  

---

## B. Shell law — Mobile / phone

Mobbin iOS: Monzo, Starling, Chime, Revolut Business, Shopify iOS, Jobber.

### B1. Two bars, two jobs

| Zone | Job |
|------|-----|
| **Top** | Scope (store/account) + 1–2 globals (search, add) |
| **Bottom** | **3–5 rooms** (altitudes), active filled/labeled |

### B2. Fold

At ~390×844: one display moment + ≤3 groups above the fold.  
44pt min targets; primary actions in lower ~60% when possible.

### B3. Drill-down

Prefer **sheet** / push with shared title over full-page dump.  
Sheets: springy, draggable, interruptible.

---

## C. Five page species (both web and mobile)

Every product screen is **exactly one** of these. Naming the species is mandatory before layout.
C1–C3 are the originals; C4–C5 were added 2026-08-08 because the top-rated web list
could not be described without them — roughly a third of it is AI-native, and every
multi-user product in it has an inbox.

### C1. Money / health home

**Job:** one number answers the visit.  
**Evidence:** Starling, Chime, Monzo, Revolut Business.

```
[quiet label]     Available · Today’s sales · Operating income
[huge number]     $ / £ / %
[so-what]         vs yesterday · unlock · period
[1–4 actions]     Open register · Add money · …
[list spine]      Activity / needs-you / pots — one row grammar
```

Never open with a grid of equal-weight tiles.

### C2. Merchant workroom (queues)

**Job:** process a queue (orders, leads, inbox, stock, tasks).  
**Evidence:** Shopify iOS Orders (captured).

```
[title]  [+ primary]
[search]
[Today | 7d | 30d]          one range rescopes KPIs + list
[KPI strip: 3 metrics]
[doors: All / Draft / …]
[work list: status pill · amount]
[rooms nav]
```

### C3. Compose / detail

**Job:** create or edit one object.  
**Evidence:** Linear issue compose.

- One focus field huge; body secondary  
- Metadata as chips (status, assignee, due)  
- Sticky primary action  
- Scope still visible  

### C4. Conversation / agent

**Job:** the user asks; the product answers **with real product objects**, not prose alone.  
**Evidence:** Origin (chat pane inside a financial admin), Sana AI, Manus, Firecrawl,
ElevenLabs, Replit, Intercom, Basedash — 2026-08-08 top-rated pass.

```
[thread rail]      history, newest first, each renamable + ⋯      (may be the room rail)
[transcript]       user turn right-aligned chip · answer full-width
[emitted artifact] a REAL product card, not a picture of one
[composer]         "Ask anything…" pinned bottom, seeded chips when blank (§P7)
```

Hard rules — these are what separate a product from a chat wrapper:

1. **The answer emits product objects.** Origin renders a live `Markets at a glance ·
   Dec 1 – Mar 2 2026` chart card mid-answer. A number inside an answer obeys §M4
   exactly like a number on a dashboard: **window + method**, no exceptions.
2. **Every claim carries its citation and timestamp** (§M4, Dovetail rule). An
   uncited generated claim is a defect, in chat as much as on a page.
3. **The model states what it could not do**, in place — Origin: *"Since you haven't
   completed your risk profile assessment yet, I can explain the concepts educationally
   without personalizing to your situation."* Never a silent downgrade.
4. **Streaming uses §G3**: chrome real, only the not-yet-generated words ghost.
5. **An agent that will act on real data confirms first**, using the §H1 dialog law —
   consequence in plain words, and whether it reverses.
6. **The chat is a room, not a takeover.** Scope stays visible; the user can leave and
   come back to the thread.

Cinch note: this is the species for any "ask your business a question" surface. Do not
build it as a C2 workroom with a text box bolted on.

### C5. Inbox / feed

**Job:** triage what happened while you were gone, in time order.  
**Evidence:** Linear Inbox, Plane Inbox + work-item Activity, Attio Notifications,
Campsite.

```
[title + unread count]
[doors]            All · Unread · Assigned to me · Mentions
[actor rows]       avatar · actor did X to Y · relative time
[read/unread state visible; bulk mark-read available (§N7)]
```

- **Time is the organizing axis** (§D2) — not status, not priority.
- A row states **who, what, which object, when**: *"samlee.mobbin+1 set the due date to
  Aug 25, 2025 · 1 minute ago"*.
- Row opens the object **in a drawer/pane** (§P1); the feed stays.
- ⛔ Do not force a feed into C2. A feed has no KPI strip and no range control — giving
  it one is the tell that the species was never named.

---

## D. Information architecture

1. **One hero (C1) or one queue (C2)** — not both competing.  
2. **One organizing axis** per screen (time, stage, location, severity).  
3. **One segmented range** that reframes the room (web + mobile).  
4. **Tabs/sidebar rooms are altitudes**, not junk drawers.  
5. **Progressive disclosure** — detail on demand (sheet/rail/expand), not first paint dumps.  
6. **Gaps are designed** — empty shifts, empty queues: frame + one next step.  
7. **Teach inside the product** — setup checklists as real cards (Shopify home setup guide), not a separate tour product.

### Day-ops spine (Jobber → workforce)

| Jobber | GullStack |
|--------|-----------|
| Home | Today / clock home |
| Today’s appointments | Schedule day |
| Business health | Reports strip |
| Activity feed | Inbox / audit |
| Timesheet | `/m` time |
| Invoice / quote | Financials / POS |
| Manage team | People |

---

## E. Repeated grammar

### List row (one component)

```
[icon/avatar]  Title                     amount / meta
               subtitle · status pill
```

Whole row tappable. Tabular nums on amounts.

### Data card (one component)

Icon + small-caps label · hero value · secondary · optional mini-viz.  
Inventing a new card shape per metric is a defect.

### KPI strip (workrooms)

3 equal metrics, same type ramp, under one range control.

---

## F. Visual system

### F0. Theme — every product surface is a pair, not a picture

Added 2026-08-08. Plane, Attio, Notion, Steep and Linear all ship light **and** dark;
Fey and Linear are dark-*first*. A surface designed in one theme and "darkened later"
is a defect, and the tell is always the same: a hardcoded hex that survives the swap.

- **Colors are defined once, as token pairs.** Never a raw hex in a component. The
  light values are the default on `:root`; the dark values are a redefinition of the
  *same token names* — nothing but tokens changes between themes.
- **Roles, not values.** `--surface` / `--surface-raised` / `--text` / `--text-muted` /
  `--hairline` / `--action` / `--status-*`. A token named `--ocean-800` cannot be
  themed; a token named `--surface` can.
- **Elevation inverts.** In light, raised = lighter + shadow. In dark, raised =
  *lighter surface*, and shadows mostly stop working — lean on §Elevation hairlines.
- **Both themes get the contrast check**, not just the one you designed in. Route to
  `ui-ux-pro-max` § Accessibility. Dark mode fails 4.5:1 on muted text constantly.
- **Status colors are re-picked per theme.** The light-mode rose/amber/green will be
  either invisible or radioactive on a dark surface.
- **Screenshot both** before calling any screen done (§N ship checklist).

Cinch: the ocean world is the light theme's world. A dark Cinch theme is legal and is
built as the token-pair dark half — not as a new palette, and not as the register's
ops dialect leaking upward.

#### F0b. The mechanism — and the trap that has already cost real money

The principle above is not enough on its own. Name the mechanism or it gets rebuilt
wrong:

```css
:root                                  { /* light: the complete palette, every token */ }
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"])      { /* dark: SAME token names, new values      */ }
}
:root[data-theme="dark"]               { /* explicit choice wins in both directions  */ }
```

Three states, not two: explicit light, explicit dark, and **system default — which
stamps nothing**. A rule written only inside a media query or only under `[data-theme]`
has no value in the third state. `body` gets an explicit token background; a transparent
body borrows whatever is behind it.

⛔ **The remap trap — Cinch has walked into this twice.** Under `.hq-light` / `.hq-root`,
translucent white **surfaces** (`bg-white/NN`) composite against the remapped ground and
come out a dark/gray tint, while **literal colors skip the remap entirely**. That is the
white-on-white mobile schedule. The rule that prevents it:

- **No literal color in a component — including alpha whites.** `bg-white/85` is a
  literal. Use a `--surface-raised` token that is defined per theme.
- **Re-measure contrast at every color swap.** A guessed teal was off by 1.9:1 until it
  was computed. Guessing contrast is not allowed; compute it.
- **Screenshot both themes on the real surface.** tsc + eslint + build all pass on
  white-on-white. A green build is not a look — see [[look-at-what-you-build]].

Detail and the full trap list: `project_veyo_tidal_web` § Traps. Contrast arithmetic:
`ui-ux-pro-max` § Accessibility (mandatory route, see § Escalation).

### Color

- **World:** fixed cool ocean for Cinch product chrome (not tenant brand as world).  
  Brand lives in `--action` on tappables only.  
- **Hue budget:** ≤3 chromatic hues; neutrals ≥90% of pixels. **Chrome only** — the
  budget stops at the edge of a plot area. A comparison chart needs as many series
  colors as it has series (Fey overlays 5; Attio's grouped bars run 11 + "+11 more").
  Series palettes are `dataviz`'s call, not §F's.
- **Accent = action** only. Status (rose/amber/green) never doubles as brand.  
- **No purple** in Cinch ocean world.
- **Emoji: banned as chrome, expected in content.** No emoji as an icon, a status
  glyph, a nav item, or a metric label — SVG or nothing. But emoji the *user* typed
  into a task title, a pot name, or a channel name render as typed and are never
  stripped (Plane ships "Welcome to Plane 👋" as seeded content; Monzo offers emoji
  chips when naming a pot). Seeded sample content may carry emoji; the frame may not.

### Type

| Role | Intent |
|------|--------|
| Hero money | ~34–48+, weight ≤600 |
| Page h1 | ~24–30, 600 |
| Section | ~15–17, 600 |
| Body / row | ~14–16 |
| Caption | ≥12, muted |

Labels whisper; values speak.

### Elevation

Hairlines before shadows. One elevation ladder.  
Cinch: deep ocean pool + pale shallows dual-plane cards (`OceanPool` / `OceanShell`).  
**Banned sandwich:** dark hero between white chrome that doesn’t participate in the world.

---

## G. States & honesty

Empty / loading / locked / error are first-class **and each has a shape**.
Evidence: Mobbin 2026-08-07 — 3,239 empty · 1,442 error · 3,955 loading iOS screens;
2,019 empty web screens.

### G1. Empty — teach the shape, name the next step

```
[quiet eyebrow]      optional — "Nothing here yet" / "No PR - Yet!"
[headline]           SAME type ramp as a populated screen, not smaller
[one sentence]       what will appear here AND when it will appear
[one primary action] exactly one
```

- **Ghost the future layout behind the message.** ElevenLabs greys the card grid, Toggl greys the chart columns. The user sees the shape they're about to fill.
- **A money hero keeps its number at zero.** MoonPay shows `$0.00` and *then* "Nothing to see here / Activity will show up here when you use MoonPay." Never hide the hero because it's empty.
- **Copy says when, not just what:** "Activity will show up here when you use MoonPay" ✓ · "No data" ✗.
- If the emptiness is a setup step, show progress (Cuvva: `Club setup 60% complete` above "Time to add some members").
- Never a bare "No results" with no route out.

### G2. Empty on web is **per-card**, not per-page ⚠️ (the one Cinch will get wrong)

Toggl's empty Admin Overview keeps the entire shell — sidebar, page header, filters,
`Set as default view` — and **every card keeps its own frame, its own title, its own
empty line, and its own button**:

| Card | Its own empty line | Its own action |
|------|--------------------|----------------|
| This week summary | "Your team has tracked 0 hours" | Track time · Invite teammates |
| Team activity | "You can't see bottlenecks if you're tracking alone" | Invite teammates |
| Top projects | "Create a project to start seeing insights." | Create a project |
| Time tracked | "Make sure your team links time to projects" | Set up required fields |

**An empty dashboard is still a dashboard.** It never collapses to one centered
"No data" splash. Twenty scopes empty to the *panel* ("No activity yet" inside the
Timeline pane while the record header stays real).

Blank inputs get **seeded suggestions**, never a blank stare — Emergent offers
example prompts as chips; Monzo offers name chips (Food shop · Eating out · Fun stuff).

### G3. Loading — the shell never skeletonizes

- **Chrome stays real.** Nav, tab bar, back button, page title, even the typed search
  term all render fully. Only *data* ghosts. (Quizlet keeps "Study"; Particle keeps
  "Good Afternoon".)
- **Skeletons are scale drawings** of the real layout — avatar circle + two text bars,
  with the second bar shorter so it reads as text, not as a progress bar.
- Low contrast always: a hair off the background, never a hard grey.
- **Partial/streaming work gets an inline row**, not a full-screen block — Wabi shows
  "Generating…" + spinner in one row while everything above is already real;
  ElevenLabs greys only the not-yet-generated *words*.
- Percentage inside the placeholder when the work is measurable (`84%`).

### G4. Error — three tiers, chosen by blast radius

| Tier | When | Shape |
|------|------|-------|
| **Inline field** | one field is invalid | field outlines in error color + one red line under it + **primary goes disabled** (a pale tint of the action color, not grey) |
| **Sheet / dialog** | one action failed, retryable | **parent screen stays visible behind it** · title names the failure · one line of plain cause · `Try Again` primary + `Finish later` / `Got it` tertiary |
| **Full page** | the service is down | glyph + "Sorry About the Wait" + plain cause + `Try Again` + `Not Now` |

- **Never destroy context to report an error.** PayPal and KOHO both keep the review
  screen and its amounts visible behind the error sheet.
- Two actions maximum: recover (primary) + defer (tertiary). A lone "OK" is a defect.
- When the user *cannot* self-recover, hand them a human — Oportun's "Couldn't find
  your account" ends in a real support address, not a shrug.
- **Red appears only on the error itself.** Confirms §F: status never doubles as brand.

### G5. Locked

Gate **in place** — show the locked card plus one next step. Never a false all-clear
on an empty ops path, and never a redirect that loses the room.

---

## H. Overlays, motion & continuity

### H1. Pick the overlay by job (Mobbin: 13,700 bottom sheets · 4,182 dialogs · 3,012 toasts)

| Overlay | Job | Must have |
|---------|-----|-----------|
| **Action sheet** | pick one of 2–4 *actions* on a known object | icon+label rows · a subtitle naming the object ("Alex Smith's note") · Cancel |
| **Bottom sheet** | one focused sub-job: pick a value, review, confirm, show status | grabber pill · a title that states the job · one primary |
| **Dialog** | a decision that must block | glyph/illustration · title as a question · the **consequence** in plain words · 2 actions (stacked if labels are long) |
| **Toast** | report something that already happened | **top of screen**, under the nav · ✓ + one or two lines · ✕ or an ack button · does not block |
| **Full-screen** | a whole nested task (settings, paywall) | ✕ top-left · own header |

**Dialogs are not just yes/no** (evidence: Too Good To Go, Notion, Cleo, Strava):

- A destructive dialog must state **the consequence and whether it reverses**
  ("Please note this cannot be undone"), and offer the **preserving alternative**
  when one exists — Too Good To Go routes to data export *inside* the delete dialog.
- A dialog may carry a **choice**, not just a confirm: Notion's delete offers two
  radio options with each outcome spelled out ("view only" vs "view and data source").
- Destructive action takes the error color; the safe action is text/tertiary. Never
  the reverse.
- Cleo states the *side effect*, not the action: "Hiding this could change your
  eligibility and budget overview."

**Toasts sit at the TOP on iOS**, not the bottom — verified across Grab, Oportun,
Etsy, Instacart. Many are **manually dismissible** (✕) rather than auto-dismiss, and
some carry an acknowledgement button ("Ok, got it"). A toast still must never be the
only route to undo.

### H2. The parent screen stays alive behind the overlay

This is the mechanism behind "no teleports": in every sampled sheet the underlying
room is still on screen, dimmed — Oportun's `Review details` and its amounts remain
readable behind the frequency picker. **You never lose your place.**

- Sheet height = content. Picker ≈ ½ · explain/offer ≈ ⅔ · nested task ≈ full.
- Dismiss is always **explicit** — ✕ top-left or `Cancel`/`Exit` text — never swipe-only.
- One job per sheet. Two jobs means two sheets, or a page.
- A sheet may carry a destructive path, but the safe path is primary and the
  destructive one stays **visible, not hidden** (Oportun: `Claim offer` filled,
  `Continue with cancellation` outlined).

### H3. Motion

- Micro ~100ms · enter 200–300 · exit 150–200; honor reduced motion.
- Prefer shared-element continuity (tapped row → detail header).
- Open/close retrace the same path.
- Sheets are springy, draggable, interruptible.

---

## I. Flow law — multi-screen sequences

**Evidence:** Monzo *Creating a pot* (18 screens), Phantom *Send* (10), PayPal (14).
A flow is a designed object. Name its steps before building any of them.

### The spine

```
1  ENTRY      on the object, inside its room — not a global "+"
2  DISAMBIGUATE  if it could belong to >1 scope, ask FIRST (action sheet)
3  CHOOSE     if the object has types with different consequences → a chooser page
4  TEACH      2–3 screens max, inline, dotted, skippable — never a separate tour
5  COMPOSE    one focus field + seeded suggestion chips
6  CONFIRM    review the real numbers before commit
7  STATUS     result + what happens next + when
```

Monzo runs exactly this: Pots row → `Create Pot` tile → *Personal or Joint?* action
sheet → *Choose a type of Pot* (Regular / Savings / Investments, each with its own
consequences) → 2-screen value carousel → name + emoji + suggestion chips.

### Hard rules

- **Entry lives on the object, in its room.** A global `+` that asks "what do you want
  to make?" is a wayfinding failure.
- **Disclose the downside where the choice is made.** Monzo prints "You could get back
  less than you invest" on the Investments option itself, not in a later screen.
- **The chosen target stays pinned through the rest of the flow, with an edit
  affordance.** Phantom keeps `To: @alexsmith (Amkf…wiAb)` + pencil on every
  subsequent step. Continuity is a persistent header, not a memory test.
- **`Cancel` / `✕` is present and in the same corner on every step.** Backing out is
  never a trap.
- **Primary stays disabled until the step is valid** — greyed `Next`, not an error
  after tapping.

### Money entry (the register/POS/payout case)

Never a plain text input. The evidenced pattern:

```
[huge amount]        0 SOL  /  $0.00      one hero value
[converted echo]     ~$0.00                the other unit, quiet
[unit toggle ⇅]                            swap which unit you're typing
[available + Max]    "Available To Send"  + Max button
[custom keypad]                            not the system keyboard
```

---

## J. Information structure — how a web room is organized

**Evidence:** 20 web apps opened and read 2026-08-07 (7,915 screens): Revolut Business,
Gusto, Klaviyo, Melio, Mixpanel, Asana, Clay, Todoist, Dovetail, Fibery, Typeform,
Loom, 1Password, Evernote, Oyster, Kit, Campsite, Frame.io, Instacart, Klook.

### M1. Three stacked bars — never merged, never skipped

Every great admin room stacks the same three bars above its content:

```
1 IDENTITY   [icon] Object name ▾  ☆  ○ Set status          [people] [Share] [⚙ Customize]
2 VIEWS      Overview · List · Board · Timeline · Dashboard · +
3 TOOLBAR    + Add task ▾  |  Filter · Sort · Group  |  Save view ▾
```

- **Identity** = what am I looking at (Asana, Frame.io, Typeform, Klaviyo all do this)
- **Views** = how do I want to see it. **One object, many views, chosen by a tab strip.**
  Asana: Overview/List/Board/Timeline/Dashboard/Note/Workload/Files/Workflow.
  Dovetail: Data/Highlights/Tags/Insights. Frame.io: Comments/Fields.
- **Toolbar** = **left narrows what you see** (search, filter, sort, group);
  **right adds to it** (Import, + Add, New). This left/right split held in every
  single app. Melio, Gusto, Dovetail, Typeform, Asana — no exceptions found.

A room that invents its own header, or merges views into the toolbar, breaks the
user's model of where to look.

### M2. Lifecycle is a tab strip, not a filter

When an object moves through stages, the stages ARE the tabs:

| App | Tabs |
|-----|------|
| Gusto People | Active · Onboarding · Offboarding · Dismissed · Collaborators |
| Melio Pay | Vendors · Bills · Approvals · Payments |
| Typeform | Create · Logic · Connect · Share · Results |
| Kit Subscribers | Net new · Total · Purchases · Unsubscribes |

Burying a lifecycle inside a `Status ▾` dropdown hides the shape of the business.

**Each stage tab carries its count, and zeros stay visible** (Homerun, 2026-08-08):

```
  8            3             1           3           0       0       0                1
All candidates Application  Qualified  Interview   Offer   Hired  Maybe in Future  Disqualified
```

The empty stages are rendered greyed, not dropped. **The whole pipeline is readable
before a single click** — and an empty stage is itself the finding ("0 Offer" is the
business fact you came for). Hiding zero-count tabs deletes the diagnosis. §N3 applies:
each count routes to the records it counts.

### M2b. Views are user property, not just ours

We author the *default* views. Every top-rated admin lets the user build and keep their
own, and surfaces that as first-class chrome:

- The views strip ends in a **`+`** (Asana, Plane) — a new view is created where views
  live, not in Settings.
- A modified view shows an explicit **`Save view ▾`** (Steep) / `View settings`
  (Attio) — a dirty view never silently persists, and never silently reverts.
- Saved/pinned views appear in the **rail's user section** (§M3 `PINNED · Favorites`),
  named by the user.
- View definition lives in the **inspector** (§A1d view-builder), not a modal.
- Sharing scope is stated on the view itself — Steep prints `Private ●` +
  `Teams with access · Admins only` in the inspector.

⛔ A product where every user sees exactly the layout we shipped is not "consistent",
it's rigid — but the inverse failure is worse: a user-built view with no name, no owner
and no save state.

### M3. The rail has four zones

```
[scope switcher]   workspace/store + ▾
[+ Create new]     filled primary button, ABOVE search (Mixpanel, Typeform, Todoist)
[search]           with its ⌘K shortcut printed
[grouped rooms]    TRACK / ANALYZE / MANAGE / ADMIN — whispered small-caps groups
[user sections]    PINNED · YOUR BOARDS · Favorites · Shortcuts (+ to add)
[nudge]            trial / plan / permission prompts — bottom, never in main
[identity]         account + Settings, pinned bottom
```

- **Group labels let you exceed 12 rooms without a junk drawer** (Gusto runs 11 rooms
  + shortcuts; Toggl runs 14 in four groups).
- **Empty rail sections explain themselves in one grey line** rather than vanishing —
  Campsite: "Favorite your most important chat threads and channels."
- **Sub-rooms expand in place** under the active parent (Klaviyo, Gusto, Fibery) —
  they do not replace the rail.
- Verb-grouped **top nav** is a legal alternative when the product is organized by
  what you do, not where you go — Kit: Grow ▾ · Send ▾ · Automate ▾ · Earn ▾ · Learn ▾.

### M4. Every number states its window and its method

The single most-copied honesty pattern across these 20:

- Kit's stat strip labels each cell with its window: `LIFETIME TOTALS` · `LAST 60 DAYS`
  · `TODAY`. The window is **part of the label**, not a footnote.
- Kit's subscriber card shows the same metric in four windows side by side
  (Today / Past 7 days / Past 30 days / Total) — acceleration is readable at a glance.
- Mixpanel prints the method under every chart title: "2-step Funnel · last 30 days",
  "Unique, today compared to previous day", "Linear, Maximum, last 30 days".
- Mixpanel and Todoist put a **written definition or diagnosis next to the numbers**,
  timestamped ("Updated 15 hours ago").
- Gusto **restates the query above the result**: "Salary results for Analyst" +
  the applied filters echoed as a quiet icon line.
- Dovetail gives every AI-generated claim a **numbered citation** back to the raw
  response.

**Cinch rule:** a number with no window and no method is a defect. So is a generated
insight with no citation and no timestamp.

#### M4b. The method is an artifact, not a caption (Steep, 2026-08-08)

Steep raises the bar on this and we should meet it. On a metric page it ships:

- a **`Query` block containing the literal SQL** that defines the metric, with
  `Copy to clipboard` — the definition is inspectable, not described
- the comparison **built into the header**, not bolted on: `Total 23.19%` beside
  `Prev. year 30.27%`
- a **delta column in the right unit** on every segment row — `-4.5pp`, `-11.1pp`
  (percentage *points* for a rate, never "%" — that error is on us to avoid)
- a time-grain segmented control (`Day · Week · Month · Quarter · 6M · Year · 2Y · 5Y ·
  Custom`) **and** a period stepper (`‹ Last 365 days ›`) — pick-the-grain and
  move-the-window are two different jobs and get two different controls

**Cinch rule:** every KPI ships with (a) its window, (b) a comparison to the prior
equivalent window, and (c) a route to its definition. A metric whose definition only
exists in our source code is a metric the merchant cannot trust or dispute.
See `reference_cinch_business_pulse` for the money-basis rules that definition must state.

---

## K. Affordance — what makes information clickable

This is a **vocabulary**, and it must be used consistently or the room becomes a
guessing game. Every glyph below means exactly one thing.

### N1. The glyph vocabulary

| Signal | Means | Evidence |
|--------|-------|----------|
| `›` chevron at row's right edge | this row **opens** something | Revolut, Gusto, Loom, Melio |
| `▾` caret **on a value** | this value is **switchable** in place | Revolut `S$1.00 ▾`, `SGD ▾` |
| `✏️` pencil before a value | this **one field** edits inline | Revolut `✏️ INV-1`, `✏️ €0.6000` |
| `↗` after a label | leaves the app / new tab | Gusto "Learn more ↗" |
| underline + accent color | a **link to another record** | Gusto People table |
| plain dark text | **information only** — not clickable | every table sampled |
| `⋯` / `⋮` | overflow of secondary actions | universal |
| `+` in an empty slot | this slot can be **filled** | Todoist metadata rail |
| filled pill | the **active** room/tab | universal |

### N2. ⚠️ A web table row is NOT uniformly clickable

The single most important finding for Cinch admin. In Gusto's People table, one row
contains **three different destinations**:

```
☐  Sam Lee      Product      Product Designer   Contractor   Singapore
   └─ link      └─ link      └─ link            └─ plain     └─ plain
      → person     → dept       → job                text        text
```

Clickable cells are **underlined and colored**; informational cells are plain. The
user learns the rule once and reads every table faster forever. Making the whole row
one target destroys that — and making nothing obviously clickable is worse.

**Corollary — the row's primary verb gets its own column.** Melio's vendor table ends
with an `Action` column holding "New payment", then `⋮`. The action is not a
hover-reveal; hover-only actions are invisible to anyone scanning.

So an ops row carries at most three things:
1. **name → its detail** (link styling)
2. **one verb → do the thing** (Action column)
3. **`⋮` → everything else**

### N3. Numbers and counts are affordances

1Password's onboarding card: "**2** People waiting to be confirmed →" — the count and
its label together are the link. Kit: "Go to subscribers →". Revolut: "See all".
**A count you can act on must route to the records it counts.**

### N4. State is carried by color-coded words, not decoration

- Revolut's setup rows: "Submitted" (muted) vs "**Requires action**" (amber). The
  color *is* the call to action.
- Todoist: Health chips — "Excellent" (blue) / "Critical" (red).
- Asana: due dates turn red only when overdue/imminent; otherwise plain grey.
- Instacart: sale price large + was-price struck through + "20% off" chip.

### N5. Empty slots stay visible

Todoist's task detail shows **every** metadata slot — Project, Assignee, Date,
Deadline, Priority, Labels, Reminders, Location — each with a `+` when unset. A field
that disappears when empty is a field the user never learns exists.

### N6. The keyboard is an affordance layer, and it is printed

The top-rated apps do not hide their shortcuts in a help menu — the key is drawn on the
thing it operates. This is discoverability, not power-user trivia.

| Where | Printed as | Evidence |
|-------|-----------|----------|
| Row / menu item | the key on the row’s right edge | Fey: `Compare graphs` … `C` |
| Dialog buttons | the key inside the button | Attio: `Cancel ESC` · `Save ↵` |
| Under a control | one grey sentence | Fey: "Press `[` `]` to cycle through timeframes" |
| Inline composer | the hint where the next one appears | Plane: "Press 'Enter' to add another work item" |
| Search field | `⌘K` in the placeholder | universal |

- **⌘K opens a real command palette**, not just a search box — it must reach rooms,
  records and actions, and it is the recovery route when wayfinding fails.
- `Esc` closes the topmost layer, always, everywhere. `↵` commits the focused form.
- Anything with a shortcut must **also** be reachable by pointer (§tap equivalent).
- A shortcut that exists but is never printed does not exist.

### N7. Selection and bulk action

Any list a merchant processes will eventually need to be processed 40 rows at a time.

```
[☐ header checkbox]  selects the page, and says so: "8 selected · Select all 214"
[☐ per row]          hover reveals it; SELECTED state is always visible
[action bar]         appears in place (docked above the list or replacing the toolbar)
                     — the count, then the verbs, then ✕ to clear
```

- Evidence: Homerun (checkbox per candidate row), Attio, Melio, Gusto.
- **The bar names the count in the verb** (§P2): `Archive 12 candidates`, not `Archive`.
- **Destructive bulk verbs state blast radius and reversibility** (§P4) — a bulk
  destructive with no count in the confirm dialog is an instant fail.
- Selection survives scroll; it does **not** survive a filter change without saying so.
- ⛔ Never put bulk actions behind hover-only per-row `⋮` — that is the N2 corollary.

---

## L. Consequence — what happens after the click

Josh's third question, and the one the 20 apps are most consistent about.

### P1. On web, drill-down is a **drawer or pane — the list stays**

| Pattern | Apps | Use when |
|---------|------|----------|
| **Right drawer** over a dimmed list | Melio, Frame.io share | acting on one record from a queue |
| **Persistent third pane** | Clay, Evernote, Mixpanel replay | browsing many records in a row |
| **Modal with two panes** | Melio bill, Todoist task, Asana | editing one object deeply |
| **Full route change** | rare | only when the object owns a whole workspace |

**A route change that erases the list is the web equivalent of a teleport.** This is
the desktop counterpart to §H2 (mobile sheets keep the parent visible). Melio and Clay
both keep the queue on screen the entire time you work a record.

### P2. The primary button names the consequence, not the direction

Verified across every app — not one said "Next" or "Submit":

| Button | App | What it tells you |
|--------|-----|-------------------|
| `Continue to review` | Klaviyo | where you land next |
| `Review and turn on` | Klaviyo | it goes live after review |
| `Send` vs `Schedule` | Revolut | **same form, label changes by mode** |
| `Import 10 vendors` | Melio | the exact count |
| `Go to checkout $12.96` | Instacart | the amount |
| `Save and close` vs `Continue to pay` | Melio | two different commits |
| `Restore Item` | 1Password | the destructive-inverse |

### P3. Editing gives continuous feedback, then a real receipt

- **Live preview beside the form.** Revolut renders the invoice PDF as you type, with
  an `Invoice PDF | Email` tab so you can see what the customer receives. Klaviyo,
  Typeform, Kit, Asana all pair inspector-left / live-artifact-right.
- **Autosave is stated, not assumed**: "Last saved: 58 seconds ago" (Klaviyo),
  "⟳ Saving" (Kit), "All edits will be auto-saved" (Asana).
- **Status pill + two exits**: `DRAFT ▾` with `Exit` and `Publish` as separate buttons.
- **The success screen is a receipt**, not a toast. Melio's "Payment scheduled" shows
  amount, payee, method, **debit date AND delivery date**, memo, plus download/print
  and one route onward. Both dates matter and both are shown.

### P4. Destructive and reversible actions state the blast radius

- Loom trim: "**89.2 seconds** will be trimmed / Trimmed sections can be recovered
  after you end your recording."
- 1Password: "Last edited … / Added …" + **`⟲ View previous versions`** → a version
  list beside a full render of the selected version + `Restore Item`.
- Melio: an amber **Action required** banner with the deadline — "Make sure this
  payment is approved before Dec 2, 2025."
- Campsite's `⋯` menu order is fixed: state toggles → placement → sharing → editing →
  **destructive last**.

### P5. Multi-step work shows the steps, the cost, and the owner

- Gusto's setup timeline: ✓ done with date · ○ pending with **deadline AND time
  estimate** ("By Nov 12 · 28 min") · and the **system's own step** listed too
  ("Gusto reviews your account · By Nov 14").
- 1Password's import: a named step bar — Export → Choose Vault → Upload → Review
  Items → Label — with inline green success between steps.
- Klaviyo: `① RECIPIENTS ② CONTENT ③ REVIEW`. Gusto: "Step 2 of 5 ▾" (jumpable).

### P6. Input shows the system's interpretation before commit

Todoist's quick-add parses "Make new visuals 14 Feb p1" and renders the parse as
**removable chips** (`📅 Saturday ✕` `🚩 P1 ✕`) under the text. The user corrects the
machine *before* committing, not after.

Same family: Melio's import review table (per-row status dot, "show only rows with
errors", `Import 10 vendors`), and 1Password's column-mapping over sample data.

### P7. Blank inputs are seeded

Never a blank stare. Campsite offers composer chips (Start a daily standup / Write a
project update / Make an announcement / Ask a question). Monzo offers name chips.
Emergent offers example prompts. Mixpanel, Kit, Fibery, Frame.io and Asana all lead
their template galleries with **"Start from scratch"** so the escape hatch is first.

### P8. Every object is multi-user — show the other humans

Added 2026-08-08. Cinch, HQ, `/m` and every Flight Deck are multi-user products, and
this skill previously said nothing about it. The reference set is unanimous:

- **Every object has an activity trail**, and it is written as sentences with actors and
  relative time — Plane: *"samlee.mobbin+1 set the due date to Aug 25, 2025 · 1 minute
  ago"*, *"added a new assignee Samlee.Mobbin+1 · about 1 hour ago"*. Not a diff dump.
- **The trail is filterable and sortable** (Plane ships `Filters` + sort on Activity)
  once it exceeds a screen.
- **Last-touched is in the header**: "Last edited by samlee.mobbin+1 2 minutes ago ▾".
  Pairs with §P3's explicit save state — *who* saved matters as much as *when*.
- **Assignment is a face, not a name string** — avatar + name, and the avatar is the
  affordance to reassign.
- **`Share` is a primary-weight button in the identity bar** on anything shareable
  (Homerun, Frame.io, Steep), and it states the resulting access, not just "shared".
- **Comments attach to the object, not to a chat room** (Frame.io `Comments` view tab,
  Plane's comment bubble, Steep's `Comments` tab).
- Where two people can edit at once, **presence is shown** (avatar cluster) and the
  conflict is prevented, not reported after the fact.

Cinch rule: an ops object a second employee can change (shift, order, payout, price)
must answer *who changed this and when* **from its own detail view** — never only from
an audit page in another room.

---

## M. Cinch implementation anchors

| Law | Code / doc |
|-----|------------|
| Web admin header | `src/components/admin/AdminHero.tsx` |
| Header width / pad | `admin/layout.tsx` · `docs/ADMIN-PAGE-CHROME-LAW-2026-08-07.md` |
| Ocean composition | `OceanPool` / `OceanShell` · Tidal composition law |
| Numeric craft | `.claude/skills/design-mastery` |
| Full Mobbin evidence | `docs/mobbin-study/` |

---

## N. Ship checklist (web OR mobile)

```
Species
- [ ] Named C1 money home / C2 workroom / C3 compose / C4 conversation / C5 inbox
- [ ] One shell for this role (web sidebar OR phone tabs — not both fighting)

Theme & access (§F0 — the two that were never checked before)
- [ ] Every color is a role token; zero raw hex in components — **including alpha whites** (`bg-white/85` is a literal and skips the remap)
- [ ] Theme defined for all THREE states: explicit light · explicit dark · system default
- [ ] Screenshotted in BOTH themes on the real surface; status colors re-picked for dark
- [ ] Contrast re-measured (computed, not guessed) at every color swap
- [ ] Contrast / focus ring / tab order checked via `ui-ux-pro-max` § Accessibility
- [ ] Any chart built through `dataviz` (series palette is NOT §F's hue budget)

Wayfinding
- [ ] Where am I? scope + room labeled
- [ ] Accent only on interactive
- [ ] Destination h1 matches nav label
- [ ] The h1 IS the name of the thing (§A2a) — and no *sentence* in the header renders larger than it. A number may (C1 only); a sentence never.
- [ ] Line above the name is a breadcrumb, not a second name; line below is metadata, not a slogan

Chrome
- [ ] One page header species; full-width main (no floating max-w page)
- [ ] Web: left rooms + top scope · Phone: bottom rooms + top scope
- [ ] One range control if time-scoped
- [ ] If it has an inspector: it configures main, re-renders live, collapses, persists
- [ ] Shell checked at 1280 / 1024 / 768 / 390 — rail collapses, rooms never deleted
- [ ] Setup/demo-data state visible in the rail, not only on one page

Content
- [ ] C1: one hero metric + so-what
- [ ] C2: search + range + KPI strip + one list grammar
- [ ] C3: one focus + chips + sticky primary

States (§G — screenshot each one, don't assume)
- [ ] Empty says what appears here AND when; exactly one action
- [ ] Web empty is per-card (each card keeps title + its own line + its own button)
- [ ] Money hero still shows its number at zero
- [ ] Loading: chrome fully real, only data ghosts; skeleton matches real layout
- [ ] Error tiered right: inline field / sheet over live parent / full page
- [ ] No error destroys the context behind it; no lone "OK"
- [ ] Locked gates in place

Flow (§I — if this ships a sequence)
- [ ] Steps named before layout; entry sits on the object in its room
- [ ] Scope disambiguated first; downsides disclosed at the choice
- [ ] Target pinned + editable through every later step
- [ ] Cancel in the same corner on every step; primary disabled until valid
- [ ] Money entry: hero amount + converted echo + Max + custom keypad

Overlays (§H1–H2)
- [ ] Overlay species matches its job; one job per sheet
- [ ] Parent room visible behind it; explicit dismiss, not swipe-only

Structure (§J)
- [ ] Three bars present and distinct: identity → views → toolbar
- [ ] Toolbar split: narrowing left, adding right
- [ ] Lifecycle stages are TABS, not a status dropdown — each with its count, zeros shown
- [ ] Views strip ends in `+`; a dirty view shows an explicit Save; sharing scope stated
- [ ] Every number states its window; every chart states its method
- [ ] Every KPI has a prior-window comparison and a route to its definition (§M4b)
- [ ] Rate deltas in `pp`, not `%`
- [ ] Any generated insight carries a citation + timestamp

Affordance (§K)
- [ ] Glyph vocabulary used consistently: `›` opens · `▾` switches · `✏️` edits inline · `↗` leaves
- [ ] Table rows: links underlined+colored, info cells plain — NOT whole-row click
- [ ] Row's primary verb has its own Action column (never hover-only)
- [ ] Counts route to the records they count
- [ ] Empty metadata slots still render, with `+`
- [ ] Shortcuts are PRINTED on the thing they operate; ⌘K reaches rooms + records + actions
- [ ] Processable lists have selection + a bulk bar whose verbs name the count

Consequence (§L)
- [ ] Drill-down keeps the list on screen (drawer/pane), not a route change
- [ ] Every primary button names the consequence — no "Next"/"Submit"/"OK"
- [ ] Editing shows live preview + explicit save state
- [ ] Success is a receipt (all the facts, exportable, one route onward)
- [ ] Destructive actions state blast radius + reversibility; destructive last in menus
- [ ] Multi-step shows steps, deadlines, estimates, and the system's own steps
- [ ] Parsed/imported input shows its interpretation before commit
- [ ] Shared objects answer "who changed this, when" from their own detail view (§P8)

If it ships a C4 conversation surface
- [ ] Answers emit real product cards; numbers in answers carry window + method
- [ ] Every generated claim cited + timestamped; the model states what it could NOT do
- [ ] An agent acting on real data confirms first, with consequence + reversibility

Craft
- [ ] One card + one row component
- [ ] tabular-nums; ≤3 chrome hues; no emoji in chrome (content emoji renders as typed)
- [ ] Neighbor test: Shopify web / Linear web / Monzo mobile — same species?
- [ ] Crop test (Cinch ocean): strip hero → body still product world
```

---

## O. What this skill is NOT

- Not marketing (Editorial Light / site-builder).  
- Not a license to pixel-clone reference apps.  
- Not a substitute for product correctness (page jobs, no false all-clear).  
- **Not mobile-only** — web admin is first-class and has its own shell law (sidebar rooms).

---

## P. Research log (2026-08-07 · 2026-08-08)

| Pass | Focus | Key captures |
|------|-------|--------------|
| Free + Pro iOS | Money + merchant + SMB | Monzo, Starling, Chime, Mercury, Revolut Biz, Shopify Orders, Jobber, Linear Mobile |
| Pro Web | Admin shells | Shopify Web home (sidebar + main), Linear Web (rail rooms), Mercury Web |
| Gaps | Toast absent; Square Go ≠ POS | Register keeps Toast teardown |

### Deep pass 2 — behaviour, not layout (2026-08-07, same day)

Filled §G (states), §H (overlays/motion), §I (flows) and §A1b–A1c, which were the
thinnest sections. Sampled via Mobbin's own taxonomy — 129 `screenPatterns`,
76 `flowActions`, 53 `screenElements`:

| Query | Volume | Apps read |
|-------|--------|-----------|
| `screenPatterns.Empty State` iOS / Web | 3,239 / 2,019 | Cleo, ElevenLabs, Cuvva, MoonPay, Strava, Notion · Toggl, Twenty, LangChain, Emergent |
| `screenPatterns.Error` iOS | 1,442 | PayPal, KOHO, Cleo, Notion, Oportun |
| `screenElements.Skeleton` iOS | 462 | Quizlet, Wabi, ElevenLabs, Particle, Klook |
| `screenElements.Bottom Sheet` iOS | 13,700 | Oportun, ElevenLabs, Tide Guide, Substack |
| `screenElements.Side Navigation` Web | 1,501 | Toggl Track, Twenty, LangChain, Mercor |
| `flowActions.Transferring Money` iOS | 375 | Monzo (18 screens), Phantom (10), PayPal (14) |

**Biggest correction this pass:** empty state on web is **per-card**, not per-page
(§G2). The mobile instinct — one centered empty per screen — is wrong for an admin
dashboard and is the most likely Cinch defect.

Evidence path: `cinch-app/docs/mobbin-study/`.
Access: Mobbin Pro via `~/chrome-profile-mobbin` (CDP :9334) — see
`reference_chrome_automation_profile`.

### Deep pass 3 — the top-rated population (2026-08-08)

`mobbin.com/discover/apps/web/top`, 144 apps rank-ordered by rating. Screens read for
**Fey (4.92, #1), Origin (5.0), Plane (5.0), Steep (5.0), Attio (4.77), Manus (5.0),
Homerun (5.0)** — chosen because pass 1–2 had not sampled any of them.

**Why this pass existed:** passes 1–2 sampled SMB/fintech admin (Shopify, Gusto, Melio,
Toggl). The top-rated population is a *different distribution* — dark-first,
keyboard-first, AI-native, user-configurable. Everything pass 1–2 wrote held up; the
failures were all in what it never looked at.

| Added | Section | Trigger |
|-------|---------|---------|
| Escalation routes (a11y + dataviz are mandatory, not fallback) | header | a11y was reachable only via a skill scoped "when no GullStack standard covers it" — so never |
| Right inspector as the 4th zone | §A1, §A1d | Steep, Attio, Plane all run rail\|main\|inspector; "two zones" shelled wrong |
| Rail-bottom setup progress | §A1c | Attio `Help and first steps 4/6`; Steep `Using demo data` |
| Responsive shell states | §A1e | Plane's two-level rail; collapse toggles everywhere |
| C4 conversation/agent · C5 inbox/feed | §C | ~⅓ of the top 40 are AI-native; every multi-user app has an inbox |
| Theme as token pairs | §F0 | **the biggest gap** — neither skill mentioned dark mode at all; Fey and Linear are dark-first |
| Hue budget is chrome-only | §F | Fey overlays 5 series; Attio's bars run 11+ — §F contradicted every real chart |
| Emoji: chrome vs content | §F | rule was absolute; Plane ships "Welcome to Plane 👋" |
| Stage tabs carry counts, zeros shown | §M2 | Homerun's 8-stage strip with `0 Offer · 0 Hired` visible |
| Views are user property | §M2b | Steep `Save view ▾`, Attio `View settings`, Asana/Plane `+` |
| Method as an inspectable artifact | §M4b | Steep prints the metric's literal SQL with Copy to clipboard |
| Keyboard as a printed affordance | §N6 | Fey `C` / `[` `]`; Attio `Cancel ESC` `Save ↵`; Plane "Press 'Enter'" |
| Selection + bulk action bar | §N7 | Homerun, Attio, Melio, Gusto — zero prior coverage |
| Multi-user reality | §P8 | Plane activity trail; "Last edited by … 2 minutes ago" |

Capture method: Mobbin Pro profile on CDP :9334, driven by a minimal WebSocket CDP
script (`Runtime.evaluate` + `Page.captureScreenshot`). WebFetch gets a 403 on
mobbin.com — the authenticated profile is the only route.
