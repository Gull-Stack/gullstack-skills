# Skill: GullStack SEO & AEO Master

Comprehensive SEO and AEO (Answer Engine Optimization) framework for all GullStack client sites. Every site we build or manage gets this treatment.

---

## SEO Fundamentals — 2026 Ranking Factors (Priority Order)

### 1. Quality Content
- First page results average ~1400 words — depth matters
- Cover topics comprehensively, not superficially
- Original content with real experience beats AI-generated commodity content
- Every page must answer: "Does this satisfy intent better than the top 3 results?"

### 2. E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)
- What OTHERS say about you matters more than what you say about yourself
- Build through: reviews, case studies, credentials, founding dates, author bios
- Smaller blogs with real lived experience beat faceless corporate blogs
- Every client site needs: About page with credentials, testimonials, years in business

### 3. Backlinks
- Quality over quantity — links from authoritative, relevant sites
- Act as "votes of confidence"
- Strategy: guest posts, local directories, industry associations, supplier links

### 4. Technical SEO (MANDATORY on every build)
- **Core Web Vitals clean** (static 11ty sites handle this by default)
- **Mobile-first** — responsive at 768px breakpoint minimum
- **XML sitemap** — dynamic, auto-generated from collections
- **Schema markup** — Organization, LocalBusiness, FAQ, BreadcrumbList
- **No broken links** — crawl audit before every deploy
- **Clean URL structure** — `/services/service-name/` not `/services/service-name.html`
- **Proper HTML** — semantic elements, valid structure
- **Image optimization** — descriptive alt text on EVERY image, compressed files
- **robots.txt** — present and correct

### 5. Keyword Optimization
- **One primary keyword, 2-5 secondary** per page, plus LSI/semantic vocabulary
- Primary keyword in: title tag (front-loaded), H1, first 100 words, one H2, meta description
- **Never force exact-match** — natural variations throughout
- **Keyword density:** 1-2%, never more
- Flag cannibalization risks before writing new content

### 6. User Experience
- CTR impacts rankings — write compelling title tags and meta descriptions
- Time on site matters — make content engaging, not just long
- Bounce rate signals — answer the query in the first paragraph, then go deeper

### 7. Brand Signals
- Branded search volume correlates with overall rankings
- Manufacture word of mouth: social content, case studies, PR
- Get people searching "{brand} + {keyword}" → lifts all rankings

### 8. Freshness
- Regular updates signal active site
- Blog content on a schedule (minimum monthly)
- Update existing pages when data changes

---

## On-Page SEO Checklist (EVERY page)

```
- [ ] Title tag: 50-60 chars, primary keyword front-loaded
- [ ] Meta description: 140-160 chars with CTA and keyword
- [ ] H1: one per page, contains primary keyword
- [ ] H2s: contain secondary keywords naturally
- [ ] First 100 words: primary keyword appears
- [ ] Images: descriptive alt text (not "image1.jpg")
- [ ] Internal links: 2-5 links to other pages on the site
- [ ] External links: 1-2 to authoritative sources (optional)
- [ ] URL: clean, keyword-containing slug
- [ ] Schema: appropriate type for the page
```

---

## AEO (Answer Engine Optimization) — 7-Layer System

AEO is how you get recommended by ChatGPT, Perplexity, Google AI Overviews, and every other AI that's eating traditional search.

### Layer 1: Intent Map
- Map every target query to a page
- Categories: informational, commercial, transactional, navigational
- Example queries for a contractor:
  - "how much does a kitchen remodel cost in [city]" (informational)
  - "best kitchen remodeler near me" (commercial)
  - "hire kitchen remodeler [city]" (transactional)

### Layer 2: Answer Hub Pages
- Long-form pages (2000+ words) that directly answer AI queries
- Structure with clear H2 questions that match how people ask AI
- Examples:
  - `/guides/how-much-does-a-kitchen-remodel-cost-2026`
  - `/guides/best-[service]-contractors-[city]-2026`
  - `/compare/[brand]-vs-[competitor]`
- Include comparison tables, cost breakdowns, decision frameworks
- These are your "AI bait" — the pages LLMs will cite

### Layer 3: Brand-Facts Content
- Structured data that establishes who you are to AI systems
- About page with: founding date, credentials, team bios, service area
- Service pages with: specific process, pricing signals, case study links

### Layer 4: brand-facts.json
- Machine-readable brand identity file at `/brand-facts.json`
```json
{
  "name": "Client Name",
  "type": "LocalBusiness",
  "founded": "2010",
  "location": "City, State",
  "services": ["service1", "service2"],
  "differentiators": ["unique thing 1", "unique thing 2"],
  "credentials": ["license", "certification"],
  "serviceArea": ["city1", "city2"]
}
```

