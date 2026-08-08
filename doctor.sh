#!/usr/bin/env bash
# GullStack doctor — verifies the net is actually wired on this machine.
# Ends "Operational." (exit 0) only when everything passes; otherwise lists
# failures and exits 1. Run it on every instance; fingerprints must match.
set -u

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
REGISTRY="$CLAUDE_DIR/gullstack-repos"
GLOBAL_SKILLS="site-builder seo-master meta-ads retail-resale-marketing ux-ui app-design"
GROK_DIR="${GROK_CONFIG_DIR:-$HOME/.grok}"
GROK_SKILLS="app-design ux-ui site-builder"

fail=0; warn=0
ok()  { printf 'ok    %s\n' "$1"; }
bad() { printf 'FAIL  %s\n' "$1"; fail=$((fail+1)); }
meh() { printf 'warn  %s\n' "$1"; warn=$((warn+1)); }

if command -v sha256sum >/dev/null 2>&1; then SHA="sha256sum"; else SHA="shasum -a 256"; fi
hash_of() { $SHA "$1" | awk '{print $1}'; }

# --- scaffold fingerprint: hash over all tracked files, identical on every clean clone
if git -C "$HERE" rev-parse >/dev/null 2>&1; then
  fp="$(cd "$HERE" && git ls-files | LC_ALL=C sort | tr '\n' '\0' | xargs -0 $SHA | $SHA | awk '{print substr($1,1,12)}')"
  if [ -n "$(git -C "$HERE" status --porcelain)" ]; then
    meh "scaffold working tree is dirty — fingerprint includes local edits (commit or discard them)"
  fi
else
  fp="not-a-git-clone"
  meh "$HERE is not a git clone — cannot fingerprint against other instances"
fi

# --- GULLSTACK_HOME
if [ -z "${GULLSTACK_HOME:-}" ]; then
  meh "GULLSTACK_HOME not set (export GULLSTACK_HOME=\"$HERE\" in your shell rc)"
elif [ "$(cd "$GULLSTACK_HOME" 2>/dev/null && pwd)" != "$HERE" ]; then
  meh "GULLSTACK_HOME=$GULLSTACK_HOME but doctor is running from $HERE"
else
  ok "GULLSTACK_HOME -> $HERE"
fi

# --- global install
hook_installed="$CLAUDE_DIR/hooks/post-edit-typecheck.sh"
hook_src="$HERE/claude/hooks/post-edit-typecheck.sh"
if [ ! -f "$hook_installed" ]; then
  bad "post-edit hook not installed — run ./install.sh --global"
elif [ "$(hash_of "$hook_installed")" != "$(hash_of "$hook_src")" ]; then
  bad "installed hook differs from scaffold copy — re-run ./install.sh --global"
elif [ ! -x "$hook_installed" ]; then
  bad "installed hook is not executable — chmod +x $hook_installed"
else
  ok "post-edit typecheck hook installed and current"
fi

if [ -f "$CLAUDE_DIR/settings.json" ] && grep -q "post-edit-typecheck.sh" "$CLAUDE_DIR/settings.json"; then
  ok "settings.json wires the PostToolUse hook"
else
  bad "hook not wired in $CLAUDE_DIR/settings.json — run ./install.sh --global"
fi

