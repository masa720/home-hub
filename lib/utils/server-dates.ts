import "server-only";
import { cookies } from "next/headers";

const TZ_COOKIE_NAME = "tz-offset";

function createUtcDate(year: number, monthIndex: number, day: number) {
  return new Date(Date.UTC(year, monthIndex, day, 12));
}

export async function getUserToday(): Promise<Date> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(TZ_COOKIE_NAME)?.value;
  const offsetMinutes = raw === undefined ? NaN : Number(raw);
  const now = new Date();
  if (Number.isFinite(offsetMinutes)) {
    const local = new Date(now.getTime() + offsetMinutes * 60_000);
    return createUtcDate(local.getUTCFullYear(), local.getUTCMonth(), local.getUTCDate());
  }
  return createUtcDate(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
}
