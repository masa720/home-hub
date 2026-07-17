"use server";

import { revalidatePath } from "next/cache";
import { requireRequestAuth } from "@/lib/auth/server";
import { optionalString, requiredString } from "@/lib/utils/form";
import type { Priority } from "@/types/database";

async function getUserId() {
  return requireRequestAuth();
}

function revalidateShopping() {
  revalidatePath("/shopping");
}

export async function createShoppingItem(formData: FormData) {
  const name = requiredString(formData.get("name"));
  if (!name) return;

  const { supabase, userId } = await getUserId();
  const storeId = optionalString(formData.get("store_id"));
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

  const { supabase } = await getUserId();
  const storeId = optionalString(formData.get("store_id"));
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
