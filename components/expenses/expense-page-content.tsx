"use client";

import { useOptimistic } from "react";
import { createExpense } from "@/app/(app)/expenses/actions";
import { EmptyState } from "@/components/empty-state";
import { ExpenseAddFab } from "@/components/expenses/expense-add-fab";
import { ExpenseCard } from "@/components/expenses/expense-card";
import { ExpenseSummary } from "@/components/expenses/expense-summary";
import type { ExpenseWithRelations } from "@/lib/db/expenses";
import { isIncomeCategoryName } from "@/lib/utils/expense-categories";
import { summarizeExpenses } from "@/lib/utils/expense-summary";
import { toDateInputValue } from "@/lib/utils/dates";
import type { ExpenseCategory, ExpenseType } from "@/types/database";

type ExpensePageContentProps = {
  expenses: ExpenseWithRelations[];
  categories: ExpenseCategory[];
  defaultEnteredByName: string;
  selectedMonth: Date;
  currentMonthValue: string;
  previousHref: string | null;
  nextHref: string;
};

function optionalFormText(formData: FormData, name: string) {
  const value = formData.get(name);
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function optimisticId() {
  return `optimistic-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function sortExpenses(expenses: ExpenseWithRelations[]) {
  return expenses.toSorted((a, b) => {
    const dateOrder = b.spent_at.localeCompare(a.spent_at);
    if (dateOrder !== 0) return dateOrder;
    return b.created_at.localeCompare(a.created_at);
  });
}

export function ExpensePageContent({
  expenses,
  categories,
  defaultEnteredByName,
  selectedMonth,
  currentMonthValue,
  previousHref,
  nextHref,
}: ExpensePageContentProps) {
  const [optimisticExpenses, addOptimisticExpense] = useOptimistic(
    expenses,
    (currentExpenses, expense: ExpenseWithRelations) => sortExpenses([expense, ...currentExpenses]),
  );
  const selectedMonthValue = toDateInputValue(selectedMonth).slice(0, 7);

  async function createOptimistically(formData: FormData) {
    const amount = Number(formData.get("amount"));
    const spentAt = optionalFormText(formData, "spent_at");
    const categoryId = optionalFormText(formData, "category_id");
    const category = categoryId ? categories.find((candidate) => candidate.id === categoryId) ?? null : null;
    const formType: ExpenseType = formData.get("type") === "income" ? "income" : "expense";
    const type: ExpenseType = isIncomeCategoryName(category?.name) ? "income" : formType;

    if (amount > 0 && spentAt && spentAt.slice(0, 7) === selectedMonthValue) {
      const now = new Date().toISOString();
      addOptimisticExpense({
        id: optimisticId(),
        user_id: "",
        type,
        title: "",
        amount,
        currency: "CAD",
        exchange_rate_to_cad: 1,
        amount_cad: amount,
        category_id: categoryId,
        recurring_expense_id: null,
        entered_by_name: optionalFormText(formData, "entered_by_name") ?? defaultEnteredByName,
        memo: optionalFormText(formData, "memo"),
        spent_at: spentAt,
        created_at: now,
        updated_at: now,
        category,
      });
    }

    try {
      await createExpense(formData);
    } catch {
      window.alert("追加できませんでした。通信状態を確認して、もう一度お試しください。");
    }
  }

  const summary = summarizeExpenses(optimisticExpenses);

  return (
    <>
      <ExpenseAddFab
        categories={categories}
        defaultEnteredByName={defaultEnteredByName}
        createAction={createOptimistically}
      />

      <ExpenseSummary
        summary={summary}
        selectedMonth={selectedMonth}
        currentMonthValue={currentMonthValue}
        previousHref={previousHref}
        nextHref={nextHref}
      />

      {optimisticExpenses.length > 0 ? (
        <section className="rounded-lg border bg-card">
          <h2 className="border-b px-3 py-2 text-sm font-bold text-white">入出金</h2>
          <table className="w-full">
            <tbody>
              {optimisticExpenses.map((expense) => (
                <ExpenseCard
                  key={expense.id}
                  expense={expense}
                  categories={categories}
                  isSaving={expense.id.startsWith("optimistic-")}
                />
              ))}
            </tbody>
          </table>
        </section>
      ) : (
        <EmptyState title="この月の記録はありません" />
      )}
    </>
  );
}
