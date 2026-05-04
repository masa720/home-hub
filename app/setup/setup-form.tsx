"use client";

import { useActionState } from "react";
import { setupDisplayName } from "@/app/setup/actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

export function SetupForm() {
  const [state, action] = useActionState(setupDisplayName, {});

  return (
    <form action={action} className="space-y-4">
      <div>
        <label
          htmlFor="display_name"
          className="mb-1.5 block text-sm font-medium text-white"
        >
          ユーザー名
        </label>
        <Input
          id="display_name"
          name="display_name"
          placeholder="例: たろう"
          required
        />
      </div>
      {state.message && !state.ok ? (
        <p className="text-sm text-red-400">{state.message}</p>
      ) : null}
      <SubmitButton className="w-full">はじめる</SubmitButton>
    </form>
  );
}
