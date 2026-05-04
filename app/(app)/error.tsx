"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AppError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="rounded-2xl bg-destructive/10 p-4">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-destructive" aria-hidden />
        <div className="min-w-0 flex-1">
          <h2 className="text-sm font-bold text-foreground">Something went wrong</h2>
          <p className="mt-1 break-words text-xs text-muted-foreground">{error.message}</p>
          <Button type="button" variant="secondary" size="sm" className="mt-3" onClick={reset}>
            Retry
          </Button>
        </div>
      </div>
    </div>
  );
}
