import {
  format,
  isSameDay,
  parseISO,
} from "date-fns";
import { ja } from "date-fns/locale";

export const APP_START_MONTH = "2026-01";
export const APP_START_DATE = "2026-01-01";

function createUtcDate(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day, 12));
}

function addUtcDays(date: Date, amount: number) {
  return createUtcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate() + amount);
}

function toLocalDateOnly(date: Date) {
  return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), 12);
}

export function getCurrentUtcDate(date = new Date()) {
  return createUtcDate(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}

export function parseDateInputValue(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return createUtcDate(year, month - 1, day);
}

export function parseMonthInputValue(value: string) {
  return parseDateInputValue(`${value}-01`);
}

export function toDateInputValue(date: Date) {
  return [
    date.getUTCFullYear(),
    String(date.getUTCMonth() + 1).padStart(2, "0"),
    String(date.getUTCDate()).padStart(2, "0"),
  ].join("-");
}

export function formatJaDate(value: string | Date, pattern = "M月d日(E)") {
  const date = typeof value === "string" ? parseISO(value) : toLocalDateOnly(value);
  return format(date, pattern, { locale: ja });
}

export function getWeekDays(baseDate: Date) {
  const day = baseDate.getUTCDay();
  const mondayOffset = day === 0 ? -6 : 1 - day;
  const start = addUtcDays(baseDate, mondayOffset);
  return Array.from({ length: 7 }, (_, index) => addUtcDays(start, index));
}

export function getWeekRange(baseDate: Date) {
  const [start] = getWeekDays(baseDate);
  return {
    start,
    end: addUtcDays(start, 6),
  };
}

export function getMonthRange(baseDate: Date) {
  return {
    start: createUtcDate(baseDate.getUTCFullYear(), baseDate.getUTCMonth(), 1),
    end: createUtcDate(baseDate.getUTCFullYear(), baseDate.getUTCMonth() + 1, 0),
  };
}

export function shiftWeek(baseDate: Date, amount: number) {
  return addUtcDays(baseDate, amount * 7);
}

export function isToday(value: string | Date) {
  const date = typeof value === "string" ? parseDateInputValue(value) : value;
  return isSameDay(toLocalDateOnly(date), toLocalDateOnly(getCurrentUtcDate()));
}
