import { Trash2 } from "lucide-react";
import { deleteShoppingItem, toggleShoppingItem } from "@/app/(app)/shopping/actions";
import { ShoppingEditModal } from "@/components/shopping/shopping-edit-modal";
import { ShoppingItemForm } from "@/components/shopping/shopping-item-form";
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
  const mappedStoreColor = item.store ? storeColorMap[item.store.name] : undefined;
  const storeBadgeStyle = mappedStoreColor
    ? {
        backgroundColor: mappedStoreColor.background,
        borderColor: mappedStoreColor.border,
        color: mappedStoreColor.text,
      }
    : item.store?.color
    ? {
        backgroundColor: `${item.store.color}22`,
        borderColor: item.store.color,
        color: item.store.color,
      }
    : undefined;

  return (
    <tr className={cn("border-b border-border last:border-b-0", item.is_checked && "opacity-50")}>
      <td className="w-10 py-2 pl-3 pr-1 align-middle">
        <form action={toggleShoppingItem}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="is_checked" value={String(item.is_checked)} />
          <button
            type="submit"
            aria-label={item.is_checked ? "未購入に戻す" : "購入済みにする"}
            className={cn(
              "flex size-6 items-center justify-center rounded border-2 text-xs",
              item.is_checked ? "border-primary bg-primary text-primary-foreground" : "border-slate-500 bg-slate-950",
            )}
          >
            {item.is_checked ? "✓" : ""}
          </button>
        </form>
      </td>
      <td className="py-2 align-middle">
        <ShoppingEditModal
          title="✏️ 買い物を編集"
          label={
            <>
              <span className={cn("text-sm font-medium text-white", item.is_checked && "line-through")}>{item.name}</span>
              {item.note ? <p className="text-xs text-muted-foreground">{item.note}</p> : null}
            </>
          }
        >
          <ShoppingItemForm stores={stores} item={item} showCancel />
        </ShoppingEditModal>
      </td>
      <td className="py-2 pr-1 text-right align-middle">
        {item.store ? (
          <span
            className="inline-flex whitespace-nowrap items-center rounded-full border px-2 py-0.5 text-xs font-semibold"
            style={storeBadgeStyle}
          >
            {item.store.name}
          </span>
        ) : null}
      </td>
      <td className="w-8 py-2 pr-2 align-middle">
        <form action={deleteShoppingItem}>
          <input type="hidden" name="id" value={item.id} />
          <SubmitButton variant="ghost" size="sm" className="size-7 min-h-7 min-w-7 p-0 text-red-400 hover:text-red-300">
            <Trash2 className="size-3.5" aria-hidden />
          </SubmitButton>
        </form>
      </td>
    </tr>
  );
}
