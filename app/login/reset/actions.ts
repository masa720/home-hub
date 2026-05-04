"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/utils/form";
import { requiredString } from "@/lib/utils/form";

export async function sendPasswordReset(_prevState: ActionState, formData: FormData): Promise<ActionState> {
  const email = requiredString(formData.get("email"));

  if (!email.includes("@")) {
    return { ok: false, message: "メールアドレスを入力してください。" };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${origin}/auth/callback?next=/login/update-password`,
  });

  if (error) {
    return { ok: false, message: error.message };
  }

  return { ok: true, message: "リセットリンクをメールで送信しました。" };
}
