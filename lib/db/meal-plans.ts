import "server-only";

import type { MealPlan } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getMealPlans(supabase: SupabaseServerClient, start: string, end: string) {
  const { data, error } = await supabase
    .from("meal_plans")
    .select("*")
    .gte("date", start)
    .lte("date", end)
    .order("date")
    .order("meal_type");

  if (error) throw new Error(error.message);
  return data satisfies MealPlan[];
}
