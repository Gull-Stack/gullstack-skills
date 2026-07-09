# SKILL: Reddit API for GullStack

How to get a programmatic "API into Reddit" for client work — monitoring, content
research, organic engagement, and paid ads. Written 2026-07; platform facts verified
then (Reddit changed its API terms hard in 2023 and locked self-serve signup in late
2025, so **re-verify before quoting anyone a number**). **[load-bearing]** = will
break access or the contract if wrong; *[approx.]* = community-reported, not an
official rate card.

## 0. TL;DR — there are TWO Reddit APIs, don't confuse them

| | **Data API** | **Ads API** |
|---|---|---|
| Purpose | Read/write posts, comments, search, monitor | Create/manage/measure paid campaigns |
| Base | `https://oauth.reddit.com` | Reddit Ads API (partner program) |
| Who it's for | Listening, research, bots, organic posting | Advertisers + adtech partners |
| Access in 2026 | Approval required; self-serve signup **closed** | Apply as partner, or via managed rep |
| Cost | Free tier for non-commercial; **commercial = contract** | Tied to ad spend, not per-call |

For most of what GullStack wants (listening + content research) you need the **Data
API**. For running client campaigns programmatically you need the **Ads API**. They
have separate approval tracks.

## 1. Access reality in 2026 **[load-bearing]**

- **Self-service registration closed in late 2025.** You can no longer just spin up a
  key and go at any scale. Free/low-volume OAuth clients still work once approved, but
  serious use goes through review.
- **Commercial use requires a contract.** Anything monetized — a client deliverable, a
  paid dashboard, an app with ads/paywall, resale of data — is "commercial" in Reddit's
  eyes and requires prior approval. Review runs **~2–4 weeks with no guarantee** *[approx.]*.
- **Non-commercial** (personal projects, academic research) keeps the free tier.
- The honest read for an agency: a GullStack *internal* listening/research tool for our
  own strategy sits in a grey zone; a *productized* client-facing data service is
  squarely commercial and needs the enterprise conversation. When in doubt, assume
  commercial and talk to Reddit before building on it.
- **Do not scrape as a workaround for a client deliverable.** It violates Reddit's terms,
  breaks without notice, and is not something we put our name on. If the API path is
  blocked for a use case, that's a signal to reconsider the use case — not to scrape.

## 2. App types + OAuth **[load-bearing]**

Register at `https://www.reddit.com/prefs/apps` → "create an app". Pick the type by
where the code runs — it decides your auth flow:

- **script** — runs on hardware you control (our server/laptop). Simplest grant
  (password grant, no redirect). **This is what we want for listening + research bots.**
  Confidential (gets a secret).
- **web app** — server you control, acting *on behalf of Reddit users* (they click
  "allow"). Classic 3-legged OAuth redirect flow. Only needed if a client's own Reddit
  users authorize us. Confidential.
- **installed app** — runs on devices we don't control (mobile). Cannot keep a secret,
  so it gets none. Rarely relevant to us.

Auth mechanics that trip people up:
- Make API calls against **`https://oauth.reddit.com`**, NOT `www.reddit.com`. **[load-bearing]**
- **Bearer tokens expire after 1 hour** — refresh them; don't hardcode.
- Always send a **unique, descriptive `User-Agent`** (e.g.
  `gullstack-listening/1.0 by u/ourbotaccount`). Generic/missing UA gets throttled
  harder and can get you blocked. **[load-bearing]**

## 3. Rate limits **[load-bearing]**

- Free tier: **100 queries/minute per OAuth client ID**, averaged over a 10-minute
  window (so short bursts are fine). Practical sustained throughput is ~60 req/min.
- Reddit tells you your budget in response headers: `X-Ratelimit-Remaining` and
  `X-Ratelimit-Reset`. Build reactively — when remaining gets low, pause until reset.
- On `429 Too Many Requests`: exponential backoff. Cache aggressively; batch where you
  can (fetch listings, not one item at a time).

## 4. Pricing (commercial) *[approx.]*

- No public rate card. You contact enterprise sales, describe the use case, pass a
  review, then get a custom quote.
- Community-reported commercial rate is **~$0.24 per 1,000 API calls** *[approx.]* — treat
  as a planning ballpark only, not a committed number. At 100 QPM sustained that's
  ~$0.24 × 6,000/hr ≈ a real line item; **model cost against your call volume before
  proposing a productized service.**

