"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/utils/form";
import { requiredString } from "@/lib/utils/form";

export async function updateDisplayName(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const displayName = requiredString(formData.get("display_name"));

  if (!displayName) {
    return { ok: false, message: "ユーザー名を入力してください。" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "ログインしてください。" };
  }

  const { error } = await supabase.from("profiles").update({ display_name: displayName }).eq("id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/settings");
  return { ok: true, message: "ユーザー名を更新しました。" };
}

export async function joinHousehold(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const code = requiredString(formData.get("household_id"));

  if (!code) {
    return { ok: false, message: "共有コードを入力してください。" };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "ログインしてください。" };
  }

  // Verify household code exists (uses security definer to bypass RLS)
  const { data: exists } = await supabase.rpc("verify_household_code", { code });

  if (!exists) {
    return { ok: false, message: "該当する共有コードが見つかりません。" };
  }

  const { error } = await supabase.from("profiles").update({ household_id: code }).eq("id", user.id);

  if (error) {
    return { ok: false, message: error.message };
  }

  revalidatePath("/", "layout");
  return { ok: true, message: "家族共有を設定しました。" };
}

export async function createStore(formData: FormData) {
  const name = requiredString(formData.get("name"));
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です。");

  const { error } = await supabase.from("stores").insert({
    user_id: user.id,
    name,
    color: "#94a3b8",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/shopping");
}

export async function deleteStore(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("stores").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/shopping");
}

export async function createExpenseCategory(formData: FormData) {
  const name = requiredString(formData.get("name"));
  if (!name) return;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("ログインが必要です。");

  const { error } = await supabase.from("expense_categories").insert({
    user_id: user.id,
    name,
    color: "#94a3b8",
  });

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/expenses");
}

export async function deleteExpenseCategory(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const supabase = await createClient();
  const { error } = await supabase.from("expense_categories").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidatePath("/settings");
  revalidatePath("/expenses");
}
