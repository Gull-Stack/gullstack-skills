-- Home Manager — the whole database, in one file.
--
-- Run this once against YOUR OWN Supabase project. Everything is prefixed
-- `hm_` and this app never reads a table it did not create.
--
-- POSTURE: RLS is on everywhere and there are NO anon policies at all. This
-- app talks to PostgREST with the SERVICE ROLE key from the server only, and
-- every read and write goes through a route that has already checked which
-- door the caller came in by. The published anon key must never be able to
-- read a child's record, a pay rate, or a household bill — so it can't.
--
-- ⛔ Do NOT add an anon policy to "make local dev easier". The app that this
--    one is modeled on shipped anon-readable tables for months before a
--    lockdown pass, and every one of those months was a mistake nobody could
--    see.

-- ── People ─────────────────────────────────────────────────────────────────
-- One roster. `name` is the join key everything else uses, so it is unique and
-- the app refuses to rename it (a rename would orphan every shift and tick
-- already filed under the old spelling).
create table if not exists hm_people (
  id             uuid primary key default gen_random_uuid(),
  name           text not null unique,
  role           text not null check (role in ('owner','adult','staff','child')),
  title          text,
  pin            text,
  color          text,
  sort_order     int  not null default 100,
  active         boolean not null default true,
  pay_rate_cents int,
  pay_kind       text not null default 'none' check (pay_kind in ('hourly','salary','none')),
  birthday       date,
  note           text,
  created_at     timestamptz not null default now()
);

