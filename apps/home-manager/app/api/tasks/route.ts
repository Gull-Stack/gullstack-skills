import { anySignedIn, badRequest, familyOnly, fromDb, unauthorized } from "@/lib/guard";
import { clearLog, saveLog, saveTask, setTaskActive, validateLog, validateTask } from "@/lib/tasks";

export const dynamic = "force-dynamic";

/**
 * Ticking a box. Open to BOTH doors — the nanny does this from her phone and
 * the family does it from the couch, and it is the same action either way.
 */
export async function POST(req: Request) {
  const who = await anySignedIn();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  // "clear" is un-ticking: the row goes away entirely so the task reads as
  // simply not done yet, rather than as a third state nobody asked for.
  if (body.clear) {
    const taskId = String(body.task_id || "");
    const forDate = String(body.for_date || "");
    if (!taskId || !forDate) return badRequest("Which task, and which day?");
    return fromDb(await clearLog(taskId, forDate));
  }

  const parsed = validateLog({ ...body, person: String(body.person || who.name) });
  if (!parsed.ok) return badRequest(parsed.error);
  return fromDb(await saveLog(parsed.log));
}

/** Creating and editing tasks is the family's job, not the kiosk's. */
export async function PUT(req: Request) {
  const who = await familyOnly();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (typeof body.active === "boolean" && body.id && Object.keys(body).length === 2) {
    return fromDb(await setTaskActive(String(body.id), body.active));
  }

  const parsed = validateTask(body);
  if (!parsed.ok) return badRequest(parsed.error);
  return fromDb(await saveTask(body.id ? { ...parsed.task, id: String(body.id) } : parsed.task));
}
