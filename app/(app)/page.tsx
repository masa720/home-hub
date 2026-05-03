import Link from "next/link";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
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
      <PageHeader title="HomeHub" />

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-semibold text-emerald-300">今日のランチ</p>
          <h2 className="mt-2 text-lg font-bold text-white">{lunch?.title ?? "未登録"}</h2>
          {lunch?.note ? <p className="mt-2 text-sm text-muted-foreground">{lunch.note}</p> : null}
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="text-sm font-semibold text-sky-300">今日のディナー</p>
          <h2 className="mt-2 text-lg font-bold text-white">{dinner?.title ?? "未登録"}</h2>
          {dinner?.note ? <p className="mt-2 text-sm text-muted-foreground">{dinner.note}</p> : null}
        </div>
      </section>

      <section className="rounded-lg border bg-card p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold text-white">未購入の買い物</h2>
          <Button asChild variant="ghost" size="sm">
            <Link href="/shopping">開く</Link>
          </Button>
        </div>
        {openItems.length > 0 ? (
          <div className="space-y-2">
            {openItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between gap-3 rounded-lg bg-slate-950/45 px-3 py-3">
                <div className="min-w-0">
                  <p className="font-medium text-white">{item.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {[item.quantity, item.unit].filter(Boolean).join(" ") || "数量未設定"}
                    {item.store ? ` ・ ${item.store.name}` : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <EmptyState title="未購入の商品はありません" />
        )}
      </section>

      <section className="rounded-lg border bg-card p-4">
        <p className="text-sm font-semibold text-muted-foreground">今月の支出合計 CAD換算</p>
        <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(expenseTotal, "CAD")}</p>
        <p className="mt-2 text-sm text-muted-foreground">家計簿画面の入力UIはPhase 2で追加予定です。</p>
      </section>
    </>
  );
}
