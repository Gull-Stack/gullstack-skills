---
name: pitch-pricing
description: Pitch, proposal, and pricing doctrine for GullStack — the 4-pillar productized offer, demo-not-document proposals (Walkthru Labs pattern), tiering and anchoring, close mechanics, pricing guardrails. Use when scoping, pricing, or building any client proposal or pitch.
---

# SKILL: Pitch, proposal & pricing

How GullStack structures and sells the offer. Written 2026-08. **[load-bearing]**
= deals die or margins bleed if wrong. Three Kings owns the *message* (how every
sentence lands); this skill owns the *offer* (what's for sale, at what structure,
closed how). Doctrine: **we sell the 4-pillar protocol as a product, not hours as
a commodity** — every pillar is a recurring-revenue layer toward the $50K/mo MRR
goal, so the offer is engineered for retainers, not projects.

## 1. The offer = the client protocol **[load-bearing]**

What we sell is the GullStack Client Engagement Protocol, in its fixed order
(`gullstack-client-onboard` runs the build; this skill sells it):
1. **Website overhaul** — the entry project. Never run ads into a weak site, so
   this is always first and always in scope. Project fee + hosting/care retainer.
2. **Branding** — surfaced proactively in every engagement (standing doctrine),
   usually bundled into pillar 1's fee rather than sold alone.
3. **Ads engine** (Meta + Google per those skills) — monthly management retainer.
   **Ad spend is always on the client's card, never marked up, never touched** —
   management fee and media are separate lines, stated plainly.
4. **Their own Flight Deck** — the ops dashboard (one name: "Flight Deck", never
   portal/HQ). The stickiest retainer: it becomes how they run the business.
The ladder is the retention model: each pillar makes the next natural and leaving
harder. Pitch the destination (all four), sell the on-ramp (pillar 1).

## 2. Pricing structure

- **Value-anchored flat pricing, never hourly [load-bearing].** Hours commoditize
  judgment and punish speed. Price the outcome; the internal floor check is
  margin, not the client-facing story.
- **The client-side math test:** the retainer should be covered by a small,
  believable number of new customers/month at the client's average ticket ×
  visits-per-year (analytics-reporting §8 math). If we can't say "2–3 new
  regulars a month pays for this," the price is wrong or the client is.
- **Three tiers, anchor high:** present the full protocol (all 4 pillars) first
  as the anchor, a core tier (site + ads) as the expected buy, a floor tier
  (site only) as the safety. Most buyers take the middle — build it to be the
  one we want.
- **Rates come from the current GullStack rate card (Josh), not from this skill**
  — structure is doctrine, numbers are business state. Proposals pull live rates.
- Discounting rule: **descope, never discount.** Price drops only when scope
  drops; otherwise the number was fiction and the client learns to wait us out.

## 3. Discovery → proposal

- Discovery runs the intake (`gullstack-client-onboard` INTAKE) and hunts the
  **concrete villain** — the specific bleeding problem in their words (empty
  Tuesday racks, leads that never call back, a site they're embarrassed to send
  people to). No abstract villains; the proposal names it back to them
  (SB7: the client is the hero, we're the guide).
- Everything stated in the proposal is **meeting-committed fact only** — nothing
  invented, no capabilities we haven't shipped, no numbers we can't defend
  (only-what-was-discussed doctrine; argus-qa fact rules apply to sales pages).
- Ship the proposal within 48h of discovery, while the conversation is warm.

## 4. The proposal is a demo, not a document **[load-bearing]**

The Walkthru Labs pattern (`Gull-Stack/walkthru-labs`): each proposal is a live
page at `/proposal/<slug>/` with an `/api/accept` endpoint — not a PDF.
- Lead with a **built sample**: their homepage rebuilt (or a section of it), their
  brand direction, a taste of their Flight Deck. Showing beats describing —
  the proposal itself demonstrates pillar-1 quality (and passes the site
  design standard; a sloppy proposal page contradicts the pitch).
- Structure: villain (theirs, named) → the plan (3 steps, SB7) → the built sample
  → tiers with the anchor first → one accept button.
- Copy passes `three-kings-salestalk` end to end: present tense, no questions in
  the close, directive CTA.
- **One CTA:** the accept button (with deposit/e-sign step behind it). No "let me
  know your thoughts."
- **Expiry date on every proposal** (2–3 weeks) — real, stated, enforced. Open-
  ended proposals train slow decisions.

## 5. Close mechanics

- Deposit before work starts — a signed proposal without money is a maybe.
- Objections loop through the Three Kings objection matrix (Belfort looping:
  answer, re-close). Price objection → descope to the floor tier, never shave.
- Two silent follow-ups max after sending (day 3 label + day 10 takeaway/expiry
  reminder), then it's dead until they revive it — chasing reprices us.
- Walking away is allowed and doctrine: wrong-fit clients cost more than they pay
  (we have fired clients before; better to not sign them).

## 6. Mistakes (enforce as review checklist)

Hourly rates or hour-counts anywhere client-visible · proposal as PDF/deck
instead of a live page · no built sample · abstract villain ("grow your
business") · claims beyond meeting-committed facts · ad spend marked up or
ambiguous · discounts without descope · no expiry · multiple CTAs · pitching
pillar features instead of the client's outcome · custom-scoping what the
protocol already productizes (bespoke = margin leak) · proposal page that
violates the design standard it's selling.

## Worked example

Retail client, discovery reveals the villain: "we're invisible — people drive
past us to the chain store." Proposal at `/proposal/<slug>/`: hero names the
villain, 3-step plan, their rebuilt homepage hero live in the page, tiers —
Full Protocol (anchor: site + brand + ads + Flight Deck retainer), Core (site +
ads retainer), Foundation (site + care plan). Math shown client-side: "at your
average ticket, X new regulars/month covers this." Accept button → deposit →
`gullstack-client-onboard` takes over the same week.