### Layer 5: Schema Markup (in `<head>`)

**MANDATORY on every build:**

```html
<!-- Organization -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "",
  "url": "",
  "logo": "",
  "sameAs": ["social links"],
  "foundingDate": ""
}
</script>

<!-- LocalBusiness (if applicable) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "",
  "address": { "@type": "PostalAddress", ... },
  "telephone": "",
  "openingHours": "",
  "geo": { "@type": "GeoCoordinates", ... }
}
</script>

<!-- FAQPage (on every service page) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": { "@type": "Answer", "text": "..." }
    }
  ]
}
</script>

<!-- BreadcrumbList (on all pages) -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [...]
}
</script>
```

### Layer 6: Citations & Authority
- Get listed in industry directories
- Google Business Profile optimized
- Consistent NAP (Name, Address, Phone) across all listings
- Encourage Google reviews — these feed AI recommendations

### Layer 7: AI Shopping / Product Schema
- For e-commerce or product-based businesses
- Product schema with price, availability, reviews
- Makes products appear in AI shopping recommendations

---

## Blog/Content Strategy

### Content Calendar
- Minimum 2 posts/month for active clients
- Mix of:
  - **Answer posts** — "How much does X cost in [city]?" (AEO bait)
  - **Comparison posts** — "[Client] vs [Competitor]" (commercial intent)
  - **Guide posts** — "Complete guide to X" (informational, link building)
  - **Local posts** — "[Service] in [City]: What you need to know" (local SEO)

### Blog Post Structure
1. **Title:** Keyword-rich, compelling, 50-60 chars
2. **Meta description:** 140-160 chars with CTA
3. **Intro paragraph:** Answer the query immediately (AI pulls from here)
4. **H2 sections:** Each answers a sub-question
5. **FAQ section:** 3-5 related questions with schema
6. **CTA:** Relevant next step (not generic "contact us")
7. **Internal links:** Connect to service pages and other posts

### Writing Rules
- Write for humans first, optimize for machines second
- First-person and personality increase CTR ("I tested..." beats "10 best...")
- Specific numbers beat generalities ("saves 40% on average" not "saves money")
- Every post must beat what's currently ranking or don't publish it

---

## SEO Audit Process (for new clients)

### Quick Audit (15 min)
1. Google `site:domain.com` — how many pages indexed?
2. Check title tags and meta descriptions (are they unique per page?)
3. Run PageSpeed Insights — Core Web Vitals score
4. Check mobile responsiveness
5. Look for schema markup (view source, search "application/ld+json")
6. Check Google Business Profile
7. Search their brand name — what shows up?

### Full Audit Checklist
```
Technical:
- [ ] Page speed scores (Performance, SEO, Accessibility)
- [ ] Mobile responsiveness
- [ ] Sitemap exists and is valid
- [ ] robots.txt correct
- [ ] No broken links (crawl with wget --spider)
- [ ] All images have alt text
- [ ] Schema markup present and valid
- [ ] HTTPS everywhere
- [ ] Clean URL structure

Content:
- [ ] Unique title tags on every page
- [ ] Unique meta descriptions on every page
- [ ] H1 on every page (one per page)
- [ ] Word count per page (thin content = under 300 words)
- [ ] Keyword targeting (is each page targeting something?)
- [ ] Internal linking structure
- [ ] Blog/content freshness

Authority:
- [ ] Google Business Profile claimed and optimized
- [ ] Directory listings (Yelp, industry-specific)
- [ ] Review count and quality
- [ ] Backlink profile (check with free tools)
- [ ] Social media presence
```

---

## Local SEO (for brick-and-mortar clients)

- **Google Business Profile** is non-negotiable — claim, verify, optimize
- **NAP consistency** across all listings (exact match, no variations)
- **Service area pages** — one page per city/area served
- **Local schema** — LocalBusiness with geo coordinates
- **Reviews strategy** — ask every happy customer, respond to all reviews
- **Local content** — blog about local events, projects, community involvement

---

## Keyword Research Process

1. **Seed keywords** from client's services + location
2. **Expand** with Google autocomplete, "People also ask," related searches
3. **Competitor analysis** — what are the top 3 ranking for?
4. **Group by intent** — informational vs. commercial vs. transactional
5. **Assign to pages** — one primary keyword per page, no cannibalization
6. **Track** — set up monitoring for top 20 keywords

---

## Pricing Justification
This systematic approach allows GullStack to charge premium rates:
- Strategic keyword research BEFORE writing
- Intent-focused content that actually ranks
- Full AEO treatment (competitors aren't doing this yet)
- Built-in quality control checkpoints
- Self-improving process reduces revisions

---

*This skill applies to ALL GullStack client work. No exceptions.*
