"use client";

import { useOptimistic, useRef, useTransition } from "react";
import { Heart } from "lucide-react";
import { deleteRecipe, toggleRecipeCooked, toggleRecipeFavorite } from "@/app/(app)/recipes/actions";
import { RecipeEditModal } from "@/components/recipes/recipe-edit-modal";
import { RecipeForm } from "@/components/recipes/recipe-form";
import { SwipeableRow } from "@/components/ui/swipeable-row";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils/cn";
import type { Recipe } from "@/types/database";

type RecipeCardProps = {
  recipe: Recipe;
};

export function RecipeCard({ recipe }: RecipeCardProps) {
  const [optimisticCooked, setOptimisticCooked] = useOptimistic(recipe.is_cooked);
  const [, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  function handleToggleCooked() {
    const formData = new FormData();
    formData.append("id", recipe.id);
    formData.append("is_cooked", String(recipe.is_cooked));

    startTransition(async () => {
      setOptimisticCooked(!optimisticCooked);
      await toggleRecipeCooked(formData);
    });
  }

  return (
    <>
      <SwipeableRow
        onSwipeLeft={handleToggleCooked}
        onSwipeRight={() => dialogRef.current?.showModal()}
        className="rounded-lg border bg-card"
      >
        <div className="flex items-center gap-3 p-4">
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
            <form action={toggleRecipeFavorite}>
              <input type="hidden" name="id" value={recipe.id} />
              <input type="hidden" name="is_favorite" value={String(recipe.is_favorite)} />
              <SubmitButton variant="ghost" size="sm" className="size-8 min-h-8 min-w-8 p-0">
                <Heart className={recipe.is_favorite ? "size-4 fill-rose-400 text-rose-400" : "size-4 text-muted-foreground"} aria-hidden />
              </SubmitButton>
            </form>
          </div>
        </div>
      </SwipeableRow>

      <dialog
        ref={dialogRef}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="p-4">
          <p className="text-sm font-semibold text-white">「{recipe.title}」を削除しますか？</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => dialogRef.current?.close()}>
              キャンセル
            </Button>
            <form action={deleteRecipe}>
              <input type="hidden" name="id" value={recipe.id} />
              <SubmitButton variant="danger" size="sm">
                削除する
              </SubmitButton>
            </form>
          </div>
        </div>
      </dialog>
    </>
  );
}
