import Link from "next/link";
import { endOfMonth, format } from "date-fns";
import {
  Baby,
  BriefcaseBusiness,
  Bus,
  CircleDollarSign,
  Coffee,
  Gamepad2,
  GraduationCap,
  HeartPulse,
  Home,
  Plane,
  ReceiptText,
  Shield,
  Shirt,
  ShoppingBasket,
  Sparkles,
  Smartphone,
  Utensils,
  Users,
  Zap,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils/currency";
import { formatJaDate } from "@/lib/utils/dates";
import type { ExpenseSummaryData } from "@/lib/db/expenses";

type ExpenseSummaryProps = {
  summary: ExpenseSummaryData;
  selectedMonth: Date;
  previousHref: string | null;
  nextHref: string;
};

const categoryIcons = {
  食費: ShoppingBasket,
  外食費: Utensils,
  外食: Utensils,
  カフェ: Coffee,
  日用品: Sparkles,
  交通: Bus,
  ガソリン: Bus,
  家賃: Home,
  光熱費: Zap,
  通信費: Smartphone,
  サブスク: ReceiptText,
  医療費: HeartPulse,
  保険: Shield,
  美容: Sparkles,
  衣服: Shirt,
  子ども用品: Baby,
  教育: GraduationCap,
  交際費: Users,
  娯楽: Gamepad2,
  旅行: Plane,
  税金: ReceiptText,
  雑費: ReceiptText,
  給与: CircleDollarSign,
  副業: BriefcaseBusiness,
  その他: ReceiptText,
} as const;

function getCategoryIcon(name: string) {
  return categoryIcons[name as keyof typeof categoryIcons] ?? ReceiptText;
}

export function ExpenseSummary({ summary, selectedMonth, previousHref, nextHref }: ExpenseSummaryProps) {
  const pieSegments =
    summary.categoryTotals.length > 0
      ? summary.categoryTotals
          .reduce(
            (segments, category) => {
              const start = segments.current;
              const end = start + category.percent;
              return {
                current: end,
                values: [...segments.values, `${category.color} ${start}% ${end}%`],
              };
            },
            { current: 0, values: [] as string[] },
          )
          .values.join(", ")
      : "#64748b 0% 100%";
  const monthStart = formatJaDate(selectedMonth, "M月1日");
  const monthEnd = formatJaDate(endOfMonth(selectedMonth), "M月d日");

  return (
    <section className="overflow-hidden rounded-lg border bg-card">
      <div className="px-3 pb-3 pt-4">
        <div className="grid grid-cols-[2.75rem_1fr_2.75rem] items-center gap-2">
          {previousHref ? (
            <Link
              href={previousHref}
              className="inline-flex size-11 items-center justify-center rounded-lg bg-muted text-2xl font-semibold text-muted-foreground"
              aria-label="前月"
            >
              ‹
            </Link>
          ) : (
            <span className="inline-flex size-11 items-center justify-center rounded-lg bg-muted text-2xl font-semibold text-muted-foreground opacity-35">
              ‹
            </span>
          )}
          <div className="min-w-0 text-center">
            <p className="truncate text-3xl font-bold tracking-normal text-white">
              {formatJaDate(selectedMonth, "yyyy年M月")}
            </p>
            <p className="mt-0.5 text-sm font-semibold text-muted-foreground">
              {monthStart}〜{monthEnd}
            </p>
            {format(selectedMonth, "yyyy-MM") !== format(new Date(), "yyyy-MM") ? (
              <Link
                href="/expenses"
                className="mt-1 inline-flex rounded-full bg-muted px-3 py-1 text-xs font-bold text-muted-foreground hover:text-foreground"
              >
                今月に戻る
              </Link>
            ) : null}
          </div>
          <Link
            href={nextHref}
            className="inline-flex size-11 items-center justify-center rounded-lg bg-muted text-2xl font-semibold text-muted-foreground"
            aria-label="次月"
          >
            ›
          </Link>
        </div>

        <div className="mt-4 grid grid-cols-[1fr_auto_1fr_auto_1.2fr] items-end gap-2 text-center">
          <div>
            <p className="text-xs font-semibold text-muted-foreground">収入</p>
            <p className="mt-1 truncate text-xl font-medium text-muted-foreground">
              {formatCurrency(summary.incomeCadTotal)}
            </p>
          </div>
          <span className="pb-1 text-xl font-bold text-muted-foreground">-</span>
          <div>
            <p className="text-xs font-semibold text-muted-foreground">支出</p>
            <p className="mt-1 truncate text-xl font-medium text-muted-foreground">
              {formatCurrency(summary.expenseCadTotal)}
            </p>
          </div>
          <span className="pb-1 text-xl font-bold text-muted-foreground">=</span>
          <div>
            <p className="text-xs font-bold text-white">収支</p>
            <p className="mt-1 truncate text-2xl font-bold text-white">
              {formatCurrency(summary.netCadTotal)}
            </p>
          </div>
        </div>

      </div>

      <div className="border-t px-3 py-4">
        <p className="mb-3 text-center text-sm font-bold text-muted-foreground">支出内訳</p>
        <div className="relative mx-auto size-48 sm:size-56">
          <div
            className="absolute inset-0 rounded-full border shadow-sm"
            style={{
              background: `conic-gradient(${pieSegments})`,
              mask: "radial-gradient(circle, transparent 0 42%, black 43%)",
              WebkitMask: "radial-gradient(circle, transparent 0 42%, black 43%)",
            }}
            aria-label="カテゴリ別支出グラフ"
          />
          <div
            className="animate-pie-reveal absolute inset-0 rounded-full"
            style={{
              background: `conic-gradient(transparent 0deg, transparent calc(var(--pie-progress) * 360deg), hsl(var(--card)) calc(var(--pie-progress) * 360deg))`,
              mask: "radial-gradient(circle, transparent 0 42%, black 43%)",
              WebkitMask: "radial-gradient(circle, transparent 0 42%, black 43%)",
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-[11px] font-bold text-muted-foreground">支出</p>
              <p className="text-sm font-bold text-white">{formatCurrency(summary.expenseCadTotal)}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t">
        {summary.categoryTotals.length > 0 ? (
          summary.categoryTotals.map((category) => {
            const Icon = getCategoryIcon(category.name);
            return (
              <div
                key={category.id}
                className="grid grid-cols-[3.5rem_1fr_auto] items-center gap-2 border-b px-3 py-3 last:border-b-0"
              >
                <span
                  className="flex size-11 items-center justify-center rounded-full text-white"
                  style={{ backgroundColor: category.color }}
                >
                  <Icon className="size-5" aria-hidden />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-base font-semibold text-white">{category.name}</p>
                  <p className="mt-0.5 text-xs font-semibold text-muted-foreground">
                    {category.percent.toFixed(1)}%
                  </p>
                </div>
                <p className="text-right text-lg font-semibold text-white">
                  {formatCurrency(category.amountCad)}
                </p>
              </div>
            );
          })
        ) : (
          <p className="px-3 py-8 text-center text-sm font-semibold text-muted-foreground">支出なし</p>
        )}
      </div>
    </section>
  );
}
