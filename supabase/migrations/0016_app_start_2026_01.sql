update public.recurring_expenses
set start_month = '2026-01-01',
    updated_at = now()
where start_month < '2026-01-01';

update public.recurring_expenses
set end_month = null,
    updated_at = now()
where end_month < '2026-01-01';

delete from public.expenses
where spent_at < '2026-01-01';
