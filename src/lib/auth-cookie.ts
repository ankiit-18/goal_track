import { NextResponse } from "next/server";
import { getCookieName, signToken } from "@/lib/jwt";

const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;

export async function attachAuthCookie(
  response: NextResponse,
  userId: string
) {
  const token = await signToken(userId);
  response.cookies.set(getCookieName(), token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: AUTH_COOKIE_MAX_AGE,
  });
  return response;
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set(getCookieName(), "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return response;
}
