import { NextResponse } from "next/server";
import { TEAM_COOKIE, teamMarker, teamSignInOk } from "@/lib/team-auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { who?: string; pin?: string };
  const who = (body.who || "").trim();
  const pin = (body.pin || "").trim();

  if (!(await teamSignInOk(who, pin))) {
    return NextResponse.json({ ok: false, message: "That code didn't work." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(TEAM_COOKIE, `${who}|${teamMarker()}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    // A working week, not thirty days: the phone stays signed in across a
    // shift and across tomorrow, and a lost phone stops being a door soon.
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(TEAM_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
