import { Plus, Trash2 } from "lucide-react";
import { createExpenseCategory, deleteExpenseCategory } from "@/app/(app)/settings/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import type { ExpenseCategory } from "@/types/database";

type CategorySettingsProps = {
  categories: ExpenseCategory[];
};

export function CategorySettings({ categories }: CategorySettingsProps) {
  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="border-b px-3 py-2">
        <h2 className="text-sm font-bold text-white">📂 支出カテゴリ</h2>
        <p className="text-xs text-muted-foreground">{categories.length}件</p>
      </div>
      <div className="max-h-64 overflow-y-auto">
        {categories.map((category) => (
          <div key={category.id} className="flex items-center justify-between gap-2 border-b px-3 py-2 last:border-b-0">
            <div className="flex items-center gap-2 min-w-0">
              <span
                className="size-3 shrink-0 rounded-full"
                style={{ backgroundColor: category.color ?? "#94a3b8" }}
              />
              <span className="truncate text-sm text-white">{category.name}</span>
            </div>
            <form action={deleteExpenseCategory}>
              <input type="hidden" name="id" value={category.id} />
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
        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-bold text-white">カテゴリを追加</summary>
        <form action={createExpenseCategory} className="flex gap-2 px-3 pb-3">
          <Input name="name" placeholder="カテゴリ名" required />
          <SubmitButton size="sm" className="shrink-0">
            <Plus className="size-4" aria-hidden />
            追加
          </SubmitButton>
        </form>
      </details>
    </section>
  );
}
