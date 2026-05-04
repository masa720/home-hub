"use client";

import { useActionState, useRef, useState } from "react";
import { joinHousehold } from "@/app/(app)/settings/actions";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";

type HouseholdFormProps = {
  householdId: string;
  memberNames: string[];
};

export function HouseholdForm({ householdId, memberNames }: HouseholdFormProps) {
  const [state, action] = useActionState(joinHousehold, {});
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  function handleCopy() {
    navigator.clipboard.writeText(householdId);
    setCopied(true);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-3">
      {memberNames.length > 0 ? (
        <div>
          <p className="text-xs text-muted-foreground">共有メンバー</p>
          <div className="mt-1 flex flex-wrap gap-2">
            {memberNames.map((name) => (
              <span key={name} className="rounded-full bg-primary/20 px-3 py-1 text-xs font-semibold text-primary">
                {name}
              </span>
            ))}
          </div>
        </div>
      ) : null}
      <div>
        <p className="text-xs text-muted-foreground">あなたの共有コード</p>
        <div className="mt-1 flex gap-2">
          <code className="flex-1 truncate rounded-lg border bg-slate-950/60 px-3 py-2 text-xs text-white">
            {householdId}
          </code>
          <button
            type="button"
            onClick={handleCopy}
            className="shrink-0 rounded-lg border bg-slate-950/60 px-3 py-2 text-xs text-muted-foreground hover:text-white"
          >
            {copied ? "コピー済" : "コピー"}
          </button>
        </div>
      </div>
      <div>
        <p className="text-xs text-muted-foreground">相手の共有コードを入力</p>
        <form action={action} className="mt-1 flex gap-2">
          <Input name="household_id" placeholder="共有コードを貼り付け" required />
          <SubmitButton size="sm" className="shrink-0">
            参加
          </SubmitButton>
        </form>
        {state.message ? (
          <p className={state.ok ? "mt-1 text-xs text-green-400" : "mt-1 text-xs text-red-400"}>{state.message}</p>
        ) : null}
      </div>
    </div>
  );
}
