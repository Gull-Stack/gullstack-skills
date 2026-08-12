import { NextResponse, type NextRequest } from "next/server";

// The real front door.
//
// 🔴 Why this file exists rather than a redirect in the layout: `redirect()`
// inside a layout runs AFTER the page has rendered, so the redirect is advice a
// browser follows and curl ignores — the server still ships the whole rendered
// page in the body. On the app this one is modeled on that meant 164KB of a
// private dashboard going out to a request carrying no cookie at all, and it
// sat under the entire portal for months. Gating here stops the request before
// any page function runs.
//
// ⚠️ When testing this, check the BODY LENGTH, not the status code. A leak
// looks like 307 too.
//
// Open by design:
//   /login, /api/auth        — you need them to get in
//   /team, /api/team         — staff sign in with their own code, so their
//                              requests carry hm_team and never hm_auth. Every
//                              route under /api/team re-checks which cookie it
//                              got and fails closed. Gate by COOKIE in the
//                              route, not by path here: the app this is modeled
//                              on listed only the session route as open, and
//                              every staff check-off for a week died at the
//                              proxy showing "that didn't save".

const OPEN = ["/login", "/api/auth", "/team", "/api/team"];

const AUTH = "hm_auth";

function marker(): string {
  return process.env.HM_SECRET || "home-manager-dev-marker";
}

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (OPEN.some((p) => pathname === p || pathname.startsWith(p + "/"))) {
    return NextResponse.next();
  }

  // The cookie is "<name>|<marker>" — the name is what the app renders, the
  // marker is what makes it valid. Compare the MARKER half, not the whole
  // string: comparing the whole thing rejects every real sign-in, and the
  // symptom is a login screen that loops rather than an error anybody can read.
  const [, mark] = (req.cookies.get(AUTH)?.value || "").split("|");
  if (mark && mark === marker()) {
    return NextResponse.next();
  }

  // An API route gets a bare 401 — a redirect to an HTML login page is a
  // confusing answer to a fetch.
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const url = req.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|ico)$).*)"],
};
