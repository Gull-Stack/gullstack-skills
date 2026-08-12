// The clock: when someone arrived and when they left.
//
// This is what turns "she was here a lot this week" into a number you can pay
// against. It does not accuse anybody of anything — it stops the house from
// having to guess, and it stops the person working from having to remember.
//
// ⛔ Geofencing is NOT here and must not be faked. A web page cannot be trusted
// for location; a browser-side fence would be theatre that reads as proof.
//
// Import-free on purpose (except day helpers): every rule is unit-tested.

export type ClockRow = {
  id?: string;
  person: string;
  for_date: string;
  in_at: string;
  out_at: string | null;
  /** Set when the house closed a shift somebody forgot to end. */
  closed_by?: string | null;
  note?: string | null;
};

export function isOpen(row: ClockRow): boolean {
  return !row.out_at;
}

export function openShift(rows: ClockRow[], person: string): ClockRow | null {
  return rows.find((r) => r.person === person && isOpen(r)) ?? null;
}

/**
 * The shift this person has running TODAY.
 *
 * 🔴 The kiosk must use this and not `openShift`. Somebody forgets to clock out
 * roughly once a month, so a person can easily have an open row from two days
 * ago; `openShift` returns that one, and then "clock out" stamps it with *now*
 * and writes a fifty-hour shift onto a payslip. A stale shift belongs to the
 * household's fix-it flow, which asks what time they actually left and records
 * who adjusted it.
 */
export function openShiftOn(rows: ClockRow[], person: string, date: string): ClockRow | null {
  return rows.find((r) => r.person === person && r.for_date === date && isOpen(r)) ?? null;
}

/** Minutes on one shift. An open one measures to `now`, so it ticks up on screen. */
export function shiftMinutes(row: ClockRow, now: number): number {
  const start = new Date(row.in_at).getTime();
  if (Number.isNaN(start)) return 0;
  const end = row.out_at ? new Date(row.out_at).getTime() : now;
  if (Number.isNaN(end) || end <= start) return 0;
  return Math.floor((end - start) / 60_000);
}

export function minutesFor(rows: ClockRow[], person: string, from: string, to: string, now: number): number {
  return rows
    .filter((r) => r.person === person && r.for_date >= from && r.for_date <= to)
    .reduce((sum, r) => sum + shiftMinutes(r, now), 0);
}

export function dayMinutes(rows: ClockRow[], person: string, date: string, now: number): number {
  return minutesFor(rows, person, date, date, now);
}

/**
 * "2h 15m" · "45m" · "just started".
 *
 * Never "0h 0m" — that reads like a bug. Never a decimal hour — nobody standing
 * in a kitchen wants to read 1.75.
 */
export function durationLabel(minutes: number): string {
  if (minutes < 1) return "just started";
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m === 0 ? `${h}h` : `${h}h ${m}m`;
}

/** The same duration as a TOTAL. "just started" is wrong in a summary. */
export function totalLabel(minutes: number): string {
  if (minutes <= 0) return "0h";
  return durationLabel(minutes);
}

/** Decimal hours, rounded to the nearest minute's worth — for pay math only. */
export function toHours(minutes: number): number {
  return Math.round((minutes / 60) * 100) / 100;
}

/**
 * A shift left running overnight.
 *
 * Somebody forgets to clock out roughly once a month, and left alone it turns
 * into a 14-hour day on a payslip. Flagging it is the whole answer: the house
 * closes it with the real time, and the row records who did that.
 */
export function staleShifts(rows: ClockRow[], today: string): ClockRow[] {
  return rows.filter((r) => isOpen(r) && r.for_date < today);
}

export type WhoIsHere = { person: string; since: string; minutes: number };

export function whoIsHere(rows: ClockRow[], now: number): WhoIsHere[] {
  return rows
    .filter(isOpen)
    .map((r) => ({ person: r.person, since: r.in_at, minutes: shiftMinutes(r, now) }))
    .sort((a, b) => a.minutes - b.minutes);
}

/** Per-person totals over a window, biggest first. */
export function totalsByPerson(
  rows: ClockRow[],
  from: string,
  to: string,
  now: number
): { person: string; minutes: number }[] {
  const names = [...new Set(rows.map((r) => r.person))];
  return names
    .map((person) => ({ person, minutes: minutesFor(rows, person, from, to, now) }))
    .filter((t) => t.minutes > 0)
    .sort((a, b) => b.minutes - a.minutes);
}
