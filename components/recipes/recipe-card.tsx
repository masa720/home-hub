import Link from "next/link";
import { ExternalLink, Heart, Trash2, Utensils } from "lucide-react";
import { deleteRecipe, toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Recipe } from "@/types/database";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="rounded-lg border bg-card p-4">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h2 className="font-semibold text-white">{recipe.title}</h2>
            {recipe.description ? <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{recipe.description}</p> : null}
          </div>
          {recipe.is_favorite ? <Heart className="size-5 shrink-0 fill-rose-400 text-rose-400" aria-label="お気に入り" /> : null}
        </div>
      </Link>

      <div className="mt-4 flex flex-wrap gap-2">
        <form action={toggleRecipeCooked}>
          <input type="hidden" name="id" value={recipe.id} />
          <input type="hidden" name="is_cooked" value={String(recipe.is_cooked)} />
          <input type="hidden" name="cooked_count" value={recipe.cooked_count} />
          <SubmitButton variant={recipe.is_cooked ? "secondary" : "outline"} size="sm">
            <Utensils className="size-4" aria-hidden />
            {recipe.is_cooked ? "作った" : "未作成"}
          </SubmitButton>
        </form>
        <form action={toggleRecipeFavorite}>
          <input type="hidden" name="id" value={recipe.id} />
          <input type="hidden" name="is_favorite" value={String(recipe.is_favorite)} />
          <SubmitButton variant="ghost" size="sm">
            <Heart className="size-4" aria-hidden />
            お気に入り
          </SubmitButton>
        </form>
        {recipe.youtube_url || recipe.url_1 ? (
          <Button asChild variant="ghost" size="sm">
            <a href={recipe.youtube_url ?? recipe.url_1 ?? "#"} target="_blank" rel="noreferrer">
              <ExternalLink className="size-4" aria-hidden />
              開く
            </a>
          </Button>
        ) : null}
        <form action={deleteRecipe} className="ml-auto">
          <input type="hidden" name="id" value={recipe.id} />
          <SubmitButton variant="ghost" size="sm" className="text-red-300">
            <Trash2 className="size-4" aria-hidden />
            削除
          </SubmitButton>
        </form>
      </div>
    </article>
  );
}
