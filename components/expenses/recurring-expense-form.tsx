import { Plus } from "lucide-react";
import { createRecurringExpense, updateRecurringExpense } from "@/app/(app)/expenses/actions";
import { ExpenseCategoryFields } from "@/components/expenses/expense-category-fields";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { APP_START_MONTH } from "@/lib/utils/dates";
import type { RecurringExpenseWithRelations } from "@/lib/db/expenses";
import type { ExpenseCategory } from "@/types/database";

type RecurringExpenseFormProps = {
  categories: ExpenseCategory[];
  recurringExpense?: RecurringExpenseWithRelations;
  showCancel?: boolean;
};

export function RecurringExpenseForm({
  categories,
  recurringExpense,
  showCancel = false,
}: RecurringExpenseFormProps) {
  const action = recurringExpense ? updateRecurringExpense : createRecurringExpense;
  const defaultStartMonth = recurringExpense?.start_month?.slice(0, 7) ?? APP_START_MONTH;
  const defaultEndMonth = recurringExpense?.end_month?.slice(0, 7) ?? "";

  return (
    <form action={action} className="space-y-3 rounded-lg border bg-card p-4">
      {recurringExpense ? <input type="hidden" name="id" value={recurringExpense.id} /> : null}
      <div>
        <Input
          name="title"
          placeholder="名称 例: 携帯、インターネット"
          defaultValue={recurringExpense?.title ?? ""}
          required
        />
      </div>

      <div>
        <ExpenseCategoryFields
          categories={categories}
          defaultType={recurringExpense?.type ?? "expense"}
          defaultCategoryId={recurringExpense?.category_id}
        />
      </div>

      <div className="grid grid-cols-[1.4fr_0.8fr] gap-3">
        <Input
          name="amount"
          type="number"
          inputMode="decimal"
          min="0"
          step="0.01"
          placeholder="金額"
          defaultValue={recurringExpense?.amount ?? ""}
          required
        />
        <Input
          name="day_of_month"
          type="number"
          inputMode="numeric"
          min="1"
          max="31"
          placeholder="日"
          defaultValue={recurringExpense?.day_of_month ?? 1}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <Input
          name="start_month"
          type="month"
          aria-label="開始月"
          min={APP_START_MONTH}
          defaultValue={defaultStartMonth}
          required
        />
        <Input
          name="end_month"
          type="month"
          aria-label="終了月"
          min={APP_START_MONTH}
          defaultValue={defaultEndMonth}
        />
      </div>

      <Textarea name="memo" placeholder="メモ" defaultValue={recurringExpense?.memo ?? ""} />

      <div className="flex justify-end gap-2">
        {recurringExpense || showCancel ? <CancelButton /> : null}
        {recurringExpense ? (
          <SubmitButton variant="secondary">更新</SubmitButton>
        ) : (
          <SubmitButton>
            <Plus className="size-4" aria-hidden />
            追加
          </SubmitButton>
        )}
      </div>
    </form>
  );
}
