"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/utils/form";
import { requiredString } from "@/lib/utils/form";

export async function updatePassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const password = requiredString(formData.get("password"));
  const confirmPassword = requiredString(formData.get("confirmPassword"));

  if (password.length < 6) {
    return { ok: false, message: "パスワードは6文字以上で入力してください。" };
  }

  if (password !== confirmPassword) {
    return { ok: false, message: "パスワードが一致しません。" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.updateUser({ password });

  if (error) {
    return { ok: false, message: error.message };
  }

  redirect("/");
}
