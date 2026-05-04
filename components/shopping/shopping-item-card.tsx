"use client";

import { useOptimistic, useRef, useTransition } from "react";
import { deleteShoppingItem, toggleShoppingItem } from "@/app/(app)/shopping/actions";
import { ShoppingEditModal } from "@/components/shopping/shopping-edit-modal";
import { ShoppingItemForm } from "@/components/shopping/shopping-item-form";
import { SwipeableRow } from "@/components/ui/swipeable-row";
import { Button } from "@/components/ui/button";
import { SubmitButton } from "@/components/ui/submit-button";
import { cn } from "@/lib/utils/cn";
import { storeColorMap } from "@/lib/utils/stores";
import type { ShoppingItemWithStore } from "@/lib/db/shopping";
import type { Store } from "@/types/database";

type ShoppingItemCardProps = {
  item: ShoppingItemWithStore;
  stores: Store[];
};

export function ShoppingItemCard({ item, stores }: ShoppingItemCardProps) {
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(item.is_checked);
  const [, startTransition] = useTransition();
  const dialogRef = useRef<HTMLDialogElement>(null);

  const mappedStoreColor = item.store ? storeColorMap[item.store.name] : undefined;
  const storeBadgeStyle = mappedStoreColor
    ? ({
        backgroundColor: mappedStoreColor.background,
        borderColor: mappedStoreColor.border,
        "--store-text-light": mappedStoreColor.textLight,
        "--store-text-dark": mappedStoreColor.textDark,
      } as React.CSSProperties)
    : item.store?.color
    ? ({
        backgroundColor: `${item.store.color}22`,
        borderColor: item.store.color,
        "--store-text-light": item.store.color,
        "--store-text-dark": item.store.color,
      } as React.CSSProperties)
    : undefined;

  function handleToggle() {
    const formData = new FormData();
    formData.append("id", item.id);
    formData.append("is_checked", String(item.is_checked));

    startTransition(async () => {
      setOptimisticChecked(!optimisticChecked);
      await toggleShoppingItem(formData);
    });
  }

  return (
    <>
      <SwipeableRow
        onSwipeLeft={handleToggle}
        onSwipeRight={() => dialogRef.current?.showModal()}
        className={cn("border-b border-border last:border-b-0", optimisticChecked && "opacity-50")}
      >
        <div className="flex items-center py-2 pl-3 pr-2">
          <button
            type="button"
            onClick={handleToggle}
            aria-label={optimisticChecked ? "未購入に戻す" : "購入済みにする"}
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded border-2 text-xs",
              optimisticChecked ? "border-primary bg-primary text-primary-foreground" : "border-slate-500 bg-slate-950",
            )}
          >
            {optimisticChecked ? "✓" : ""}
          </button>

          <div className="ml-2 min-w-0 flex-1">
            <ShoppingEditModal
              title="✏️ 買い物を編集"
              label={
                <>
                  <span className={cn("text-sm font-medium text-white", optimisticChecked && "line-through")}>{item.name}</span>
                  {item.note ? <p className="text-xs text-muted-foreground">{item.note}</p> : null}
                </>
              }
            >
              <ShoppingItemForm stores={stores} item={item} showCancel />
            </ShoppingEditModal>
          </div>

          {item.store ? (
            <span
              className="store-badge ml-2 inline-flex shrink-0 whitespace-nowrap items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
              style={storeBadgeStyle}
            >
              {item.store.name}
            </span>
          ) : null}
        </div>
      </SwipeableRow>

      <dialog
        ref={dialogRef}
        className="w-[min(20rem,calc(100vw-2rem))] rounded-lg border bg-card p-0 text-foreground shadow-soft backdrop:bg-black/55"
        onClick={(e) => {
          if (e.target === dialogRef.current) dialogRef.current?.close();
        }}
      >
        <div className="p-4">
          <p className="text-sm font-semibold text-white">「{item.name}」を削除しますか？</p>
          <div className="mt-4 flex justify-end gap-2">
            <Button type="button" variant="ghost" size="sm" onClick={() => dialogRef.current?.close()}>
              キャンセル
            </Button>
            <form action={deleteShoppingItem}>
              <input type="hidden" name="id" value={item.id} />
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
