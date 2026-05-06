"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { parseAmount } from "@/lib/utils/currency";
import { isIncomeCategoryName } from "@/lib/utils/expense-categories";
import { optionalString, requiredString } from "@/lib/utils/form";
import type { ExpenseType } from "@/types/database";

async function getUserId() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new Error("ログインが必要です。");
  }

  return { supabase, userId: user.id };
}

function revalidateExpenses({ settings = false } = {}) {
  revalidatePath("/");
  revalidatePath("/expenses");
  if (settings) revalidatePath("/expenses/settings");
}

function parseExpenseType(value: FormDataEntryValue | null): ExpenseType {
  return value === "income" ? "income" : "expense";
}

async function resolveExpenseType({
  supabase,
  categoryId,
  value,
}: {
  supabase: Awaited<ReturnType<typeof createClient>>;
  categoryId: string | null;
  value: FormDataEntryValue | null;
}): Promise<ExpenseType> {
  if (categoryId) {
    const { data, error } = await supabase.from("expense_categories").select("name").eq("id", categoryId).maybeSingle();
    if (error) throw new Error(error.message);
    if (isIncomeCategoryName(data?.name)) return "income";
  }

  return parseExpenseType(value);
}

function nullableId(value: FormDataEntryValue | null) {
  return optionalString(value);
}

async function getDefaultEnteredByName(supabase: Awaited<ReturnType<typeof createClient>>, userId: string) {
  const { data, error } = await supabase
    .from("profiles")
    .select("display_name,email")
    .eq("id", userId)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data?.display_name ?? data?.email?.split("@")[0] ?? "Unknown";
}

function parseDayOfMonth(value: FormDataEntryValue | null) {
  const day = Number(value);
  if (!Number.isFinite(day)) return 1;
  return Math.min(31, Math.max(1, Math.trunc(day)));
}

function parseMonthDate(value: FormDataEntryValue | null) {
  const text = requiredString(value);
  if (!/^\d{4}-\d{2}$/.test(text)) return null;
  return `${text}-01`;
}

export async function createExpense(formData: FormData) {
  const amount = parseAmount(formData.get("amount"));
  if (amount <= 0) return;

  const { supabase, userId } = await getUserId();
  const categoryId = nullableId(formData.get("category_id"));
  const type = await resolveExpenseType({ supabase, categoryId, value: formData.get("type") });
  const enteredByName = optionalString(formData.get("entered_by_name")) ?? (await getDefaultEnteredByName(supabase, userId));
  const { error } = await supabase.from("expenses").insert({
    user_id: userId,
    type,
    amount,
    currency: "CAD",
    exchange_rate_to_cad: 1,
    category_id: categoryId,
    entered_by_name: enteredByName,
    memo: optionalString(formData.get("memo")),
    spent_at: requiredString(formData.get("spent_at")) || undefined,
  });

  if (error) throw new Error(error.message);
  revalidateExpenses();
}

export async function createRecurringExpense(formData: FormData) {
  const title = requiredString(formData.get("title"));
  const amount = parseAmount(formData.get("amount"));
  const categoryId = nullableId(formData.get("category_id"));
  const startMonth = parseMonthDate(formData.get("start_month"));
  if (!title || !categoryId || !startMonth || amount <= 0) return;

  const { supabase, userId } = await getUserId();
  const type = await resolveExpenseType({ supabase, categoryId, value: formData.get("type") });
  const { error } = await supabase.from("recurring_expenses").insert({
    user_id: userId,
    type,
    title,
    amount,
    currency: "CAD",
    exchange_rate_to_cad: 1,
    category_id: categoryId,
    day_of_month: parseDayOfMonth(formData.get("day_of_month")),
    start_month: startMonth,
    end_month: parseMonthDate(formData.get("end_month")),
    memo: optionalString(formData.get("memo")),
    is_active: true,
  });

  if (error) throw new Error(error.message);
  revalidateExpenses({ settings: true });
}

export async function updateRecurringExpense(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const title = requiredString(formData.get("title"));
  const amount = parseAmount(formData.get("amount"));
  const categoryId = nullableId(formData.get("category_id"));
  const startMonth = parseMonthDate(formData.get("start_month"));
  if (!id || !title || !categoryId || !startMonth || amount <= 0) return;

  const { supabase } = await getUserId();
  const type = await resolveExpenseType({ supabase, categoryId, value: formData.get("type") });
  const { error } = await supabase
    .from("recurring_expenses")
    .update({
      type,
      title,
      amount,
      currency: "CAD",
      exchange_rate_to_cad: 1,
      category_id: categoryId,
      day_of_month: parseDayOfMonth(formData.get("day_of_month")),
      start_month: startMonth,
      end_month: parseMonthDate(formData.get("end_month")),
      memo: optionalString(formData.get("memo")),
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateExpenses({ settings: true });
}

export async function deleteRecurringExpense(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recurring_expenses").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateExpenses({ settings: true });
}

export async function toggleRecurringExpense(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const isActive = requiredString(formData.get("is_active")) === "true";
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recurring_expenses").update({ is_active: !isActive }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidateExpenses({ settings: true });
}

export async function setRecurringExpenseActive(id: string, isActive: boolean) {
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("recurring_expenses").update({ is_active: isActive }).eq("id", id);

  if (error) throw new Error(error.message);
  revalidateExpenses({ settings: true });
}

export async function updateExpense(formData: FormData) {
  const id = requiredString(formData.get("id"));
  const amount = parseAmount(formData.get("amount"));
  if (!id || amount <= 0) return;

  const { supabase } = await getUserId();
  const categoryId = nullableId(formData.get("category_id"));
  const type = await resolveExpenseType({ supabase, categoryId, value: formData.get("type") });
  const enteredByName = optionalString(formData.get("entered_by_name"));
  const { error } = await supabase
    .from("expenses")
    .update({
      type,
      amount,
      currency: "CAD",
      exchange_rate_to_cad: 1,
      category_id: categoryId,
      entered_by_name: enteredByName,
      memo: optionalString(formData.get("memo")),
      spent_at: requiredString(formData.get("spent_at")) || undefined,
    })
    .eq("id", id);

  if (error) throw new Error(error.message);
  revalidateExpenses();
}

export async function deleteExpense(formData: FormData) {
  const id = requiredString(formData.get("id"));
  if (!id) return;

  const { supabase } = await getUserId();
  const { error } = await supabase.from("expenses").delete().eq("id", id);

  if (error) throw new Error(error.message);
  revalidateExpenses();
}
