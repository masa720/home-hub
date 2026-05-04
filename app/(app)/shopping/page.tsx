import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ClearCheckedButton } from "@/components/shopping/clear-checked-button";
import { ShoppingAddFab } from "@/components/shopping/shopping-add-fab";
import { ShoppingItemCard } from "@/components/shopping/shopping-item-card";
import { StoreFilter } from "@/components/shopping/store-filter";
import { getShoppingItems, getStores } from "@/lib/db/shopping";
import { createClient } from "@/lib/supabase/server";

type ShoppingPageProps = {
  searchParams: Promise<{ store?: string }>;
};

export default async function ShoppingPage({
  searchParams,
}: ShoppingPageProps) {
  const { store } = await searchParams;
  const supabase = await createClient();
  const [stores, items] = await Promise.all([
    getStores(supabase),
    getShoppingItems(supabase),
  ]);
  const filteredItems = store
    ? items.filter((item) => item.store_id === store)
    : items;
  const openItems = filteredItems.filter((item) => !item.is_checked);
  const checkedItems = filteredItems.filter((item) => item.is_checked);

  const priorityGroups = [
    { key: "high", label: "優先" },
    { key: "normal", label: "通常" },
    { key: "low", label: "低め" },
  ] as const;
  const groupedItems = priorityGroups
    .map((group) => ({
      ...group,
      items: openItems.filter((item) => item.priority === group.key),
    }))
    .filter((group) => group.items.length > 0);

  return (
    <>
      <PageHeader title="買い物リスト" />
      <ShoppingAddFab stores={stores} />
      <StoreFilter stores={stores} currentStoreId={store} />

      {openItems.length > 0 ? (
        groupedItems.map((group) => (
          <section key={group.key}>
            {groupedItems.length > 1 ? (
              <p className="px-1 pb-1 text-[11px] font-semibold text-muted-foreground">
                {group.label}
              </p>
            ) : null}
            <div className="rounded-lg border bg-card">
              <table className="w-full">
                <tbody>
                  {group.items.map((item) => (
                    <ShoppingItemCard
                      key={item.id}
                      item={item}
                      stores={stores}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ))
      ) : (
        <section className="rounded-lg border bg-card p-4">
          <EmptyState
            title="未購入の商品はありません"
            description="右下の追加ボタンから登録できます。"
          />
        </section>
      )}

      {checkedItems.length > 0 ? (
        <details className="rounded-lg border bg-card/70">
          <summary className="flex cursor-pointer list-none items-center px-3 py-2 text-sm font-semibold text-muted-foreground">
            購入済み {checkedItems.length}件
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
