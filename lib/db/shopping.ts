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
    supabase
      .from("shopping_items")
      .select("*")
      .order("is_checked")
      .order("created_at", { ascending: false }),
    supabase.from("stores").select("*"),
  ]);

  if (itemsResult.error) throw new Error(itemsResult.error.message);
  if (storesResult.error) throw new Error(storesResult.error.message);

  const stores = new Map(storesResult.data.map((store) => [store.id, store]));
  const priorityOrder: Record<string, number> = { high: 0, normal: 1, low: 2 };
  return itemsResult.data
    .map((item) => ({
      ...item,
      store: item.store_id ? stores.get(item.store_id) ?? null : null,
    }))
    .toSorted((a, b) => {
      if (a.is_checked !== b.is_checked) return a.is_checked ? 1 : -1;
      const pa = priorityOrder[a.priority] ?? 1;
      const pb = priorityOrder[b.priority] ?? 1;
      if (pa !== pb) return pa - pb;
      const sa = a.store?.name ?? "";
      const sb = b.store?.name ?? "";
      if (sa !== sb) return sa.localeCompare(sb, "ja");
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    }) satisfies ShoppingItemWithStore[];
}

export async function getOpenShoppingItems(supabase: SupabaseServerClient, limit = 5) {
  const items = await getShoppingItems(supabase);
  return items.filter((item) => !item.is_checked).slice(0, limit);
}
