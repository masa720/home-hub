import { isIncomeCategoryName } from "@/lib/utils/expense-categories";
import type { Expense, ExpenseCategory } from "@/types/database";

type SummarizableExpense = Expense & {
  category: ExpenseCategory | null;
};

export type ExpenseSummaryData = {
  expenseCadTotal: number;
  incomeCadTotal: number;
  netCadTotal: number;
  categoryTotals: ExpenseCategoryTotal[];
};

export type ExpenseCategoryTotal = {
  id: string;
  name: string;
  color: string;
  amountCad: number;
  percent: number;
};

export function summarizeExpenses(expenses: SummarizableExpense[]): ExpenseSummaryData {
  let expenseCadTotal = 0;
  let incomeCadTotal = 0;
  const categoryTotals = new Map<string, ExpenseCategoryTotal>();

  for (const expense of expenses) {
    const amountCad = Number(expense.amount_cad ?? 0);
    const isIncome = expense.type === "income" || isIncomeCategoryName(expense.category?.name);

    if (isIncome) {
      incomeCadTotal += amountCad;
      continue;
    }

    expenseCadTotal += amountCad;
    const id = expense.category?.id ?? "uncategorized";
    const existing = categoryTotals.get(id);
    if (existing) {
      existing.amountCad += amountCad;
    } else {
      categoryTotals.set(id, {
        id,
        name: expense.category?.name ?? "未分類",
        color: expense.category?.color ?? "#94a3b8",
        amountCad,
        percent: 0,
      });
    }
  }

  const categoryTotalItems = Array.from(categoryTotals.values())
    .map((item) => ({
      ...item,
      percent: expenseCadTotal > 0 ? (item.amountCad / expenseCadTotal) * 100 : 0,
    }))
    .toSorted((a, b) => b.amountCad - a.amountCad);

  return {
    expenseCadTotal,
    incomeCadTotal,
    netCadTotal: incomeCadTotal - expenseCadTotal,
    categoryTotals: categoryTotalItems,
  };
}
