import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Settings } from "lucide-react";
import { EmptyState } from "@/components/empty-state";
import { ExpenseAddFab } from "@/components/expenses/expense-add-fab";
import { ExpenseCard } from "@/components/expenses/expense-card";
import { ExpenseSummary } from "@/components/expenses/expense-summary";
import { PageHeader } from "@/components/page-header";
import {
  applyRecurringExpensesForMonth,
  getExpenseCategories,
  getExpensesForMonth,
  summarizeExpenses,
} from "@/lib/db/expenses";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";
import { APP_START_MONTH, getCurrentUtcDate, parseMonthInputValue, toDateInputValue } from "@/lib/utils/dates";

type ExpensesPageProps = {
  searchParams: Promise<{ month?: string }>;
};

function parseMonth(value: string | undefined) {
  if (!value) return getCurrentUtcDate();
  if (!/^\d{4}-\d{2}$/.test(value) || value < APP_START_MONTH) notFound();
  return parseMonthInputValue(value);
}

function monthHref(date: Date) {
  return `/expenses?month=${toDateInputValue(date).slice(0, 7)}`;
}

function shiftMonth(date: Date, amount: number) {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + amount, 1, 12));
}

export default async function ExpensesPage({ searchParams }: ExpensesPageProps) {
  const { month } = await searchParams;
  const selectedMonth = parseMonth(month);
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("ログインが必要です。");
  const [profile, categories] = await Promise.all([
    getProfile(supabase, user.id),
    getExpenseCategories(supabase),
  ]);
  const defaultEnteredByName = profile.display_name ?? profile.email?.split("@")[0] ?? "Unknown";
  await applyRecurringExpensesForMonth(supabase, selectedMonth, {
    userId: user.id,
    enteredByName: defaultEnteredByName,
    categories,
  });
  const expenses = await getExpensesForMonth(supabase, selectedMonth, categories);
  const summary = summarizeExpenses(expenses);
  const previousMonth = shiftMonth(selectedMonth, -1);
  const nextMonth = shiftMonth(selectedMonth, 1);
  const canGoPrevious = toDateInputValue(previousMonth).slice(0, 7) >= APP_START_MONTH;

  return (
    <>
      <PageHeader
        title="💰 家計簿"
        action={
          <div className="flex gap-1">
            <Link
              href="/expenses/stats"
              className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="統計"
            >
              <BarChart3 className="size-5" aria-hidden />
            </Link>
            <Link
              href="/expenses/settings"
              className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
              aria-label="家計簿 設定"
            >
              <Settings className="size-5" aria-hidden />
            </Link>
          </div>
        }
      />
      <ExpenseAddFab categories={categories} defaultEnteredByName={defaultEnteredByName} />

      <ExpenseSummary
        summary={summary}
        selectedMonth={selectedMonth}
        previousHref={canGoPrevious ? monthHref(previousMonth) : null}
        nextHref={monthHref(nextMonth)}
      />

      {expenses.length > 0 ? (
        <section className="rounded-lg border bg-card">
          <h2 className="border-b px-3 py-2 text-sm font-bold text-white">入出金</h2>
          <table className="w-full">
            <tbody>
              {expenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  categories={categories}
                />
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <EmptyState title="この月の記録はありません" />
      )}
    </>
  );
}
