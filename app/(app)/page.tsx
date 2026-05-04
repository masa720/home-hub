import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { getCurrentMonthExpenseCadTotal } from "@/lib/db/expenses";
import { getMealPlans } from "@/lib/db/meal-plans";
import { getOpenShoppingItems } from "@/lib/db/shopping";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { toDateInputValue } from "@/lib/utils/dates";

export default async function HomePage() {
  const supabase = await createClient();
  const today = toDateInputValue(new Date());
  const [todayPlans, openItems, expenseTotal] = await Promise.all([
    getMealPlans(supabase, today, today),
    getOpenShoppingItems(supabase, 5),
    getCurrentMonthExpenseCadTotal(supabase).catch(() => 0),
  ]);

  const lunch = todayPlans.find((plan) => plan.meal_type === "lunch");
  const dinner = todayPlans.find((plan) => plan.meal_type === "dinner");

  return (
    <>
      <h1 className="text-xl font-bold tracking-tight text-foreground">Today</h1>

      <div className="grid grid-cols-2 gap-3">
        <Link href="/meal-plans" className="rounded-2xl bg-card p-4 shadow-card active:opacity-70">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Lunch</p>
          <p className="mt-1.5 text-[15px] font-bold text-foreground">{lunch?.title ?? "..."}</p>
          {lunch?.note ? <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{lunch.note}</p> : null}
        </Link>
        <Link href="/meal-plans" className="rounded-2xl bg-card p-4 shadow-card active:opacity-70">
          <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Dinner</p>
          <p className="mt-1.5 text-[15px] font-bold text-foreground">{dinner?.title ?? "..."}</p>
          {dinner?.note ? <p className="mt-1 text-xs text-muted-foreground line-clamp-1">{dinner.note}</p> : null}
        </Link>
      </div>

      <section className="rounded-2xl bg-card p-4 shadow-card">
        <Link href="/shopping" className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-foreground">Shopping</h2>
          <ChevronRight className="size-4 text-muted-foreground" />
        </Link>
        {openItems.length > 0 ? (
          <div className="mt-3 divide-y">
            {openItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 py-2.5">
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {[item.quantity, item.unit].filter(Boolean).join(" ") || ""}
                    {item.store ? ` ${item.store.name}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="All done" />
        )}
      </section>

      <Link href="/expenses" className="block rounded-2xl bg-card p-4 shadow-card active:opacity-70">
        <p className="text-xs font-medium text-muted-foreground">This month (CAD)</p>
        <p className="mt-1 text-2xl font-bold tabular-nums text-foreground">{formatCurrency(expenseTotal, "CAD")}</p>
      </Link>
    </>
  );
}
