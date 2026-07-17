import "server-only";

import { getMonthRange, parseMonthInputValue, toDateInputValue } from "@/lib/utils/dates";
import { getUserToday } from "@/lib/utils/server-dates";
import { isIncomeCategoryName } from "@/lib/utils/expense-categories";
import {
  summarizeExpenses,
  type ExpenseCategoryTotal,
  type ExpenseSummaryData,
} from "@/lib/utils/expense-summary";
import type { createClient } from "@/lib/supabase/server";
import type { Expense, ExpenseCategory, RecurringExpense } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type ExpenseWithRelations = Expense & {
  category: ExpenseCategory | null;
};

export type RecurringExpenseWithRelations = RecurringExpense & {
  category: ExpenseCategory | null;
};

export type { ExpenseCategoryTotal, ExpenseSummaryData } from "@/lib/utils/expense-summary";

function mapExpensesToCategories(expenses: Expense[], categories: ExpenseCategory[]) {
  const categoryById = new Map(categories.map((category) => [category.id, category]));

  return expenses.map((expense) => ({
    ...expense,
    category: expense.category_id ? categoryById.get(expense.category_id) ?? null : null,
  })) satisfies ExpenseWithRelations[];
}

export async function getExpenseCategories(supabase: SupabaseServerClient) {
  const { data, error } = await supabase.from("expense_categories").select("*").order("sort_order").order("name");
  if (error) throw new Error(error.message);
  return data;
}

export async function getExpensesForMonth(
  supabase: SupabaseServerClient,
  baseDate: Date,
  categories?: ExpenseCategory[],
) {
  const { start, end } = getMonthRange(baseDate);
  const expensesQuery = supabase
    .from("expenses")
    .select("*")
    .gte("spent_at", toDateInputValue(start))
    .lte("spent_at", toDateInputValue(end))
    .order("spent_at", { ascending: false })
    .order("created_at", { ascending: false });

  if (categories) {
    const expensesResult = await expensesQuery;
    if (expensesResult.error) throw new Error(expensesResult.error.message);
    return mapExpensesToCategories(expensesResult.data, categories);
  }

  const [expensesResult, categoriesResult] = await Promise.all([
    expensesQuery,
    supabase.from("expense_categories").select("*"),
  ]);

  if (expensesResult.error) throw new Error(expensesResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);

  return mapExpensesToCategories(expensesResult.data, categoriesResult.data);
}

type ExpensePageDataOptions = {
  userId: string;
  enteredByName: string | Promise<string>;
};

