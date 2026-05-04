"use client";

import { useActionState } from "react";
import { LogIn } from "lucide-react";
import { signInWithPassword } from "@/app/login/actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function LoginForm() {
  const [state, formAction] = useActionState(signInWithPassword, {});

  return (
    <form action={formAction} className="space-y-4">
      <label className="block space-y-2">
        <span className="text-sm font-medium text-muted-foreground">メールアドレス</span>
        <Input name="email" type="email" autoComplete="email" placeholder="you@example.com" required />
      </label>
      <label className="block space-y-2">
        <span className="text-sm font-medium text-muted-foreground">パスワード</span>
        <Input name="password" type="password" autoComplete="current-password" required />
      </label>
      <SubmitButton className="w-full">
        <LogIn className="size-4" aria-hidden />
        ログイン
      </SubmitButton>
      {state.message ? (
        <p className="text-sm text-red-300">{state.message}</p>
      ) : null}
    </form>
  );
}
