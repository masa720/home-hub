import { ExternalLink, Heart, Utensils } from "lucide-react";
import { toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { RecipeEditModal } from "@/components/recipes/recipe-edit-modal";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Recipe } from "@/types/database";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const urls = [recipe.url_1, recipe.url_2, recipe.url_3].filter(Boolean);

  return (
    <article className="flex items-start gap-3 rounded-lg border bg-card p-4">
      <RecipeEditModal
        title="✏️ レシピを編集"
        label={
          <div className="min-w-0">
            <h2 className="font-semibold text-white">{recipe.title}</h2>
            {recipe.memo ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{recipe.memo}</p> : null}
          </div>
        }
      >
        <div className="mb-4 flex flex-wrap gap-2">
          <form action={toggleRecipeCooked}>
            <input type="hidden" name="id" value={recipe.id} />
            <input type="hidden" name="is_cooked" value={String(recipe.is_cooked)} />
            <input type="hidden" name="cooked_count" value={recipe.cooked_count} />
            <SubmitButton variant={recipe.is_cooked ? "secondary" : "outline"} size="sm">
              <Utensils className="size-4" aria-hidden />
              {recipe.is_cooked ? `作った ${recipe.cooked_count}回` : "未作成"}
            </SubmitButton>
          </form>
          {urls.map((url, index) => (
            <Button key={url} asChild variant="ghost" size="sm">
              <a href={url ?? "#"} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" aria-hidden />
                URL {index + 1}
              </a>
            </Button>
          ))}
        </div>
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
