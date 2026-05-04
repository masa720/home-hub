alter table public.expenses
  add column if not exists entered_by_name text;

update public.expenses expense
set entered_by_name = coalesce(
  expense.entered_by_name,
  profiles.display_name,
  split_part(profiles.email, '@', 1),
  'Unknown'
)
from public.profiles
where expense.user_id = profiles.id
  and expense.entered_by_name is null;
