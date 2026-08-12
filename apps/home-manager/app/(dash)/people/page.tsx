import { isOwner } from "@/lib/auth";
import { dbConfigured } from "@/lib/supabase";
import { getPeople, toneMap } from "@/lib/people";
import { pinEnvKey, teamPinEnvKey } from "@/lib/door";
import { NoDatabase, Notice, SectionHead } from "../../ui";
import { Roster } from "./roster";

export const dynamic = "force-dynamic";

/**
 * Everyone the home has.
 *
 * One roster, one `role` column. A nanny who is on the schedule, gets paid, and
 * logs a child's reading is one person here — not three rows in three systems
 * that drift apart the first time somebody's name is spelled differently.
 */
export default async function PeoplePage() {
  const owner = await isOwner();
  const people = await getPeople({ includeInactive: true });

  return (
    <>
      <SectionHead
        title="People"
        sub="The adults who run the home, the people who work in it, and the kids it's for."
      />

      <div className="stack">
        {dbConfigured() ? null : <NoDatabase />}
        <Roster people={people} tones={toneMap(people)} isOwner={owner} />

        <Notice>
          <strong>About codes.</strong> A code set here opens that person&rsquo;s own door and nothing else —
          staff go to <code>/team</code>, family to <code>/login</code>. There is no shared code and no master
          code anywhere in this app, on purpose: a code that opens the door for &ldquo;whoever knows it&rdquo;
          cannot tell you who ticked a box, and the day it turns out to also be the code for something else,
          both doors open at once. To keep a code out of the database entirely, set the environment variable
          instead — <code>{pinEnvKey("Their Name")}</code> for family, <code>{teamPinEnvKey("Their Name")}</code>{" "}
          for staff. The environment always wins.
        </Notice>
      </div>
    </>
  );
}
