/**
 * Cursor-style deep login URLs, e.g.
 * /login?challenge=...&uuid=...&mode=login
 *
 * After email/password success, these params are merged onto the `next` redirect
 * so your app or a client can correlate the session (challenge/uuid).
 */

const DEEP_KEYS = ["challenge", "uuid", "mode"] as const;

export function getDeepLoginParams(
  searchParams: URLSearchParams
): Partial<Record<(typeof DEEP_KEYS)[number], string>> {
  const out: Partial<Record<(typeof DEEP_KEYS)[number], string>> = {};
  for (const key of DEEP_KEYS) {
    const v = searchParams.get(key);
    if (v) out[key] = v;
  }
  return out;
}

export function hasDeepLoginParams(searchParams: URLSearchParams): boolean {
  return DEEP_KEYS.some((k) => searchParams.get(k));
}

/** Merge challenge / uuid / mode from the login page onto the post-auth path. */
export function mergeDeepParamsOntoNext(
  nextPath: string,
  fromLoginPage: URLSearchParams
): string {
  const deep = getDeepLoginParams(fromLoginPage);
  if (Object.keys(deep).length === 0) return nextPath;

  const [rawPath, rawQuery = ""] = nextPath.split("?");
  const path = rawPath || "/";
  const q = new URLSearchParams(rawQuery);
  for (const key of DEEP_KEYS) {
    const v = deep[key];
    if (v) q.set(key, v);
  }
  const s = q.toString();
  return s ? `${path}?${s}` : path;
}

/** Build /register?... preserving deep params for signup from the same flow. */
export function registerHrefWithDeepParams(
  fromLoginPage: URLSearchParams
): string {
  const deep = getDeepLoginParams(fromLoginPage);
  if (Object.keys(deep).length === 0) return "/register";
  const q = new URLSearchParams();
  for (const key of DEEP_KEYS) {
    const v = deep[key];
    if (v) q.set(key, v);
  }
  return `/register?${q.toString()}`;
}

/** Build /login?... preserving deep params (e.g. from register page). */
export function loginHrefWithDeepParams(fromPage: URLSearchParams): string {
  const deep = getDeepLoginParams(fromPage);
  if (Object.keys(deep).length === 0) return "/login";
  const q = new URLSearchParams();
  for (const key of DEEP_KEYS) {
    const v = deep[key];
    if (v) q.set(key, v);
  }
  return `/login?${q.toString()}`;
}
