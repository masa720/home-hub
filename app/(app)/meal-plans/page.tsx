import { PageHeader } from "@/components/page-header";
import { MealDayCard } from "@/components/meal-plans/meal-day-card";
import { WeekSelector } from "@/components/meal-plans/week-selector";
import { getMealPlans } from "@/lib/db/meal-plans";
import { createClient } from "@/lib/supabase/server";
import { getWeekDays, getWeekRange, parseDateInputValue, toDateInputValue } from "@/lib/utils/dates";
import { getUserToday } from "@/lib/utils/server-dates";

type MealPlansPageProps = {
  searchParams: Promise<{ week?: string }>;
};

export default async function MealPlansPage({ searchParams }: MealPlansPageProps) {
  const { week } = await searchParams;
  const today = await getUserToday();
  const baseDate = week ? parseDateInputValue(week) : today;
  const { start, end } = getWeekRange(baseDate);
  const weekDays = getWeekDays(baseDate);
  const supabase = await createClient();
  const plans = await getMealPlans(supabase, toDateInputValue(start), toDateInputValue(end));

  return (
    <>
      <PageHeader title="📅 献立表" />
      <WeekSelector baseDate={baseDate} />
      <section className="overflow-hidden rounded-lg border bg-card">
        <table className="w-full table-fixed">
          <colgroup>
            <col className="w-20" />
            <col />
            <col />
          </colgroup>
          <thead>
            <tr className="border-b border-border bg-slate-950/40 text-sm font-semibold text-muted-foreground">
              <th className="px-3 py-2 text-left">日付</th>
              <th className="border-l border-border px-2 py-2 text-left">🍳 ランチ</th>
              <th className="border-l border-border px-2 py-2 text-left">🍽️ ディナー</th>
            </tr>
          </thead>
          <tbody>
            {weekDays.map((day) => {
              const dateValue = toDateInputValue(day);
              return (
                <MealDayCard
                  key={dateValue}
                  date={day}
                  today={today}
                  plans={plans.filter((plan) => plan.date === dateValue)}
                />
              );
            })}
          </tbody>
        </table>
      </section>
    </>
  );
}
