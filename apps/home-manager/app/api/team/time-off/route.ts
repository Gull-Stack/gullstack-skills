import { badRequest, fromDb, unauthorized } from "@/lib/guard";
import { teamUser } from "@/lib/team-auth";
import { requestTimeOff, validateTimeOff } from "@/lib/schedule";

export const dynamic = "force-dynamic";

/**
 * "Can I have the 14th off?" — instead of a text message that gets lost.
 *
 * Two things are forced here rather than trusted from the body: the person is
 * whoever is signed in, and the status is always `pending`. Nobody approves
 * their own leave, and nobody files a day off under somebody else's name.
 */
export async function POST(req: Request) {
  const who = await teamUser();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;
  const parsed = validateTimeOff({ ...body, person: who, status: "pending" });
  if (!parsed.ok) return badRequest(parsed.error);

  return fromDb(await requestTimeOff({ ...parsed.request, person: who, status: "pending" }));
}
