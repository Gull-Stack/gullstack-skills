import { teamUser } from "@/lib/team-auth";
import { anyTeamCodeConfigured, teamDoor } from "@/lib/door";
import { getPeople, childNames } from "@/lib/people";
import { dbConfigured } from "@/lib/supabase";
import { shiftDate, today as houseToday } from "@/lib/day";
import { dayBoard, getLog, getTasks } from "@/lib/tasks";
import { getDefaults, getOverrides, getTimeOff, whoWorks } from "@/lib/schedule";
import { getOpenClock } from "@/lib/pay";
import { openShift } from "@/lib/clock";
import { childDay, getKidLog, getRoutines } from "@/lib/kids";
import { NoDatabase } from "../ui";
import { TeamSignIn } from "./signin";
import { Kiosk } from "./kiosk";

export const dynamic = "force-dynamic";

/**
 * The team door.
 *
 * Deliberately its own page, its own cookie, its own code. What is here: the
 * clock, today's list, the kids' routine, and asking for a day off. What is
 * NOT here, and must not be added: pay rates, bills, the bank page, anybody
 * else's record. The separation is the feature — it means a phone left on a
 * kitchen counter is not a way into the household's money.
 */
export default async function TeamPage() {
  const who = await teamUser();
  const people = await getPeople();

  if (!who) {
    const names = teamDoor(people);
    return (
      <>
        {dbConfigured() ? null : <NoDatabase />}
        <TeamSignIn names={names} anyCode={anyTeamCodeConfigured(people)} />
      </>
    );
  }

  const today = houseToday();
  const [tasks, log, defaults, overrides, timeOff, open, routines, kidLog] = await Promise.all([
    getTasks(),
    getLog(today),
    getDefaults(),
    getOverrides(today, today),
    getTimeOff(shiftDate(today, -1), shiftDate(today, 90)),
    getOpenClock(),
    getRoutines(),
    getKidLog(today),
  ]);

  const kids = childNames(people);
  const board = dayBoard(tasks, log, today);
  const mine = openShift(open, who);

  return (
    <Kiosk
      who={who}
      today={today}
      onToday={whoWorks(today, defaults, overrides, timeOff, [])}
      board={board}
      openSince={mine?.in_at ?? null}
      kids={kids.map((child) => ({ child, routines: childDay(routines, kidLog, child, today) }))}
      myTimeOff={timeOff.filter((t) => t.person === who)}
    />
  );
}
