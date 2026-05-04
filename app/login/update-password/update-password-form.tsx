"use client";

import { useActionState } from "react";
import { KeyRound } from "lucide-react";
import { updatePassword } from "./actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function UpdatePasswordForm() {
  const [state, formAction] = useActionState(updatePassword, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-muted-foreground">新しいパスワード</span>
        <Input name="password" type="password" autoComplete="new-password" required minLength={6} />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-muted-foreground">パスワード確認</span>
        <Input name="confirmPassword" type="password" autoComplete="new-password" required minLength={6} />
      </label>
      <SubmitButton className="w-full">
        <KeyRound className="size-4" aria-hidden />
        パスワードを更新
      </SubmitButton>
      {state.message ? (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}
    </form>
  );
}
