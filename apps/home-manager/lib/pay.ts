// Paying the people who work here.
//
// The number comes from the clock, never from typing hours in twice: a pay run
// is "these dated shifts, at this rate, this total" and it keeps the shift
// window it was built from, so six months later you can still see what was
// being paid for.
//
// ⛔ This is a RECORD of payments, not a payment rail. Nothing here moves money,
// and no screen implies it does — "Mark paid" means somebody paid by whatever
// means the household uses and is writing it down. Payroll tax, W-2 vs 1099 and
// the nanny-tax question are real and are NOT modelled: pretending to handle
// them would be worse than the honest gap. See PAYROLL-NOTE in README.

import { sbSelect, sbWrite } from "./supabase.ts";
import { minutesFor, toHours, type ClockRow } from "./clock.ts";
import { shiftDate, weekStart } from "./day.ts";
import type { Person } from "./people.ts";

export type PayRun = {
  id?: string;
  person: string;
  period_start: string;
  period_end: string;
  minutes: number;
  amount_cents: number;
  status: "open" | "paid";
  paid_on: string | null;
  method: string | null;
  note: string | null;
  ts?: string;
};

export type PeriodKind = "weekly" | "biweekly" | "monthly";

/** "$1,240.00" — money is always rendered from cents, never from a float. */
export function money(cents: number | null | undefined): string {
  const v = (cents ?? 0) / 100;
  return v.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

/** Parse "18.50" / "$18.50" / "1850c"-free user input into whole cents. */
export function parseMoney(input: string): number | null {
  const cleaned = input.replace(/[$,\s]/g, "");
  if (!cleaned || !/^\d*\.?\d{0,2}$/.test(cleaned)) return null;
  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;
  return Math.round(value * 100);
}

/** The pay period containing `date`. Weeks start Monday, same as the schedule. */
export function periodFor(date: string, kind: PeriodKind, anchor?: string): { start: string; end: string } {
  if (kind === "monthly") {
    const [y, m] = date.split("-").map(Number);
    const last = new Date(Date.UTC(y, m, 0)).getUTCDate();
    const mm = String(m).padStart(2, "0");
    return { start: `${y}-${mm}-01`, end: `${y}-${mm}-${String(last).padStart(2, "0")}` };
  }
  const monday = weekStart(date);
  if (kind === "weekly") return { start: monday, end: shiftDate(monday, 6) };

  // Biweekly needs a fixed origin or the boundary drifts every time the page
  // renders. `anchor` is any Monday in a "week 1"; default to the epoch Monday.
  const origin = weekStart(anchor || "2026-01-05");
  const weeksApart = Math.round(
    (Date.parse(`${monday}T00:00:00Z`) - Date.parse(`${origin}T00:00:00Z`)) / (7 * 86_400_000)
  );
  const start = weeksApart % 2 === 0 ? monday : shiftDate(monday, -7);
  return { start, end: shiftDate(start, 13) };
}

export function periodLabel(start: string, end: string): string {
  const fmt = (d: string) => {
    const [y, m, day] = d.split("-").map(Number);
    return new Date(Date.UTC(y, m - 1, day)).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      timeZone: "UTC",
    });
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export type Owed = {
  person: Person;
  minutes: number;
  hours: number;
  rateCents: number | null;
  amountCents: number | null;
  /** Why we can't put a number on it, when we can't. */
  blocked: string | null;
  paid: PayRun | null;
};

/**
 * What is owed for one period.
 *
 * A missing rate is reported, not guessed at zero: "$0.00 owed" and "we don't
 * know what she's paid" look identical on screen and mean opposite things.
 */
export function owedFor(input: {
  people: Person[];
  clock: ClockRow[];
  runs: PayRun[];
  start: string;
  end: string;
  now: number;
}): Owed[] {
  const { people, clock, runs, start, end, now } = input;

  return people
    .filter((p) => p.active && p.role === "staff")
    .map((person) => {
      const minutes = minutesFor(clock, person.name, start, end, now);
      const paid =
        runs.find((r) => r.person === person.name && r.period_start === start && r.period_end === end) ?? null;

      if (person.pay_kind === "salary") {
        const amount = person.pay_rate_cents ?? null;
        return {
          person,
          minutes,
          hours: toHours(minutes),
          rateCents: person.pay_rate_cents,
          amountCents: amount,
          blocked: amount == null ? "No salary amount set for this person yet." : null,
          paid,
        };
      }
      if (person.pay_kind === "hourly") {
        const rate = person.pay_rate_cents;
        if (rate == null) {
          return { person, minutes, hours: toHours(minutes), rateCents: null, amountCents: null, blocked: "No hourly rate set for this person yet.", paid };
        }
        return {
          person,
          minutes,
          hours: toHours(minutes),
          rateCents: rate,
          amountCents: Math.round((minutes / 60) * rate),
          blocked: null,
          paid,
        };
      }
      return {
        person,
        minutes,
        hours: toHours(minutes),
        rateCents: null,
        amountCents: null,
        blocked: "This person isn't set up for pay — set hourly or salary on their card.",
        paid,
      };
    });
}

export function totalOwed(rows: Owed[]): { cents: number; unknown: number } {
  let cents = 0;
  let unknown = 0;
  for (const r of rows) {
    if (r.paid?.status === "paid") continue;
    if (r.amountCents == null) unknown += 1;
    else cents += r.amountCents;
  }
  return { cents, unknown };
}

export function validateRun(input: Partial<PayRun>): { ok: true; run: Omit<PayRun, "id" | "ts"> } | { ok: false; error: string } {
  const person = (input.person || "").trim();
  if (!person) return { ok: false, error: "Who is being paid?" };
  const period_start = (input.period_start || "").trim();
  const period_end = (input.period_end || "").trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(period_start) || !/^\d{4}-\d{2}-\d{2}$/.test(period_end)) {
    return { ok: false, error: "That pay period isn't a real date range." };
  }
  if (period_end < period_start) return { ok: false, error: "The period ends before it starts." };
  const amount = input.amount_cents;
  if (amount == null || !Number.isFinite(amount) || amount < 0) {
    return { ok: false, error: "How much was paid?" };
  }
  const status = input.status === "paid" ? "paid" : "open";
  const paid_on = (input.paid_on || "").trim();
  if (status === "paid" && !/^\d{4}-\d{2}-\d{2}$/.test(paid_on)) {
    return { ok: false, error: "When was it paid?" };
  }
  return {
    ok: true,
    run: {
      person,
      period_start,
      period_end,
      minutes: Number.isFinite(input.minutes) ? Number(input.minutes) : 0,
      amount_cents: Math.round(amount),
      status,
      paid_on: status === "paid" ? paid_on : null,
      method: (input.method || "").trim() || null,
      note: (input.note || "").trim() || null,
    },
  };
}

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

