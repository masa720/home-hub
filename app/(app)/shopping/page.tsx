import { clearCheckedItems } from "@/app/(app)/shopping/actions";
import { EmptyState } from "@/components/empty-state";
import { PageHeader } from "@/components/page-header";
import { ShoppingAddFab } from "@/components/shopping/shopping-add-fab";
import { ShoppingItemCard } from "@/components/shopping/shopping-item-card";
import { StoreFilter } from "@/components/shopping/store-filter";
import { SubmitButton } from "@/components/ui/submit-button";
import { getShoppingItems, getStores } from "@/lib/db/shopping";
import { createClient } from "@/lib/supabase/server";
import { Trash2 } from "lucide-react";

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
      <ShoppingAddFab stores={stores} />
      <StoreFilter stores={stores} currentStoreId={store} />

      <section className="rounded-lg border bg-card">
        {openItems.length > 0 ? (
          <table className="w-full">
            <tbody>
              {openItems.map((item) => <ShoppingItemCard key={item.id} item={item} stores={stores} />)}
            </tbody>
          </table>
        ) : (
          <div className="p-4">
            <EmptyState title="未購入の商品はありません" description="右下の追加ボタンから登録できます。" />
          </div>
        )}
      </section>

      {checkedItems.length > 0 ? (
        <details className="rounded-lg border bg-card/70">
          <summary className="cursor-pointer list-none px-3 py-2 text-sm font-semibold text-muted-foreground">
            購入済み {checkedItems.length}件
          </summary>
          <div className="flex justify-end border-b px-3 py-2">
            <form action={clearCheckedItems}>
              <SubmitButton variant="ghost" size="sm" className="text-red-400 hover:text-red-300">
                <Trash2 className="size-3.5" aria-hidden />
                一括クリア
              </SubmitButton>
            </form>
          </div>
          <table className="w-full">
            <tbody>
              {checkedItems.map((item) => <ShoppingItemCard key={item.id} item={item} stores={stores} />)}
            </tbody>
          </table>
        </details>
      ) : null}
    </>
  );
}
