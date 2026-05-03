import "server-only";

import type { Recipe, RecipeIngredient } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type RecipeWithIngredients = Recipe & {
  ingredients: RecipeIngredient[];
};

export async function getRecipes(supabase: SupabaseServerClient) {
  const { data, error } = await supabase.from("recipes").select("*").order("is_favorite", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getRecipeById(supabase: SupabaseServerClient, id: string) {
  const [recipeResult, ingredientsResult] = await Promise.all([
    supabase.from("recipes").select("*").eq("id", id).single(),
    supabase.from("recipe_ingredients").select("*").eq("recipe_id", id).order("created_at"),
  ]);

  if (recipeResult.error) throw new Error(recipeResult.error.message);
  if (ingredientsResult.error) throw new Error(ingredientsResult.error.message);

  return {
    ...recipeResult.data,
    ingredients: ingredientsResult.data,
  } satisfies RecipeWithIngredients;
}

export async function getRecipeIngredients(supabase: SupabaseServerClient, recipeId: string) {
  const { data, error } = await supabase.from("recipe_ingredients").select("*").eq("recipe_id", recipeId).order("created_at");
  if (error) throw new Error(error.message);
  return data;
}
