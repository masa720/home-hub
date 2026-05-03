import { Loader2 } from "lucide-react";

export function LoadingSpinner() {
  return (
    <div className="flex min-h-40 items-center justify-center text-muted-foreground">
      <Loader2 className="size-6 animate-spin" aria-label="読み込み中" />
    </div>
  );
}
