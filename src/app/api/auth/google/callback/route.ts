import { NextResponse } from "next/server";
import { attachAuthCookie } from "@/lib/auth-cookie";
import { sanitizeNextPath } from "@/lib/deep-login";
import { consumeGoogleStateCookie, exchangeGoogleCode } from "@/lib/google-oauth";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/auth-email";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const error = url.searchParams.get("error");

  if (error) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "google_cancelled");
    return NextResponse.redirect(loginUrl);
  }

  if (!code || !state) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "google_failed");
    return NextResponse.redirect(loginUrl);
  }

  const statePayload = await consumeGoogleStateCookie();
  if (
    !statePayload ||
    typeof statePayload.state !== "string" ||
    statePayload.state !== state
  ) {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "google_state_invalid");
    return NextResponse.redirect(loginUrl);
  }

  try {
    const profile = await exchangeGoogleCode({
      origin: url.origin,
      code,
    });

    const email = normalizeEmail(profile.email);
    const existing = await prisma.user.findUnique({ where: { email } });

    const user = existing
      ? await prisma.user.update({
          where: { id: existing.id },
          data: {
            googleId: existing.googleId ?? profile.googleId,
            emailVerifiedAt: existing.emailVerifiedAt ?? new Date(),
            name: existing.name ?? profile.name,
          },
        })
      : await prisma.user.create({
          data: {
            email,
            name: profile.name,
            googleId: profile.googleId,
            emailVerifiedAt: new Date(),
          },
        });

    const nextPath = sanitizeNextPath(
      typeof statePayload.next === "string" ? statePayload.next : "/dashboard"
    );
    const redirectUrl = new URL(nextPath, url.origin);
    const response = NextResponse.redirect(redirectUrl);
    return attachAuthCookie(response, user.id);
  } catch {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "google_failed");
    return NextResponse.redirect(loginUrl);
  }
}
