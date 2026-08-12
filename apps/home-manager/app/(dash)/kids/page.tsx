import { dbConfigured } from "@/lib/supabase";
import { shiftDate, today as houseToday } from "@/lib/day";
import { childNames, getPeople } from "@/lib/people";
import { getKidLog, getKidNotes, getRoutines } from "@/lib/kids";
import { Empty, NoDatabase, SectionHead } from "../../ui";
import { KidsBoard } from "./board";

export const dynamic = "force-dynamic";

/**
 * The children's record.
 *
 * ⛔ Deliberately not a scoreboard. No child is ranked against a sibling, no
 * missed day is red, and there is no percentage anywhere on this page. What it
 * is for: knowing that reading actually happened this week, and keeping the
 * handful of moments that are worth keeping.
 */
export default async function KidsPage() {
  const today = houseToday();
  const from = shiftDate(today, -29);

  const [people, routines, log, notes] = await Promise.all([
    getPeople(),
    getRoutines({ includeInactive: true }),
    getKidLog(from, today),
    getKidNotes(shiftDate(today, -364), today),
  ]);

  const kids = childNames(people);

  return (
    <>
      <SectionHead
        title="The kids"
        sub="The things that should happen every day, and the moments worth keeping."
      />

      <div className="stack">
        {dbConfigured() ? null : <NoDatabase />}
        {kids.length === 0 ? (
          <Empty>
            No children on the roster yet. Add them on <a href="/people">the People page</a> and each one gets
            a daily routine here.
          </Empty>
        ) : (
          <KidsBoard today={today} from={from} kids={kids} routines={routines} log={log} notes={notes} />
        )}
      </div>
    </>
  );
}
