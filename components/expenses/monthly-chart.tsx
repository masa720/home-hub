import { formatCurrency } from "@/lib/utils/currency";
import type { MonthlyStats } from "@/lib/db/expenses";

type MonthlyChartProps = {
  stats: MonthlyStats[];
};

export function MonthlyChart({ stats }: MonthlyChartProps) {
  const maxExpense = Math.max(...stats.map((s) => s.expense), 1);

  return (
    <section className="rounded-lg border bg-card p-4">
      <h2 className="text-sm font-bold text-white">月別支出</h2>
      <div className="mt-4 overflow-x-auto">
        <div
          className="flex items-end gap-2"
          style={stats.length > 12 ? { minWidth: `${stats.length * 3}rem` } : undefined}
        >
          {stats.map((month, i) => {
            const ratio = maxExpense > 0 ? month.expense / maxExpense : 0;
            const barHeight = Math.round(ratio * 120);
            return (
              <div key={month.month} className="flex flex-1 flex-col items-center gap-1">
                {month.expense > 0 ? (
                  <span className="text-[10px] font-bold tabular-nums text-muted-foreground">
                    {formatCurrency(month.expense)}
                  </span>
                ) : (
                  <span className="text-[10px] text-muted-foreground/50">-</span>
                )}
                <div className="relative w-full overflow-hidden rounded-t bg-muted" style={{ height: 120 }}>
                  {barHeight > 0 ? (
                    <div
                      className="animate-bar absolute bottom-0 w-full rounded-t bg-primary"
                      style={{ height: barHeight, animationDelay: `${i * 50}ms` }}
                    />
                  ) : null}
                </div>
                <span className="whitespace-nowrap text-xs font-semibold text-muted-foreground">{month.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
