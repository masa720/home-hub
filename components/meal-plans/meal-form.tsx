import { Plus, Save } from "lucide-react";
import { createMealPlan, updateMealPlan } from "@/app/(app)/meal-plans/actions";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import type { MealPlanWithRecipe } from "@/lib/db/meal-plans";
import type { MealType, Recipe } from "@/types/database";

type MealFormProps = {
  recipes: Recipe[];
  plan?: MealPlanWithRecipe;
  date?: string;
  mealType?: MealType;
};

export function MealForm({ recipes, plan, date, mealType }: MealFormProps) {
  const action = plan ? updateMealPlan : createMealPlan;

  return (
    <form action={action} className="space-y-3 rounded-lg border bg-card p-4">
      {plan ? <input type="hidden" name="id" value={plan.id} /> : null}
      <div className="grid gap-3 sm:grid-cols-2">
        <Input name="date" type="date" defaultValue={plan?.date ?? date} required />
        <Select name="meal_type" defaultValue={plan?.meal_type ?? mealType ?? "dinner"}>
          <option value="lunch">ランチ</option>
          <option value="dinner">ディナー</option>
        </Select>
      </div>
      <Input name="title" placeholder="献立名" defaultValue={plan?.title ?? ""} required />
      <Select name="recipe_id" defaultValue={plan?.recipe_id ?? "none"}>
        <option value="none">レシピなし</option>
        {recipes.map((recipe) => (
          <option key={recipe.id} value={recipe.id}>
            {recipe.title}
          </option>
        ))}
      </Select>
      <Textarea name="note" placeholder="メモ" defaultValue={plan?.note ?? ""} />
      <div className="flex justify-end gap-2">
        <CancelButton />
        <SubmitButton variant={plan ? "secondary" : "default"}>
          {plan ? <Save className="size-4" aria-hidden /> : <Plus className="size-4" aria-hidden />}
          {plan ? "更新" : "追加"}
        </SubmitButton>
      </div>
    </form>
  );
}
