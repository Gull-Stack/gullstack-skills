"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { act } from "../../act";
import { Chip, Empty, Notice, PersonChip, SectionHead } from "../../ui";
import { dateLabel } from "@/lib/day";
import { PERSON_PALETTE, ROLES, type Person, type Role, type Tone } from "@/lib/people";
import { money, parseMoney } from "@/lib/pay";

export function Roster({
  people,
  tones,
  isOwner,
}: {
  people: Person[];
  tones: Record<string, Tone>;
  isOwner: boolean;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState<string | null>(null);

  async function run(body: unknown) {
    setBusy(true);
    setError(null);
    const r = await act("/api/people", body);
    setBusy(false);
    if (!r.ok) {
      setError(r.message);
      return false;
    }
    router.refresh();
    return true;
  }

  return (
    <>
      {error ? <Notice tone="red">{error}</Notice> : null}

      {ROLES.map((role) => {
        const group = people.filter((p) => p.role === role.key);
        if (!group.length) return null;
        return (
          <section key={role.key} className="card">
            <SectionHead title={`${role.label}s`} sub={role.blurb} />
            <div className="list">
              {group.map((person) => (
                <div key={person.name}>
                  <div className="item">
                    <div style={{ flex: 1 }}>
                      <div className="row-tight">
                        <PersonChip name={person.name} tone={tones[person.name]} />
                        {person.active ? null : <Chip>not here any more</Chip>}
                        {person.pin ? <Chip tone="blue">has a code</Chip> : null}
                      </div>
                      <div className="item-meta">
                        {[
                          person.title,
                          person.birthday ? `born ${dateLabel(person.birthday, { year: true })}` : null,
                          isOwner && person.pay_kind !== "none" && person.pay_rate_cents != null
                            ? person.pay_kind === "hourly"
                              ? `${money(person.pay_rate_cents)}/hr`
                              : `${money(person.pay_rate_cents)} per period`
                            : null,
                          isOwner && person.role === "staff" && person.pay_kind === "none"
                            ? "no pay set up"
                            : null,
                        ]
                          .filter(Boolean)
                          .join(" · ") || "—"}
                      </div>
                      {person.note ? <div className="item-meta">{person.note}</div> : null}
                    </div>
                    <div className="row-tight">
                      <button className="btn btn-quiet btn-sm" onClick={() => setEditing(editing === person.name ? null : person.name)}>
                        {editing === person.name ? "Close" : "Edit"}
                      </button>
                      <button
                        className="btn btn-quiet btn-sm"
                        disabled={busy}
                        onClick={() => run({ name: person.name, active: !person.active })}
                      >
                        {person.active ? "Remove" : "Bring back"}
                      </button>
                    </div>
                  </div>

                  {editing === person.name ? (
                    <div className="card card-tight" style={{ background: "var(--paper)", marginBottom: 12 }}>
                      <PersonForm
                        person={person}
                        isOwner={isOwner}
                        busy={busy}
                        onSave={async (p) => {
                          const ok = await run(p);
                          if (ok) setEditing(null);
                        }}
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </section>
        );
      })}

      <section className="card">
        <SectionHead
          title="Add somebody"
          right={
            <button className="btn btn-sm btn-primary" onClick={() => setAdding((a) => !a)}>
              {adding ? "Close" : "Add"}
            </button>
          }
        />
        {adding ? (
          <PersonForm
            isOwner={isOwner}
            busy={busy}
            onSave={async (p) => {
              const ok = await run(p);
              if (ok) setAdding(false);
            }}
          />
        ) : people.length === 0 ? (
          <Empty>Nobody here yet. Start with yourself, then the kids, then whoever works here.</Empty>
        ) : null}
      </section>
    </>
  );
}

function PersonForm({
  person,
  isOwner,
  busy,
  onSave,
}: {
  person?: Person;
  isOwner: boolean;
  busy: boolean;
  onSave: (person: Record<string, unknown>) => void;
}) {
  const [name, setName] = useState(person?.name ?? "");
  const [role, setRole] = useState<Role>(person?.role ?? "staff");
  const [title, setTitle] = useState(person?.title ?? "");
  const [pin, setPin] = useState(person?.pin ?? "");
  const [color, setColor] = useState(person?.color ?? PERSON_PALETTE[0]);
  const [birthday, setBirthday] = useState(person?.birthday ?? "");
  const [payKind, setPayKind] = useState(person?.pay_kind ?? "none");
  const [rate, setRate] = useState(person?.pay_rate_cents == null ? "" : (person.pay_rate_cents / 100).toFixed(2));
  const [note, setNote] = useState(person?.note ?? "");

  const parsedRate = rate.trim() === "" ? null : parseMoney(rate);
  const badRate = rate.trim() !== "" && parsedRate == null;
  const badPin = pin.trim() !== "" && !/^\d{4,8}$/.test(pin.trim());

  return (
    <div className="stack">
      <div className="row" style={{ gap: 10 }}>
        <div style={{ flex: "2 1 200px" }}>
          <label className="label" htmlFor="p-name">
            Name
          </label>
          {/* The name is the key everything else joins on, so an edit renames
              nothing — it would orphan every shift and tick already filed
              under the old spelling. */}
          <input id="p-name" className="field" value={name} onChange={(e) => setName(e.target.value)} disabled={Boolean(person)} />
          {person ? <span className="quiet">A name can&rsquo;t change — everything already recorded is filed under it.</span> : null}
        </div>
        <div style={{ flex: "1 1 150px" }}>
          <label className="label" htmlFor="p-role">
            Role
          </label>
          <select id="p-role" className="field" value={role} onChange={(e) => setRole(e.target.value as Role)}>
            {ROLES.map((r) => (
              <option key={r.key} value={r.key}>
                {r.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="row" style={{ gap: 10 }}>
        {role === "staff" ? (
          <div style={{ flex: "1 1 180px" }}>
            <label className="label" htmlFor="p-title">
              What they do
            </label>
            <input id="p-title" className="field" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Nanny" />
          </div>
        ) : null}
        {role === "child" ? (
          <div style={{ flex: "1 1 170px" }}>
            <label className="label" htmlFor="p-bday">
              Birthday (optional)
            </label>
            <input id="p-bday" className="field" type="date" value={birthday} onChange={(e) => setBirthday(e.target.value)} />
          </div>
        ) : (
          <div style={{ flex: "1 1 150px" }}>
            <label className="label" htmlFor="p-pin">
              Their code
            </label>
            <input
              id="p-pin"
              className="field mono"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="4–8 digits"
            />
          </div>
        )}
      </div>

      {role !== "child" ? (
        <div>
          <span className="label">Their colour</span>
          <div className="row" style={{ gap: 6 }}>
            {PERSON_PALETTE.map((hue) => (
              <button
                key={hue}
                aria-label={`Use ${hue}`}
                aria-pressed={color === hue}
                onClick={() => setColor(hue)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 999,
                  background: hue,
                  border: color === hue ? "2px solid var(--ink)" : "1px solid var(--line)",
                  cursor: "pointer",
                }}
              />
            ))}
          </div>
        </div>
      ) : null}

      {isOwner && role === "staff" ? (
        <div className="row" style={{ gap: 10 }}>
          <div style={{ flex: "1 1 160px" }}>
            <label className="label" htmlFor="p-paykind">
              How they&rsquo;re paid
            </label>
            <select id="p-paykind" className="field" value={payKind} onChange={(e) => setPayKind(e.target.value as Person["pay_kind"])}>
              <option value="none">Not set up yet</option>
              <option value="hourly">By the hour</option>
              <option value="salary">A set amount each period</option>
            </select>
          </div>
          {payKind !== "none" ? (
            <div style={{ flex: "1 1 140px" }}>
              <label className="label" htmlFor="p-rate">
                {payKind === "hourly" ? "Per hour" : "Per pay period"}
              </label>
              <input id="p-rate" className="field mono" value={rate} onChange={(e) => setRate(e.target.value)} placeholder="25.00" />
            </div>
          ) : null}
        </div>
      ) : null}

      <div>
        <label className="label" htmlFor="p-note">
          Anything worth remembering
        </label>
        <input id="p-note" className="field" value={note} onChange={(e) => setNote(e.target.value)} />
      </div>

      {badRate ? <Notice tone="red">That rate doesn&rsquo;t read as money.</Notice> : null}
      {badPin ? <Notice tone="red">A code has to be 4 to 8 digits.</Notice> : null}

      <button
        className="btn btn-primary"
        style={{ justifySelf: "start" }}
        disabled={busy || !name.trim() || badRate || badPin}
        onClick={() =>
          onSave({
            name,
            role,
            title,
            pin,
            color: role === "child" ? null : color,
            birthday,
            pay_kind: role === "staff" ? payKind : "none",
            pay_rate_cents: role === "staff" && payKind !== "none" ? parsedRate : null,
            note,
            sort_order: person?.sort_order ?? 100,
            active: person?.active ?? true,
          })
        }
      >
        {person ? "Save" : "Add them"}
      </button>
    </div>
  );
}
