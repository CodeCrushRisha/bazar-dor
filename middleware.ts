import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export function middleware(req: NextRequest) {
  const session = getSessionCookie(req);
  const { pathname } = req.nextUrl;

  if (
    (pathname.startsWith("/product/") || pathname.startsWith("/profile")) &&
    !session
  ) {
    const url = new URL("/signin", req.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/product/:path*", "/profile/:path*"],
};