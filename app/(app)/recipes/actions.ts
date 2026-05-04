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

function revalidateRecipes() {
  revalidatePath("/");
  revalidatePath("/recipes");
}

export async function createRecipe(formData: FormData) {
  const title = requiredString(formData.get("title"));
  if (!title) return;

  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("recipes").insert({
    user_id: userId,
    title,
    url_1: optionalString(formData.get("url_1")),
    url_2: optionalString(formData.get("url_2")),
    url_3: optionalString(formData.get("url_3")),
    memo: optionalString(formData.get("memo")),
  });

  if (error) throw new Error(error.message);
  revalidateRecipes();
  redirect("/recipes");
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
      url_1: optionalString(formData.get("url_1")),
      url_2: optionalString(formData.get("url_2")),
      url_3: optionalString(formData.get("url_3")),
      memo: optionalString(formData.get("memo")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes();
}

export async function deleteRecipe(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recipes").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes();
}

export async function toggleRecipeCooked(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const isCooked = requiredString(formData.get("is_cooked")) === "true";
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recipes").update({ is_cooked: !isCooked }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes();
}

export async function toggleRecipeFavorite(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const isFavorite = requiredString(formData.get("is_favorite")) === "true";
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recipes").update({ is_favorite: !isFavorite }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidateRecipes();
}
