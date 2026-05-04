"use client";

import { useActionState } from "react";
import { updateDisplayName } from "@/app/(app)/settings/actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

type DisplayNameFormProps = {
  currentName: string;
};

export function DisplayNameForm({ currentName }: DisplayNameFormProps) {
  const [state, action] = useActionState(updateDisplayName, {});

  return (
    <div className="mt-2 space-y-1.5">
      <form action={action} className="flex gap-2">
        <Input name="display_name" defaultValue={currentName} placeholder="ユーザー名" required />
        <SubmitButton size="sm" className="shrink-0">
          更新
        </SubmitButton>
      </form>
      {state.message ? (
        <p className={state.ok ? "text-xs text-green-400" : "text-xs text-red-400"}>{state.message}</p>
      ) : null}
    </div>
  );
}
