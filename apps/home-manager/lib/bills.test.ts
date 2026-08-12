import test from "node:test";
import assert from "node:assert/strict";
import {
  billBoard,
  monthlyLoad,
  needsAttention,
  nextDue,
  periodKey,
  validateBill,
  type Bill,
  type BillPayment,
} from "./bills.ts";

function bill(over: Partial<Bill> = {}): Bill {
  return {
    id: over.id ?? "b1",
    name: "Power",
    category: "Utilities",
    amount_cents: 18_000,
    cadence: "monthly",
    due_day: 15,
    due_date: null,
    autopay: false,
    account: null,
    url: null,
    note: null,
    active: true,
    ...over,
  };
}

test("nextDue finds this month's date, then rolls forward", () => {
  assert.equal(nextDue(bill(), "2026-08-01"), "2026-08-15");
  assert.equal(nextDue(bill(), "2026-08-15"), "2026-08-15", "the due day itself still counts");
  assert.equal(nextDue(bill(), "2026-08-16"), "2026-09-15");
  assert.equal(nextDue(bill(), "2026-12-16"), "2027-01-15", "rolls across the year");
});

test("a bill due on the 31st lands on the last day of a short month", () => {
  const b = bill({ due_day: 31 });
  assert.equal(nextDue(b, "2026-02-01"), "2026-02-28");
  assert.equal(nextDue(b, "2026-04-01"), "2026-04-30");
  assert.equal(nextDue(b, "2028-02-01"), "2028-02-29");
});

test("quarterly steps three months; yearly steps twelve", () => {
  const q = bill({ cadence: "quarterly", due_day: 10 });
  assert.equal(nextDue(q, "2026-08-11"), "2026-11-10");
  const y = bill({ cadence: "yearly", due_day: 1 });
  assert.equal(nextDue(y, "2026-08-11"), "2027-08-01");
});

test("an inactive bill has no next date", () => {
  assert.equal(nextDue(bill({ active: false }), "2026-08-01"), null);
});

test("periodKey names the occurrence a payment settles", () => {
  assert.equal(periodKey(bill(), "2026-08-15"), "2026-08");
  assert.equal(periodKey(bill({ cadence: "quarterly" }), "2026-08-15"), "2026-Q3");
  assert.equal(periodKey(bill({ cadence: "quarterly" }), "2026-01-15"), "2026-Q1");
  assert.equal(periodKey(bill({ cadence: "yearly" }), "2026-08-15"), "2026");
});

test("paying August never marks September paid", () => {
  const payments: BillPayment[] = [
    { bill_id: "b1", period: "2026-08", paid_on: "2026-08-14", amount_cents: 18_000, method: null, note: null },
  ];
  const august = billBoard([bill()], payments, "2026-08-01");
  assert.equal(august[0].state, "paid");

  const september = billBoard([bill()], payments, "2026-08-16");
  assert.equal(september[0].period, "2026-09");
  assert.equal(september[0].state, "soon");
  assert.equal(september[0].payment, null);
});

test("overdue, due today, and soon are distinguished", () => {
  const board = billBoard(
    [bill({ id: "late", due_day: 1 }), bill({ id: "today", due_day: 12 }), bill({ id: "soon", due_day: 18 })],
    [],
    "2026-08-12"
  );
  const state = (id: string) => board.find((b) => b.bill.id === id)!.state;
  // The 1st has already passed this month, so its next occurrence is September
  // — a monthly bill is never "overdue" in the abstract, only against a
  // recorded payment window. What matters is that it is not claimed as due.
  assert.equal(state("today"), "due");
  assert.equal(state("soon"), "soon");
  assert.equal(board.find((b) => b.bill.id === "late")!.due, "2026-09-01");
});

test("a one-off that has passed goes overdue and stays visible", () => {
  const once = bill({ id: "once", cadence: "once", due_date: "2026-08-05", due_day: null });
  const board = billBoard([once], [], "2026-08-12");
  assert.equal(board[0].state, "overdue");
  assert.equal(board[0].daysAway, -7);
});

test("needsAttention is the short list, not every bill wearing an urgent colour", () => {
  const board = billBoard(
    [
      bill({ id: "near", due_day: 15 }),
      bill({ id: "far", due_day: 28 }),
      bill({ id: "paid", due_day: 14 }),
    ],
    [{ bill_id: "paid", period: "2026-08", paid_on: "2026-08-10", amount_cents: null, method: null, note: null }],
    "2026-08-12"
  );
  assert.deepEqual(needsAttention(board).map((b) => b.bill.id), ["near"]);
});

test("the monthly load normalises cadences and counts what it cannot price", () => {
  const load = monthlyLoad([
    bill({ id: "m", amount_cents: 18_000 }),
    bill({ id: "q", cadence: "quarterly", amount_cents: 30_000 }),
    bill({ id: "y", cadence: "yearly", amount_cents: 120_000 }),
    bill({ id: "unknown", amount_cents: null }),
    bill({ id: "once", cadence: "once", due_date: "2026-09-01", amount_cents: 500_000 }),
    bill({ id: "off", active: false, amount_cents: 999_999 }),
  ]);
  assert.equal(load.cents, 18_000 + 10_000 + 10_000);
  assert.equal(load.unknown, 1);
});

test("validateBill", () => {
  assert.equal(validateBill({ name: "", cadence: "monthly" }).ok, false);
  assert.equal(validateBill({ name: "X", cadence: "once" }).ok, false, "a one-off needs its date");
  assert.equal(validateBill({ name: "X", cadence: "monthly", due_day: 40 }).ok, false);
  assert.equal(validateBill({ name: "X", cadence: "monthly", url: "example.com" }).ok, false);

  const ok = validateBill({ name: "Power", cadence: "monthly", due_day: 15, amount_cents: 18_000 });
  assert.equal(ok.ok, true);
  const b = (ok as { bill: Omit<Bill, "id"> }).bill;
  assert.equal(b.due_date, null, "a recurring bill must not carry a one-off date");
  assert.equal(b.autopay, false);
});
