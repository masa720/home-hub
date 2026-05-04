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
        variant="accent"
        size="icon"
        aria-label="Add item"
        className="fixed bottom-20 right-5 z-30 size-14 rounded-full shadow-modal"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Plus className="size-6" aria-hidden />
      </Button>

      <dialog
        ref={dialogRef}
        className="w-[min(24rem,calc(100vw-2rem))] rounded-2xl border bg-card p-0 text-foreground shadow-modal backdrop:bg-black/40"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b px-5 py-4">
          <h2 className="text-base font-bold text-foreground">Add item</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="Close" className="size-8 min-h-8 min-w-8" onClick={() => dialogRef.current?.close()}>
            <X className="size-4" aria-hidden />
          </Button>
        </div>
        <div className="p-5">
          <ShoppingItemForm stores={stores} showCancel />
        </div>
      </dialog>
    </>
  );
}
