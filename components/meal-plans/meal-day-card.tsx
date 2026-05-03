import { ShoppingCart, Trash2 } from "lucide-react";
import { addMealIngredientsToShopping, deleteMealPlan } from "@/app/(app)/meal-plans/actions";
import { MealForm } from "@/components/meal-plans/meal-form";
import { SubmitButton } from "@/components/ui/submit-button";
import type { MealPlanWithRecipe } from "@/lib/db/meal-plans";
import { formatJaDate, isToday, toDateInputValue } from "@/lib/utils/dates";
import type { MealType, Recipe } from "@/types/database";

type MealDayCardProps = {
  date: Date;
  plans: MealPlanWithRecipe[];
  recipes: Recipe[];
};

const labels: Record<MealType, string> = {
  lunch: "ランチ",
  dinner: "ディナー",
};

function MealSlot({
  mealType,
  plan,
  recipes,
  dateValue,
}: {
  mealType: MealType;
  plan?: MealPlanWithRecipe;
  recipes: Recipe[];
  dateValue: string;
}) {
  if (!plan) {
    return (
      <details className="rounded-lg border border-dashed bg-slate-950/40 p-3">
        <summary className="cursor-pointer list-none text-sm font-semibold text-muted-foreground">
          {labels[mealType]}を追加
        </summary>
        <div className="mt-3">
          <MealForm recipes={recipes} date={dateValue} mealType={mealType} />
        </div>
      </details>
    );
  }

  return (
    <div className="rounded-lg border bg-slate-950/45 p-3">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-normal text-primary">{labels[mealType]}</p>
          <h3 className="mt-1 font-semibold text-white">{plan.title}</h3>
          {plan.recipe ? <p className="mt-1 text-sm text-muted-foreground">レシピ: {plan.recipe.title}</p> : null}
          {plan.note ? <p className="mt-2 text-sm leading-6 text-muted-foreground">{plan.note}</p> : null}
        </div>
      </div>
      <div className="mt-3 flex flex-wrap gap-2">
        {plan.recipe_id ? (
          <form action={addMealIngredientsToShopping}>
            <input type="hidden" name="meal_plan_id" value={plan.id} />
            <input type="hidden" name="recipe_id" value={plan.recipe_id} />
            <SubmitButton variant="secondary" size="sm">
              <ShoppingCart className="size-4" aria-hidden />
              材料追加
            </SubmitButton>
          </form>
        ) : null}
        <details className="w-full">
          <summary className="cursor-pointer list-none text-sm text-muted-foreground">編集</summary>
          <div className="mt-3">
            <MealForm recipes={recipes} plan={plan} />
          </div>
        </details>
        <form action={deleteMealPlan} className="ml-auto">
          <input type="hidden" name="id" value={plan.id} />
          <SubmitButton variant="ghost" size="sm" className="text-red-300">
            <Trash2 className="size-4" aria-hidden />
            削除
          </SubmitButton>
        </form>
      </div>
    </div>
  );
}

export function MealDayCard({ date, plans, recipes }: MealDayCardProps) {
  const dateValue = toDateInputValue(date);
  const lunch = plans.find((plan) => plan.meal_type === "lunch");
  const dinner = plans.find((plan) => plan.meal_type === "dinner");

  return (
    <article className="rounded-lg border bg-card p-4">
      <header className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-semibold text-white">{formatJaDate(date)}</h2>
        {isToday(date) ? (
          <span className="rounded-md bg-primary px-2 py-1 text-xs font-semibold text-primary-foreground">今日</span>
        ) : null}
      </header>
      <div className="space-y-3">
        <MealSlot mealType="lunch" plan={lunch} recipes={recipes} dateValue={dateValue} />
        <MealSlot mealType="dinner" plan={dinner} recipes={recipes} dateValue={dateValue} />
      </div>
    </article>
  );
}
