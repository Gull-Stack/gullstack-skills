# MANDATORY DEPLOYMENT CHECKLIST

*After D One Builders emergency - NEVER deploy without verification*

## Before ANY Client Site Deployment

### Pre-Deployment Repository Check
- [ ] **Single build system only** (no Next.js + 11ty hybrid configs)
- [ ] **Correct directory structure** (verify Vercel deploys from right location)
- [ ] **Images copied to build directory** (check _site/, dist/, or public/)
- [ ] **11ty passthrough paths correct** (verify .eleventy.js points to actual image locations)
- [ ] **Build command works locally** (`npm run build` succeeds)
- [ ] **Project images in _site** (check _site/projects/ has actual image files, not just directories)

### Post-Deployment Verification (MANDATORY)
- [ ] **Live URL loads** (visit actual domain, not Vercel preview)
- [ ] **Homepage displays correctly** (layout, images, text)
- [ ] **Images work** (hero images, gallery, project photos)
- [ ] **Navigation works** (all main menu items clickable)  
- [ ] **Internal links work** (click "View project" and similar links - NO 404s)
- [ ] **Contact form submits** (test with dummy data if applicable)
- [ ] **Mobile view** (check responsive design)
- [ ] **404 check** (random URL should show proper 404 page)

### Automated Crawl Audit (MANDATORY — added 2026-03-01)
- [ ] **Broken link scan** — crawl every internal link, confirm 200 status (use `wget --spider` or Screaming Frog)
- [ ] **Broken image scan** — verify every `<img src>` resolves (no 404 images)
- [ ] **Sitemap validation** — every URL in sitemap.xml returns 200, no orphan entries
- [ ] **Title + viewport tags** — every page has `<title>` and `<meta name="viewport">`
- [ ] **Structured data validation** — run JSON-LD through schema.org validator, no invalid @types
- [ ] **Canonical URLs correct** — no self-referencing errors or wrong domains

**Trigger:** D One Builders had 6 broken project links, 4 broken images, wrong sitemap URLs, 3 pages missing meta tags, and invalid structured data — all shipped to production undetected until Semrush crawled it.

### Contact Form Verification (MANDATORY)
- [ ] **Form handler exists** — `/api/contact.js` with SendGrid integration (from: leads@gullstack.com)
- [ ] **SENDGRID_API_KEY** env var set on Vercel project
- [ ] **Form submits successfully** — test with real data, confirm email received
- [ ] **Auto-reply sent** — lead gets confirmation email
- [ ] **Notification sent** — client gets lead notification email
- [ ] **Spam protection** — honeypot field + timing check in place

### Documentation Required
- [ ] **Screenshot saved** (working homepage for reference)
- [ ] **URL verified** (confirm correct domain points to new deployment)
- [ ] **Client notified** (if major update/redesign)

## High-Risk Deployment Red Flags

**STOP AND FIX IMMEDIATELY:**
- Site shows "404" or "Default Vercel Page"
- Hero images missing or broken  
- Contact form returns server errors
- Navigation completely non-functional
- Mobile view completely broken
- Site loads but shows old content

## Client Tier Priorities

### Tier 1 ($500+/month) - CRITICAL
- **Extra verification required**
- **Test 5+ pages minimum**
- **Screenshot before/after deployment**  
- **Same-day fix if issues found**

Current Tier 1: D One Builders ($850), Osborne Electric, Peterson Zeyer Law

### Tier 2 ($100-499/month) - HIGH  
- **Standard checklist required**
- **Test 3+ pages minimum**
- **48-hour fix window for issues**

### Tier 3 (<$100/month) - MEDIUM
- **Basic checklist required** 
- **Homepage + contact page minimum**
- **Weekly fix window for non-critical issues**

---

**Created:** 2026-02-22  
**Trigger:** D One Builders emergency (broken images, wrong build system)  
**Rule:** NO EXCEPTIONS - This checklist is mandatory for ALL deployments