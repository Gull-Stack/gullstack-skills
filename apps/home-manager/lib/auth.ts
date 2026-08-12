// The family door — the cookie half.
//
// Two rules, both learned the hard way on the app this one is modeled on:
//
// 1. **No shared code, ever.** One code that opens the app for "whoever knows
//    it" cannot tell you who checked a box, and the moment it is also the code
//    for something else, both doors open at once.
// 2. **An unset variable must never mean open.** If nobody has a code
//    configured, nobody signs in — and the login screen says exactly that
//    rather than quietly admitting everyone.
//
// The rules themselves live in door.ts so they can be unit-tested; this file
// only adds cookies, which need a Next runtime.

import { cookies } from "next/headers";
import { getPeople } from "./people.ts";
import { checkPin, familyDoor, isOwnerName } from "./door.ts";

export {
  anyCodeConfigured,
  bootstrapOwner,
  checkPin,
  envPinFor,
  familyDoor,
  pinEnvKey,
} from "./door.ts";

const COOKIE = "hm_auth";

/** Cookie marker. Rotating HM_SECRET signs everybody out. */
export function marker(): string {
  return process.env.HM_SECRET || "home-manager-dev-marker";
}

export async function doorNames(): Promise<string[]> {
  return familyDoor(await getPeople());
}

export async function signInOk(name: string, pin: string): Promise<boolean> {
  return checkPin(name, pin, await getPeople());
}

/** Who is signed in at the family door, or null. */
export async function currentUser(): Promise<string | null> {
  const jar = await cookies();
  const raw = jar.get(COOKIE)?.value || "";
  const [who, mark] = raw.split("|");
  if (!who || mark !== marker()) return null;
  return who;
}

export async function isOwner(): Promise<boolean> {
  const who = await currentUser();
  if (!who) return false;
  return isOwnerName(who, await getPeople());
}

export const AUTH_COOKIE = COOKIE;
