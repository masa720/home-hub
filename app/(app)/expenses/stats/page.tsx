import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { MonthlyChart } from "@/components/expenses/monthly-chart";
import { CategoryComparison } from "@/components/expenses/category-comparison";
import { StatsRangeSelector } from "@/components/expenses/stats-range-selector";
import { getMonthlyStats } from "@/lib/db/expenses";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils/currency";
import { APP_START_MONTH, toDateInputValue } from "@/lib/utils/dates";
import { getUserToday } from "@/lib/utils/server-dates";

type StatsPageProps = {
  searchParams: Promise<{ range?: string; from?: string; to?: string }>;
};

async function resolveRange(range: string | undefined, from: string | undefined, to: string | undefined) {
  const now = await getUserToday();
  const currentMonth = toDateInputValue(now).slice(0, 7);

  if (range === "custom" && from && to && from <= to) {
    return { key: "custom" as const, from, to };
  }

  if (range === "all") {
    return { key: "all" as const, from: APP_START_MONTH, to: currentMonth };
  }

  const presetMonths = range === "3" ? 3 : 6;
  const key = range === "3" ? ("3" as const) : ("6" as const);
  const startDate = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (presetMonths - 1), 1, 12));
  return { key, from: toDateInputValue(startDate).slice(0, 7), to: currentMonth };
}

export default async function ExpenseStatsPage({ searchParams }: StatsPageProps) {
  const params = await searchParams;
  const { key, from, to } = await resolveRange(params.range, params.from, params.to);
  const supabase = await createClient();
  const stats = await getMonthlyStats(supabase, from, to);

  const totalExpense = stats.reduce((sum, m) => sum + m.expense, 0);
  const totalIncome = stats.reduce((sum, m) => sum + m.income, 0);
  const avgExpense = stats.length > 0 ? totalExpense / stats.length : 0;

  return (
    <>
      <PageHeader
        title="📊 統計"
        action={
          <Link
            href="/expenses"
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="家計簿へ戻る"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </Link>
        }
      />

      <StatsRangeSelector currentRange={key} from={from} to={to} />

      <section className="rounded-lg border bg-card p-4 text-center">
        <p className="text-sm font-semibold text-muted-foreground">トータル収支</p>
        <p className="mt-1 text-3xl font-bold tabular-nums text-white">
          {formatCurrency(totalIncome - totalExpense)}
        </p>
        <div className="mt-3 grid grid-cols-3 gap-2 border-t pt-3">
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">収入</p>
            <p className="mt-0.5 text-base font-bold tabular-nums text-sky-400">{formatCurrency(totalIncome)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">支出</p>
            <p className="mt-0.5 text-base font-bold tabular-nums text-red-400">{formatCurrency(totalExpense)}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold text-muted-foreground">月平均支出</p>
            <p className="mt-0.5 text-base font-bold tabular-nums text-white">{formatCurrency(avgExpense)}</p>
          </div>
        </div>
      </section>

      <MonthlyChart stats={stats} />
      <CategoryComparison stats={stats} />
    </>
  );
}
