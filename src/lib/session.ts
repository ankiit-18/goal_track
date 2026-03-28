import { cookies } from "next/headers";
import { getCookieName, verifyToken } from "./jwt";

export async function getSession(): Promise<{ userId: string } | null> {
  const token = (await cookies()).get(getCookieName())?.value;
  if (!token) return null;
  const payload = await verifyToken(token);
  if (!payload) return null;
  return { userId: payload.sub };
}
