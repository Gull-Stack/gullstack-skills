import Link from "next/link";
import { currentUser, isOwner } from "@/lib/auth";
import { dbConfigured } from "@/lib/supabase";
import { dateLabel, relativeDays, shiftDate, today as houseToday } from "@/lib/day";
import { getPeople, staffNames, childNames, toneMap } from "@/lib/people";
import { dayBoard, getLog, getTasks, tally, tallyLine } from "@/lib/tasks";
import { getDefaults, getOverrides, getTimeOff, whoWorks } from "@/lib/schedule";
import { durationLabel, staleShifts, whoIsHere } from "@/lib/clock";
import { getClock } from "@/lib/pay";
import { getKidLog, getRoutines, summarize } from "@/lib/kids";
import { billBoard, getBills, getPaymentsForBills, needsAttention } from "@/lib/bills";
import { Chip, Empty, Meter, NoDatabase, Notice, PersonChip, SectionHead, Stat } from "../ui";

export const dynamic = "force-dynamic";

/**
 * Today.
 *
 * The one question this page answers: **is the house handled right now?** Who
 * is here, what is still open, how the kids' day is going, and whether any
 * money needs attention this week. Everything else is one tap away and does not
 * belong above the fold.
 */
export default async function TodayPage() {
  const today = houseToday();
  const weekAgo = shiftDate(today, -6);
  const now = Date.now();

  const [user, owner, people, tasks, log, defaults, overrides, timeOff, clock, routines, kidLog, bills] =
    await Promise.all([
      currentUser(),
      isOwner(),
      getPeople(),
      getTasks(),
      getLog(today),
      getDefaults(),
      getOverrides(today, today),
      getTimeOff(today, today),
      getClock(today, today),
      getRoutines(),
      getKidLog(weekAgo, today),
      getBills(),
    ]);

  const payments = await getPaymentsForBills(bills.map((b) => b.id));

  const tones = toneMap(people);
  const staff = staffNames(people);
  const kids = childNames(people);

  const scheduled = whoWorks(today, defaults, overrides, timeOff, staff);
  const here = whoIsHere(clock, now);
  const board = dayBoard(tasks, log, today);
  const counts = tally(board);
  const stale = staleShifts(clock, today);
  const attention = owner ? needsAttention(billBoard(bills, payments, today)) : [];

  const pendingOff = timeOff.filter((t) => t.status === "pending");
  const stillOpen = board.filter((b) => b.state === "open");
  const leftUndone = board.filter((b) => b.state === "skipped");

  return (
    <>
      <p className="eyebrow">{dateLabel(today, { year: true })}</p>
      <h1 className="display" style={{ marginTop: 6 }}>
        {greeting()}, {user}.
      </h1>
      <p className="sub" style={{ maxWidth: 620 }}>
        {tallyLine(counts)}
        {scheduled.length ? ` · ${scheduled.join(" and ")} ${scheduled.length === 1 ? "is" : "are"} on today.` : " · Nobody is scheduled today."}
      </p>

      <div className="stack" style={{ marginTop: 22 }}>
        {dbConfigured() ? null : <NoDatabase />}

        {stale.length ? (
          <Notice tone="amber">
            <strong>
              {stale.length === 1
                ? `${stale[0].person} never clocked out on ${dateLabel(stale[0].for_date)}.`
                : `${stale.length} shifts were never clocked out.`}
            </strong>{" "}
            Left alone that turns into an overnight shift on a payslip.{" "}
            <Link href="/pay">Fix the hours →</Link>
          </Notice>
        ) : null}

        {pendingOff.length ? (
          <Notice tone="amber">
            <strong>{pendingOff.length} time-off request{pendingOff.length === 1 ? "" : "s"} waiting on you.</strong>{" "}
            <Link href="/schedule">Answer {pendingOff.length === 1 ? "it" : "them"} →</Link>
          </Notice>
        ) : null}

        {/* ── Who is here ──────────────────────────────────────────────── */}
        <section className="card">
          <SectionHead
            title="Who's here"
            sub={
              here.length
                ? "Clocked in right now."
                : scheduled.length
                  ? "Nobody has clocked in yet today."
                  : "Nobody is scheduled today."
            }
            right={
              <Link className="btn btn-sm" href="/schedule">
                The week
              </Link>
            }
          />
          {here.length ? (
            <div className="row">
              {here.map((h) => (
                <span key={h.person} className="chip chip-green">
                  <span className="dot" style={{ background: "var(--green)" }} />
                  {h.person} · {durationLabel(h.minutes)}
                </span>
              ))}
            </div>
          ) : scheduled.length ? (
            <div className="row">
              {scheduled.map((n) => (
                <PersonChip key={n} name={n} tone={tones[n]} />
              ))}
            </div>
          ) : (
            <Empty>
              {staff.length
                ? "No standing days are set for today. The schedule page is where that lives."
                : "Add the people who work here on the People page and they'll show up here."}
            </Empty>
          )}
        </section>

        {/* ── Today's list ─────────────────────────────────────────────── */}
        <section className="card">
          <SectionHead
            title="Today's list"
            sub={tallyLine(counts)}
            right={
              <Link className="btn btn-sm" href="/tasks">
                All tasks
              </Link>
            }
          />
          {counts.total === 0 ? (
            <Empty>
              Nothing is due today. Tasks and how often they come around live on{" "}
              <Link href="/tasks">the Tasks page</Link>.
            </Empty>
          ) : (
            <>
              <div className="row" style={{ gap: 18, marginBottom: 14 }}>
                <Stat value={`${counts.done}/${counts.total}`} label="Handled" />
                {counts.skipped ? <Stat value={counts.skipped} label="Left with a reason" tone="var(--amber)" /> : null}
              </div>
              <Meter done={counts.done} total={counts.total} />

              {stillOpen.length ? (
                <>
                  <p className="eyebrow" style={{ marginTop: 18 }}>
                    Still open
                  </p>
                  <div className="list">
                    {stillOpen.slice(0, 6).map(({ task }) => (
                      <div key={task.id} className="item">
                        <div style={{ flex: 1 }}>
                          <div className="item-title">{task.title}</div>
                          {task.area ? <div className="item-meta">{task.area}</div> : null}
                        </div>
                        {task.assigned_to ? <PersonChip name={task.assigned_to} tone={tones[task.assigned_to]} /> : null}
                      </div>
                    ))}
                  </div>
                  {stillOpen.length > 6 ? (
                    <p className="quiet" style={{ marginTop: 8 }}>
                      and {stillOpen.length - 6} more
                    </p>
                  ) : null}
                </>
              ) : null}

              {leftUndone.length ? (
                <>
                  <p className="eyebrow" style={{ marginTop: 18 }}>
                    Left undone — and why
                  </p>
                  <div className="list">
                    {leftUndone.map(({ task, log: entry }) => (
                      <div key={task.id} className="item">
                        <div style={{ flex: 1 }}>
                          <div className="item-title">{task.title}</div>
                          {/* The reason IS the feature. It is never collapsed
                              behind a chevron. */}
                          <div className="item-meta" style={{ color: "var(--chip-amber-fg)" }}>
                            “{entry?.reason}”
                          </div>
                        </div>
                        {entry ? <PersonChip name={entry.person} tone={tones[entry.person]} /> : null}
                      </div>
                    ))}
                  </div>
                </>
              ) : null}
            </>
          )}
        </section>

        {/* ── The kids ─────────────────────────────────────────────────── */}
        <section className="card">
          <SectionHead
            title="The kids today"
            sub="Read, cleaned up, ate, got out — the things that should happen every day."
            right={
              <Link className="btn btn-sm" href="/kids">
                Open
              </Link>
            }
          />
          {kids.length === 0 ? (
            <Empty>
              Add the children on <Link href="/people">the People page</Link>, then give each one a daily
              routine.
            </Empty>
          ) : (
            <div className="grid grid-3">
              {kids.map((child) => {
                const s = summarize(routines, kidLog, child, today);
                return (
                  <div key={child} className="card card-tight" style={{ background: "var(--panel-2)" }}>
                    <div className="spread">
                      <strong>{child}</strong>
                      {s.todayDue === 0 ? (
                        <Chip>no routine yet</Chip>
                      ) : s.todayDone === s.todayDue ? (
                        <Chip tone="green">all done</Chip>
                      ) : (
                        <Chip>
                          {s.todayDone}/{s.todayDue}
                        </Chip>
                      )}
                    </div>
                    <div style={{ marginTop: 10 }}>
                      <Meter done={s.todayDone} total={s.todayDue} />
                    </div>
                    <p className="quiet" style={{ marginTop: 10 }}>
                      {s.readingMinutesWeek > 0 ? `${s.readingMinutesWeek} min reading this week` : "No reading logged this week"}
                      {s.bestStreak ? ` · ${s.bestStreak.days}-day streak on ${s.bestStreak.label.toLowerCase()}` : ""}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Money, owners only ───────────────────────────────────────── */}
        {owner ? (
          <section className="card">
            <SectionHead
              title="Money this week"
              sub="Bills coming up in the next ten days."
              right={
                <Link className="btn btn-sm" href="/bills">
                  All bills
                </Link>
              }
            />
            {attention.length === 0 ? (
              <Empty>
                {bills.length
                  ? "Nothing is due in the next ten days."
                  : "No bills are set up yet. Add them on the Bills page and this becomes the thing you check."}
              </Empty>
            ) : (
              <div className="list">
                {attention.map((b) => (
                  <div key={b.bill.id} className="item">
                    <div style={{ flex: 1 }}>
                      <div className="item-title">{b.bill.name}</div>
                      <div className="item-meta">
                        {b.due ? `Due ${relativeDays(b.due, today)}` : ""}
                        {b.bill.autopay ? " · autopay" : ""}
                      </div>
                    </div>
                    {b.state === "overdue" ? <Chip tone="red">overdue</Chip> : b.state === "due" ? <Chip tone="amber">due today</Chip> : null}
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : null}
      </div>
    </>
  );
}

function greeting(): string {
  const hour = Number(
    new Date().toLocaleString("en-US", { hour: "numeric", hour12: false, timeZone: process.env.HOME_TZ || "America/Denver" })
  );
  if (hour < 12) return "Morning";
  if (hour < 18) return "Afternoon";
  return "Evening";
}
