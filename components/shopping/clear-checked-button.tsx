"use client";

import { useRef } from "react";
import { Trash2, X } from "lucide-react";
import { clearCheckedItems } from "@/app/(app)/shopping/actions";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";

type ClearCheckedButtonProps = {
  count: number;
};

export function ClearCheckedButton({ count }: ClearCheckedButtonProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="ml-auto shrink-0 px-2 py-1 text-xs font-medium text-red-400 hover:text-red-300"
        onClick={(e) => {
          e.preventDefault();
          dialogRef.current?.showModal();
        }}
      >
        <Trash2 className="mr-1 inline size-3" aria-hidden />
        一括クリア
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="p-4">
          <p className="text-sm font-semibold text-white">購入済み{count}件を削除しますか？</p>
          <p className="mt-1 text-xs text-muted-foreground">この操作は取り消せません。</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => dialogRef.current?.close()}>
              キャンセル
            </Button>
            <form action={clearCheckedItems}>
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
