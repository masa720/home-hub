"use client";

import { useRef } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

type ShoppingEditModalProps = {
  label: React.ReactNode;
  title: string;
  children: React.ReactNode;
};

export function ShoppingEditModal({ label, title, children }: ShoppingEditModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  return (
    <>
      <button
        type="button"
        className="w-full cursor-pointer text-left"
        onClick={() => dialogRef.current?.showModal()}
      >
        {label}
      </button>

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
          <h2 className="font-semibold text-white">{title}</h2>
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
