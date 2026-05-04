"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { ActionState } from "@/lib/utils/form";
import { requiredString } from "@/lib/utils/form";

export async function setupDisplayName(_prevState: ActionState, formData: FormData): Promise<ActionState> {
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

  redirect("/");
}
