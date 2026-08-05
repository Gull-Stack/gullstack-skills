---
name: repo-conventions
description: Use when adding new code to this repository that should match existing patterns — creating a new endpoint, route, model, migration, component, service, test file, or module. Also use when unsure how this project structures a particular kind of change, or before proposing an architectural decision. Do NOT use for one-off scripts, debugging, or edits confined to a single existing file.
---

# gullstack-skills Conventions

Skill library + agent scaffold. Bash installers, markdown playbooks, Claude skill packages. **No application runtime.**

## Layout

- `site-builder/`, `seo-master/`, `meta-ads/`, `retail-resale-marketing/`, `ux-ui/` — installable skill packages (`SKILL.md` + supporting playbooks).
- Other top-level `*/SKILL.md` or playbook dirs (e.g. `app-design/`) — library content; only the five in `install.sh` `GLOBAL_SKILLS` are copied globally.
- `claude/hooks/post-edit-typecheck.sh` — PostToolUse typecheck hook installed by `--global`.
- `claude/agents/gullstack-reviewer.md` — reviewer agent template.
- `claude/skills/repo-conventions/SKILL.md` — **empty template** copied into product repos (do not fill the template in place with product-specific rules).
- `.claude/skills/` — project-local skills + pointers (`argus-qa`, `title-escrow`, …).
- `templates/CLAUDE.md` — empty CLAUDE template for product repos.
- `examples/` — filled EXAMPLE-* reference only (fictional acme-storefront).
- `prompts/` — instance-1 fill + instances-2/3 verify.
- `install.sh`, `doctor.sh`, `describe-repo.sh` — operational scaffold.
- `SKILLS-INVENTORY.md` — gap audit of the library.

## Commands

No product `dev` server. Real commands:

- `./install.sh --global` — hooks, agents, five global skills → `~/.claude`
- `./install.sh <repo>` — register repo; seed CLAUDE.md + repo-conventions if missing
- `./doctor.sh` — verify install + every registered repo’s filled templates + typechecker detection
- `./describe-repo.sh <repo>` — redacted survey for filling templates
- `npm run typecheck` — `bash -n` on shell entrypoints (see package.json)

## How things are added here

### New global skill
1. Create `<name>/SKILL.md` with YAML frontmatter (`name`, `description` with triggers).
2. Add `<name>` to `GLOBAL_SKILLS` in `install.sh` if it should install to every machine.
3. Document in README / SKILLS-INVENTORY.
4. Exemplar package shape: `seo-master/SKILL.md`.

### New pointer skill (lives elsewhere)
1. Add under `.claude/skills/<name>/SKILL.md` pointing at the canonical repo (do not copy bodies — anti-lesson #7).
2. Exemplars: `.claude/skills/argus-qa/`, `.claude/skills/title-escrow/`.

### Change install/doctor behavior
1. Edit `install.sh` or `doctor.sh`; keep doctor fingerprint intentional.
2. Run `bash -n install.sh doctor.sh` / `npm run typecheck`.
3. Run `./doctor.sh` on a machine with known-good registered repos.

### Fill protocol for product repos
- Instance 1 only: `prompts/instance-1-fill-templates.md` (evidence-only).
- Instances 2/3: `prompts/instances-2-3.md` — verify, never regenerate.

## Non-obvious rules

- **doctor fails until every fill marker is gone** from registered repos’ CLAUDE.md or repo-conventions — by design.
- **repo-conventions template in `claude/skills/` must stay a template** with unfilled markers; product fills live in each product repo’s `.claude/skills/repo-conventions/`.
- **examples/ are fictional** — never treat EXAMPLE paths as real GullStack apps.
- **Brain is external** (StrongestAvengerStack/gullstack-brain); Argus pointer skill carries distilled G/H rules when brain is offline.
- **Install copies skills** (not always symlinks) into `~/.claude/skills` — re-run `--global` after skill content changes if bots should pick up updates.

## Things that look wrong but are intentional

- **Scaffold working tree often dirty** while developing skills — doctor warns fingerprint includes local edits.
- **Duplicate storybrand / seo materials** historically flagged in SKILLS-INVENTORY — prefer link over copy when touching them.
- **Many top-level dirs** (including nascent skills) are not all in `GLOBAL_SKILLS` — only five install globally until added to install.sh.

## Open questions

- Which of the newer top-level skill dirs (e.g. google-ads, email-sms-lifecycle) are ready for GLOBAL_SKILLS vs still WIP?
- Should `--global` symlink instead of copy so skill edits propagate without reinstall?
- Package `gullstack-skills` itself on npm? (currently shell-only.)
