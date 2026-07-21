#!/usr/bin/env bash
# Read-only repo survey: dumps everything needed to write CLAUDE.md and
# repo-conventions accurately — manifests, lockfiles, scripts, tree shape,
# test setup, CI steps, commit history, most-churned files. Redacts .env
# values. Paste the output to whoever is writing the templates.
set -u
repo="${1:?usage: ./describe-repo.sh /path/to/repo}"
cd "$repo" || exit 1

section() { printf '\n== %s ==\n' "$1"; }
ls_some() { out="$(ls "$@" 2>/dev/null)"; if [ -n "$out" ]; then printf '%s\n' "$out"; else echo "(none found)"; fi; }

echo "REPO SURVEY: $(pwd)"

section "manifests"
ls_some package.json pyproject.toml setup.py go.mod Cargo.toml Gemfile composer.json Makefile justfile

section "lockfiles (determines package manager)"
ls_some pnpm-lock.yaml yarn.lock package-lock.json bun.lock bun.lockb poetry.lock uv.lock Pipfile.lock go.sum Cargo.lock

section "scripts"
if [ -f package.json ] && command -v python3 >/dev/null 2>&1; then
  python3 -c "import json; print(json.dumps(json.load(open('package.json')).get('scripts', {}), indent=2))"
elif [ -f Makefile ]; then
  grep -E '^[a-zA-Z0-9_-]+:' Makefile | head -20
else
  echo "(no package.json scripts / Makefile targets)"
fi

section "tree (2 levels, no deps/build dirs)"
find . -maxdepth 2 \
  -not -path '*/node_modules*' -not -path '*/.git*' -not -path '*/dist*' \
  -not -path '*/.next*' -not -path '*/target*' -not -path '*/__pycache__*' \
  -not -path '*/.venv*' -not -path '*/build*' -not -path '*/coverage*' \
  | LC_ALL=C sort | head -80

section "test setup"
ls_some vitest.config.* jest.config.* playwright.config.* karma.conf.* pytest.ini conftest.py tox.ini .rspec
[ -f pyproject.toml ] && grep -A5 '^\[tool\.pytest' pyproject.toml 2>/dev/null

section "typecheck config (what the post-edit hook will find)"
ls_some tsconfig.json mypy.ini pyrightconfig.json
[ -f package.json ] && grep -o '"typecheck"[^,}]*' package.json
[ -f pyproject.toml ] && grep -E '^\[tool\.(mypy|pyright)\]' pyproject.toml

section "CI steps"
found=0
for f in .github/workflows/*.yml .github/workflows/*.yaml; do
  [ -f "$f" ] || continue
  found=1
  echo "-- $f"
  grep -E '^\s*(run|uses):' "$f" | head -20
done
[ "$found" -eq 0 ] && echo "(no GitHub workflows)"

section "env keys (values redacted)"
found=0
for f in .env .env.example .env.local .env.development; do
  [ -f "$f" ] || continue
  found=1
  echo "-- $f"
  sed -E 's/=.*/=<redacted>/' "$f"
done
[ "$found" -eq 0 ] && echo "(no .env files)"

section "recent commits"
git log --oneline -15 2>/dev/null || echo "(not a git repo)"

section "most-churned files (last 200 commits)"
git log -200 --name-only --format= 2>/dev/null | grep -v '^$' | LC_ALL=C sort | uniq -c | sort -rn | head -15
