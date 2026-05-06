"use client";

import { useRouter } from "next/navigation";
import { format } from "date-fns";

type MonthPickerProps = {
  selectedMonth: string; // "yyyy-MM"
  startMonth: string; // "yyyy-MM"
};

function generateMonthOptions(startMonth: string) {
  const [startY, startM] = startMonth.split("-").map(Number);
  const now = new Date();
  // Allow up to 1 year ahead
  const endY = now.getFullYear() + 1;
  const endM = now.getMonth() + 1;

  const options: { value: string; label: string }[] = [];
  let y = startY;
  let m = startM;

  while (y < endY || (y === endY && m <= endM)) {
    const value = `${y}-${String(m).padStart(2, "0")}`;
    options.push({ value, label: `${y}年${m}月` });
    m++;
    if (m > 12) {
      m = 1;
      y++;
    }
  }

  return options;
}

export function MonthPicker({ selectedMonth, startMonth }: MonthPickerProps) {
  const router = useRouter();
  const options = generateMonthOptions(startMonth);
  const currentMonth = format(new Date(), "yyyy-MM");

  return (
    <div className="min-w-0 text-center">
      <select
        value={selectedMonth}
        onChange={(e) => router.push(`/expenses?month=${e.target.value}`)}
        className="cursor-pointer appearance-none border-none bg-transparent text-center text-3xl font-bold tracking-normal text-white focus:outline-none"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
