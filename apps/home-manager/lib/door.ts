// Who may open which door — the pure half.
//
// This file is deliberately import-free at runtime (types only), so every rule
// below is unit-tested directly with `node --test`. The cookie-reading halves
// live in auth.ts and team-auth.ts, which import `next/headers` and therefore
// cannot be loaded outside a Next runtime. Splitting them is not tidiness: the
// rules that decide whether an unset variable means "open" are exactly the ones
// that must be provable, and a rule you cannot run in a test is a rule you are
// taking on trust.

import type { Person } from "./people.ts";

/** Env var holding a person's family code: "Anna Lee" → HM_PIN_ANNA_LEE. */
export function pinEnvKey(name: string): string {
  return `HM_PIN_${name.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
}

/** Env var holding a staff member's team code: "Anna" → HM_TEAM_PIN_ANNA. */
export function teamPinEnvKey(name: string): string {
  return `HM_TEAM_PIN_${name.toUpperCase().replace(/[^A-Z0-9]/g, "_")}`;
}

function envValue(key: string): string | undefined {
  const v = process.env[key];
  return v && v.trim() ? v.trim() : undefined;
}

export function envPinFor(name: string): string | undefined {
  return envValue(pinEnvKey(name));
}

export function teamEnvPinFor(name: string): string | undefined {
  return envValue(teamPinEnvKey(name));
}

/** The bootstrap owner, if one is named. Lets the door exist before the DB does. */
export function bootstrapOwner(): string | null {
  const v = (process.env.HM_OWNER || "").trim();
  return v || null;
}

/**
 * Who may sign in at the family door, in roster order.
 *
 * Children are excluded on purpose — a child's progress is recorded ABOUT them,
 * not BY them, and the family door is also the door to pay rates and bills.
 * Staff have their own door.
 */
export function familyDoor(people: Person[]): string[] {
  const names = people
    .filter((p) => p.active && (p.role === "owner" || p.role === "adult"))
    .map((p) => p.name);
  const boot = bootstrapOwner();
  if (boot && !names.some((n) => n.toLowerCase() === boot.toLowerCase())) names.unshift(boot);
  return names;
}

export function teamDoor(people: Person[]): string[] {
  return people.filter((p) => p.active && p.role === "staff").map((p) => p.name);
}

/** Does anybody actually have a code set? Drives the honest empty door. */
export function anyCodeConfigured(names: string[], people: Person[]): boolean {
  return names.some((n) => {
    if (envPinFor(n)) return true;
    return Boolean(people.find((p) => p.name === n)?.pin);
  });
}

export function anyTeamCodeConfigured(people: Person[]): boolean {
  return teamDoor(people).some((n) => teamEnvPinFor(n) || people.find((p) => p.name === n)?.pin);
}

/**
 * Check a family code.
 *
 * Env wins over the table so a code can be rotated without a database write,
 * and a person with neither is fail-closed. ⛔ There is no shared code and no
 * master code anywhere in this function — if you find yourself adding one,
 * read the comment at the top of team-auth.ts first.
 */
export function checkPin(name: string, pin: string, people: Person[]): boolean {
  if (!pin) return false;
  if (!familyDoor(people).includes(name)) return false;
  const env = envPinFor(name);
  if (env) return pin === env;
  const row = people.find((p) => p.name === name);
  return Boolean(row?.pin) && pin === row!.pin;
}

/** Check a team code. Staff only; the family door is not this door. */
export function checkTeamPin(name: string, pin: string, people: Person[]): boolean {
  if (!pin) return false;
  const person = people.find((p) => p.name === name && p.active && p.role === "staff");
  if (!person) return false;
  const env = teamEnvPinFor(name);
  if (env) return pin === env;
  return Boolean(person.pin) && pin === person.pin;
}

/** Owners see money. Adults see the home. */
export function isOwnerName(name: string, people: Person[]): boolean {
  const boot = bootstrapOwner();
  if (boot && name.toLowerCase() === boot.toLowerCase()) return true;
  return people.some((p) => p.name === name && p.role === "owner");
}
