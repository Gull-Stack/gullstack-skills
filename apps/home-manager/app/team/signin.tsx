"use client";

import { useState } from "react";
import { HomeMark } from "../icons";

/**
 * A number pad, not a keyboard.
 *
 * This is used standing up, often with one hand, sometimes with wet hands. A
 * text input summons a keyboard that covers half the screen and autocorrects a
 * PIN; twelve big buttons do not.
 */
export function TeamSignIn({ names, anyCode }: { names: string[]; anyCode: boolean }) {
  const [who, setWho] = useState(names.length === 1 ? names[0] : "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(code: string) {
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/team/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ who, pin: code }),
      });
      if (r.ok) {
        window.location.href = "/team";
        return;
      }
      setPin("");
      setError("That code didn't work.");
    } catch {
      setError("No connection. Try again in a moment.");
    } finally {
      setBusy(false);
    }
  }

  function press(digit: string) {
    if (busy) return;
    const next = pin + digit;
    setPin(next);
    setError(null);
    // Four digits is the common case, so it submits itself rather than making
    // somebody hunt for a button.
    if (next.length === 4) submit(next);
  }

  return (
    <div className="card" style={{ marginTop: 24 }}>
      <div className="row" style={{ gap: 10, marginBottom: 18 }}>
        <span className="hm-brand-mark">
          <HomeMark />
        </span>
        <div>
          <div className="hm-brand-name">Home Manager</div>
          <div className="hm-brand-sub">Team</div>
        </div>
      </div>

      {names.length === 0 ? (
        <div className="notice notice-amber">
          Nobody is set up to sign in here yet. Whoever runs the home adds people on the People page.
        </div>
      ) : !anyCode ? (
        <div className="notice notice-amber">
          <strong>No codes have been set.</strong> An unset code never means an open door, so nobody can sign
          in until somebody sets one on the People page.
        </div>
      ) : (
        <>
          <p className="label">Who&rsquo;s here?</p>
          <div className="row" style={{ gap: 8, marginBottom: 18 }}>
            {names.map((n) => (
              <button
                key={n}
                className="person-pill"
                aria-pressed={who === n}
                onClick={() => {
                  setWho(n);
                  setPin("");
                  setError(null);
                }}
              >
                {n}
              </button>
            ))}
          </div>

          {who ? (
            <>
              <div className="pin-dots">
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className="pin-dot" data-on={pin.length > i} />
                ))}
              </div>

              {error ? (
                <div className="notice notice-red" style={{ marginBottom: 12 }}>
                  {error}
                </div>
              ) : null}

              <div className="pin-pad" style={{ margin: "0 auto" }}>
                {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((d) => (
                  <button key={d} onClick={() => press(d)} disabled={busy}>
                    {d}
                  </button>
                ))}
                <button onClick={() => setPin("")} disabled={busy} aria-label="Clear">
                  ✕
                </button>
                <button onClick={() => press("0")} disabled={busy}>
                  0
                </button>
                <button onClick={() => submit(pin)} disabled={busy || pin.length < 4} aria-label="Sign in">
                  →
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
