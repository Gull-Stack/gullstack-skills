// Who is allowed to make this write?
//
// Every route calls one of these rather than trusting the path it lives under.
// The reason is a specific failure: on the app this is modeled on, the kiosk's
// routes were opened at the proxy by PATH, one path was missed, and a week of
// staff check-offs died with a 401 that the kiosk displayed as "that didn't
// save". Gate by COOKIE in the route, always fail closed.

import { currentUser, isOwner } from "./auth.ts";
import { teamUser } from "./team-auth.ts";

export type Who = { name: string; side: "family" | "team"; owner: boolean };

/** Anybody signed in at either door. Used for ticking a box. */
export async function anySignedIn(): Promise<Who | null> {
  const family = await currentUser();
  if (family) return { name: family, side: "family", owner: await isOwner() };
  const team = await teamUser();
  if (team) return { name: team, side: "team", owner: false };
  return null;
}

/** The family side only — the schedule, the roster, the routines. */
export async function familyOnly(): Promise<Who | null> {
  const family = await currentUser();
  if (!family) return null;
  return { name: family, side: "family", owner: await isOwner() };
}

/** Owners only — pay rates, bills, anything with a dollar sign on it. */
export async function ownerOnly(): Promise<Who | null> {
  const who = await familyOnly();
  return who?.owner ? who : null;
}

export function unauthorized(message = "You're not signed in.") {
  return Response.json({ ok: false, message }, { status: 401 });
}

export function forbidden(message = "That's owner-only.") {
  return Response.json({ ok: false, message }, { status: 403 });
}

export function badRequest(message: string) {
  return Response.json({ ok: false, message }, { status: 400 });
}

/** A storage failure is reported with its real reason, never as a success. */
export function fromDb(result: { ok: boolean; error?: string }) {
  if (result.ok) return Response.json({ ok: true });
  return Response.json({ ok: false, message: result.error || "That didn't save." }, { status: 502 });
}
