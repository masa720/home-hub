import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ShoppingItemCard } from "@/components/shopping/shopping-item-card";
import { ShoppingItemForm } from "@/components/shopping/shopping-item-form";
import { StoreFilter } from "@/components/shopping/store-filter";
import { getShoppingItems, getStores } from "@/lib/db/shopping";
import { createClient } from "@/lib/supabase/server";

type ShoppingPageProps = {
  searchParams: Promise<{ store?: string }>;
};

export default async function ShoppingPage({ searchParams }: ShoppingPageProps) {
  const { store } = await searchParams;
  const supabase = await createClient();
  const [stores, items] = await Promise.all([getStores(supabase), getShoppingItems(supabase)]);
  const filteredItems = store ? items.filter((item) => item.store_id === store) : items;
  const openItems = filteredItems.filter((item) => !item.is_checked);
  const checkedItems = filteredItems.filter((item) => item.is_checked);

  return (
    <>
      <PageHeader title="買い物リスト" />
      <ShoppingItemForm stores={stores} />
      <StoreFilter stores={stores} currentStoreId={store} />

      <section className="space-y-3">
        {openItems.length > 0 ? (
          openItems.map((item) => <ShoppingItemCard key={item.id} item={item} stores={stores} />)
        ) : (
          <EmptyState title="未購入の商品はありません" description="必要なものを上のフォームから追加できます。" />
        )}
      </section>

      <details className="rounded-lg border bg-card/70 p-4">
        <summary className="cursor-pointer list-none font-semibold text-white">購入済み {checkedItems.length}件</summary>
        <div className="mt-4 space-y-3">
          {checkedItems.length > 0 ? (
            checkedItems.map((item) => <ShoppingItemCard key={item.id} item={item} stores={stores} />)
          ) : (
            <p className="text-sm text-muted-foreground">購入済みの商品はまだありません。</p>
          )}
        </div>
      </details>
    </>
  );
}
