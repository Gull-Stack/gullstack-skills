// The bills the house runs on.
//
// The question this answers is "what is coming, and did it get paid" — not
// accounting. So a bill is a recurring commitment, and a payment is a dated row
// against one occurrence of it. Marking December paid never touches November,
// which is the whole reason the two are separate tables.
//
// ⛔ Nothing here pays anything. An autopay flag records that the biller pulls
// it automatically; it does not make that true, and the UI says so.

import { sbSelect, sbWrite, upsert } from "./supabase.ts";
import { daysBetween, lastDayOfMonth, parts } from "./day.ts";

export type BillCadence = "monthly" | "quarterly" | "yearly" | "once";

export type Bill = {
  id: string;
  name: string;
  category: string | null;
  amount_cents: number | null;
  cadence: BillCadence;
  /** 1–31 for recurring bills; clamped to the month's real last day. */
  due_day: number | null;
  /** YYYY-MM-DD for a one-off. */
  due_date: string | null;
  autopay: boolean;
  account: string | null;
  url: string | null;
  note: string | null;
  active: boolean;
};

export type BillPayment = {
  id?: string;
  bill_id: string;
  /** The occurrence this settles: "2026-08" monthly, "2026-Q3", "2026", or the date. */
  period: string;
  paid_on: string;
  amount_cents: number | null;
  method: string | null;
  note: string | null;
};

export const BILL_CATEGORIES = [
  "Housing",
  "Utilities",
  "Internet & phone",
  "Insurance",
  "Vehicles",
  "Childcare",
  "Subscriptions",
  "Household help",
  "Health",
  "Other",
];

/** The occurrence key a bill's due date belongs to. */
export function periodKey(bill: Bill, date: string): string {
  const { y, m } = parts(date);
  switch (bill.cadence) {
    case "monthly":
      return `${y}-${String(m).padStart(2, "0")}`;
    case "quarterly":
      return `${y}-Q${Math.floor((m - 1) / 3) + 1}`;
    case "yearly":
      return `${y}`;
    case "once":
      return bill.due_date || date;
  }
}

/**
 * When this bill is next due on or after `from`.
 *
 * Returns null for a one-off that has already passed its date — a bill with no
 * next occurrence should disappear from "what's coming", not sit at the top
 * forever showing a date in the past.
 */
export function nextDue(bill: Bill, from: string): string | null {
  if (!bill.active) return null;
  if (bill.cadence === "once") {
    return bill.due_date && bill.due_date >= from ? bill.due_date : bill.due_date ?? null;
  }
  const day = bill.due_day ?? 1;
  const { y, m } = parts(from);

  const monthsToCheck: [number, number][] = [];
  const step = bill.cadence === "monthly" ? 1 : bill.cadence === "quarterly" ? 3 : 12;
  for (let i = 0; i <= 24; i += 1) {
    const total = m - 1 + i * step;
    monthsToCheck.push([y + Math.floor(total / 12), (total % 12) + 1]);
    if (monthsToCheck.length > 30) break;
  }

  for (const [yy, mm] of monthsToCheck) {
    const iso = `${yy}-${String(mm).padStart(2, "0")}-01`;
    // A bill due on the 31st still lands on the last day of a short month
    // rather than silently skipping February.
    const clamped = Math.min(day, lastDayOfMonth(iso));
    const candidate = `${yy}-${String(mm).padStart(2, "0")}-${String(clamped).padStart(2, "0")}`;
    if (candidate >= from) return candidate;
  }
  return null;
}

export type BillStatus = {
  bill: Bill;
  due: string | null;
  period: string | null;
  payment: BillPayment | null;
  state: "paid" | "due" | "soon" | "overdue" | "inactive";
  daysAway: number | null;
};

/**
 * Where every bill stands today.
 *
 * `soon` is a 10-day horizon: long enough to act on, short enough that the list
 * is not just "every bill you have" wearing an urgent colour.
 */
export function billBoard(bills: Bill[], payments: BillPayment[], today: string, horizon = 10): BillStatus[] {
  const paid = new Map(payments.map((p) => [`${p.bill_id}|${p.period}`, p]));

  return bills
    .map<BillStatus>((bill) => {
      if (!bill.active) {
        return { bill, due: null, period: null, payment: null, state: "inactive", daysAway: null };
      }
      const due = nextDue(bill, today);
      if (!due) return { bill, due: null, period: null, payment: null, state: "inactive", daysAway: null };

      const period = periodKey(bill, due);
      const payment = paid.get(`${bill.id}|${period}`) ?? null;
      const daysAway = daysBetween(today, due);

      let state: BillStatus["state"];
      if (payment) state = "paid";
      else if (daysAway < 0) state = "overdue";
      else if (daysAway === 0) state = "due";
      else if (daysAway <= horizon) state = "soon";
      else state = "soon";

      return { bill, due, period, payment, state, daysAway };
    })
    .sort((a, b) => {
      if (a.state === "inactive") return 1;
      if (b.state === "inactive") return -1;
      return (a.due ?? "9999").localeCompare(b.due ?? "9999");
    });
}

