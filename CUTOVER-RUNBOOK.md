# Cutover Runbook — GullStack infrastructure → Walk Through Labs

Ordered, no-downtime sequencing for the operational transfer (Phase 4 of `501C3-MIGRATION.md`). **Precondition:** the nonprofit exists (articles filed, EIN issued, bank account open) and the asset assignment covering each account has been executed — don't move platform ownership before the entity legally owns it.

Each step lists its verification gate. Do not proceed past a failed gate.

## Step 0 — Freeze inventory

- [ ] Export the full list: registrar domains, GitHub org repos, Vercel projects + env vars, SendGrid senders/API keys, Meta Business Manager assets (pages, pixels, ad accounts), GA4 properties
- [ ] Snapshot DNS zones for every domain before touching anything

## Step 1 — New domain first (nothing breaks if this fails)

- [ ] Register the Walk Through Labs domain **in the nonprofit's registrar account** (check availability for `walkthroughlabs.org` / `.com`; prefer `.org` as primary for a c3)
- [ ] Stand up a minimal site (mission, determination-letter status, contact) so SendGrid domain verification and client-facing links have a destination
- **Gate:** new domain resolves with valid TLS

## Step 2 — Email/SendGrid (highest breakage risk — lead routing)

- [ ] Verify the new domain in SendGrid (SPF, DKIM, DMARC records)
- [ ] Create `leads@` on the new domain; add as a verified sender
- [ ] Update `/api/contact.js` on ONE low-traffic client site to send from the new address; submit a test lead; confirm client notification + auto-reply both arrive and pass DMARC
- **Gate:** test lead round-trips clean on the pilot site
- [ ] Roll the sender change across remaining client sites; keep `leads@gullstack.com` alive as a receiving alias for 12+ months
- [ ] Update `DEPLOYMENT-CHECKLIST.md` (form-handler line) once rollout completes

## Step 3 — GitHub

- [ ] Transfer org/repo ownership to the nonprofit's GitHub org (or rename `Gull-Stack` → the new org name). GitHub redirects old slugs, but:
- [ ] Re-check every Vercel project's Git integration afterward — Vercel connections can detach on org transfer
- [ ] Update `README.md` links (`gullstack-brain`, `Argus`) after the rename
- **Gate:** push a trivial commit to one client repo and confirm Vercel auto-deploys

## Step 4 — Vercel / hosting

- [ ] Transfer the Vercel team to nonprofit ownership; update billing to the nonprofit's card/bank
- [ ] Confirm all env vars (SENDGRID_API_KEY etc.) survived the transfer
- **Gate:** every Tier-1 client site loads and its contact form submits (run `DEPLOYMENT-CHECKLIST.md` post-deploy section on each)

## Step 5 — gullstack.com redirect

- [ ] 301-redirect `gullstack.com` → new domain (path-preserving), keeping MX records live for the legacy inbox
- [ ] Keep the redirect ≥ 24 months for SEO equity transfer; register the new domain in Google Search Console and file a change-of-address
- **Gate:** old URLs 301 to equivalent new URLs; legacy email still delivers

## Step 6 — Meta / GA4 / misc

- [ ] Transfer Meta Business Manager ownership; confirm pixels and ad accounts intact (client campaigns must not pause)
- [ ] Transfer GA4 property ownership; add nonprofit admins before removing old ones
- [ ] Apply for **Google for Nonprofits** (Workspace, Ad Grants) and **GitHub for Nonprofits** once the determination letter arrives
- [ ] Update client-site footers to the `wtl-credit` block (`site-builder/SKILL.md`), batched with each site's next regular deploy

## Step 7 — Close out

- [ ] Update bot workspaces (Melvin, Bogey, Jackie) with rebranded skills
- [ ] Sweep for stragglers: `grep -ri gullstack` across all repos; remaining hits should only be intentional legacy identifiers
- [ ] Mark Phase 4 complete in `501C3-MIGRATION.md`

## Rollback notes

Steps 1–4 are individually reversible (re-point DNS, revert sender, transfer back). Step 5 (redirect) is the commitment point for SEO — don't start it until Steps 2–4 gates have all passed and held for a week.
