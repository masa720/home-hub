import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { AUTHENTICATED_USER_ID_HEADER } from "@/lib/auth/constants";
import type { Database } from "@/types/database";

type CookieToSet = {
  name: string;
  value: string;
  options: CookieOptions;
};

export async function updateSession(request: NextRequest) {
  const responseCookies: CookieToSet[] = [];

  const supabase = createServerClient<Database, "public", Database["public"]>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          responseCookies.push(...cookiesToSet);
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { pathname } = request.nextUrl;
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/auth");
  const isPublicAsset = pathname.startsWith("/_next") || pathname === "/favicon.ico";

  function withAuthCookies(response: NextResponse) {
    responseCookies.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
    return response;
  }

  if (!user && !isAuthRoute && !isPublicAsset) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("next", pathname);
    return withAuthCookies(NextResponse.redirect(redirectUrl));
  }

  if (user && pathname === "/login") {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/";
    return withAuthCookies(NextResponse.redirect(redirectUrl));
  }

  const requestHeaders = new Headers(request.headers);
  requestHeaders.delete(AUTHENTICATED_USER_ID_HEADER);
  if (user) requestHeaders.set(AUTHENTICATED_USER_ID_HEADER, user.id);

  return withAuthCookies(
    NextResponse.next({
      request: { headers: requestHeaders },
    }),
  );
}