export async function getExpensePageData(
  supabase: SupabaseServerClient,
  baseDate: Date,
  { userId, enteredByName }: ExpensePageDataOptions,
) {
  const monthRange = getMonthRange(baseDate);
  const start = toDateInputValue(monthRange.start);
  const end = toDateInputValue(monthRange.end);
  const month = toDateInputValue(baseDate).slice(0, 7);
  const lastDay = monthRange.end.getUTCDate();

  const [expensesResult, categoriesResult, recurringResult, resolvedEnteredByName] = await Promise.all([
    supabase
      .from("expenses")
      .select("*")
      .gte("spent_at", start)
      .lte("spent_at", end)
      .order("spent_at", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("expense_categories").select("*").order("sort_order").order("name"),
    supabase
      .from("recurring_expenses")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .lte("start_month", start)
      .or(`end_month.is.null,end_month.gte.${start}`),
    Promise.resolve(enteredByName),
  ]);

  if (expensesResult.error) throw new Error(expensesResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (recurringResult.error) throw new Error(recurringResult.error.message);

  const categories = categoriesResult.data;
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const existingByRecurringId = new Map(
    expensesResult.data
      .filter((expense) => expense.user_id === userId && expense.recurring_expense_id)
      .map((expense) => [expense.recurring_expense_id as string, expense]),
  );
  const toExpensePayload = (recurring: (typeof recurringResult.data)[number]) => {
    const day = Math.min(recurring.day_of_month, lastDay);
    const type = isIncomeCategoryName(categoryById.get(recurring.category_id ?? "")?.name)
      ? ("income" as const)
      : recurring.type;

    return {
      user_id: userId,
      type,
      amount: recurring.amount,
      currency: "CAD" as const,
      exchange_rate_to_cad: 1,
      category_id: recurring.category_id,
      recurring_expense_id: recurring.id,
      entered_by_name: resolvedEnteredByName,
      memo: recurring.memo ?? recurring.title,
      spent_at: `${month}-${String(day).padStart(2, "0")}`,
    };
  };

  const inserts = recurringResult.data
    .filter((recurring) => !existingByRecurringId.has(recurring.id))
    .map(toExpensePayload);
  const updates = recurringResult.data
    .map((recurring) => ({
      existing: existingByRecurringId.get(recurring.id),
      payload: toExpensePayload(recurring),
    }))
    .filter((item): item is { existing: Expense; payload: ReturnType<typeof toExpensePayload> } =>
      Boolean(item.existing),
    )
    .filter(({ existing, payload }) =>
      existing.type !== payload.type ||
      Number(existing.amount) !== Number(payload.amount) ||
      existing.category_id !== payload.category_id ||
      existing.memo !== payload.memo ||
      existing.spent_at !== payload.spent_at ||
      existing.entered_by_name !== payload.entered_by_name,
    );

  const insertedRowsPromise = inserts.length > 0
    ? supabase.from("expenses").insert(inserts).select("*")
    : Promise.resolve({ data: [] as Expense[], error: null });
  const [insertedResult, updatedRows] = await Promise.all([
    insertedRowsPromise,
    Promise.all(
      updates.map(async ({ existing, payload }) => {
        const { data, error } = await supabase
          .from("expenses")
          .update({
            type: payload.type,
            amount: payload.amount,
            currency: payload.currency,
            exchange_rate_to_cad: payload.exchange_rate_to_cad,
            category_id: payload.category_id,
            entered_by_name: payload.entered_by_name,
            memo: payload.memo,
            spent_at: payload.spent_at,
          })
          .eq("id", existing.id)
          .select("*")
          .single();
        if (error) throw new Error(error.message);
        return data;
      }),
    ),
  ]);

  if (insertedResult.error) throw new Error(insertedResult.error.message);

  const updatedById = new Map(updatedRows.map((expense) => [expense.id, expense]));
  const expenses = [...expensesResult.data.map((expense) => updatedById.get(expense.id) ?? expense), ...insertedResult.data]
    .toSorted((a, b) => {
      const dateOrder = b.spent_at.localeCompare(a.spent_at);
      if (dateOrder !== 0) return dateOrder;
      return b.created_at.localeCompare(a.created_at);
    });

  return {
    categories,
    expenses: mapExpensesToCategories(expenses, categories),
  };
}

export async function getRecurringExpenses(supabase: SupabaseServerClient) {
  const [recurringResult, categoriesResult] = await Promise.all([
    supabase
      .from("recurring_expenses")
      .select("*")
      .order("day_of_month")
      .order("created_at")
      .order("id"),
    supabase.from("expense_categories").select("*"),
  ]);

  if (recurringResult.error) throw new Error(recurringResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);

  const categories = new Map(categoriesResult.data.map((category) => [category.id, category]));

  return recurringResult.data.map((recurring) => ({
    ...recurring,
    category: recurring.category_id ? categories.get(recurring.category_id) ?? null : null,
  })) satisfies RecurringExpenseWithRelations[];
}

export async function getRecurringExpenseSettingsData(supabase: SupabaseServerClient) {
  const [recurringResult, categoriesResult] = await Promise.all([
    supabase
      .from("recurring_expenses")
      .select("*")
      .order("day_of_month")
      .order("created_at")
      .order("id"),
    supabase.from("expense_categories").select("*").order("sort_order").order("name"),
  ]);

  if (recurringResult.error) throw new Error(recurringResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);

  const categories = categoriesResult.data;
  const categoryById = new Map(categories.map((category) => [category.id, category]));
  const recurringExpenses = recurringResult.data.map((recurring) => ({
    ...recurring,
    category: recurring.category_id ? categoryById.get(recurring.category_id) ?? null : null,
  })) satisfies RecurringExpenseWithRelations[];

  return { categories, recurringExpenses };
}

export async function getExpenseTotalsForMonth(
  supabase: SupabaseServerClient,
  baseDate: Date,
): Promise<Pick<ExpenseSummaryData, "expenseCadTotal" | "incomeCadTotal" | "netCadTotal">> {
  const { start, end } = getMonthRange(baseDate);
  const { data, error } = await supabase
    .from("expenses")
    .select("type, amount_cad")
    .gte("spent_at", toDateInputValue(start))
    .lte("spent_at", toDateInputValue(end));

  if (error) throw new Error(error.message);

  let expenseCadTotal = 0;
  let incomeCadTotal = 0;
  for (const expense of data) {
    const amountCad = Number(expense.amount_cad ?? 0);
    if (expense.type === "income") {
      incomeCadTotal += amountCad;
    } else {
      expenseCadTotal += amountCad;
    }
  }

  return {
    expenseCadTotal,
    incomeCadTotal,
    netCadTotal: incomeCadTotal - expenseCadTotal,
  };
}

export async function getCurrentMonthExpenseCadTotal(supabase: SupabaseServerClient) {
  const totals = await getExpenseTotalsForMonth(supabase, await getUserToday());
  return totals.expenseCadTotal;
}

export type MonthlyStats = {
  month: string;
  label: string;
  expense: number;
  income: number;
  net: number;
  categoryTotals: ExpenseCategoryTotal[];
};

export async function getMonthlyStats(
  supabase: SupabaseServerClient,
  fromMonth: string,
  toMonth: string,
): Promise<MonthlyStats[]> {
  const start = parseMonthInputValue(fromMonth);
  const end = parseMonthInputValue(toMonth);
  const months = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + end.getUTCMonth() - start.getUTCMonth() + 1;
  const rangeStart = toDateInputValue(getMonthRange(start).start);
  const rangeEnd = toDateInputValue(getMonthRange(end).end);
  const [expensesResult, categoriesResult] = await Promise.all([
    supabase
      .from("expenses")
      .select("*")
      .gte("spent_at", rangeStart)
      .lte("spent_at", rangeEnd)
      .order("spent_at", { ascending: false })
      .order("created_at", { ascending: false }),
    supabase.from("expense_categories").select("*"),
  ]);

  if (expensesResult.error) throw new Error(expensesResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);

  const expensesByMonth = new Map<string, ExpenseWithRelations[]>();
  for (const expense of mapExpensesToCategories(expensesResult.data, categoriesResult.data)) {
    const month = expense.spent_at.slice(0, 7);
    const existing = expensesByMonth.get(month);
    if (existing) {
      existing.push(expense);
    } else {
      expensesByMonth.set(month, [expense]);
    }
  }

  const results: MonthlyStats[] = [];
  for (let i = 0; i < months; i++) {
    const target = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + i, 1, 12));
    const month = toDateInputValue(target).slice(0, 7);
    const expenses = expensesByMonth.get(month) ?? [];
    const summary = summarizeExpenses(expenses);
    results.push({
      month,
      label: `${target.getUTCMonth() + 1}月`,
      expense: summary.expenseCadTotal,
      income: summary.incomeCadTotal,
      net: summary.netCadTotal,
      categoryTotals: summary.categoryTotals,
    });
  }

  return results;
}
