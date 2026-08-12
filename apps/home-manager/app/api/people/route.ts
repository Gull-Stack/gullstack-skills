import { badRequest, familyOnly, fromDb, ownerOnly, unauthorized } from "@/lib/guard";
import { savePerson, setPersonActive, validatePerson } from "@/lib/people";

export const dynamic = "force-dynamic";

/**
 * The roster.
 *
 * Anyone on the family side can add a child or a helper; only an owner may set
 * or change what somebody is PAID, because that is the one field on this page
 * with a dollar sign on it. A non-owner's pay fields are dropped rather than
 * refused — refusing the whole save would mean an adult cannot add a person at
 * all, and silently keeping the old rate is the correct outcome for an edit.
 */
export async function POST(req: Request) {
  const who = await familyOnly();
  if (!who) return unauthorized();

  const body = (await req.json().catch(() => ({}))) as Record<string, unknown>;

  if (typeof body.active === "boolean" && body.name && Object.keys(body).length === 2) {
    return fromDb(await setPersonActive(String(body.name), body.active));
  }

  const parsed = validatePerson(body);
  if (!parsed.ok) return badRequest(parsed.error);

  let person = parsed.person;
  if (!who.owner && (person.pay_rate_cents != null || person.pay_kind !== "none")) {
    if (!(await ownerOnly())) {
      person = { ...person, pay_rate_cents: null, pay_kind: "none" };
    }
  }

  return fromDb(await savePerson(person));
}
