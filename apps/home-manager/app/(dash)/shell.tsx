"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, type ReactNode } from "react";
import {
  HomeMark,
  IconBill,
  IconCalendar,
  IconChart,
  IconClock,
  IconHome,
  IconKids,
  IconList,
  IconMenu,
  IconMoney,
  IconPeople,
} from "../icons";

type NavItem = { href: string; label: string; icon: ReactNode; ownerOnly?: boolean };

const SECTIONS: { label: string; items: NavItem[] }[] = [
  {
    label: "The day",
    items: [
      { href: "/", label: "Today", icon: <IconHome /> },
      { href: "/schedule", label: "Schedule", icon: <IconCalendar /> },
      { href: "/tasks", label: "Tasks", icon: <IconList /> },
    ],
  },
  {
    label: "The kids",
    items: [{ href: "/kids", label: "Kids", icon: <IconKids /> }],
  },
  {
    label: "Money",
    items: [
      { href: "/pay", label: "Pay", icon: <IconMoney />, ownerOnly: true },
      { href: "/bills", label: "Bills", icon: <IconBill />, ownerOnly: true },
      { href: "/spending", label: "Spending", icon: <IconChart />, ownerOnly: true },
    ],
  },
  {
    label: "Setup",
    items: [{ href: "/people", label: "People", icon: <IconPeople /> }],
  },
];

export function AppShell({
  user,
  isOwner,
  children,
}: {
  user: string;
  isOwner: boolean;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The drawer closes on navigation and on Escape. Both matter on a phone: the
  // first because tapping a link and landing behind the menu reads as broken,
  // the second because a drawer with no keyboard exit is a trap.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="hm-topbar">
        <button className="hm-burger" onClick={() => setOpen(true)} aria-label="Open the menu">
          <IconMenu />
        </button>
        <span className="hm-brand-name">Home Manager</span>
      </div>

      <div className="hm-shell">
        <nav className="hm-side" data-open={open} aria-label="Sections">
          <div className="hm-brand">
            <span className="hm-brand-mark">
              <HomeMark />
            </span>
            <div>
              <div className="hm-brand-name">Home Manager</div>
              <div className="hm-brand-sub">Signed in as {user}</div>
            </div>
          </div>

          {SECTIONS.map((section) => {
            const items = section.items.filter((i) => !i.ownerOnly || isOwner);
            if (!items.length) return null;
            return (
              <div key={section.label}>
                <div className="hm-navlabel">{section.label}</div>
                {items.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="hm-link"
                    // Exact match for the root; prefix for everything else, so
                    // /tasks and /tasks/history both light the same row.
                    data-current={item.href === "/" ? pathname === "/" : pathname.startsWith(item.href)}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                ))}
              </div>
            );
          })}

          <div style={{ marginTop: "auto", paddingTop: 20 }}>
            <a className="hm-link" href="/team">
              <IconClock />
              Team door
            </a>
            <form action="/api/auth" method="post">
              <button
                type="button"
                className="hm-link"
                style={{ width: "100%", background: "none", border: 0, cursor: "pointer", textAlign: "left" }}
                onClick={async () => {
                  await fetch("/api/auth", { method: "DELETE" });
                  window.location.href = "/login";
                }}
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>

        {open ? <button className="hm-overlay" onClick={() => setOpen(false)} aria-label="Close the menu" /> : null}

        <main className="hm-main">{children}</main>
      </div>
    </>
  );
}
