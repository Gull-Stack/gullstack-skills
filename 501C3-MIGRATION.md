# GullStack → Walk Through Labs: 501(c)(3) Migration

**Goal:** Legally move everything in GullStack over to a 501(c)(3) nonprofit — **Walk Through Labs** — whose mission is helping save businesses from malicious AI (AI-enabled fraud, impersonation, scam sites, manipulated search/answer-engine presence, and related harms).

> **This document is a working checklist, not legal advice.** Forming a 501(c)(3) and transferring an operating business's assets into it has real tax and legal consequences. Engage a nonprofit attorney and a CPA before executing the transfer steps. Items below marked ⚠️ are the ones most likely to blow up the exemption if done wrong.

---

## Draft legal package (ready for attorney review)

Execution-ready drafts live in [`legal/`](legal/); each needs attorney review, the blanks filled, and signatures — nothing is filed or executed yet:

| Draft | Covers |
|---|---|
| `legal/articles-of-incorporation-DRAFT.md` | Utah nonprofit articles with 501(c)(3) purpose + dissolution clauses |
| `legal/bylaws-DRAFT.md` | No-member board-governed structure, §4958 compensation procedure |
| `legal/conflict-of-interest-policy-DRAFT.md` | IRS sample-policy based |
| `legal/board-resolutions-DRAFT.md` | Organizational consent: officers, EIN, 1023 authorization, asset acceptance |
| `legal/ip-assignment-agreement-DRAFT.md` | GullStack → Walk Through Labs asset transfer, with exclusions + consent schedule |
| `legal/form-1023-narrative-DRAFT.md` | Part IV narrative of activities with exempt-purpose framing |

## Phase 1 — Form the nonprofit entity

- [ ] Incorporate **Walk Through Labs** as a nonprofit corporation in the home state (likely Utah, given operations) — *draft articles ready in `legal/`*
  - Articles of incorporation must include an IRS-compliant **purpose clause** (exclusively charitable/educational purposes under §501(c)(3)) and a **dissolution clause** (assets go to another 501(c)(3) on dissolution)
  - Draft mission language: *"Walk Through Labs protects small businesses from malicious and deceptive uses of artificial intelligence — through education, free and low-cost defensive tooling, and direct remediation help for businesses harmed by AI-enabled fraud, impersonation, and manipulation."*
- [ ] Obtain an **EIN** for the new entity (IRS Form SS-4 / online)
- [ ] Adopt **bylaws**
- [ ] Seat a board of directors — **3+ directors recommended, majority unrelated** (not family/business partners); related-party boards are a red flag on Form 1023
- [ ] Adopt a **conflict-of-interest policy** (the 1023 asks for it)
- [ ] Hold the organizational board meeting; document minutes

## Phase 2 — Federal tax exemption

- [ ] File **IRS Form 1023** (or **1023-EZ** only if projected annual gross receipts ≤ $50k for 3 years AND total assets ≤ $250k — receiving GullStack's assets and revenue almost certainly disqualifies the EZ route)
- [ ] Describe programs in charitable terms: education for business owners, published playbooks/tooling (this repo becomes open program material), free/sliding-scale remediation for victimized businesses
- [ ] Budget/projections for 3 years
- [ ] After determination letter: state income-tax exemption, state **charitable solicitation registration** (required before fundraising), and sales-tax exemption where applicable

## Phase 3 — Asset transfer from GullStack ⚠️

Inventory of what "everything in GullStack" actually is, and how each piece moves:

| Asset | Transfer instrument | Notes |
|---|---|---|
| This repo + `gullstack-brain` + templates + ~200 client/demo repos | Written **IP assignment** from GullStack (or its owner) to Walk Through Labs | Consider licensing the playbooks openly (e.g., CC BY-NC) — strengthens the educational-purpose story |
| SuperTool, platos-pos, platoswallet code | IP assignment | ⚠️ Only if mission-aligned; see Phase 5 |
| Domains (`gullstack.com`, client-adjacent domains) | Registrar transfer to the nonprofit's account | Keep `gullstack.com` redirecting to the new domain for SEO continuity |
| Trademarks / brand | Assignment; file new mark for "Walk Through Labs" | |
| Client contracts | **Assignment + client consent** (most service contracts require notice or consent to assign) | ⚠️ See Phase 5 — ongoing paid agency work inside a c3 is constrained |
| Cash, equipment, accounts | Donation or bill of sale | A **donation** of appraised assets may yield a charitable deduction for the current owner — CPA question |
| Vercel / SendGrid / Meta Business / GA4 accounts | Ownership transfer within each platform | Sequence carefully so live client sites and lead routing never break |

- [ ] Get assets **valued/appraised** before transfer (needed for the deduction and for the 1023's financial disclosures)
- [ ] Decide donation vs. sale for each asset class with the CPA
- [ ] Execute assignments in writing, board-approved on the nonprofit side

## Phase 4 — Operational cutover (repo/infra checklist)

- [x] Rebrand prose in this repo: GullStack → Walk Through Labs *(done in this branch)*
- [ ] Rename GitHub orgs/repos (`Gull-Stack`, `StrongestAvengerStack/gullstack-brain`) — GitHub auto-redirects old slugs, but update docs after renaming
- [ ] Stand up the Walk Through Labs domain; 301-redirect `gullstack.com`
- [ ] Verify new domain in SendGrid; migrate sender from `leads@gullstack.com`; then update `DEPLOYMENT-CHECKLIST.md` and `/api/contact.js` handlers on client sites
- [ ] Update client-site attribution footers (`site-builder/SKILL.md` — new `wtl-credit` block)
- [ ] Update bot workspaces (Melvin, Bogey, Jackie) with the rebranded skills
- [ ] New brand assets, email signatures, invoicing entity

## Phase 5 — Things a 501(c)(3) cannot simply absorb ⚠️

Flag these for counsel **before** filing — they shape what "everything" can legally mean:

1. **Paid agency work is likely unrelated business income (UBIT).** Building marketing websites for paying clients at market rates doesn't automatically further a charitable purpose. Too much of it can cost the exemption. Options: keep fee-for-service work in a taxable subsidiary owned by the nonprofit; or restructure services so they demonstrably serve the mission (free/sliding-scale for qualifying small businesses, published educational materials).
2. **Plato's Closet (~$1.3M/yr retail) and other for-profit ventures almost certainly should NOT move into the c3.** A franchise thrift store is an unrelated trade or business; holding it inside the nonprofit risks the exemption. A taxable subsidiary — or leaving it outside entirely — is the standard structure.
3. **No private inurement.** Founders/insiders can be paid *reasonable* salaries, but can't extract profits, above-market rents, or sweetheart asset deals from the nonprofit. Every insider transaction needs board approval with the interested party recused.
4. **Mission fit must be real.** The IRS approves purposes, not vibes. "Saving businesses from malicious AI" works as education, published defensive tooling, research, and remediation assistance for harmed businesses — the programs described in the 1023 must match what the org actually does.

---

**Status:** Repo-side rebrand (Phase 4, first item) and the full draft legal package are complete on branch `claude/goldstack-501c3-migration-4v0l9a`. Next actions are human-only: engage nonprofit counsel + CPA to review the drafts, fill in registered agent / directors / assignor-entity blanks, sign, and file the articles — then EIN, bank account, and Form 1023 in that order.
