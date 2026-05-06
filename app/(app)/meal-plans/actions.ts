"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUtcDate, toDateInputValue } from "@/lib/utils/dates";
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

function mealType(value: FormDataEntryValue | null): MealType {
  return requiredString(value) === "lunch" ? "lunch" : "dinner";
}

function revalidateMeals(date?: string | null) {
  revalidatePath("/meal-plans");
  if (!date || date === toDateInputValue(getCurrentUtcDate())) {
    revalidatePath("/");
  }
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
    note: optionalString(formData.get("note")),
  });

  if (error) throw new Error(error.message);
  revalidateMeals(date);
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
      note: optionalString(formData.get("note")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateMeals(date);
}

export async function deleteMealPlan(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("meal_plans").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateMeals(optionalString(formData.get("date")));
}
