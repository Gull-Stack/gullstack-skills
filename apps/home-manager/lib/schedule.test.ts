import test from "node:test";
import assert from "node:assert/strict";
import {
  assembleWeek,
  swapRows,
  uncoveredDays,
  validateTimeOff,
  whoWorks,
  type DefaultDay,
  type Shift,
  type TimeOff,
} from "./schedule.ts";
import type { Task, TaskLog } from "./tasks.ts";

const ZONES = ["UTC", "America/Denver", "Asia/Tokyo"];
function underZones(fn: () => void) {
  const original = process.env.TZ;
  for (const tz of ZONES) {
    process.env.TZ = tz;
    fn();
  }
  process.env.TZ = original;
}

// Anna: Mon/Wed/Fri. Ben: Tue/Thu.
const DEFAULTS: DefaultDay[] = [
  { person: "Anna", dow: 1 },
  { person: "Anna", dow: 3 },
  { person: "Anna", dow: 5 },
  { person: "Ben", dow: 2 },
  { person: "Ben", dow: 4 },
];

test("standing days decide the ordinary week", () => {
  underZones(() => {
    assert.deepEqual(whoWorks("2026-08-10", DEFAULTS, [], []), ["Anna"]); // Monday
    assert.deepEqual(whoWorks("2026-08-11", DEFAULTS, [], []), ["Ben"]); // Tuesday
    assert.deepEqual(whoWorks("2026-08-15", DEFAULTS, [], []), []); // Saturday
  });
});

test("a swap moves one week only and leaves the pattern alone", () => {
  const rows = swapRows("2026-08-12", "Anna", "Ben");
  assert.deepEqual(rows, [
    { person: "Anna", for_date: "2026-08-12", state: "off" },
    { person: "Ben", for_date: "2026-08-12", state: "on" },
  ]);
  assert.deepEqual(whoWorks("2026-08-12", DEFAULTS, rows, []), ["Ben"]);
  // Next Wednesday is untouched.
  assert.deepEqual(whoWorks("2026-08-19", DEFAULTS, rows, []), ["Anna"]);
});

test("approved time off beats a swap-on — saying yes then rostering anyway is the worst outcome", () => {
  const overrides: Shift[] = [{ person: "Ben", for_date: "2026-08-12", state: "on" }];
  const off: TimeOff[] = [
    { person: "Ben", from_date: "2026-08-12", to_date: "2026-08-12", note: null, status: "approved" },
  ];
  assert.deepEqual(whoWorks("2026-08-12", DEFAULTS, overrides, off), ["Anna"]);
});

test("a pending request changes nothing until somebody answers it", () => {
  const off: TimeOff[] = [
    { person: "Anna", from_date: "2026-08-12", to_date: "2026-08-12", note: null, status: "pending" },
  ];
  assert.deepEqual(whoWorks("2026-08-12", DEFAULTS, [], off), ["Anna"]);
  const denied: TimeOff[] = [{ ...off[0], status: "denied" }];
  assert.deepEqual(whoWorks("2026-08-12", DEFAULTS, [], denied), ["Anna"]);
});

test("a multi-day approved request covers every day in the range, inclusive", () => {
  const off: TimeOff[] = [
    { person: "Anna", from_date: "2026-08-10", to_date: "2026-08-14", note: null, status: "approved" },
  ];
  assert.deepEqual(whoWorks("2026-08-10", DEFAULTS, [], off), []);
  assert.deepEqual(whoWorks("2026-08-14", DEFAULTS, [], off), []);
  assert.deepEqual(whoWorks("2026-08-17", DEFAULTS, [], off), ["Anna"]);
});

test("whoWorks honours roster order rather than the alphabet", () => {
  const both: DefaultDay[] = [
    { person: "Zoe", dow: 1 },
    { person: "Anna", dow: 1 },
  ];
  assert.deepEqual(whoWorks("2026-08-10", both, [], [], ["Zoe", "Anna"]), ["Zoe", "Anna"]);
  assert.deepEqual(whoWorks("2026-08-10", both, [], []), ["Anna", "Zoe"]);
});

