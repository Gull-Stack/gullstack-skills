#!/usr/bin/env bash
# GullStack installer.
#   ./install.sh --global        hooks/skills/agents -> ~/.claude, wires settings.json
#   ./install.sh /path/to/repo   per-project: CLAUDE.md + repo-conventions templates
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CLAUDE_DIR="${CLAUDE_CONFIG_DIR:-$HOME/.claude}"
REGISTRY="$CLAUDE_DIR/gullstack-repos"

# Skills installed globally (repo-conventions is per-repo, never global).
GLOBAL_SKILLS="site-builder seo-master meta-ads retail-resale-marketing ux-ui"

usage() { sed -n '2,4p' "$0" | sed 's/^# //'; exit 1; }

install_global() {
  command -v python3 >/dev/null 2>&1 || { echo "python3 required for --global (settings.json merge)" >&2; exit 1; }
  mkdir -p "$CLAUDE_DIR/hooks" "$CLAUDE_DIR/skills" "$CLAUDE_DIR/agents"

  cp "$HERE/claude/hooks/post-edit-typecheck.sh" "$CLAUDE_DIR/hooks/post-edit-typecheck.sh"
  chmod +x "$CLAUDE_DIR/hooks/post-edit-typecheck.sh"
  echo "hook      -> $CLAUDE_DIR/hooks/post-edit-typecheck.sh"

  for a in "$HERE"/claude/agents/*.md; do
    cp "$a" "$CLAUDE_DIR/agents/$(basename "$a")"
    echo "agent     -> $CLAUDE_DIR/agents/$(basename "$a")"
  done

  for s in $GLOBAL_SKILLS; do
    mkdir -p "$CLAUDE_DIR/skills/$s"
    cp "$HERE/$s/SKILL.md" "$CLAUDE_DIR/skills/$s/SKILL.md"
    echo "skill     -> $CLAUDE_DIR/skills/$s/"
  done

  python3 - "$CLAUDE_DIR/settings.json" "$CLAUDE_DIR/hooks/post-edit-typecheck.sh" <<'PY'
import json, os, sys
path, hook_cmd = sys.argv[1], sys.argv[2]
settings = {}
if os.path.exists(path):
    with open(path) as f:
        settings = json.load(f)
entry = {
    "matcher": "Edit|Write|MultiEdit|NotebookEdit",
    "hooks": [{"type": "command", "command": hook_cmd, "timeout": 150}],
}
hooks = settings.setdefault("hooks", {}).setdefault("PostToolUse", [])
if any(hook_cmd in json.dumps(h) for h in hooks):
    print(f"settings  -> already wired in {path}")
else:
    hooks.append(entry)
    with open(path, "w") as f:
        json.dump(settings, f, indent=2)
        f.write("\n")
    print(f"settings  -> PostToolUse hook wired in {path}")
PY

  echo "Global install done. Next: ./install.sh /path/to/repo for each repo, then ./doctor.sh"
}

install_repo() {
  local repo
  repo="$(cd "$1" 2>/dev/null && pwd)" || { echo "No such directory: $1" >&2; exit 1; }
  [ -d "$repo/.git" ] || echo "warning: $repo is not a git repository" >&2

  if [ -e "$repo/CLAUDE.md" ]; then
    echo "keep      $repo/CLAUDE.md (exists, not overwritten)"
  else
    cp "$HERE/templates/CLAUDE.md" "$repo/CLAUDE.md"
    echo "template  -> $repo/CLAUDE.md  (FILL IT IN — see examples/EXAMPLE-CLAUDE.md)"
  fi

  local dest="$repo/.claude/skills/repo-conventions"
  if [ -e "$dest/SKILL.md" ]; then
    echo "keep      $dest/SKILL.md (exists, not overwritten)"
  else
    mkdir -p "$dest"
    cp "$HERE/claude/skills/repo-conventions/SKILL.md" "$dest/SKILL.md"
    echo "template  -> $dest/SKILL.md  (FILL IT IN — see examples/EXAMPLE-repo-conventions.md)"
  fi

  mkdir -p "$CLAUDE_DIR"
  touch "$REGISTRY"
  grep -qxF "$repo" "$REGISTRY" || echo "$repo" >> "$REGISTRY"
  echo "registered $repo (doctor.sh will keep checking it)"
}

[ $# -eq 1 ] || usage
case "$1" in
  --global)  install_global ;;
  -h|--help) usage ;;
  *)         install_repo "$1" ;;
esac
