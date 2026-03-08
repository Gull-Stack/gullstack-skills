# Website Conversion Playbook
**Last Updated:** 2026-02-12
**Sources:** Julian Shapiro, Demand Curve, Refactoring UI, Josh Comeau, StoryBrand

---

## The Core Formula
```
Conversion Rate = Desire - (Labor + Confusion)
```
Every decision should either **increase desire** or **decrease friction**.

---

## Landing Page Structure (Follow This Order)

### 1. Navbar
- 2-4 links max + primary CTA
- Fewer links = less analysis paralysis
- Primary action should have greatest visual emphasis

### 2. Hero (Above-the-Fold)
This is make-or-break. Nail this or nothing else matters.

**Header Rules:**
- ❌ "Improve your workflow!" (slogan = bad)
- ✅ "Groceries delivered in 1 hour" (specific = good)
- **Litmus Test:** If they read ONLY this, will they know exactly what you sell?

**Header Formula:**
1. Find your value prop (what bad alternative do people use without you?)
2. Add a hook:
   - **Bold claim:** "Learn a language in 5 minutes a day"
   - **Objection handling:** "No coding required"

**Subheader:**
- [What it is] + [How the claim is achieved]
- 1-2 sentences max
- Example: "A platform for growing startups through expert-led courses and community coaching."

### 3. Social Proof
- Press logos OR well-known customer logos
- Create FOMO — make visitors feel left out
- If no logos yet: give product free to people at recognizable companies

### 4. Features Section
Each feature contains:
1. **Header** — Blunt value prop (no "Empower your sales" garbage)
2. **Paragraph** — Explain + handle objections
3. **Image** — Show product in action (GIFs > static, blur irrelevant text)

**Running Narrative Rule:** Each feature ties back to the hero's promise.

### 5. CTAs
- **Good:** "Find food", "Start learning" (continues the narrative)
- **Bad:** "Submit", "Request a meeting" (generic/vague)

**Rule:** CTA = actionable next step to fulfilling the header's claim

### 6. Footer
- Miscellaneous links
- Repeat CTA if page is long

---

## Visual Design Rules

### Typography Hierarchy (NOT by size)
Use **color + weight**, not size:
- **Dark (not black):** Primary content
- **Grey:** Secondary content  
- **Light grey:** Ancillary content

Weights:
- **Normal (400-500):** Most text
- **Bold (600-700):** Emphasis only
- ❌ Never use weights under 400 in UI

### Button Hierarchy
```
Primary   → Solid, high contrast (the main action)
Secondary → Outline or low contrast (clear but not prominent)
Tertiary  → Links (discoverable but unobtrusive)
```
Destructive actions are NOT always red. Only use red when destruction is the PRIMARY action.

### Shadows (The Three Rules)
1. **Consistent light source** — Same offset ratio on every shadow (e.g., vertical always 2x horizontal)
2. **Layer shadows** — Stack 3-5 shadows with different offsets for realism
3. **Match shadow color to background** — Don't use grey on colored backgrounds

**Elevation Variables (change together):**
- Higher elevation → larger offset
- Higher elevation → larger blur
- Higher elevation → lower opacity

### Borders Are Overused
Before adding a border, try:
1. Box shadow
2. Different background colors
3. More spacing

### Icons
- Don't blow up 16-24px icons to 3x size (they look chunky)
- Wrap small icons in shapes with background colors
- Or use premium large icon sets (Heroicons, Iconic)

### Accent Borders
Add colorful borders to bland UI:
- Side of alert messages
- Active navigation items
- Top of entire layout

---

## Real Photos vs Stock

### The Rule
**Real photos > stock photos > no photos**

Real photos of:
- Your actual product
- Your actual customers (with permission)
- Your actual team
- Your actual office/workspace

### Placeholder Protocol
When building without final assets:
- Use real dimensions and aspect ratios
- Label clearly: `[REAL PHOTO: Customer using product]`
- Never launch with stock photos in hero sections
- Product shots can use mockups IF the UI is real

---

## Mobile Optimization

### Mobile-First Rules
1. Design for mobile, then expand to desktop
2. Make buttons easy to tap (44px minimum)
3. Keep forms short
4. Page speed is critical — nobody waits for slow sites

### Mobile-Specific Changes
- Strip videos/GIFs if they slow load time
- Maintain visual appeal but reduce complexity
- Test thumb reachability for CTAs

---

## Feedback Checklist (Before Launch)

Get two types of reviewers:
1. **Outside your market:** Test comprehension
2. **Inside your market:** Test differentiation

Ask these six questions:
1. **Conversion:** "Would you sign up right now? What's missing?"
2. **Interest:** "Rate 1-10. What should be rewritten?"
3. **Clarity:** "What's unclear? What questions remain?"
4. **Expansion:** "What did you want MORE detail on?"
5. **Brevity:** "If you deleted half the page, which half?"
6. **Disbelief:** "What triggered your 'that's BS' reflex?"

---

## Quick Reference: Bad vs Good

| Bad | Good |
|-----|------|
| "Supercharge your collaboration!" | "Team chat with built-in video calls" |
| "We're committed to excellence" | "Same-day delivery on orders over $50" |
| "Learn more" button | "Start your free trial" button |
| Grey text on colored background | Color-matched transparent text |
| Single blurry shadow | Layered shadows with offset |
| 10 nav links | 3-4 nav links + 1 CTA |
| Stock photo of handshake | Real photo of customer |
| "Submit" | "Get my free quote" |

---

## Tools

- **Shadow Generator:** joshwcomeau.com/shadow-palette/
- **Color Picker:** dribbble.com/colors (constrained palettes)
- **Icons:** heroicons.com, useiconic.com