const TASKS: Task[] = [
  {
    id: "daily",
    title: "Reset the kitchen",
    area: null,
    cadence: "daily",
    day_of_week: null,
    day_of_month: null,
    once_date: null,
    detail: null,
    video_url: null,
    assigned_to: null,
    sort_order: 1,
    active: true,
  },
  {
    id: "friday",
    title: "Porch",
    area: null,
    cadence: "weekly",
    day_of_week: 5,
    day_of_month: null,
    once_date: null,
    detail: null,
    video_url: null,
    assigned_to: "Anna",
    sort_order: 2,
    active: true,
  },
];

test("the week grid keeps each task on its own day and carries the outcome", () => {
  underZones(() => {
    const log: TaskLog[] = [
      { task_id: "daily", for_date: "2026-08-10", person: "Anna", state: "done", reason: null, note: null },
      { task_id: "daily", for_date: "2026-08-11", person: "Ben", state: "skipped", reason: "No time", note: null },
    ];
    const week = assembleWeek({
      monday: "2026-08-10",
      today: "2026-08-12",
      tasks: TASKS,
      log,
      defaults: DEFAULTS,
      overrides: [],
      timeOff: [],
      order: ["Anna", "Ben"],
    });

    assert.equal(week.length, 7);
    assert.equal(week[0].date, "2026-08-10");
    assert.equal(week[0].dowLabel, "Mon");
    assert.deepEqual(week[0].tasks.map((t) => t.title), ["Reset the kitchen"]);
    assert.equal(week[0].tasks[0].state, "done");
    assert.equal(week[1].tasks[0].state, "skipped");
    assert.equal(week[2].isToday, true);
    assert.equal(week[0].isPast, true);
    assert.equal(week[6].isPast, false);

    // Friday carries both the daily and the weekly task.
    const friday = week[4];
    assert.deepEqual(friday.tasks.map((t) => t.title).sort(), ["Porch", "Reset the kitchen"]);
    // An untouched task shows its default owner, not nobody.
    assert.equal(friday.tasks.find((t) => t.title === "Porch")?.person, "Anna");
  });
});

test("a day with work and nobody on it is reported, not hidden", () => {
  underZones(() => {
    const week = assembleWeek({
      monday: "2026-08-10",
      today: "2026-08-10",
      tasks: TASKS,
      log: [],
      defaults: DEFAULTS,
      overrides: [],
      timeOff: [],
    });
    const uncovered = uncoveredDays(week);
    // Saturday and Sunday have the daily task and nobody scheduled.
    assert.deepEqual(uncovered.map((d) => d.date), ["2026-08-15", "2026-08-16"]);
  });
});

test("a day off is shown on the column so a thin day reads as explained", () => {
  underZones(() => {
    const week = assembleWeek({
      monday: "2026-08-10",
      today: "2026-08-10",
      tasks: TASKS,
      log: [],
      defaults: DEFAULTS,
      overrides: [],
      timeOff: [
        { person: "Anna", from_date: "2026-08-12", to_date: "2026-08-12", note: null, status: "approved" },
      ],
    });
    assert.deepEqual(week[2].who, []);
    assert.deepEqual(week[2].off, ["Anna"]);
  });
});

test("validateTimeOff", () => {
  assert.equal(validateTimeOff({ person: "", from_date: "2026-08-12" }).ok, false);
  assert.equal(validateTimeOff({ person: "Anna", from_date: "nope" }).ok, false);
  assert.equal(
    validateTimeOff({ person: "Anna", from_date: "2026-08-14", to_date: "2026-08-12" }).ok,
    false,
    "the last day cannot precede the first"
  );
  const one = validateTimeOff({ person: "Anna", from_date: "2026-08-12" });
  assert.equal(one.ok, true);
  const req = (one as { request: Omit<TimeOff, "id" | "ts"> }).request;
  assert.equal(req.to_date, "2026-08-12", "a single day fills in its own end");
  assert.equal(req.status, "pending", "a request never approves itself");
});
