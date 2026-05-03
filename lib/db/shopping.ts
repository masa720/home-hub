import "server-only";

import type { ShoppingItem, Store } from "@/types/database";
import type { createClient } from "@/lib/supabase/server";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export const defaultStoreNames = [
  "リカーショップ",
  "スーパーストア",
  "T&T",
  "コストコ",
  "ウォルマート",
  "ダララマ",
  "ダイソー",
  "シティマーケット",
  "ロンドンドラッグ",
  "セーフウェイ",
  "Hマート",
] as const;

export const storeColorMap: Record<string, { background: string; border: string; text: string }> = {
  リカーショップ: { background: "#b7a3cf33", border: "#b7a3cf", text: "#7c6698" },
  スーパーストア: { background: "#fde5d933", border: "#f4c9b8", text: "#a66f5c" },
  "T&T": { background: "#e9f7df66", border: "#d6ebc8", text: "#5d8551" },
  コストコ: { background: "#fff4cf66", border: "#eadca9", text: "#8d761d" },
  ウォルマート: { background: "#e0f1fb66", border: "#c4ddea", text: "#4d7d99" },
  ダララマ: { background: "#b8ccd333", border: "#aac0c8", text: "#55717b" },
  ダイソー: { background: "#eadff033", border: "#d9c7e5", text: "#806390" },
  シティマーケット: { background: "#cdb9a733", border: "#c8ad99", text: "#7c604c" },
  ロンドンドラッグ: { background: "#ee9d9d33", border: "#e99b9b", text: "#a94f4f" },
  セーフウェイ: { background: "#fee4e233", border: "#f7cbc9", text: "#9f615e" },
  Hマート: { background: "#a9c4e633", border: "#a9c4e6", text: "#4f6f99" },
};

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
