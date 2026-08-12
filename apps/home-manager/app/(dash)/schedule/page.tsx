import { dbConfigured } from "@/lib/supabase";
import { shiftDate, today as houseToday, weekStart } from "@/lib/day";
import { getPeople, staffNames, toneMap } from "@/lib/people";
import { getLog, getTasks } from "@/lib/tasks";
import { assembleWeek, getDefaults, getOverrides, getTimeOff } from "@/lib/schedule";
import { NoDatabase, SectionHead } from "../../ui";
import { ScheduleBoard } from "./board";

export const dynamic = "force-dynamic";

/**
 * The week, side by side.
 *
 * A household schedule is read as a shape, not as a list: "who is here
 * Thursday" is answered by looking at a column, and any layout that makes you
 * scroll a list to find out has already lost. Seven columns, tasks sitting on
 * their own day, people wearing their own colour.
 */
export default async function SchedulePage({
  searchParams,
}: {
  searchParams: Promise<{ w?: string }>;
}) {
  const params = await searchParams;
  const today = houseToday();
  const monday = /^\d{4}-\d{2}-\d{2}$/.test(params.w || "") ? weekStart(params.w!) : weekStart(today);
  const sunday = shiftDate(monday, 6);

  const [people, tasks, log, defaults, overrides, timeOff] = await Promise.all([
    getPeople(),
    getTasks(),
    getLog(monday, sunday),
    getDefaults(),
    getOverrides(monday, sunday),
    // A week either side, so a request that starts before Monday still shows.
    getTimeOff(shiftDate(monday, -14), shiftDate(sunday, 30)),
  ]);

  const staff = staffNames(people);
  const week = assembleWeek({ monday, today, tasks, log, defaults, overrides, timeOff, order: staff });

  return (
    <>
      <SectionHead
        title="The schedule"
        sub="Standing days are the pattern. A swap changes one week only — next week goes back to normal by itself."
      />

      <div className="stack">
        {dbConfigured() ? null : <NoDatabase />}
        <ScheduleBoard
          monday={monday}
          today={today}
          week={week}
          staff={staff}
          tones={toneMap(people)}
          defaults={defaults}
          timeOff={timeOff}
        />
      </div>
    </>
  );
}