export async function getClock(from: string, to: string): Promise<ClockRow[]> {
  return sbSelect<ClockRow>(
    `hm_clock?select=*&for_date=gte.${from}&for_date=lte.${to}&order=in_at.desc`
  );
}

export async function getOpenClock(): Promise<ClockRow[]> {
  return sbSelect<ClockRow>("hm_clock?select=*&out_at=is.null&order=in_at.desc");
}

export async function clockIn(person: string, forDate: string, at: string) {
  return sbWrite("hm_clock", "POST", { person, for_date: forDate, in_at: at, out_at: null });
}

export async function clockOut(id: string, at: string, closedBy?: string) {
  return sbWrite(`hm_clock?id=eq.${id}`, "PATCH", { out_at: at, closed_by: closedBy ?? null });
}

export async function getRuns(from: string, to: string): Promise<PayRun[]> {
  return sbSelect<PayRun>(
    `hm_pay_runs?select=*&period_end=gte.${from}&period_start=lte.${to}&order=period_start.desc`
  );
}

export async function saveRun(run: Omit<PayRun, "id" | "ts">) {
  return sbWrite("hm_pay_runs", "POST", run);
}

export async function markRunPaid(id: string, paidOn: string, method: string | null) {
  return sbWrite(`hm_pay_runs?id=eq.${id}`, "PATCH", { status: "paid", paid_on: paidOn, method });
}
