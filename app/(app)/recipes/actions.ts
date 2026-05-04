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
