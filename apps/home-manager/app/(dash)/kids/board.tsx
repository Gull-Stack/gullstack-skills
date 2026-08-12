"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { act } from "../../act";
import { Chip, Empty, Meter, Notice, SectionHead } from "../../ui";
import { IconCheck } from "../../icons";
import { dateLabel, dowName, shiftDate } from "@/lib/day";
import {
  childDay,
  completion,
  minutesOn,
  ROUTINE_KINDS,
  streak,
  type KidLog,
  type KidNote,
  type Routine,
  type RoutineKind,
} from "@/lib/kids";

export function KidsBoard({
  today,
  from,
  kids,
  routines,
  log,
  notes,
}: {
  today: string;
  from: string;
  kids: string[];
  routines: Routine[];
  log: KidLog[];
  notes: KidNote[];
}) {
  const router = useRouter();
  const [child, setChild] = useState(kids[0]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [minutesFor, setMinutesFor] = useState<string | null>(null);

  async function run(body: unknown, method: "POST" | "PUT" = "POST") {
    setBusy(true);
    setError(null);
    const r = await act("/api/kids", body, method as "POST");
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return false;
    }
    router.refresh();
    return true;
  }

  const day = childDay(routines.filter((r) => r.active), log, child, today);
  const done = day.filter((d) => d.state === "done").length;
  const mine = routines.filter((r) => r.child === child);
  const childNotes = notes.filter((n) => n.child === child);
  const weekAgo = shiftDate(today, -6);

  return (
    <>
      {error ? <Notice tone="red">{error}</Notice> : null}

      {kids.length > 1 ? (
        <div className="seg">
          {kids.map((k) => (
            <button key={k} aria-pressed={k === child} onClick={() => setChild(k)}>
              {k}
            </button>
          ))}
        </div>
      ) : null}

      {/* ── Today ───────────────────────────────────────────────────────── */}
      <section className="card">
        <SectionHead
          title={`${child} today`}
          sub={
            day.length === 0
              ? "Nothing set up yet — add the first routine below."
              : done === day.length
                ? "Everything for today is done."
                : `${done} of ${day.length} done.`
          }
        />
        {day.length === 0 ? (
          <Empty>Reading, cleaning up, getting outside — start with one and add more later.</Empty>
        ) : (
          <>
            <Meter done={done} total={day.length} />
            <div className="list" style={{ marginTop: 12 }}>
              {day.map(({ routine, log: entry, state }) => {
                const run7 = streak(log, routine.id, today);
                return (
                  <div key={routine.id}>
                    <div className="item">
                      <button
                        className="tick tick-big"
                        data-state={state}
                        disabled={busy}
                        aria-label={state === "done" ? `Un-tick ${routine.label}` : `Mark ${routine.label} done`}
                        onClick={() => {
                          if (state === "done") {
                            run({ clear: true, routine_id: routine.id, for_date: today });
                          } else if (routine.target_minutes) {
                            // Reading is the case where the number matters, so
                            // ticking it asks for minutes instead of guessing
                            // the target was met exactly.
                            setMinutesFor(minutesFor === routine.id ? null : routine.id);
                          } else {
                            run({ routine_id: routine.id, child, for_date: today, state: "done" });
                          }
                        }}
                      >
                        <IconCheck />
                      </button>
                      <div style={{ flex: 1 }}>
                        <div className="item-title">{routine.label}</div>
                        <div className="item-meta">
                          {kindLabel(routine.kind)}
                          {routine.target_minutes ? ` · aiming for ${routine.target_minutes} min` : ""}
                          {entry?.minutes ? ` · ${entry.minutes} min today` : ""}
                        </div>
                      </div>
                      {run7 > 1 ? <Chip tone="green">{run7} days running</Chip> : null}
                    </div>

                    {minutesFor === routine.id ? (
                      <MinutesForm
                        target={routine.target_minutes ?? 20}
                        busy={busy}
                        onCancel={() => setMinutesFor(null)}
                        onSave={async (minutes) => {
                          const ok = await run({
                            routine_id: routine.id,
                            child,
                            for_date: today,
                            state: "done",
                            minutes,
                          });
                          if (ok) setMinutesFor(null);
                        }}
                      />
                    ) : null}
                  </div>
                );
              })}
            </div>
          </>
        )}
      </section>

      {/* ── The last month ──────────────────────────────────────────────── */}
      {mine.filter((r) => r.active).length ? (
        <section className="card">
          <SectionHead
            title="How the month has gone"
            sub="Days it happened out of days it was meant to. Not a score — a picture."
          />
          <div className="stack">
            {mine
              .filter((r) => r.active)
              .map((routine) => {
                const c = completion(routines, log, routine.id, from, today);
                return (
                  <div key={routine.id}>
                    <div className="spread" style={{ marginBottom: 4 }}>
                      <span style={{ fontSize: 14 }}>{routine.label}</span>
                      <span className="quiet mono">
                        {c.done}/{c.due}
                      </span>
                    </div>
                    <Meter done={c.done} total={c.due} />
                  </div>
                );
              })}
          </div>
          <hr className="hair" />
          <p className="quiet" style={{ margin: 0 }}>
            {minutesOn(routines, log, child, "reading", weekAgo, today)} minutes of reading in the last seven
            days · {minutesOn(routines, log, child, "reading", from, today)} in the last thirty.
          </p>
        </section>
      ) : null}

      {/* ── Milestones ──────────────────────────────────────────────────── */}
      <section className="card">
        <SectionHead
          title="Worth keeping"
          sub="Written by a person, never guessed from a streak. First chapter book, learned to tie a lace, a hard day handled well."
        />
        <NoteForm child={child} today={today} busy={busy} onSave={(b) => run(b)} />
        {childNotes.length ? (
          <div className="list" style={{ marginTop: 12 }}>
            {childNotes.slice(0, 25).map((n, i) => (
              <div key={n.id ?? i} className="item">
                <div style={{ flex: 1 }}>
                  <div className="item-title" style={{ fontWeight: 400 }}>
                    {n.body}
                  </div>
                  <div className="item-meta">
                    {dateLabel(n.for_date, { year: true })} · {n.logged_by}
                  </div>
                </div>
                {n.kind === "milestone" ? <Chip tone="blue">milestone</Chip> : null}
              </div>
            ))}
          </div>
        ) : (
          <p className="quiet" style={{ marginTop: 12 }}>
            Nothing written down yet.
          </p>
        )}
      </section>

      {/* ── Setup ───────────────────────────────────────────────────────── */}
      <section className="card">
        <SectionHead
          title={`${child}'s routine`}
          right={
            <button className="btn btn-sm btn-primary" onClick={() => setAdding((a) => !a)}>
              {adding ? "Close" : "Add one"}
            </button>
          }
        />
        {adding ? (
          <div className="card card-tight" style={{ background: "var(--paper)", marginBottom: 14 }}>
            <RoutineForm
              child={child}
              busy={busy}
              onSave={async (r) => {
                const ok = await run(r, "PUT");
                if (ok) setAdding(false);
              }}
            />
          </div>
        ) : null}
        {mine.length === 0 ? (
          <Empty>Nothing set up for {child} yet.</Empty>
        ) : (
          <div className="list">
            {mine.map((routine) => (
              <div key={routine.id} className="item">
                <div style={{ flex: 1 }}>
                  <div className="item-title" style={{ opacity: routine.active ? 1 : 0.55 }}>
                    {routine.label} {routine.active ? null : <Chip>paused</Chip>}
                  </div>
                  <div className="item-meta">
                    {kindLabel(routine.kind)} ·{" "}
                    {routine.cadence === "daily" ? "every day" : `every ${dowName(routine.day_of_week ?? 1)}`}
                    {routine.target_minutes ? ` · ${routine.target_minutes} min` : ""}
                  </div>
                </div>
                <button
                  className="btn btn-quiet btn-sm"
                  disabled={busy}
                  onClick={() => run({ id: routine.id, active: !routine.active }, "PUT")}
                >
                  {routine.active ? "Pause" : "Bring back"}
                </button>
              </div>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

function kindLabel(kind: RoutineKind): string {
  return ROUTINE_KINDS.find((k) => k.key === kind)?.label ?? kind;
}

function MinutesForm({
  target,
  busy,
  onCancel,
  onSave,
}: {
  target: number;
  busy: boolean;
  onCancel: () => void;
  onSave: (minutes: number) => void;
}) {
  const [minutes, setMinutes] = useState(target);
  return (
    <div className="card card-tight" style={{ background: "var(--paper)", marginBottom: 12 }}>
      <label className="label" htmlFor="k-min">
        How long?
      </label>
      <div className="row">
        <input
          id="k-min"
          className="field mono"
          style={{ maxWidth: 110 }}
          type="number"
          min={0}
          max={600}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
        />
        <button className="btn btn-primary btn-sm" disabled={busy} onClick={() => onSave(minutes)}>
          Done
        </button>
        <button className="btn btn-quiet btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function NoteForm({
  child,
  today,
  busy,
  onSave,
}: {
  child: string;
  today: string;
  busy: boolean;
  onSave: (body: unknown) => void;
}) {
  const [text, setText] = useState("");
  const [kind, setKind] = useState<"milestone" | "note">("milestone");

  return (
    <div className="stack">
      <div className="seg">
        <button aria-pressed={kind === "milestone"} onClick={() => setKind("milestone")}>
          Milestone
        </button>
        <button aria-pressed={kind === "note"} onClick={() => setKind("note")}>
          Just a note
        </button>
      </div>
      <textarea
        className="field"
        rows={2}
        placeholder={kind === "milestone" ? "Read a whole chapter on her own tonight." : "Rough afternoon — missed a nap."}
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button
        className="btn"
        style={{ justifySelf: "start" }}
        disabled={busy || !text.trim()}
        onClick={() => {
          onSave({ kind, child, for_date: today, body: text });
          setText("");
        }}
      >
        Write it down
      </button>
    </div>
  );
}

function RoutineForm({
  child,
  busy,
  onSave,
}: {
  child: string;
  busy: boolean;
  onSave: (routine: Record<string, unknown>) => void;
}) {
  const [label, setLabel] = useState("");
  const [kind, setKind] = useState<RoutineKind>("reading");
  const [minutes, setMinutes] = useState<string>("20");
  const [cadence, setCadence] = useState<"daily" | "weekly">("daily");
  const [dow, setDow] = useState(1);

  return (
    <div className="stack">
      <div>
        <label className="label" htmlFor="r-label">
          What should happen
        </label>
        <input id="r-label" className="field" value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Read for 20 minutes" />
      </div>
      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: "1 1 150px" }}>
          <label className="label" htmlFor="r-kind">
            Kind
          </label>
          <select id="r-kind" className="field" value={kind} onChange={(e) => setKind(e.target.value as RoutineKind)}>
            {ROUTINE_KINDS.map((k) => (
              <option key={k.key} value={k.key}>
                {k.label}
              </option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 130px" }}>
          <label className="label" htmlFor="r-min">
            Minutes (optional)
          </label>
          <input id="r-min" className="field" type="number" min={0} max={600} value={minutes} onChange={(e) => setMinutes(e.target.value)} />
        </div>
        <div style={{ flex: "1 1 130px" }}>
          <label className="label" htmlFor="r-cad">
            How often
          </label>
          <select id="r-cad" className="field" value={cadence} onChange={(e) => setCadence(e.target.value as "daily" | "weekly")}>
            <option value="daily">Every day</option>
            <option value="weekly">Once a week</option>
          </select>
        </div>
        {cadence === "weekly" ? (
          <div style={{ flex: "1 1 130px" }}>
            <label className="label" htmlFor="r-dow">
              Which day
            </label>
            <select id="r-dow" className="field" value={dow} onChange={(e) => setDow(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <option key={d} value={d}>
                  {dowName(d)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
      </div>
      <button
        className="btn btn-primary"
        style={{ justifySelf: "start" }}
        disabled={busy || !label.trim()}
        onClick={() =>
          onSave({
            child,
            label,
            kind,
            target_minutes: minutes.trim() === "" ? null : Number(minutes),
            cadence,
            day_of_week: dow,
          })
        }
      >
        Add it
      </button>
    </div>
  );
}
