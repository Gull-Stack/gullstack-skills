// Everyone the home has: the adults who run it, the people who work in it, and
// the kids it is for. One table, one `role` column, because a nanny who is also
// on the schedule and also logs a child's reading is one person, not three rows
// in three systems.
//
// ⛔ No seeded names. An invented "Melinda" in a fresh install is worse than an
// empty roster: it looks like data, it shows on a calendar, and somebody has to
// work out whether it is real before they can trust anything next to it.

import { sbSelect, sbWrite, upsert } from "./supabase.ts";

export type Role = "owner" | "adult" | "staff" | "child";

export type Person = {
  id?: string;
  name: string;
  role: Role;
  /** Job title for staff ("Nanny", "Housekeeper"), free text. */
  title: string | null;
  /** Personal sign-in code. Staff use it at /team; owners use HM_PIN_<NAME>. */
  pin: string | null;
  color: string | null;
  sort_order: number;
  active: boolean;
  /** Cents per hour for hourly staff; cents per pay period for salary. */
  pay_rate_cents: number | null;
  pay_kind: "hourly" | "salary" | "none";
  /** YYYY-MM-DD. Only ever what somebody typed — never inferred. */
  birthday: string | null;
  note: string | null;
};

export const ROLES: { key: Role; label: string; blurb: string }[] = [
  { key: "owner", label: "Owner", blurb: "Runs the home. Sees and edits everything." },
  { key: "adult", label: "Adult", blurb: "Family adult. Sees the home, not the pay rates." },
  { key: "staff", label: "Staff", blurb: "Nanny, housekeeper, sitter. Signs in at the team door." },
  { key: "child", label: "Child", blurb: "Has a daily routine and a progress record." },
];

/**
 * Identity hues for people.
 *
 * ⛔ No green, no amber, no red, no link-blue. Those four already mean done /
 * left undone / overdue / tappable everywhere else in this app. A person
 * wearing one of them makes the colour stop carrying its meaning — the exact
 * mistake the Salisbury build had to undo when its first helper was painted the
 * same royal blue as every link on the page.
 */
export const PERSON_PALETTE = [
  "#7c3aed", // violet
  "#be185d", // magenta
  "#0891b2", // cyan
  "#a21caf", // fuchsia
  "#7c2d12", // umber
  "#4d7c0f", // olive
  "#0f766e", // teal
  "#9333ea", // purple
];

export type Tone = { chip: string; bg: string; ink: string };

/** A person's colour as a chip hue plus the soft plate it sits on. */
export function toneFor(person: Pick<Person, "color">, index = 0): Tone {
  const chip = person.color || PERSON_PALETTE[index % PERSON_PALETTE.length];
  const hex = chip.replace("#", "");
  if (hex.length !== 6) return { chip: "var(--muted)", bg: "var(--panel-2)", ink: "var(--ink-soft)" };
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  // Chips invert on a dark ground: a dark tinted plate carrying a LIGHT hue.
  return { chip, bg: `rgba(${r},${g},${b},0.18)`, ink: chip };
}

export function toneMap(people: Person[]): Record<string, Tone> {
  const out: Record<string, Tone> = {};
  people.forEach((p, i) => {
    out[p.name] = toneFor(p, i);
  });
  return out;
}

export function byRole(people: Person[], role: Role): Person[] {
  return people.filter((p) => p.active && p.role === role);
}

export function staffNames(people: Person[]): string[] {
  return byRole(people, "staff").map((p) => p.name);
}

export function childNames(people: Person[]): string[] {
  return byRole(people, "child").map((p) => p.name);
}

/** Everyone who can be handed a task or a shift. */
export function workerNames(people: Person[]): string[] {
  return people.filter((p) => p.active && (p.role === "staff" || p.role === "adult" || p.role === "owner")).map((p) => p.name);
}

export function findPerson(people: Person[], name: string): Person | undefined {
  return people.find((p) => p.name.toLowerCase() === name.trim().toLowerCase());
}

/** Validate a person before it reaches the database. */
export function validatePerson(input: Partial<Person>): { ok: true; person: Omit<Person, "id"> } | { ok: false; error: string } {
  const name = (input.name || "").trim();
  if (!name) return { ok: false, error: "A name is required." };
  if (name.length > 60) return { ok: false, error: "That name is too long (60 characters max)." };
  const role = input.role;
  if (!role || !ROLES.some((r) => r.key === role)) return { ok: false, error: "Pick a role." };

  const pin = (input.pin || "").trim();
  if (pin && !/^\d{4,8}$/.test(pin)) {
    return { ok: false, error: "A code must be 4 to 8 digits." };
  }
  const rate = input.pay_rate_cents;
  if (rate != null && (!Number.isFinite(rate) || rate < 0 || rate > 100_000_000)) {
    return { ok: false, error: "That pay rate doesn't look right." };
  }
  const birthday = (input.birthday || "").trim();
  if (birthday && !/^\d{4}-\d{2}-\d{2}$/.test(birthday)) {
    return { ok: false, error: "A birthday needs to be a real date." };
  }

  return {
    ok: true,
    person: {
      name,
      role,
      title: (input.title || "").trim() || null,
      pin: pin || null,
      color: (input.color || "").trim() || null,
      sort_order: Number.isFinite(input.sort_order) ? Number(input.sort_order) : 100,
      active: input.active ?? true,
      pay_rate_cents: rate ?? null,
      pay_kind: input.pay_kind || "none",
      birthday: birthday || null,
      note: (input.note || "").trim() || null,
    },
  };
}

// ---------------------------------------------------------------------------
// Data access
// ---------------------------------------------------------------------------

export async function getPeople(opts?: { includeInactive?: boolean }): Promise<Person[]> {
  const q = opts?.includeInactive
    ? "select=*&order=sort_order.asc,name.asc"
    : "select=*&active=eq.true&order=sort_order.asc,name.asc";
  return sbSelect<Person>(`hm_people?${q}`);
}

export async function savePerson(person: Omit<Person, "id">) {
  return upsert("hm_people", "name", person);
}

export async function setPersonActive(name: string, active: boolean) {
  return sbWrite(`hm_people?name=eq.${encodeURIComponent(name)}`, "PATCH", { active });
}
