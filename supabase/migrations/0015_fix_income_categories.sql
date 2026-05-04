update public.recurring_expenses recurring
set type = 'income',
    updated_at = now()
from public.expense_categories category
where recurring.category_id = category.id
  and category.name in ('給与', '副業')
  and recurring.type <> 'income';

update public.expenses expense
set type = 'income',
    updated_at = now()
from public.expense_categories category
where expense.category_id = category.id
  and category.name in ('給与', '副業')
  and expense.type <> 'income';
