// Storage: Supabase REST, one project of this app's OWN.
//
// ⛔ There is deliberately NO hardcoded fallback URL or key here. The Salisbury
// Flight Deck hardcodes its project so the app never boots blind — that is the
// right call there and the wrong one here, because a default that happens to
// point at somebody else's project is how two households end up in one table.
// Unset env = this app has no database, says so on screen, and writes nothing.
//
// SERVER ONLY. `SUPABASE_SERVICE_ROLE_KEY` is not NEXT_PUBLIC, so it is
// undefined in any client bundle; every caller below is a server component or a
// route handler.

export const SB_URL = (process.env.SUPABASE_URL || "").replace(/\/$/, "");

const SB_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY || "";

/** Is there a database behind this app at all? Every page checks before it lies. */
export function dbConfigured(): boolean {
  return Boolean(SB_URL && SB_KEY);
}

export function sbHeaders(): Record<string, string> {
  return {
    apikey: SB_KEY,
    Authorization: `Bearer ${SB_KEY}`,
    "Content-Type": "application/json",
  };
}

export type DbResult<T> = { ok: true; rows: T } | { ok: false; error: string };

/** GET a table. Returns [] on any failure — a page must never crash on storage. */
export async function sbSelect<T>(path: string): Promise<T[]> {
  if (!dbConfigured()) return [];
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      headers: sbHeaders(),
      cache: "no-store",
    });
    if (!r.ok) return [];
    return (await r.json()) as T[];
  } catch {
    return [];
  }
}

/**
 * Write, and report honestly.
 *
 * `return=representation` on every write on purpose: PostgREST answers a
 * policy-refused DELETE or UPDATE with a 200 and an empty body, so "did it
 * work" cannot be read off the status code alone. Asking for the rows back
 * turns a silent refusal into a visible zero.
 */
export async function sbWrite<T = unknown>(
  path: string,
  method: "POST" | "PATCH" | "DELETE",
  body?: unknown,
  prefer = "return=representation"
): Promise<DbResult<T[]>> {
  if (!dbConfigured()) {
    return { ok: false, error: "No database is connected yet — set SUPABASE_URL and a key." };
  }
  try {
    const r = await fetch(`${SB_URL}/rest/v1/${path}`, {
      method,
      headers: { ...sbHeaders(), Prefer: prefer },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const text = await r.text();
    if (!r.ok) return { ok: false, error: `supabase ${r.status}: ${text.slice(0, 300)}` };
    const rows = text ? (JSON.parse(text) as T[]) : [];
    return { ok: true, rows };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Upsert on a named conflict target, merging rather than duplicating. */
export function upsert<T = unknown>(
  table: string,
  onConflict: string,
  body: unknown
): Promise<DbResult<T[]>> {
  return sbWrite<T>(
    `${table}?on_conflict=${onConflict}`,
    "POST",
    body,
    "resolution=merge-duplicates,return=representation"
  );
}
