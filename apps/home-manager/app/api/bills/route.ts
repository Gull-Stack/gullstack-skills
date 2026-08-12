import { badRequest, fromDb, ownerOnly, unauthorized } from "@/lib/guard";
import { markPaid, saveBill, setBillActive, unmarkPaid, validateBill } from "@/lib/bills";

export const dynamic = "force-dynamic";

/** Bills are owner-only, on both the read side (the page) and here. */
export async function POST(req: Request) {
  const who = await ownerOnly();
  if (!who) return unauthorized("Bills are owner-only.");

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(body.action || "save");

  if (action === "paid") {
    const billId = String(body.bill_id || "");
    const period = String(body.period || "");
    const paidOn = String(body.paid_on || "");
    if (!billId || !period) return badRequest("Which bill, and which month?");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(paidOn)) return badRequest("When was it paid?");
    const amount = body.amount_cents;
    return fromDb(
      await markPaid({
        bill_id: billId,
        period,
        paid_on: paidOn,
        amount_cents: typeof amount === "number" ? Math.round(amount) : null,
        method: String(body.method || "").trim() || null,
        note: String(body.note || "").trim() || null,
      })
    );
  }

  if (action === "unpaid") {
    const billId = String(body.bill_id || "");
    const period = String(body.period || "");
    if (!billId || !period) return badRequest("Which bill, and which month?");
    return fromDb(await unmarkPaid(billId, period));
  }

  if (action === "active") {
    const id = String(body.id || "");
    if (!id || typeof body.active !== "boolean") return badRequest("Which bill?");
    return fromDb(await setBillActive(id, body.active));
  }

  const parsed = validateBill(body);
  if (!parsed.ok) return badRequest(parsed.error);
  return fromDb(await saveBill(body.id ? { ...parsed.bill, id: String(body.id) } : parsed.bill));
}
