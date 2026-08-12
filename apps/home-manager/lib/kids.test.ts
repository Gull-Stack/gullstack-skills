import test from "node:test";
import assert from "node:assert/strict";
import {
  childDay,
  completion,
  minutesOn,
  routineDueOn,
  streak,
  summarize,
  validateKidLog,
  validateRoutine,
  type KidLog,
  type Routine,
} from "./kids.ts";

function routine(over: Partial<Routine> = {}): Routine {
  return {
    id: over.id ?? "r1",
    child: "Nora",
    label: "Read for 20 minutes",
    kind: "reading",
    target_minutes: 20,
    cadence: "daily",
    day_of_week: null,
    sort_order: 10,
    active: true,
    ...over,
  };
}

function done(routineId: string, date: string, over: Partial<KidLog> = {}): KidLog {
  return {
    routine_id: routineId,
    child: "Nora",
    for_date: date,
    state: "done",
    minutes: null,
    note: null,
    logged_by: "Anna",
    ...over,
  };
}

test("a daily routine is due every day; a weekly one only on its day", () => {
  assert.equal(routineDueOn(routine(), "2026-08-12"), true);
  const weekly = routine({ cadence: "weekly", day_of_week: 6 });
  assert.equal(routineDueOn(weekly, "2026-08-15"), true); // Saturday
  assert.equal(routineDueOn(weekly, "2026-08-12"), false);
  assert.equal(routineDueOn(routine({ active: false }), "2026-08-12"), false);
});

test("a child's day shows only their own routines, with the tick attached", () => {
  const routines = [
    routine({ id: "read" }),
    routine({ id: "tidy", label: "Put toys away", kind: "cleanup", target_minutes: null }),
    routine({ id: "sibling", child: "Theo" }),
  ];
  const log = [done("read", "2026-08-12", { minutes: 25 })];
  const day = childDay(routines, log, "Nora", "2026-08-12");
  assert.deepEqual(day.map((d) => d.routine.id), ["read", "tidy"]);
  assert.equal(day[0].state, "done");
  assert.equal(day[0].log?.minutes, 25);
  assert.equal(day[1].state, "open");
});

test("a streak counts back from yesterday when today is not ticked yet", () => {
  const log = [
    done("read", "2026-08-09"),
    done("read", "2026-08-10"),
    done("read", "2026-08-11"),
  ];
  // The day is not over — an un-ticked today must not read as a broken streak.
  assert.equal(streak(log, "read", "2026-08-12"), 3);
  assert.equal(streak([...log, done("read", "2026-08-12")], "read", "2026-08-12"), 4);
});

test("a real gap breaks the streak", () => {
  const log = [done("read", "2026-08-08"), done("read", "2026-08-10"), done("read", "2026-08-11")];
  assert.equal(streak(log, "read", "2026-08-12"), 2);
  assert.equal(streak([], "read", "2026-08-12"), 0);
});

test("a missed day is not a done day", () => {
  const log = [done("read", "2026-08-10"), done("read", "2026-08-11", { state: "missed" })];
  assert.equal(streak(log, "read", "2026-08-12"), 0);
});

test("completion is done-out-of-due, counting only the days it was actually due", () => {
  const routines = [routine({ id: "sat", cadence: "weekly", day_of_week: 6 })];
  const log = [done("sat", "2026-08-08"), done("sat", "2026-08-15")];
  // Aug 3–16 contains two Saturdays.
  assert.deepEqual(completion(routines, log, "sat", "2026-08-03", "2026-08-16"), { done: 2, due: 2 });
  assert.deepEqual(completion(routines, log, "sat", "2026-08-03", "2026-08-09"), { done: 1, due: 1 });
  assert.deepEqual(completion(routines, [], "missing-id", "2026-08-03", "2026-08-09"), { done: 0, due: 0 });
});

test("reading minutes total only the done days, and only that child's", () => {
  const routines = [
    routine({ id: "read" }),
    routine({ id: "theo-read", child: "Theo" }),
    routine({ id: "tidy", kind: "cleanup" }),
  ];
  const log = [
    done("read", "2026-08-10", { minutes: 20 }),
    done("read", "2026-08-11", { minutes: 30 }),
    done("read", "2026-08-12", { state: "missed", minutes: 99 }),
    done("theo-read", "2026-08-10", { child: "Theo", minutes: 45 }),
    done("tidy", "2026-08-10"),
  ];
  assert.equal(minutesOn(routines, log, "Nora", "reading", "2026-08-06", "2026-08-12"), 50);
  assert.equal(minutesOn(routines, log, "Theo", "reading", "2026-08-06", "2026-08-12"), 45);
});

test("the home-page summary is one honest line per child", () => {
  const routines = [routine({ id: "read" }), routine({ id: "tidy", kind: "cleanup", target_minutes: null })];
  const log = [
    done("read", "2026-08-10", { minutes: 20 }),
    done("read", "2026-08-11", { minutes: 20 }),
    done("read", "2026-08-12", { minutes: 20 }),
  ];
  const s = summarize(routines, log, "Nora", "2026-08-12");
  assert.equal(s.child, "Nora");
  assert.equal(s.todayDue, 2);
  assert.equal(s.todayDone, 1);
  assert.equal(s.readingMinutesWeek, 60);
  assert.deepEqual(s.bestStreak, { label: "Read for 20 minutes", days: 3 });
});

test("a one-day run is not announced as a streak", () => {
  const routines = [routine({ id: "read" })];
  const s = summarize(routines, [done("read", "2026-08-12")], "Nora", "2026-08-12");
  assert.equal(s.bestStreak, null);
});

test("validateRoutine", () => {
  assert.equal(validateRoutine({ child: "", label: "Read", kind: "reading" }).ok, false);
  assert.equal(validateRoutine({ child: "Nora", label: "", kind: "reading" }).ok, false);
  assert.equal(validateRoutine({ child: "Nora", label: "Read", kind: "nope" as never }).ok, false);
  assert.equal(validateRoutine({ child: "Nora", label: "Read", kind: "reading", target_minutes: 5000 }).ok, false);

  const weekly = validateRoutine({ child: "Nora", label: "Piano", kind: "activity", cadence: "weekly", day_of_week: 4 });
  assert.equal(weekly.ok, true);
  assert.equal((weekly as { routine: Omit<Routine, "id"> }).routine.day_of_week, 4);

  const daily = validateRoutine({ child: "Nora", label: "Read", kind: "reading", cadence: "daily", day_of_week: 4 });
  assert.equal((daily as { routine: Omit<Routine, "id"> }).routine.day_of_week, null, "a daily routine has no weekday");
});

test("validateKidLog needs to know who logged it, and drops minutes off a miss", () => {
  assert.equal(validateKidLog({ routine_id: "r", child: "Nora", for_date: "2026-08-12", state: "done" }).ok, false);
  const missed = validateKidLog({
    routine_id: "r",
    child: "Nora",
    for_date: "2026-08-12",
    state: "missed",
    minutes: 20,
    logged_by: "Anna",
  });
  assert.equal(missed.ok, true);
  assert.equal((missed as { log: KidLog }).log.minutes, null);
});
