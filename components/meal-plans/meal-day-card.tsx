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

function MealCell({
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
      <td className="border-l border-border px-2 py-2 align-top">
        <details>
          <summary className="cursor-pointer list-none text-xs text-muted-foreground">＋</summary>
          <div className="mt-2">
            <MealForm recipes={recipes} date={dateValue} mealType={mealType} />
          </div>
        </details>
      </td>
    );
  }

  return (
    <td className="border-l border-border px-2 py-2 align-top">
      <details className="group">
        <summary className="cursor-pointer list-none">
          <span className="text-sm font-medium text-white">{plan.title}</span>
          {plan.note ? <p className="text-xs text-muted-foreground">{plan.note}</p> : null}
        </summary>
        <div className="mt-2 space-y-2">
          <div className="flex flex-wrap gap-1">
            {plan.recipe_id ? (
              <form action={addMealIngredientsToShopping}>
                <input type="hidden" name="meal_plan_id" value={plan.id} />
                <input type="hidden" name="recipe_id" value={plan.recipe_id} />
                <SubmitButton variant="secondary" size="sm" className="h-7 min-h-7 text-xs">
                  <ShoppingCart className="size-3" aria-hidden />
                  材料追加
                </SubmitButton>
              </form>
            ) : null}
            <form action={deleteMealPlan}>
              <input type="hidden" name="id" value={plan.id} />
              <SubmitButton variant="ghost" size="sm" className="h-7 min-h-7 text-xs text-red-300">
                <Trash2 className="size-3" aria-hidden />
              </SubmitButton>
            </form>
          </div>
          <MealForm recipes={recipes} plan={plan} />
        </div>
      </details>
    </td>
  );
}

export function MealDayCard({ date, plans, recipes }: MealDayCardProps) {
  const dateValue = toDateInputValue(date);
  const lunch = plans.find((plan) => plan.meal_type === "lunch");
  const dinner = plans.find((plan) => plan.meal_type === "dinner");
  const today = isToday(date);

  return (
    <tr className={cn("border-b border-border last:border-b-0", today && "bg-primary/5")}>
      <td className="w-20 whitespace-nowrap px-3 py-2 align-top">
        <span className={cn("text-sm font-semibold", today ? "text-primary" : "text-white")}>
          {formatJaDate(date, "E")}
        </span>
        <span className="ml-1 text-xs text-muted-foreground">{formatJaDate(date, "d")}</span>
      </td>
      <MealCell mealType="lunch" plan={lunch} recipes={recipes} dateValue={dateValue} />
      <MealCell mealType="dinner" plan={dinner} recipes={recipes} dateValue={dateValue} />
    </tr>
  );
}
