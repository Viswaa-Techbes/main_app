import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIE_KEY } from "@/core/auth/session";

export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_KEY)?.value;
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/dashboard") && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  if (pathname === "/login" && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/login", "/dashboard/:path*"],
};