for a in "$HERE"/claude/agents/*.md; do
  name="$(basename "$a")"
  if [ -f "$CLAUDE_DIR/agents/$name" ]; then ok "agent $name installed"
  else bad "agent $name missing — run ./install.sh --global"; fi
done

# A skill that is PRESENT but STALE is worse than one that is missing: doctor says
# ok, the agent reads it, and nobody learns the canon moved. 2026-08-08: app-design
# ran three versions across four copies and two independent audits reviewed
# documents neither auditor chose. Existence is not the check — the hash is.
for s in $GLOBAL_SKILLS; do
  src="$HERE/$s/SKILL.md"
  dst="$CLAUDE_DIR/skills/$s/SKILL.md"
  if [ ! -f "$src" ]; then bad "skill $s missing from canon at $src"
  elif [ ! -f "$dst" ]; then bad "skill $s missing — run ./install.sh --global"
  elif [ "$(hash_of "$src")" != "$(hash_of "$dst")" ]; then
    bad "skill $s STALE in $CLAUDE_DIR/skills (canon $(wc -l < "$src" | tr -d ' ') lines vs installed $(wc -l < "$dst" | tr -d ' ')) — re-run ./install.sh --global"
  else ok "skill $s installed and current"; fi
done

# Grok reads its own copy and will silently audit an old one.
if [ -d "$GROK_DIR/skills" ]; then
  for s in $GROK_SKILLS; do
    src="$HERE/$s/SKILL.md"; dst="$GROK_DIR/skills/$s/SKILL.md"
    if [ ! -f "$dst" ]; then bad "grok skill $s missing — run ./install.sh --global"
    elif [ "$(hash_of "$src")" != "$(hash_of "$dst")" ]; then
      bad "grok skill $s STALE in $GROK_DIR/skills — re-run ./install.sh --global"
    else ok "grok skill $s current"; fi
  done
else
  meh "$GROK_DIR/skills absent — Grok has no GullStack design canon on this machine"
fi

# --- per-repo installs
check_typechecker() {
  # Mirrors the hook's detection. A repo where nothing matches has a silent
  # hook — worse than no net, because you'd be trusting it.
  local r="$1"
  if [ -f "$r/package.json" ]; then
    grep -q '"typecheck"' "$r/package.json" && return 0
    [ -f "$r/tsconfig.json" ] && [ -x "$r/node_modules/.bin/tsc" ] && return 0
    return 1
  fi
  [ -f "$r/mypy.ini" ] && return 0
  [ -f "$r/pyrightconfig.json" ] && return 0
  grep -qs '^\[tool\.mypy\]\|^\[tool\.pyright\]' "$r/pyproject.toml" && return 0
  [ -f "$r/go.mod" ] && return 0
  [ -f "$r/Cargo.toml" ] && return 0
  return 1
}

if [ ! -s "$REGISTRY" ]; then
  meh "no repos registered — run ./install.sh /path/to/repo for each working repo"
else
  while IFS= read -r repo; do
    [ -n "$repo" ] || continue
    if [ ! -d "$repo" ]; then
      bad "$repo registered but missing (edit $REGISTRY if it moved)"
      continue
    fi
    # Per-repo copies of the shared skills drift the same way. A POINTER is the
    # preferred shape (CLAUDE.md: link, don't copy — bryce-method anti-lesson #7)
    # and is always current by construction; only a real copy can go stale.
    for s in $GLOBAL_SKILLS; do
      rs="$repo/.claude/skills/$s/SKILL.md"
      [ -f "$rs" ] || continue          # a repo that doesn't carry it is fine
      if grep -qi '(pointer)' "$rs"; then
        ok "$repo/$s pointer"
      elif [ "$(hash_of "$HERE/$s/SKILL.md")" != "$(hash_of "$rs")" ]; then
        bad "$repo carries a STALE copy of $s — cp \"$HERE/$s/SKILL.md\" \"$rs\"  (or make it a pointer)"
      else
        ok "$repo/$s copy current"
      fi
    done
    for f in "CLAUDE.md" ".claude/skills/repo-conventions/SKILL.md"; do
      if [ ! -f "$repo/$f" ]; then
        bad "$repo/$f missing — run ./install.sh $repo"
      elif grep -q 'TODO(fill)' "$repo/$f"; then
        bad "$repo/$f still has TODO(fill) markers — the template is not filled in"
      else
        ok "$repo/$f filled"
      fi
    done
    if check_typechecker "$repo"; then
      ok "$repo has a detectable typechecker (hook will fire)"
    else
      bad "$repo: no typechecker detected — the hook stays SILENT here and the net has a hole. Add a \"typecheck\" script / tsconfig / mypy config."
    fi
  done < "$REGISTRY"
fi

echo
echo "fingerprint $fp"
if [ "$fail" -eq 0 ]; then
  echo "Operational."
  exit 0
else
  echo "$fail problem(s), $warn warning(s) — NOT operational."
  exit 1
fi
