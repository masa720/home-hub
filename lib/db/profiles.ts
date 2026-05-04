import "server-only";

import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getProfile(supabase: SupabaseServerClient, userId: string) {
  const { data } = await supabase.from("profiles").select("*").eq("id", userId).maybeSingle();

  if (data) return data;

  // Profile missing (user created before trigger existed) — create it
  const { data: created, error } = await supabase
    .from("profiles")
    .upsert({ id: userId })
    .select("*")
    .single();
  if (error) throw new Error(error.message);
  return created;
}
