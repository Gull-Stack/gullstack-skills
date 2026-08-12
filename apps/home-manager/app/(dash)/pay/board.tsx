"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { act } from "../../act";
import { Chip, Empty, Notice, SectionHead, Stat } from "../../ui";
import { dateLabel, timeLabel } from "@/lib/day";
import { totalLabel, type ClockRow } from "@/lib/clock";
import { money, periodLabel, totalOwed, type Owed, type PayRun, type PeriodKind } from "@/lib/pay";

const PERIODS: { key: PeriodKind; label: string }[] = [
  { key: "weekly", label: "Weekly" },
  { key: "biweekly", label: "Every two weeks" },
  { key: "monthly", label: "Monthly" },
];

export function PayBoard({
  kind,
  start,
  end,
  today,
  owed,
  runs,
  stale,
  totals,
}: {
  kind: PeriodKind;
  start: string;
  end: string;
  today: string;
  owed: Owed[];
  runs: PayRun[];
  stale: ClockRow[];
  totals: { person: string; minutes: number }[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fixing, setFixing] = useState<string | null>(null);

  async function run(body: unknown) {
    setBusy(true);
    setError(null);
    const r = await act("/api/pay", body);
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return false;
    }
    router.refresh();
    return true;
  }

  const total = totalOwed(owed);
  const history = runs.filter((r) => r.status === "paid").slice(0, 12);

  return (
    <>
      {error ? <Notice tone="red">{error}</Notice> : null}

      {/* A shift left running turns into an overnight day on a payslip. It is
          the first thing on this page for exactly that reason. */}
      {stale.length ? (
        <section className="card">
          <SectionHead
            title="Fix these first"
            sub="A shift that was never clocked out. Put in the time they actually left — the record will show you adjusted it."
          />
          <div className="list">
            {stale.map((s) => (
              <div key={s.id}>
                <div className="item">
                  <div style={{ flex: 1 }}>
                    <div className="item-title">
                      {s.person} — {dateLabel(s.for_date)}
                    </div>
                    <div className="item-meta">Clocked in {timeLabel(s.in_at)}, never clocked out.</div>
                  </div>
                  <button className="btn btn-sm" onClick={() => setFixing(fixing === s.id ? null : (s.id ?? null))}>
                    Set the end time
                  </button>
                </div>
                {fixing === s.id ? (
                  <CloseShiftForm
                    forDate={s.for_date}
                    busy={busy}
                    onCancel={() => setFixing(null)}
                    onSave={async (at) => {
                      const ok = await run({ action: "close-shift", id: s.id, at });
                      if (ok) setFixing(null);
                    }}
                  />
                ) : null}
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="card">
        <SectionHead
          title={`Pay period · ${periodLabel(start, end)}`}
          right={
            <div className="seg">
              {PERIODS.map((p) => (
                <button key={p.key} aria-pressed={p.key === kind} onClick={() => router.push(`/pay?p=${p.key}`)}>
                  {p.label}
                </button>
              ))}
            </div>
          }
        />

        <div className="row" style={{ gap: 28, marginBottom: 16 }}>
          <Stat
            value={money(total.cents)}
            label="Still owed this period"
            sub={total.unknown ? `${total.unknown} person without a rate set` : undefined}
          />
          <Stat value={totalLabel(totals.reduce((s, t) => s + t.minutes, 0))} label="Hours worked" />
        </div>

        {owed.length === 0 ? (
          <Empty>
            Nobody is set up as staff yet. Add them on <a href="/people">the People page</a>, with an hourly
            rate or a salary.
          </Empty>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Person</th>
                  <th className="num">Hours</th>
                  <th className="num">Rate</th>
                  <th className="num">Owed</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {owed.map((o) => (
                  <tr key={o.person.name}>
                    <td>
                      <strong>{o.person.name}</strong>
                      {o.person.title ? <div className="item-meta">{o.person.title}</div> : null}
                    </td>
                    <td className="num mono">{totalLabel(o.minutes)}</td>
                    <td className="num mono">
                      {o.rateCents == null
                        ? "—"
                        : o.person.pay_kind === "salary"
                          ? `${money(o.rateCents)}/period`
                          : `${money(o.rateCents)}/hr`}
                    </td>
                    <td className="num mono">{o.amountCents == null ? "—" : money(o.amountCents)}</td>
                    <td className="num">
                      {o.paid?.status === "paid" ? (
                        <Chip tone="green">paid {dateLabel(o.paid.paid_on!)}</Chip>
                      ) : o.blocked ? (
                        // A missing rate is stated, never rendered as $0.00 —
                        // "nothing owed" and "we don't know" look identical
                        // otherwise and mean opposite things.
                        <span className="quiet">{o.blocked}</span>
                      ) : (
                        <MarkPaid
                          busy={busy}
                          onSave={(method, paidOn) =>
                            run({
                              person: o.person.name,
                              period_start: start,
                              period_end: end,
                              minutes: o.minutes,
                              amount_cents: o.amountCents,
                              status: "paid",
                              paid_on: paidOn,
                              method,
                            })
                          }
                          today={today}
                        />
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section className="card">
        <SectionHead title="Already paid" sub="The last twelve payments recorded here." />
        {history.length === 0 ? (
          <Empty>Nothing recorded yet.</Empty>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Person</th>
                  <th>Period</th>
                  <th>Paid</th>
                  <th>How</th>
                  <th className="num">Amount</th>
                </tr>
              </thead>
              <tbody>
                {history.map((r) => (
                  <tr key={r.id}>
                    <td>{r.person}</td>
                    <td className="quiet">{periodLabel(r.period_start, r.period_end)}</td>
                    <td className="quiet">{r.paid_on ? dateLabel(r.paid_on) : "—"}</td>
                    <td className="quiet">{r.method || "—"}</td>
                    <td className="num mono">{money(r.amount_cents)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Notice>
        <strong>What this doesn&rsquo;t do.</strong> There is no payroll tax withholding here, and no view on
        whether the people who work in your home are employees or contractors. In the US that question has a
        real answer with real filing attached to it, and a household app quietly guessing at it would be worse
        than an honest gap. Ask an accountant once; this page keeps the record either way.
      </Notice>
    </>
  );
}

function MarkPaid({
  busy,
  today,
  onSave,
}: {
  busy: boolean;
  today: string;
  onSave: (method: string, paidOn: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [method, setMethod] = useState("");
  const [paidOn, setPaidOn] = useState(today);

  if (!open) {
    return (
      <button className="btn btn-sm" onClick={() => setOpen(true)}>
        Mark paid
      </button>
    );
  }
  return (
    <div className="stack" style={{ gap: 6, minWidth: 190 }}>
      <input className="field" style={{ fontSize: 13 }} type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
      <input className="field" style={{ fontSize: 13 }} placeholder="Zelle, cash, transfer…" value={method} onChange={(e) => setMethod(e.target.value)} />
      <div className="row-tight">
        <button className="btn btn-sm btn-primary" disabled={busy} onClick={() => onSave(method, paidOn)}>
          Record it
        </button>
        <button className="btn btn-quiet btn-sm" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function CloseShiftForm({
  forDate,
  busy,
  onCancel,
  onSave,
}: {
  forDate: string;
  busy: boolean;
  onCancel: () => void;
  onSave: (at: string) => void;
}) {
  const [time, setTime] = useState("17:00");
  return (
    <div className="card card-tight" style={{ background: "var(--paper)", marginBottom: 12 }}>
      <label className="label" htmlFor="close-time">
        What time did they actually leave on {dateLabel(forDate)}?
      </label>
      <div className="row">
        <input id="close-time" className="field" style={{ maxWidth: 140 }} type="time" value={time} onChange={(e) => setTime(e.target.value)} />
        <button
          className="btn btn-primary btn-sm"
          disabled={busy}
          // The date input is a local wall-clock time; new Date() on
          // "YYYY-MM-DDTHH:mm" reads it in the browser's zone, which is the
          // household's zone in every realistic case for this control.
          onClick={() => onSave(new Date(`${forDate}T${time}`).toISOString())}
        >
          Save
        </button>
        <button className="btn btn-quiet btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}
