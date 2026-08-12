"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { act } from "../act";
import { Chip, Empty, Meter, Notice } from "../ui";
import { IconCheck } from "../icons";
import { dateLabel, timeLabel } from "@/lib/day";
import { durationLabel } from "@/lib/clock";
import { SKIP_REASONS, tally, type DayStatus } from "@/lib/tasks";
import type { TimeOff } from "@/lib/schedule";
import type { RoutineStatus } from "@/lib/kids";

export function Kiosk({
  who,
  today,
  onToday,
  board,
  openSince,
  kids,
  myTimeOff,
}: {
  who: string;
  today: string;
  onToday: string[];
  board: DayStatus[];
  openSince: string | null;
  kids: { child: string; routines: RoutineStatus[] }[];
  myTimeOff: TimeOff[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipping, setSkipping] = useState<string | null>(null);
  const [asking, setAsking] = useState(false);
  const [tick, setTick] = useState(0);

  // The running clock ticks on screen. It is the one thing on this page that
  // has to look alive — a frozen number reads as "it didn't start".
  useEffect(() => {
    if (!openSince) return;
    const id = setInterval(() => setTick((t) => t + 1), 30_000);
    return () => clearInterval(id);
  }, [openSince]);

  async function run(url: string, body: unknown) {
    setBusy(true);
    setError(null);
    const r = await act(url, body);
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return false;
    }
    router.refresh();
    return true;
  }

  const counts = tally(board);
  const minutes = openSince ? Math.max(0, Math.floor((Date.now() - Date.parse(openSince)) / 60_000)) : 0;
  void tick; // the interval above is what re-reads Date.now()

  return (
    <>
      <div className="kiosk-hero">
        <p className="eyebrow">{dateLabel(today, { year: true })}</p>
        <h1 className="display">Hi {who}.</h1>
        <p className="sub">
          {/* She is reading her own name back at herself otherwise, which is
              the tell that a page was written about somebody rather than to
              them. */}
          {onToday.includes(who)
            ? onToday.length === 1
              ? "You're on today."
              : `You're on today, with ${onToday.filter((n) => n !== who).join(" and ")}.`
            : onToday.length
              ? `${onToday.join(" and ")} on today — you're not on the calendar.`
              : "Nobody is on the calendar today — if that's wrong, tell the house."}
        </p>
      </div>

      {error ? <Notice tone="red">{error}</Notice> : null}

      {/* ── The clock ───────────────────────────────────────────────────── */}
      <section className="card" style={{ marginBottom: 14 }}>
        {openSince ? (
          <>
            <div className="spread">
              <div>
                <div className="stat-num" style={{ color: "var(--green)" }}>{durationLabel(minutes)}</div>
                <div className="stat-label">Since {timeLabel(openSince)}</div>
              </div>
              <Chip tone="green">
                <span className="dot" style={{ background: "var(--green)" }} />
                clocked in
              </Chip>
            </div>
            <button
              className="btn btn-big"
              style={{ width: "100%", marginTop: 14 }}
              disabled={busy}
              onClick={() => run("/api/team/clock", { action: "out" })}
            >
              Clock out
            </button>
          </>
        ) : (
          <>
            <p className="sub" style={{ marginTop: 0 }}>
              Not clocked in.
            </p>
            <button
              className="btn btn-big btn-primary"
              style={{ width: "100%" }}
              disabled={busy}
              onClick={() => run("/api/team/clock", { action: "in" })}
            >
              Clock in
            </button>
          </>
        )}
      </section>

      {/* ── Today's list ────────────────────────────────────────────────── */}
      <section className="card" style={{ marginBottom: 14 }}>
        <div className="spread" style={{ marginBottom: 10 }}>
          <strong>Today&rsquo;s list</strong>
          <span className="quiet mono">
            {counts.done}/{counts.total}
          </span>
        </div>
        {counts.total === 0 ? (
          <Empty>Nothing on the list today.</Empty>
        ) : (
          <>
            <Meter done={counts.done} total={counts.total} />
            <div className="list" style={{ marginTop: 12 }}>
              {board.map(({ task, log: entry, state }) => (
                <div key={task.id}>
                  <div className="item">
                    <button
                      className="tick tick-big"
                      data-state={state}
                      disabled={busy}
                      aria-label={state === "done" ? `Un-tick ${task.title}` : `Mark ${task.title} done`}
                      onClick={() =>
                        state === "done"
                          ? run("/api/tasks", { clear: true, task_id: task.id, for_date: today })
                          : run("/api/tasks", { task_id: task.id, for_date: today, state: "done" })
                      }
                    >
                      <IconCheck />
                    </button>
                    <div style={{ flex: 1 }}>
                      <div className="item-title">{task.title}</div>
                      {task.detail ? <div className="item-meta">{task.detail}</div> : null}
                      {task.video_url ? (
                        <div className="item-meta">
                          <a href={task.video_url} target="_blank" rel="noreferrer">
                            Show me how →
                          </a>
                        </div>
                      ) : null}
                      {state === "skipped" && entry ? (
                        <div className="item-meta" style={{ color: "var(--chip-amber-fg)" }}>
                          Left undone: “{entry.reason}”
                        </div>
                      ) : null}
                    </div>
                    {state === "open" ? (
                      <button className="btn btn-quiet btn-sm" onClick={() => setSkipping(skipping === task.id ? null : task.id)}>
                        Couldn&rsquo;t
                      </button>
                    ) : null}
                  </div>

                  {skipping === task.id ? (
                    <SkipCard
                      busy={busy}
                      onCancel={() => setSkipping(null)}
                      onSave={async (reason, note) => {
                        const ok = await run("/api/tasks", {
                          task_id: task.id,
                          for_date: today,
                          state: "skipped",
                          reason,
                          note,
                        });
                        if (ok) setSkipping(null);
                      }}
                    />
                  ) : null}
                </div>
              ))}
            </div>
          </>
        )}
      </section>

      {/* ── The kids ────────────────────────────────────────────────────── */}
      {kids.map(({ child, routines }) =>
        routines.length ? (
          <section key={child} className="card" style={{ marginBottom: 14 }}>
            <div className="spread" style={{ marginBottom: 10 }}>
              <strong>{child}</strong>
              <span className="quiet mono">
                {routines.filter((r) => r.state === "done").length}/{routines.length}
              </span>
            </div>
            <div className="list">
              {routines.map(({ routine, log: entry, state }) => (
                <div key={routine.id} className="item">
                  <button
                    className="tick tick-big"
                    data-state={state}
                    disabled={busy}
                    aria-label={state === "done" ? `Un-tick ${routine.label}` : `Mark ${routine.label} done`}
                    onClick={() =>
                      state === "done"
                        ? run("/api/kids", { clear: true, routine_id: routine.id, for_date: today })
                        : run("/api/kids", {
                            routine_id: routine.id,
                            child,
                            for_date: today,
                            state: "done",
                            minutes: routine.target_minutes,
                          })
                    }
                  >
                    <IconCheck />
                  </button>
                  <div style={{ flex: 1 }}>
                    <div className="item-title">{routine.label}</div>
                    {entry?.minutes ? <div className="item-meta">{entry.minutes} min</div> : null}
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : null
      )}

      {/* ── Time off ────────────────────────────────────────────────────── */}
      <section className="card">
        <div className="spread" style={{ marginBottom: 10 }}>
          <strong>Need a day off?</strong>
          <button className="btn btn-sm" onClick={() => setAsking((a) => !a)}>
            {asking ? "Close" : "Ask"}
          </button>
        </div>
        <p className="quiet" style={{ marginTop: 0 }}>
          Asking here beats a text that gets lost. Somebody answers it and the calendar updates itself.
        </p>

        {asking ? <TimeOffForm today={today} busy={busy} onSave={async (b) => {
          const ok = await run("/api/team/time-off", b);
          if (ok) setAsking(false);
        }} /> : null}

        {myTimeOff.length ? (
          <div className="row" style={{ marginTop: 12 }}>
            {myTimeOff.map((t) => (
              <Chip key={t.id} tone={t.status === "approved" ? "green" : t.status === "denied" ? "red" : "amber"}>
                {t.from_date === t.to_date ? dateLabel(t.from_date) : `${dateLabel(t.from_date)}–${dateLabel(t.to_date)}`} ·{" "}
                {t.status === "pending" ? "waiting" : t.status}
              </Chip>
            ))}
          </div>
        ) : null}
      </section>

      <div className="row" style={{ justifyContent: "center", marginTop: 22 }}>
        <button
          className="btn btn-quiet btn-sm"
          onClick={async () => {
            await fetch("/api/team/session", { method: "DELETE" });
            window.location.href = "/team";
          }}
        >
          Sign out
        </button>
      </div>
    </>
  );
}

function SkipCard({
  busy,
  onCancel,
  onSave,
}: {
  busy: boolean;
  onCancel: () => void;
  onSave: (reason: string, note: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [other, setOther] = useState("");
  const [note, setNote] = useState("");
  const finalReason = reason === "Other" ? other.trim() : reason;

  return (
    <div className="card card-tight" style={{ background: "var(--paper)", margin: "0 0 12px" }}>
      {/* A blank box tells the house nothing. This is the whole reason the
          kiosk exists rather than a checklist on the fridge. */}
      <p className="label">What got in the way? Whoever reads this can actually fix it.</p>
      <div className="row" style={{ gap: 6 }}>
        {SKIP_REASONS.map((r) => (
          <button key={r} className="person-pill" aria-pressed={reason === r} onClick={() => setReason(r)} style={{ fontSize: 13, padding: "8px 12px" }}>
            {r}
          </button>
        ))}
      </div>
      {reason === "Other" ? (
        <input className="field" style={{ marginTop: 10 }} placeholder="In your own words" value={other} onChange={(e) => setOther(e.target.value)} />
      ) : null}
      <input className="field" style={{ marginTop: 10 }} placeholder="Anything else (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn btn-primary" disabled={busy || !finalReason} onClick={() => onSave(finalReason, note)}>
          Save
        </button>
        <button className="btn btn-quiet" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function TimeOffForm({
  today,
  busy,
  onSave,
}: {
  today: string;
  busy: boolean;
  onSave: (body: unknown) => void;
}) {
  const [from, setFrom] = useState(today);
  const [to, setTo] = useState(today);
  const [note, setNote] = useState("");

  return (
    <div className="stack" style={{ marginTop: 12 }}>
      <div className="row" style={{ gap: 8 }}>
        <input className="field" style={{ maxWidth: 165 }} type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
        <input className="field" style={{ maxWidth: 165 }} type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <input className="field" placeholder="Why (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <button
        className="btn btn-primary"
        style={{ justifySelf: "start" }}
        disabled={busy}
        onClick={() => onSave({ from_date: from, to_date: to, note })}
      >
        Send the request
      </button>
    </div>
  );
}
