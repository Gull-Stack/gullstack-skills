// Who is coming, and when.
//
// Three layers, resolved in this order, because that is how a household
// actually talks about it:
//
//   standing days  ("Anna is here Monday, Wednesday, Friday")
//   ± overrides    ("she's swapping Wednesday for Thursday this week")
//   − time off     ("she asked for the 14th and I said yes")
//
// A swap is two overrides, not an edit to the standing pattern — so next week
// goes back to normal by itself, which is what everybody expects and nobody
// remembers to do by hand.

import { sbSelect, sbWrite, upsert } from "./supabase.ts";
import { dowName, parts, weekDates } from "./day.ts";
import { dueOn, type Task, type TaskLog } from "./tasks.ts";

export type DefaultDay = { person: string; dow: number };
export type Shift = { person: string; for_date: string; state: "on" | "off"; note?: string | null };
export type TimeOff = {
  id?: string;
  person: string;
  from_date: string;
  to_date: string;
  note: string | null;
  status: "pending" | "approved" | "denied";
  ts?: string;
};

/** Does this approved request cover this day? */
export function coversDate(off: TimeOff, date: string): boolean {
  return off.status === "approved" && off.from_date <= date && date <= off.to_date;
}

/**
 * Who works on a given day.
 *
 * defaults ∪ explicit "on" − explicit "off" − approved time off.
 * Order matters: an approved day off beats a swap-on, because saying yes to
 * leave and then rostering somebody anyway is the worst of the four outcomes.
 */
export function whoWorks(
  date: string,
  defaults: DefaultDay[],
  overrides: Shift[],
  timeOff: TimeOff[],
  order: string[] = []
): string[] {
  const { dow } = parts(date);
  const set = new Set(defaults.filter((d) => d.dow === dow).map((d) => d.person));

  for (const o of overrides) {
    if (o.for_date !== date) continue;
    if (o.state === "on") set.add(o.person);
    else set.delete(o.person);
  }
  for (const off of timeOff) {
    if (coversDate(off, date)) set.delete(off.person);
  }

  const names = [...set];
  if (!order.length) return names.sort();
  return names.sort((a, b) => {
    const ia = order.indexOf(a);
    const ib = order.indexOf(b);
    return (ia === -1 ? 999 : ia) - (ib === -1 ? 999 : ib);
  });
}

export type DayColumn = {
  date: string;
  dow: number;
  dowLabel: string;
  isToday: boolean;
  isPast: boolean;
  who: string[];
  /** Anyone with approved leave that day — shown, not hidden, so a thin day reads as explained. */
  off: string[];
  tasks: { id: string; title: string; state: "done" | "skipped" | "open"; person: string | null }[];
  openCount: number;
};

/** The week, seven columns wide, with the tasks sitting on their own day. */
export function assembleWeek(input: {
  monday: string;
  today: string;
  tasks: Task[];
  log: TaskLog[];
  defaults: DefaultDay[];
  overrides: Shift[];
  timeOff: TimeOff[];
  order?: string[];
}): DayColumn[] {
  const { monday, today, tasks, log, defaults, overrides, timeOff, order = [] } = input;

  return weekDates(monday).map((date) => {
    const { dow } = parts(date);
    const dayLog = log.filter((l) => l.for_date === date);
    const byTask = new Map(dayLog.map((l) => [l.task_id, l]));

    const dayTasks = tasks
      .filter((t) => dueOn(t, date))
      .map((t) => {
        const entry = byTask.get(t.id);
        return {
          id: t.id,
          title: t.title,
          state: (entry ? entry.state : "open") as "done" | "skipped" | "open",
          person: entry?.person ?? t.assigned_to ?? null,
        };
      });

    return {
      date,
      dow,
      dowLabel: dowName(dow, true),
      isToday: date === today,
      isPast: date < today,
      who: whoWorks(date, defaults, overrides, timeOff, order),
      off: timeOff.filter((o) => coversDate(o, date)).map((o) => o.person),
      tasks: dayTasks,
      openCount: dayTasks.filter((t) => t.state === "open").length,
    };
  });
}

/**
 * A swap is symmetric: one person off that day, another on.
 *
 * Returned as the two rows to write rather than written here, so the caller can
 * show exactly what is about to change before it happens.
 */
export function swapRows(date: string, offPerson: string, onPerson: string): Shift[] {
  const rows: Shift[] = [];
  if (offPerson) rows.push({ person: offPerson, for_date: date, state: "off" });
  if (onPerson && onPerson !== offPerson) rows.push({ person: onPerson, for_date: date, state: "on" });
  return rows;
}

/** Days in a week nobody is scheduled for. Coverage, stated honestly. */
export function uncoveredDays(week: DayColumn[]): DayColumn[] {
  return week.filter((d) => d.who.length === 0 && d.tasks.length > 0);
}

export function validateTimeOff(
  input: Partial<TimeOff>
): { ok: true; request: Omit<TimeOff, "id" | "ts"> } | { ok: false; error: string } {
  const person = (input.person || "").trim();
  if (!person) return { ok: false, error: "Who is asking?" };
  const from_date = (input.from_date || "").trim();
  const to_date = (input.to_date || from_date).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from_date)) return { ok: false, error: "Pick a first day." };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(to_date)) return { ok: false, error: "Pick a last day." };
  if (to_date < from_date) return { ok: false, error: "The last day can't be before the first." };
  const status = input.status || "pending";
  if (!["pending", "approved", "denied"].includes(status)) return { ok: false, error: "Unknown status." };
  return {
    ok: true,
    request: { person, from_date, to_date, note: (input.note || "").trim() || null, status },
  };
}

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

export async function getDefaults(): Promise<DefaultDay[]> {
  return sbSelect<DefaultDay>("hm_default_days?select=person,dow");
}

export async function setDefaults(person: string, dows: number[]) {
  const clear = await sbWrite(`hm_default_days?person=eq.${encodeURIComponent(person)}`, "DELETE");
  if (!clear.ok) return clear;
  if (!dows.length) return clear;
  return sbWrite("hm_default_days", "POST", dows.map((dow) => ({ person, dow })));
}

export async function getOverrides(from: string, to: string): Promise<Shift[]> {
  return sbSelect<Shift>(`hm_shifts?select=*&for_date=gte.${from}&for_date=lte.${to}`);
}

export async function saveShift(row: Shift) {
  return upsert("hm_shifts", "person,for_date", row);
}

export async function clearShift(person: string, date: string) {
  return sbWrite(
    `hm_shifts?person=eq.${encodeURIComponent(person)}&for_date=eq.${date}`,
    "DELETE"
  );
}

export async function getTimeOff(from: string, to: string): Promise<TimeOff[]> {
  return sbSelect<TimeOff>(
    `hm_time_off?select=*&to_date=gte.${from}&from_date=lte.${to}&order=from_date.asc`
  );
}

export async function requestTimeOff(request: Omit<TimeOff, "id" | "ts">) {
  return sbWrite("hm_time_off", "POST", request);
}

export async function setTimeOffStatus(id: string, status: TimeOff["status"]) {
  return sbWrite(`hm_time_off?id=eq.${id}`, "PATCH", { status });
}
