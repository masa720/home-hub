"use client";

import { useOptimistic, useState, useTransition } from "react";
import { toggleShoppingItem } from "@/app/(app)/shopping/actions";
import { DeleteShoppingItemButton } from "@/components/shopping/delete-shopping-item-button";
import { ShoppingEditModal } from "@/components/shopping/shopping-edit-modal";
import { ShoppingItemForm } from "@/components/shopping/shopping-item-form";
import { cn } from "@/lib/utils/cn";
import { storeColorMap } from "@/lib/utils/stores";
import type { ShoppingItemWithStore } from "@/lib/db/shopping";
import type { Store } from "@/types/database";

type ShoppingItemCardProps = {
  item: ShoppingItemWithStore;
  stores: Store[];
  isSaving?: boolean;
};

export function ShoppingItemCard({ item, stores, isSaving = false }: ShoppingItemCardProps) {
  const [optimisticDeleted, setOptimisticDeleted] = useState(false);
  const [optimisticChecked, setOptimisticChecked] = useOptimistic(item.is_checked);
  const [, startTransition] = useTransition();

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

  if (optimisticDeleted) return null;

  return (
    <tr className={cn("border-b border-border last:border-b-0", optimisticChecked && "opacity-50", isSaving && "opacity-70")}>
      <td className="w-10 py-2 pl-3 pr-1 align-middle">
        <button
          type="button"
          onClick={handleToggle}
          disabled={isSaving}
          aria-label={optimisticChecked ? "未購入に戻す" : "購入済みにする"}
          className={cn(
            "flex size-6 items-center justify-center rounded border-2 text-xs",
            optimisticChecked ? "border-primary bg-primary text-primary-foreground" : "border-slate-500 bg-slate-950",
          )}
        >
          {optimisticChecked ? "✓" : ""}
        </button>
      </td>
      <td className="py-2 align-middle">
        {isSaving ? (
          <>
            <span className="text-sm font-medium text-white">{item.name}</span>
            <p className="text-[11px] text-muted-foreground">Saving…</p>
          </>
        ) : (
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
        )}
      </td>
      <td className="py-2 pr-1 text-right align-middle">
        {item.store ? (
          <span
            className="store-badge inline-flex whitespace-nowrap items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
            style={storeBadgeStyle}
          >
            {item.store.name}
          </span>
        ) : null}
      </td>
      <td className="w-8 py-2 pr-2 align-middle">
        {isSaving ? null : (
          <DeleteShoppingItemButton
            itemId={item.id}
            name={item.name}
            onOptimisticDelete={() => setOptimisticDeleted(true)}
            onDeleteFailed={() => setOptimisticDeleted(false)}
          />
        )}
      </td>
    </tr>
  );
}
