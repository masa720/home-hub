"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-lg border border-red-500/40 bg-red-950/30 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-red-300" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="font-semibold text-red-100">エラーが発生しました</h2>
          <p className="mt-2 break-words text-sm leading-6 text-red-200/80">{error.message}</p>
          <Button type="button" variant="secondary" size="sm" className="mt-4" onClick={reset}>
            再読み込み
          </Button>
        </div>
      </div>
    </div>
  );
}
