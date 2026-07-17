export function AppLoadingSkeleton() {
  return (
    <div className="space-y-4" role="status" aria-label="読み込み中">
      <div className="h-9 w-40 animate-pulse rounded-lg bg-muted" />
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="h-28 animate-pulse rounded-lg border bg-card" />
        <div className="h-28 animate-pulse rounded-lg border bg-card" />
      </div>
      <div className="h-48 animate-pulse rounded-lg border bg-card" />
      <span className="sr-only">読み込み中…</span>
    </div>
  );
}
