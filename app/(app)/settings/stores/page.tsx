import Link from "next/link";
import { Plus, ChevronLeft } from "lucide-react";
import { createStore, deleteStore, reorderStores, updateStoreColor } from "@/app/(app)/settings/actions";
import { PageHeader } from "@/components/page-header";
import { SortableList } from "@/components/settings/sortable-list";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { getStores } from "@/lib/db/shopping";
import { createClient } from "@/lib/supabase/server";

export default async function StoreSettingsPage() {
  const supabase = await createClient();
  const stores = await getStores(supabase);

  return (
    <>
      <PageHeader
        title="🏪 店舗"
        action={
          <Link
            href="/settings"
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="設定へ戻る"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </Link>
        }
      />
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-3 py-2">
          <p className="text-xs text-muted-foreground">{stores.length}件 ・ ドラッグで並び替え</p>
        </div>
        <SortableList items={stores} showBadgePreview deleteAction={deleteStore} reorderAction={reorderStores} updateColorAction={updateStoreColor} />
      </section>
      <section className="rounded-lg border bg-card">
        <details>
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
    </>
  );
}
