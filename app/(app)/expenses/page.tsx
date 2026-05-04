import { PageHeader } from "@/components/page-header";
import { EmptyState } from "@/components/empty-state";

export default function ExpensesPage() {
  return (
    <>
      <PageHeader title="Expenses" />
      <div className="rounded-2xl bg-card p-4 shadow-card">
        <EmptyState title="Coming in Phase 2" description="Database tables are ready." />
      </div>
    </>
  );
}
