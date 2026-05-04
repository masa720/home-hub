alter table public.expenses
  drop column if exists store_id;

alter table public.recurring_expenses
  drop column if exists store_id;
