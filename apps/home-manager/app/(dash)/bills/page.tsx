import { redirect } from "next/navigation";
import { isOwner } from "@/lib/auth";
import { dbConfigured } from "@/lib/supabase";
import { today as houseToday } from "@/lib/day";
import { billBoard, getBills, getPaymentsForBills, monthlyLoad } from "@/lib/bills";
import { NoDatabase, SectionHead } from "../../ui";
import { BillsBoard } from "./board";

export const dynamic = "force-dynamic";

/**
 * What the house costs, and whether it got paid.
 *
 * A bill is a recurring commitment; a payment is a dated row against ONE
 * occurrence of it. That separation is the whole design — marking December paid
 * must never touch November, and a monthly total has to survive somebody
 * correcting last month six weeks later.
 */
export default async function BillsPage() {
  if (!(await isOwner())) redirect("/");

  const today = houseToday();
  const bills = await getBills({ includeInactive: true });
  const payments = await getPaymentsForBills(bills.map((b) => b.id));

  const board = billBoard(bills, payments, today);
  const load = monthlyLoad(bills);

  return (
    <>
      <SectionHead
        title="Bills"
        sub="What's coming, and what's been paid. Autopay here records that the biller pulls it — it doesn't make that true."
      />

      <div className="stack">
        {dbConfigured() ? null : <NoDatabase />}
        <BillsBoard today={today} board={board} load={load} />
      </div>
    </>
  );
}
