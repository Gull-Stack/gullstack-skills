---
name: billing-bookkeeping
description: Agency money ops — client billing workflow (recurring invoices, autopay, deposits), QuickBooks hygiene, revenue categories by pillar, the monthly close checklist, AR/dunning rules, MRR tracking. Use when invoicing clients, reconciling books, chasing receivables, or reporting agency financials.
---

# SKILL: Billing & bookkeeping ops

How GullStack runs the money side of a recurring-client agency. Written 2026-08.
**[load-bearing]** = cash or client trust breaks if wrong. Doctrine: **boring,
on-time money ops are a retention feature** — a client who is invoiced cleanly
and never surprised stays; and the books must answer the only strategic question
we ask them: **MRR by client by pillar, against the $50K/mo goal.** This is ops
hygiene, not tax or legal advice — the accountant rules on tax questions.

## 1. Billing workflow **[load-bearing]**

- **Every retainer = a QuickBooks recurring invoice on autopay.** Same day each
  month, due on receipt; card/ACH on file collected at signing (the deposit step
  in pitch-pricing §5 is when payment rails get wired — never start work before
  both exist).
- **Projects:** deposit invoice up front (paid before work starts), balance on
  the defined milestone. No open-ended "we'll settle up."
- **Ad spend never touches our books [load-bearing]:** client's card in their ad
  accounts (google-ads §2, meta-ads §1). We invoice management fees only. This
  keeps revenue clean, kills pass-through liability, and survives client audits.
- Every invoice line maps to the proposal's tier language — the client should
  recognize what they bought. Scope added mid-month gets its own line or its own
  conversation, never silent absorption (unbilled scope is margin leak).

## 2. Chart of accounts: revenue by pillar **[load-bearing]**

Income categories mirror the offer so the P&L answers strategy:
**Website/Build (project)** · **Hosting & Care (recurring)** · **Ads Management
(recurring)** · **Flight Deck (recurring)** · **Other/one-off**.
- Tag every income transaction with client + category. This is what makes "which
  pillar actually earns" and "which clients are profitable" answerable instead
  of vibes.
- The MRR view (GullStack Flight Deck is the dashboard of record for this) must
  reconcile to QBO recurring-invoice reality — a client counted in MRR whose
  autopay is dead is fiction. Offboarded clients leave MRR the month they're
  fired (Capital Wealth precedent: excluded from MRR at decision, not at last
  payment).

## 3. Monthly close (cash basis) — the checklist

Run in the first 5 business days of the month, every month:
1. All bank/Stripe/card feeds pulled; **every transaction categorized** — zero
   left in uncategorized. Unknown transaction → investigate, don't guess-file
   (a guess may label, only a confirmation may file it permanently).
2. Reconcile bank + Stripe payouts to QBO (payout ≠ revenue; fees split out).
3. Verify every recurring invoice actually generated and autopay actually
   charged — silent autopay failure is the #1 phantom-MRR source.
4. **AR aging pass** (§4) — every receivable >0 days has a next action.
5. Receipts attached for deductible spend; contractor payments tallied
   (1099 tracking is a January problem solved monthly).
6. Snapshot the numbers: MRR by pillar, cash collected, AR total, top overdue.
   Save the snapshot (GitHub+Notion protocol) — trend beats point-in-time.
Rig: the QuickBooks MCP is connected in Claude sessions (invoices, recurring
invoices, AR aging, P&L, customers) — run the close live from a session instead
of clicking through QBO.

## 4. AR + dunning **[load-bearing]**

Autopay makes this rare; when it fires, the sequence is fixed, friendly, and
automatic — never personal, never improvised:
- **Day 1 overdue:** friendly note + payment link (assume card expiry, because
  it usually is).
- **Day 7:** firm note — updated card or payment by date X keeps work on
  schedule.
- **Day 15:** pause-work notice: deliverables and ads management pause at day 30
  until current. Stated in the engagement terms at signing so it's policy, not
  punishment.
- **Day 30:** work pauses. **Day 60+:** offboard conversation (firing chronic
  non-payers is doctrine — pitch-pricing §5 walking-away rule applies after
  signing too).
- Dunning copy is templated once (it may pass three-kings, but tone is calm-
  administrative, not sales). Never let AR age silently because the chase feels
  awkward — the checklist makes it mechanical.

## 5. Hygiene rules

- **No commingling** — business accounts only, owner draws are draws, not
  expenses.
- Subscriptions audit quarterly: the SaaS/infra stack (Vercel, SendGrid, etc.)
  creeps; verify each line still maps to a paying client or a live product —
  and check billing reality against the dashboard, not assumptions (the Vercel
  bill was assumed ~$1000 and was actually ~$115–160; measure, don't repeat lore).
- Client-reimbursable purchases (domains, stock, etc.): on their card ideally;
  if fronted, invoiced same month at cost, documented.
- Sales-tax applicability of service lines: confirm with the accountant per
  state; don't assert from memory.

## 6. Mistakes (enforce as review checklist)

Work started before deposit + payment method on file · retainers invoiced
manually "when remembered" · ad spend passed through our accounts · autopay
failures discovered at close instead of at charge time · uncategorized
transactions carried forward · MRR dashboard disagreeing with QBO recurring
reality · unbilled scope absorbed silently · AR chased ad-hoc (or not at all) ·
1099/contractor tally deferred to January · guessing a transaction's category to
close faster · fired/offboarded clients still counted in MRR.

## Worked example

New Core-tier client signs mid-month: deposit invoice paid day 0 (build starts),
recurring invoice created for the 1st (Hosting & Care + Ads Management as
separate lines, autopay on the card from the accept flow), ad accounts on their
card per google-ads §2. First close: deposit categorized to Website/Build,
retainer to its two pillars, Stripe fee split out, MRR view +1 client with two
recurring lines — and the number in the Flight Deck matches QBO to the dollar.
