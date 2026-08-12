import test from "node:test";
import assert from "node:assert/strict";
import { money, owedFor, parseMoney, periodFor, periodLabel, totalOwed, validateRun } from "./pay.ts";
import type { ClockRow } from "./clock.ts";
import type { Person } from "./people.ts";

const NOW = Date.parse("2026-08-16T18:00:00Z");

function person(over: Partial<Person> = {}): Person {
  return {
    name: "Anna",
    role: "staff",
    title: "Nanny",
    pin: null,
    color: null,
    sort_order: 10,
    active: true,
    pay_rate_cents: 2500,
    pay_kind: "hourly",
    birthday: null,
    note: null,
    ...over,
  };
}

function shift(date: string, hours: number, who = "Anna"): ClockRow {
  const start = `${date}T15:00:00Z`;
  const end = new Date(Date.parse(start) + hours * 3_600_000).toISOString();
  return { person: who, for_date: date, in_at: start, out_at: end };
}

test("money renders from cents and never from a float", () => {
  assert.equal(money(0), "$0.00");
  assert.equal(money(2500), "$25.00");
  assert.equal(money(124_000), "$1,240.00");
  assert.equal(money(null), "$0.00");
});

test("parseMoney takes what a person types and refuses what it can't read", () => {
  assert.equal(parseMoney("25"), 2500);
  assert.equal(parseMoney("$25.50"), 2550);
  assert.equal(parseMoney("1,240"), 124_000);
  assert.equal(parseMoney(".5"), 50);
  assert.equal(parseMoney(""), null);
  assert.equal(parseMoney("abc"), null);
  assert.equal(parseMoney("25.555"), null);
  assert.equal(parseMoney("-5"), null);
});

test("periods: weekly starts Monday, monthly covers the real month", () => {
  assert.deepEqual(periodFor("2026-08-12", "weekly"), { start: "2026-08-10", end: "2026-08-16" });
  assert.deepEqual(periodFor("2026-08-16", "weekly"), { start: "2026-08-10", end: "2026-08-16" });
  assert.deepEqual(periodFor("2026-02-10", "monthly"), { start: "2026-02-01", end: "2026-02-28" });
  assert.deepEqual(periodFor("2028-02-10", "monthly"), { start: "2028-02-01", end: "2028-02-29" });
});

test("biweekly is anchored, so the boundary is the same on every render", () => {
  // Anchored on Monday 2026-01-05, the fortnight containing Aug 12 runs
  // Aug 3–16. Without the anchor this boundary would move depending on which
  // day the page happened to be rendered, and a pay period that changes shape
  // between two page loads is worse than no pay period at all.
  const a = periodFor("2026-08-12", "biweekly", "2026-01-05");
  assert.deepEqual(a, { start: "2026-08-03", end: "2026-08-16" });
  assert.deepEqual(periodFor("2026-08-16", "biweekly", "2026-01-05"), a, "the last day is in the same fortnight");
  assert.deepEqual(periodFor("2026-08-03", "biweekly", "2026-01-05"), a, "so is the first");
  assert.deepEqual(periodFor("2026-08-17", "biweekly", "2026-01-05"), {
    start: "2026-08-17",
    end: "2026-08-30",
  });
});

test("periodLabel", () => {
  assert.equal(periodLabel("2026-08-10", "2026-08-16"), "Aug 10 – Aug 16");
});

test("hourly pay comes from the clock, to the cent", () => {
  const rows = owedFor({
    people: [person()],
    clock: [shift("2026-08-10", 6), shift("2026-08-12", 6.5)],
    runs: [],
    start: "2026-08-10",
    end: "2026-08-16",
    now: NOW,
  });
  assert.equal(rows.length, 1);
  assert.equal(rows[0].minutes, 750);
  assert.equal(rows[0].hours, 12.5);
  assert.equal(rows[0].amountCents, 31_250); // 12.5h × $25
  assert.equal(rows[0].blocked, null);
});

test("a missing rate is reported, never quietly rendered as $0.00", () => {
  const rows = owedFor({
    people: [person({ pay_rate_cents: null })],
    clock: [shift("2026-08-10", 6)],
    runs: [],
    start: "2026-08-10",
    end: "2026-08-16",
    now: NOW,
  });
  assert.equal(rows[0].amountCents, null);
  assert.match(rows[0].blocked!, /No hourly rate/);

  const unset = owedFor({
    people: [person({ pay_kind: "none", pay_rate_cents: null })],
    clock: [],
    runs: [],
    start: "2026-08-10",
    end: "2026-08-16",
    now: NOW,
  });
  assert.match(unset[0].blocked!, /isn't set up for pay/);
});

test("salary ignores the clock but still shows the hours worked", () => {
  const rows = owedFor({
    people: [person({ pay_kind: "salary", pay_rate_cents: 200_000 })],
    clock: [shift("2026-08-10", 4)],
    runs: [],
    start: "2026-08-10",
    end: "2026-08-16",
    now: NOW,
  });
  assert.equal(rows[0].amountCents, 200_000);
  assert.equal(rows[0].minutes, 240);
});

test("only staff are on payroll; family adults are not", () => {
  const rows = owedFor({
    people: [person(), person({ name: "Dad", role: "owner" }), person({ name: "Kid", role: "child" })],
    clock: [],
    runs: [],
    start: "2026-08-10",
    end: "2026-08-16",
    now: NOW,
  });
  assert.deepEqual(rows.map((r) => r.person.name), ["Anna"]);
});

test("a period already marked paid drops out of the total, and unknowns are counted separately", () => {
  const rows = owedFor({
    people: [person(), person({ name: "Ben", pay_rate_cents: null })],
    clock: [shift("2026-08-10", 4), shift("2026-08-10", 4, "Ben")],
    runs: [
      {
        person: "Anna",
        period_start: "2026-08-10",
        period_end: "2026-08-16",
        minutes: 240,
        amount_cents: 10_000,
        status: "paid",
        paid_on: "2026-08-17",
        method: "Zelle",
        note: null,
      },
    ],
    start: "2026-08-10",
    end: "2026-08-16",
    now: NOW,
  });
  const total = totalOwed(rows);
  assert.equal(total.cents, 0, "Anna is paid; Ben has no rate so contributes nothing");
  assert.equal(total.unknown, 1);
});

test("validateRun refuses a paid run with no date and a run with no amount", () => {
  assert.equal(validateRun({ person: "Anna", period_start: "2026-08-10", period_end: "2026-08-16" }).ok, false);
  assert.equal(
    validateRun({
      person: "Anna",
      period_start: "2026-08-10",
      period_end: "2026-08-16",
      amount_cents: 1000,
      status: "paid",
    }).ok,
    false,
    "paid needs a paid_on"
  );
  assert.equal(
    validateRun({ person: "Anna", period_start: "2026-08-16", period_end: "2026-08-10", amount_cents: 1 }).ok,
    false,
    "the period ends before it starts"
  );
  const ok = validateRun({
    person: "Anna",
    period_start: "2026-08-10",
    period_end: "2026-08-16",
    amount_cents: 31_250,
    minutes: 750,
    status: "paid",
    paid_on: "2026-08-17",
    method: "Zelle",
  });
  assert.equal(ok.ok, true);
});
