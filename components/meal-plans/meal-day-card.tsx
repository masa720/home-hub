import { ShoppingCart, Trash2 } from "lucide-react";
import { addMealIngredientsToShopping, deleteMealPlan } from "@/app/(app)/meal-plans/actions";
import { MealForm } from "@/components/meal-plans/meal-form";
import { SubmitButton } from "@/components/ui/submit-button";
import type { MealPlanWithRecipe } from "@/lib/db/meal-plans";
import { cn } from "@/lib/utils/cn";
import { formatJaDate, isToday, toDateInputValue } from "@/lib/utils/dates";
import type { MealType, Recipe } from "@/types/database";

type MealDayCardProps = {
  date: Date;
  plans: MealPlanWithRecipe[];
  recipes: Recipe[];
};

const labels: Record<MealType, string> = {
  lunch: "Lunch",
  dinner: "Dinner",
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
      <details className="rounded-xl bg-muted/50 p-3">
        <summary className="cursor-pointer list-none text-xs font-medium text-muted-foreground">
          + {labels[mealType]}
        </summary>
        <div className="mt-3">
          <MealForm recipes={recipes} date={dateValue} mealType={mealType} />
        </div>
      </details>
    );
  }

  return (
    <div className="rounded-xl bg-muted/50 p-3">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider text-accent">{labels[mealType]}</p>
          <p className="mt-0.5 text-sm font-semibold text-foreground">{plan.title}</p>
          {plan.recipe ? <p className="mt-0.5 text-xs text-muted-foreground">{plan.recipe.title}</p> : null}
          {plan.note ? <p className="mt-1 text-xs text-muted-foreground">{plan.note}</p> : null}
        </div>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-1">
        {plan.recipe_id ? (
          <form action={addMealIngredientsToShopping}>
            <input type="hidden" name="meal_plan_id" value={plan.id} />
            <input type="hidden" name="recipe_id" value={plan.recipe_id} />
            <SubmitButton variant="ghost" size="sm" className="h-7 min-h-7 gap-1 px-2 text-[10px]">
              <ShoppingCart className="size-3" aria-hidden />
              Cart
            </SubmitButton>
          </form>
        ) : null}
        <details>
          <summary className="cursor-pointer list-none rounded-xl px-2 py-1 text-[10px] text-muted-foreground hover:bg-muted">
            Edit
          </summary>
          <div className="mt-2">
            <MealForm recipes={recipes} plan={plan} />
          </div>
        </details>
        <form action={deleteMealPlan} className="ml-auto">
          <input type="hidden" name="id" value={plan.id} />
          <SubmitButton variant="ghost" size="sm" className="h-7 min-h-7 gap-1 px-2 text-[10px] text-destructive">
            <Trash2 className="size-3" aria-hidden />
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
  const today = isToday(date);

  return (
    <article className={cn("rounded-2xl bg-card p-4 shadow-card", today && "ring-2 ring-accent")}>
      <header className="mb-2.5 flex items-center gap-2">
        <h2 className="text-sm font-bold text-foreground">{formatJaDate(date)}</h2>
        {today ? (
          <span className="rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-white">Today</span>
        ) : null}
      </header>
      <div className="space-y-2">
        <MealSlot mealType="lunch" plan={lunch} recipes={recipes} dateValue={dateValue} />
        <MealSlot mealType="dinner" plan={dinner} recipes={recipes} dateValue={dateValue} />
      </div>
    </article>
  );
}
