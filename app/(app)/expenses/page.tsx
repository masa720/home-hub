import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function ExpensesPage() {
  return (
    <>
      <PageHeader title="家計簿" />
      <EmptyState
        title="家計簿画面はPhase 2で実装します"
        description="expenses、expense_categories、payment_methodsテーブルと初期データはmigrationに含まれています。"
      />
    </>
  );
}
