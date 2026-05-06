create index if not exists profiles_household_id_idx
  on public.profiles(household_id);

create index if not exists stores_sort_order_name_idx
  on public.stores(sort_order, name);

create index if not exists expense_categories_sort_order_name_idx
  on public.expense_categories(sort_order, name);

create index if not exists shopping_items_store_checked_created_idx
  on public.shopping_items(store_id, is_checked, created_at desc)
  where store_id is not null;

create index if not exists expenses_spent_at_created_at_idx
  on public.expenses(spent_at desc, created_at desc);

create index if not exists recipes_favorite_created_at_idx
  on public.recipes(is_favorite desc, created_at desc);

create index if not exists recurring_expenses_active_month_idx
  on public.recurring_expenses(user_id, start_month, end_month)
  where is_active = true;
