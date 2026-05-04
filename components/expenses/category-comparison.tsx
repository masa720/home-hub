import { formatCurrency } from "@/lib/utils/currency";
import type { MonthlyStats } from "@/lib/db/expenses";

type CategoryComparisonProps = {
  stats: MonthlyStats[];
};

export function CategoryComparison({ stats }: CategoryComparisonProps) {
  const categoryMap = new Map<string, { name: string; color: string; months: Map<string, number> }>();

  for (const month of stats) {
    for (const cat of month.categoryTotals) {
      const existing = categoryMap.get(cat.name);
      if (existing) {
        existing.months.set(month.month, cat.amountCad);
      } else {
        categoryMap.set(cat.name, {
          name: cat.name,
          color: cat.color,
          months: new Map([[month.month, cat.amountCad]]),
        });
      }
    }
  }

  const categories = Array.from(categoryMap.values()).toSorted((a, b) => {
    const totalA = Array.from(a.months.values()).reduce((s, v) => s + v, 0);
    const totalB = Array.from(b.months.values()).reduce((s, v) => s + v, 0);
    return totalB - totalA;
  });

  if (categories.length === 0) {
    return null;
  }

  const minWidthStyle = stats.length > 12 ? { minWidth: `${stats.length * 3}rem` } : undefined;

  return (
    <section className="rounded-lg border bg-card">
      <h2 className="border-b px-4 py-3 text-sm font-bold text-white">カテゴリ別推移</h2>
      <div className="divide-y divide-border">
        {categories.map((category) => {
          const total = Array.from(category.months.values()).reduce((s, v) => s + v, 0);
          const maxInCategory = Math.max(...Array.from(category.months.values()), 1);
          return (
            <div key={category.name} className="px-4 py-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="size-3 shrink-0 rounded-full" style={{ backgroundColor: category.color }} />
                  <span className="text-sm font-semibold text-white">{category.name}</span>
                </div>
                <span className="text-sm font-bold tabular-nums text-muted-foreground">
                  {formatCurrency(total)}
                </span>
              </div>
              <div className="mt-2 overflow-x-auto">
                <div className="flex items-end gap-1.5" style={minWidthStyle}>
                  {stats.map((month, i) => {
                    const amount = category.months.get(month.month) ?? 0;
                    const ratio = maxInCategory > 0 ? amount / maxInCategory : 0;
                    const barHeight = Math.round(ratio * 40);
                    return (
                      <div key={month.month} className="flex flex-1 flex-col items-center gap-0.5">
                        <div className="relative w-full overflow-hidden rounded-sm bg-muted" style={{ height: 40 }}>
                          {barHeight > 0 ? (
                            <div
                              className="animate-bar absolute bottom-0 w-full rounded-sm"
                              style={{ backgroundColor: category.color, height: barHeight, animationDelay: `${i * 50}ms` }}
                            />
                          ) : null}
                        </div>
                        <span className="text-[9px] tabular-nums text-muted-foreground">{month.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
