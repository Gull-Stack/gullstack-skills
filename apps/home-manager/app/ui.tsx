// The small shared pieces. Server-safe (no hooks, no state) so any page can use
// them without pulling a client boundary along.

import type { CSSProperties, ReactNode } from "react";

export function SectionHead({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="spread" style={{ alignItems: "flex-end", marginBottom: 14 }}>
      <div>
        <h2 className="display" style={{ fontSize: 21 }}>
          {title}
        </h2>
        {sub ? <p className="sub">{sub}</p> : null}
      </div>
      {right}
    </div>
  );
}

export function Chip({
  children,
  tone = "gray",
  style,
}: {
  children: ReactNode;
  tone?: "gray" | "green" | "amber" | "blue" | "red";
  style?: CSSProperties;
}) {
  return (
    <span className={`chip chip-${tone}`} style={style}>
      {children}
    </span>
  );
}

/** A person's name wearing their own colour. */
export function PersonChip({ name, tone }: { name: string; tone?: { chip: string; bg: string; ink: string } }) {
  if (!tone) return <span className="chip">{name}</span>;
  return (
    <span className="chip" style={{ background: tone.bg, color: tone.ink }}>
      <span className="dot" style={{ background: tone.chip }} />
      {name}
    </span>
  );
}

/**
 * A number on the page.
 *
 * A tile earns its place only when the number is real, somebody would act
 * differently because of it, and the list underneath would not say it better.
 * `sub` is where the honesty goes — "3 without an amount" belongs next to the
 * total, not hidden behind it.
 */
export function Stat({ value, label, sub, tone }: { value: ReactNode; label: string; sub?: string; tone?: string }) {
  return (
    <div className="stat">
      <div className="stat-num" style={tone ? { color: tone } : undefined}>
        {value}
      </div>
      <div className="stat-label">{label}</div>
      {sub ? (
        <div className="quiet" style={{ fontSize: 12 }}>
          {sub}
        </div>
      ) : null}
    </div>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="empty">{children}</div>;
}

export function Notice({
  children,
  tone = "plain",
}: {
  children: ReactNode;
  tone?: "plain" | "amber" | "red" | "green";
}) {
  return <div className={tone === "plain" ? "notice" : `notice notice-${tone}`}>{children}</div>;
}

/**
 * The one banner every page shows when there is no database behind the app.
 *
 * It is a notice and not an empty list on purpose: an empty list says "nothing
 * has happened yet", which is a different and much worse lie than "this isn't
 * connected".
 */
export function NoDatabase() {
  return (
    <Notice tone="amber">
      <strong>No database is connected yet.</strong> Nothing on this page is real and nothing you type will
      save. Set <code>SUPABASE_URL</code> and <code>SUPABASE_SERVICE_ROLE_KEY</code>, then run{" "}
      <code>scripts/schema.sql</code> once. The README has the whole list.
    </Notice>
  );
}

export function Meter({ done, total }: { done: number; total: number }) {
  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
  return (
    <div className="meter" role="img" aria-label={`${done} of ${total} done`}>
      <span style={{ width: `${pct}%` }} />
    </div>
  );
}
