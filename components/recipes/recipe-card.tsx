"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { DeleteRecipeButton } from "@/components/recipes/delete-recipe-button";
import { RecipeEditModal } from "@/components/recipes/recipe-edit-modal";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { cn } from "@/lib/utils/cn";
import type { Recipe } from "@/types/database";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [optimisticDeleted, setOptimisticDeleted] = useState(false);
  const [optimisticCooked, setOptimisticCooked] = useOptimistic(recipe.is_cooked);
  const [optimisticFavorite, setOptimisticFavorite] = useOptimistic(recipe.is_favorite);
  const [, startTransition] = useTransition();

  function handleToggleCooked() {
    const formData = new FormData();
    formData.append("id", recipe.id);
    formData.append("is_cooked", String(recipe.is_cooked));
    startTransition(async () => {
      setOptimisticCooked(!optimisticCooked);
      await toggleRecipeCooked(formData);
    });
  }

  function handleToggleFavorite() {
    const formData = new FormData();
    formData.append("id", recipe.id);
    formData.append("is_favorite", String(recipe.is_favorite));
    startTransition(async () => {
      setOptimisticFavorite(!optimisticFavorite);
      await toggleRecipeFavorite(formData);
    });
  }

  if (optimisticDeleted) return null;

  return (
    <article className="flex items-center gap-3 rounded-lg border bg-card p-4">
      <button
        type="button"
        onClick={handleToggleCooked}
        aria-label={optimisticCooked ? "未作成に戻す" : "作ったにする"}
        className={cn(
          "flex size-6 shrink-0 items-center justify-center rounded border-2 text-xs",
          optimisticCooked ? "border-primary bg-primary text-primary-foreground" : "border-slate-500 bg-slate-950",
        )}
      >
        {optimisticCooked ? "✓" : ""}
      </button>

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
        <button
          type="button"
          onClick={handleToggleFavorite}
          aria-label={optimisticFavorite ? "お気に入り解除" : "お気に入りに追加"}
          className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <Heart className={optimisticFavorite ? "size-4 fill-rose-400 text-rose-400" : "size-4 text-muted-foreground"} aria-hidden />
        </button>
        <DeleteRecipeButton
          recipeId={recipe.id}
          title={recipe.title}
          onOptimisticDelete={() => setOptimisticDeleted(true)}
          onDeleteFailed={() => setOptimisticDeleted(false)}
        />
      </div>
    </article>
  );
}
