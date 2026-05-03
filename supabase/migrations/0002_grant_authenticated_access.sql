grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on table
  public.profiles,
  public.stores,
  public.shopping_items,
  public.recipes,
  public.recipe_ingredients,
  public.recipe_tags,
  public.recipe_tag_relations,
  public.meal_plans,
  public.expense_categories,
  public.payment_methods,
  public.expenses
to authenticated;

grant execute on function public.set_updated_at() to authenticated;
grant execute on function public.set_checked_at() to authenticated;
grant execute on function public.set_amount_cad() to authenticated;
