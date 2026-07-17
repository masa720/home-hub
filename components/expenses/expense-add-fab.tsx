"use client";

import { useRef } from "react";
import Link from "next/link";
import { Plus, Settings, X } from "lucide-react";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { Button } from "@/components/ui/button";
import type { ExpenseCategory } from "@/types/database";

type ExpenseAddFabProps = {
  categories: ExpenseCategory[];
  defaultEnteredByName: string;
  createAction?: (formData: FormData) => Promise<void>;
};

export function ExpenseAddFab({ categories, defaultEnteredByName, createAction }: ExpenseAddFabProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <Button
        type="button"
        size="icon"
        aria-label="家計簿を追加"
        className="fixed bottom-24 right-4 z-30 size-14 rounded-full shadow-soft sm:right-[calc((100vw-48rem)/2+1.5rem)]"
        onClick={() => dialogRef.current?.showModal()}
      >
        <Plus className="size-7" aria-hidden />
      </Button>

      <dialog
        ref={dialogRef}
        className="w-[min(42rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <h2 className="font-semibold text-white">家計簿を追加</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="閉じる" onClick={() => dialogRef.current?.close()}>
            <X className="size-5" aria-hidden />
          </Button>
        </div>
        <div className="p-3" onSubmit={() => setTimeout(() => dialogRef.current?.close(), 0)}>
          <ExpenseForm
            categories={categories}
            defaultEnteredByName={defaultEnteredByName}
            showCancel
            createAction={createAction}
          />
          <Link
            href="/settings/categories"
            className="mt-2 inline-flex items-center gap-1 px-1 text-xs text-muted-foreground hover:text-white"
            onClick={() => dialogRef.current?.close()}
          >
            <Settings className="size-3" aria-hidden />
            カテゴリを管理
          </Link>
        </div>
      </dialog>
    </>
  );
}
