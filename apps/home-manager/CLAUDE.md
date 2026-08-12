# Home Manager — notes for whoever works on this next

A household command center: staff schedule, tasks, pay, bills, and the kids'
daily record. Next.js 16 (App Router) + Tailwind v4 + Supabase REST.
`npm run dev` → port **4340**.

## Where this lives, and why it is not in joe-hq

**⛔ It shares NOTHING with the Salisbury Flight Deck** (`Gull-Stack/joe-hq`).
Not a repository, not a table, not a key, not a person. Joe runs his own thing
there; work here must not be able to affect it, and vice versa.

It was briefly built inside `joe-hq/home-manager/` and **that was a mistake** —
it broke the Flight Deck's build within minutes, because joe-hq's root
type-checks `**/*.tsx` and walked straight into this app's `@/lib`. It was
lifted out with `git subtree split`, the PR was closed unmerged, and joe-hq's
`main` never carried a single file of it.

It now lives in `gullstack-skills/apps/`. That is a deliberate placement, not
the top level: this repo's convention is **top-level directory = skill package
with a `SKILL.md`**, and this is a product app, not a skill. `apps/` keeps that
convention honest. `doctor.sh` and `install.sh` both enumerate skills from an
explicit name list rather than a directory glob, so nothing here can be mistaken
for canon — verified by running `doctor.sh` before and after the move and
getting a byte-identical fingerprint.

**If a standalone `Gull-Stack/home-manager` repo is ever created, move it there**
— `git subtree split --prefix=apps/home-manager` lifts it out whole. Keep it
self-contained so that stays a one-command operation: nothing here may import
from the repository around it, and nothing out there may import from here.

Every table is `hm_`-prefixed in a Supabase project of its own, and
`lib/supabase.ts` deliberately has **no hardcoded URL and no anon fallback** —
unset env means "this app has no database", says so on screen, and writes
nothing. A default that happens to point at somebody else's project is how two
households end up in one table. The *structure* was modeled on that app's
household section; none of its data or credentials came across.

## The two doors

| | Family | Team |
| --- | --- | --- |
| Route | `/login` → `/` | `/team` |
| Cookie | `hm_auth` | `hm_team` |
| Marker env | `HM_SECRET` | `HM_TEAM_SECRET` |
| Codes | `HM_PIN_<NAME>` or the roster card | `HM_TEAM_PIN_<NAME>` or the roster card |
| Sees | everything (money is owner-only) | clock, today's list, kids' routine, ask for a day off |

**⛔ No shared code. ⛔ No master code. ⛔ An unset code never means open.**
All three are enforced in `lib/door.ts` and pinned by `lib/door.test.ts`. If you
find yourself adding a fallback that makes local dev easier, you are about to
undo the reason this file exists.

Owner vs adult: owners see `/pay`, `/bills`, `/spending`; adults do not. The
pages redirect AND the API routes re-check — `lib/guard.ts` has the four checks
(`anySignedIn`, `familyOnly`, `ownerOnly`, plus the honest error helpers).

## proxy.ts is the auth gate. The layout is not.

`redirect()` inside a layout runs *after* the page renders, so the body still
ships to a caller with no cookie. `proxy.ts` stops the request first; the
layout's redirect is belt-and-braces and must never be relied on alone.

**When testing auth here, check the BODY LENGTH, not the status code.** A leak
looks like a 307 too. Verified state: every gated page is **307 + 6 bytes**
unauthenticated; every gated API route is a bare 401.

🔴 **Burned once already:** the proxy compared the whole cookie to the marker,
but the cookie is `<name>|<marker>`. Every valid sign-in was bounced and the
symptom was a login screen that looped, not an error anybody could read. Compare
the marker half. There is a comment saying so at the line.

Open by design: `/login`, `/api/auth`, `/team`, `/api/team`. Gate by **cookie in
the route**, never by adding paths here one at a time — that pattern is how the
app this is modeled on killed a week of staff check-offs with a 401 the kiosk
displayed as "that didn't save".

## Rules that are load-bearing

1. **A skip needs a reason.** Enforced in the UI (Save stays disabled), in the
   API (`validateLog`), and in the schema (a CHECK constraint). Three times on
   purpose — it is the single most valuable field in the database.
