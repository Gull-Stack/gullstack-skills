"use client";

import { useState } from "react";

export function LoginForm({ names }: { names: string[] }) {
  const [who, setWho] = useState(names[0] ?? "");
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const r = await fetch("/api/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ who, pin }),
      });
      if (r.ok) {
        // A full navigation, not a router push: the cookie was just set and the
        // whole shell needs to re-render behind it.
        window.location.href = "/";
        return;
      }
      const data = await r.json().catch(() => ({}));
      setError(data.message || "That code didn't work.");
    } catch {
      setError("Couldn't reach the app. Check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={submit} className="stack">
      <div>
        <span className="label">Who are you?</span>
        <div className="row" style={{ gap: 8 }}>
          {names.map((n) => (
            <button
              key={n}
              type="button"
              className="person-pill"
              aria-pressed={who === n}
              onClick={() => {
                setWho(n);
                setError(null);
              }}
            >
              {n}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="label" htmlFor="pin">
          Your code
        </label>
        <input
          id="pin"
          className="field mono"
          type="password"
          inputMode="numeric"
          autoComplete="current-password"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          placeholder="••••"
        />
      </div>

      {error ? <div className="notice notice-red">{error}</div> : null}

      <button className="btn btn-primary" type="submit" disabled={busy || !who || !pin}>
        {busy ? "Checking…" : "Sign in"}
      </button>
    </form>
  );
}
