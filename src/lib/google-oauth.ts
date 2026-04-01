import crypto from "node:crypto";
import { cookies } from "next/headers";
import { signShortLivedToken, verifyShortLivedToken } from "@/lib/jwt";

const GOOGLE_STATE_COOKIE = "google_oauth_state";

function getGoogleConfig() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be configured");
  }
  return { clientId, clientSecret };
}

export async function createGoogleAuthUrl(input: {
  origin: string;
  nextPath: string;
}) {
  const { clientId } = getGoogleConfig();
  const state = crypto.randomUUID();
  const cookieValue = await signShortLivedToken(
    { state, next: input.nextPath },
    "10m"
  );

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: `${input.origin}/api/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    prompt: "select_account",
    access_type: "online",
    state,
  });

  return {
    url: `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    cookieValue,
  };
}

export async function storeGoogleStateCookie(value: string) {
  const store = await cookies();
  store.set(GOOGLE_STATE_COOKIE, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 10,
  });
}

export async function consumeGoogleStateCookie() {
  const store = await cookies();
  const raw = store.get(GOOGLE_STATE_COOKIE)?.value;
  store.set(GOOGLE_STATE_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  if (!raw) return null;
  return verifyShortLivedToken(raw);
}

export async function exchangeGoogleCode(input: {
  origin: string;
  code: string;
}) {
  const { clientId, clientSecret } = getGoogleConfig();

  const response = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: clientId,
      client_secret: clientSecret,
      code: input.code,
      grant_type: "authorization_code",
      redirect_uri: `${input.origin}/api/auth/google/callback`,
    }),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Google token exchange failed: ${text}`);
  }

  const token = (await response.json()) as { access_token?: string };
  if (!token.access_token) {
    throw new Error("Google did not return an access token");
  }

  const profileResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: { Authorization: `Bearer ${token.access_token}` },
    }
  );

  if (!profileResponse.ok) {
    const text = await profileResponse.text();
    throw new Error(`Google profile fetch failed: ${text}`);
  }

  const profile = (await profileResponse.json()) as {
    sub?: string;
    email?: string;
    email_verified?: boolean;
    name?: string;
  };

  if (!profile.sub || !profile.email || !profile.email_verified) {
    throw new Error("Google account did not provide a verified email");
  }

  return {
    googleId: profile.sub,
    email: profile.email,
    name: profile.name ?? null,
  };
}
