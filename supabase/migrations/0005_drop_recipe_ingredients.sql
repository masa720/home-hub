-- Remove recipe_ingredients table (ingredients feature removed)
drop trigger if exists recipe_ingredients_set_updated_at on public.recipe_ingredients;
drop policy if exists "recipe_ingredients_select_own" on public.recipe_ingredients;
drop policy if exists "recipe_ingredients_insert_own" on public.recipe_ingredients;
drop policy if exists "recipe_ingredients_update_own" on public.recipe_ingredients;
drop policy if exists "recipe_ingredients_delete_own" on public.recipe_ingredients;
drop table if exists public.recipe_ingredients;

-- Remove ingredient-related columns from shopping_items
alter table public.shopping_items drop column if exists recipe_id;
alter table public.shopping_items drop column if exists meal_plan_id;
