import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { AUTHENTICATED_USER_ID_HEADER } from "@/lib/auth/constants";
import { getProfile } from "@/lib/db/profiles";
import { createClient } from "@/lib/supabase/server";

export const getRequestAuth = cache(async () => {
  const supabase = await createClient();
  const requestHeaders = await headers();
  const trustedUserId = requestHeaders.get(AUTHENTICATED_USER_ID_HEADER);

  if (trustedUserId) {
    return { supabase, userId: trustedUserId };
  }

  // Fallback for execution contexts that do not pass through middleware.
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  return { supabase, userId: error ? null : user?.id ?? null };
});

export const requireRequestAuth = cache(async () => {
  const auth = await getRequestAuth();
  if (!auth.userId) throw new Error("ログインが必要です。");
  return { supabase: auth.supabase, userId: auth.userId };
});

export const getRequestProfile = cache(async () => {
  const { supabase, userId } = await requireRequestAuth();
  return getProfile(supabase, userId);
});
