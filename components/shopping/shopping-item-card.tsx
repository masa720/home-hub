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
        backgroundColor: `${item.store.color}22`,
        borderColor: item.store.color,
        color: item.store.color,
      }
    : undefined;

  return (
    <article className={cn("rounded-lg border bg-card px-4 py-3", item.is_checked && "opacity-65")}>
      <div className="flex gap-3">
        <form action={toggleShoppingItem}>
          <input type="hidden" name="id" value={item.id} />
          <input type="hidden" name="is_checked" value={String(item.is_checked)} />
          <button
            type="submit"
            aria-label={item.is_checked ? "未購入に戻す" : "購入済みにする"}
            className={cn(
              "mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border-2",
              item.is_checked ? "border-primary bg-primary text-primary-foreground" : "border-slate-500 bg-slate-950",
            )}
          >
            {item.is_checked ? "✓" : ""}
          </button>
        </form>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                <h2 className={cn("font-semibold text-white", item.is_checked && "line-through")}>{item.name}</h2>
                <span className="text-sm text-muted-foreground">{quantity || "数量未設定"}</span>
                {item.store ? (
                  <span
                    className="inline-flex min-h-7 items-center rounded-full border px-3 text-sm font-semibold"
                    style={storeBadgeStyle}
                  >
                    {item.store.name}
                  </span>
                ) : null}
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {item.priority === "high" ? (
                <span className="mr-1 rounded-md bg-red-500/15 px-2 py-1 text-xs font-semibold text-red-200">優先</span>
              ) : null}
              <details className="group relative">
                <summary className="list-none">
                  <Button asChild variant="ghost" size="sm" className="cursor-pointer text-muted-foreground">
                    <span>
                      <Pencil className="size-4" aria-hidden />
                      編集
                    </span>
                  </Button>
                </summary>
                <div className="absolute right-0 top-11 z-20 w-[min(22rem,calc(100vw-3rem))] rounded-lg border bg-card p-3 shadow-soft">
                  <ShoppingItemForm stores={stores} item={item} compact />
                </div>
              </details>
              <form action={deleteShoppingItem}>
                <input type="hidden" name="id" value={item.id} />
                <SubmitButton variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                  <Trash2 className="size-4" aria-hidden />
                  削除
                </SubmitButton>
              </form>
            </div>
          </div>
          {item.note ? <p className="mt-3 rounded-md bg-muted px-3 py-2 text-sm text-muted-foreground">{item.note}</p> : null}
        </div>
      </div>
    </article>
  );
}
