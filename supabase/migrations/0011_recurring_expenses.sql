create table public.recurring_expenses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  type text not null default 'expense' check (type in ('expense', 'income')),
  amount numeric(12,2) not null check (amount >= 0),
  currency text not null default 'CAD' check (currency = 'CAD'),
  exchange_rate_to_cad numeric(12,6) not null default 1 check (exchange_rate_to_cad = 1),
  category_id uuid references public.expense_categories(id) on delete set null,
  day_of_month integer not null default 1 check (day_of_month between 1 and 31),
  memo text,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.expenses
  add column recurring_expense_id uuid references public.recurring_expenses(id) on delete set null;

create trigger recurring_expenses_set_updated_at before update on public.recurring_expenses
  for each row execute function public.set_updated_at();

alter table public.recurring_expenses enable row level security;

create policy "recurring_expenses_select_own" on public.recurring_expenses for select using (user_id = auth.uid());
create policy "recurring_expenses_insert_own" on public.recurring_expenses for insert with check (user_id = auth.uid());
create policy "recurring_expenses_update_own" on public.recurring_expenses for update using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "recurring_expenses_delete_own" on public.recurring_expenses for delete using (user_id = auth.uid());

grant select, insert, update, delete on table public.recurring_expenses to authenticated;

create index recurring_expenses_user_active_idx on public.recurring_expenses(user_id, is_active);
create index expenses_user_recurring_month_idx on public.expenses(user_id, recurring_expense_id, spent_at);