/** What needs attention: overdue first, then due inside the horizon, unpaid only. */
export function needsAttention(board: BillStatus[], horizon = 10): BillStatus[] {
  return board.filter(
    (b) => b.state !== "paid" && b.state !== "inactive" && b.daysAway != null && b.daysAway <= horizon
  );
}

/** What the house costs a month, from the bills that carry an amount. */
export function monthlyLoad(bills: Bill[]): { cents: number; unknown: number } {
  let cents = 0;
  let unknown = 0;
  for (const b of bills) {
    if (!b.active || b.cadence === "once") continue;
    if (b.amount_cents == null) {
      unknown += 1;
      continue;
    }
    const perMonth =
      b.cadence === "monthly" ? b.amount_cents : b.cadence === "quarterly" ? b.amount_cents / 3 : b.amount_cents / 12;
    cents += Math.round(perMonth);
  }
  return { cents, unknown };
}

export function validateBill(input: Partial<Bill>): { ok: true; bill: Omit<Bill, "id"> } | { ok: false; error: string } {
  const name = (input.name || "").trim();
  if (!name) return { ok: false, error: "What is this bill called?" };
  if (name.length > 120) return { ok: false, error: "That name is too long (120 characters max)." };
  const cadence = input.cadence;
  if (!cadence || !["monthly", "quarterly", "yearly", "once"].includes(cadence)) {
    return { ok: false, error: "How often does it come?" };
  }
  if (cadence === "once" && !/^\d{4}-\d{2}-\d{2}$/.test(input.due_date || "")) {
    return { ok: false, error: "A one-off bill needs its due date." };
  }
  const day = input.due_day;
  if (cadence !== "once" && day != null && (day < 1 || day > 31)) {
    return { ok: false, error: "The due day has to be 1–31." };
  }
  const amount = input.amount_cents;
  if (amount != null && (!Number.isFinite(amount) || amount < 0)) {
    return { ok: false, error: "That amount doesn't look right." };
  }
  const url = (input.url || "").trim();
  if (url && !/^https?:\/\//i.test(url)) return { ok: false, error: "A link needs to start with http:// or https://." };

  return {
    ok: true,
    bill: {
      name,
      category: (input.category || "").trim() || null,
      amount_cents: amount ?? null,
      cadence,
      due_day: cadence === "once" ? null : day ?? 1,
      due_date: cadence === "once" ? input.due_date! : null,
      autopay: input.autopay ?? false,
      account: (input.account || "").trim() || null,
      url: url || null,
      note: (input.note || "").trim() || null,
      active: input.active ?? true,
    },
  };
}

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

export async function getBills(opts?: { includeInactive?: boolean }): Promise<Bill[]> {
  const q = opts?.includeInactive
    ? "select=*&order=name.asc"
    : "select=*&active=eq.true&order=name.asc";
  return sbSelect<Bill>(`hm_bills?${q}`);
}

export async function getPayments(sincePaidOn: string): Promise<BillPayment[]> {
  return sbSelect<BillPayment>(`hm_bill_payments?select=*&paid_on=gte.${sincePaidOn}&order=paid_on.desc`);
}

/** All payments for the occurrences currently on the board, however old. */
export async function getPaymentsForBills(billIds: string[]): Promise<BillPayment[]> {
  if (!billIds.length) return [];
  const list = billIds.map((id) => `"${id}"`).join(",");
  return sbSelect<BillPayment>(`hm_bill_payments?select=*&bill_id=in.(${list})`);
}

export async function saveBill(bill: Omit<Bill, "id"> & { id?: string }) {
  if (bill.id) return sbWrite(`hm_bills?id=eq.${bill.id}`, "PATCH", bill);
  return sbWrite("hm_bills", "POST", bill);
}

export async function setBillActive(id: string, active: boolean) {
  return sbWrite(`hm_bills?id=eq.${id}`, "PATCH", { active });
}

/** One payment per bill per occurrence — marking twice corrects, never doubles. */
export async function markPaid(payment: BillPayment) {
  return upsert("hm_bill_payments", "bill_id,period", payment);
}

export async function unmarkPaid(billId: string, period: string) {
  return sbWrite(
    `hm_bill_payments?bill_id=eq.${billId}&period=eq.${encodeURIComponent(period)}`,
    "DELETE"
  );
}
