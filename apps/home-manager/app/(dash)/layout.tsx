import { redirect } from "next/navigation";
import { currentUser, isOwner } from "@/lib/auth";
import { AppShell } from "./shell";

export const dynamic = "force-dynamic";

export default async function DashLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  // Belt and braces. proxy.ts is the real gate — this redirect runs after the
  // page has already rendered, so on its own it would ship the whole page body
  // to an unauthenticated caller. Never remove the proxy and rely on this.
  if (!user) redirect("/login");

  return (
    <AppShell user={user} isOwner={await isOwner()}>
      {children}
    </AppShell>
  );
}
