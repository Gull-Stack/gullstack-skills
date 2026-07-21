#!/usr/bin/env bash
# GullStack post-edit typecheck hook (PostToolUse: Edit|Write|MultiEdit|NotebookEdit).
# Reads the hook JSON from stdin, finds the edited file's project, runs its
# typechecker, and on failure exits 2 with the errors on stderr so Claude
# fixes them before the user ever sees the code. Silent (exit 0) when the
# file type has no checker or none is configured — doctor.sh flags that hole.
set -u

INPUT="$(cat)"

file_path=""
if command -v python3 >/dev/null 2>&1; then
  file_path="$(printf '%s' "$INPUT" | python3 -c '
import json, sys
try:
    d = json.load(sys.stdin)
    print(d.get("tool_input", {}).get("file_path", "") or "")
except Exception:
    pass')"
elif command -v jq >/dev/null 2>&1; then
  file_path="$(printf '%s' "$INPUT" | jq -r '.tool_input.file_path // empty' 2>/dev/null)"
fi

[ -n "$file_path" ] && [ -f "$file_path" ] || exit 0

case "$file_path" in
  *.ts|*.tsx|*.mts|*.cts|*.js|*.jsx|*.mjs|*.cjs|*.py|*.go|*.rs) ;;
  *) exit 0 ;;
esac

# Walk up from the edited file to the project root.
root="$(cd "$(dirname "$file_path")" && pwd)"
while [ "$root" != "/" ]; do
  if [ -e "$root/package.json" ] || [ -e "$root/pyproject.toml" ] || \
     [ -e "$root/go.mod" ] || [ -e "$root/Cargo.toml" ] || [ -d "$root/.git" ]; then
    break
  fi
  root="$(dirname "$root")"
done
[ "$root" = "/" ] && exit 0

run() {
  if command -v timeout >/dev/null 2>&1; then
    (cd "$root" && timeout 120 "$@") 2>&1
  else
    (cd "$root" && "$@") 2>&1
  fi
}

out=""
status=0
case "$file_path" in
  *.ts|*.tsx|*.mts|*.cts|*.js|*.jsx|*.mjs|*.cjs)
    if [ -f "$root/package.json" ] && grep -q '"typecheck"' "$root/package.json"; then
      pm=npm
      [ -f "$root/pnpm-lock.yaml" ] && pm=pnpm
      [ -f "$root/yarn.lock" ] && pm=yarn
      { [ -f "$root/bun.lockb" ] || [ -f "$root/bun.lock" ]; } && pm=bun
      out="$(run "$pm" run typecheck)" || status=$?
    elif [ -f "$root/tsconfig.json" ] && [ -x "$root/node_modules/.bin/tsc" ]; then
      out="$(run ./node_modules/.bin/tsc --noEmit)" || status=$?
    else
      exit 0
    fi
    ;;
  *.py)
    if command -v mypy >/dev/null 2>&1 && \
       { [ -f "$root/mypy.ini" ] || grep -qs '^\[tool\.mypy\]' "$root/pyproject.toml"; }; then
      out="$(run mypy "$file_path")" || status=$?
    elif command -v pyright >/dev/null 2>&1 && \
         { [ -f "$root/pyrightconfig.json" ] || grep -qs '^\[tool\.pyright\]' "$root/pyproject.toml"; }; then
      out="$(run pyright "$file_path")" || status=$?
    else
      exit 0
    fi
    ;;
  *.go)
    command -v go >/dev/null 2>&1 || exit 0
    out="$(run go vet ./...)" || status=$?
    ;;
  *.rs)
    command -v cargo >/dev/null 2>&1 || exit 0
    out="$(run cargo check --quiet --message-format short)" || status=$?
    ;;
esac

if [ "$status" -ne 0 ]; then
  {
    echo "TYPECHECK FAILED after editing $file_path — fix these before continuing:"
    printf '%s\n' "$out" | head -60
  } >&2
  exit 2
fi
exit 0
