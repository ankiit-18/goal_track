/** Parse JSON body; empty or invalid body returns null (avoids Response.json() throw). */
export async function readResponseJson<T>(res: Response): Promise<T | null> {
  const text = await res.text();
  if (!text.trim()) return null;
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}
