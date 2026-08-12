import test from "node:test";
import assert from "node:assert/strict";
import {
  dateLabel,
  dateOf,
  daysBetween,
  dowName,
  friendlyDate,
  lastDayOfMonth,
  monthStart,
  parts,
  relativeDays,
  shiftDate,
  timeLabel,
  today,
  weekDates,
  weekStart,
} from "./day.ts";

// Every date rule is run under three server zones. The bug this guards against
// is not hypothetical: a check-off at 9:48 PM MT rendering as tomorrow because
// the server was on UTC is exactly what happened on the app this one is modeled
// on, twice.
const ZONES = ["UTC", "America/Denver", "Asia/Tokyo"];

function underZones(fn: () => void) {
  const original = process.env.TZ;
  for (const tz of ZONES) {
    process.env.TZ = tz;
    fn();
  }
  process.env.TZ = original;
}

test("parts does not let the server zone shift the day", () => {
  underZones(() => {
    assert.deepEqual(parts("2026-08-12"), { y: 2026, m: 8, d: 12, dow: 3 });
    assert.equal(parts("2026-01-01").dow, 4);
  });
});

test("shiftDate crosses months, years and DST without drifting", () => {
  underZones(() => {
    assert.equal(shiftDate("2026-08-12", 1), "2026-08-13");
    assert.equal(shiftDate("2026-08-31", 1), "2026-09-01");
    assert.equal(shiftDate("2026-01-01", -1), "2025-12-31");
    // US DST starts 2026-03-08; a naive local-time add loses or gains an hour
    // here and lands on the wrong day.
    assert.equal(shiftDate("2026-03-07", 1), "2026-03-08");
    assert.equal(shiftDate("2026-03-08", 1), "2026-03-09");
    assert.equal(shiftDate("2026-11-01", 1), "2026-11-02");
  });
});

test("daysBetween is signed and DST-proof", () => {
  underZones(() => {
    assert.equal(daysBetween("2026-08-12", "2026-08-15"), 3);
    assert.equal(daysBetween("2026-08-15", "2026-08-12"), -3);
    assert.equal(daysBetween("2026-08-12", "2026-08-12"), 0);
    assert.equal(daysBetween("2026-03-07", "2026-03-09"), 2);
  });
});

test("the house week starts Monday, including on a Sunday", () => {
  underZones(() => {
    assert.equal(weekStart("2026-08-12"), "2026-08-10"); // Wednesday
    assert.equal(weekStart("2026-08-10"), "2026-08-10"); // Monday itself
    assert.equal(weekStart("2026-08-16"), "2026-08-10"); // Sunday looks back
    assert.deepEqual(weekDates("2026-08-10").length, 7);
    assert.equal(weekDates("2026-08-10")[6], "2026-08-16");
  });
});

test("month helpers handle short and leap months", () => {
  underZones(() => {
    assert.equal(monthStart("2026-08-12"), "2026-08-01");
    assert.equal(lastDayOfMonth("2026-02-10"), 28);
    assert.equal(lastDayOfMonth("2028-02-10"), 29); // leap
    assert.equal(lastDayOfMonth("2026-04-10"), 30);
    assert.equal(lastDayOfMonth("2026-12-10"), 31);
  });
});

test("dateLabel renders the date it was given, in every server zone", () => {
  underZones(() => {
    assert.equal(dateLabel("2026-08-12"), "Wed, Aug 12");
    assert.equal(dateLabel("2026-01-01"), "Thu, Jan 1");
    assert.equal(dateLabel("2026-01-01", { year: true }), "Thu, Jan 1, 2026");
  });
});

test("timeLabel renders the house clock, not the server clock", () => {
  const original = process.env.TZ;
  const originalHome = process.env.HOME_TZ;
  process.env.HOME_TZ = "America/Denver";
  // 2026-08-13T03:48:00Z is 9:48 PM on Aug 12 in Denver.
  const instant = "2026-08-13T03:48:00Z";
  for (const tz of ZONES) {
    process.env.TZ = tz;
    assert.equal(timeLabel(instant), "9:48 PM MDT");
    assert.equal(dateOf(instant), "2026-08-12");
  }
  process.env.TZ = original;
  process.env.HOME_TZ = originalHome;
});

test("today follows HOME_TZ, not the server", () => {
  const originalHome = process.env.HOME_TZ;
  process.env.HOME_TZ = "Asia/Tokyo";
  const tokyo = today();
  process.env.HOME_TZ = "America/Denver";
  const denver = today();
  // They differ for part of every day; both must at least be well-formed and
  // within a day of each other.
  assert.match(tokyo, /^\d{4}-\d{2}-\d{2}$/);
  assert.match(denver, /^\d{4}-\d{2}-\d{2}$/);
  assert.ok(Math.abs(daysBetween(denver, tokyo)) <= 1);
  process.env.HOME_TZ = originalHome;
});

test("friendly and relative phrasing", () => {
  underZones(() => {
    assert.equal(friendlyDate("2026-08-12", "2026-08-12"), "Today");
    assert.equal(friendlyDate("2026-08-11", "2026-08-12"), "Yesterday");
    assert.equal(friendlyDate("2026-08-13", "2026-08-12"), "Tomorrow");
    assert.equal(friendlyDate("2026-08-20", "2026-08-12"), "Thu, Aug 20");

    assert.equal(relativeDays("2026-08-12", "2026-08-12"), "today");
    assert.equal(relativeDays("2026-08-15", "2026-08-12"), "in 3 days");
    assert.equal(relativeDays("2026-08-09", "2026-08-12"), "3 days ago");
  });
});

test("dowName", () => {
  assert.equal(dowName(0), "Sunday");
  assert.equal(dowName(3, true), "Wed");
});
