"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { act } from "../../act";
import { Chip, Empty, Meter, Notice, PersonChip, SectionHead } from "../../ui";
import { IconCheck } from "../../icons";
import { dateLabel, dowName } from "@/lib/day";
import {
  AREAS,
  CADENCES,
  cadenceLabel,
  historyFor,
  SKIP_REASONS,
  tally,
  tallyLine,
  type Cadence,
  type DayStatus,
  type Task,
  type TaskLog,
} from "@/lib/tasks";
import type { Tone } from "@/lib/people";

export function TaskManager({
  today,
  tasks,
  log,
  board,
  people,
  tones,
}: {
  today: string;
  tasks: Task[];
  log: TaskLog[];
  board: DayStatus[];
  people: string[];
  tones: Record<string, Tone>;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [skipping, setSkipping] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);

  async function run(url: string, body: unknown, method: "POST" | "PUT" = "POST") {
    setBusy(true);
    setError(null);
    const r = await act(url, body, method as "POST");
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return false;
    }
    router.refresh();
    return true;
  }

  const counts = tally(board);

  return (
    <>
      {error ? <Notice tone="red">{error}</Notice> : null}

      {/* ── Today ───────────────────────────────────────────────────────── */}
      <section className="card">
        <SectionHead title={`Due today — ${dateLabel(today)}`} sub={tallyLine(counts)} />
        {board.length === 0 ? (
          <Empty>Nothing is due today.</Empty>
        ) : (
          <>
            <Meter done={counts.done} total={counts.total} />
            <div className="list" style={{ marginTop: 12 }}>
              {board.map(({ task, log: entry, state }) => (
                <div key={task.id}>
                  <div className="item">
                    <button
                      className="tick"
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
                      <div className="item-meta">
                        {[task.area, cadenceLabel(task)].filter(Boolean).join(" · ")}
                      </div>
                      {state === "skipped" && entry ? (
                        <div className="item-meta" style={{ color: "var(--chip-amber-fg)" }}>
                          Left undone: “{entry.reason}” — {entry.person}
                        </div>
                      ) : null}
                      {entry?.note ? <div className="item-meta">Note: “{entry.note}”</div> : null}
                    </div>
                    <div className="row-tight">
                      {task.assigned_to ? <PersonChip name={task.assigned_to} tone={tones[task.assigned_to]} /> : null}
                      {state === "open" ? (
                        <button className="btn btn-quiet btn-sm" onClick={() => setSkipping(skipping === task.id ? null : task.id)}>
                          Couldn&rsquo;t do it
                        </button>
                      ) : null}
                    </div>
                  </div>

                  {skipping === task.id ? (
                    <SkipForm
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

      {/* ── The master list ─────────────────────────────────────────────── */}
      <section className="card">
        <SectionHead
          title="Everything on the list"
          sub="How often each one comes around, and the last ninety days of it."
          right={
            <button className="btn btn-sm btn-primary" onClick={() => setAdding((a) => !a)}>
              {adding ? "Close" : "Add a task"}
            </button>
          }
        />

        {adding ? (
          <div className="card card-tight" style={{ background: "var(--paper)", marginBottom: 14 }}>
            <TaskForm
              people={people}
              today={today}
              busy={busy}
              onSave={async (task) => {
                const ok = await run("/api/tasks", task, "PUT");
                if (ok) setAdding(false);
              }}
            />
          </div>
        ) : null}

        {tasks.length === 0 ? (
          <Empty>
            No tasks yet. Start with the handful that actually matter every day — the list is easier to grow
            than to prune.
          </Empty>
        ) : (
          <div className="list">
            {tasks.map((task) => {
              const history = historyFor(log, task.id);
              return (
                <div key={task.id} className="item" style={{ display: "block" }}>
                  <div className="spread">
                    <div>
                      <div className="item-title" style={{ opacity: task.active ? 1 : 0.55 }}>
                        {task.title} {task.active ? null : <Chip>paused</Chip>}
                      </div>
                      <div className="item-meta">
                        {[task.area, cadenceLabel(task), task.assigned_to ? `usually ${task.assigned_to}` : null]
                          .filter(Boolean)
                          .join(" · ")}
                      </div>
                      {task.detail ? <div className="item-meta">{task.detail}</div> : null}
                      {task.video_url ? (
                        <div className="item-meta">
                          <a href={task.video_url} target="_blank" rel="noreferrer">
                            How it&rsquo;s done →
                          </a>
                        </div>
                      ) : null}
                    </div>
                    <button
                      className="btn btn-quiet btn-sm"
                      disabled={busy}
                      onClick={() => run("/api/tasks", { id: task.id, active: !task.active }, "PUT")}
                    >
                      {task.active ? "Pause" : "Bring back"}
                    </button>
                  </div>

                  {history.length ? (
                    <details style={{ marginTop: 8 }}>
                      <summary className="quiet" style={{ cursor: "pointer" }}>
                        {history.length} in the last 90 days
                      </summary>
                      <div className="stack" style={{ gap: 4, marginTop: 8 }}>
                        {history.slice(0, 20).map((h) => (
                          <div key={`${h.task_id}-${h.for_date}`} className="quiet">
                            {dateLabel(h.for_date)} · {h.person} ·{" "}
                            {h.state === "done" ? "done" : `left undone — “${h.reason}”`}
                          </div>
                        ))}
                      </div>
                    </details>
                  ) : null}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}

/**
 * The skip form.
 *
 * Save stays disabled until there is a reason. The server refuses it too — this
 * is the polite half of the same rule, not the enforcement.
 */
function SkipForm({
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
    <div className="card card-tight" style={{ background: "var(--paper)", marginBottom: 12 }}>
      <p className="label">Why didn&rsquo;t it happen? This is the part the house actually needs.</p>
      <div className="row" style={{ gap: 6 }}>
        {SKIP_REASONS.map((r) => (
          <button key={r} className="person-pill" aria-pressed={reason === r} onClick={() => setReason(r)} style={{ fontSize: 13, padding: "7px 12px" }}>
            {r}
          </button>
        ))}
      </div>
      {reason === "Other" ? (
        <input className="field" style={{ marginTop: 10 }} placeholder="In your own words" value={other} onChange={(e) => setOther(e.target.value)} />
      ) : null}
      <input className="field" style={{ marginTop: 10 }} placeholder="Anything else (optional)" value={note} onChange={(e) => setNote(e.target.value)} />
      <div className="row" style={{ marginTop: 10 }}>
        <button className="btn btn-primary btn-sm" disabled={busy || !finalReason} onClick={() => onSave(finalReason, note)}>
          Save
        </button>
        <button className="btn btn-quiet btn-sm" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

function TaskForm({
  people,
  today,
  busy,
  onSave,
}: {
  people: string[];
  today: string;
  busy: boolean;
  onSave: (task: Record<string, unknown>) => void;
}) {
  const [title, setTitle] = useState("");
  const [area, setArea] = useState("");
  const [cadence, setCadence] = useState<Cadence>("daily");
  const [dow, setDow] = useState(1);
  const [dom, setDom] = useState(1);
  const [onceDate, setOnceDate] = useState(today);
  const [assigned, setAssigned] = useState("");
  const [detail, setDetail] = useState("");
  const [video, setVideo] = useState("");

  return (
    <div className="stack">
      <div>
        <label className="label" htmlFor="t-title">
          What needs doing
        </label>
        <input id="t-title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Reset the kitchen" />
      </div>

      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: "1 1 160px" }}>
          <label className="label" htmlFor="t-area">
            Where
          </label>
          <select id="t-area" className="field" value={area} onChange={(e) => setArea(e.target.value)}>
            <option value="">—</option>
            {AREAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "1 1 160px" }}>
          <label className="label" htmlFor="t-cad">
            How often
          </label>
          <select id="t-cad" className="field" value={cadence} onChange={(e) => setCadence(e.target.value as Cadence)}>
            {CADENCES.map((c) => (
              <option key={c.key} value={c.key}>
                {c.label}
              </option>
            ))}
          </select>
        </div>
        {cadence === "weekly" ? (
          <div style={{ flex: "1 1 140px" }}>
            <label className="label" htmlFor="t-dow">
              Which day
            </label>
            <select id="t-dow" className="field" value={dow} onChange={(e) => setDow(Number(e.target.value))}>
              {[1, 2, 3, 4, 5, 6, 0].map((d) => (
                <option key={d} value={d}>
                  {dowName(d)}
                </option>
              ))}
            </select>
          </div>
        ) : null}
        {cadence === "monthly" || cadence === "quarterly" || cadence === "yearly" ? (
          <div style={{ flex: "1 1 120px" }}>
            <label className="label" htmlFor="t-dom">
              Day of month
            </label>
            <input id="t-dom" className="field" type="number" min={1} max={31} value={dom} onChange={(e) => setDom(Number(e.target.value))} />
          </div>
        ) : null}
        {cadence === "once" ? (
          <div style={{ flex: "1 1 170px" }}>
            <label className="label" htmlFor="t-once">
              On this day
            </label>
            <input id="t-once" className="field" type="date" value={onceDate} onChange={(e) => setOnceDate(e.target.value)} />
          </div>
        ) : null}
      </div>

      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: "1 1 160px" }}>
          <label className="label" htmlFor="t-who">
            Usually whose job
          </label>
          <select id="t-who" className="field" value={assigned} onChange={(e) => setAssigned(e.target.value)}>
            <option value="">whoever is working</option>
            {people.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </div>
        <div style={{ flex: "2 1 240px" }}>
          <label className="label" htmlFor="t-video">
            Link to a how-to clip
          </label>
          {/* The clip lives NEXT TO the task, not in a folder tree nobody
              opens. A shared-link paste, deliberately not an upload. */}
          <input id="t-video" className="field" placeholder="https://…" value={video} onChange={(e) => setVideo(e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label" htmlFor="t-detail">
          How you like it done
        </label>
        <textarea id="t-detail" className="field" rows={2} value={detail} onChange={(e) => setDetail(e.target.value)} />
      </div>

      <button
        className="btn btn-primary"
        style={{ justifySelf: "start" }}
        disabled={busy || !title.trim()}
        onClick={() =>
          onSave({
            title,
            area,
            cadence,
            day_of_week: dow,
            day_of_month: dom,
            once_date: onceDate,
            assigned_to: assigned,
            detail,
            video_url: video,
          })
        }
      >
        Add it
      </button>
    </div>
  );
}
