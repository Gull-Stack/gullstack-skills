// The children's day, and what it adds up to.
//
// Two different things live here and they must not be confused, because they
// answer different questions:
//
//   ROUTINE  — the things that should happen every day. Read. Clean up. Eat a
//              real lunch. The log is a tick per child per routine per day, so
//              "did she read yesterday" has one answer, not an opinion.
//   MILESTONE — the things that happened once. First time she read a chapter
//              book on her own. These are written by a person, never inferred
//              from a streak, because a streak is arithmetic and a milestone is
//              a judgement.
//
// ⛔ Nothing here scores a child, ranks siblings, or turns a missed day into a
// red mark. A missed day is grey. The streak exists to notice a good run, not
// to punish breaking one — a seven-year-old does not need a compliance
// dashboard, and neither does the adult reading it at 9pm.

import { sbSelect, sbWrite, upsert } from "./supabase.ts";
import { parts, shiftDate } from "./day.ts";

export type RoutineKind = "reading" | "meal" | "cleanup" | "activity" | "learning" | "other";

export const ROUTINE_KINDS: { key: RoutineKind; label: string; blurb: string }[] = [
  { key: "reading", label: "Reading", blurb: "Minutes with a book." },
  { key: "meal", label: "Meal", blurb: "Ate a real one." },
  { key: "cleanup", label: "Clean up", blurb: "Put their own things away." },
  { key: "activity", label: "Activity", blurb: "Outside, sport, practice, lesson." },
  { key: "learning", label: "Learning", blurb: "Homework, practice, screen-free work." },
  { key: "other", label: "Other", blurb: "Anything else that should happen." },
];

export type Routine = {
  id: string;
  child: string;
  label: string;
  kind: RoutineKind;
  /** Minutes it should take, when that's the point (reading). null = just a tick. */
  target_minutes: number | null;
  /** "daily", or specific days of the week. */
  cadence: "daily" | "weekly";
  day_of_week: number | null;
  sort_order: number;
  active: boolean;
};

export type KidLog = {
  id?: string;
  routine_id: string;
  child: string;
  for_date: string;
  state: "done" | "missed";
  minutes: number | null;
  note: string | null;
  logged_by: string;
  ts?: string;
};

export type KidNote = {
  id?: string;
  child: string;
  for_date: string;
  kind: "milestone" | "note";
  body: string;
  logged_by: string;
  ts?: string;
};

export function routineDueOn(routine: Routine, date: string): boolean {
  if (!routine.active) return false;
  if (routine.cadence === "daily") return true;
  const { dow } = parts(date);
  return routine.day_of_week == null ? dow === 1 : dow === routine.day_of_week;
}

export type RoutineStatus = {
  routine: Routine;
  log: KidLog | null;
  state: "done" | "missed" | "open";
};

/** One child's routines for one day, with the tick attached. */
export function childDay(routines: Routine[], log: KidLog[], child: string, date: string): RoutineStatus[] {
  const mine = routines.filter((r) => r.child === child && routineDueOn(r, date));
  const byRoutine = new Map(
    log.filter((l) => l.child === child && l.for_date === date).map((l) => [l.routine_id, l])
  );
  return mine.map((routine) => {
    const entry = byRoutine.get(routine.id) ?? null;
    return { routine, log: entry, state: entry ? entry.state : "open" };
  });
}

/**
 * How many days in a row this routine has been done, counting back from `date`.
 *
 * Today not being ticked yet does NOT break the streak — the day isn't over. A
 * streak that resets at midnight and un-resets at bedtime would be noise.
 */
export function streak(log: KidLog[], routineId: string, date: string): number {
  const done = new Set(
    log.filter((l) => l.routine_id === routineId && l.state === "done").map((l) => l.for_date)
  );
  let count = 0;
  let cursor = done.has(date) ? date : shiftDate(date, -1);
  while (done.has(cursor)) {
    count += 1;
    cursor = shiftDate(cursor, -1);
  }
  return count;
}

/** Days done out of days due across a window — the honest version of a score. */
export function completion(
  routines: Routine[],
  log: KidLog[],
  routineId: string,
  from: string,
  to: string
): { done: number; due: number } {
  const routine = routines.find((r) => r.id === routineId);
  if (!routine) return { done: 0, due: 0 };
  let due = 0;
  for (let d = from; d <= to; d = shiftDate(d, 1)) {
    if (routineDueOn(routine, d)) due += 1;
  }
  const done = log.filter(
    (l) => l.routine_id === routineId && l.state === "done" && l.for_date >= from && l.for_date <= to
  ).length;
  return { done, due };
}

/** Total minutes on a kind (reading, mostly) across a window. */
export function minutesOn(
  routines: Routine[],
  log: KidLog[],
  child: string,
  kind: RoutineKind,
  from: string,
  to: string
): number {
  const ids = new Set(routines.filter((r) => r.child === child && r.kind === kind).map((r) => r.id));
  return log
    .filter((l) => ids.has(l.routine_id) && l.state === "done" && l.for_date >= from && l.for_date <= to)
    .reduce((sum, l) => sum + (l.minutes ?? 0), 0);
}

