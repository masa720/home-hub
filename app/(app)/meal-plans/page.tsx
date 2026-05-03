import { PageHeader } from "@/components/page-header";
import { MealDayCard } from "@/components/meal-plans/meal-day-card";
import { WeekSelector } from "@/components/meal-plans/week-selector";
import { getMealPlans } from "@/lib/db/meal-plans";
import { getRecipes } from "@/lib/db/recipes";
import { createClient } from "@/lib/supabase/server";
import { getWeekDays, getWeekRange, toDateInputValue } from "@/lib/utils/dates";

type MealPlansPageProps = {
  searchParams: Promise<{ week?: string }>;
};

export default async function MealPlansPage({ searchParams }: MealPlansPageProps) {
  const { week } = await searchParams;
  const baseDate = week ? new Date(`${week}T00:00:00`) : new Date();
  const { start, end } = getWeekRange(baseDate);
  const weekDays = getWeekDays(baseDate);
  const supabase = await createClient();
  const [plans, recipes] = await Promise.all([
    getMealPlans(supabase, toDateInputValue(start), toDateInputValue(end)),
    getRecipes(supabase),
  ]);

  return (
    <>
      <PageHeader title="献立表" />
      <WeekSelector baseDate={baseDate} />
      <section className="space-y-3">
        {weekDays.map((day) => {
          const dateValue = toDateInputValue(day);
          return (
            <MealDayCard
              key={dateValue}
              date={day}
              recipes={recipes}
              plans={plans.filter((plan) => plan.date === dateValue)}
            />
          );
        })}
      </section>
    </>
  );
}