## 5. Ads API (paid campaigns) — parallels meta-ads

- The Ads API is how you'd create/manage/optimize/measure **Reddit paid campaigns**
  programmatically — the Reddit analog to what `meta-ads/SKILL.md` covers manually.
- Access paths: (a) apply to the **partner program** as a developer, (b) managed
  advertisers request partnership approval via their Reddit Ads rep, (c) API partners
  acting on behalf of advertisers submit a support request.
- It launched via a small **alpha partner cohort (adMixt, PMG, Sprinklr, VidMob)** and
  has been opening up since. Capabilities: automate/scale/optimize spend, measure
  creative efficacy.
- **For GullStack's current scale, start in the Reddit Ads *UI*, not the API.** The API
  earns its keep once we're managing enough Reddit spend across clients that manual
  campaign ops is the bottleneck. Until then it's overhead. (Same lesson as meta-ads:
  one funded, well-run campaign beats tooling for tooling's sake.)

## 6. Practical tooling

- **Python: PRAW** (`pip install praw`) is the standard wrapper. Handles auth, token
  refresh, pagination, and rate limiting automatically — no manual `sleep()` needed if
  you set a proper user agent. Best default for our listening/research scripts.
- **Node/other:** thin OAuth + `fetch` against `oauth.reddit.com` works, but you own the
  token-refresh and backoff logic yourself.
- Minimum viable read stack: script app creds → get bearer token → hit
  `/r/{sub}/search`, `/r/{sub}/comments`, `/search` → respect the rate headers → cache.

## 7. Mapping to GullStack use cases

| Use case | API | Approach | Verdict |
|---|---|---|---|
| **Brand/mention monitoring** | Data API (script + PRAW) | Poll `/search` for client/brand/keyword across relevant subs; cache; alert | ✅ Highest-value, lowest-lift. Start here. |
| **Content/SEO research** | Data API (script + PRAW) | Mine target subs for recurring questions + real customer language → feeds `seo-master` intent maps | ✅ Strong. Internal research = grey-zone-but-defensible. |
| **Organic posting/engagement** | Data API (script or web app) | Automating posts risks looking spammy + Reddit-community backlash; do sparingly, human-in-loop | ⚠️ Handle with care; reputation risk > API risk. |
| **Client-facing data product** | Data API (commercial) | Requires enterprise contract + cost modeling (§4) | 🛑 Don't build until the contract + unit economics are real. |
| **Paid campaigns at scale** | Ads API | Partner application; parallels meta-ads | ⏳ Later. Run in the Ads UI first. |

## 8. Recommended next step

For a first, concrete "API into Reddit": stand up a **script-type app + PRAW listening
prototype** for one client — poll a handful of relevant subreddits for brand + category
keywords, cache results, respect the rate headers. It's non-commercial-shaped, ships in
a day, proves value, and tells us whether the commercial/contract conversation is even
worth starting. Everything else (ads API, productized dashboards) is a decision to make
*after* that prototype shows real signal.

---

### Sources (verified 2026-07)

- [Reddit API Pricing 2026 — Octolens](https://octolens.com/blog/reddit-api-pricing)
- [Reddit Data API 2026: Lockdown, Approval, Rate Limits — redditapis.com](https://www.redditapis.com/blogs/reddit-data-api-2026)
- [The Reddit API in 2026: Pricing, Rate Limits — SocialCrawl](https://www.socialcrawl.dev/blog/reddit-data-api-2026)
- [Reddit API Limits — Data365](https://data365.co/blog/reddit-api-limits)
- [OAuth2 — reddit-archive wiki (app types, oauth.reddit.com, token expiry)](https://github.com/reddit-archive/reddit/wiki/oauth2)
- [Reddit API Authentication 2026 — redditapis.com](https://www.redditapis.com/blogs/reddit-api-authentication-oauth-2026)
- [PRAW Ratelimits docs](https://praw.readthedocs.io/en/stable/getting_started/ratelimits.html)
- [praw on PyPI](https://pypi.org/project/praw/)
- [About the Reddit Ads API — Reddit Ads Help](https://business.reddithelp.com/s/article/Reddit-Ads-API)
- [Reddit Ads API alpha partners — Social Media Today](https://www.socialmediatoday.com/news/Reddit-Announces-First-Ads-API-Partners/635195/)
