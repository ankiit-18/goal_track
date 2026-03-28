import { cookies } from "next/headers";
import { getCookieName, verifyToken } from "./jwt";

export async function getUserIdFromCookies(): Promise<string | null> {
  const token = (await cookies()).get(getCookieName())?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.sub ?? null;
}
