import test from "node:test";
import assert from "node:assert/strict";
import {
  cadenceLabel,
  dayBoard,
  dueOn,
  historyFor,
  personRecord,
  tallyLine,
  tally,
  validateLog,
  validateTask,
  type Task,
  type TaskLog,
} from "./tasks.ts";

function task(over: Partial<Task> = {}): Task {
  return {
    id: over.id ?? "t1",
    title: "Reset the kitchen",
    area: null,
    cadence: "daily",
    day_of_week: null,
    day_of_month: null,
    once_date: null,
    detail: null,
    video_url: null,
    assigned_to: null,
    sort_order: 10,
    active: true,
    ...over,
  };
}

test("daily is every day; an inactive task is never due", () => {
  assert.equal(dueOn(task(), "2026-08-12"), true);
  assert.equal(dueOn(task({ active: false }), "2026-08-12"), false);
});

test("weekly lands on its day, and defaults to Monday", () => {
  const wed = task({ cadence: "weekly", day_of_week: 3 });
  assert.equal(dueOn(wed, "2026-08-12"), true); // Wednesday
  assert.equal(dueOn(wed, "2026-08-13"), false);
  const noDay = task({ cadence: "weekly", day_of_week: null });
  assert.equal(dueOn(noDay, "2026-08-10"), true); // Monday
  assert.equal(dueOn(noDay, "2026-08-12"), false);
});

test("a monthly task on the 31st still lands in February", () => {
  const t = task({ cadence: "monthly", day_of_month: 31 });
  assert.equal(dueOn(t, "2026-01-31"), true);
  assert.equal(dueOn(t, "2026-02-28"), true, "clamps to the real last day");
  assert.equal(dueOn(t, "2026-02-27"), false);
  assert.equal(dueOn(t, "2026-04-30"), true);
});

test("quarterly is Jan/Apr/Jul/Oct only; yearly is January only", () => {
  const q = task({ cadence: "quarterly", day_of_month: 15 });
  assert.equal(dueOn(q, "2026-01-15"), true);
  assert.equal(dueOn(q, "2026-04-15"), true);
  assert.equal(dueOn(q, "2026-05-15"), false);
  const y = task({ cadence: "yearly", day_of_month: 2 });
  assert.equal(dueOn(y, "2026-01-02"), true);
  assert.equal(dueOn(y, "2026-07-02"), false);
});

test("a one-off shows on exactly its day and never comes back", () => {
  const t = task({ cadence: "once", once_date: "2026-08-12" });
  assert.equal(dueOn(t, "2026-08-11"), false);
  assert.equal(dueOn(t, "2026-08-12"), true);
  assert.equal(dueOn(t, "2026-08-13"), false);
});

test("cadenceLabel says the thing out loud", () => {
  assert.equal(cadenceLabel(task()), "Every day");
  assert.equal(cadenceLabel(task({ cadence: "weekly", day_of_week: 5 })), "Every Friday");
  assert.equal(cadenceLabel(task({ cadence: "monthly", day_of_month: 1 })), "Monthly · the 1st");
  assert.equal(cadenceLabel(task({ cadence: "monthly", day_of_month: 22 })), "Monthly · the 22nd");
  assert.equal(cadenceLabel(task({ cadence: "monthly", day_of_month: 13 })), "Monthly · the 13th");
  assert.equal(cadenceLabel(task({ cadence: "once", once_date: "2026-08-12" })), "Just Aug 12");
});

test("the board attaches each outcome and yesterday's tick never counts today", () => {
  const tasks = [task({ id: "a" }), task({ id: "b" }), task({ id: "c" })];
  const log: TaskLog[] = [
    { task_id: "a", for_date: "2026-08-12", person: "Anna", state: "done", reason: null, note: null },
    { task_id: "b", for_date: "2026-08-12", person: "Anna", state: "skipped", reason: "Dryer was full", note: null },
    { task_id: "c", for_date: "2026-08-11", person: "Anna", state: "done", reason: null, note: null },
  ];
  const board = dayBoard(tasks, log, "2026-08-12");
  assert.deepEqual(
    board.map((b) => b.state),
    ["done", "skipped", "open"]
  );
  assert.deepEqual(tally(board), { total: 3, done: 1, skipped: 1, open: 1 });
});

test("the tally line reads like a sentence, never a percentage", () => {
  assert.equal(tallyLine({ total: 0, done: 0, skipped: 0, open: 0 }), "Nothing is on the list for today.");
  assert.equal(tallyLine({ total: 3, done: 3, skipped: 0, open: 0 }), "Everything on today's list is handled.");
  assert.equal(tallyLine({ total: 3, done: 1, skipped: 1, open: 1 }), "1 still open · 1 left with a reason");
});

test("a skip cannot be saved without a reason — that refusal is the feature", () => {
  const bad = validateLog({ task_id: "a", for_date: "2026-08-12", person: "Anna", state: "skipped" });
  assert.equal(bad.ok, false);
  assert.match((bad as { error: string }).error, /why it didn't happen/);

  const good = validateLog({
    task_id: "a",
    for_date: "2026-08-12",
    person: "Anna",
    state: "skipped",
    reason: "Dryer was full",
  });
  assert.equal(good.ok, true);
  assert.equal((good as { log: TaskLog }).log.reason, "Dryer was full");
});

test("a done tick drops any stale reason it was carrying", () => {
  const r = validateLog({
    task_id: "a",
    for_date: "2026-08-12",
    person: "Anna",
    state: "done",
    reason: "left over from a skip",
  });
  assert.equal(r.ok, true);
  assert.equal((r as { log: TaskLog }).log.reason, null);
});

test("validateTask holds the shape of each cadence", () => {
  assert.equal(validateTask({ title: "", cadence: "daily" }).ok, false);
  assert.equal(validateTask({ title: "X", cadence: "once" }).ok, false, "a one-off needs its date");
  assert.equal(validateTask({ title: "X", cadence: "monthly", day_of_month: 44 }).ok, false);

  const weekly = validateTask({ title: "Porch", cadence: "weekly", day_of_week: 5, day_of_month: 9 });
  assert.equal(weekly.ok, true);
  const t = (weekly as { task: Omit<Task, "id"> }).task;
  assert.equal(t.day_of_week, 5);
  assert.equal(t.day_of_month, null, "a weekly task must not carry a day of the month");
});

test("history is newest first and per-person records group the reasons", () => {
  const log: TaskLog[] = [
    { task_id: "a", for_date: "2026-08-10", person: "Anna", state: "done", reason: null, note: null },
    { task_id: "a", for_date: "2026-08-12", person: "Anna", state: "skipped", reason: "Ran out of time", note: null },
    { task_id: "a", for_date: "2026-08-11", person: "Ben", state: "skipped", reason: "Ran out of time", note: null },
    { task_id: "b", for_date: "2026-08-11", person: "Anna", state: "done", reason: null, note: null },
  ];
  assert.deepEqual(
    historyFor(log, "a").map((l) => l.for_date),
    ["2026-08-12", "2026-08-11", "2026-08-10"]
  );
  const anna = personRecord(log, "Anna");
  assert.equal(anna.done, 2);
  assert.equal(anna.skipped, 1);
  assert.deepEqual(anna.reasons, [{ reason: "Ran out of time", count: 1 }]);
});
