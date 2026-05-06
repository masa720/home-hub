import "server-only";

import { getCurrentUtcDate, getMonthRange, parseMonthInputValue, toDateInputValue } from "@/lib/utils/dates";
import { isIncomeCategoryName } from "@/lib/utils/expense-categories";
import type { createClient } from "@/lib/supabase/server";
import type { Expense, ExpenseCategory, RecurringExpense } from "@/types/database";

type SupabaseServerClient = Awaited<ReturnType<typeof createClient>>;

export type ExpenseWithRelations = Expense & {
  category: ExpenseCategory | null;
};

export type RecurringExpenseWithRelations = RecurringExpense & {
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

type ApplyRecurringExpensesOptions = {
  userId?: string;
  enteredByName?: string;
  categories?: Pick<ExpenseCategory, "id" | "name">[];
};

export async function applyRecurringExpensesForMonth(
  supabase: SupabaseServerClient,
  baseDate: Date,
  options: ApplyRecurringExpensesOptions = {},
) {
  let userId = options.userId;
  if (!userId) {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) throw new Error("ログインが必要です。");
    userId = user.id;
  }

  const monthRange = getMonthRange(baseDate);
  const start = toDateInputValue(monthRange.start);
  const end = toDateInputValue(monthRange.end);
  const lastDay = monthRange.end.getUTCDate();
  const month = toDateInputValue(baseDate).slice(0, 7);
  const categoriesPromise = options.categories
    ? Promise.resolve({ data: options.categories, error: null })
    : supabase.from("expense_categories").select("id, name");
  const profilePromise = options.enteredByName
    ? Promise.resolve({ data: null, error: null })
    : supabase.from("profiles").select("display_name,email").eq("id", userId).maybeSingle();

  const [recurringResult, existingResult, categoriesResult, profileResult] = await Promise.all([
    supabase
      .from("recurring_expenses")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .lte("start_month", start)
      .or(`end_month.is.null,end_month.gte.${start}`),
    supabase
      .from("expenses")
      .select("id, recurring_expense_id, type, amount, category_id, memo, spent_at, entered_by_name")
      .eq("user_id", userId)
      .gte("spent_at", start)
      .lte("spent_at", end)
      .not("recurring_expense_id", "is", null),
    categoriesPromise,
    profilePromise,
  ]);

  if (recurringResult.error) throw new Error(recurringResult.error.message);
  if (existingResult.error) throw new Error(existingResult.error.message);
  if (categoriesResult.error) throw new Error(categoriesResult.error.message);
  if (profileResult.error) throw new Error(profileResult.error.message);

  const categories = new Map(categoriesResult.data.map((category) => [category.id, category]));
  const enteredByName = options.enteredByName ?? profileResult.data?.display_name ?? profileResult.data?.email?.split("@")[0] ?? "Unknown";
  const existingByRecurringId = new Map(
    existingResult.data
      .filter((expense) => expense.recurring_expense_id)
      .map((expense) => [expense.recurring_expense_id as string, expense]),
  );
  const toExpensePayload = (recurring: (typeof recurringResult.data)[number]) => {
    const day = Math.min(recurring.day_of_month, lastDay);
    const type = isIncomeCategoryName(categories.get(recurring.category_id ?? "")?.name) ? "income" : recurring.type;
    return {
      user_id: userId,
      type,
      amount: recurring.amount,
      currency: "CAD" as const,
      exchange_rate_to_cad: 1,
      category_id: recurring.category_id,
      recurring_expense_id: recurring.id,
      entered_by_name: enteredByName,
      memo: recurring.memo ?? recurring.title,
      spent_at: `${month}-${String(day).padStart(2, "0")}`,
    };
  };

  const inserts = recurringResult.data
    .filter((recurring) => !existingByRecurringId.has(recurring.id))
    .map(toExpensePayload);

  const updates = recurringResult.data
    .map((recurring) => ({ recurring, existing: existingByRecurringId.get(recurring.id) }))
    .filter((item): item is { recurring: (typeof recurringResult.data)[number]; existing: (typeof existingResult.data)[number] } =>
      Boolean(item.existing),
    )
    .filter(({ recurring, existing }) => {
      const payload = toExpensePayload(recurring);
      return (
        existing.type !== payload.type ||
        Number(existing.amount) !== Number(payload.amount) ||
        existing.category_id !== payload.category_id ||
        existing.memo !== payload.memo ||
        existing.spent_at !== payload.spent_at ||
        existing.entered_by_name !== payload.entered_by_name
      );
    });

  if (inserts.length > 0) {
    const { error } = await supabase.from("expenses").insert(inserts);
    if (error) throw new Error(error.message);
  }

  await Promise.all(
    updates.map(async ({ recurring, existing }) => {
      const payload = toExpensePayload(recurring);
      const { error } = await supabase
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
        .eq("id", existing.id);
      if (error) throw new Error(error.message);
    }),
  );
}

export function summarizeExpenses(expenses: ExpenseWithRelations[]): ExpenseSummaryData {
  let expenseCadTotal = 0;
  let incomeCadTotal = 0;
  const categoryTotals = new Map<string, ExpenseCategoryTotal>();

  for (const expense of expenses) {
    const amountCad = Number(expense.amount_cad ?? 0);

    const isIncome = expense.type === "income" || isIncomeCategoryName(expense.category?.name);

    if (isIncome) {
      incomeCadTotal += amountCad;
    } else {
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
  const totals = await getExpenseTotalsForMonth(supabase, getCurrentUtcDate());
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
