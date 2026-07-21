# Prompt: verify an already-filled install (INSTANCES 2 AND 3)

Run this in Claude Code inside the working repo on instances 2 and 3,
**after** instance 1's filled templates have been reviewed, committed, and
pushed, and this instance has pulled them.

Paste everything below the line as the prompt.

---

This repo's `CLAUDE.md` and `.claude/skills/repo-conventions/SKILL.md` were
already written on another machine, reviewed, and pulled here. Your job is
to verify this machine's install — nothing else.

**You must not regenerate, rewrite, "improve", or reformat either file.**
They are the single source of truth, shared across three machines; a local
rewrite here creates divergent versions of the same conventions, which is
the exact failure this system exists to prevent. If you believe something in
them is wrong for this machine, report it to me verbatim — do not fix it.

Do these three checks and report the results:

1. **Templates are real:** both files exist and contain no `TODO(fill)`
   markers. If markers remain, the pull didn't happen — stop and say so.

2. **The net fires:** in a real source file, add a call to a method that
   does not exist. The post-edit typecheck hook must hand you the type error
   within seconds. Remove the broken call and confirm the hook goes quiet
   again. If the hook stayed silent, report that the typechecker is not
   wired on THIS machine — do not attempt to fix the hook config yourself.

3. **Doctor:** run `$GULLSTACK_HOME/doctor.sh`. It must end `Operational.`
   Report the full output including the fingerprint line — the fingerprint
   must match the other instances; a differing fingerprint means this
   machine's gullstack clone drifted locally.
