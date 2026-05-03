import "server-only";

import type { MealPlan, Recipe } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type MealPlanWithRecipe = MealPlan & {
  recipe: Recipe | null;
};

export async function getMealPlans(supabase: SupabaseServerClient, start: string, end: string) {
  const [mealPlansResult, recipesResult] = await Promise.all([
    supabase.from("meal_plans").select("*").gte("date", start).lte("date", end).order("date").order("meal_type"),
    supabase.from("recipes").select("*"),
  ]);

  if (mealPlansResult.error) throw new Error(mealPlansResult.error.message);
  if (recipesResult.error) throw new Error(recipesResult.error.message);

  const recipes = new Map(recipesResult.data.map((recipe) => [recipe.id, recipe]));
  return mealPlansResult.data.map((plan) => ({
    ...plan,
    recipe: plan.recipe_id ? recipes.get(plan.recipe_id) ?? null : null,
  })) satisfies MealPlanWithRecipe[];
}
