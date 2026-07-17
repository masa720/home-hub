import { PageHeader } from "@/components/page-header";
import { ShoppingPageContent } from "@/components/shopping/shopping-page-content";
import { getShoppingPageData } from "@/lib/db/shopping";
import { createClient } from "@/lib/supabase/server";

type ShoppingPageProps = {
  searchParams: Promise<{ store?: string }>;
};

export default async function ShoppingPage({
  searchParams,
}: ShoppingPageProps) {
  const { store } = await searchParams;
  const supabase = await createClient();
  const { stores, items: filteredItems } = await getShoppingPageData(supabase, store);

  return (
    <>
      <PageHeader title="🛒 買い物リスト" />
      <ShoppingPageContent stores={stores} items={filteredItems} currentStoreId={store} />
    </>
  );
}
