// Dates, in the house's timezone. Import-free so every rule here is unit-tested
// directly under TZ=UTC / TZ=Denver / TZ=Tokyo.
//
// This file exists because of a bug class that bit the Salisbury build twice: a
// date formatted with no `timeZone` renders in the SERVER's zone, so a task
// checked off at 9:48 PM landed on tomorrow's list once it was deployed. Every
// date string in this app is a `YYYY-MM-DD` in HOME_TZ, and every clock face is
// formatted through `timeLabel`. Nothing calls `toLocaleDateString` directly.

/** The house's wall clock. One env var, read once per call so tests can set it. */
export function homeTz(): string {
  return process.env.HOME_TZ || "America/Denver";
}

/** Short zone label for the UI ("MT", "ET", "PT"…) so a time is never ambiguous. */
export function tzLabel(at: Date = new Date(), tz = homeTz()): string {
  const part = new Intl.DateTimeFormat("en-US", { timeZone: tz, timeZoneName: "short" })
    .formatToParts(at)
    .find((p) => p.type === "timeZoneName");
  return part?.value ?? "";
}

/** Today in the house's zone, as YYYY-MM-DD. */
export function today(tz = homeTz()): string {
  return new Date().toLocaleDateString("en-CA", { timeZone: tz });
}

/** The YYYY-MM-DD an instant falls on, in the house's zone. */
export function dateOf(at: Date | string | number, tz = homeTz()): string {
  return new Date(at).toLocaleDateString("en-CA", { timeZone: tz });
}

/** Split a YYYY-MM-DD without letting the local zone shift it. */
export function parts(date: string): { y: number; m: number; d: number; dow: number } {
  const [y, m, d] = date.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return { y, m, d, dow: dt.getUTCDay() };
}

/** Calendar arithmetic on a YYYY-MM-DD. Always UTC-anchored — no DST drift. */
export function shiftDate(date: string, days: number): string {
  const { y, m, d } = parts(date);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

/** Whole days from `from` to `to` (negative = in the past). */
export function daysBetween(from: string, to: string): number {
  const a = parts(from);
  const b = parts(to);
  const ms = Date.UTC(b.y, b.m - 1, b.d) - Date.UTC(a.y, a.m - 1, a.d);
  return Math.round(ms / 86_400_000);
}

/** Monday of the week a date falls in. The house week starts Monday. */
export function weekStart(date: string): string {
  const { dow } = parts(date);
  return shiftDate(date, dow === 0 ? -6 : 1 - dow);
}

/** First day of the month a date falls in. */
export function monthStart(date: string): string {
  const { y, m } = parts(date);
  return `${y}-${String(m).padStart(2, "0")}-01`;
}

/** Last calendar day of that month (28–31). */
export function lastDayOfMonth(date: string): number {
  const { y, m } = parts(date);
  return new Date(Date.UTC(y, m, 0)).getUTCDate();
}

const DOW_LONG = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const DOW_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function dowName(dow: number, short = false): string {
  return (short ? DOW_SHORT : DOW_LONG)[dow] ?? "";
}

/** "Tue, Aug 12" — a date, never a time, so the zone can't move it. */
export function dateLabel(date: string, opts?: { weekday?: boolean; year?: boolean }): string {
  const { y, m, d } = parts(date);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
    weekday: opts?.weekday === false ? undefined : "short",
    month: "short",
    day: "numeric",
    year: opts?.year ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

/** "August" / "August 2026" — a month, not the 1st of it. */
export function monthLabel(date: string, opts?: { year?: boolean }): string {
  const { y, m } = parts(date);
  return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-US", {
    month: "long",
    year: opts?.year ? "numeric" : undefined,
    timeZone: "UTC",
  });
}

/** "3:03 PM MT" — an instant, rendered on the house's wall clock. */
export function timeLabel(at: Date | string | number, tz = homeTz()): string {
  const dt = new Date(at);
  const clock = dt.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: tz,
  });
  return `${clock} ${tzLabel(dt, tz)}`.trim();
}

/** "Today" / "Yesterday" / "Tue, Aug 12" — relative to the house's today. */
export function friendlyDate(date: string, ref = today()): string {
  const diff = daysBetween(ref, date);
  if (diff === 0) return "Today";
  if (diff === -1) return "Yesterday";
  if (diff === 1) return "Tomorrow";
  return dateLabel(date);
}

/** "in 3 days" / "3 days ago" / "today" — for bills and time off. */
export function relativeDays(date: string, ref = today()): string {
  const diff = daysBetween(ref, date);
  if (diff === 0) return "today";
  if (diff === 1) return "tomorrow";
  if (diff === -1) return "yesterday";
  if (diff > 0) return `in ${diff} days`;
  return `${Math.abs(diff)} days ago`;
}

/** The seven YYYY-MM-DDs of the week that starts on `monday`. */
export function weekDates(monday: string): string[] {
  return Array.from({ length: 7 }, (_, i) => shiftDate(monday, i));
}