-- ── Tasks ──────────────────────────────────────────────────────────────────
create table if not exists hm_tasks (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  area         text,
  cadence      text not null check (cadence in ('daily','weekly','monthly','quarterly','yearly','once')),
  day_of_week  int check (day_of_week between 0 and 6),
  day_of_month int check (day_of_month between 1 and 31),
  once_date    date,
  detail       text,
  video_url    text,
  assigned_to  text,
  sort_order   int not null default 100,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- One row per task per day. The unique constraint is what makes ticking twice
-- a CORRECTION rather than a duplicate.
create table if not exists hm_task_log (
  id       uuid primary key default gen_random_uuid(),
  task_id  uuid not null references hm_tasks(id) on delete cascade,
  for_date date not null,
  person   text not null,
  state    text not null check (state in ('done','skipped')),
  -- A skip must carry a reason. Enforced in the app, in the API, and here —
  -- three times, because it is the single most valuable field in the schema.
  reason   text check (state <> 'skipped' or (reason is not null and length(btrim(reason)) > 0)),
  note     text,
  ts       timestamptz not null default now(),
  unique (task_id, for_date)
);
create index if not exists hm_task_log_date on hm_task_log (for_date desc);

-- ── Schedule ───────────────────────────────────────────────────────────────
create table if not exists hm_default_days (
  person text not null,
  dow    int  not null check (dow between 0 and 6),
  primary key (person, dow)
);

-- One-week overrides. A swap writes two of these; the standing pattern is
-- untouched, so next week goes back to normal by itself.
create table if not exists hm_shifts (
  person   text not null,
  for_date date not null,
  state    text not null check (state in ('on','off')),
  note     text,
  primary key (person, for_date)
);

create table if not exists hm_time_off (
  id        uuid primary key default gen_random_uuid(),
  person    text not null,
  from_date date not null,
  to_date   date not null check (to_date >= from_date),
  note      text,
  status    text not null default 'pending' check (status in ('pending','approved','denied')),
  ts        timestamptz not null default now()
);
create index if not exists hm_time_off_range on hm_time_off (from_date, to_date);

-- ── The clock ──────────────────────────────────────────────────────────────
create table if not exists hm_clock (
  id        uuid primary key default gen_random_uuid(),
  person    text not null,
  for_date  date not null,
  in_at     timestamptz not null,
  out_at    timestamptz,
  -- Set when the household closed a shift somebody forgot to end, so an
  -- adjusted timesheet never reads as the person's own entry.
  closed_by text,
  note      text
);
create index if not exists hm_clock_person_date on hm_clock (person, for_date desc);
create index if not exists hm_clock_open on hm_clock (out_at) where out_at is null;

-- ── Pay ────────────────────────────────────────────────────────────────────
-- A RECORD of payments. Nothing in this app moves money.
create table if not exists hm_pay_runs (
  id           uuid primary key default gen_random_uuid(),
  person       text not null,
  period_start date not null,
  period_end   date not null check (period_end >= period_start),
  minutes      int  not null default 0,
  amount_cents int  not null check (amount_cents >= 0),
  status       text not null default 'open' check (status in ('open','paid')),
  paid_on      date check (status <> 'paid' or paid_on is not null),
  method       text,
  note         text,
  ts           timestamptz not null default now()
);
create index if not exists hm_pay_runs_period on hm_pay_runs (period_start desc);

-- ── Bills ──────────────────────────────────────────────────────────────────
create table if not exists hm_bills (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text,
  amount_cents int check (amount_cents >= 0),
  cadence      text not null check (cadence in ('monthly','quarterly','yearly','once')),
  due_day      int check (due_day between 1 and 31),
  due_date     date,
  autopay      boolean not null default false,
  account      text,
  url          text,
  note         text,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

-- A payment settles ONE occurrence. `period` is "2026-08" / "2026-Q3" / "2026"
-- / a date. The unique constraint is why marking December paid can never touch
-- November.
create table if not exists hm_bill_payments (
  id           uuid primary key default gen_random_uuid(),
  bill_id      uuid not null references hm_bills(id) on delete cascade,
  period       text not null,
  paid_on      date not null,
  amount_cents int check (amount_cents >= 0),
  method       text,
  note         text,
  ts           timestamptz not null default now(),
  unique (bill_id, period)
);
create index if not exists hm_bill_payments_paid on hm_bill_payments (paid_on desc);

-- ── The kids ───────────────────────────────────────────────────────────────
create table if not exists hm_kid_routines (
  id             uuid primary key default gen_random_uuid(),
  child          text not null,
  label          text not null,
  kind           text not null check (kind in ('reading','meal','cleanup','activity','learning','other')),
  target_minutes int check (target_minutes between 0 and 1440),
  cadence        text not null default 'daily' check (cadence in ('daily','weekly')),
  day_of_week    int check (day_of_week between 0 and 6),
  sort_order     int not null default 100,
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

create table if not exists hm_kid_log (
  id         uuid primary key default gen_random_uuid(),
  routine_id uuid not null references hm_kid_routines(id) on delete cascade,
  child      text not null,
  for_date   date not null,
  state      text not null check (state in ('done','missed')),
  minutes    int check (minutes between 0 and 1440),
  note       text,
  -- Who said this happened. The only thing that makes the record worth
  -- keeping, so it is not nullable.
  logged_by  text not null,
  ts         timestamptz not null default now(),
  unique (routine_id, for_date)
);
create index if not exists hm_kid_log_child_date on hm_kid_log (child, for_date desc);

-- Milestones are written by a person, never inferred from a streak.
create table if not exists hm_kid_notes (
  id        uuid primary key default gen_random_uuid(),
  child     text not null,
  for_date  date not null,
  kind      text not null check (kind in ('milestone','note')),
  body      text not null,
  logged_by text not null,
  ts        timestamptz not null default now()
);
create index if not exists hm_kid_notes_child on hm_kid_notes (child, for_date desc);

-- ── Lock everything ────────────────────────────────────────────────────────
-- RLS on, zero policies. Only the service role (server-side) gets through.
alter table hm_people        enable row level security;
alter table hm_tasks         enable row level security;
alter table hm_task_log      enable row level security;
alter table hm_default_days  enable row level security;
alter table hm_shifts        enable row level security;
alter table hm_time_off      enable row level security;
alter table hm_clock         enable row level security;
alter table hm_pay_runs      enable row level security;
alter table hm_bills         enable row level security;
alter table hm_bill_payments enable row level security;
alter table hm_kid_routines  enable row level security;
alter table hm_kid_log       enable row level security;
alter table hm_kid_notes     enable row level security;

-- ⛔ NO SEED DATA. Not one name, not one task, not one bill.
--    An invented "Melinda" in a fresh install looks like data: she shows on a
--    calendar, and somebody has to work out whether she is real before they
--    can trust anything next to her. An empty roster is honest and takes two
--    minutes to fill.
