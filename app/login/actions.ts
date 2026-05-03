"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/utils/form";
import { requiredString } from "@/lib/utils/form";

export async function signInWithEmail(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = requiredString(formData.get("email"));

  if (!email.includes("@")) {
    return { ok: false, message: "メールアドレスを入力してください。" };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: `${origin}/auth/callback`,
    },
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "ログインリンクをメールで送信しました。" };
}

export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
