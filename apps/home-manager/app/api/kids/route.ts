import { anySignedIn, badRequest, familyOnly, fromDb, unauthorized } from "@/lib/guard";
import {
  clearKidLog,
  saveKidLog,
  saveKidNote,
  saveRoutine,
  setRoutineActive,
  validateKidLog,
  validateRoutine,
} from "@/lib/kids";

export const dynamic = "force-dynamic";

/**
 * Logging a child's day. Both doors — whoever is with the child does the
 * logging, and that is usually the nanny.
 *
 * `logged_by` is forced to the signed-in name rather than taken from the body:
 * "who said this happened" is the only thing that makes the record worth
 * keeping, and a field the client can set is a field the client can get wrong.
 */
export async function POST(req: Request) {
  const who = await anySignedIn();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (body.clear) {
    const routineId = String(body.routine_id || "");
    const forDate = String(body.for_date || "");
    if (!routineId || !forDate) return badRequest("Which routine, and which day?");
    return fromDb(await clearKidLog(routineId, forDate));
  }

  if (body.kind === "note" || body.kind === "milestone") {
    const child = String(body.child || "").trim();
    const forDate = String(body.for_date || "");
    const text = String(body.body || "").trim();
    if (!child) return badRequest("Which child?");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(forDate)) return badRequest("Which day?");
    if (!text) return badRequest("Write something first.");
    if (text.length > 2000) return badRequest("That's too long to store as one note.");
    return fromDb(
      await saveKidNote({ child, for_date: forDate, kind: body.kind, body: text, logged_by: who.name })
    );
  }

  const parsed = validateKidLog({ ...body, logged_by: who.name });
  if (!parsed.ok) return badRequest(parsed.error);
  return fromDb(await saveKidLog(parsed.log));
}

/** Deciding what a child's routine IS belongs to the family, not the kiosk. */
export async function PUT(req: Request) {
  const who = await familyOnly();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (typeof body.active === "boolean" && body.id && Object.keys(body).length === 2) {
    return fromDb(await setRoutineActive(String(body.id), body.active));
  }

  const parsed = validateRoutine(body);
  if (!parsed.ok) return badRequest(parsed.error);
  return fromDb(await saveRoutine(body.id ? { ...parsed.routine, id: String(body.id) } : parsed.routine));
}
