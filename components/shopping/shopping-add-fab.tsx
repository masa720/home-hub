"use client";

import { useRef } from "react";
import { Plus, X } from "lucide-react";
import { ShoppingItemForm } from "@/components/shopping/shopping-item-form";
import { Button } from "@/components/ui/button";
import type { Store } from "@/types/database";

type ShoppingAddFabProps = {
  stores: Store[];
};

export function ShoppingAddFab({ stores }: ShoppingAddFabProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        size="icon"
        aria-label="買い物を追加"
        className="fixed bottom-24 right-4 z-30 size-14 rounded-full shadow-soft sm:right-[calc((100vw-48rem)/2+1.5rem)]"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Plus className="size-7" aria-hidden />
      </Button>

      <dialog
        ref={dialogRef}
        className="w-[min(42rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <h2 className="font-semibold text-white">買い物を追加</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="閉じる" onClick={() => dialogRef.current?.close()}>
            <X className="size-5" aria-hidden />
          </Button>
        </div>
        <div className="p-4" onSubmit={() => setTimeout(() => dialogRef.current?.close(), 0)}>
          <ShoppingItemForm stores={stores} showCancel />
        </div>
      </dialog>
    </>
  );
}
