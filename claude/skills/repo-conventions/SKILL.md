---
name: repo-conventions
description: Use when adding new code to this repository that should match existing patterns — creating a new endpoint, route, model, migration, component, service, test file, or module. Also use when unsure how this project structures a particular kind of change, or before proposing an architectural decision. Do NOT use for one-off scripts, debugging, or edits confined to a single existing file.
---

# Repo Conventions

<!-- TODO(fill): This file ships empty on purpose. doctor.sh FAILS until every
     TODO(fill) marker in this file is replaced with what is actually true in
     THIS repo. See $GULLSTACK_HOME/examples/EXAMPLE-repo-conventions.md for
     what "done" looks like.

     Rule for whoever fills this in (human or Claude): do not invent a
     convention you cannot point to evidence for — a real file, a real PR
     rejection, a real incident. If you are unsure whether something is a
     rule, leave it out and say so. -->

## Layout

<!-- TODO(fill): top-level directories and what belongs in each. Which
     directory does new code of each kind go in? What must never go where? -->

## Commands

<!-- TODO(fill): the REAL commands, copied from package.json / Makefile /
     justfile — not guessed: install deps, run dev, run all tests, run ONE
     test file, lint, typecheck, build, run migrations. -->

## How things are added here

<!-- TODO(fill): one subsection per change type that recurs in this repo —
     endpoint/route, model + migration, component, service, background job,
     test file. For each: the exact steps in order, and the path to one good
     exemplar file a new change should be copied from. -->

## Non-obvious rules

<!-- TODO(fill): the things that get PRs rejected here — the rules a new hire
     only learns from a rejected PR. Error handling shape, naming, what must
     never be imported where, transaction rules, feature flags, etc. -->

## Things that look wrong but are intentional

<!-- TODO(fill): deliberate weirdness Claude must NOT "helpfully" fix — the
     1200-line file that breaks type inference if split, the disabled lint
     rule with a reason, the copy-pasted-on-purpose module. Name each one and
     say why it stays. -->
