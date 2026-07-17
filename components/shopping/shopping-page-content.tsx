"use client";

import { useOptimistic } from "react";
import { createShoppingItem } from "@/app/(app)/shopping/actions";
import { EmptyState } from "@/components/empty-state";
import { ClearCheckedButton } from "@/components/shopping/clear-checked-button";
import { ShoppingAddFab } from "@/components/shopping/shopping-add-fab";
import { ShoppingItemCard } from "@/components/shopping/shopping-item-card";
import { StoreFilter } from "@/components/shopping/store-filter";
import type { ShoppingItemWithStore } from "@/lib/db/shopping";
import type { Priority, Store } from "@/types/database";

type ShoppingPageContentProps = {
  stores: Store[];
  items: ShoppingItemWithStore[];
  currentStoreId?: string;
};

function optionalFormText(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function optimisticId() {
  return `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function ShoppingPageContent({ stores, items, currentStoreId }: ShoppingPageContentProps) {
  const [optimisticItems, addOptimisticItem] = useOptimistic(
    items,
    (currentItems, item: ShoppingItemWithStore) => [item, ...currentItems],
  );

  async function createOptimistically(formData: FormData) {
    const name = optionalFormText(formData, "name");
    const storeId = optionalFormText(formData, "store_id");
    const now = new Date().toISOString();

    if (name && (!currentStoreId || currentStoreId === storeId)) {
      const store = storeId ? stores.find((candidate) => candidate.id === storeId) ?? null : null;
      const priorityValue = optionalFormText(formData, "priority");
      const priority: Priority =
        priorityValue === "high" || priorityValue === "low" ? priorityValue : "normal";

      addOptimisticItem({
        id: optimisticId(),
        user_id: "",
        name,
        store_id: storeId,
        quantity: optionalFormText(formData, "quantity") ?? "1",
        unit: optionalFormText(formData, "unit") ?? "個",
        note: optionalFormText(formData, "note"),
        is_checked: false,
        priority,
        created_at: now,
        updated_at: now,
        checked_at: null,
        store,
      });
    }

    try {
      await createShoppingItem(formData);
    } catch {
      window.alert("追加できませんでした。通信状態を確認して、もう一度お試しください。");
    }
  }

  const openItems = optimisticItems.filter((item) => !item.is_checked);
  const checkedItems = optimisticItems.filter((item) => item.is_checked);
  const priorityGroups = [
    { key: "high", label: "🔥 優先" },
    { key: "normal", label: "📌 通常" },
    { key: "low", label: "💤 低め" },
  ] as const;
  const groupedItems = priorityGroups
    .map((group) => ({
      ...group,
      items: openItems.filter((item) => item.priority === group.key),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <ShoppingAddFab stores={stores} createAction={createOptimistically} />
      <StoreFilter stores={stores} currentStoreId={currentStoreId} />

      {openItems.length > 0 ? (
        groupedItems.map((group) => (
          <section key={group.key}>
            {groupedItems.length > 1 ? (
              <p className="px-1 pb-1 text-xs font-semibold text-muted-foreground">{group.label}</p>
            ) : null}
            <div className="rounded-lg border bg-card">
              <table className="w-full">
                <tbody>
                  {group.items.map((item) => (
                    <ShoppingItemCard
                      key={item.id}
                      item={item}
                      stores={stores}
                      isSaving={item.id.startsWith("optimistic-")}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      ) : (
        <section className="rounded-lg border bg-card p-4">
          <EmptyState title="未購入の商品はありません" description="右下の追加ボタンから登録できます。" />
        </section>
      )}

      {checkedItems.length > 0 ? (
        <details className="rounded-lg border bg-card/70">
          <summary className="flex cursor-pointer list-none items-center px-3 py-2 text-sm font-semibold text-muted-foreground">
            ✅ 購入済み {checkedItems.length}件
            <ClearCheckedButton count={checkedItems.length} />
          </summary>
          <table className="w-full">
            <tbody>
              {checkedItems.map((item) => (
                <ShoppingItemCard key={item.id} item={item} stores={stores} />
              ))}
            </tbody>
          </table>
        </details>
      ) : null}
    </>
  );
}
