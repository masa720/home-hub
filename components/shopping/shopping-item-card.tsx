import { Pencil, Trash2 } from "lucide-react";
import { deleteShoppingItem, toggleShoppingItem } from "@/app/(app)/shopping/actions";
import { ShoppingItemForm } from "@/components/shopping/shopping-item-form";
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
  const quantity = [item.quantity, item.unit].filter(Boolean).join(" ");
  const mappedStoreColor = item.store ? storeColorMap[item.store.name] : undefined;
  const storeBadgeStyle = mappedStoreColor
    ? {
        backgroundColor: mappedStoreColor.background,
        borderColor: mappedStoreColor.border,
        color: mappedStoreColor.text,
      }
    : item.store?.color
    ? {
        backgroundColor: `${item.store.color}18`,
        borderColor: `${item.store.color}40`,
        color: item.store.color,
      }
    : undefined;

  return (
    <article className={cn("px-4 py-3", item.is_checked && "opacity-50")}>
      <div className="flex gap-3">
        <form action={toggleShoppingItem}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="is_checked" value={String(item.is_checked)} />
          <button
            type="submit"
            aria-label={item.is_checked ? "Uncheck" : "Check"}
            className={cn(
              "mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full border-2 text-xs transition-colors",
              item.is_checked ? "border-success bg-success text-white" : "border-border",
            )}
          >
            {item.is_checked ? "✓" : ""}
          </button>
        </form>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
                <span className={cn("text-sm font-semibold text-foreground", item.is_checked && "line-through")}>
                  {item.name}
                </span>
                {quantity ? <span className="text-xs text-muted-foreground">{quantity}</span> : null}
                {item.priority === "high" ? (
                  <span className="rounded-full bg-destructive/10 px-1.5 py-0.5 text-[10px] font-bold text-destructive">!</span>
                ) : null}
              </div>
              <div className="mt-0.5 flex items-center gap-2">
                {item.store ? (
                  <span
                    className="inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold"
                    style={storeBadgeStyle}
                  >
                    {item.store.name}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 items-center">
              <details className="group relative">
                <summary className="list-none">
                  <Button asChild variant="ghost" size="sm" className="size-8 min-h-8 min-w-8 cursor-pointer p-0 text-muted-foreground">
                    <span>
                      <Pencil className="size-3.5" aria-hidden />
                    </span>
                  </Button>
                </summary>
                <div className="absolute right-0 top-9 z-20 w-[min(20rem,calc(100vw-3rem))] rounded-2xl border bg-card p-4 shadow-modal">
                  <ShoppingItemForm stores={stores} item={item} compact />
                </div>
              </details>
              <form action={deleteShoppingItem}>
                <input type="hidden" name="id" value={item.id} />
                <SubmitButton variant="ghost" size="sm" className="size-8 min-h-8 min-w-8 p-0 text-muted-foreground">
                  <Trash2 className="size-3.5" aria-hidden />
                </SubmitButton>
              </form>
            </div>
          </div>
          {item.note ? <p className="mt-1 text-xs text-muted-foreground">{item.note}</p> : null}
        </div>
      </div>
    </article>
  );
}
