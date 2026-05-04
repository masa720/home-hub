"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/utils/form";
import { requiredString } from "@/lib/utils/form";

export async function signInWithPassword(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = requiredString(formData.get("email"));
  const password = requiredString(formData.get("password"));

  if (!email.includes("@")) {
    return { ok: false, message: "メールアドレスを入力してください。" };
  }

  if (!password) {
    return { ok: false, message: "パスワードを入力してください。" };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { ok: false, message: "メールアドレスまたはパスワードが正しくありません。" };
  }

  redirect("/");
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
