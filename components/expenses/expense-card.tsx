"use client";

import { useState } from "react";
import { Pencil } from "lucide-react";
import { DeleteExpenseButton } from "@/components/expenses/delete-expense-button";
import { ExpenseEditModal } from "@/components/expenses/expense-edit-modal";
import { ExpenseForm } from "@/components/expenses/expense-form";
import { formatCurrency } from "@/lib/utils/currency";
import { formatJaDate } from "@/lib/utils/dates";
import type { ExpenseWithRelations } from "@/lib/db/expenses";
import type { ExpenseCategory } from "@/types/database";

type ExpenseCardProps = {
  expense: ExpenseWithRelations;
  categories: ExpenseCategory[];
  isSaving?: boolean;
};

function badgeStyle(color: string | null) {
  if (!color) return undefined;
  return {
    backgroundColor: `${color}20`,
    borderColor: `${color}80`,
    color,
  };
}

export function ExpenseCard({ expense, categories, isSaving = false }: ExpenseCardProps) {
  const [optimisticDeleted, setOptimisticDeleted] = useState(false);
  const isIncome = expense.type === "income";

  if (optimisticDeleted) return null;

  return (
    <tr className={isSaving ? "border-b border-border opacity-70 last:border-b-0" : "border-b border-border last:border-b-0"}>
      <td className="w-[4.5rem] whitespace-nowrap py-2 pl-3 pr-2 align-top">
        <span className="text-xs font-bold text-white">{formatJaDate(expense.spent_at, "M/d")}</span>
        <span className="ml-1 text-[10px] font-semibold text-muted-foreground">{formatJaDate(expense.spent_at, "E")}</span>
      </td>
      <td className="py-2 pr-2 align-top">
        <div className="flex flex-wrap items-center gap-1.5">
          <span
            className="inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-bold"
            style={badgeStyle(expense.category?.color ?? null)}
          >
            {expense.category?.name ?? (isIncome ? "収入" : "未分類")}
          </span>
          {expense.entered_by_name ? (
            <span className="inline-flex rounded-full bg-muted px-2 py-0.5 text-[11px] font-bold text-muted-foreground">
              {expense.entered_by_name}
            </span>
          ) : null}
        </div>
        {expense.memo ? <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">{expense.memo}</p> : null}
        {isSaving ? <p className="mt-1 text-[11px] text-muted-foreground">Saving…</p> : null}
      </td>
      <td className="w-28 py-2 pr-1 text-right align-top">
        <p className={isIncome ? "text-sm font-bold text-sky-400" : "text-sm font-bold text-red-400"}>
          {isIncome ? "+" : "-"}
          {formatCurrency(Number(expense.amount))}
        </p>
      </td>
      <td className="w-16 py-2 pr-2 align-top">
        {isSaving ? null : <div className="flex justify-end gap-1">
          <ExpenseEditModal
            label={
              <span className="inline-flex size-7 min-h-7 min-w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground">
                <Pencil className="size-3.5" aria-hidden />
              </span>
            }
          >
            <ExpenseForm
              categories={categories}
              expense={expense}
              showCancel
            />
          </ExpenseEditModal>
          <DeleteExpenseButton
            expenseId={expense.id}
            onOptimisticDelete={() => setOptimisticDeleted(true)}
            onDeleteFailed={() => setOptimisticDeleted(false)}
          />
        </div>}
      </td>
    </tr>
  );
}
