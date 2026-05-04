import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { createExpenseCategory, deleteExpenseCategory, reorderExpenseCategories, updateCategoryColor } from "@/app/(app)/settings/actions";
import { PageHeader } from "@/components/page-header";
import { AddWithColorForm } from "@/components/settings/add-with-color-form";
import { SortableList } from "@/components/settings/sortable-list";
import { getExpenseCategories } from "@/lib/db/expenses";
import { createClient } from "@/lib/supabase/server";

export default async function CategorySettingsPage() {
  const supabase = await createClient();
  const categories = await getExpenseCategories(supabase);

  return (
    <>
      <PageHeader
        title="📂 支出カテゴリ"
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
        <details>
          <summary className="cursor-pointer list-none px-3 py-2 text-sm font-bold text-white">カテゴリを追加</summary>
          <AddWithColorForm action={createExpenseCategory} placeholder="カテゴリ名" />
        </details>
      </section>
      <section className="overflow-hidden rounded-lg border bg-card">
        <div className="border-b px-3 py-2">
          <p className="text-xs text-muted-foreground">{categories.length}件 ・ ドラッグで並び替え</p>
        </div>
        <SortableList items={categories} deleteAction={deleteExpenseCategory} reorderAction={reorderExpenseCategories} updateColorAction={updateCategoryColor} />
      </section>
    </>
  );
}
