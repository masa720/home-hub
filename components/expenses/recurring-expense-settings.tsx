import { Pencil, Trash2 } from "lucide-react";
import { deleteRecurringExpense } from "@/app/(app)/expenses/actions";
import { ExpenseEditModal } from "@/components/expenses/expense-edit-modal";
import { RecurringExpenseForm } from "@/components/expenses/recurring-expense-form";
import { RecurringToggle } from "@/components/expenses/recurring-toggle";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils/currency";
import type { RecurringExpenseWithRelations } from "@/lib/db/expenses";
import type { ExpenseCategory } from "@/types/database";

type RecurringExpenseSettingsProps = {
  recurringExpenses: RecurringExpenseWithRelations[];
  categories: ExpenseCategory[];
};

export function RecurringExpenseSettings({
  recurringExpenses,
  categories,
}: RecurringExpenseSettingsProps) {
  const activeCount = recurringExpenses.filter((item) => item.is_active).length;

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="flex items-center justify-between gap-2 border-b px-3 py-2">
        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white">固定費</h2>
          <p className="text-xs font-semibold text-muted-foreground">有効 {activeCount}件</p>
        </div>
      </div>

      {recurringExpenses.length > 0 ? (
        <div>
          {recurringExpenses.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-[1fr_auto_auto_auto] items-center gap-2 border-b px-3 py-2 last:border-b-0"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <span className={item.type === "income" ? "text-sm font-bold text-sky-400" : "text-sm font-bold text-red-400"}>
                    {item.type === "income" ? "収入" : "支出"}
                  </span>
                  <p className="truncate text-sm font-bold text-white">{item.title}</p>
                  {!item.is_active ? (
                    <span className="rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                      停止
                    </span>
                  ) : null}
                </div>
                <p className="mt-0.5 truncate text-xs font-semibold text-muted-foreground">
                  毎月{item.day_of_month}日 ・ {item.category?.name ?? "未分類"} ・ {formatCurrency(Number(item.amount))}
                </p>
                <p className="mt-0.5 truncate text-[11px] font-semibold text-muted-foreground">
                  {item.start_month.slice(0, 7)} 〜 {item.end_month ? item.end_month.slice(0, 7) : "未定"}
                </p>
              </div>
              <ExpenseEditModal
                label={
                  <span className="inline-flex size-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Pencil className="size-4" aria-hidden />
                  </span>
                }
              >
                <RecurringExpenseForm
                  categories={categories}
                  recurringExpense={item}
                  showCancel
                />
              </ExpenseEditModal>
              <form action={deleteRecurringExpense}>
                <input type="hidden" name="id" value={item.id} />
                <Button
                  type="submit"
                  variant="ghost"
                  size="sm"
                  className="size-8 min-h-8 min-w-8 p-0 text-red-400 hover:text-red-300"
                >
                  <Trash2 className="size-4" aria-hidden />
                </Button>
              </form>
              <RecurringToggle id={item.id} isActive={item.is_active} />
            </div>
          ))}
        </div>
      ) : null}

      <details className="border-t">
        <summary className="cursor-pointer list-none px-3 py-2 text-sm font-bold text-white">固定費を追加</summary>
        <div className="px-3 pb-3">
          <RecurringExpenseForm categories={categories} />
        </div>
      </details>
    </section>
  );
}
