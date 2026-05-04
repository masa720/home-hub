import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ShoppingAddFab } from "@/components/shopping/shopping-add-fab";
import { ShoppingItemCard } from "@/components/shopping/shopping-item-card";
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
      <PageHeader title="Shopping" />
      <ShoppingAddFab stores={stores} />
      <StoreFilter stores={stores} currentStoreId={store} />

      <section className="rounded-2xl bg-card shadow-card">
        {openItems.length > 0 ? (
          <div className="divide-y">
            {openItems.map((item) => <ShoppingItemCard key={item.id} item={item} stores={stores} />)}
          </div>
        ) : (
          <EmptyState title="No items" description="Tap + to add" />
        )}
      </section>

      {checkedItems.length > 0 ? (
        <details className="rounded-2xl bg-card shadow-card">
          <summary className="cursor-pointer list-none px-4 py-3 text-sm font-medium text-muted-foreground">
            Done ({checkedItems.length})
          </summary>
          <div className="divide-y border-t">
            {checkedItems.map((item) => <ShoppingItemCard key={item.id} item={item} stores={stores} />)}
          </div>
        </details>
      ) : null}
    </>
  );
}