export type ChildSummary = {
  child: string;
  todayDone: number;
  todayDue: number;
  readingMinutesWeek: number;
  bestStreak: { label: string; days: number } | null;
};

/** The one line per child that goes on the home page. */
export function summarize(
  routines: Routine[],
  log: KidLog[],
  child: string,
  today: string
): ChildSummary {
  const day = childDay(routines, log, child, today);
  const weekAgo = shiftDate(today, -6);
  const streaks = routines
    .filter((r) => r.child === child && r.active)
    .map((r) => ({ label: r.label, days: streak(log, r.id, today) }))
    .sort((a, b) => b.days - a.days);

  return {
    child,
    todayDone: day.filter((d) => d.state === "done").length,
    todayDue: day.length,
    readingMinutesWeek: minutesOn(routines, log, child, "reading", weekAgo, today),
    bestStreak: streaks.length && streaks[0].days > 1 ? streaks[0] : null,
  };
}

export function validateRoutine(
  input: Partial<Routine>
): { ok: true; routine: Omit<Routine, "id"> } | { ok: false; error: string } {
  const child = (input.child || "").trim();
  if (!child) return { ok: false, error: "Which child?" };
  const label = (input.label || "").trim();
  if (!label) return { ok: false, error: "What should happen?" };
  if (label.length > 100) return { ok: false, error: "That's too long (100 characters max)." };
  const kind = input.kind;
  if (!kind || !ROUTINE_KINDS.some((k) => k.key === kind)) return { ok: false, error: "Pick a kind." };
  const target = input.target_minutes;
  if (target != null && (!Number.isFinite(target) || target < 0 || target > 1440)) {
    return { ok: false, error: "Those minutes don't look right." };
  }
  const cadence = input.cadence === "weekly" ? "weekly" : "daily";
  const dow = input.day_of_week;
  if (cadence === "weekly" && dow != null && (dow < 0 || dow > 6)) {
    return { ok: false, error: "That isn't a day of the week." };
  }
  return {
    ok: true,
    routine: {
      child,
      label,
      kind,
      target_minutes: target ?? null,
      cadence,
      day_of_week: cadence === "weekly" ? dow ?? 1 : null,
      sort_order: Number.isFinite(input.sort_order) ? Number(input.sort_order) : 100,
      active: input.active ?? true,
    },
  };
}

export function validateKidLog(input: Partial<KidLog>): { ok: true; log: KidLog } | { ok: false; error: string } {
  const routine_id = (input.routine_id || "").trim();
  if (!routine_id) return { ok: false, error: "Which routine?" };
  const child = (input.child || "").trim();
  if (!child) return { ok: false, error: "Which child?" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.for_date || "")) return { ok: false, error: "Which day?" };
  const state = input.state === "missed" ? "missed" : "done";
  const minutes = input.minutes;
  if (minutes != null && (!Number.isFinite(minutes) || minutes < 0 || minutes > 1440)) {
    return { ok: false, error: "Those minutes don't look right." };
  }
  const logged_by = (input.logged_by || "").trim();
  if (!logged_by) return { ok: false, error: "Who is logging this?" };
  return {
    ok: true,
    log: {
      routine_id,
      child,
      for_date: input.for_date!,
      state,
      minutes: state === "done" ? minutes ?? null : null,
      note: (input.note || "").trim() || null,
      logged_by,
    },
  };
}

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

export async function getRoutines(opts?: { includeInactive?: boolean }): Promise<Routine[]> {
  const q = opts?.includeInactive
    ? "select=*&order=child.asc,sort_order.asc"
    : "select=*&active=eq.true&order=child.asc,sort_order.asc";
  return sbSelect<Routine>(`hm_kid_routines?${q}`);
}

export async function getKidLog(from: string, to = from): Promise<KidLog[]> {
  return sbSelect<KidLog>(`hm_kid_log?select=*&for_date=gte.${from}&for_date=lte.${to}&order=ts.desc`);
}

export async function getKidNotes(from: string, to: string): Promise<KidNote[]> {
  return sbSelect<KidNote>(
    `hm_kid_notes?select=*&for_date=gte.${from}&for_date=lte.${to}&order=for_date.desc,ts.desc`
  );
}

export async function saveRoutine(routine: Omit<Routine, "id"> & { id?: string }) {
  if (routine.id) return sbWrite(`hm_kid_routines?id=eq.${routine.id}`, "PATCH", routine);
  return sbWrite("hm_kid_routines", "POST", routine);
}

export async function setRoutineActive(id: string, active: boolean) {
  return sbWrite(`hm_kid_routines?id=eq.${id}`, "PATCH", { active });
}

/** One tick per routine per day. Ticking again corrects it. */
export async function saveKidLog(entry: KidLog) {
  return upsert("hm_kid_log", "routine_id,for_date", entry);
}

export async function clearKidLog(routineId: string, forDate: string) {
  return sbWrite(`hm_kid_log?routine_id=eq.${routineId}&for_date=eq.${forDate}`, "DELETE");
}

export async function saveKidNote(note: Omit<KidNote, "id" | "ts">) {
  return sbWrite("hm_kid_notes", "POST", note);
}
