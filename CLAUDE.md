# gullstack-skills

Team skill library + Claude/Grok scaffold (install, doctor, hooks, playbooks) for GullStack/Walkthru Labs. Not a product app.

## Commands

- Global install: `./install.sh --global` → skills/hooks into `~/.claude`
- Per-repo: `./install.sh /path/to/repo` → CLAUDE.md + repo-conventions templates + registry
- Health + skill drift: `./doctor.sh` (must end `Operational.`) — it hashes canon against every copy; existence is not the check
- Survey a product repo: `./describe-repo.sh /path/to/repo`
- Typecheck (shell syntax): `npm run typecheck`

## Hard rules

- Evidence only when filling templates — never invent conventions (see `prompts/instance-1-fill-templates.md`).
- Skills: link, don’t copy (bryce-method anti-lesson #7). `.claude/skills/`
  holds **pointer stubs only** — never content. `./doctor.sh` enforces it and
  FAILs on any copy that disagrees with canon. Four copies of
  `app-design` in three versions is how two audits reviewed different
  documents on the same day (2026-08-08).
- Global skills: `site-builder`, `seo-master`, `seo-audit`, `meta-ads`, `retail-resale-marketing`, `ux-ui`, `app-design` only via install.sh.
- SEO has two doors: `seo-master` is the **doctrine** — build-time defaults,
  applied while the page is written; `seo-audit` is the **instrument** — what is
  true on a live URL today, cited, run on demand. The audit is a diagnostic, not
  a gate: it does not block a deploy or withhold a "done". Rules go at the front
  end where they cost nothing; checks that stop work do not pay for themselves.
- **Design: read `DESIGN.md` first — it is the door.** Surface picks the skill:
  product app UI → `app-design`; marketing sites → `ux-ui` (+ `site-builder`),
  and `ux-ui` branches by client GENRE (local/physical vs software/product)
  before any layout decision.
- `ui-ux-pro-max` and `dataviz` **lose every conflict on canon we HAVE**
  (style, layout, type, colour) and are **MANDATORY on canon we don't** —
  contrast, focus order, ARIA, screen readers → `ui-ux-pro-max`; chart type,
  series colours, axis, legend → `dataviz`. That is a gap, not a conflict.
  The old wording ("a generic fallback, loses every conflict") is why
  accessibility got skipped: an agent read it and never opened the file.
- Guest-facing brand is often Walkthru Labs; infra may still say GullStack.
- Upstream brain protocols live in StrongestAvengerStack/gullstack-brain — not duplicated here.

## Where things live

- Skill packages: top-level dirs with `SKILL.md` (`site-builder/`, `seo-master/`, …)
- **Product apps do NOT live here.** Home Manager was hosted at
  `apps/home-manager/` for a few hours on 2026-08-12, only because a repo could
  not be created at the time; it moved to **`Gull-Stack/home-manager`** and the
  directory is gone. If you are looking for it, that is where it went. Should
  the situation ever recur, `apps/` is the quarantine — never the top level,
  which means "skill package with a `SKILL.md`" — and the two things that made
  it survivable were that `doctor.sh`/`install.sh` enumerate from the explicit
  `GLOBAL_SKILLS` list rather than a directory glob (keep it that way), and that
  the app imported nothing from the scaffold, which is what let
  `git subtree split` lift it out whole.
- Scaffold: `install.sh`, `doctor.sh`, `claude/hooks/`, `claude/agents/`, `templates/`
- Project skills catalog: `.claude/skills/` (**pointers only** — a copy here is the bug `./doctor.sh` catches)
- Fill protocol: `prompts/` · examples: `examples/`
- Detail: `.claude/skills/repo-conventions/SKILL.md`
