"use client";

import { useOptimistic, useTransition } from "react";
import { setRecurringExpenseActive } from "@/app/(app)/expenses/actions";
import { cn } from "@/lib/utils/cn";

type RecurringToggleProps = {
  id: string;
  isActive: boolean;
};

export function RecurringToggle({ id, isActive }: RecurringToggleProps) {
  const [pending, startTransition] = useTransition();
  const [optimisticActive, setOptimisticActive] = useOptimistic(isActive, (_current, next: boolean) => next);

  return (
    <button
      type="button"
      disabled={pending}
      className={cn(
        "relative h-7 w-12 rounded-full border transition active:scale-95 disabled:opacity-70",
        optimisticActive ? "border-sky-400 bg-sky-400" : "border-border bg-muted",
      )}
      aria-label={optimisticActive ? "固定費を停止" : "固定費を有効化"}
      aria-pressed={optimisticActive}
      onClick={() => {
        const next = !optimisticActive;
        startTransition(async () => {
          setOptimisticActive(next);
          await setRecurringExpenseActive(id, next);
        });
      }}
    >
      <span
        className={cn(
          "absolute top-0.5 size-5 rounded-full bg-white shadow transition",
          optimisticActive ? "left-6" : "left-0.5",
        )}
      />
    </button>
  );
}
