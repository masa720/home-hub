import "server-only";

import { getMonthRange, toDateInputValue } from "@/lib/utils/dates";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export async function getCurrentMonthExpenseCadTotal(supabase: SupabaseServerClient) {
  const { start, end } = getMonthRange(new Date());
  const { data, error } = await supabase
    .from("expenses")
    .select("amount_cad,type")
    .gte("spent_at", toDateInputValue(start))
    .lte("spent_at", toDateInputValue(end));

  if (error) throw new Error(error.message);

  return data.reduce((total, expense) => {
    const amount = Number(expense.amount_cad ?? 0);
    return expense.type === "income" ? total - amount : total + amount;
  }, 0);
}
