import { Plus } from "lucide-react";
import { createExpense, updateExpense } from "@/app/(app)/expenses/actions";
import { ExpenseCategoryFields } from "@/components/expenses/expense-category-fields";
import { CancelButton } from "@/components/ui/cancel-button";
import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/ui/submit-button";
import { Textarea } from "@/components/ui/textarea";
import { APP_START_DATE, toDateInputValue } from "@/lib/utils/dates";
import type { ExpenseWithRelations } from "@/lib/db/expenses";
import type { ExpenseCategory } from "@/types/database";

type ExpenseFormProps = {
  categories: ExpenseCategory[];
  expense?: ExpenseWithRelations;
  defaultEnteredByName?: string;
  showCancel?: boolean;
};

export function ExpenseForm({
  categories,
  expense,
  defaultEnteredByName = "",
  showCancel = false,
}: ExpenseFormProps) {
  const action = expense ? updateExpense : createExpense;

  return (
    <form action={action} className="space-y-3 rounded-lg border bg-card p-4">
      {expense ? <input type="hidden" name="id" value={expense.id} /> : null}
      <div>
        <Input
          name="spent_at"
          type="date"
          min={APP_START_DATE}
          defaultValue={expense?.spent_at ?? toDateInputValue(new Date())}
          aria-label="日付"
          required
        />
      </div>

      <Input
        name="amount"
        type="number"
        inputMode="decimal"
        min="0"
        step="0.01"
        placeholder="金額 CAD"
        defaultValue={expense?.amount ?? ""}
        required
      />

      <ExpenseCategoryFields
        categories={categories}
        defaultType={expense?.type ?? "expense"}
        defaultCategoryId={expense?.category_id}
      />

      <Input
        name="entered_by_name"
        placeholder="入力者"
        defaultValue={expense?.entered_by_name ?? defaultEnteredByName}
        required
      />

      <Textarea name="memo" placeholder="メモ" defaultValue={expense?.memo ?? ""} />

      <div className="flex justify-end gap-2">
        {expense || showCancel ? <CancelButton /> : null}
        {expense ? (
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
