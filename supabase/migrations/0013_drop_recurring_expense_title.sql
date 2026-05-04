alter table public.recurring_expenses
  add column if not exists title text;

update public.recurring_expenses
set title = coalesce(
  title,
  (
    select expense_categories.name
    from public.expense_categories
    where expense_categories.id = recurring_expenses.category_id
  ),
  case when type = 'income' then '収入' else '固定費' end
)
where title is null;

alter table public.recurring_expenses
  alter column title set not null;
