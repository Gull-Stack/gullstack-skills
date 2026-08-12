"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { act } from "../../act";
import { Chip, Empty, Notice, PersonChip, SectionHead } from "../../ui";
import { dateLabel, dowName, shiftDate } from "@/lib/day";
import type { DayColumn, DefaultDay, TimeOff } from "@/lib/schedule";
import type { Tone } from "@/lib/people";

const DOWS = [1, 2, 3, 4, 5, 6, 0]; // Monday-first, the way a household reads a week

export function ScheduleBoard({
  monday,
  today,
  week,
  staff,
  tones,
  defaults,
  timeOff,
}: {
  monday: string;
  today: string;
  week: DayColumn[];
  staff: string[];
  tones: Record<string, Tone>;
  defaults: DefaultDay[];
  timeOff: TimeOff[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [swapDay, setSwapDay] = useState<string | null>(null);

  async function run(body: unknown) {
    setBusy(true);
    setError(null);
    const r = await act("/api/schedule", body);
    setBusy(false);
    if (!r.ok) setError(r.message);
    else router.refresh();
  }

  const pending = timeOff.filter((t) => t.status === "pending");
  const approved = timeOff.filter((t) => t.status === "approved" && t.to_date >= today);

  return (
    <>
      {error ? <Notice tone="red">{error}</Notice> : null}

      <section className="card">
        <SectionHead
          title={`Week of ${dateLabel(monday)}`}
          right={
            <div className="row-tight">
              <a className="btn btn-sm" href={`/schedule?w=${shiftDate(monday, -7)}`}>
                ←
              </a>
              <a className="btn btn-sm" href="/schedule">
                This week
              </a>
              <a className="btn btn-sm" href={`/schedule?w=${shiftDate(monday, 7)}`}>
                →
              </a>
            </div>
          }
        />

        <div className="week">
          {week.map((day) => (
            <div key={day.date} className="week-col" data-today={day.isToday} data-past={day.isPast}>
              <div>
                <div className="week-dow">{day.dowLabel}</div>
                <div className="week-date">{Number(day.date.slice(8))}</div>
              </div>

              {day.who.length ? (
                <div className="stack" style={{ gap: 4 }}>
                  {day.who.map((n) => (
                    <PersonChip key={n} name={n} tone={tones[n]} />
                  ))}
                </div>
              ) : (
                <span className="quiet">
                  {day.off.length ? `${day.off.join(", ")} off` : "nobody"}
                </span>
              )}

              {day.tasks.length ? (
                <div className="stack" style={{ gap: 3 }}>
                  {day.tasks.slice(0, 5).map((t) => (
                    <span key={t.id} className="week-task" data-state={t.state}>
                      <span
                        className="dot"
                        style={{
                          marginTop: 5,
                          background:
                            t.state === "done"
                              ? "var(--green)"
                              : t.state === "skipped"
                                ? "var(--amber)"
                                : "var(--track)",
                        }}
                      />
                      {t.title}
                    </span>
                  ))}
                  {day.tasks.length > 5 ? (
                    <span className="quiet" style={{ fontSize: 11 }}>
                      +{day.tasks.length - 5} more
                    </span>
                  ) : null}
                </div>
              ) : null}

              {staff.length > 1 ? (
                <button
                  className="btn btn-quiet btn-sm"
                  style={{ justifySelf: "start", padding: "2px 8px" }}
                  onClick={() => setSwapDay(swapDay === day.date ? null : day.date)}
                >
                  {swapDay === day.date ? "Cancel" : "Swap"}
                </button>
              ) : null}

              {swapDay === day.date ? (
                <SwapForm day={day} staff={staff} busy={busy} onRun={run} />
              ) : null}
            </div>
          ))}
        </div>

        {week.some((d) => d.who.length === 0 && d.tasks.length > 0) ? (
          <p className="quiet" style={{ marginTop: 12 }}>
            Some days have work on them and nobody scheduled. That&rsquo;s shown rather than hidden — the tasks
            are still there, they just don&rsquo;t have a person.
          </p>
        ) : null}
      </section>

      {/* ── Standing days ───────────────────────────────────────────────── */}
      <section className="card">
        <SectionHead title="Standing days" sub="The normal week. Change this and every future week follows." />
        {staff.length === 0 ? (
          <Empty>
            Nobody is set up as staff yet. Add them on <a href="/people">the People page</a>.
          </Empty>
        ) : (
          <div className="stack" style={{ gap: 14 }}>
            {staff.map((person) => {
              const mine = new Set(defaults.filter((d) => d.person === person).map((d) => d.dow));
              return (
                <div key={person}>
                  <div className="row" style={{ marginBottom: 6 }}>
                    <PersonChip name={person} tone={tones[person]} />
                  </div>
                  <div className="seg">
                    {DOWS.map((dow) => (
                      <button
                        key={dow}
                        aria-pressed={mine.has(dow)}
                        disabled={busy}
                        onClick={() => {
                          const next = new Set(mine);
                          if (next.has(dow)) next.delete(dow);
                          else next.add(dow);
                          run({ action: "defaults", person, dows: [...next] });
                        }}
                      >
                        {dowName(dow, true)}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Time off ────────────────────────────────────────────────────── */}
      <section className="card">
        <SectionHead
          title="Time off"
          sub="Requests come in from the team door. Approving one takes that person off the calendar."
        />

        {pending.length ? (
          <div className="list" style={{ marginBottom: 12 }}>
            {pending.map((t) => (
              <div key={t.id} className="item">
                <div style={{ flex: 1 }}>
                  <div className="item-title">
                    {t.person} — {rangeLabel(t)}
                  </div>
                  {t.note ? <div className="item-meta">“{t.note}”</div> : null}
                </div>
                <div className="row-tight">
                  <button
                    className="btn btn-sm btn-primary"
                    disabled={busy}
                    onClick={() => run({ action: "answer", id: t.id, status: "approved" })}
                  >
                    Approve
                  </button>
                  <button
                    className="btn btn-sm"
                    disabled={busy}
                    onClick={() => run({ action: "answer", id: t.id, status: "denied" })}
                  >
                    Not this time
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="quiet" style={{ marginTop: 0 }}>
            Nothing waiting on an answer.
          </p>
        )}

        {approved.length ? (
          <>
            <p className="eyebrow" style={{ marginTop: 14 }}>
              Coming up
            </p>
            <div className="row">
              {approved.map((t) => (
                <Chip key={t.id}>
                  {t.person} · {rangeLabel(t)}
                </Chip>
              ))}
            </div>
          </>
        ) : null}

        {staff.length ? (
          <>
            <hr className="hair" />
            <AddTimeOff staff={staff} busy={busy} onRun={run} today={today} />
          </>
        ) : null}
      </section>
    </>
  );
}

function rangeLabel(t: TimeOff): string {
  return t.from_date === t.to_date ? dateLabel(t.from_date) : `${dateLabel(t.from_date)} – ${dateLabel(t.to_date)}`;
}

function SwapForm({
  day,
  staff,
  busy,
  onRun,
}: {
  day: DayColumn;
  staff: string[];
  busy: boolean;
  onRun: (body: unknown) => void;
}) {
  const [off, setOff] = useState(day.who[0] ?? "");
  const [on, setOn] = useState(staff.find((s) => !day.who.includes(s)) ?? "");

  return (
    <div className="stack" style={{ gap: 6, marginTop: 4 }}>
      <select className="field" style={{ fontSize: 13, padding: "6px 8px" }} value={off} onChange={(e) => setOff(e.target.value)}>
        <option value="">nobody off</option>
        {day.who.map((n) => (
          <option key={n} value={n}>
            {n} off
          </option>
        ))}
      </select>
      <select className="field" style={{ fontSize: 13, padding: "6px 8px" }} value={on} onChange={(e) => setOn(e.target.value)}>
        <option value="">nobody on</option>
        {staff.map((n) => (
          <option key={n} value={n}>
            {n} on
          </option>
        ))}
      </select>
      <button
        className="btn btn-sm btn-primary"
        disabled={busy || (!off && !on)}
        onClick={() => onRun({ action: "swap", date: day.date, off, on })}
      >
        Save the swap
      </button>
    </div>
  );
}

function AddTimeOff({
  staff,
  busy,
  onRun,
  today,
}: {
  staff: string[];
  busy: boolean;
  onRun: (body: unknown) => void;
  today: string;
}) {
  const [person, setPerson] = useState(staff[0] ?? "");
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [note, setNote] = useState("");

  if (!staff.length) return null;

  return (
    <div className="stack">
      <p className="eyebrow">Book time off for someone</p>
      <div className="row" style={{ gap: 8 }}>
        <select className="field" style={{ maxWidth: 160 }} value={person} onChange={(e) => setPerson(e.target.value)}>
          {staff.map((n) => (
            <option key={n}>{n}</option>
          ))}
        </select>
        <input className="field" style={{ maxWidth: 165 }} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="field" style={{ maxWidth: 165 }} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <input className="field" placeholder="Why (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button
        className="btn"
        style={{ justifySelf: "start" }}
        disabled={busy || !person}
        onClick={() =>
          onRun({ action: "time-off", person, from_date: from, to_date: to, note, status: "approved" })
        }
      >
        Book it (already approved)
      </button>
    </div>
  );
}
