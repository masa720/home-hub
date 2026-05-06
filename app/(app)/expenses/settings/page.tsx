import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PageHeader } from "@/components/page-header";
import { RecurringExpenseSettings } from "@/components/expenses/recurring-expense-settings";
import { getRecurringExpenseSettingsData } from "@/lib/db/expenses";
import { createClient } from "@/lib/supabase/server";

export default async function ExpenseSettingsPage() {
  const supabase = await createClient();
  const { categories, recurringExpenses } = await getRecurringExpenseSettingsData(supabase);

  return (
    <>
      <PageHeader
        title="💰 家計簿 設定"
        action={
          <Link
            href="/expenses"
            className="inline-flex size-11 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground"
            aria-label="家計簿へ戻る"
          >
            <ChevronLeft className="size-5" aria-hidden />
          </Link>
        }
      />
      <RecurringExpenseSettings recurringExpenses={recurringExpenses} categories={categories} />
    </>
  );
}
