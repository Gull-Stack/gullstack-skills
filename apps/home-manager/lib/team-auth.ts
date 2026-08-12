// The team door — /team, the phone in the nanny's pocket.
//
// Deliberately NOT the family sign-in. Staff need today's list, the clock, and
// the kids' routine; they do not need pay rates, bills, or the bank page. Two
// cookies, two doors, and the staff cookie never opens the family side.
//
// ⛔ No master code and no shared code. On the app this one is modeled on, a
// shared household master PIN turned out to also be the access code on an
// unrelated site — so the housekeepers' code opened a private page nobody
// intended. Personal codes only. A staff member with no code set cannot sign
// in, and the door says so instead of falling back to something that works.
//
// The rules live in door.ts (import-free, unit-tested); this file adds cookies.

import { cookies } from "next/headers";
import { getPeople } from "./people.ts";
import { checkTeamPin, teamDoor } from "./door.ts";

export { anyTeamCodeConfigured, checkTeamPin, teamDoor, teamEnvPinFor, teamPinEnvKey } from "./door.ts";

const COOKIE = "hm_team";

export function teamMarker(): string {
  return process.env.HM_TEAM_SECRET || "home-manager-team-dev-marker";
}

export async function teamDoorNames(): Promise<string[]> {
  return teamDoor(await getPeople());
}

export async function teamSignInOk(name: string, pin: string): Promise<boolean> {
  return checkTeamPin(name, pin, await getPeople());
}

/** Who is signed in at the team door, or null. */
export async function teamUser(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value || "";
  const [who, mark] = raw.split("|");
  if (!who || mark !== teamMarker()) return null;
  return who;
}

export const TEAM_COOKIE = COOKIE;
