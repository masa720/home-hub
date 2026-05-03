import { ShoppingCart, Trash2 } from "lucide-react";
import { addRecipeIngredientsToShopping, deleteIngredient } from "@/app/(app)/recipes/actions";
import { EmptyState } from "@/components/empty-state";
import { SubmitButton } from "@/components/ui/submit-button";
import type { RecipeIngredient } from "@/types/database";

type IngredientListProps = {
  recipeId: string;
  ingredients: RecipeIngredient[];
};

export function IngredientList({ recipeId, ingredients }: IngredientListProps) {
  if (ingredients.length === 0) {
    return <EmptyState title="材料は未登録です" description="下のフォームから材料を追加できます。" />;
  }

  return (
    <section className="space-y-3">
      <form action={addRecipeIngredientsToShopping}>
        <input type="hidden" name="recipe_id" value={recipeId} />
        <SubmitButton className="w-full">
          <ShoppingCart className="size-4" aria-hidden />
          材料を買い物リストへ追加
        </SubmitButton>
      </form>
      <div className="space-y-2">
        {ingredients.map((ingredient) => (
          <div key={ingredient.id} className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-white">{ingredient.name}</p>
              <p className="text-sm text-muted-foreground">
                {[ingredient.quantity, ingredient.unit].filter(Boolean).join(" ") || "数量未設定"}
                {ingredient.note ? ` ・ ${ingredient.note}` : ""}
              </p>
            </div>
            <form action={deleteIngredient}>
              <input type="hidden" name="id" value={ingredient.id} />
              <input type="hidden" name="recipe_id" value={recipeId} />
              <SubmitButton variant="ghost" size="icon" className="text-red-300">
                <Trash2 className="size-4" aria-hidden />
              </SubmitButton>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
