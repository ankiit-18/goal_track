import { NextResponse } from "next/server";
import { sanitizeNextPath } from "@/lib/deep-login";
import { createGoogleAuthUrl, storeGoogleStateCookie } from "@/lib/google-oauth";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const nextPath = sanitizeNextPath(url.searchParams.get("next"));

  try {
    const auth = await createGoogleAuthUrl({
      origin: url.origin,
      nextPath,
    });
    await storeGoogleStateCookie(auth.cookieValue);
    return NextResponse.redirect(auth.url);
  } catch {
    const loginUrl = new URL("/login", url.origin);
    loginUrl.searchParams.set("error", "google_not_configured");
    return NextResponse.redirect(loginUrl);
  }
}
