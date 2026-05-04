-- Remove recipe_id from meal_plans (recipes are separate from meal planning)
alter table public.meal_plans drop column if exists recipe_id;
