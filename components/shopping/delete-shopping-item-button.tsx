"use client";

import { useRef, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { deleteShoppingItem } from "@/app/(app)/shopping/actions";
import { Button } from "@/components/ui/button";

type DeleteShoppingItemButtonProps = {
  itemId: string;
  name: string;
  onOptimisticDelete?: () => void;
  onDeleteFailed?: () => void;
};

export function DeleteShoppingItemButton({ itemId, name, onOptimisticDelete, onDeleteFailed }: DeleteShoppingItemButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [pending, startTransition] = useTransition();

  function handleDelete() {
    const formData = new FormData();
    formData.append("id", itemId);
    dialogRef.current?.close();

    startTransition(async () => {
      onOptimisticDelete?.();
      try {
        await deleteShoppingItem(formData);
      } catch {
        onDeleteFailed?.();
        window.alert("削除できませんでした。時間をおいて再試行してください。");
      }
    });
  }

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
            <Button type="button" variant="danger" size="sm" disabled={pending} onClick={handleDelete}>
              削除する
            </Button>
          </div>
        </div>
      </dialog>
    </>
  );
}
