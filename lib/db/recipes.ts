import "server-only";

import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getRecipes(supabase: SupabaseServerClient) {
  const { data, error } = await supabase.from("recipes").select("*").order("is_favorite", { ascending: false }).order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data;
}

export async function getRecipeById(supabase: SupabaseServerClient, id: string) {
  const { data, error } = await supabase.from("recipes").select("*").eq("id", id).single();
  if (error) throw new Error(error.message);
  return data;
}
