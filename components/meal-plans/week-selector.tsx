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
    <div className="flex items-center justify-between rounded-2xl bg-card px-2 py-1.5 shadow-card">
      <Button asChild variant="ghost" size="icon" aria-label="Previous" className="size-9 min-h-9 min-w-9">
        <Link href={`/meal-plans?week=${previous}`}>
          <ChevronLeft className="size-5" aria-hidden />
        </Link>
      </Button>
      <div className="text-center">
        <p className="text-sm font-bold text-foreground">{formatJaDate(baseDate, "yyyy/M")}</p>
        <Button asChild variant="ghost" size="sm" className="mt-0.5 h-7 min-h-7 text-[10px] text-muted-foreground">
          <Link href="/meal-plans">This week</Link>
        </Button>
      </div>
      <Button asChild variant="ghost" size="icon" aria-label="Next" className="size-9 min-h-9 min-w-9">
        <Link href={`/meal-plans?week=${next}`}>
          <ChevronRight className="size-5" aria-hidden />
        </Link>
      </Button>
    </div>
  );
}
