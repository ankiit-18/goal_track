import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken, getCookieName } from "@/lib/jwt";

export async function middleware(request: NextRequest) {
  const token = request.cookies.get(getCookieName())?.value;
  const pathname = request.nextUrl.pathname;

  const isAuthPage =
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/verify-email";
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/goals") ||
    pathname.startsWith("/profile");

  let session: { sub: string } | null = null;
  if (token) {
    session = await verifyToken(token);
  }

  if (isProtected && !session) {
    const login = new URL("/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (isAuthPage && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard",
    "/dashboard/:path*",
    "/goals",
    "/goals/:path*",
    "/profile",
    "/profile/:path*",
    "/login",
    "/register",
    "/verify-email",
  ],
};