2. **Never invent a number.** A missing pay rate renders "no rate set", not
   `$0.00`; a monthly bill total states how many bills have no amount;
   `/spending` refuses to estimate. "Nothing owed" and "we don't know" look
   identical on screen and mean opposite things.
3. **Dates are days in `HOME_TZ`.** Everything goes through `lib/day.ts`; its
   tests loop `TZ=UTC / America/Denver / Asia/Tokyo`. Nothing else in the app
   may call `toLocaleDateString` directly.
4. **A component names a role, never a literal** (`var(--card)`, `var(--ink)`).
   The one legitimate white is text on a saturated fill. The skin's three
   standing rules are at the top of `app/globals.css`.
5. **Colour carries one meaning each** — green done, amber left undone, red
   overdue, `--accent` link. `PERSON_PALETTE` borrows none of them, and
   `lib/people.test.ts` fails if somebody adds one that does.
6. **`--blue` is a FILL that carries white; `--accent` is the LINK tint.** Never
   fill a control with `--accent` and put white on it.
7. **A person's name is the join key.** The app refuses to rename — a rename
   orphans every shift, tick and payment already filed under the old spelling.
8. **`return=representation` on every write.** PostgREST answers a
   policy-refused DELETE with 200-and-nothing, so "did it work" cannot be read
   off the status code. Asking for the rows back turns a silent refusal into a
   visible zero. `lib/supabase.ts` does this centrally.

## What is deliberately absent

Do not "finish" these without a decision — each is written down in the product,
in the place the user would look:

- **Bank connection / live spending.** `/spending` states exactly what it would
  take. It will not render a category chart from nothing.
- **Payroll tax, W-2 vs 1099.** `/pay` records payments and says plainly that it
  does not handle the tax question.
- **Notifications.** Nothing here texts, emails, or pushes.
- **Geofencing on the clock.** A web page cannot be trusted for location; a
  browser-side fence is theatre.
- **Seed data.** Not one name, not one task. See the bottom of `schema.sql`.

## Verification record (2026-08-12, first build)

- 93/93 unit tests, `tsc --noEmit` clean, production build green.
- Live route battery against `npm start`: every gated page 307 + **6 bytes**
  unauthenticated; six API routes bare 401; wrong code / empty code / unknown
  name all 401; correct code 200 and every page renders signed in.
- Security headers present on every response (CSP with `frame-ancestors 'none'`,
  nosniff, HSTS, `X-Frame-Options: DENY`, Permissions-Policy).
- Screenshots judged at 1280 and 390 for all eight family pages plus the team
  door, both empty and populated.
- Reads and writes exercised end to end against a local PostgREST-shaped mock:
  the roster drove both doors (only owners/adults on `/login`, only staff on
  `/team`); a roster code worked and another person's code did not; an adult was
  redirected off all three money pages and got "owner-only" from their APIs; a
  staff cookie got 307 + 6 bytes on the family side; a skip with no reason was
  refused and the same task ticked twice corrected rather than duplicated.
- 🔴 **Two real bugs were found this way and fixed** — the proxy cookie
  comparison, and the kiosk clock closing a stale shift (both written up above /
  in `lib/clock.ts`). Both now have a regression test.
- **Not yet exercised: a real Supabase project.** None existed in the session,
  so PostgREST's real behaviour (RLS refusals, constraint violations, the
  silent-204 trap) is unproven. The first real run is still the proof.

⚠️ **Port gotcha, same as every Next app:** `pkill -f "next start"` kills the npm
wrapper and can leave the port-4340 worker alive serving a **stale build**. The
new server 500s on EADDRINUSE into a log nobody reads and the screenshots come
back wrong. Kill by PID from `lsof -tnP -iTCP:4340 -sTCP:LISTEN`.

## Next, roughly in order

1. Point it at a real Supabase project and run `scripts/schema.sql`.
2. Fill the roster, standing days, the first few tasks and one routine per child.
3. A month view on `/schedule` (the week grid is the home base; the month is for
   planning further out).
4. Decide on the bank connection — the requirements are on `/spending`.
