# gullstack-skills

Team skill library + Claude/Grok scaffold (install, doctor, hooks, playbooks) for GullStack/Walkthru Labs.

**The scaffold is not a product app** — that rule still holds and is what the
top level is for. One product app is nonetheless *hosted* here, quarantined
under `apps/` (see below). Keep the two apart: nothing in `apps/` may import
from the scaffold, and the scaffold must never depend on anything in `apps/`.

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
- Global skills: `site-builder`, `seo-master`, `meta-ads`, `retail-resale-marketing`, `ux-ui`, `app-design` only via install.sh.
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
- **Product apps: `apps/` — NOT the top level.** A top-level dir means "skill
  package"; putting an app there breaks how the tree reads. Today that is
  `apps/home-manager/` (household command center: staff schedule, tasks, pay,
  bills, kids' record — own Next.js build, own Supabase project, own deploy,
  own `CLAUDE.md`). ⛔ It is not a skill and `install.sh` must never ship it:
  both scripts enumerate skills from the explicit `GLOBAL_SKILLS` list, never a
  directory glob, so leave it that way. ⚠️ `doctor.sh`'s fingerprint hashes
  every tracked file, so it now covers `apps/` too — that is expected (it still
  matches across clones of the same commit), but it does mean an app edit moves
  the scaffold fingerprint. If a standalone repo ever exists, lift it out with
  `git subtree split --prefix=apps/home-manager`.
- Scaffold: `install.sh`, `doctor.sh`, `claude/hooks/`, `claude/agents/`, `templates/`
- Project skills catalog: `.claude/skills/` (**pointers only** — a copy here is the bug `./doctor.sh` catches)
- Fill protocol: `prompts/` · examples: `examples/`
- Detail: `.claude/skills/repo-conventions/SKILL.md`
