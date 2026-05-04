update public.expense_categories
set name = '外食費'
where name = '外食'
  and not exists (
    select 1
    from public.expense_categories existing
    where existing.user_id = expense_categories.user_id
      and existing.name = '外食費'
  );

insert into public.expense_categories (user_id, name, color)
select users.id, '食費', '#22c55e'
from auth.users users
on conflict (user_id, name) do nothing;

insert into public.expense_categories (user_id, name, color)
select users.id, '外食費', '#f97316'
from auth.users users
on conflict (user_id, name) do nothing;
