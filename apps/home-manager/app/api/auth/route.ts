import { NextResponse } from "next/server";
import { AUTH_COOKIE, marker, signInOk } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const body = (await req.json().catch(() => ({}))) as { who?: string; pin?: string };
  const who = (body.who || "").trim();
  const pin = (body.pin || "").trim();

  if (!(await signInOk(who, pin))) {
    // One message for "wrong code" and "no code set for you": telling an
    // unauthenticated caller which of the two it is tells them which names are
    // worth guessing at.
    return NextResponse.json({ ok: false, message: "That code didn't work." }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, `${who}|${marker()}`, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
  return res;
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(AUTH_COOKIE, "", { path: "/", maxAge: 0 });
  return res;
}
