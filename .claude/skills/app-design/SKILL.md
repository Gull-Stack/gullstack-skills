---
name: app-design
description: Product UI/UX for GullStack apps (Cinch web admin + HQ + register + member/employee phone) — wayfinding shells for desktop AND mobile, hero metrics, merchant workrooms, progressive disclosure, one card/list grammar, ocean/action color law. Use when designing, building, or reviewing any product UI (NOT marketing sites — those use design-standard-v3 / site-builder).
---

# Skill: GullStack App Design

> **Canon:** GullStack brain `protocol/app-ux-design.md` when present; else this skill.  
> **Evidence:** Mobbin Pro study 2026-08-07 — **mobile + web**  
> (`cinch-app/docs/mobbin-study/`, `GULLSTACK-APP-DESIGN-STANDARD-2026-08-07.md`).  
> Sync to: `~/.claude/skills/app-design/SKILL.md`, `gullstack-skills/app-design/SKILL.md`.

How GullStack **product apps** look and behave. Counterpart to marketing
`design-standard-v3` / site-builder. Complements `protocol/ux-ui-uplevel` and
Cinch `design-mastery` (numeric craft). When sources conflict: **wayfinding >
tokens > skin**.

**Learn grammar; never clone brand skins** (no Monzo coral, no Linear logo,
no Shopify illustration packs).

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

---

## A. Shell law — Desktop web (P0 for Cinch admin)

Mobbin Web: **Shopify Admin** (781 screens), **Linear** (448), **Mercury** (479).

### A1. Two zones, two jobs

| Zone | Job | Do | Don’t |
|------|-----|----|-------|
| **Top bar** | **Scope** | Store/workspace name, ⌘K search, notifications, account | Primary room nav as a second row of tabs that fights the sidebar |
| **Left sidebar** | **Rooms** | 5–12 stable destinations, active = filled pill, Settings pin bottom | Different sidebar per page; rooms that vanish by route |
| **Main** | **Job** | Full width of remaining column; one page header; one spine | Centered `max-w-3xl` page that floats; double headers |

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

### A2. Web page header (every room)

One species only:

```
[optional back]
[eyebrow / room]     optional
[h1 title]           always one h1
[subtitle]           one quiet line
[actions row]        primary right or under title — never a second h1 band
```

Cinch: use **`AdminHero` / `OceanPool`** full-width (never light SaaS title stacked on ocean).  
See `AdminHero` + `docs/ADMIN-PAGE-CHROME-LAW-2026-08-07.md`.

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

## C. Three page species (both web and mobile)

Every product screen is **exactly one** of these. Naming the species is mandatory before layout.

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

### Color

- **World:** fixed cool ocean for Cinch product chrome (not tenant brand as world).  
  Brand lives in `--action` on tappables only.  
- **Hue budget:** ≤3 chromatic hues; neutrals ≥90% of pixels.  
- **Accent = action** only. Status (rose/amber/green) never doubles as brand.  
- **No purple** in Cinch ocean world; no emoji icons.

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
- [ ] Named C1 money home / C2 workroom / C3 compose
- [ ] One shell for this role (web sidebar OR phone tabs — not both fighting)

Wayfinding
- [ ] Where am I? scope + room labeled
- [ ] Accent only on interactive
- [ ] Destination h1 matches nav label

Chrome
- [ ] One page header species; full-width main (no floating max-w page)
- [ ] Web: left rooms + top scope · Phone: bottom rooms + top scope
- [ ] One range control if time-scoped

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
- [ ] Lifecycle stages are TABS, not a status dropdown
- [ ] Every number states its window; every chart states its method
- [ ] Any generated insight carries a citation + timestamp

Affordance (§K)
- [ ] Glyph vocabulary used consistently: `›` opens · `▾` switches · `✏️` edits inline · `↗` leaves
- [ ] Table rows: links underlined+colored, info cells plain — NOT whole-row click
- [ ] Row's primary verb has its own Action column (never hover-only)
- [ ] Counts route to the records they count
- [ ] Empty metadata slots still render, with `+`

Consequence (§L)
- [ ] Drill-down keeps the list on screen (drawer/pane), not a route change
- [ ] Every primary button names the consequence — no "Next"/"Submit"/"OK"
- [ ] Editing shows live preview + explicit save state
- [ ] Success is a receipt (all the facts, exportable, one route onward)
- [ ] Destructive actions state blast radius + reversibility; destructive last in menus
- [ ] Multi-step shows steps, deadlines, estimates, and the system's own steps
- [ ] Parsed/imported input shows its interpretation before commit

Craft
- [ ] One card + one row component
- [ ] tabular-nums; no emoji; ≤3 hues
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

## P. Research log (2026-08-07)

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
