import Link from "next/link";
import { PageHeader } from "@/components/page-header";
import { getExpensesForMonth, summarizeExpenses } from "@/lib/db/expenses";
import { getMealPlans } from "@/lib/db/meal-plans";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { formatJaDate, toDateInputValue } from "@/lib/utils/dates";

export default async function HomePage() {
  const supabase = await createClient();
  const today = toDateInputValue(new Date());
  const now = new Date();
  const [todayPlans, expenses] = await Promise.all([
    getMealPlans(supabase, today, today),
    getExpensesForMonth(supabase, now).catch(() => []),
  ]);
  const summary = summarizeExpenses(expenses);

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


      <Link href="/expenses" className="block rounded-lg border bg-card p-4">
        <div className="flex items-center justify-between">
          <p className="font-semibold text-primary">💰 {formatJaDate(now, "M月")}の家計簿</p>
          <span className="text-xs text-muted-foreground">詳細 →</span>
        </div>
        <p className="mt-3 text-sm text-muted-foreground">今月使った額</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-red-400">{formatCurrency(summary.expenseCadTotal)}</p>
        <div className="mt-2 flex items-center justify-between border-t pt-2 text-sm">
          <span className="text-muted-foreground">残り</span>
          <span className="font-bold tabular-nums text-white">{formatCurrency(summary.netCadTotal)}</span>
        </div>
      </Link>
    </>
  );
}
