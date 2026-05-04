import {
  addDays,
  addWeeks,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ja } from "date-fns/locale";

export const APP_START_MONTH = "2026-01";
export const APP_START_DATE = "2026-01-01";

export function toDateInputValue(date: Date) {
  return format(date, "yyyy-MM-dd");
}

export function formatJaDate(value: string | Date, pattern = "M月d日(E)") {
  const date = typeof value === "string" ? parseISO(value) : value;
  return format(date, pattern, { locale: ja });
}

export function getWeekDays(baseDate: Date) {
  const start = startOfWeek(baseDate, { weekStartsOn: 1 });
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getWeekRange(baseDate: Date) {
  return {
    start: startOfWeek(baseDate, { weekStartsOn: 1 }),
    end: endOfWeek(baseDate, { weekStartsOn: 1 }),
  };
}

export function getMonthRange(baseDate: Date) {
  return {
    start: startOfMonth(baseDate),
    end: endOfMonth(baseDate),
  };
}

export function shiftWeek(baseDate: Date, amount: number) {
  return addWeeks(baseDate, amount);
}

export function isToday(value: string | Date) {
  const date = typeof value === "string" ? parseISO(value) : value;
  return isSameDay(date, new Date());
}
