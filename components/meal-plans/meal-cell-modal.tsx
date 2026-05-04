"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type MealCellModalProps = {
  label: string;
  note?: string | null;
  children: React.ReactNode;
};

export function MealCellModal({ label, note, children }: MealCellModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const isEmpty = label === "＋";

  return (
    <>
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        onClick={() => dialogRef.current?.showModal()}
      >
        <span className={isEmpty ? "text-xs text-muted-foreground" : "text-sm font-medium text-white"}>
          {label}
        </span>
        {note ? <p className="text-xs text-muted-foreground">{note}</p> : null}
      </button>

      <dialog
        ref={dialogRef}
        className="w-[min(28rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(event) => {
          if (event.target === dialogRef.current) {
            dialogRef.current?.close();
          }
        }}
      >
        <div className="flex items-center justify-between gap-3 border-b p-4">
          <h2 className="font-semibold text-white">{isEmpty ? "📅 献立を追加" : "✏️ 献立を編集"}</h2>
          <Button type="button" variant="ghost" size="icon" aria-label="閉じる" onClick={() => dialogRef.current?.close()}>
            <X className="size-5" aria-hidden />
          </Button>
        </div>
        <div className="p-4" onSubmit={() => setTimeout(() => dialogRef.current?.close(), 0)}>
          {children}
        </div>
      </dialog>
    </>
  );
}
