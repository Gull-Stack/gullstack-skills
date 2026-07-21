# Prompt: fill the templates (INSTANCE 1 ONLY)

Run this in Claude Code, inside the working repo, **in plan mode**
(shift-tab) so you review the plan before anything is written. Run it on
instance 1 only — instances 2 and 3 get `prompts/instances-2-3.md`, which
forbids regenerating what this produces.

Paste everything below the line as the prompt.

---

You are going to fill in this repo's `CLAUDE.md` and
`.claude/skills/repo-conventions/SKILL.md`. Both currently contain
`TODO(fill)` markers and `doctor.sh` fails until they are real.

**Overriding constraint, before anything else: write only what you can point
to evidence for** — a real file path, a real commit, a real config line. If
you are unsure whether something is a convention, DO NOT write it as one;
leave it out and add it to an "Open questions" list at the end instead. Ten
open questions for me to review beats one fabricated rule that gets enforced
automatically across three machines and found six weeks later. Never soften
this by writing hedged rules ("generally", "usually") — a rule is evidenced
or it is an open question.

Work in eight phases:

**Phase 1 — Read the contract.** Read
`.claude/skills/repo-conventions/SKILL.md` and `CLAUDE.md` as they stand
(the templates, with their commented section descriptions), and
`$GULLSTACK_HOME/examples/EXAMPLE-repo-conventions.md` and
`$GULLSTACK_HOME/examples/EXAMPLE-CLAUDE.md` for the target level of
specificity. The examples are for a fictional repo — copy their shape,
never their content.

**Phase 2 — Survey.** Establish the facts: manifests, lockfile (hence
package manager), scripts block, tree shape two levels deep, test config,
CI workflow steps, env var keys. `$GULLSTACK_HOME/describe-repo.sh .` does
this in one shot; verify anything surprising by opening the file.

**Phase 3 — Find the exemplars.** For each change type that recurs here
(endpoint/route, model/migration, component, service, background job, test
file — whichever actually exist in this repo): find one recently-touched,
representative file of that kind and confirm it is typical by comparing
against two others. These exact paths go in "How things are added here."
A change type this repo doesn't have gets omitted, not invented.

**Phase 4 — Mine the history.** `git log` for reverts, fix-the-fix chains,
and the most-churned files. Look for evidence of rules people learned the
hard way: incident-driven commits, comments explaining why something must
not change, lint-ignore lines with reasons, odd structures that survived
many refactors. This feeds "Non-obvious rules" and — separately — "Things
that look wrong but are intentional": frozen directories, deliberate
duplication, the oversized file that can't be split. That second section is
what stops future Claude sessions from helpfully damaging deliberate
decisions; treat finding those as a primary goal, not a bonus.

**Phase 5 — Write repo-conventions.** Replace every `TODO(fill)` in
`.claude/skills/repo-conventions/SKILL.md`. Every command copy-pasted from
its source, every recipe pointing at a real exemplar path, every rule
traceable to evidence from phases 2–4. Anything uncertain goes to Open
questions.

**Phase 6 — Prove the net fires.** Do not trust the hook because it is
installed; watch it work. In a real source file, add a call to a method
that does not exist. The post-edit typecheck hook must hand you the type
error within seconds of the edit. Then remove the broken call and confirm
the hook goes quiet. If the hook stayed silent on the broken call, STOP:
report that the typechecker is not wired (which `doctor.sh` should confirm)
— an installed-but-silent hook is worse than no hook, because it gets
trusted. Do not proceed to phase 7 with a silent hook.

**Phase 7 — Write CLAUDE.md.** Under 500 tokens. Only what every session
needs: one-line project description, the exact commands, 3–7 hard rules,
where things live. Anything situational stays in repo-conventions. No
philosophy, no duplication of the skill file.

**Phase 8 — Verify and hand off.** Run `$GULLSTACK_HOME/doctor.sh`. Show me:
(1) the doctor output, (2) the full text of both files, (3) the Open
questions list with what you'd need to resolve each. Do not commit —
I review first.
