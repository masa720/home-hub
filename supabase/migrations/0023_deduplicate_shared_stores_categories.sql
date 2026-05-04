-- Deduplicate stores within the same household.
-- Keep the row with the lowest sort_order (or oldest created_at) per name within each household.
-- Reassign shopping_items referencing deleted stores to the kept store.
do $$
declare
  rec record;
begin
  -- For each household, for each store name, keep one and delete the rest
  for rec in
    select s.id as dup_id, keeper.id as keeper_id
    from public.stores s
    join public.profiles p on p.id = s.user_id
    join lateral (
      select s2.id
      from public.stores s2
      join public.profiles p2 on p2.id = s2.user_id
      where p2.household_id = p.household_id
        and s2.name = s.name
      order by s2.sort_order, s2.created_at
      limit 1
    ) keeper on true
    where s.id <> keeper.id
  loop
    -- Reassign shopping_items to the keeper store
    update public.shopping_items
      set store_id = rec.keeper_id
      where store_id = rec.dup_id;
    -- Reassign expenses to the keeper store (if store_id exists)
    -- Delete the duplicate store
    delete from public.stores where id = rec.dup_id;
  end loop;
end $$;

-- Deduplicate expense_categories within the same household.
do $$
declare
  rec record;
begin
  for rec in
    select c.id as dup_id, keeper.id as keeper_id
    from public.expense_categories c
    join public.profiles p on p.id = c.user_id
    join lateral (
      select c2.id
      from public.expense_categories c2
      join public.profiles p2 on p2.id = c2.user_id
      where p2.household_id = p.household_id
        and c2.name = c.name
      order by c2.sort_order, c2.created_at
      limit 1
    ) keeper on true
    where c.id <> keeper.id
  loop
    -- Reassign expenses referencing the duplicate category
    update public.expenses
      set category_id = rec.keeper_id
      where category_id = rec.dup_id;
    update public.recurring_expenses
      set category_id = rec.keeper_id
      where category_id = rec.dup_id;
    delete from public.expense_categories where id = rec.dup_id;
  end loop;
end $$;

-- Update handle_new_user to skip store/category creation if household already has them
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  hid uuid;
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, null)
  on conflict (id) do nothing;

  -- Check if user is joining an existing household that already has stores
  select household_id into hid from public.profiles where id = new.id;

  -- Only create default stores/categories if no household member already has them
  if not exists (
    select 1 from public.stores s
    join public.profiles p on p.id = s.user_id
    where p.household_id = hid and s.user_id <> new.id
    limit 1
  ) then
    insert into public.stores (user_id, name, color)
    values
      (new.id, 'リカーショップ', '#b7a3cf'),
      (new.id, 'スーパーストア', '#f4c9b8'),
      (new.id, 'T&T', '#d6ebc8'),
      (new.id, 'コストコ', '#eadca9'),
      (new.id, 'ウォルマート', '#c4ddea'),
      (new.id, 'ダララマ', '#aac0c8'),
      (new.id, 'ダイソー', '#d9c7e5'),
      (new.id, 'シティマーケット', '#c8ad99'),
      (new.id, 'ロンドンドラッグ', '#e99b9b'),
      (new.id, 'セーフウェイ', '#f7cbc9'),
      (new.id, 'Hマート', '#a9c4e6')
    on conflict (user_id, name) do nothing;
  end if;

  if not exists (
    select 1 from public.expense_categories c
    join public.profiles p on p.id = c.user_id
    where p.household_id = hid and c.user_id <> new.id
    limit 1
  ) then
    insert into public.expense_categories (user_id, name, color)
    values
      (new.id, '食費', '#34d399'),
      (new.id, '外食費', '#fb7185'),
      (new.id, '日用品', '#38bdf8'),
      (new.id, '交通', '#a78bfa'),
      (new.id, '家賃', '#f59e0b'),
      (new.id, 'サブスク', '#60a5fa'),
      (new.id, '子ども用品', '#facc15'),
      (new.id, 'その他', '#94a3b8')
    on conflict (user_id, name) do nothing;
  end if;

  return new;
end;
$$;
