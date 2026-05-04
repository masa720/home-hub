"use client";

import { useActionState } from "react";
import { Mail } from "lucide-react";
import { sendPasswordReset } from "./actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function ResetForm() {
  const [state, formAction] = useActionState(sendPasswordReset, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-muted-foreground">メールアドレス</span>
        <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </label>
      <SubmitButton className="w-full">
        <Mail className="size-4" aria-hidden />
        リセットリンクを送る
      </SubmitButton>
      {state.message ? (
        <p className={state.ok ? "text-sm text-primary" : "text-sm text-red-300"}>{state.message}</p>
      ) : null}
      <div className="text-center">
        <a href="/login" className="text-xs text-muted-foreground hover:text-foreground">
          ログインに戻る
        </a>
      </div>
    </form>
  );
}
