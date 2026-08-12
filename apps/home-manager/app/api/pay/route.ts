import { badRequest, fromDb, ownerOnly, unauthorized } from "@/lib/guard";
import { clockOut, markRunPaid, saveRun, validateRun } from "@/lib/pay";
import { today } from "@/lib/day";

export const dynamic = "force-dynamic";

/** Pay is owner-only. */
export async function POST(req: Request) {
  const who = await ownerOnly();
  if (!who) return unauthorized("Pay is owner-only.");

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(body.action || "run");

  // Closing a shift somebody forgot to end. The row records WHO closed it, so
  // an adjusted timesheet never looks like the person's own entry.
  if (action === "close-shift") {
    const id = String(body.id || "");
    const at = String(body.at || "");
    if (!id) return badRequest("Which shift?");
    if (Number.isNaN(Date.parse(at))) return badRequest("What time did they actually leave?");
    if (Date.parse(at) > Date.now() + 60_000) return badRequest("That's in the future.");
    return fromDb(await clockOut(id, at, who.name));
  }

  if (action === "mark-paid") {
    const id = String(body.id || "");
    const paidOn = String(body.paid_on || today());
    if (!id) return badRequest("Which pay run?");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(paidOn)) return badRequest("When was it paid?");
    return fromDb(await markRunPaid(id, paidOn, String(body.method || "").trim() || null));
  }

  const parsed = validateRun(body);
  if (!parsed.ok) return badRequest(parsed.error);
  return fromDb(await saveRun(parsed.run));
}
