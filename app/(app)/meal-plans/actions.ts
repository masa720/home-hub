"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { optionalString, requiredString } from "@/lib/utils/form";
import type { MealType } from "@/types/database";

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

function normalizeRecipe(value: FormDataEntryValue | null) {
  const recipeId = optionalString(value);
  return recipeId === "none" ? null : recipeId;
}

function mealType(value: FormDataEntryValue | null): MealType {
  return requiredString(value) === "lunch" ? "lunch" : "dinner";
}

function revalidateMeals() {
  revalidatePath("/");
  revalidatePath("/meal-plans");
}

export async function createMealPlan(formData: FormData) {
  const title = requiredString(formData.get("title"));
  const date = requiredString(formData.get("date"));
  if (!title || !date) return;

  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("meal_plans").insert({
    user_id: userId,
    title,
    date,
    meal_type: mealType(formData.get("meal_type")),
    recipe_id: normalizeRecipe(formData.get("recipe_id")),
    note: optionalString(formData.get("note")),
  });

  if (error) throw new Error(error.message);
  revalidateMeals();
}

export async function updateMealPlan(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const title = requiredString(formData.get("title"));
  const date = requiredString(formData.get("date"));
  if (!id || !title || !date) return;

  const { supabase } = await getUserId();
  const { error } = await supabase
    .from("meal_plans")
    .update({
      title,
      date,
      meal_type: mealType(formData.get("meal_type")),
      recipe_id: normalizeRecipe(formData.get("recipe_id")),
      note: optionalString(formData.get("note")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateMeals();
}

export async function deleteMealPlan(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("meal_plans").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateMeals();
}

export async function addMealIngredientsToShopping(formData: FormData) {
  const mealPlanId = requiredString(formData.get("meal_plan_id"));
  const recipeId = requiredString(formData.get("recipe_id"));
  if (!mealPlanId || !recipeId) return;

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
    meal_plan_id: mealPlanId,
  }));

  if (items.length > 0) {
    const { error: insertError } = await supabase.from("shopping_items").insert(items);
    if (insertError) throw new Error(insertError.message);
  }

  revalidatePath("/");
  revalidatePath("/shopping");
  revalidateMeals();
}
