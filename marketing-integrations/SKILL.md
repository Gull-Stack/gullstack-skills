# SKILL: Marketing Integrations — Cinch (action) + Flight Deck (reporting)

The master spec for wiring **every** marketing component through an API into GullStack's
two planes. Written 2026-07; access models verified then — API access gates (Google Ads
dev token, GBP allowlisting, Meta app review) change, so **re-verify per channel before
building**. **[load-bearing]** = breaks the integration or a contract if wrong;
*[approx.]* = ballpark, verify at build.

## 0. The two-plane model **[load-bearing]**

Every marketing channel gets wired into BOTH planes. They are different jobs — don't
collapse them.

- **Cinch** (`Gull-Stack/cinch-app`) = **ACTION plane.** Multi-tenant white-label SaaS;
  each tenant has a `marketing` module. Cinch *does things*: send email/SMS, capture &
  route leads, publish posts, launch/adjust campaigns, push offline conversions back.
- **Flight Deck** (`Gull-Stack/cw-flight-deck`) = **REPORTING plane.** Leadership BI
  dashboard (`/marketing` tab). Flight Deck *reads things*: spend, impressions, clicks,
  conversions, funnel, ROI — unified across channels.

**"Fully functional via API" = a channel is done only when BOTH are live end-to-end (not
mocked): at least one real Action verb in Cinch AND at least one real Report metric in
Flight Deck, tied to the same lead/attribution spine (§3).** A channel that only reports
is half-built; a channel that only acts is blind.

## 1. Master matrix

Legend: ✅ API exists & fits · ⚠️ API exists but gated/partial · 🛑 no usable API (manual).

| Channel | API | Auth **[load-bearing]** | Cinch ACTION | Flight Deck REPORT | Access status |
|---|---|---|---|---|---|
| **Meta Ads** (FB/IG) | Marketing API + Conversions API | System-user token; `ads_management` (act) / `ads_read` (report); app review for advanced | Create/adjust campaigns, audiences, push offline conversions (CAPI) | Insights: spend, impressions, CPL, ROAS | ✅ Flight Deck needs `act_…` + token (see §5) |
| **Google Ads** | Google Ads API | Manager acct **developer token** (Basic = 15k ops/day, ~3 biz days) + OAuth | Campaigns, budgets, keywords, offline conversion import | Metrics: spend, impr, clicks, conv | ⚠️ Apply for dev token |
| **Google Analytics 4** | Data API (report-only) | Service acct as **Viewer** on property | — (report-only) | Sessions, engagement, conversions, top-of-funnel | ⚠️ Needs GA4 property ID + SA viewer (see §5) |
| **Google Search Console** | Search Analytics API (report-only) | OAuth / service acct, site verified | — (report-only) | Impressions, clicks, queries, position → feeds `seo-master` | ✅ Low-friction |
| **Google Business Profile** | Business Profile APIs | OAuth; **allowlist request** (GBP ≥60 days old + verified; days–weeks) | Posts, review replies, Q&A, hours/attributes | Performance API: calls, direction requests, searches | ⚠️ Submit access form; 300 rpm default, **10 edits/min/listing hard cap** |
| **Reddit** | Data API + Ads API | Script-app OAuth (`oauth.reddit.com`, 1h token) | Listen, organic post/comment; ads via partner | Mentions, subreddit signal; ad metrics | ⚠️ Self-serve closed; see `reddit-api/SKILL.md` |
| **Email** | SendGrid (Cinch already uses) | API key per tenant | Send campaigns/transactional, templates, lists | Event Webhook + Stats API: opens, clicks, bounces | ✅ In place; wire report side |
| **SMS** | Twilio *[verify provider]* | Account SID + token per tenant; consent required | Send SMS (member SMS consent gated) | Status callbacks + Messaging Insights: delivery | ✅ Consent model exists in Cinch |
| **CRM / attribution spine** | Salesforce REST/Bulk | Connected app OAuth | Cinch writes leads + offline conversions | Funnel, funded $, campaign ROI (already live) | ✅ Flight Deck reads it today |
| **Radio · Seminars · Referral · Federal** | 🛑 none | — | Manual booking; log spend/attribution in Cinch/SF | Manual/CSV upload w/ promo code + "how'd you hear" | 🛑 Don't wait on an API — standardize the manual path (§4) |

Future channels (TikTok/LinkedIn/YouTube Ads) follow the same two-plane pattern — add
per client demand, don't pre-build.

## 2. Per-channel contract (what "wired" means)

For each channel, the integration owner must deliver all four:
1. **Auth artifact** — the token/service-account/dev-token, stored per §6, with refresh
   handled (never a hardcoded 1-hour token).
2. **Cinch action** — at least one real verb callable from the tenant `marketing` module,
   tagged with source/medium/campaign so it lands on the attribution spine.
3. **Flight Deck metric** — at least one real metric replacing a mock, with a calc
   tooltip showing its formula (Flight Deck UX rule — derived numbers must show their
   math or they get "Air-Leak" tested).
