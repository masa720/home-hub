import { Plus, Trash2 } from "lucide-react";
import { createStore, deleteStore } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { Store } from "@/types/database";

type StoreSettingsProps = {
  stores: Store[];
};

export function StoreSettings({ stores }: StoreSettingsProps) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="border-b px-3 py-2">
        <h2 className="text-sm font-bold text-white">🏪 店舗</h2>
        <p className="text-xs text-muted-foreground">{stores.length}件</p>
      </div>
      <div>
        {stores.map((store) => (
          <div key={store.id} className="flex items-center justify-between gap-2 border-b px-3 py-2 last:border-b-0">
            <span className="truncate text-sm text-white">{store.name}</span>
            <form action={deleteStore}>
              <input type="hidden" name="id" value={store.id} />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className="size-8 min-h-8 min-w-8 p-0 text-red-400 hover:text-red-300"
              >
                <Trash2 className="size-4" aria-hidden />
              </Button>
            </form>
          </div>
        ))}
      </div>
      <details className="border-t">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-bold text-white">店舗を追加</summary>
        <form action={createStore} className="flex gap-2 px-3 pb-3">
          <Input name="name" placeholder="店舗名" required />
          <SubmitButton size="sm" className="shrink-0">
            <Plus className="size-4" aria-hidden />
            追加
          </SubmitButton>
        </form>
      </details>
    </section>
  );
}
