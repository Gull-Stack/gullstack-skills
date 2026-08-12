"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { act } from "../../act";
import { Chip, Empty, Notice, SectionHead, Stat } from "../../ui";
import { dateLabel, relativeDays } from "@/lib/day";
import { BILL_CATEGORIES, type BillCadence, type BillStatus } from "@/lib/bills";
import { money, parseMoney } from "@/lib/pay";

export function BillsBoard({
  today,
  board,
  load,
}: {
  today: string;
  board: BillStatus[];
  load: { cents: number; unknown: number };
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [paying, setPaying] = useState<string | null>(null);

  async function run(body: unknown) {
    setBusy(true);
    setError(null);
    const r = await act("/api/bills", body);
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return false;
    }
    router.refresh();
    return true;
  }

  const live = board.filter((b) => b.state !== "inactive");
  const paused = board.filter((b) => b.state === "inactive");
  const unpaidSoon = live.filter((b) => b.state !== "paid" && (b.daysAway ?? 99) <= 10);

  return (
    <>
      {error ? <Notice tone="red">{error}</Notice> : null}

      <section className="card">
        <div className="row" style={{ gap: 28 }}>
          <Stat
            value={money(load.cents)}
            label="What the house costs a month"
            // The count of un-priced bills sits WITH the number, not behind it.
            // A total that quietly omits three bills is worse than no total.
            sub={load.unknown ? `${load.unknown} bill${load.unknown === 1 ? "" : "s"} without an amount` : "every bill has an amount"}
          />
          <Stat
            value={unpaidSoon.length}
            label="Due in the next ten days"
            tone={unpaidSoon.some((b) => b.state === "overdue") ? "var(--chip-red-fg)" : undefined}
          />
        </div>
      </section>

      <section className="card">
        <SectionHead
          title="What's coming"
          right={
            <button className="btn btn-sm btn-primary" onClick={() => setAdding((a) => !a)}>
              {adding ? "Close" : "Add a bill"}
            </button>
          }
        />

        {adding ? (
          <div className="card card-tight" style={{ background: "var(--paper)", marginBottom: 14 }}>
            <BillForm
              today={today}
              busy={busy}
              onSave={async (bill) => {
                const ok = await run(bill);
                if (ok) setAdding(false);
              }}
            />
          </div>
        ) : null}

        {live.length === 0 ? (
          <Empty>No bills yet. Add the recurring ones once and this page becomes the thing you check.</Empty>
        ) : (
          <div className="table-wrap">
            <table className="data">
              <thead>
                <tr>
                  <th>Bill</th>
                  <th>Due</th>
                  <th className="num">Amount</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {live.map((b) => (
                  <tr key={b.bill.id}>
                    <td>
                      <strong>{b.bill.name}</strong>
                      <div className="item-meta">
                        {[b.bill.category, b.bill.account, b.bill.autopay ? "autopay" : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                      {b.bill.url ? (
                        <div className="item-meta">
                          <a href={b.bill.url} target="_blank" rel="noreferrer">
                            Pay it →
                          </a>
                        </div>
                      ) : null}
                    </td>
                    <td>
                      {b.due ? dateLabel(b.due) : "—"}
                      <div className="item-meta">{b.due ? relativeDays(b.due, today) : ""}</div>
                    </td>
                    <td className="num mono">{b.bill.amount_cents == null ? "—" : money(b.bill.amount_cents)}</td>
                    <td className="num">
                      {b.state === "paid" ? (
                        <div className="stack" style={{ gap: 4, justifyItems: "end" }}>
                          <Chip tone="green">paid {b.payment?.paid_on ? dateLabel(b.payment.paid_on) : ""}</Chip>
                          <button
                            className="btn btn-quiet btn-sm"
                            disabled={busy}
                            onClick={() => run({ action: "unpaid", bill_id: b.bill.id, period: b.period })}
                          >
                            Undo
                          </button>
                        </div>
                      ) : paying === b.bill.id ? (
                        <PayForm
                          today={today}
                          defaultAmount={b.bill.amount_cents}
                          busy={busy}
                          onCancel={() => setPaying(null)}
                          onSave={async (amount, paidOn, method) => {
                            const ok = await run({
                              action: "paid",
                              bill_id: b.bill.id,
                              period: b.period,
                              paid_on: paidOn,
                              amount_cents: amount,
                              method,
                            });
                            if (ok) setPaying(null);
                          }}
                        />
                      ) : (
                        <div className="row-tight" style={{ justifyContent: "flex-end" }}>
                          {b.state === "overdue" ? <Chip tone="red">overdue</Chip> : null}
                          {b.state === "due" ? <Chip tone="amber">today</Chip> : null}
                          <button className="btn btn-sm" onClick={() => setPaying(b.bill.id)}>
                            Mark paid
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {paused.length ? (
          <>
            <hr className="hair" />
            <p className="eyebrow">Paused</p>
            <div className="row">
              {paused.map((b) => (
                <button
                  key={b.bill.id}
                  className="btn btn-sm"
                  disabled={busy}
                  onClick={() => run({ action: "active", id: b.bill.id, active: true })}
                >
                  {b.bill.name} — bring back
                </button>
              ))}
            </div>
          </>
        ) : null}
      </section>
    </>
  );
}

function PayForm({
  today,
  defaultAmount,
  busy,
  onCancel,
  onSave,
}: {
  today: string;
  defaultAmount: number | null;
  busy: boolean;
  onCancel: () => void;
  onSave: (amountCents: number | null, paidOn: string, method: string) => void;
}) {
  const [amount, setAmount] = useState(defaultAmount == null ? "" : (defaultAmount / 100).toFixed(2));
  const [paidOn, setPaidOn] = useState(today);
  const [method, setMethod] = useState("");
  const parsed = amount.trim() === "" ? null : parseMoney(amount);
  const badAmount = amount.trim() !== "" && parsed == null;

  return (
    <div className="stack" style={{ gap: 6, minWidth: 200, textAlign: "left" }}>
      <input className="field" style={{ fontSize: 13 }} type="date" value={paidOn} onChange={(e) => setPaidOn(e.target.value)} />
      <input
        className="field mono"
        style={{ fontSize: 13 }}
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      {badAmount ? <span className="quiet" style={{ color: "var(--chip-red-fg)" }}>That amount doesn&rsquo;t read as money.</span> : null}
      <input className="field" style={{ fontSize: 13 }} placeholder="How (optional)" value={method} onChange={(e) => setMethod(e.target.value)} />
      <div className="row-tight">
        <button className="btn btn-sm btn-primary" disabled={busy || badAmount} onClick={() => onSave(parsed, paidOn, method)}>
          Record it
        </button>
        <button className="btn btn-quiet btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function BillForm({
  today,
  busy,
  onSave,
}: {
  today: string;
  busy: boolean;
  onSave: (bill: Record<string, unknown>) => void;
}) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [cadence, setCadence] = useState<BillCadence>("monthly");
  const [dueDay, setDueDay] = useState(1);
  const [dueDate, setDueDate] = useState(today);
  const [autopay, setAutopay] = useState(false);
  const [account, setAccount] = useState("");
  const [url, setUrl] = useState("");

  const parsed = amount.trim() === "" ? null : parseMoney(amount);
  const badAmount = amount.trim() !== "" && parsed == null;

  return (
    <div className="stack">
      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: "2 1 220px" }}>
          <label className="label" htmlFor="b-name">
            What is it
          </label>
          <input id="b-name" className="field" value={name} onChange={(e) => setName(e.target.value)} placeholder="Power" />
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <label className="label" htmlFor="b-cat">
            Category
          </label>
          <select id="b-cat" className="field" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="">—</option>
            {BILL_CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: "1 1 140px" }}>
          <label className="label" htmlFor="b-amt">
            Amount (leave blank if it varies)
          </label>
          <input id="b-amt" className="field mono" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="180.00" />
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <label className="label" htmlFor="b-cad">
            How often
          </label>
          <select id="b-cad" className="field" value={cadence} onChange={(e) => setCadence(e.target.value as BillCadence)}>
            <option value="monthly">Monthly</option>
            <option value="quarterly">Quarterly</option>
            <option value="yearly">Yearly</option>
            <option value="once">Just once</option>
          </select>
        </div>
        {cadence === "once" ? (
          <div style={{ flex: "1 1 170px" }}>
            <label className="label" htmlFor="b-date">
              Due
            </label>
            <input id="b-date" className="field" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </div>
        ) : (
          <div style={{ flex: "1 1 120px" }}>
            <label className="label" htmlFor="b-day">
              Due day
            </label>
            <input id="b-day" className="field" type="number" min={1} max={31} value={dueDay} onChange={(e) => setDueDay(Number(e.target.value))} />
          </div>
        )}
      </div>

      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: "1 1 180px" }}>
          <label className="label" htmlFor="b-acct">
            Which account pays it
          </label>
          <input id="b-acct" className="field" value={account} onChange={(e) => setAccount(e.target.value)} placeholder="Joint checking" />
        </div>
        <div style={{ flex: "2 1 240px" }}>
          <label className="label" htmlFor="b-url">
            Link to pay it
          </label>
          <input id="b-url" className="field" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" />
        </div>
      </div>

      <label className="row-tight" style={{ cursor: "pointer" }}>
        <input type="checkbox" checked={autopay} onChange={(e) => setAutopay(e.target.checked)} />
        <span style={{ fontSize: 14 }}>It&rsquo;s on autopay</span>
      </label>

      {badAmount ? <Notice tone="red">That amount doesn&rsquo;t read as money.</Notice> : null}

      <button
        className="btn btn-primary"
        style={{ justifySelf: "start" }}
        disabled={busy || !name.trim() || badAmount}
        onClick={() =>
          onSave({
            name,
            category,
            amount_cents: parsed,
            cadence,
            due_day: dueDay,
            due_date: dueDate,
            autopay,
            account,
            url,
          })
        }
      >
        Add it
      </button>
    </div>
  );
}
