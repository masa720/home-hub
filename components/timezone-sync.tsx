"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const COOKIE_NAME = "tz-offset";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export function TimezoneSync() {
  const router = useRouter();
  useEffect(() => {
    const offset = -new Date().getTimezoneOffset();
    const current = document.cookie
      .split("; ")
      .find((c) => c.startsWith(`${COOKIE_NAME}=`))
      ?.split("=")[1];
    if (current !== String(offset)) {
      document.cookie = `${COOKIE_NAME}=${offset}; path=/; max-age=${COOKIE_MAX_AGE}; samesite=lax`;
      router.refresh();
    }
  }, [router]);
  return null;
}
