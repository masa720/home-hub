import { Trash2 } from "lucide-react";
import { deleteMealPlan } from "@/app/(app)/meal-plans/actions";
import { MealForm } from "@/components/meal-plans/meal-form";
import { MealCellModal } from "@/components/meal-plans/meal-cell-modal";
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
        <MealCellModal label="＋">
          <MealForm recipes={recipes} date={dateValue} mealType={mealType} />
        </MealCellModal>
      </td>
    );
  }

  return (
    <td className="border-l border-border px-2 py-2 align-top">
      <MealCellModal label={plan.title} note={plan.note}>
        <div className="mb-3 flex flex-wrap gap-1">
          <form action={deleteMealPlan}>
            <input type="hidden" name="id" value={plan.id} />
            <SubmitButton variant="ghost" size="sm" className="h-7 min-h-7 text-xs text-red-300">
              <Trash2 className="size-3" aria-hidden />
              削除
            </SubmitButton>
          </form>
        </div>
        <MealForm recipes={recipes} plan={plan} />
      </MealCellModal>
    </td>
  );
}

function getDayColor(date: Date): string | undefined {
  const day = date.getDay();
  if (day === 0) return "text-red-400";
  if (day === 6) return "text-sky-400";
  return undefined;
}

export function MealDayCard({ date, plans, recipes }: MealDayCardProps) {
  const dateValue = toDateInputValue(date);
  const lunch = plans.find((plan) => plan.meal_type === "lunch");
  const dinner = plans.find((plan) => plan.meal_type === "dinner");
  const today = isToday(date);
  const dayColor = getDayColor(date);

  return (
    <tr className={cn("border-b border-border last:border-b-0", today && "bg-sky-500/15 [&>td]:border-l-sky-500/30")}>
      <td className={cn("w-20 whitespace-nowrap px-3 py-2 align-top", today && "border-l-2 border-l-sky-400")}>
        <span className={cn("text-sm font-semibold", today ? "text-primary" : "text-white")}>
          {formatJaDate(date, "d")}
        </span>
        <span className={cn("ml-0.5 text-xs", dayColor ?? "text-muted-foreground")}>
          ({formatJaDate(date, "E")})
        </span>
      </td>
      <MealCell mealType="lunch" plan={lunch} recipes={recipes} dateValue={dateValue} />
      <MealCell mealType="dinner" plan={dinner} recipes={recipes} dateValue={dateValue} />
    </tr>
  );
}
