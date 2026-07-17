import Link from "next/link";
import { notFound } from "next/navigation";
import { BarChart3, Settings } from "lucide-react";
import { ExpensePageContent } from "@/components/expenses/expense-page-content";
import { PageHeader } from "@/components/page-header";
import { getRequestProfile, requireRequestAuth } from "@/lib/auth/server";
import { getExpensePageData } from "@/lib/db/expenses";
import { APP_START_MONTH, parseMonthInputValue, toDateInputValue } from "@/lib/utils/dates";
import { getUserToday } from "@/lib/utils/server-dates";

type ExpensesPageProps = {
  searchParams: Promise<{ month?: string }>;
};

function parseMonth(value: string | undefined, today: Date) {
  if (!value) return today;
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
  const today = await getUserToday();
  const selectedMonth = parseMonth(month, today);
  const { supabase, userId } = await requireRequestAuth();
  const enteredByNamePromise = getRequestProfile().then(
    (profile) => profile.display_name ?? profile.email?.split("@")[0] ?? "Unknown",
  );
  const [{ categories, expenses }, defaultEnteredByName] = await Promise.all([
    getExpensePageData(supabase, selectedMonth, {
      userId,
      enteredByName: enteredByNamePromise,
    }),
    enteredByNamePromise,
  ]);
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
      <ExpensePageContent
        expenses={expenses}
        categories={categories}
        defaultEnteredByName={defaultEnteredByName}
        selectedMonth={selectedMonth}
        currentMonthValue={toDateInputValue(today).slice(0, 7)}
        previousHref={canGoPrevious ? monthHref(previousMonth) : null}
        nextHref={monthHref(nextMonth)}
      />
    </>
  );
}
