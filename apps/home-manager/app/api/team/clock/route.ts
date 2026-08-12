import { anySignedIn, badRequest, fromDb, unauthorized } from "@/lib/guard";
import { clockIn, clockOut, getOpenClock } from "@/lib/pay";
import { openShiftOn } from "@/lib/clock";
import { dateOf } from "@/lib/day";

export const dynamic = "force-dynamic";

/**
 * Clock in and out.
 *
 * The person is taken from the cookie, never from the request body — a clock
 * you can punch on somebody else's behalf is not a clock. The timestamp is the
 * SERVER's clock for the same reason: a phone with the wrong time (or a hand on
 * the settings screen) must not be able to write a longer shift.
 *
 * 🔴 Everything here is scoped to TODAY, and that is load-bearing. Somebody
 * forgets to clock out roughly once a month, so an open row from two days ago
 * is a normal state. Un-scoped, "clock out" would close THAT row and stamp it
 * with now — a fifty-hour shift on a payslip — and "clock in" would see it and
 * report "already clocked in", leaving her unable to start her actual day. A
 * stale shift belongs to the household's fix-it flow on /pay, which asks what
 * time they really left and records who adjusted it.
 */
export async function POST(req: Request) {
  const who = await anySignedIn();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(body.action || "");
  const at = new Date().toISOString();
  const today = dateOf(at);

  const open = await getOpenClock();
  const mine = openShiftOn(open, who.name, today);

  if (action === "in") {
    // Already running is not an error — it is the same person tapping twice on
    // a slow connection. Report the truth instead of opening a second shift.
    if (mine) return Response.json({ ok: true, already: true, since: mine.in_at });
    return fromDb(await clockIn(who.name, today, at));
  }

  if (action === "out") {
    if (!mine?.id) return badRequest("You're not clocked in right now.");
    return fromDb(await clockOut(mine.id, at));
  }

  return badRequest("Clock in or clock out?");
}
