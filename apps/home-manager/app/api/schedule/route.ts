import { badRequest, familyOnly, fromDb, unauthorized } from "@/lib/guard";
import {
  clearShift,
  requestTimeOff,
  saveShift,
  setDefaults,
  setTimeOffStatus,
  swapRows,
  validateTimeOff,
} from "@/lib/schedule";

export const dynamic = "force-dynamic";

/**
 * Everything that changes who is coming and when.
 *
 * Family door only. A staff member CAN ask for time off — that goes through
 * /api/team/time-off, which forces `person` to whoever is signed in and
 * `status` to pending, so nobody can approve their own leave or file it under
 * somebody else's name.
 */
export async function POST(req: Request) {
  const who = await familyOnly();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const action = String(body.action || "");

  switch (action) {
    case "defaults": {
      const person = String(body.person || "").trim();
      if (!person) return badRequest("Which person?");
      const raw = Array.isArray(body.dows) ? body.dows : [];
      const dows = [...new Set(raw.map(Number))].filter((d) => Number.isInteger(d) && d >= 0 && d <= 6);
      return fromDb(await setDefaults(person, dows));
    }

    case "swap": {
      const date = String(body.date || "");
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return badRequest("Which day?");
      const rows = swapRows(date, String(body.off || ""), String(body.on || ""));
      if (!rows.length) return badRequest("Who is swapping with whom?");
      for (const row of rows) {
        const r = await saveShift(row);
        if (!r.ok) return fromDb(r);
      }
      return Response.json({ ok: true });
    }

    case "clear-shift": {
      const person = String(body.person || "");
      const date = String(body.date || "");
      if (!person || !date) return badRequest("Which person, and which day?");
      return fromDb(await clearShift(person, date));
    }

    case "time-off": {
      const parsed = validateTimeOff(body);
      if (!parsed.ok) return badRequest(parsed.error);
      return fromDb(await requestTimeOff(parsed.request));
    }

    case "answer": {
      const id = String(body.id || "");
      const status = String(body.status || "");
      if (!id) return badRequest("Which request?");
      if (status !== "approved" && status !== "denied") return badRequest("Approve it or deny it.");
      return fromDb(await setTimeOffStatus(id, status));
    }

    default:
      return badRequest("Unknown action.");
  }
}
