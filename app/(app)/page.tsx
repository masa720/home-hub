import { PageHeader } from "@/components/page-header";
import { getCurrentMonthExpenseCadTotal } from "@/lib/db/expenses";
import { getMealPlans } from "@/lib/db/meal-plans";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { toDateInputValue } from "@/lib/utils/dates";

export default async function HomePage() {
  const supabase = await createClient();
  const today = toDateInputValue(new Date());
  const [todayPlans, expenseTotal] = await Promise.all([
    getMealPlans(supabase, today, today),
    getCurrentMonthExpenseCadTotal(supabase).catch(() => 0),
  ]);

  const lunch = todayPlans.find((plan) => plan.meal_type === "lunch");
  const dinner = todayPlans.find((plan) => plan.meal_type === "dinner");

  return (
    <>
      <PageHeader title="🏠 ホーム" />

      <section className="grid gap-3 sm:grid-cols-2">
        <div className="rounded-lg border bg-card p-4">
          <p className="font-semibold text-primary">🍳 今日のランチ</p>
          <h2 className="mt-2 text-lg font-bold text-white">{lunch?.title ?? "未登録"}</h2>
          {lunch?.note ? <p className="mt-2 text-sm text-muted-foreground">{lunch.note}</p> : null}
        </div>
        <div className="rounded-lg border bg-card p-4">
          <p className="font-semibold text-primary">🍽️ 今日のディナー</p>
          <h2 className="mt-2 text-lg font-bold text-white">{dinner?.title ?? "未登録"}</h2>
          {dinner?.note ? <p className="mt-2 text-sm text-muted-foreground">{dinner.note}</p> : null}
        </div>
      </section>


      <section className="rounded-lg border bg-card p-4">
        <p className="text-sm font-semibold text-muted-foreground">💰 今月の支出合計 CAD換算</p>
        <p className="mt-2 text-3xl font-bold text-white">{formatCurrency(expenseTotal, "CAD")}</p>
        <p className="mt-2 text-sm text-muted-foreground">家計簿画面の入力UIはPhase 2で追加予定です。</p>
      </section>
    </>
  );
}
