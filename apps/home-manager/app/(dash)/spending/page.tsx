import { redirect } from "next/navigation";
import { isOwner } from "@/lib/auth";
import { dbConfigured } from "@/lib/supabase";
import { dateLabel, monthLabel, monthStart, shiftDate, today as houseToday } from "@/lib/day";
import { getBills, getPaymentsForBills, monthlyLoad } from "@/lib/bills";
import { getRuns, money, periodLabel } from "@/lib/pay";
import { Chip, Empty, NoDatabase, Notice, SectionHead, Stat } from "../../ui";

export const dynamic = "force-dynamic";

/**
 * Where the money goes.
 *
 * Two halves, and the line between them is the point of the page:
 *
 * The TOP half is real. It is built only from things this app already knows for
 * certain — bills it has watched get paid, and pay runs somebody recorded. No
 * estimates, no projections, no blended figures.
 *
 * The BOTTOM half is honest about not existing. A bank connection is a real
 * feature with a real cost and a real approval process, and the worst possible
 * version of this page is one that shows a plausible-looking chart of "spending
 * by category" assembled from nothing. A blended number is unfalsifiable and
 * therefore worse than a zero.
 */
export default async function SpendingPage() {
  if (!(await isOwner())) redirect("/");

  const today = houseToday();
  const thisMonth = monthStart(today);
  const threeMonthsAgo = shiftDate(thisMonth, -92);

  const bills = await getBills();
  const [payments, runs] = await Promise.all([
    getPaymentsForBills(bills.map((b) => b.id)),
    getRuns(threeMonthsAgo, today),
  ]);

  const load = monthlyLoad(bills);

  const paidThisMonth = payments.filter((p) => p.paid_on >= thisMonth && p.paid_on <= today);
  const billsPaidCents = paidThisMonth.reduce((sum, p) => sum + (p.amount_cents ?? 0), 0);
  const billsMissingAmount = paidThisMonth.filter((p) => p.amount_cents == null).length;

  const paidRuns = runs.filter((r) => r.status === "paid" && r.paid_on && r.paid_on >= thisMonth);
  const payCents = paidRuns.reduce((sum, r) => sum + r.amount_cents, 0);

  const byCategory = new Map<string, number>();
  for (const p of paidThisMonth) {
    const bill = bills.find((b) => b.id === p.bill_id);
    const key = bill?.category || "Uncategorised";
    byCategory.set(key, (byCategory.get(key) ?? 0) + (p.amount_cents ?? 0));
  }
  if (payCents) byCategory.set("Household help", (byCategory.get("Household help") ?? 0) + payCents);
  const categories = [...byCategory.entries()].sort((a, b) => b[1] - a[1]);
  const largest = categories[0]?.[1] ?? 0;

  return (
    <>
      <SectionHead
        title="Spending"
        sub={`What this app can actually see, for ${monthLabel(thisMonth)} so far.`}
      />

      <div className="stack">
        {dbConfigured() ? null : <NoDatabase />}

        <section className="card">
          <div className="row" style={{ gap: 28 }}>
            <Stat
              value={money(billsPaidCents + payCents)}
              label="Recorded out this month"
              sub={
                billsMissingAmount
                  ? `${billsMissingAmount} paid bill without an amount, so the real figure is higher`
                  : "bills marked paid + pay recorded"
              }
            />
            <Stat
              value={money(load.cents)}
              label="Recurring load, per month"
              sub={load.unknown ? `${load.unknown} bill without an amount` : "from your recurring bills"}
            />
          </div>
        </section>

        <section className="card">
          <SectionHead
            title="Where it went"
            sub="Only what has actually been recorded — no estimates, nothing projected forward."
          />
          {categories.length === 0 ? (
            <Empty>
              Nothing recorded this month yet. Mark a bill paid on <a href="/bills">the Bills page</a> or record
              a payment on <a href="/pay">Pay</a>, and it lands here.
            </Empty>
          ) : (
            <div className="stack">
              {categories.map(([name, cents]) => (
                <div key={name}>
                  <div className="spread" style={{ marginBottom: 4 }}>
                    <span style={{ fontSize: 14 }}>{name}</span>
                    <span className="mono" style={{ fontSize: 14 }}>
                      {money(cents)}
                    </span>
                  </div>
                  <div className="meter">
                    <span
                      style={{
                        width: largest ? `${Math.round((cents / largest) * 100)}%` : "0%",
                        background: "var(--accent)",
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {paidRuns.length ? (
          <section className="card">
            <SectionHead title="Paid to the team this month" />
            <div className="list">
              {paidRuns.map((r) => (
                <div key={r.id} className="item">
                  <div style={{ flex: 1 }}>
                    <div className="item-title">{r.person}</div>
                    <div className="item-meta">
                      {periodLabel(r.period_start, r.period_end)} · {r.method || "unrecorded method"}
                    </div>
                  </div>
                  <span className="mono">{money(r.amount_cents)}</span>
                </div>
              ))}
            </div>
          </section>
        ) : null}

        {/* ── The honest gap ──────────────────────────────────────────────── */}
        <section className="card">
          <SectionHead
            title="Connecting a bank account"
            right={<Chip tone="amber">not connected</Chip>}
          />
          <p className="sub" style={{ maxWidth: 640 }}>
            Everything above comes from things somebody typed into this app. A live feed of what the household
            actually spends means connecting an account, and that is a real piece of work with a real cost —
            not a switch waiting to be flipped. It is written down here rather than half-built so nobody has to
            guess how far along it is.
          </p>

          <hr className="hair" />

          <p className="eyebrow">What it would take</p>
          <div className="list">
            <div className="item">
              <div>
                <div className="item-title">An aggregator account</div>
                <div className="item-meta">
                  Plaid is the usual answer in the US (Teller and MX are the alternatives). You apply, they
                  approve the use case, and you get a client ID and secret. Personal-use approval is not
                  instant and is the long pole here.
                </div>
              </div>
            </div>
            <div className="item">
              <div>
                <div className="item-title">A link flow, and somewhere to put the token</div>
                <div className="item-meta">
                  You sign in to your bank inside their widget once per account; the app stores a long-lived
                  access token. That token is a credential in the same class as a password — it belongs in a
                  service-role-only table with no read policy, never in the browser.
                </div>
              </div>
            </div>
            <div className="item">
              <div>
                <div className="item-title">A nightly pull, and a rule for matching</div>
                <div className="item-meta">
                  Transactions come in raw and mostly uncategorised. The useful part is not the list — you
                  already have that in your banking app — it is matching a transaction to a bill you were
                  expecting, so &ldquo;the power bill got paid&rdquo; stops being something you tick by hand.
                </div>
              </div>
            </div>
            <div className="item">
              <div>
                <div className="item-title">A decision about what the family sees</div>
                <div className="item-meta">
                  This page is already owner-only. A live bank feed makes that boundary matter much more, and
                  it is worth deciding deliberately rather than inheriting whatever the code happened to do.
                </div>
              </div>
            </div>
          </div>

          <Notice tone="amber">
            <strong>Until then, this page will not invent anything.</strong> No projected monthly spend, no
            &ldquo;estimated&rdquo; categories, no sample data dressed up as yours. If a number is on this
            page, somebody recorded it.
          </Notice>
        </section>
      </div>
    </>
  );
}
