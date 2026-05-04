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
    return <EmptyState title="No ingredients yet" />;
  }

  return (
    <section className="space-y-3">
      <form action={addRecipeIngredientsToShopping}>
        <input type="hidden" name="recipe_id" value={recipeId} />
        <SubmitButton variant="accent" className="w-full">
          <ShoppingCart className="size-4" aria-hidden />
          Add all to cart
        </SubmitButton>
      </form>
      <div className="rounded-2xl bg-card shadow-card">
        <div className="divide-y">
          {ingredients.map((ingredient) => (
            <div key={ingredient.id} className="flex items-center gap-3 px-4 py-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{ingredient.name}</p>
                <p className="text-xs text-muted-foreground">
                  {[ingredient.quantity, ingredient.unit].filter(Boolean).join(" ") || ""}
                  {ingredient.note ? ` / ${ingredient.note}` : ""}
                </p>
              </div>
              <form action={deleteIngredient}>
                <input type="hidden" name="id" value={ingredient.id} />
                <input type="hidden" name="recipe_id" value={recipeId} />
                <SubmitButton variant="ghost" size="icon" className="size-8 min-h-8 min-w-8 text-muted-foreground">
                  <Trash2 className="size-3.5" aria-hidden />
                </SubmitButton>
              </form>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
