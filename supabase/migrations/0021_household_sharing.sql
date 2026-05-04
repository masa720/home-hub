-- Add household_id to profiles for family data sharing
alter table public.profiles
  add column household_id uuid not null default gen_random_uuid();

-- Helper: returns all user IDs in the caller's household
create or replace function public.household_member_ids()
returns setof uuid
language sql
security definer
stable
set search_path = public
as $$
  select id from public.profiles
  where household_id = (select household_id from public.profiles where id = auth.uid())
$$;

grant execute on function public.household_member_ids() to authenticated;

-- Verify a household code exists (bypasses RLS for join flow)
create or replace function public.verify_household_code(code uuid)
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where household_id = code
  )
$$;

grant execute on function public.verify_household_code(uuid) to authenticated;

-- profiles: can see household members
drop policy "profiles_select_own" on public.profiles;
create policy "profiles_select_household" on public.profiles
  for select using (id in (select public.household_member_ids()));

-- stores
drop policy "stores_select_own" on public.stores;
create policy "stores_select_household" on public.stores
  for select using (user_id in (select public.household_member_ids()));
drop policy "stores_update_own" on public.stores;
create policy "stores_update_household" on public.stores
  for update using (user_id in (select public.household_member_ids()));
drop policy "stores_delete_own" on public.stores;
create policy "stores_delete_household" on public.stores
  for delete using (user_id in (select public.household_member_ids()));

-- shopping_items
drop policy "shopping_select_own" on public.shopping_items;
create policy "shopping_select_household" on public.shopping_items
  for select using (user_id in (select public.household_member_ids()));
drop policy "shopping_update_own" on public.shopping_items;
create policy "shopping_update_household" on public.shopping_items
  for update using (user_id in (select public.household_member_ids()));
drop policy "shopping_delete_own" on public.shopping_items;
create policy "shopping_delete_household" on public.shopping_items
  for delete using (user_id in (select public.household_member_ids()));

-- recipes
drop policy "recipes_select_own" on public.recipes;
create policy "recipes_select_household" on public.recipes
  for select using (user_id in (select public.household_member_ids()));
drop policy "recipes_update_own" on public.recipes;
create policy "recipes_update_household" on public.recipes
  for update using (user_id in (select public.household_member_ids()));
drop policy "recipes_delete_own" on public.recipes;
create policy "recipes_delete_household" on public.recipes
  for delete using (user_id in (select public.household_member_ids()));

-- recipe_tags
drop policy "recipe_tags_select_own" on public.recipe_tags;
create policy "recipe_tags_select_household" on public.recipe_tags
  for select using (user_id in (select public.household_member_ids()));
drop policy "recipe_tags_update_own" on public.recipe_tags;
create policy "recipe_tags_update_household" on public.recipe_tags
  for update using (user_id in (select public.household_member_ids()));
drop policy "recipe_tags_delete_own" on public.recipe_tags;
create policy "recipe_tags_delete_household" on public.recipe_tags
  for delete using (user_id in (select public.household_member_ids()));

-- recipe_tag_relations (uses recipe join - recipes policy already handles household)
drop policy "recipe_tag_relations_select_own" on public.recipe_tag_relations;
create policy "recipe_tag_relations_select_household" on public.recipe_tag_relations
  for select using (exists (
    select 1 from public.recipes r where r.id = recipe_id
    and r.user_id in (select public.household_member_ids())
  ));
drop policy "recipe_tag_relations_insert_own" on public.recipe_tag_relations;
create policy "recipe_tag_relations_insert_household" on public.recipe_tag_relations
  for insert with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id in (select public.household_member_ids()))
    and exists (select 1 from public.recipe_tags t where t.id = tag_id and t.user_id in (select public.household_member_ids()))
  );
drop policy "recipe_tag_relations_update_own" on public.recipe_tag_relations;
create policy "recipe_tag_relations_update_household" on public.recipe_tag_relations
  for update using (exists (
    select 1 from public.recipes r where r.id = recipe_id
    and r.user_id in (select public.household_member_ids())
  )) with check (
    exists (select 1 from public.recipes r where r.id = recipe_id and r.user_id in (select public.household_member_ids()))
    and exists (select 1 from public.recipe_tags t where t.id = tag_id and t.user_id in (select public.household_member_ids()))
  );
drop policy "recipe_tag_relations_delete_own" on public.recipe_tag_relations;
create policy "recipe_tag_relations_delete_household" on public.recipe_tag_relations
  for delete using (exists (
    select 1 from public.recipes r where r.id = recipe_id
    and r.user_id in (select public.household_member_ids())
  ));

-- meal_plans
drop policy "meal_plans_select_own" on public.meal_plans;
create policy "meal_plans_select_household" on public.meal_plans
  for select using (user_id in (select public.household_member_ids()));
drop policy "meal_plans_update_own" on public.meal_plans;
create policy "meal_plans_update_household" on public.meal_plans
  for update using (user_id in (select public.household_member_ids()));
drop policy "meal_plans_delete_own" on public.meal_plans;
create policy "meal_plans_delete_household" on public.meal_plans
  for delete using (user_id in (select public.household_member_ids()));

-- expense_categories
drop policy "expense_categories_select_own" on public.expense_categories;
create policy "expense_categories_select_household" on public.expense_categories
  for select using (user_id in (select public.household_member_ids()));
drop policy "expense_categories_update_own" on public.expense_categories;
create policy "expense_categories_update_household" on public.expense_categories
  for update using (user_id in (select public.household_member_ids()));
drop policy "expense_categories_delete_own" on public.expense_categories;
create policy "expense_categories_delete_household" on public.expense_categories
  for delete using (user_id in (select public.household_member_ids()));

-- expenses
drop policy "expenses_select_own" on public.expenses;
create policy "expenses_select_household" on public.expenses
  for select using (user_id in (select public.household_member_ids()));
drop policy "expenses_update_own" on public.expenses;
create policy "expenses_update_household" on public.expenses
  for update using (user_id in (select public.household_member_ids()));
drop policy "expenses_delete_own" on public.expenses;
create policy "expenses_delete_household" on public.expenses
  for delete using (user_id in (select public.household_member_ids()));

-- recurring_expenses
drop policy "recurring_expenses_select_own" on public.recurring_expenses;
create policy "recurring_expenses_select_household" on public.recurring_expenses
  for select using (user_id in (select public.household_member_ids()));
drop policy "recurring_expenses_update_own" on public.recurring_expenses;
create policy "recurring_expenses_update_household" on public.recurring_expenses
  for update using (user_id in (select public.household_member_ids()));
drop policy "recurring_expenses_delete_own" on public.recurring_expenses;
create policy "recurring_expenses_delete_household" on public.recurring_expenses
  for delete using (user_id in (select public.household_member_ids()));
