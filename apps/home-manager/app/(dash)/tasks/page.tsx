import { dbConfigured } from "@/lib/supabase";
import { shiftDate, today as houseToday } from "@/lib/day";
import { getPeople, toneMap, workerNames } from "@/lib/people";
import { dayBoard, getLog, getTasks, tally } from "@/lib/tasks";
import { NoDatabase, SectionHead } from "../../ui";
import { TaskManager } from "./manager";

export const dynamic = "force-dynamic";

/**
 * The master list, and what actually happened.
 *
 * Ninety days of history hangs under each task on purpose: "who did it, and
 * when" is the question that gets asked when something has quietly stopped
 * happening, and it is unanswerable from a checklist that only knows today.
 */
export default async function TasksPage() {
  const today = houseToday();
  const historyStart = shiftDate(today, -89);

  const [people, tasks, log] = await Promise.all([
    getPeople(),
    getTasks({ includeInactive: true }),
    getLog(historyStart, today),
  ]);

  const active = tasks.filter((t) => t.active);
  const board = dayBoard(active, log, today);
  const counts = tally(board);

  return (
    <>
      <SectionHead
        title="Tasks"
        sub={`${active.length} on the list${counts.total ? ` · ${counts.total} due today` : ""}. A skip always needs a reason — that's the part worth reading.`}
      />

      <div className="stack">
        {dbConfigured() ? null : <NoDatabase />}
        <TaskManager
          today={today}
          tasks={tasks}
          log={log}
          board={board}
          people={workerNames(people)}
          tones={toneMap(people)}
        />
      </div>
    </>
  );
}
