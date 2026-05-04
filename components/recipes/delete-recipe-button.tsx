"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { deleteRecipe } from "@/app/(app)/recipes/actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";

type DeleteRecipeButtonProps = {
  recipeId: string;
  title: string;
};

export function DeleteRecipeButton({ recipeId, title }: DeleteRecipeButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-8 min-h-8 min-w-8 p-0 text-red-400 hover:text-red-300"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Trash2 className="size-4" aria-hidden />
      </Button>

      <dialog
        ref={dialogRef}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="p-4">
          <p className="text-sm font-semibold text-white">「{title}」を削除しますか？</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => dialogRef.current?.close()}>
              キャンセル
            </Button>
            <form action={deleteRecipe}>
              <input type="hidden" name="id" value={recipeId} />
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
