import test from "node:test";
import assert from "node:assert/strict";
import {
  dayMinutes,
  durationLabel,
  isOpen,
  minutesFor,
  openShift,
  openShiftOn,
  shiftMinutes,
  staleShifts,
  toHours,
  totalLabel,
  totalsByPerson,
  whoIsHere,
  type ClockRow,
} from "./clock.ts";

const NOON = Date.parse("2026-08-12T18:00:00Z"); // noon in Denver

function row(over: Partial<ClockRow> = {}): ClockRow {
  return {
    person: "Anna",
    for_date: "2026-08-12",
    in_at: "2026-08-12T15:00:00Z",
    out_at: null,
    ...over,
  };
}

test("an open shift measures to now and keeps ticking", () => {
  const r = row();
  assert.equal(isOpen(r), true);
  assert.equal(shiftMinutes(r, NOON), 180);
  assert.equal(shiftMinutes(r, NOON + 60_000), 181);
});

test("a closed shift measures to its own end, whatever the clock says now", () => {
  const r = row({ out_at: "2026-08-12T17:30:00Z" });
  assert.equal(isOpen(r), false);
  assert.equal(shiftMinutes(r, NOON), 150);
  assert.equal(shiftMinutes(r, NOON + 86_400_000), 150);
});

test("a garbled or backwards shift is zero, never negative", () => {
  assert.equal(shiftMinutes(row({ in_at: "not a time" }), NOON), 0);
  assert.equal(shiftMinutes(row({ out_at: "2026-08-12T14:00:00Z" }), NOON), 0);
  assert.equal(shiftMinutes(row({ out_at: "2026-08-12T15:00:00Z" }), NOON), 0);
});

test("two shifts in a day add up; another person's do not", () => {
  const rows = [
    row({ in_at: "2026-08-12T15:00:00Z", out_at: "2026-08-12T17:00:00Z" }),
    row({ in_at: "2026-08-12T19:00:00Z", out_at: "2026-08-12T20:30:00Z" }),
    row({ person: "Ben", in_at: "2026-08-12T15:00:00Z", out_at: "2026-08-12T23:00:00Z" }),
  ];
  assert.equal(dayMinutes(rows, "Anna", "2026-08-12", NOON), 210);
  assert.equal(dayMinutes(rows, "Ben", "2026-08-12", NOON), 480);
  assert.equal(dayMinutes(rows, "Nobody", "2026-08-12", NOON), 0);
});

test("a window is inclusive at both ends", () => {
  const rows = [
    row({ for_date: "2026-08-10", in_at: "2026-08-10T15:00:00Z", out_at: "2026-08-10T16:00:00Z" }),
    row({ for_date: "2026-08-12", in_at: "2026-08-12T15:00:00Z", out_at: "2026-08-12T16:00:00Z" }),
    row({ for_date: "2026-08-14", in_at: "2026-08-14T15:00:00Z", out_at: "2026-08-14T16:00:00Z" }),
  ];
  assert.equal(minutesFor(rows, "Anna", "2026-08-10", "2026-08-14", NOON), 180);
  assert.equal(minutesFor(rows, "Anna", "2026-08-11", "2026-08-13", NOON), 60);
});

test("durations never read like a bug and never read as a decimal", () => {
  assert.equal(durationLabel(0), "just started");
  assert.equal(durationLabel(45), "45m");
  assert.equal(durationLabel(60), "1h");
  assert.equal(durationLabel(135), "2h 15m");
  // "just started" is right under a live clock and wrong in a summary.
  assert.equal(totalLabel(0), "0h");
  assert.equal(totalLabel(135), "2h 15m");
});

test("toHours is for pay math only, and rounds to the cent-relevant place", () => {
  assert.equal(toHours(90), 1.5);
  assert.equal(toHours(135), 2.25);
  assert.equal(toHours(50), 0.83);
});

test("openShift finds the one running shift per person", () => {
  const rows = [
    row({ out_at: "2026-08-12T16:00:00Z" }),
    row({ in_at: "2026-08-12T17:00:00Z" }),
    row({ person: "Ben", out_at: "2026-08-12T16:00:00Z" }),
  ];
  assert.equal(openShift(rows, "Anna")?.in_at, "2026-08-12T17:00:00Z");
  assert.equal(openShift(rows, "Ben"), null);
});

test("🔴 openShiftOn ignores a stale shift, so the kiosk can't close it with 'now'", () => {
  const rows = [
    row({ for_date: "2026-08-10" }), // forgot to clock out on Monday
    row({ for_date: "2026-08-12", in_at: "2026-08-12T15:00:00Z" }),
  ];
  // openShift finds the OLD one first — which is exactly the trap.
  assert.equal(openShift(rows, "Anna")?.for_date, "2026-08-10");
  assert.equal(openShiftOn(rows, "Anna", "2026-08-12")?.for_date, "2026-08-12");

  // With only a stale shift open, today has none: "clock out" must refuse and
  // "clock in" must be free to start a real shift.
  const onlyStale = [row({ for_date: "2026-08-10" })];
  assert.equal(openShiftOn(onlyStale, "Anna", "2026-08-12"), null);
});

test("a shift left running from a previous day is flagged, not silently paid", () => {
  const rows = [
    row({ for_date: "2026-08-11" }), // still open, yesterday
    row({ for_date: "2026-08-12" }), // still open, today — normal
    row({ for_date: "2026-08-10", out_at: "2026-08-10T20:00:00Z" }),
  ];
  const stale = staleShifts(rows, "2026-08-12");
  assert.equal(stale.length, 1);
  assert.equal(stale[0].for_date, "2026-08-11");
});

test("whoIsHere lists only open shifts, freshest arrival first", () => {
  const rows = [
    row({ person: "Anna", in_at: "2026-08-12T15:00:00Z" }),
    row({ person: "Ben", in_at: "2026-08-12T17:30:00Z" }),
    row({ person: "Cara", out_at: "2026-08-12T16:00:00Z" }),
  ];
  const here = whoIsHere(rows, NOON);
  assert.deepEqual(here.map((h) => h.person), ["Ben", "Anna"]);
  assert.equal(here[0].minutes, 30);
});

test("totalsByPerson drops people with no time and sorts by the most worked", () => {
  const rows = [
    row({ person: "Anna", out_at: "2026-08-12T16:00:00Z" }),
    row({ person: "Ben", in_at: "2026-08-12T15:00:00Z", out_at: "2026-08-12T21:00:00Z" }),
    row({ person: "Cara", in_at: "2026-08-12T15:00:00Z", out_at: "2026-08-12T15:00:00Z" }),
  ];
  const totals = totalsByPerson(rows, "2026-08-12", "2026-08-12", NOON);
  assert.deepEqual(totals, [
    { person: "Ben", minutes: 360 },
    { person: "Anna", minutes: 60 },
  ]);
});
