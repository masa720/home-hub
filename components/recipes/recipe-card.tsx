import Link from "next/link";
import { ExternalLink, Heart, Trash2, Utensils } from "lucide-react";
import { deleteRecipe, toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils/cn";
import type { Recipe } from "@/types/database";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <article className="rounded-2xl bg-card p-4 shadow-card">
      <Link href={`/recipes/${recipe.id}`} className="block">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-foreground">{recipe.title}</h2>
            {recipe.description ? <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{recipe.description}</p> : null}
          </div>
          {recipe.is_favorite ? <Heart className="size-4 shrink-0 fill-rose-500 text-rose-500" aria-label="Fav" /> : null}
        </div>
      </Link>

      <div className="mt-3 flex items-center gap-1">
        <form action={toggleRecipeCooked}>
          <input type="hidden" name="id" value={recipe.id} />
          <input type="hidden" name="is_cooked" value={String(recipe.is_cooked)} />
          <input type="hidden" name="cooked_count" value={recipe.cooked_count} />
          <SubmitButton
            variant="ghost"
            size="sm"
            className={cn("h-8 min-h-8 gap-1 px-2 text-[11px]", recipe.is_cooked && "text-success")}
          >
            <Utensils className="size-3.5" aria-hidden />
            {recipe.is_cooked ? `${recipe.cooked_count}x` : "New"}
          </SubmitButton>
        </form>
        <form action={toggleRecipeFavorite}>
          <input type="hidden" name="id" value={recipe.id} />
          <input type="hidden" name="is_favorite" value={String(recipe.is_favorite)} />
          <SubmitButton variant="ghost" size="sm" className="h-8 min-h-8 gap-1 px-2 text-[11px]">
            <Heart className={cn("size-3.5", recipe.is_favorite && "fill-rose-500 text-rose-500")} aria-hidden />
          </SubmitButton>
        </form>
        {recipe.youtube_url || recipe.url_1 ? (
          <Button asChild variant="ghost" size="sm" className="h-8 min-h-8 gap-1 px-2 text-[11px]">
            <a href={recipe.youtube_url ?? recipe.url_1 ?? "#"} target="_blank" rel="noreferrer">
              <ExternalLink className="size-3.5" aria-hidden />
            </a>
          </Button>
        ) : null}
        <form action={deleteRecipe} className="ml-auto">
          <input type="hidden" name="id" value={recipe.id} />
          <SubmitButton variant="ghost" size="sm" className="h-8 min-h-8 px-2 text-[11px] text-destructive">
            <Trash2 className="size-3.5" aria-hidden />
          </SubmitButton>
        </form>
      </div>
    </article>
  );
}
