"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { optionalString, requiredString } from "@/lib/utils/form";
import type { Priority } from "@/types/database";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("ログインが必要です。");
  }

  return { supabase, userId: user.id };
}

function revalidateShopping() {
  revalidatePath("/");
  revalidatePath("/shopping");
}

async function resolveStoreId({
  supabase,
  userId,
  storeName,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  userId: string;
  storeName: FormDataEntryValue | null;
}) {
  const name = optionalString(storeName);
  if (!name) return null;

  const { data: existingStore, error: selectError } = await supabase
    .from("stores")
    .select("id")
    .eq("name", name)
    .maybeSingle();

  if (selectError) throw new Error(selectError.message);
  if (existingStore) return existingStore.id;

  const { data: newStore, error: insertError } = await supabase
    .from("stores")
    .insert({
      user_id: userId,
      name,
      color: "#94a3b8",
    })
    .select("id")
    .single();

  if (insertError) throw new Error(insertError.message);
  return newStore.id;
}

export async function createShoppingItem(formData: FormData) {
  const name = requiredString(formData.get("name"));
  if (!name) return;

  const { supabase, userId } = await getUserId();
  const storeId = await resolveStoreId({ supabase, userId, storeName: formData.get("store_name") });
  const quantity = optionalString(formData.get("quantity")) ?? "1";
  const unit = optionalString(formData.get("unit")) ?? "個";
  const { error } = await supabase.from("shopping_items").insert({
    user_id: userId,
    name,
    store_id: storeId,
    quantity,
    unit,
    note: optionalString(formData.get("note")),
    priority: (optionalString(formData.get("priority")) ?? "normal") as Priority,
  });

  if (error) throw new Error(error.message);
  revalidateShopping();
}

export async function updateShoppingItem(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const name = requiredString(formData.get("name"));
  if (!id || !name) return;

  const { supabase, userId } = await getUserId();
  const storeId = await resolveStoreId({ supabase, userId, storeName: formData.get("store_name") });
  const quantity = optionalString(formData.get("quantity")) ?? "1";
  const unit = optionalString(formData.get("unit")) ?? "個";
  const { error } = await supabase
    .from("shopping_items")
    .update({
      name,
      store_id: storeId,
      quantity,
      unit,
      note: optionalString(formData.get("note")),
      priority: (optionalString(formData.get("priority")) ?? "normal") as Priority,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateShopping();
}

export async function toggleShoppingItem(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const isChecked = requiredString(formData.get("is_checked")) === "true";
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("shopping_items").update({ is_checked: !isChecked }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidateShopping();
}

export async function deleteShoppingItem(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("shopping_items").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateShopping();
}

export async function clearCheckedItems() {
  const { supabase, userId } = await getUserId();
  const { error } = await supabase.from("shopping_items").delete().eq("user_id", userId).eq("is_checked", true);

  if (error) throw new Error(error.message);
  revalidateShopping();
}
