// What gets done in the house, and whether it got done.
//
// The two halves that make this worth having over a shared note:
//
// - **A skip needs a reason.** "Didn't happen" tells you nothing. "The dryer
//   was still full" tells you to buy a second hamper. The kiosk refuses to save
//   a skip without one, and that refusal is the feature.
// - **The how-to lives next to the task.** A twenty-second clip of how the
//   shirts get hung, on the task itself — not in a folder tree nobody opens.

import { sbSelect, sbWrite, upsert } from "./supabase.ts";
import { parts } from "./day.ts";

export type Cadence = "daily" | "weekly" | "monthly" | "quarterly" | "yearly" | "once";

export const CADENCES: { key: Cadence; label: string; blurb: string }[] = [
  { key: "daily", label: "Every day", blurb: "The rhythm of the house." },
  { key: "weekly", label: "Weekly", blurb: "Lands on its day each week." },
  { key: "monthly", label: "Monthly", blurb: "Once a month, on its date." },
  { key: "quarterly", label: "Quarterly", blurb: "Jan, Apr, Jul, Oct." },
  { key: "yearly", label: "Yearly", blurb: "The once-a-year jobs." },
  { key: "once", label: "Just once", blurb: "A one-off project on a specific day." },
];

export type Task = {
  id: string;
  title: string;
  area: string | null;
  cadence: Cadence;
  day_of_week: number | null; // 0 = Sunday
  day_of_month: number | null;
  once_date: string | null;
  detail: string | null;
  video_url: string | null;
  /** Whose job this is by default. null = whoever is working. */
  assigned_to: string | null;
  sort_order: number;
  active: boolean;
};

export type TaskLog = {
  id?: string;
  task_id: string;
  for_date: string;
  person: string;
  state: "done" | "skipped";
  reason: string | null;
  note: string | null;
  ts?: string;
};

/** One tap on a phone with wet hands. Free text is always allowed on top. */
export const SKIP_REASONS = [
  "Already done / didn't need it",
  "Something was in the way",
  "Ran out of time",
  "Missing a supply",
  "Someone was using the room",
  "Not sure how — need a video",
  "Other",
];

export const AREAS = [
  "Kitchen",
  "Laundry",
  "Bedrooms",
  "Bathrooms",
  "Living areas",
  "Outside",
  "Pets",
  "Kids",
  "Errands",
];

/**
 * Is this task on the list for this date?
 *
 * Legible rules, not a scheduling engine. The one non-obvious case is on
 * purpose: a monthly task set to the 31st still shows on the last day of a
 * short month, so "change the filters" cannot silently skip February.
 */
export function dueOn(task: Task, date: string): boolean {
  if (!task.active) return false;
  const { y, m, d, dow } = parts(date);
  const lastDay = new Date(Date.UTC(y, m, 0)).getUTCDate();

  switch (task.cadence) {
    case "once":
      return task.once_date === date;
    case "daily":
      return true;
    case "weekly":
      return task.day_of_week == null ? dow === 1 : dow === task.day_of_week;
    case "monthly":
      return d === Math.min(task.day_of_month ?? 1, lastDay);
    case "quarterly":
      if (![0, 3, 6, 9].includes(m - 1)) return false;
      return d === Math.min(task.day_of_month ?? 1, lastDay);
    case "yearly":
      if (m !== 1) return false;
      return d === Math.min(task.day_of_month ?? 1, lastDay);
  }
}

export function tasksFor(tasks: Task[], date: string): Task[] {
  return tasks.filter((t) => dueOn(t, date));
}

const DOW = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export function cadenceLabel(task: Task): string {
  switch (task.cadence) {
    case "once": {
      if (!task.once_date) return "One time";
      const { y, m, d } = parts(task.once_date);
      return `Just ${new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        timeZone: "UTC",
      })}`;
    }
    case "daily":
      return "Every day";
    case "weekly":
      return task.day_of_week == null ? "Weekly" : `Every ${DOW[task.day_of_week]}`;
    case "monthly":
      return task.day_of_month ? `Monthly · the ${ordinal(task.day_of_month)}` : "Monthly";
    case "quarterly":
      return "Quarterly";
    case "yearly":
      return "Once a year";
  }
}

export function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

export type DayStatus = {
  task: Task;
  log: TaskLog | null;
  state: "done" | "skipped" | "open";
};

/** Today's list with each row's outcome attached. */
export function dayBoard(tasks: Task[], log: TaskLog[], date: string): DayStatus[] {
  const due = tasksFor(tasks, date);
  const byTask = new Map(log.filter((l) => l.for_date === date).map((l) => [l.task_id, l]));
  return due.map((task) => {
    const entry = byTask.get(task.id) ?? null;
    return { task, log: entry, state: entry ? entry.state : "open" };
  });
}

export type DayTally = { total: number; done: number; skipped: number; open: number };

export function tally(board: DayStatus[]): DayTally {
  return {
    total: board.length,
    done: board.filter((b) => b.state === "done").length,
    skipped: board.filter((b) => b.state === "skipped").length,
    open: board.filter((b) => b.state === "open").length,
  };
}

/**
 * The sentence under the number.
 *
 * Written so a glance is enough: what is left, and whether anything needs the
 * house to do something about it. Never a percentage — nobody manages a home
 * in percentages.
 */
