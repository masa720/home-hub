"use client";

import { useRef } from "react";
import { Trash2 } from "lucide-react";
import { deleteShoppingItem } from "@/app/(app)/shopping/actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";

type DeleteShoppingItemButtonProps = {
  itemId: string;
  name: string;
};

export function DeleteShoppingItemButton({ itemId, name }: DeleteShoppingItemButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        variant="ghost"
        size="sm"
        className="size-7 min-h-7 min-w-7 p-0 text-red-400 hover:text-red-300"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Trash2 className="size-3.5" aria-hidden />
      </Button>

      <dialog
        ref={dialogRef}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="p-4">
          <p className="text-sm font-semibold text-white">「{name}」を削除しますか？</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => dialogRef.current?.close()}>
              キャンセル
            </Button>
            <form action={deleteShoppingItem}>
              <input type="hidden" name="id" value={itemId} />
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
