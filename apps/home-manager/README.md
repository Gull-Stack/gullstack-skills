# Home Manager

The house, in one place: **who's coming and when**, **what actually got done**,
**what it costs**, and **how the kids' week is going**.

Structurally modeled on the household section of the Salisbury Flight Deck —
the two-door design, the reason-required skip, the week grid, the clock — but
it is its own application: its own database, its own sign-in, its own deploy,
and none of that household's data. Nothing was copied across; the shape was.
The two share nothing, on purpose — work on one cannot affect the other.

It lives at `apps/home-manager/` inside `gullstack-skills`. It is a product app,
not a skill, which is why it sits under `apps/` rather than at the top level
where this repo keeps its skill packages. See `CLAUDE.md` for the full note.

---

## What it does today

| Section | The one question it answers |
| --- | --- |
| **Today** (`/`) | Is the house handled right now? |
| **Schedule** (`/schedule`) | Who is coming, which day, and who asked for time off? |
| **Tasks** (`/tasks`) | What needs doing, what got done, and why something didn't? |
| **Kids** (`/kids`) | Did they read, clean up, eat, get out — and what's worth keeping? |
| **Pay** (`/pay`) | What are the people who work here owed, and what's been paid? |
| **Bills** (`/bills`) | What's coming, and did it get paid? |
| **Spending** (`/spending`) | Where did the money that this app can *see* actually go? |
| **People** (`/people`) | Who is in this household, and what can each of them open? |
| **Team** (`/team`) | The phone in the nanny's pocket: clock, today's list, the kids, ask for a day off. |

## Two doors, and the separation is the point

- **`/login`** — the family. Owners see money; adults see the home.
- **`/team`** — staff. The clock, today's list, the kids' routine, and asking
  for a day off. **No pay rates, no bills, no bank page, ever.** A phone left on
  a kitchen counter must not be a way into the household's money.

Two cookies, two markers. The staff cookie never opens the family side.

**⛔ There is no shared code and no master code anywhere in this app.** A code
that opens the door for "whoever knows it" cannot tell you who ticked a box —
and the day it turns out to also be the code for something else, both doors open
at once. That is not hypothetical; it is why this rule is written down.

**⛔ An unset code never means an open door.** If nobody has a code configured,
nobody signs in, and the login screen says exactly that.

## Running it

```bash
npm install
cp .env.example .env.local     # then fill it in — nothing has a working default
npm run dev                    # http://localhost:4340
```

```bash
npm test        # 93 unit tests over the pure rules
npm run typecheck
npm run build
```

### Getting a real one going

1. **Make a Supabase project** — its own, not shared with anything else.
2. **Run `scripts/schema.sql`** against it once. RLS is on everywhere with zero
   anon policies; the app reaches it with the service role from the server only.
3. **Set the env** (see `.env.example`): `SUPABASE_URL`,
   `SUPABASE_SERVICE_ROLE_KEY`, `HOME_TZ`, `HM_SECRET`, `HM_TEAM_SECRET`, plus
   `HM_OWNER` and `HM_PIN_<YOUR_NAME>` so you can get in the first time.
4. **Add people** on `/people` — you, any other adults, the kids, and whoever
   works here. Give staff a code so they can use `/team`.
5. **Set standing days** on `/schedule`, add the handful of tasks that actually
   matter on `/tasks`, and give each child one routine on `/kids`.

There is **no seed data**, deliberately. An invented "Melinda" in a fresh
install looks like data — she shows on a calendar, and somebody has to work out
whether she is real before they can trust anything next to her.

## The rules this thing is built on

These are load-bearing. Each one exists because the alternative was tried
somewhere and hurt.

1. **A skip needs a reason.** "Didn't happen" tells you nothing. "The dryer was
   still full" tells you to buy a second hamper. Enforced in the UI, in the API,
   and in the schema — three times, because it is the most valuable field here.
2. **Never invent a number.** A missing pay rate reads "no rate set", not
   "$0.00". A monthly total says how many bills have no amount. A blended
   live-plus-sample figure is unfalsifiable and therefore worse than a zero.
3. **The proxy is the auth gate, not the layout.** `redirect()` in a layout runs
   *after* the page renders, so the body still ships. When testing auth here,
   **check the body length, not the status code** — unauthenticated pages return
   6 bytes.
4. **Dates are days in `HOME_TZ`.** Nothing calls `toLocaleDateString` directly;
   everything goes through `lib/day.ts`, whose tests run under three server
   timezones. A task ticked at 11pm files under today.
5. **A component names a role, never a literal.** `var(--card)`, `var(--ink)`.
   A hardcoded `#fff` in a component is a bug — every reskin an app like this
   ever gets is a token remap, and literals are what break it.
6. **Colour carries one meaning each.** Green is done, amber is left undone, red
   is overdue, blue is a link. People get their own palette that borrows none of
   those, so a person's colour never reads as a status.
7. **Two people, two records.** The name is the join key; the app refuses to
   rename a person, because a rename orphans every shift and tick already filed
   under the old spelling.

## What this deliberately does NOT do

Written down rather than half-built, so nobody has to guess how far along it is.

- **No bank connection.** `/spending` shows only what somebody recorded in this
  app, and states plainly what a real feed would take (an aggregator account,
  a link flow, a token stored as a credential, a matching rule). It will not
  render an estimated category breakdown from nothing.
- <a id="payroll-note"></a>**No payroll tax, and no view on employee vs
  contractor.** In the US that question has a real answer with real filing
  attached. `/pay` is a record of what was paid; ask an accountant once.
- **No notifications.** Nothing in this app texts, emails, or pushes anybody.
- **No location or geofencing on the clock.** A web page cannot be trusted for
  location, so a browser-side fence would be theatre that reads as proof.
- **No photo upload.** A how-to clip is a pasted share link that lives next to
  the task, not an upload pipeline.

## Layout

```
app/
  (dash)/          the family side — shell, Today, schedule, tasks, kids, pay, bills, spending, people
  team/            the staff side — its own door, its own cookie, phone-first
  api/             every write; each route re-checks which cookie it got and fails closed
  globals.css      the token system; the three rules that keep it standing are at the top
lib/
  day.ts           dates, in the house's timezone (tested under three server zones)
  door.ts          who may open which door — import-free, so every rule is provable
  auth.ts          the family cookie · team-auth.ts  the staff cookie
  people.ts        one roster, one role column
  tasks.ts schedule.ts clock.ts pay.ts bills.ts kids.ts
  guard.ts         the four "who is allowed to write this" checks
  supabase.ts      REST access; no hardcoded project, no anon fallback
proxy.ts           the real front door
scripts/schema.sql the whole database
```

## Deploying

One Vercel project of its own — **never** the `joe-hq` project. Point a new
Vercel project at this repository with **Root Directory set to
`apps/home-manager`**, set the environment from `.env.example`, and give it its
own domain.

If it ever gets its own repository, `git subtree split --prefix=apps/home-manager`
lifts it out whole and the root directory setting goes away.
