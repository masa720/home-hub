import "server-only";

import type { ShoppingItem, Store } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";
import { defaultStoreNames } from "@/lib/utils/stores";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type ShoppingItemWithStore = ShoppingItem & {
  store: Store | null;
};

export async function getStores(supabase: SupabaseServerClient) {
  const { data, error } = await supabase.from("stores").select("*").order("name");
  if (error) throw new Error(error.message);
  return data.toSorted((a, b) => {
    const aIndex = defaultStoreNames.indexOf(a.name as (typeof defaultStoreNames)[number]);
    const bIndex = defaultStoreNames.indexOf(b.name as (typeof defaultStoreNames)[number]);

    if (aIndex >= 0 && bIndex >= 0) return aIndex - bIndex;
    if (aIndex >= 0) return -1;
    if (bIndex >= 0) return 1;
    return a.name.localeCompare(b.name, "ja");
  });
}

export async function getShoppingItems(supabase: SupabaseServerClient) {
  const [itemsResult, storesResult] = await Promise.all([
    supabase.from("shopping_items").select("*").order("is_checked").order("created_at", { ascending: false }),
    supabase.from("stores").select("*"),
  ]);

  if (itemsResult.error) throw new Error(itemsResult.error.message);
  if (storesResult.error) throw new Error(storesResult.error.message);

  const stores = new Map(storesResult.data.map((store) => [store.id, store]));
  return itemsResult.data.map((item) => ({
    ...item,
    store: item.store_id ? stores.get(item.store_id) ?? null : null,
  })) satisfies ShoppingItemWithStore[];
}

export async function getOpenShoppingItems(supabase: SupabaseServerClient, limit = 5) {
  const items = await getShoppingItems(supabase);
  return items.filter((item) => !item.is_checked).slice(0, limit);
}
