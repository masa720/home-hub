import { Heart } from "lucide-react";
import { toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { RecipeEditModal } from "@/components/recipes/recipe-edit-modal";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils/cn";
import type { Recipe } from "@/types/database";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <form action={toggleRecipeCooked}>
        <input type="hidden" name="id" value={recipe.id} />
        <input type="hidden" name="is_cooked" value={String(recipe.is_cooked)} />
        <button
          type="submit"
          aria-label={recipe.is_cooked ? "未作成に戻す" : "作ったにする"}
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded border-2 text-xs",
            recipe.is_cooked ? "border-primary bg-primary text-primary-foreground" : "border-slate-500 bg-slate-950",
          )}
        >
          {recipe.is_cooked ? "✓" : ""}
        </button>
      </form>

      <RecipeEditModal
        title="✏️ レシピを編集"
        label={
          <div className="min-w-0">
            <h2 className="font-semibold text-white">{recipe.title}</h2>
            {recipe.memo ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{recipe.memo}</p> : null}
          </div>
        }
      >
        <RecipeForm recipe={recipe} />
      </RecipeEditModal>

      <div className="flex shrink-0 items-center gap-1">
        <form action={toggleRecipeFavorite}>
          <input type="hidden" name="id" value={recipe.id} />
          <input type="hidden" name="is_favorite" value={String(recipe.is_favorite)} />
          <SubmitButton variant="ghost" size="sm" className="size-8 min-h-8 min-w-8 p-0">
            <Heart className={recipe.is_favorite ? "size-4 fill-rose-400 text-rose-400" : "size-4 text-muted-foreground"} aria-hidden />
          </SubmitButton>
        </form>
        <DeleteRecipeButton recipeId={recipe.id} title={recipe.title} />
      </div>
    </article>
  );
}
