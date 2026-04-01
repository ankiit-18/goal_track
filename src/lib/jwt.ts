import * as jose from "jose";

const COOKIE_NAME = "auth_token";

export function getCookieName() {
  return COOKIE_NAME;
}

function getSecret() {
  const s = process.env.JWT_SECRET;
  if (!s) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(s);
}

export async function signToken(userId: string): Promise<string> {
  return new jose.SignJWT({ sub: userId })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function signShortLivedToken(
  claims: Record<string, string>,
  expirationTime: string
): Promise<string> {
  return new jose.SignJWT(claims)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(getSecret());
}

export async function verifyToken(
  token: string
): Promise<{ sub: string } | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecret());
    const sub = payload.sub;
    if (typeof sub !== "string") return null;
    return { sub };
  } catch {
    return null;
  }
}

export async function verifyShortLivedToken(
  token: string
): Promise<Record<string, unknown> | null> {
  try {
    const { payload } = await jose.jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}
