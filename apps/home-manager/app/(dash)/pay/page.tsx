import { redirect } from "next/navigation";
import { isOwner } from "@/lib/auth";
import { dbConfigured } from "@/lib/supabase";
import { shiftDate, today as houseToday } from "@/lib/day";
import { getPeople } from "@/lib/people";
import { getClock, getRuns, owedFor, periodFor, type PeriodKind } from "@/lib/pay";
import { staleShifts, totalsByPerson } from "@/lib/clock";
import { NoDatabase, SectionHead } from "../../ui";
import { PayBoard } from "./board";

export const dynamic = "force-dynamic";

/**
 * What the people who work here are owed.
 *
 * ⛔ This page RECORDS payments; it does not make them. Nothing here moves
 * money and no button implies it does — "Mark paid" means somebody paid by
 * whatever means the household uses and is writing it down.
 */
export default async function PayPage({ searchParams }: { searchParams: Promise<{ p?: string }> }) {
  if (!(await isOwner())) redirect("/");

  const params = await searchParams;
  const kind: PeriodKind =
    params.p === "weekly" || params.p === "monthly" || params.p === "biweekly" ? params.p : "biweekly";

  const today = houseToday();
  const { start, end } = periodFor(today, kind);
  const now = Date.now();

  const [people, clock, runs] = await Promise.all([
    getPeople(),
    // A month either side of the period, so a stale open shift from before the
    // window still surfaces rather than quietly aging out.
    getClock(shiftDate(start, -31), shiftDate(end, 1)),
    getRuns(shiftDate(start, -180), end),
  ]);

  const owed = owedFor({ people, clock, runs, start, end, now });
  const periodClock = clock.filter((c) => c.for_date >= start && c.for_date <= end);

  return (
    <>
      <SectionHead
        title="Pay"
        sub="Hours come from the clock, so nobody types them in twice. This is a record of what was paid — it doesn't move any money."
      />

      <div className="stack">
        {dbConfigured() ? null : <NoDatabase />}
        <PayBoard
          kind={kind}
          start={start}
          end={end}
          today={today}
          owed={owed}
          runs={runs}
          stale={staleShifts(clock, today)}
          totals={totalsByPerson(periodClock, start, end, now)}
        />
      </div>
    </>
  );
}
