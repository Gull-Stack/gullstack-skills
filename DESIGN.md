# DESIGN — the door

> Josh, 2026-08-08: *"i want one design standard that matches the examples in
> mobbin"* · *"we really should have one design guide standard so as to remove
> confusion."*

**Start here. Every time. Before any UI decision.**

One source, one door. Not one document — a marketing page and a rail-and-
inspector admin are genuinely different species, and merging their laws makes
the drift surface bigger, not smaller. What was broken was never that there
were two skills; it was that there were **three versions of one skill** and
nothing checked.

---

## 1. Name the surface. That picks your skill.

| What you are building | Skill | Non-negotiable first move |
|---|---|---|
| **Product app UI** — Cinch `/admin`, the Floor, `/m`, register, member app, a Flight Deck, Corn | **`app-design`** | Read **§Escalation routes** before anything else |
| **Marketing site / landing page** — a client's public site, `usecinch.com` | **`ux-ui`** | Name the **client GENRE** (below) before any layout decision |
| **A whole client site build** | `site-builder` (wraps `ux-ui`) | Same genre call |

⛔ There is no third option and no "I'll just use both". Picking by habit
instead of by surface is how the Plato's photography law got applied to a SaaS
page.

### The genre branch (`ux-ui` only)

`ux-ui` is **not one law**. It forks before layout:

- **Genre A — local / physical.** Plato's, ECM, Desert Reef, trades, retail,
  hospitality. Editorial Light verbatim; the hero is a **real photograph**.
- **Genre B — software / product.** Cinch, OnRecord, a Flight Deck sold as a
  product, any SaaS. Light **or** dark committed end to end; the hero is **the
  product itself** — a real screenshot or a short loop. Never a photo, never a
  mockup.

Hybrid (a physical business that also sells software): Genre A for the public
site, Genre B for product/pricing pages. **Never blended on one page.**

---

## 2. Two hand-offs are MANDATORY, not fallbacks

This is the rule that got accessibility skipped for months, so it is stated
twice — here and at the top of `app-design`.

| Question | Go to | When |
|---|---|---|
| Contrast ratio · focus rings · tab order · ARIA · screen readers | **`ui-ux-pro-max`** § Accessibility | ⛔ before shipping ANY screen |
| Chart type · series colours · axis · legend · stat tile · sparkline | **`dataviz`** | ⛔ before the first line of chart code |

**`ui-ux-pro-max` loses every conflict on canon we HAVE** — style, layout,
type, colour: GullStack has decided those, and the GullStack skill wins.
**It is mandatory on canon we DON'T have** — contrast, focus order, ARIA,
chart-type selection. That is not a conflict, it is a **gap**.

The same split governs `dataviz`: `app-design` §F's ≤3-hue budget is about
**chrome**. It does not govern data series — a 7-series comparison chart is not
a 7-hue brand violation. `dataviz` owns the series palette and outranks §F
inside the plot area.

---

## 3. Law vs evidence

Only two documents are **law**. Everything else is the reasoning behind them —
useful, quotable, and **not binding when it disagrees**.

| | |
|---|---|
| **LAW** | `app-design/SKILL.md` · `ux-ui/SKILL.md` |
| **LAW (repo-local)** | `cinch-app/docs/ADMIN-PAGE-CHROME-LAW-2026-08-07.md` — the chrome law and its gates |
| **EVIDENCE** | `design-mastery` · `mobile-design` · `docs/DESIGN-LANGUAGE-2026-07.md` · `docs/MOBILE-DESIGN-MASTERY-2026-07.md` · `docs/UX-QUALITY-BAR-2026-07.md` · every `docs/*-AUDIT-*.md` |

⚠️ `cinch-app/CLAUDE.md` says *"before touching any UI, load
`.claude/skills/design-mastery`."* Read it as **evidence**, after the skill
that governs your surface. It is craft doctrine (numeric hierarchy, spacing,
motion) and it does not decide which surface law applies. Its rule 1 —
*one display moment per screen* — is the same rule as `app-design` §D1; where
they agree, that is corroboration, not two sources.

---

## 4. One copy. Enforced.

`gullstack-skills/<skill>/SKILL.md` is **canon**. Everything else is a
generated copy or a pointer stub:

- `~/.claude/skills/…` and `~/.grok/skills/…` — **real content**, written by
  `install.sh`. Never hand-edit; never turn into a pointer, or you delete the
  design canon from the agent that reads it.
- `gullstack-skills/.claude/skills/…` — **pointer stubs only**.
- A vendored copy in a product repo — a copy that will age. Check it.

```
./doctor.sh               # hashes canon vs every copy; FAILs on any disagreement
./install.sh --global     # the only sanctioned way to update a copy
```

**Why this exists.** On 2026-08-08 `app-design` had four copies in three
versions. A Claude audit and a Grok audit of "the design standard" reviewed
two different documents on the same day, 327 lines apart, and neither knew.
Ten of thirteen skills already used pointer stubs correctly; the only three
that copied their content were the three design skills — which is exactly why
design was where it fragmented.

⚠️ If doctor reports a copy that is **longer than canon**, the copy is NEWER —
someone edited an install target. Do **not** overwrite it; move the edit into
canon first, then re-install. Overwriting is how a day's work disappears.
(Live example, 2026-08-08: `~/.claude/skills/app-design` 1249 lines vs canon
1222, caught by doctor mid-session.)

---

## 5. Two habits that cost us real time

**The repo's own gates beat your greps.** Three separate ad-hoc `grep`s over
`page.tsx` produced three wrong findings this week — "four header regimes",
"29 rooms with no header", "the eyebrow is the wrong slot" — all retracted
after running the gate that already existed. `admin-structure-gate.mjs`
resolves the whole import tree; a grep sees one file.

```
npm run gate:structure   # static: header species, tables, column, hero figure
npm run gate:web         # RENDERED: h1, h1-vs-rail-label, display moment,
                         # column, overflow, active room, top air — per surface
npm run gate:surface     # rendered phone + counter
npm run gate:register    # a real sale
```

**A stale rig fakes a verdict — in both directions.** A product walk run
against a checkout 31 commits behind reported defects that had been fixed the
previous day. A walk against a rig DB on an old schema threw
`column … does not exist` on six rooms, which reads as chrome drift. Before
believing any rendered finding: check the checkout's HEAD against
`origin/main`, and migrate the rig DB.

---

## 6. Where the evidence comes from

`mobbin.com/discover/apps/web/top`, read through the signed-in Mobbin Pro
profile (`~/chrome-profile-mobbin`, CDP **:9334** — never assume 9222).

The 2026-08-07 pass sampled 20 SMB/fintech admins (Shopify, Gusto, Melio,
Toggl, Klaviyo, Mixpanel…). The 2026-08-08 pass sampled the **top-rated**
list, which is a different population — dark-first, keyboard-first, AI-native:
Fey, Origin, Firecrawl, Plane, Sana AI, Wrangle, Linear, Manus, Attio,
ElevenLabs, Steep, Replit, Homerun, Krea AI. Roughly a third are AI-native.

Both passes are in `app-design`. When adding evidence, say which population it
came from — a law drawn from one frame and applied to the other is how
"two zones, two jobs" survived past the arrival of the inspector.
