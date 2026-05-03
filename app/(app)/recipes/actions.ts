"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { optionalString, requiredString } from "@/lib/utils/form";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("ログインが必要です。");
  }

  return { supabase, userId: user.id };
}

function parseIngredients(text: string, recipeId: string) {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [name, quantity, unit, note] = line.split("|").map((part) => part.trim());
      return {
        recipe_id: recipeId,
        name,
        quantity: quantity || null,
        unit: unit || null,
        note: note || null,
      };
    })
    .filter((ingredient) => ingredient.name);
}

function revalidateRecipes(recipeId?: string) {
  revalidatePath("/");
  revalidatePath("/recipes");
  if (recipeId) revalidatePath(`/recipes/${recipeId}`);
}

export async function createRecipe(formData: FormData) {
  const title = requiredString(formData.get("title"));
  if (!title) return;

  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase
    .from("recipes")
    .insert({
      user_id: userId,
      title,
      description: optionalString(formData.get("description")),
      youtube_url: optionalString(formData.get("youtube_url")),
      url_1: optionalString(formData.get("url_1")),
      url_2: optionalString(formData.get("url_2")),
      memo: optionalString(formData.get("memo")),
    })
    .select("id")
    .single();

  if (error) throw new Error(error.message);

  const ingredientsText = optionalString(formData.get("ingredients_text"));
  if (ingredientsText) {
    const ingredients = parseIngredients(ingredientsText, data.id);
    if (ingredients.length > 0) {
      const { error: ingredientError } = await supabase.from("recipe_ingredients").insert(ingredients);
      if (ingredientError) throw new Error(ingredientError.message);
    }
  }

  revalidateRecipes(data.id);
  redirect(`/recipes/${data.id}`);
}

export async function updateRecipe(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const title = requiredString(formData.get("title"));
  if (!id || !title) return;

  const { supabase } = await getUserId();
  const { error } = await supabase
    .from("recipes")
    .update({
      title,
      description: optionalString(formData.get("description")),
      youtube_url: optionalString(formData.get("youtube_url")),
      url_1: optionalString(formData.get("url_1")),
      url_2: optionalString(formData.get("url_2")),
      memo: optionalString(formData.get("memo")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes(id);
}

export async function deleteRecipe(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const redirectAfter = requiredString(formData.get("redirect_after")) === "true";
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes(id);
  if (redirectAfter) redirect("/recipes");
}

export async function toggleRecipeCooked(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const isCooked = requiredString(formData.get("is_cooked")) === "true";
  const cookedCount = Number(formData.get("cooked_count") ?? 0);
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase
    .from("recipes")
    .update({
      is_cooked: !isCooked,
      cooked_count: !isCooked ? cookedCount + 1 : cookedCount,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes(id);
}

export async function toggleRecipeFavorite(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const isFavorite = requiredString(formData.get("is_favorite")) === "true";
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recipes").update({ is_favorite: !isFavorite }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes(id);
}

export async function createIngredient(formData: FormData) {
  const recipeId = requiredString(formData.get("recipe_id"));
  const name = requiredString(formData.get("name"));
  if (!recipeId || !name) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recipe_ingredients").insert({
    recipe_id: recipeId,
    name,
    quantity: optionalString(formData.get("quantity")),
    unit: optionalString(formData.get("unit")),
    note: optionalString(formData.get("note")),
  });

  if (error) throw new Error(error.message);
  revalidateRecipes(recipeId);
}

export async function deleteIngredient(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const recipeId = requiredString(formData.get("recipe_id"));
  if (!id || !recipeId) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recipe_ingredients").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes(recipeId);
}

export async function addRecipeIngredientsToShopping(formData: FormData) {
  const recipeId = requiredString(formData.get("recipe_id"));
  if (!recipeId) return;

  const { supabase, userId } = await getUserId();
  const { data, error } = await supabase.from("recipe_ingredients").select("*").eq("recipe_id", recipeId);
  if (error) throw new Error(error.message);

  const items = data.map((ingredient) => ({
    user_id: userId,
    name: ingredient.name,
    quantity: ingredient.quantity,
    unit: ingredient.unit,
    note: ingredient.note,
    recipe_id: recipeId,
  }));

  if (items.length > 0) {
    const { error: insertError } = await supabase.from("shopping_items").insert(items);
    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath("/");
  revalidatePath("/shopping");
  revalidateRecipes(recipeId);
}

export async function addRecipeToMealPlan(formData: FormData) {
  const recipeId = requiredString(formData.get("recipe_id"));
  const title = requiredString(formData.get("title"));
  const date = requiredString(formData.get("date"));
  const mealType = requiredString(formData.get("meal_type"));
  if (!recipeId || !title || !date) return;

  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("meal_plans").insert({
    user_id: userId,
    recipe_id: recipeId,
    title,
    date,
    meal_type: mealType === "lunch" ? "lunch" : "dinner",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/");
  revalidatePath("/meal-plans");
  revalidateRecipes(recipeId);
}
