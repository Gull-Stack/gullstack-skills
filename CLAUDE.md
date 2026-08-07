# gullstack-skills

Team skill library + Claude/Grok scaffold (install, doctor, hooks, playbooks) for GullStack/Walkthru Labs. Not a product app.

## Commands

- Global install: `./install.sh --global` → skills/hooks into `~/.claude`
- Per-repo: `./install.sh /path/to/repo` → CLAUDE.md + repo-conventions templates + registry
- Health: `./doctor.sh` (must end `Operational.`)
- Survey a product repo: `./describe-repo.sh /path/to/repo`
- Typecheck (shell syntax): `npm run typecheck`

## Hard rules

- Evidence only when filling templates — never invent conventions (see `prompts/instance-1-fill-templates.md`).
- Skills: link, don’t copy (bryce-method anti-lesson #7). Pointers for argus-qa / title-escrow / three-kings.
- Global skills: `site-builder`, `seo-master`, `meta-ads`, `retail-resale-marketing`, `ux-ui`, `app-design` only via install.sh.
- Design routing (never mix): marketing sites → `ux-ui` + `design-standard-v3.md`; product app UI → `app-design`; `ui-ux-pro-max` is a generic fallback and loses every conflict with GullStack canon.
- Guest-facing brand is often Walkthru Labs; infra may still say GullStack.
- Upstream brain protocols live in StrongestAvengerStack/gullstack-brain — not duplicated here.

## Where things live

- Skill packages: top-level dirs with `SKILL.md` (`site-builder/`, `seo-master/`, …)
- Scaffold: `install.sh`, `doctor.sh`, `claude/hooks/`, `claude/agents/`, `templates/`
- Project skills catalog: `.claude/skills/` (pointers + copies)
- Fill protocol: `prompts/` · examples: `examples/`
- Detail: `.claude/skills/repo-conventions/SKILL.md`
