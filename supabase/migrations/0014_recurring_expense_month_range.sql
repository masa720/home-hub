alter table public.recurring_expenses
  add column if not exists start_month date,
  add column if not exists end_month date;

update public.recurring_expenses
set start_month = '2026-01-01'
where start_month is null;

alter table public.recurring_expenses
  alter column start_month set not null;

alter table public.recurring_expenses
  drop constraint if exists recurring_expenses_month_range_check;

alter table public.recurring_expenses
  add constraint recurring_expenses_month_range_check check (end_month is null or end_month >= start_month);

drop index if exists recurring_expenses_user_active_idx;
create index recurring_expenses_user_active_range_idx
  on public.recurring_expenses(user_id, is_active, start_month, end_month);
