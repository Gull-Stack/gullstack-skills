import { anyCodeConfigured, familyDoor } from "@/lib/door";
import { getPeople } from "@/lib/people";
import { dbConfigured } from "@/lib/supabase";
import { LoginForm } from "./form";
import { HomeMark } from "../icons";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  const people = await getPeople();
  const names = familyDoor(people);
  const hasCode = anyCodeConfigured(names, people);

  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: 20 }}>
      <div className="card" style={{ width: "100%", maxWidth: 400 }}>
        <div className="row" style={{ gap: 10, marginBottom: 16 }}>
          <span className="hm-brand-mark">
            <HomeMark />
          </span>
          <div>
            <div className="hm-brand-name">Home Manager</div>
            <div className="hm-brand-sub">The house, in one place</div>
          </div>
        </div>

        {names.length === 0 ? (
          <div className="notice notice-amber">
            <strong>Nobody can sign in yet.</strong> Set <code>HM_OWNER</code> to your name and{" "}
            <code>HM_PIN_&lt;YOUR_NAME&gt;</code> to a code, then reload. {dbConfigured() ? null : "The database isn't connected either — see the README."}
          </div>
        ) : !hasCode ? (
          <div className="notice notice-amber">
            <strong>No sign-in codes are set.</strong> An unset code never means an open door, so nobody
            gets in until one exists. Set <code>HM_PIN_{names[0].toUpperCase().replace(/[^A-Z0-9]/g, "_")}</code>{" "}
            and reload.
          </div>
        ) : (
          <LoginForm names={names} />
        )}

        <hr className="hair" />
        <p className="quiet" style={{ margin: 0 }}>
          Work here rather than live here? <a href="/team">Use the team door →</a>
        </p>
      </div>
    </main>
  );
}
