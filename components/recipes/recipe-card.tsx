import { ExternalLink, Heart, Trash2, Utensils } from "lucide-react";
import { deleteRecipe, toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { RecipeEditModal } from "@/components/recipes/recipe-edit-modal";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Recipe } from "@/types/database";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <RecipeEditModal
        title="✏️ レシピを編集"
        label={
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <h2 className="font-semibold text-white">{recipe.title}</h2>
              {recipe.description ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{recipe.description}</p> : null}
            </div>
            {recipe.is_favorite ? <Heart className="size-5 shrink-0 fill-rose-400 text-rose-400" aria-label="お気に入り" /> : null}
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
          <form action={toggleRecipeFavorite}>
            <input type="hidden" name="id" value={recipe.id} />
            <input type="hidden" name="is_favorite" value={String(recipe.is_favorite)} />
            <SubmitButton variant="ghost" size="sm">
              <Heart className={recipe.is_favorite ? "size-4 fill-rose-400 text-rose-400" : "size-4"} aria-hidden />
              お気に入り
            </SubmitButton>
          </form>
          {[recipe.youtube_url, recipe.url_1, recipe.url_2].filter(Boolean).map((url, index) => (
            <Button key={url} asChild variant="ghost" size="sm">
              <a href={url ?? "#"} target="_blank" rel="noreferrer">
                <ExternalLink className="size-4" aria-hidden />
                URL {index + 1}
              </a>
            </Button>
          ))}
        </div>
        {recipe.memo ? (
          <div className="mb-4 rounded-lg bg-slate-950/40 p-3">
            <p className="whitespace-pre-wrap text-sm leading-6 text-muted-foreground">{recipe.memo}</p>
          </div>
        ) : null}
        <RecipeForm recipe={recipe} />
        <form action={deleteRecipe} className="mt-3">
          <input type="hidden" name="id" value={recipe.id} />
          <SubmitButton variant="danger" size="sm" className="w-full">
            <Trash2 className="size-4" aria-hidden />
            削除
          </SubmitButton>
        </form>
      </RecipeEditModal>
    </article>
  );
}
