import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatJaDate, shiftWeek, toDateInputValue } from "@/lib/utils/dates";

type WeekSelectorProps = {
  baseDate: Date;
};

export function WeekSelector({ baseDate }: WeekSelectorProps) {
  const previous = toDateInputValue(shiftWeek(baseDate, -1));
  const next = toDateInputValue(shiftWeek(baseDate, 1));

  return (
    <div className="flex items-center justify-between gap-2 rounded-lg border bg-card p-2">
      <Button asChild variant="ghost" size="icon" aria-label="前週">
        <Link href={`/meal-plans?week=${previous}`}>
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
      </Button>
      <div className="text-center">
        <p className="text-sm font-semibold text-white">{formatJaDate(baseDate, "yyyy年M月")}</p>
        <Button asChild variant="ghost" size="sm" className="mt-1 h-8 min-h-8 text-xs">
          <Link href="/meal-plans">今週に戻る</Link>
        </Button>
      </div>
      <Button asChild variant="ghost" size="icon" aria-label="次週">
        <Link href={`/meal-plans?week=${next}`}>
          <ChevronRight className="size-5" aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