4. **Attribution tie** — the action and the metric resolve to the **same lead/campaign
   record** (§3), so ROI is real, not two disconnected numbers.

## 3. The attribution spine **[load-bearing]**

The whole point of two planes is closing the loop: an action in Cinch → an outcome in
Flight Deck, on one record. This only works if attribution is disciplined:
- **UTM on everything Cinch emits** — every email/SMS/ad link/GBP post carries
  `source/medium/campaign`. No UTM = invisible in Flight Deck.
- **One lead identity** — a lead captured by Cinch and a conversion in Salesforce must
  key to the same person (email/phone). Cinch writes leads to SF (or is the system of
  record) so Flight Deck's funnel already sees them.
- **Offline conversions flow back** — money that closes offline (member signs up, deal
  funds) is pushed to the ad platforms (Meta CAPI, Google offline conversion import) so
  ROAS is true, not just last-click. This is the meta-ads offline-measurement lesson,
  generalized to every paid channel.
- **58-campaign lesson (Flight Deck handoff):** campaigns missing `BudgetedCost` render
  ROI wrong. Cost data is part of "wired," not an afterthought.

## 4. Offline channels are a real integration, just not an API

Radio, seminars, referral, and federal (Capital Wealth's non-digital channels) have **no
API** — do not leave them as a gap waiting on one. "Wired" for them means a **standard
manual path**: a Cinch intake for spend + a promo code / "how did you hear about us"
field on the lead, uploaded to Salesforce so Flight Deck ranks them in the same
channel-mix and CPL view as the digital ones. An unmeasured channel loses budget fights
it might deserve to win.

## 5. Near-term unblocks (already identified, do these first)

Flight Deck's marketing surfaces are live on Salesforce; **two connectors are the last
mocks** and each needs one credential:
- **GA4:** the property ID (`properties/123…`) + confirm the app service account is a
  **Viewer** on the property → top-of-funnel rungs go live.
- **Meta:** the ad-account ID (`act_…`) + a system-user token with `ads_read` → ad
  spend/impressions go live.

These two are the fastest "fully functional" wins on the reporting plane — no code
blockers, just credentials. Get them before opening new channels.

## 6. Cross-cutting: multi-tenant credentials & secrets **[load-bearing]**

- **Cinch is multi-tenant white-label** → channel connections are **per-tenant**, not
  global. Each tenant's OAuth tokens, ad-account IDs, and API keys are stored per-tenant
  and encrypted. A tenant only ever acts on its own accounts.
- **Secrets live in the platform env / a secret manager, never in the repo.** System-user
  tokens (Meta), service-account JSON (Google), Twilio/SendGrid keys, Salesforce
  connected-app secrets — all rotated, none committed.
- **Token lifetimes differ** — Reddit bearer = 1h; Meta system-user = long-lived; Google
  = refresh-token flow. The integration layer refreshes; callers never see expiry.
- **Access gates are lead-time, not build-time** — GBP allowlisting and Google Ads dev
  tokens take days to weeks. Submit those applications *first*, in parallel, so approval
  isn't the critical path.

## 7. Recommended build order

1. **Close the two in-flight Flight Deck connectors** (GA4 + Meta Insights) — §5, credentials only.
2. **Submit the slow access applications now** (Google Ads dev token, GBP allowlist) so they approve while you build.
3. **Google stack** (Search Console → GBP → Google Ads) — highest value for local/retail clients (`seo-master`, `retail-resale-marketing`).
4. **Cinch action channels** already half-built — finish Email (SendGrid) + SMS (Twilio) report sides so send→open/deliver closes the loop.
5. **Reddit** — listening first (`reddit-api/SKILL.md`), ads later.
6. **Offline channels** — standardize the manual attribution path (§4).

Definition of done for the whole program: every row in §1 is ✅ on both planes, sharing
one attribution spine — nothing mock, nothing act-only, nothing report-only.

---

### Sources (verified 2026-07)

- [Meta Marketing API — access levels & app review](https://developers.facebook.com/docs/marketing-api/overview/authorization)
- [Google Ads API developer token / access levels](https://developers.google.com/google-ads/api/docs/api-policy/access-levels)
- [Google Analytics Data API (GA4)](https://developers.google.com/analytics/devguides/reporting/data/v1)
- [Google Search Console API — Search Analytics](https://developers.google.com/webmaster-tools/v1/searchanalytics/query)
- [Google Business Profile APIs — prerequisites & access request](https://developers.google.com/my-business/content/prereqs)
- [Google Business Profile APIs — limits (300 rpm, 10 edits/min/listing)](https://developers.google.com/my-business/content/limits)
- [SendGrid Mail Send + Event Webhook](https://www.twilio.com/docs/sendgrid/api-reference/mail-send/mail-send)
- [Twilio Programmable Messaging API](https://www.twilio.com/docs/messaging/api)
- [Salesforce REST API](https://developer.salesforce.com/docs/atlas.en-us.api_rest.meta/api_rest/)
- Reddit: see `reddit-api/SKILL.md` (Data API + Ads API, verified 2026-07)
