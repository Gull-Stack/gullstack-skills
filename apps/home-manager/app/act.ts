"use client";

// One place the client talks to the server.
//
// Every write in this app goes through here so that a failure surfaces the same
// way everywhere: the server's actual message, not a generic "something went
// wrong", and never a silent no-op. A refusal the user cannot read is a bug
// they will report as "it doesn't work".

export type ActResult = { ok: true } | { ok: false; message: string };

export async function act(url: string, body: unknown, method: "POST" | "PATCH" | "DELETE" = "POST"): Promise<ActResult> {
  try {
    const r = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    const data = (await r.json().catch(() => ({}))) as { ok?: boolean; message?: string };
    if (r.ok && data.ok !== false) return { ok: true };
    if (r.status === 401) {
      return { ok: false, message: "You've been signed out. Sign in again — nothing you did is lost." };
    }
    return { ok: false, message: data.message || `That didn't save (${r.status}).` };
  } catch {
    return { ok: false, message: "No connection. Try again once you're back online." };
  }
}