export function tallyLine(t: DayTally): string {
  if (t.total === 0) return "Nothing is on the list for today.";
  if (t.done === t.total) return "Everything on today's list is handled.";
  const bits: string[] = [];
  if (t.open) bits.push(`${t.open} still open`);
  if (t.skipped) bits.push(`${t.skipped} left with a reason`);
  return bits.join(" · ");
}

/** A task's last 90 days, newest first — "who did it, and when". */
export function historyFor(log: TaskLog[], taskId: string): TaskLog[] {
  return log
    .filter((l) => l.task_id === taskId)
    .sort((a, b) => (a.for_date < b.for_date ? 1 : a.for_date > b.for_date ? -1 : 0));
}

/** Per-person record over a window: what they finished, what they left, why. */
export function personRecord(log: TaskLog[], person: string) {
  const mine = log.filter((l) => l.person === person);
  const skipped = mine.filter((l) => l.state === "skipped");
  const reasons = new Map<string, number>();
  for (const s of skipped) {
    const key = s.reason?.trim() || "No reason given";
    reasons.set(key, (reasons.get(key) ?? 0) + 1);
  }
  return {
    person,
    done: mine.filter((l) => l.state === "done").length,
    skipped: skipped.length,
    reasons: [...reasons.entries()].sort((a, b) => b[1] - a[1]).map(([reason, count]) => ({ reason, count })),
  };
}

/** Validate before writing. A skip with no reason is refused here, not in the UI. */
export function validateLog(input: Partial<TaskLog>): { ok: true; log: TaskLog } | { ok: false; error: string } {
  const task_id = (input.task_id || "").trim();
  if (!task_id) return { ok: false, error: "Which task?" };
  const for_date = (input.for_date || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(for_date)) return { ok: false, error: "Which day?" };
  const person = (input.person || "").trim();
  if (!person) return { ok: false, error: "Who did this?" };
  const state = input.state;
  if (state !== "done" && state !== "skipped") return { ok: false, error: "Done or left undone?" };

  const reason = (input.reason || "").trim();
  if (state === "skipped" && !reason) {
    return { ok: false, error: "Tell us why it didn't happen — that's the part the house needs." };
  }
  return {
    ok: true,
    log: {
      task_id,
      for_date,
      person,
      state,
      reason: state === "skipped" ? reason : null,
      note: (input.note || "").trim() || null,
    },
  };
}

export function validateTask(input: Partial<Task>): { ok: true; task: Omit<Task, "id"> } | { ok: false; error: string } {
  const title = (input.title || "").trim();
  if (!title) return { ok: false, error: "Give the task a name." };
  if (title.length > 140) return { ok: false, error: "That title is too long (140 characters max)." };
  const cadence = input.cadence;
  if (!cadence || !CADENCES.some((c) => c.key === cadence)) return { ok: false, error: "How often?" };
  if (cadence === "once" && !/^\d{4}-\d{2}-\d{2}$/.test(input.once_date || "")) {
    return { ok: false, error: "A one-off task needs the day it happens." };
  }
  const dom = input.day_of_month;
  if (dom != null && (dom < 1 || dom > 31)) return { ok: false, error: "Day of the month has to be 1–31." };
  const dowIn = input.day_of_week;
  if (dowIn != null && (dowIn < 0 || dowIn > 6)) return { ok: false, error: "That isn't a day of the week." };

  return {
    ok: true,
    task: {
      title,
      area: (input.area || "").trim() || null,
      cadence,
      day_of_week: cadence === "weekly" ? dowIn ?? 1 : null,
      day_of_month: cadence === "monthly" || cadence === "quarterly" || cadence === "yearly" ? dom ?? 1 : null,
      once_date: cadence === "once" ? input.once_date! : null,
      detail: (input.detail || "").trim() || null,
      video_url: (input.video_url || "").trim() || null,
      assigned_to: (input.assigned_to || "").trim() || null,
      sort_order: Number.isFinite(input.sort_order) ? Number(input.sort_order) : 100,
      active: input.active ?? true,
    },
  };
}

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

export async function getTasks(opts?: { includeInactive?: boolean }): Promise<Task[]> {
  const q = opts?.includeInactive
    ? "select=*&order=sort_order.asc,title.asc"
    : "select=*&active=eq.true&order=sort_order.asc,title.asc";
  return sbSelect<Task>(`hm_tasks?${q}`);
}

export async function getLog(from: string, to = from): Promise<TaskLog[]> {
  return sbSelect<TaskLog>(
    `hm_task_log?select=*&for_date=gte.${from}&for_date=lte.${to}&order=ts.desc`
  );
}

/** One row per task per day — ticking twice corrects, it never duplicates. */
export async function saveLog(entry: TaskLog) {
  return upsert("hm_task_log", "task_id,for_date", entry);
}

/** Un-tick: the row goes away so the task reads as simply not done yet. */
export async function clearLog(taskId: string, forDate: string) {
  return sbWrite(`hm_task_log?task_id=eq.${taskId}&for_date=eq.${forDate}`, "DELETE");
}

export async function saveTask(task: Omit<Task, "id"> & { id?: string }) {
  if (task.id) return sbWrite(`hm_tasks?id=eq.${task.id}`, "PATCH", task);
  return sbWrite("hm_tasks", "POST", task);
}

export async function setTaskActive(id: string, active: boolean) {
  return sbWrite(`hm_tasks?id=eq.${id}`, "PATCH", { active });
}
